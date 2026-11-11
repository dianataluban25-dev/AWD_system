import 'dart:async';
import 'dart:convert';
import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/store_api.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> checkout() => {
  'order_number': 'local-id', 'created_at': '2026-10-13T00:00:00Z',
  'customer_name': 'Customer', 'mobile_number': '09123456789',
  'address': 'Manila', 'fulfillment_method': 'delivery',
  'payment_method': 'cash_on_delivery', 'total': 1,
  'items': [{'id': 1, 'quantity': 2, 'name': 'Hammer', 'price': 70.5}],
};
Map<String, dynamic> accepted() => {
  ...checkout(), 'order_number': 'ELEE-SERVER', 'total': 201,
  'payment_status': 'Unpaid', 'order_status': 'Pending', 'paid_at': null,
};
void main() {
  setUp(() => SharedPreferences.setMockInitialValues({}));
  test('Catalog uses Laravel pagination and preserves centavos', () async {
    final api = ApiService(api: StoreApi(baseUrl: 'https://store.test/api/',
      client: MockClient((request) async {
        expect(request.url.path, '/api/products');
        final page = request.url.queryParameters['page'];
        return http.Response(jsonEncode({
          'data': [{'id': int.parse(page!), 'name': 'Hammer', 'price': 70.5, 'stock': 5}],
          'links': {'next': page == '1' ? 'https://store.test/api/products?page=2' : null},
        }), 200);
      })));
    final products = await api.fetchProducts();
    expect(products.length, 2);
    expect(products.first.price, 70.5);
  });
  test('Checkout stores server identifiers and refresh uses private receipt token', () async {
    final repo = ApiOrderRepository(StoreApi(baseUrl: 'https://store.test/api',
      client: MockClient((request) async {
        if (request.method == 'POST') {
          expect(request.url.path, '/api/orders');
          expect(request.headers['Idempotency-Key']?.length, 48);
          final payload = jsonDecode(request.body) as Map;
          expect(payload.containsKey('total'), isFalse);
          expect(payload['items'], [{'product_id': 1, 'quantity': 2}]);
          return http.Response(jsonEncode({'data': accepted(), 'access_token': 'private-token'}), 201);
        }
        expect(request.url.path, '/api/orders/ELEE-SERVER');
        expect(request.headers['Authorization'], 'Bearer private-token');
        return http.Response(jsonEncode({'data': {...accepted(), 'payment_status': 'Paid',
          'paid_at': '2026-10-13T01:00:00Z'}}), 200);
      })));
    final order = checkout();
    await repo.save(order);
    expect(order['order_number'], 'ELEE-SERVER');
    expect(order['total'], 201);
    expect(order['source'], 'store');
    expect((await repo.list()).single['order_number'], 'ELEE-SERVER');
    expect((await repo.get('ELEE-SERVER'))['payment_status'], 'Paid');
    expect((await repo.list()).single.containsKey('token'), isFalse);
  });
  test('Ambiguous checkout keeps its key across restart and prevents a changed order', () async {
    String? key;
    var fail = true;
    final api = StoreApi(baseUrl: 'https://store.test/api', client: MockClient((request) async {
      if (request.method == 'GET') {
        expect(request.headers['Authorization'], 'Bearer private-token');
        return http.Response(jsonEncode({'data': accepted()}), 200);
      }
      if (fail) {
        key = request.headers['Idempotency-Key'];
        throw TimeoutException('network');
      }
      expect(request.headers['Idempotency-Key'], key);
      return http.Response(jsonEncode({'data': accepted(), 'access_token': 'private-token'}), 200);
    }));
    await expectLater(ApiOrderRepository(api).save(checkout()), throwsA(isA<TimeoutException>()));
    final restarted = ApiOrderRepository(api);
    await expectLater(restarted.save({...checkout(), 'address': 'Changed'}), throwsA(isA<StoreApiException>()));
    fail = false;
    await restarted.resumePending();
    expect(await restarted.pending(), isNull);
    expect((await restarted.list()).length, 1);
  });
  test('Rejected stock validation permits a corrected checkout', () async {
    final repo = ApiOrderRepository(StoreApi(baseUrl: 'https://store.test/api',
      client: MockClient((_) async => http.Response(jsonEncode({
        'errors': {'items.0.quantity': ['Insufficient stock.']},
      }), 422))));
    await expectLater(repo.save(checkout()), throwsA(isA<StoreApiException>()));
    expect(await repo.pending(), isNull);
  });
}
