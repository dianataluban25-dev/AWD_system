import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';

Future<bool> savePdf(Uint8List bytes, String filename) async {
  final path = await FilePicker.platform.saveFile(
    dialogTitle: 'Save receipt PDF',
    fileName: filename,
    type: FileType.custom,
    allowedExtensions: const ['pdf'],
    bytes: bytes,
  );
  if (path == null) return false;
  // Mobile pickers write bytes through the system document provider.
  // Desktop pickers may only return a location, so explicitly write the file.
  if (!Platform.isAndroid && !Platform.isIOS) {
    await File(path).writeAsBytes(bytes, flush: true);
  }
  return true;
}
