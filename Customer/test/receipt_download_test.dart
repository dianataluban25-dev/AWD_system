import 'dart:io';
import 'dart:typed_data';

import 'package:elee_mobile/receipt_download_native.dart';
import 'package:elee_mobile/receipt_download_web.dart' as web_download;
import 'package:file_picker/file_picker.dart';
import 'package:flutter_test/flutter_test.dart';

class ReceiptPicker extends FilePicker {
  String? path;
  Uint8List? receivedBytes;
  String? receivedFilename;
  bool fail = false;

  @override
  Future<String?> saveFile({
    String? dialogTitle,
    String? fileName,
    String? initialDirectory,
    FileType type = FileType.any,
    List<String>? allowedExtensions,
    Uint8List? bytes,
    bool lockParentWindow = false,
  }) async {
    if (fail) throw StateError('Save failed');
    receivedBytes = bytes;
    receivedFilename = fileName;
    return path;
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late ReceiptPicker picker;
  setUp(() {
    picker = ReceiptPicker();
    FilePicker.platform = picker;
  });
  tearDown(() => FilePicker.platform = ReceiptPicker());

  test('Desktop save writes PDF bytes to the chosen file', () async {
    final folder = await Directory.systemTemp.createTemp('elee-receipt-test-');
    addTearDown(() => folder.delete(recursive: true));
    final file = File('${folder.path}${Platform.pathSeparator}receipt.pdf');
    picker.path = file.path;
    final bytes = Uint8List.fromList('%PDF-test receipt'.codeUnits);
    expect(await savePdf(bytes, 'receipt.pdf'), isTrue);
    expect(await file.readAsBytes(), bytes);
    expect(picker.receivedFilename, 'receipt.pdf');
    expect(picker.receivedBytes, bytes);
  });

  test('Cancelling native Save File does not report success', () async {
    expect(await savePdf(Uint8List.fromList([1]), 'receipt.pdf'), isFalse);
  });

  test('Browser download accepts the plugin null path as started', () async {
    final bytes = Uint8List.fromList([1, 2, 3]);
    expect(await web_download.savePdf(bytes, 'receipt.pdf'), isTrue);
    expect(picker.receivedFilename, 'receipt.pdf');
    expect(picker.receivedBytes, bytes);
  });

  test('Save failures propagate instead of reporting success', () async {
    picker.fail = true;
    final bytes = Uint8List.fromList([1]);
    await expectLater(savePdf(bytes, 'receipt.pdf'), throwsStateError);
    await expectLater(web_download.savePdf(bytes, 'receipt.pdf'), throwsStateError);
  });
}
