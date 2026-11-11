import 'package:elee_mobile/order_queue.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> sample(String number) => {
      'order_number': number,
      'order_status': 'Pending',
      'payment_status': 'Unpaid',
      'payment_method': 'cash_on_delivery',
    };

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
    orderRepository = LocalOrderRepository();
  });

  testWidgets('Queue advances automatically without pressing refresh and stops after closing', (tester) async {
    await orderRepository.save(sample('FIRST'));
    await orderRepository.save(sample('SECOND'));
    await tester.pumpWidget(const MaterialApp(home: OrderQueuePage(orderNumber: 'SECOND')));
    await tester.pumpAndSettle();
    expect(find.text('1 order ahead'), findsOneWidget);
    await (orderRepository as LocalOrderRepository).simulatePayment('FIRST');
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    expect(find.text('0 orders ahead'), findsOneWidget);
    await (orderRepository as LocalOrderRepository).simulatePayment('SECOND');
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    expect(find.text('Your order is completed.'), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
    await tester.pump(const Duration(seconds: 20));
    expect(tester.takeException(), isNull);
  });

  testWidgets(
      'Queue survives restart and advances when an earlier order completes',
      (tester) async {
    await orderRepository.save(sample('FIRST'));
    await orderRepository.save(sample('SECOND'));
    orderRepository = LocalOrderRepository();
    await tester.pumpWidget(
        const MaterialApp(home: OrderQueuePage(orderNumber: 'SECOND')));
    await tester.pumpAndSettle();
    expect(find.text('Q-0002'), findsOneWidget);
    expect(find.text('1 order ahead'), findsOneWidget);
    expect(find.text('Demo queue • This device only'), findsOneWidget);
    await (orderRepository as LocalOrderRepository).simulatePayment('FIRST');
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    expect(find.text('0 orders ahead'), findsOneWidget);
    expect(find.text('Q-0002'), findsOneWidget);
    await (orderRepository as LocalOrderRepository).simulatePayment('SECOND');
    await tester.pump(const Duration(seconds: 10));
    await tester.pumpAndSettle();
    expect(find.text('Your order is completed.'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

