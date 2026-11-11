import 'dart:convert';
import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/store_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  testWidgets('Checkout follows shared pickup settings and store details', (tester) async {
    final oldRepository = orderRepository;
    final oldSettings = currentStoreSettings;
    final oldFee = currentDeliveryFee;
    addTearDown(() { orderRepository = oldRepository; currentStoreSettings = oldSettings; currentDeliveryFee = oldFee; });
    final api = StoreApi(baseUrl: 'http://store.test/api', client: MockClient((request) async => http.Response(jsonEncode({
      'delivery_enabled': false, 'pickup_enabled': true, 'delivery_fee_centavos': 8500,
      'store_name': 'Actual Hardware', 'store_address': 'Main Street', 'store_hours': '8 AM–5 PM',
    }), 200, headers: {'content-type': 'application/json; charset=utf-8'})));
    orderRepository = ApiOrderRepository(api);
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 100,
      cartItems: [CartItem(const Product('Hammer', 100, Icons.handyman, 'Tools', id: 1), 1)], onOrderPlaced: () {})));
    await tester.runAsync(() async { await Future<void>.delayed(const Duration(milliseconds: 50)); });
    await tester.pumpAndSettle();
    final dropdown = tester.widget<DropdownButtonFormField<FulfillmentMethod>>(find.byType(DropdownButtonFormField<FulfillmentMethod>));
    expect(dropdown.initialValue, FulfillmentMethod.storePickup);
    expect(find.text('Actual Hardware'), findsOneWidget);
    expect(currentDeliveryFee, 85);
    await tester.pumpWidget(const SizedBox());
  });
}
