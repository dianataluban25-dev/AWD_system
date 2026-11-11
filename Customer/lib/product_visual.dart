import 'package:flutter/material.dart';

/// Offline catalog illustrations; server photos take priority when available.
class ProductVisual extends StatelessWidget {
  const ProductVisual({super.key, required this.name, this.imageUrl});
  final String name;
  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    final fallback = Semantics(
      image: true,
      label: '$name illustration',
      child: AspectRatio(aspectRatio: 1.3,
        child: CustomPaint(painter: _ProductPainter(name))),
    );
    final url = imageUrl?.trim();
    if (url == null || url.isEmpty) return fallback;
    return Image.network(url, fit: BoxFit.contain, semanticLabel: name,
      errorBuilder: (_, error, stack) => fallback,
      loadingBuilder: (_, child, progress) => progress == null ? child : fallback);
  }
}

class ProductGallery extends StatefulWidget {
  const ProductGallery({super.key, required this.name, this.imageUrls = const [], this.fallbackUrl});
  final String name;
  final List<String> imageUrls;
  final String? fallbackUrl;

  @override
  State<ProductGallery> createState() => _ProductGalleryState();
}

class _ProductGalleryState extends State<ProductGallery> {
  int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    final urls = widget.imageUrls.isNotEmpty ? widget.imageUrls : [if (widget.fallbackUrl?.isNotEmpty == true) widget.fallbackUrl!];
    if (urls.length <= 1) return ProductVisual(name: widget.name, imageUrl: urls.isEmpty ? widget.fallbackUrl : urls.first);
    return Column(children: [
      Expanded(child: PageView.builder(
        itemCount: urls.length,
        onPageChanged: (index) => setState(() => currentPage = index),
        itemBuilder: (context, index) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: ProductVisual(name: widget.name, imageUrl: urls[index]),
        ),
      )),
      const SizedBox(height: 5),
      Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(urls.length, (index) => Container(
        width: index == currentPage ? 16 : 6, height: 6,
        margin: const EdgeInsets.symmetric(horizontal: 3),
        decoration: BoxDecoration(color: index == currentPage ? const Color(0xFF08752F) : const Color(0xFFCAD6CC), borderRadius: BorderRadius.circular(4)),
      ))),
    ]);
  }
}

class _ProductPainter extends CustomPainter {
  _ProductPainter(this.name);
  final String name;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 160, size.height / 120);
    final paint = Paint()..isAntiAlias = true;
    void box(double x, double y, double w, double h, Color color, [double r = 3]) {
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x, y, w, h), Radius.circular(r)), paint..color = color);
    }
    void oval(Rect rect, Color color) => canvas.drawOval(rect, paint..color = color);
    const steel = Color(0xFF8798A5);
    const dark = Color(0xFF354650);
    const yellow = Color(0xFFDEA62D);
    const green = Color(0xFF386345);
    oval(const Rect.fromLTWH(25, 98, 110, 10), const Color(0x16000000));
    if (name.contains('Hammer')) {
      canvas.translate(80, 58);
      canvas.rotate(.45);
      box(-7, -25, 14, 70, yellow);
      box(-9, 10, 18, 36, dark);
      box(-32, -38, 62, 20, steel);
      box(-36, -41, 13, 27, dark);
      box(20, -35, 19, 8, steel);
    } else if (name.contains('Screwdriver')) {
      for (var i = 0; i < 3; i++) {
        final x = 43.0 + i * 32;
        box(x, 16 + i * 4, 5, 48, steel);
        box(x - 7, 57 + i * 4, 19, 36, i == 1 ? green : yellow, 7);
        box(x - 2, 63 + i * 4, 9, 22, dark);
      }
    } else if (name.contains('Corrugated')) {
      box(24, 23, 112, 70, steel);
      for (var i = 0; i < 8; i++) {
        box(28.0 + i * 13, 23, 4, 70, const Color(0xFFC3CFD5), 0);
      }
    } else if (name.contains('Blocks')) {
      box(25, 40, 110, 52, steel);
      box(25, 79, 110, 13, dark);
      for (var i = 0; i < 3; i++) {
        box(34.0 + i * 34, 47, 24, 24, dark);
        box(37.0 + i * 34, 52, 18, 16, const Color(0xFFB4BDC0));
      }
    } else if (name.contains('PVC')) {
      for (var i = 0; i < 3; i++) {
        final y = 28.0 + i * 24;
        box(30, y, 100, 18, steel, 8);
        box(35, y + 2, 90, 5, const Color(0xFFD5E2EC));
        oval(Rect.fromLTWH(23, y, 17, 18), dark);
        oval(Rect.fromLTWH(26, y + 3, 11, 12), const Color(0xFFCAD7DF));
      }
    } else if (name.contains('Cement')) {
      box(46, 15, 68, 83, const Color(0xFFD4C2A1), 9);
      box(46, 20, 68, 6, const Color(0xFFAE9878));
      box(46, 87, 68, 6, const Color(0xFFAE9878));
      box(46, 40, 68, 35, green);
      final text = TextPainter(text: const TextSpan(text: 'CEMENT\n40 kg', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)), textDirection: TextDirection.ltr, textAlign: TextAlign.center)..layout();
      text.paint(canvas, Offset(80 - text.width / 2, 44));
    } else if (name.contains('Paint')) {
      canvas.drawArc(const Rect.fromLTWH(46, 11, 68, 74), 3.14, 3.14, false,
        Paint()..color = steel..style = PaintingStyle.stroke..strokeWidth = 3);
      box(45, 39, 70, 56, green);
      oval(const Rect.fromLTWH(45, 86, 70, 14), green);
      box(45, 56, 70, 22, yellow, 0);
      oval(const Rect.fromLTWH(44, 31, 72, 19), steel);
      oval(const Rect.fromLTWH(50, 34, 60, 12), const Color(0xFFDBE2E6));
    } else if (name.contains('Sand')) {
      final pile = Path()..moveTo(20, 95)..quadraticBezierTo(43, 70, 63, 38)..quadraticBezierTo(78, 24, 98, 53)..quadraticBezierTo(115, 75, 142, 95)..close();
      canvas.drawPath(pile, paint..color = const Color(0xFFD7B87B));
      for (var i = 0; i < 28; i++) {
        canvas.drawCircle(Offset(53.0 + (i * 17 % 56), 67.0 + (i * 7 % 25)), 1, paint..color = const Color(0xFFB89960));
      }
    } else if (name.contains('Tape')) {
      oval(const Rect.fromLTWH(37, 23, 86, 76), dark);
      oval(const Rect.fromLTWH(37, 17, 86, 68), const Color(0xFF20292E));
      oval(const Rect.fromLTWH(60, 33, 40, 35), const Color(0xFFD4C2A1));
      oval(const Rect.fromLTWH(67, 39, 26, 24), Colors.white);
      box(107, 72, 26, 12, dark);
    } else {
      box(39, 28, 82, 67, const Color(0xFFC8AA7D));
      box(73, 28, 14, 67, yellow, 0);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_ProductPainter oldDelegate) => oldDelegate.name != name;
}
