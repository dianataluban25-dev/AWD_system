import 'catalog_fixture.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/receipt_pdf.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> sampleOrder() => {
  'order_number': 'ELEE-DEMO-1001', 'created_at': '2026-09-24T08:00:00Z',
  'customer_name': 'María Dela Peña', 'mobile_number': '09123456789',
  'address': 'Unit 4B, 123 Mabini Street, Barangay San Antonio, Quezon City',
  'fulfillment_method': 'delivery', 'payment_method': 'cash_on_delivery',
  'payment_status': 'Unpaid', 'order_status': 'Pending', 'paid_at': null,
  'total': 690,
  'items': [
    {'id': 1, 'name': 'Claw Hammer', 'price': 70, 'quantity': 2, 'unit': 'piece'},
    {'id': 2, 'name': 'Cement 40kg', 'price': 245, 'quantity': 2, 'unit': 'bag'},
  ],
};

class UnavailableRepository implements OrderRepository {
  @override
  Future<Map<String, dynamic>> get(String number) async => throw StateError('offline');
  @override
  Future<List<Map<String, dynamic>>> list() async => throw StateError('offline');
  @override
  Future<void> save(Map<String, dynamic> order) async => throw StateError('offline');
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() {
    useTestCatalog();
    SharedPreferences.setMockInitialValues({});
    orderRepository = LocalOrderRepository();
  });
  tearDown(() => orderRepository = LocalOrderRepository());

  test('PDF supports Unpaid, Unicode names and multipage Paid receipts', () async {
    final order = sampleOrder();
    final unpaid = await buildReceiptPdf(order, demo: true);
    expect(String.fromCharCodes(unpaid.take(5)), '%PDF-');
    expect(receiptFilename(order), 'order-summary-ELEE-DEMO-1001.pdf');
    final paid = {...order, 'payment_status': 'Paid', 'order_status': 'Completed',
      'paid_at': '2026-09-24T09:15:00Z',
      'items': List.generate(48, (i) => {
        'name': 'Hollow Blocks 4” - construction material ${i + 1}',
        'unit': 'piece', 'price': 25, 'quantity': 2,
      }), 'total': 2460,
    };
    final paidBytes = await buildReceiptPdf(paid, demo: true);
    expect(String.fromCharCodes(paidBytes.take(5)), '%PDF-');
    expect(receiptFilename(paid), 'paid-receipt-ELEE-DEMO-1001.pdf');
    // Optional review artifacts, generated only by an explicit local QA run.
    if (Platform.environment['RECEIPT_PDF_QA'] == '1') {
      Directory('tmp/pdfs').createSync(recursive: true);
      File('tmp/pdfs/unpaid.pdf').writeAsBytesSync(unpaid);
      File('tmp/pdfs/paid-multipage.pdf').writeAsBytesSync(paidBytes);
    }
    await expectLater(buildReceiptPdf({...order, 'payment_status': 'Paid'}, demo: true), throwsStateError);
    await expectLater(buildReceiptPdf({...order, 'payment_status': 'unknown'}, demo: true), throwsStateError);
  });

  testWidgets('Download rechecks status, exports Paid, and blocks stale exports on failure', (tester) async {
    await orderRepository.save(sampleOrder());
    final saved = <String>[];
    Uint8List? bytes;
    var cancelled = false;
    await tester.pumpWidget(MaterialApp(home: ReceiptPage(
      orderNumber: 'ELEE-DEMO-1001', total: 690,
      cartItems: [CartItem(defaultProducts.first, 2), CartItem(defaultProducts[5], 2)],
      customerName: 'María Dela Peña', customerMobile: '09123456789',
      customerAddress: 'Unit 4B, Quezon City',
      receiptSaver: (data, filename) async {
        if (cancelled) return false;
        bytes = data; saved.add(filename); return true;
      },
    )));
    await tester.pumpAndSettle();
    expect(find.text('Download Order Summary (PDF)'), findsOneWidget);
    await tester.tap(find.text('Download Order Summary (PDF)'));
    await tester.runAsync(() async { await Future<void>.delayed(const Duration(milliseconds: 700)); });
    await tester.pumpAndSettle();
    expect(saved, ['order-summary-ELEE-DEMO-1001.pdf']);
    expect(bytes, isNotEmpty);
    expect(find.text('PDF saved to your selected location.'), findsOneWidget);
    cancelled = true;
    await tester.tap(find.text('Download Order Summary (PDF)'));
    await tester.runAsync(() async { await Future<void>.delayed(const Duration(milliseconds: 700)); });
    await tester.pumpAndSettle();
    expect(saved.length, 1);
    expect(find.text('Save cancelled. No PDF was saved.'), findsOneWidget);
    cancelled = false;
    await (orderRepository as LocalOrderRepository).simulatePayment('ELEE-DEMO-1001');
    // Even without Refresh, the export reads the new staff status.
    await tester.tap(find.text('Download Order Summary (PDF)'));
    await tester.runAsync(() async { await Future<void>.delayed(const Duration(milliseconds: 700)); });
    await tester.pumpAndSettle();
    expect(saved.last, 'paid-receipt-ELEE-DEMO-1001.pdf');
    expect(find.text('Download Paid Receipt (PDF)'), findsOneWidget);
    orderRepository = UnavailableRepository();
    await tester.tap(find.text('Download Paid Receipt (PDF)'));
    await tester.pumpAndSettle();
    expect(saved.length, 2);
    expect(find.text('Could not download receipt. Check your connection and try again.'), findsOneWidget);
  });
}

