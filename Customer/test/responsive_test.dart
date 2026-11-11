import 'catalog_fixture.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:elee_mobile/main.dart';

void main() {
  setUp(() { useTestCatalog(); SharedPreferences.setMockInitialValues({}); });
  for (final platform in [TargetPlatform.android, TargetPlatform.iOS]) {
    for (final size in [const Size(280,653), const Size(320,568), const Size(360,640), const Size(390,844), const Size(412,915), const Size(568,320), const Size(844,390), const Size(768,1024), const Size(1024,768), const Size(1366,1024)]) {
      for (final scale in [1.0, 1.5, 2.0]) {
        testWidgets('$platform $size text $scale', (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1;
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          final items = [CartItem(defaultProducts[0], 2), CartItem(defaultProducts[1], 1)];
          final screens = <String, Widget>{
            'home': Scaffold(body: SafeArea(child: HomePage(onProduct: (_) {}, onProducts: () {}, onCategory: (_) {})), bottomNavigationBar: PrototypeBottomNav(selectedTab: 0, cartCount: 2, onTap: (_) {})),
            'catalog': Scaffold(body: SafeArea(child: CatalogPage(onProduct: (_) {}, onBack: () {}, initialCategories: const {}))),
            'categories': CategoriesPage(onCategory: (_) {}),
            'category products': CategoryProductsPage(category: 'Building Materials', onProduct: (_) {}),
            'search': ProductSearchPage(onProduct: (_) {}),
            'product': ProductPage(product: defaultProducts[1], onAdd: (_, quantity) {}, onBuyNow: (_) {}, cartCount: () => 2, onOpenCart: () {}),
            'cart': Scaffold(body: SafeArea(child: CartPage(cart: items, onChanged: () {}, onRemoveItem: (_) {}, onAddRecommendation: (_) {}, onCheckout: () {}, onBack: () {}))),
            'checkout': CheckoutPage(total: 380, cartItems: items, onOrderPlaced: () {}),
            'confirmation': ConfirmationPage(orderNumber: 'ELEE-1790000000000000-1', total: 380, cartItems: items),
            'receipt': ReceiptPage(orderNumber: 'ELEE-1790000000000000-1', total: 380, cartItems: items, customerName: 'Test Customer', customerMobile: '09123456789', customerAddress: 'Unit 4B, Mabini Street, Manila'),
            'saved receipts': const SavedOrdersPage(),
            'app shell': const EleeApp(loadCatalog: false),
          };
          for (final entry in screens.entries) {
            await tester.pumpWidget(MaterialApp(
              theme: ThemeData(platform: platform),
              builder: (context, child) => MediaQuery(
                data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(scale), padding: const EdgeInsets.only(top: 24, bottom: 24)),
                child: child!),
              home: entry.value,
            ));
            await tester.pumpAndSettle();
            expect(tester.takeException(), isNull, reason: entry.key);
            final scrollables = find.byType(Scrollable);
            if (scrollables.evaluate().isNotEmpty) {
              final state = tester.state<ScrollableState>(scrollables.first);
              if (state.position.axis == Axis.vertical) {
                state.position.jumpTo(state.position.maxScrollExtent);
                await tester.pumpAndSettle();
                expect(tester.takeException(), isNull, reason: '${entry.key} scrolled');
              }
            }
            await tester.pumpWidget(const SizedBox());
          }
        });
      }
    }
  }
}

