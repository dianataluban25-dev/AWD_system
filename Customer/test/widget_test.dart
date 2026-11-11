import 'catalog_fixture.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:elee_mobile/main.dart';

Future<void> start(WidgetTester tester) async {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
  products = List.of(defaultProducts);
  await tester.pumpWidget(const EleeApp(loadCatalog: false));
  await tester.pumpAndSettle();
}

Future<void> tapText(WidgetTester tester, String text) async {
  if (find.text(text).evaluate().isEmpty) {
    await tester.scrollUntilVisible(find.text(text), 200,
        scrollable: find.byType(Scrollable).first);
  }
  await tester.ensureVisible(find.text(text).first);
  await tester.tap(find.text(text).first);
  await tester.pumpAndSettle();
}

Future<void> addHammer(WidgetTester tester) async {
  await tapText(tester, 'Catalog');
  await tapText(tester, 'Claw Hammer');
  await tapText(tester, 'Add to Cart');
}

Future<void> openCart(WidgetTester tester) async {
  await tester.tap(find.byIcon(Icons.shopping_cart));
  await tester.pumpAndSettle();
}

void main() {
  setUp(() { useTestCatalog(); SharedPreferences.setMockInitialValues({}); });
  testWidgets('Customer presentation hides demo branding and staff simulator', (tester) async {
    await start(tester);
    expect(find.byType(Brand), findsOneWidget);
    expect(find.byTooltip('Saved receipts'), findsOneWidget);
    expect(find.textContaining('Demo'), findsNothing);
    expect(find.byIcon(Icons.science_outlined), findsNothing);
    await tester.tap(find.byTooltip('Saved receipts'));
    await tester.pumpAndSettle();
    expect(find.textContaining('Demo'), findsNothing);
    expect(find.textContaining('Receipts are saved on this device.'), findsOneWidget);
  });
  testWidgets('Stock limits repeated adds and cart quantities', (tester) async {
    await start(tester);
    products = [const Product('Limited Hammer', 70, Icons.handyman, 'Tools', stock: 3)];
    await tapText(tester, 'Catalog');
    await tapText(tester, 'Limited Hammer');
    await tester.ensureVisible(find.byType(QuantityControl));
    await tester.tap(find.byIcon(Icons.add_circle_outline));
    await tester.pumpAndSettle();
    await tapText(tester, 'Add to Cart');
    expect(tester.widget<QuantityControl>(find.byType(QuantityControl)).max, 1);
    expect(tester.widget<IconButton>(find.widgetWithIcon(IconButton, Icons.add_circle_outline)).onPressed, isNull);
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
    await tapText(tester, 'Add to Cart');
    expect(tester.widget<QuantityControl>(find.byType(QuantityControl)).max, 0);
    final addButton = find.ancestor(of: find.byType(AnimatedSwitcher), matching: find.byType(OutlinedButton));
    expect(tester.widget<OutlinedButton>(addButton).onPressed, isNull);
    await tester.tap(find.byTooltip('Open cart'));
    await tester.pumpAndSettle();
    expect(tester.widget<CartRow>(find.byType(CartRow)).item.quantity, 3);
    expect(tester.widget<IconButton>(find.widgetWithIcon(IconButton, Icons.add_circle_outline)).onPressed, isNull);
    await tester.tap(find.byIcon(Icons.remove_circle_outline));
    await tester.pumpAndSettle();
    expect(tester.widget<CartRow>(find.byType(CartRow)).item.quantity, 2);
    await tapText(tester, 'Catalog');
    await tapText(tester, 'Limited Hammer');
    expect(tester.widget<QuantityControl>(find.byType(QuantityControl)).max, 1);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Zero stock disables purchasing and quantity increase', (tester) async {
    await tester.pumpWidget(MaterialApp(home: ProductPage(
      product: const Product('Unavailable', 70, Icons.handyman, 'Tools', stock: 0),
      onAdd: (_, quantity) => fail('Out of stock cannot be added'),
      onBuyNow: (_) => fail('Out of stock cannot be purchased'),
      cartCount: () => 0, onOpenCart: () {},
    )));
    expect(find.text('Out of Stock'), findsOneWidget);
    expect(tester.widget<OutlinedButton>(find.widgetWithText(OutlinedButton, 'Add to Cart')).onPressed, isNull);
    expect(tester.widget<GreenButton>(find.widgetWithText(GreenButton, 'Buy Now')).onTap, isNull);
    await tester.scrollUntilVisible(find.byType(QuantityControl), 200);
    expect(tester.widget<IconButton>(find.widgetWithIcon(IconButton, Icons.add_circle_outline)).onPressed, isNull);
  });
  testWidgets('Catalog selects one category per tap and All resets it',
      (tester) async {
    await start(tester);
    await tapText(tester, 'Catalog');
    final filterScroll = find.descendant(
        of: find.byWidgetPredicate((widget) =>
            widget is ListView && widget.scrollDirection == Axis.horizontal),
        matching: find.byType(Scrollable));
    await tester.scrollUntilVisible(find.widgetWithText(ChoiceChip, 'Plumbing'),
        150, scrollable: filterScroll);
    await tester.tap(find.widgetWithText(ChoiceChip, 'Plumbing'));
    await tester.pumpAndSettle();
    expect(find.text('PVC Pipe (1/2”)'), findsOneWidget);
    expect(find.text('Claw Hammer'), findsNothing);
    await tester.scrollUntilVisible(find.widgetWithText(ChoiceChip, 'Tools'),
        -150, scrollable: filterScroll);
    await tester.tap(find.widgetWithText(ChoiceChip, 'Tools'));
    await tester.pumpAndSettle();
    expect(find.text('Claw Hammer'), findsOneWidget);
    expect(find.text('PVC Pipe (1/2”)'), findsNothing);
    expect(tester.widget<ChoiceChip>(find.widgetWithText(ChoiceChip, 'Plumbing')).selected, isFalse);
    expect(tester.widget<ChoiceChip>(find.widgetWithText(ChoiceChip, 'Tools')).selected, isTrue);
    await tester.tap(find.widgetWithText(ChoiceChip, 'Tools'));
    await tester.pumpAndSettle();
    expect(tester.widget<ChoiceChip>(find.widgetWithText(ChoiceChip, 'Tools')).selected, isTrue);
    tester.state<ScrollableState>(filterScroll).position.jumpTo(0);
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.widgetWithText(ChoiceChip, 'All'));
    await tester.tap(find.widgetWithText(ChoiceChip, 'All'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('Cement 40kg'), 150,
        scrollable: find.descendant(of: find.byType(CustomScrollView), matching: find.byType(Scrollable)).first);
    expect(find.text('Cement 40kg'), findsOneWidget);
  });
  testWidgets('Add feedback expires; deleting and adding again stays usable',
      (tester) async {
    await start(tester);
    await addHammer(tester);
    expect(find.text('Claw Hammer added'), findsOneWidget);
    expect(find.byType(SnackBar), findsNothing);
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
    expect(find.text('Claw Hammer added'), findsNothing);
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    await tester.tap(find.byTooltip('Delete items'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Remove this item'));
    await tester.pumpAndSettle();
    await tapText(tester, 'Remove');
    expect(find.text('Your cart is empty'), findsOneWidget);
    await tester.tap(find.byTooltip('Back to Home'));
    await tester.pumpAndSettle();
    await tapText(tester, 'Catalog');
    await tapText(tester, 'Screwdriver Set');
    await tapText(tester, 'Add to Cart');
    expect(find.text('Screwdriver Set added'), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    expect(find.byType(CartRow), findsOneWidget);
    expect(tester.widget<CartRow>(find.byType(CartRow)).item.product.name,
        'Screwdriver Set');
    expect(tester.takeException(), isNull);
  });
  for (final payment in ['Cash on Delivery (COD)', 'Cash at Store']) {
    testWidgets('$payment checkout clears cart and receipt back returns Home',
        (tester) async {
      await start(tester);
      await addHammer(tester);
      await tester.pageBack();
      await tester.pumpAndSettle();
      await openCart(tester);
      await tester.tap(find.byWidgetPredicate((widget) => widget is Checkbox && widget.semanticLabel == 'Select Claw Hammer'));
      await tester.pumpAndSettle();
      await tapText(tester, 'Checkout (1)');
      await tapText(tester, 'Continue');
      expect(find.byType(CheckoutPage), findsOneWidget);
      expect(find.text('My Cart'), findsNothing);
      await tester.enterText(find.byType(TextFormField).at(0), 'Test Customer');
      await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
      await tester.enterText(find.byType(TextFormField).at(2), '123');
      await tester.enterText(find.byType(TextFormField).at(3), 'Test Address');
      if (payment == 'Cash at Store') {
        await tapText(tester, 'Cash on Delivery (COD)');
        await tester.tap(find.text('Cash at Store').last);
        await tester.pumpAndSettle();
      }
      await tapText(tester, 'Place Order');
      await tapText(tester, 'Confirm');
      expect(find.text('Order Saved!'), findsOneWidget);
      final confirmation = tester.widget<ConfirmationPage>(find.byType(ConfirmationPage));
      expect(confirmation.paymentMethod.label, payment);
      expect(confirmation.orderNumber, startsWith('ELEE-'));
      expect(find.text('Unpaid'), findsOneWidget);
      await tapText(tester, 'View Digital Receipt');
      expect(find.text('Claw Hammer  ×1'), findsOneWidget);
      final receipt = tester.widget<ReceiptPage>(find.byType(ReceiptPage));
      expect(receipt.orderNumber, confirmation.orderNumber);
      expect(receipt.paymentMethod.label, payment);
      expect(receipt.total, 130);
      expect(receipt.fulfillmentMethod, FulfillmentMethod.delivery);
      await tester.scrollUntilVisible(find.text('Unpaid'), 200);
      expect(find.text(payment), findsOneWidget);
      expect(find.text('Unpaid'), findsOneWidget);
      await tester.pageBack();
      await tester.pumpAndSettle();
      expect(find.text('Hello, Shoppers!'), findsOneWidget);
      await openCart(tester);
      expect(find.text('Your cart is empty'), findsOneWidget);
      expect(find.byType(SnackBar), findsNothing);
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets('Checkout summary shows quantities, prices and correct totals', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(
      total: 560,
      cartItems: [CartItem(defaultProducts[0], 2), CartItem(defaultProducts[1], 2)],
      onOrderPlaced: () {},
    )));
    await tester.ensureVisible(find.byType(CheckoutSummary));
    await tester.pumpAndSettle();
    final summary = find.byType(CheckoutSummary);
    expect(find.descendant(of: summary, matching: find.text('Claw Hammer')), findsOneWidget);
    expect(find.descendant(of: summary, matching: find.text('Screwdriver Set')), findsOneWidget);
    expect(find.text('Qty: 2 × ₱70.00'), findsOneWidget);
    expect(find.text('Qty: 2 × ₱180.00'), findsOneWidget);
    for (final price in ['₱140.00', '₱360.00', '₱500.00', '₱60.00', '₱560.00']) {
      expect(find.descendant(of: summary, matching: find.text(price)), findsOneWidget);
    }
    expect(tester.takeException(), isNull);
  });

  testWidgets('Partial checkout retains unchecked items and selection persists', (tester) async {
    await start(tester);
    await addHammer(tester);
    await tester.pageBack();
    await tester.pumpAndSettle();
    await tapText(tester, 'Screwdriver Set');
    await tapText(tester, 'Add to Cart');
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    expect(tester.widget<GreenButton>(find.widgetWithText(GreenButton, 'Checkout (0)')).onTap, isNull);
    await tester.tap(find.byType(CheckboxListTile));
    await tester.pumpAndSettle();
    expect(find.text('Checkout (2)'), findsOneWidget);
    await tester.tap(find.byWidgetPredicate((widget) => widget is Checkbox && widget.semanticLabel == 'Select Screwdriver Set'));
    await tester.pumpAndSettle();
    await tapText(tester, 'Catalog');
    await openCart(tester);
    expect(find.text('Checkout (1)'), findsOneWidget);
    await tapText(tester, 'Checkout (1)');
    await tapText(tester, 'Continue');
    final checkout = tester.widget<CheckoutPage>(find.byType(CheckoutPage));
    expect(checkout.cartItems.map((item) => item.product.name), ['Claw Hammer']);
    expect(checkout.total, 130);
    await tester.enterText(find.byType(TextFormField).at(0), 'Test Customer');
    await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
    await tester.enterText(find.byType(TextFormField).at(2), '123');
      await tester.enterText(find.byType(TextFormField).at(3), 'Test Address');
    await tapText(tester, 'Place Order');
    await tapText(tester, 'Confirm');
    await tapText(tester, 'View Digital Receipt');
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    final remaining = tester.widget<CartRow>(find.byType(CartRow)).item;
    expect(remaining.product.name, 'Screwdriver Set');
    expect(remaining.quantity, 1);
    expect(remaining.selected, isFalse);
    expect(tester.takeException(), isNull);
  });
  testWidgets('Buy Now checks out only current product without changing cart', (tester) async {
    await start(tester);
    await addHammer(tester);
    await tester.pageBack();
    await tester.pumpAndSettle();
    await tapText(tester, 'Screwdriver Set');
    await tapText(tester, 'Buy Now');
    final checkout = tester.widget<CheckoutPage>(find.byType(CheckoutPage));
    expect(checkout.cartItems.single.product.name, 'Screwdriver Set');
    expect(checkout.total, 240);
    checkout.onOrderPlaced();
    await tester.pumpAndSettle();
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    expect(tester.widget<CartRow>(find.byType(CartRow)).item.product.name, 'Claw Hammer');
    expect(tester.takeException(), isNull);
  });

  testWidgets('House or unit number is required and included in the receipt', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(MaterialApp(home: CheckoutPage(
      total: 130,
      cartItems: [CartItem(defaultProducts[0], 1)],
      onOrderPlaced: () {},
    )));
    await tester.enterText(find.byType(TextFormField).at(0), 'Test Customer');
    await tester.enterText(find.byType(TextFormField).at(1), '09123456789');
    await tester.enterText(find.byType(TextFormField).at(2), '   ');
    await tester.enterText(find.byType(TextFormField).at(3), 'Mabini St, Barangay Uno, Manila');
    await tapText(tester, 'Place Order');
    expect(find.text('Please enter your House/Unit Number'), findsOneWidget);
    expect(find.text('Confirm your details?'), findsNothing);
    final houseField = find.widgetWithText(TextFormField, 'House/Unit Number');
    await tester.scrollUntilVisible(houseField, -200,
        scrollable: find.byType(Scrollable).first);
    await tester.enterText(houseField, 'Unit 4B');
    await tapText(tester, 'Place Order');
    await tapText(tester, 'Confirm');
    await tapText(tester, 'View Digital Receipt');
    final receipt = tester.widget<ReceiptPage>(find.byType(ReceiptPage));
    expect(receipt.customerAddress, 'Unit 4B, Mabini St, Barangay Uno, Manila');
    expect(tester.takeException(), isNull);
  });

  testWidgets('Cart badges count distinct items instead of quantities', (tester) async {
    await start(tester);
    await addHammer(tester);
    final shortcut = find.byTooltip('Open cart');
    expect(find.descendant(of: shortcut, matching: find.text('1')), findsOneWidget);
    await tester.tap(find.byIcon(Icons.add_circle_outline));
    await tester.pumpAndSettle();
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
    await tapText(tester, 'Add to Cart');
    expect(find.descendant(of: shortcut, matching: find.text('1')), findsOneWidget);
    expect(tester.widget<QuantityControl>(find.byType(QuantityControl)).value, 1);
    await tester.tap(shortcut);
    await tester.pumpAndSettle();
    expect(find.text('My Cart'), findsOneWidget);
    expect(tester.widget<CartRow>(find.byType(CartRow)).item.quantity, 3);
    expect(tester.widget<PrototypeBottomNav>(find.byType(PrototypeBottomNav)).cartCount, 1);
    await tapText(tester, 'Catalog');
    await tapText(tester, 'Screwdriver Set');
    await tapText(tester, 'Add to Cart');
    expect(find.descendant(of: shortcut, matching: find.text('2')), findsOneWidget);
    await tester.tap(shortcut);
    await tester.pumpAndSettle();
    expect(find.byType(CartRow), findsNWidgets(2));
    expect(tester.widget<PrototypeBottomNav>(find.byType(PrototypeBottomNav)).cartCount, 2);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Categories show scoped products and Featured opens product details', (tester) async {
    await start(tester);
    final categoryHeader = find.widgetWithText(Header, 'Categories');
    final categoryLink = find.descendant(of: categoryHeader, matching: find.text('View all'));
    await tester.ensureVisible(categoryLink);
    await tester.tap(categoryLink);
    await tester.pumpAndSettle();
    expect(find.byType(CategoriesPage), findsOneWidget);
    expect(find.byType(ProductCard), findsNothing);
    await tapText(tester, 'Plumbing');
    expect(find.byType(CategoryProductsPage), findsOneWidget);
    expect(find.byType(CatalogPage), findsNothing);
    expect(find.byType(ChoiceChip), findsNothing);
    expect(find.text('PVC Pipe (1/2”)'), findsOneWidget);
    expect(find.text('Claw Hammer'), findsNothing);
    await tester.tap(find.byTooltip('Back to Categories'));
    await tester.pumpAndSettle();
    expect(find.byType(CategoriesPage), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.descendant(of: find.widgetWithText(Header, 'Featured Products'),
      matching: find.text('View all')), findsNothing);
    await tapText(tester, 'Claw Hammer');
    expect(find.byType(ProductPage), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Home search opens focused search, filters, clears and preserves results on Back', (tester) async {
    await start(tester);
    await tester.tap(find.byType(SearchField));
    await tester.pumpAndSettle();
    expect(find.byType(ProductSearchPage), findsOneWidget);
    expect(find.byType(CatalogPage), findsNothing);
    expect(find.byType(ProductCard), findsNothing);
    expect(tester.testTextInput.isVisible, isTrue);
    await tester.enterText(find.byType(TextField), '  hAMMer ');
    await tester.pumpAndSettle();
    expect(find.text('Claw Hammer'), findsOneWidget);
    expect(find.text('Screwdriver Set'), findsNothing);
    await tapText(tester, 'Claw Hammer');
    expect(find.byType(ProductPage), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.byType(ProductSearchPage), findsOneWidget);
    expect(find.text('Claw Hammer'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'no-such-product');
    await tester.pumpAndSettle();
    expect(find.text('No matching products. Try another product name.'), findsOneWidget);
    await tester.tap(find.byTooltip('Clear search'));
    await tester.pumpAndSettle();
    expect(find.byType(ProductCard), findsNothing);
    expect(find.textContaining('What are you looking for?'), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.byType(HomePage), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Shop Now browses the catalog; category tiles open only their category', (tester) async {
    await start(tester);
    await tester.ensureVisible(find.byType(ShopNowButton));
    await tester.tap(find.byType(ShopNowButton));
    await tester.pumpAndSettle();
    expect(find.byType(CatalogPage), findsOneWidget);
    expect(tester.widget<ChoiceChip>(find.widgetWithText(ChoiceChip, 'All')).selected, isTrue);
    await tapText(tester, 'Home');
    final tools = find.widgetWithText(Category, 'Tools');
    await tester.scrollUntilVisible(tools, 120,
        scrollable: find.descendant(of: find.byType(HomePage),
            matching: find.byWidgetPredicate((widget) =>
                widget is Scrollable && widget.axisDirection == AxisDirection.right)).last);
    await tester.ensureVisible(tools);
    await tester.pumpAndSettle();
    await tester.tap(tools);
    await tester.pumpAndSettle();
    expect(find.byType(CategoryProductsPage), findsOneWidget);
    expect(find.text('2 products in Tools'), findsOneWidget);
    expect(find.text('Claw Hammer'), findsOneWidget);
    expect(find.text('PVC Pipe (1/2”)'), findsNothing);
    await tester.tap(find.byTooltip('Back to Categories'));
    await tester.pumpAndSettle();
    expect(find.byType(CategoriesPage), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
  testWidgets('Cancelling checkout preserves cart', (tester) async {
    await start(tester);
    await tapText(tester, 'Catalog');
    await tapText(tester, 'Claw Hammer');
    await tapText(tester, 'Add to Cart');
    await tester.pageBack();
    await tester.pumpAndSettle();
    await openCart(tester);
    await tester.tap(find.byWidgetPredicate((widget) => widget is Checkbox && widget.semanticLabel == 'Select Claw Hammer'));
    await tester.pumpAndSettle();
    await tapText(tester, 'Checkout (1)');
    await tapText(tester, 'Continue');
    expect(find.byType(CheckoutPage), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.byType(CartRow), findsOneWidget);
  });
}


