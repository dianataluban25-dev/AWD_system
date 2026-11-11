import 'catalog_fixture.dart';
import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    useTestCatalog();
    SharedPreferences.setMockInitialValues({});
    orderRepository = LocalOrderRepository();
  });
  for (final pickup in [true, false]) {
    for (final cashAtStore in [true, false]) {
      if (pickup && !cashAtStore) continue;
      testWidgets('Checkout pickup=$pickup storeCash=$cashAtStore persists fee and fulfillment', (tester) async {
        tester.view.physicalSize = const Size(390, 844);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        Future<void> reveal(Finder finder, [double delta = 180]) async {
          await tester.scrollUntilVisible(finder, delta, scrollable: find.byType(Scrollable).first);
          await tester.pumpAndSettle();
        }
        await tester.pumpWidget(MaterialApp(home: CheckoutPage(total: 130,
          cartItems: [CartItem(defaultProducts.first, 1)], onOrderPlaced: () {})));
        if (!pickup) {
          await tester.enterText(find.byType(TextFormField).at(0), 'Customer');
        }
        if (!pickup) {
          await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
        }
        if (!pickup) {
          await tester.enterText(find.byType(TextFormField).at(2), 'Unit 2');
          await tester.enterText(find.byType(TextFormField).at(3), 'Manila');
        }
        final fulfillment = find.byType(DropdownButtonFormField<FulfillmentMethod>);
        await reveal(fulfillment);
        if (pickup) {
          await tester.tap(fulfillment);
          await tester.pumpAndSettle();
          await tester.tap(find.text('Store Pickup').last);
          await tester.pumpAndSettle();
        }
        final payment = find.byType(DropdownButtonFormField<PaymentMethod>);
        await reveal(payment);
        final dropdown = tester.widget<DropdownButtonFormField<PaymentMethod>>(payment);
        if (pickup) {
          expect(dropdown.initialValue, PaymentMethod.cashAtStore);
          expect(find.text('Mobile Number (Optional)'), findsOneWidget);
          expect(find.text('Full Name (Optional)'), findsOneWidget);
          await tester.tap(payment);
          await tester.pumpAndSettle();
          expect(find.text('Cash on Delivery (COD)'), findsNothing);
          await tester.tap(find.text('Cash at Store').last);
          await tester.pumpAndSettle();
        } else if (cashAtStore) {
          await tester.tap(payment);
          await tester.pumpAndSettle();
          await tester.tap(find.text('Cash at Store').last);
          await tester.pumpAndSettle();
        }
        await reveal(find.text('Place Order'));
        expect(tester.widget<CheckoutSummary>(find.byType(CheckoutSummary)).total, pickup ? 70 : 130);
        await tester.tap(find.text('Place Order'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('Confirm'));
        await tester.pumpAndSettle();
        final stored = (await LocalOrderRepository().list()).single;
        expect(stored['fulfillment_method'], pickup ? 'store_pickup' : 'delivery');
        expect(stored['delivery_fee'], pickup ? 0 : 60);
        expect(stored['total'], pickup ? 70 : 130);
        expect(stored['address'], pickup ? '' : 'Unit 2, Manila');
        expect(stored['mobile_number'], pickup ? '' : '09123456789');
        expect(stored['customer_name'], pickup ? '' : 'Customer');
        expect(stored['payment_method'], cashAtStore ? 'cash_at_store' : 'cash_on_delivery');
        await (orderRepository as LocalOrderRepository).simulatePayment(stored['order_number'] as String);
        final paid = await orderRepository.get(stored['order_number'] as String);
        expect(paid['order_status'], cashAtStore ? 'Pending' : 'Completed');
        await tester.pumpWidget(const SizedBox());
        await tester.pumpWidget(const MaterialApp(home: SavedOrdersPage()));
        await tester.pumpAndSettle();
        await tester.tap(find.text('Open receipt'));
        await tester.pumpAndSettle();
        final receipt = tester.widget<ReceiptPage>(find.byType(ReceiptPage));
        expect(receipt.fulfillmentMethod, pickup ? FulfillmentMethod.storePickup : FulfillmentMethod.delivery);
        expect(receipt.total, pickup ? 70 : 130);
        expect(tester.takeException(), isNull);
      });
    }
  }

  test('Repository rejects pickup with COD', () async {
    await expectLater(orderRepository.save({
      'fulfillment_method': 'store_pickup', 'payment_method': 'cash_on_delivery',
    }), throwsArgumentError);
  });
  testWidgets('Mobile validation follows pickup/delivery and validates supplied numbers', (tester) async {
    final form = GlobalKey<FormState>();
    final mobile = TextEditingController();
    addTearDown(mobile.dispose);
    Future<void> showField(bool optional) async {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: Form(
        key: form, child: CheckoutField(label: 'Mobile Number', controller: mobile,
            hint: '', optional: optional)))));
    }
    await showField(true);
    expect(form.currentState!.validate(), isTrue);
    mobile.text = '123';
    expect(form.currentState!.validate(), isFalse);
    mobile.text = '09123456789';
    expect(form.currentState!.validate(), isTrue);
    mobile.clear();
    await showField(false);
    expect(form.currentState!.validate(), isFalse);
    mobile.text = '09123456789';
    expect(form.currentState!.validate(), isTrue);
  });

}

