import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:flutter/material.dart';

const defaultProducts = [
  Product('Claw Hammer', 70, Icons.handyman_rounded, 'Tools'),
  Product('Screwdriver Set', 180, Icons.construction_rounded, 'Tools'),
  Product('GI Corrugated 3ft', 295, Icons.grid_4x4_rounded, 'Construction'),
  Product(
      'Hollow Blocks 4”', 25, Icons.view_in_ar_rounded, 'Building Materials'),
  Product('PVC Pipe (1/2”)', 43, Icons.plumbing_rounded, 'Plumbing'),
  Product('Cement 40kg', 245, Icons.inventory_2_rounded, 'Building Materials', unit: 'bag'),
  Product('Paint (1L)', 140, Icons.format_paint_rounded, 'Paints'),
  Product(
      'Fine Sand (cu. m.)', 900, Icons.landscape_rounded, 'Building Materials', unit: 'cu. m.'),
  Product('Electrical Tape', 90, Icons.electric_bolt_rounded, 'Electrical'),
];

void useTestCatalog() {
  products = List<Product>.of(defaultProducts);
  currentDeliveryFee = 60;
  orderRepository = LocalOrderRepository();
}

