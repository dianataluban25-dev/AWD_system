import 'dart:io';
import 'package:qr/qr.dart';

void main(List<String> args) {
  final url = args.first;
  final qr = QrImage(QrCode(4, QrErrorCorrectLevel.M)..addData(url));
  final size = qr.moduleCount + 8;
  final pixels = <int>[];
  for (var y=0;y<size;y++) {
    for (var x=0;x<size;x++) {
      pixels.add(x>=4 && y>=4 && x<size-4 && y<size-4 && qr.isDark(y-4,x-4) ? 0 : 255);
    }
  }
  File('backend/public/customer-qr.pgm').writeAsBytesSync([...('P5\n$size $size\n255\n').codeUnits,...pixels]);
}
