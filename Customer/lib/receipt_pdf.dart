import 'package:flutter/services.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'receipt_download.dart' as download;

typedef ReceiptSaver = Future<bool> Function(Uint8List bytes, String filename);

Future<bool> saveReceiptPdf(Uint8List bytes, String filename) =>
    download.savePdf(bytes, filename);

String receiptFilename(Map<String, dynamic> order) {
  final number = (order['order_number'] as String)
      .replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
  return '${order['payment_status'] == 'Paid' ? 'paid-receipt' : 'order-summary'}-$number.pdf';
}

/// The local demo snapshot uses whole pesos. A live adapter must map server
/// centavos explicitly; never build a paid receipt from customer form values.
Future<Uint8List> buildReceiptPdf(Map<String, dynamic> order,
    {required bool demo}) async {
  final status = order['payment_status'];
  if (status != 'Unpaid' && status != 'Paid') {
    throw StateError('Unknown payment status');
  }
  final paid = status == 'Paid';
  final paidAt = DateTime.tryParse(order['paid_at']?.toString() ?? '');
  if (paid && paidAt == null) throw StateError('Payment timestamp missing');
  final regular = pw.Font.ttf(await rootBundle.load('assets/fonts/NotoSans-Regular.ttf'));
  final bold = pw.Font.ttf(await rootBundle.load('assets/fonts/NotoSans-Bold.ttf'));
  final document = pw.Document(
    title: '${paid ? 'Paid Receipt' : 'Order Summary'} - ${order['order_number']}',
    author: 'ELEE Hardware',
  );
  final items = (order['items'] as List).cast<Map>();
  final subtotal = items.fold<num>(0,
      (sum, item) => sum + (item['price'] as num) * (item['quantity'] as num));
  final total = order['total'] as num;
  final fee = total - subtotal;
  if (fee < 0 || items.isEmpty) throw StateError('Invalid order totals');
  String money(num amount) => 'PHP ${amount.toStringAsFixed(2)}';
  String field(String key) {
    final value = order[key]?.toString().trim() ?? '';
    return value.isEmpty ? 'Not provided' : value;
  }
  pw.Widget line(String label, String value, {bool strong = false}) =>
      pw.Padding(padding: const pw.EdgeInsets.symmetric(vertical: 4),
        child: pw.Row(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Expanded(child: pw.Text(label)),
          pw.SizedBox(width: 16),
          pw.Expanded(child: pw.Text(value, textAlign: pw.TextAlign.right,
            style: pw.TextStyle(fontWeight: strong ? pw.FontWeight.bold : pw.FontWeight.normal))),
        ]));
  document.addPage(pw.MultiPage(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(36),
    theme: pw.ThemeData.withFont(base: regular, bold: bold),
    header: (_) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Text('ELEE HARDWARE', style: pw.TextStyle(fontSize: 22,
        fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#245523'))),
      pw.Text(paid ? 'DIGITAL PAID RECEIPT' : 'DIGITAL ORDER SUMMARY',
        style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
      if (demo) pw.Text('LOCAL RECORD - Not submitted to the store',
        style: const pw.TextStyle(color: PdfColors.red, fontSize: 10)),
      pw.SizedBox(height: 12),
    ]),
    footer: (context) => pw.Column(children: [
      pw.Divider(),
      pw.Text('${order['order_number']} | Page ${context.pageNumber} of ${context.pagesCount}',
        style: const pw.TextStyle(fontSize: 9)),
    ]),
    build: (_) => [
      line('Order number', field('order_number'), strong: true),
      line('Order date (UTC)', field('created_at')),
      line('Payment status', status as String, strong: true),
      line('Order status', field('order_status')),
      if (paid) line('Payment recorded (UTC)', paidAt!.toUtc().toIso8601String()),
      pw.SizedBox(height: 12),
      pw.Text('CUSTOMER DETAILS', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
      line('Full name', field('customer_name')),
      line('Mobile number', field('mobile_number')),
      line('Delivery address', order['fulfillment_method'] == 'store_pickup'
          ? 'Store pickup' : field('address')),
      line('Payment method', order['payment_method'] == 'cash_at_store'
          ? 'Cash at Store' : 'Cash on Delivery (COD)'),
      pw.SizedBox(height: 16),
      pw.TableHelper.fromTextArray(
        headers: ['Product', 'Unit', 'Qty', 'Unit price', 'Amount'],
        data: items.map((item) => [item['name'].toString(),
          item['unit']?.toString() ?? 'piece', item['quantity'].toString(),
          money(item['price'] as num),
          money((item['price'] as num) * (item['quantity'] as num))]).toList(),
        columnWidths: {0: const pw.FlexColumnWidth(3), 1: const pw.FlexColumnWidth(1),
          2: const pw.FlexColumnWidth(.6), 3: const pw.FlexColumnWidth(1.4),
          4: const pw.FlexColumnWidth(1.4)},
        headerDecoration: pw.BoxDecoration(color: PdfColor.fromHex('#EAF1E8')),
        headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10),
        cellStyle: const pw.TextStyle(fontSize: 10),
        cellPadding: const pw.EdgeInsets.all(7),
        cellAlignments: {2: pw.Alignment.centerRight, 3: pw.Alignment.centerRight,
          4: pw.Alignment.centerRight},
      ),
      pw.SizedBox(height: 12),
      line('Subtotal', money(subtotal)),
      line('Delivery fee', money(fee)),
      line('Total', money(total), strong: true),
      pw.SizedBox(height: 18),
      pw.Text(paid
          ? demo
              ? 'Payment status is from a local test record, not a store-confirmed payment.'
              : 'Cash payment has been recorded by staff. Keep this receipt for reference.'
          : 'UNPAID - This is an order summary, not proof of payment. After staff records your cash payment, reopen your receipt to download the Paid version.'),
      pw.SizedBox(height: 8),
      pw.Text('A downloaded PDF is a snapshot and will not update automatically.',
        style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey700)),
    ],
  ));
  return document.save();
}
