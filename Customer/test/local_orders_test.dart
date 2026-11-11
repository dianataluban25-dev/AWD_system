import 'catalog_fixture.dart';
import 'dart:async';

import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> sample(String method) => {
  'order_number': 'DEMO-1', 'created_at': '2026-09-23T00:00:00Z',
  'customer_name': 'Customer', 'mobile_number': '09123456789',
  'address': 'Unit 1, Manila', 'payment_method': method,
  'payment_status': 'Unpaid', 'order_status': 'Pending', 'paid_at': null,
  'total': 140, 'items': [
    {'id': 1, 'name': 'Claw Hammer', 'price': 70, 'quantity': 2, 'category': 'Tools'},
  ],
};

class FailingRepository implements OrderRepository {
  @override
  Future<void> save(Map<String, dynamic> order) async => throw StateError('offline');
  @override
  Future<Map<String, dynamic>> get(String number) async => throw StateError('offline');
  @override
  Future<List<Map<String, dynamic>>> list() async => throw StateError('offline');
}

class DelayedRepository extends LocalOrderRepository {
  final ready = Completer<void>();

  @override
  Future<void> save(Map<String, dynamic> order) async {
    await ready.future;
    await super.save(order);
  }
}

void main() {
  setUp(() {
    useTestCatalog();
    SharedPreferences.setMockInitialValues({});
    orderRepository = LocalOrderRepository();
  });
  tearDown(() => orderRepository = LocalOrderRepository());

  for (final method in ['cash_at_store', 'cash_on_delivery']) {
    test('$method persists snapshots and simulated payment across repository instances', () async {
      await orderRepository.save(sample(method));
      final restarted = LocalOrderRepository();
      expect((await restarted.list()).single['items'], sample(method)['items']);
      expect((await restarted.get('DEMO-1'))['payment_status'], 'Unpaid');
      await restarted.simulatePayment('DEMO-1');
      final paid = await LocalOrderRepository().get('DEMO-1');
      expect(paid['payment_status'], 'Paid');
      expect(paid['paid_at'], isNotNull);
      expect(paid['order_status'], method == 'cash_at_store' ? 'Pending' : 'Completed');
      await restarted.simulatePayment('DEMO-1');
      expect((await restarted.get('DEMO-1'))['paid_at'], paid['paid_at']);
      await expectLater(restarted.save(sample(method)), throwsStateError);
    });
  }

  testWidgets('Saved receipt reopens, refreshes Paid and retains status on refresh failure', (tester) async {
    await orderRepository.save(sample('cash_at_store'));
    await tester.pumpWidget(const MaterialApp(home: SavedOrdersPage()));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Open receipt'));
    await tester.pumpAndSettle();
    expect(find.text('Simulate cash received'), findsNothing);
    await (orderRepository as LocalOrderRepository).simulatePayment('DEMO-1');
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('Paid'), 150);
    expect(find.text('Paid'), findsOneWidget);
    orderRepository = FailingRepository();
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('Retry'), -150);
    expect(find.text('Could not refresh payment status. Please try again.'), findsOneWidget);
    await tester.scrollUntilVisible(find.text('Paid'), 150);
    expect(find.text('Paid'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Receipt actions remain usable after the initial status read fails', (tester) async {
    orderRepository = FailingRepository();
    await tester.pumpWidget(MaterialApp(home: ReceiptPage(
      total: 140, cartItems: [CartItem(defaultProducts.first, 2)],
      customerName: 'Customer', customerMobile: '', customerAddress: '',
      orderNumber: 'DEMO-1')));
    await tester.pumpAndSettle();
    final downloadButton = find.byWidgetPredicate((widget) => widget is FilledButton);
    expect(tester.widget<FilledButton>(downloadButton).onPressed, isNotNull);
    await tester.tap(find.text('Download Order Summary (PDF)'));
    await tester.pumpAndSettle();
    expect(find.text('Could not download receipt. Check your connection and try again.'), findsOneWidget);
    expect(tester.widget<FilledButton>(downloadButton).onPressed, isNotNull);
    orderRepository = LocalOrderRepository();
    await orderRepository.save(sample('cash_at_store'));
    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();

    expect(find.text('Could not refresh payment status. Please try again.'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Failed save leaves checkout and does not clear cart', (tester) async {
    orderRepository = FailingRepository();
    var cleared = false;
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 130,
      cartItems: [CartItem(defaultProducts.first, 1)], onOrderPlaced: () => cleared = true)));
    await tester.enterText(find.byType(TextFormField).at(0), 'Customer');
    await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
    await tester.enterText(find.byType(TextFormField).at(2), 'Unit 1');
    await tester.enterText(find.byType(TextFormField).at(3), 'Manila');
    await tester.scrollUntilVisible(find.text('Place Order'), 200, scrollable: find.byType(Scrollable).first);
    await tester.tap(find.text('Place Order'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Confirm'));
    await tester.pumpAndSettle();
    expect(cleared, isFalse);
    expect(find.byType(CheckoutPage), findsOneWidget);
    expect(find.text('Could not save order. Your cart is unchanged. Please try again.'), findsOneWidget);
  });
  testWidgets('Saving locks checkout and confirmation keeps its item snapshot', (tester) async {
    final repository = DelayedRepository();
    orderRepository = repository;
    final items = [CartItem(defaultProducts.first, 2)];
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 200,
      cartItems: items, onOrderPlaced: items.clear)));
    await tester.enterText(find.byType(TextFormField).at(0), 'Customer');
    await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
    await tester.enterText(find.byType(TextFormField).at(2), 'Unit 1');
    await tester.enterText(find.byType(TextFormField).at(3), 'Manila');
    await tester.scrollUntilVisible(find.text('Place Order'), 200,
        scrollable: find.byType(Scrollable).first);
    await tester.tap(find.text('Place Order'));
    await tester.pumpAndSettle();
    expect(find.text('Name: Customer'), findsOneWidget);
    expect(find.text('Address: Unit 1, Manila'), findsOneWidget);
    expect(find.textContaining('It will not be submitted to the store.'), findsOneWidget);
    await tester.tap(find.text('Confirm'));
    await tester.pumpAndSettle();
    expect(find.text('Saving order...'), findsOneWidget);
    for (final field in tester.widgetList<TextFormField>(find.byType(TextFormField))) {
      expect(field.enabled, isFalse);
    }
    expect(tester.widget<PopScope>(find.byType(PopScope).first).canPop, isFalse);
    repository.ready.complete();
    await tester.pumpAndSettle();
    expect(items, isEmpty);
    final confirmation = tester.widget<ConfirmationPage>(find.byType(ConfirmationPage));
    expect(confirmation.total, 200);
    expect(confirmation.cartItems.single.quantity, 2);
    expect(find.text('Continue Shopping'), findsOneWidget);
    final order = (await repository.list()).single;
    expect(order['total'], confirmation.total);
    expect(tester.takeException(), isNull);
  });
  testWidgets('Staff simulation is gated and updates only the chosen local order', (tester) async {
    await orderRepository.save(sample('cash_on_delivery'));
    await tester.pumpWidget(const MaterialApp(home: SavedOrdersPage(simulator: true)));
    await tester.pumpAndSettle();
    if (!const bool.fromEnvironment('DEMO_STAFF_TOOLS')) {
      expect(find.text('Simulate cash received'), findsNothing);
      return;
    }
    await tester.tap(find.text('Simulate cash received'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Simulate'));
    await tester.pumpAndSettle();
    expect(find.text('Paid • Completed'), findsOneWidget);
    expect(find.text('Simulate cash received'), findsNothing);
  });

}


