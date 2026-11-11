// QR is already supplied by the PDF package's transitive dependencies.
// ignore_for_file: depend_on_referenced_packages
import 'dart:io';
import 'package:qr/qr.dart';

void main(List<String> args) {
  if (args.length != 2) {
    stderr.writeln('Usage: dart run tool/generate_preview_qr.dart URL OUTPUT_PREFIX');
    exitCode = 1;
    return;
  }
  final image = QrImage(QrCode.fromData(data: args[0], errorCorrectLevel: QrErrorCorrectLevel.M));
  final dimension = image.moduleCount + 8;
  final pixels = <int>[];
  final rects = StringBuffer();
  for (var y = 0; y < dimension; y++) {
    for (var x = 0; x < dimension; x++) {
      final dark = x >= 4 && y >= 4 && x < dimension - 4 && y < dimension - 4 && image.isDark(y - 4, x - 4);
      pixels.add(dark ? 0 : 255);
      if (dark) rects.write('<rect x="$x" y="$y" width="1" height="1"/>');
    }
  }
  File('${args[1]}.pgm')..parent.createSync(recursive: true)
    ..writeAsBytesSync([... 'P5\n$dimension $dimension\n255\n'.codeUnits, ...pixels]);
  File('${args[1]}.svg').writeAsStringSync('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $dimension $dimension" width="600" height="600"><rect width="$dimension" height="$dimension" fill="white"/><g fill="black">$rects</g></svg>');
  stdout.writeln('QR generated for ${args[0]}');
}
