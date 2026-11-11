import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/store_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('Without a configured store the customer shows retry and no sample products', (tester) async {
    SharedPreferences.setMockInitialValues({});
    orderRepository = ApiOrderRepository(StoreApi(baseUrl: ''));
    products = [const Product('Stale example product', 1, Icons.handyman, 'Tools')];
    await tester.pumpWidget(const EleeApp());
    await tester.pumpAndSettle();
    expect(products, isEmpty);
    expect(find.text('Could not load store products.'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);
    expect(find.text('Stale example product'), findsNothing);
    expect(orderRepository, isA<ApiOrderRepository>());
  });
}
