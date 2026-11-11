import 'catalog_fixture.dart';
import 'dart:async';
import 'dart:convert';
import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/store_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StalledOrders implements OrderRepository {
  @override
  Future<Map<String, dynamic>> get(String number) => Completer<Map<String, dynamic>>().future;
  @override
  Future<void> save(Map<String, dynamic> order) async {}
  @override
  Future<List<Map<String, dynamic>>> list() async => [];
}

void main() {
  setUp(() {
    useTestCatalog();
    SharedPreferences.setMockInitialValues({});
    orderRepository = LocalOrderRepository();
  });
  tearDown(() => orderRepository = LocalOrderRepository());

  testWidgets('Live checkout displays server total and identifier, never a local receipt', (tester) async {
    orderRepository = ApiOrderRepository(StoreApi(baseUrl: 'https://store.test/api', client: MockClient((request) async {
      final body = jsonDecode(request.body) as Map<String, dynamic>;
      return http.Response(jsonEncode({'access_token': 'receipt-secret', 'data': {
        ...body, 'order_number': 'ELEE-SERVER-123', 'created_at': '2026-10-13T00:00:00Z',
        'total': 130.5, 'delivery_fee': 60, 'payment_status': 'Unpaid', 'order_status': 'Pending',
        'items': [{'product_id': 1, 'name': 'Hammer', 'unit': 'piece', 'quantity': 1, 'price': 70.5}],
      }}), 201);
    })));
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 130,
      cartItems: [CartItem(const Product('Hammer', 70.5, Icons.handyman, 'Tools', id: 1), 1)],
      onOrderPlaced: () {})));
    for (final entry in ['Customer', '09123456789', 'Unit 1', 'Manila'].asMap().entries) {
      await tester.enterText(find.byType(TextFormField).at(entry.key), entry.value);
    }
    await tester.scrollUntilVisible(find.text('Place Order'), 200, scrollable: find.byType(Scrollable).first);
    await tester.tap(find.text('Place Order'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Confirm'));
    await tester.pumpAndSettle();
    final confirmation = tester.widget<ConfirmationPage>(find.byType(ConfirmationPage));
    expect(confirmation.orderNumber, 'ELEE-SERVER-123');
    expect(confirmation.total, 130.5);
    expect(confirmation.cartItems.single.product.price, 70.5);
    expect(find.text('Your order has been sent to the store.'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Receipt status and export recover from a stalled read', (tester) async {
    orderRepository = StalledOrders();
    await tester.pumpWidget(const MaterialApp(home: ReceiptPage(total: 0,
      cartItems: [], customerName: '', customerMobile: '', customerAddress: '', orderNumber: 'STALLED')));
    await tester.pump(const Duration(seconds: 11));
    await tester.pumpAndSettle();
    expect(find.text('Could not refresh payment status. Please try again.'), findsOneWidget);
    await tester.tap(find.text('Download Order Summary (PDF)'));
    await tester.pump();
    await tester.pump(const Duration(seconds: 11));
    await tester.pumpAndSettle();
    expect(find.text('Preparing PDF...'), findsNothing);
    expect(tester.widget<FilledButton>(find.byWidgetPredicate((w) => w is FilledButton)).onPressed, isNotNull);
  });

  for (final size in [const Size(320, 568), const Size(568, 320)]) {
    testWidgets('Checkout stays scrollable with keyboard at $size', (tester) async {
      tester.view.physicalSize = size;
      tester.view.devicePixelRatio = 1;
      tester.view.viewInsets = const FakeViewPadding(bottom: 200);
      addTearDown(tester.view.reset);
      await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 130,
        cartItems: [CartItem(defaultProducts.first, 1)], onOrderPlaced: () {})));
      await tester.ensureVisible(find.byType(TextFormField).first);
      await tester.pumpAndSettle();
      await tester.tap(find.byType(TextFormField).first);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await tester.ensureVisible(find.text('Place Order'));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    });
  }
}

