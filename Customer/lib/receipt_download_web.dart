import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';

Future<bool> savePdf(Uint8List bytes, String filename) async {
  await FilePicker.platform.saveFile(
    fileName: filename,
    type: FileType.custom,
    allowedExtensions: const ['pdf'],
    bytes: bytes,
  );
  // Web returns no filesystem path, even after a successful download request.
  // The browser controls completion and the destination folder.
  return true;
}
