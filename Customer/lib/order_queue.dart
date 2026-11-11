import 'package:flutter/material.dart';
import 'dart:async';
import 'order_repository.dart';

class OrderQueueButton extends StatelessWidget {
  const OrderQueueButton({super.key, required this.orderNumber});
  final String orderNumber;

  @override
  Widget build(BuildContext context) => OutlinedButton.icon(
        icon: const Icon(Icons.format_list_numbered),
        label: const Text('View Order Queue'),
        onPressed: () => Navigator.of(context).push(MaterialPageRoute<void>(
            builder: (_) => OrderQueuePage(orderNumber: orderNumber))),
      );
}

class OrderQueuePage extends StatefulWidget {
  const OrderQueuePage({super.key, required this.orderNumber});
  final String orderNumber;

  @override
  State<OrderQueuePage> createState() => _OrderQueuePageState();
}

class _OrderQueuePageState extends State<OrderQueuePage> {
  late Future<Map<String, dynamic>> order;
  Timer? updates;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    reload();
    updates = Timer.periodic(const Duration(seconds: 10), (_) {
      if (mounted && ModalRoute.of(context)?.isCurrent == true && !loading) {
        setState(reload);
      }
    });
  }

  @override
  void dispose() {
    updates?.cancel();
    super.dispose();
  }

  void reload() {
    if (loading) return;
    loading = true;
    order = orderRepository
        .get(widget.orderNumber)
        .timeout(const Duration(seconds: 10))
        .whenComplete(() => loading = false);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('My Order Queue')),
        body: FutureBuilder<Map<String, dynamic>>(
          future: order,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done && !snapshot.hasData) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('Could not load your queue. Please try again.'),
                TextButton(
                    onPressed: () => setState(reload),
                    child: const Text('Retry')),
              ]));
            }
            final data = snapshot.data!;
            final local = data['source'] != 'store';
            final number = data['queue_number'] as String?;
            final ahead = data['orders_ahead'] as int?;
            final status = data['order_status'] as String;
            final position = data['queue_position'] as int?;
            return ListView(padding: const EdgeInsets.all(24), children: [
              const Icon(Icons.format_list_numbered,
                  size: 48, color: Color(0xFF08752F)),
              const SizedBox(height: 16),
              Text(
                  local ? 'Demo queue • This device only' : 'Store order queue',
                  textAlign: TextAlign.center),
              const SizedBox(height: 12),
              Text(number ?? 'Queue unavailable',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      fontSize: 38, fontWeight: FontWeight.bold)),
              Text(widget.orderNumber, textAlign: TextAlign.center),
              const SizedBox(height: 24),
              Card(
                  child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(children: [
                        Text('Order status: $status',
                            style:
                                const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        if (position != null) Text('Position: #$position'),
                        Text(
                            status == 'Completed'
                                ? 'Your order is completed.'
                                : ahead == null
                                    ? 'Position unavailable'
                                    : ahead == 0
                                        ? '0 orders ahead'
                                        : '$ahead ${ahead == 1 ? 'order' : 'orders'} ahead',
                            textAlign: TextAlign.center),
                      ]))),
            ]);
          },
        ),
      );
}
