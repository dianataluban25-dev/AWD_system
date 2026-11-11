import 'dart:convert';
import 'dart:math';
import 'store_api.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Replace this repository with a Laravel implementation once the API is agreed.
abstract class OrderRepository {
  Future<void> save(Map<String, dynamic> order);
  Future<Map<String, dynamic>> get(String orderNumber);
  Future<List<Map<String, dynamic>>> list();
}

class LocalOrderRepository implements OrderRepository {
  static const storageKey = 'elee.demo.orders.v1';

  Future<Map<String, dynamic>> _read() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.reload();
    final raw = prefs.getString(storageKey);
    return raw == null ? {} : jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> _write(Map<String, dynamic> orders) async {
    final prefs = await SharedPreferences.getInstance();
    if (!await prefs.setString(storageKey, jsonEncode(orders))) {
      throw StateError('Unable to save demo orders');
    }
  }

  @override
  Future<void> save(Map<String, dynamic> order) async {
    if (order['fulfillment_method'] == 'store_pickup' &&
        order['payment_method'] == 'cash_on_delivery') {
      throw ArgumentError('COD is available for delivery only');
    }
    final orders = await _read();
    final number = order['order_number'] as String;
    if (orders.containsKey(number)) throw StateError('Order already exists');
    final next = orders.values.fold<int>(0, (maximum, value) {
      final sequence = (value as Map)['queue_sequence'] as int? ?? 0;
      return max(maximum, sequence);
    }) + 1;
    order['queue_sequence'] = next;
    order['queue_number'] = 'Q-${next.toString().padLeft(4, '0')}';
    orders[number] = order;
    await _write(orders);
  }

  @override
  Future<Map<String, dynamic>> get(String orderNumber) async {
    final orders = await _read();
    if (!orders.containsKey(orderNumber)) throw StateError('Order not found');
    final order = Map<String, dynamic>.from(orders[orderNumber] as Map);
    final sequence = order['queue_sequence'] as int?;
    if (sequence != null && order['order_status'] == 'Pending') {
      order['orders_ahead'] = orders.values.where((value) =>
          value['queue_sequence'] != null &&
          (value['queue_sequence'] as int) < sequence &&
          value['order_status'] == 'Pending').length;
    } else {
      order['orders_ahead'] = null;
    }
    return order;
  }

  @override
  Future<List<Map<String, dynamic>>> list() async {
    final orders = await _read();
    return orders.values.map((value) => Map<String, dynamic>.from(value as Map))
        .toList()..sort((a, b) => (b['created_at'] as String)
            .compareTo(a['created_at'] as String));
  }

  /// Local simulation only. Never exposed by the customer repository interface.
  Future<void> simulatePayment(String orderNumber) async {
    final orders = await _read();
    final order = orders[orderNumber] as Map<String, dynamic>?;
    if (order == null) throw StateError('Order not found');
    if (order['payment_status'] == 'Paid') return;
    order['payment_status'] = 'Paid';
    order['paid_at'] = DateTime.now().toUtc().toIso8601String();
    if (order['payment_method'] == 'cash_on_delivery') {
      order['order_status'] = 'Completed';
    }
    await _write(orders);
  }
}

// Live receipts and their tokens are isolated from the old device-only records.
class ApiOrderRepository implements OrderRepository {
  ApiOrderRepository(this.api);
  final StoreApi api;
  String get storageKey => 'elee.store.orders.v1.${api.baseUrl}';
  String get pendingKey => '$storageKey.pending';

  Future<Map<String, dynamic>?> pending() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(pendingKey);
    return raw == null ? null : jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> _records() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(storageKey);
    return raw == null ? {} : jsonDecode(raw) as Map<String, dynamic>;
  }

  @override
  Future<void> save(Map<String, dynamic> order) async {
    final payload = {
      'customer_name': order['customer_name'],
      'mobile_number': order['mobile_number'],
      'address': order['address'],
      'fulfillment_method': order['fulfillment_method'],
      'payment_method': order['payment_method'],
      if (order['total'] is num) 'expected_total_centavos': ((order['total'] as num) * 100).round(),
      'items': (order['items'] as List).map((item) => {
        'product_id': item['product_id'] ?? item['id'], 'quantity': item['quantity'],
      }).toList(),
    };
    final prefs = await SharedPreferences.getInstance();
    var retry = await pending();
    if (retry != null && jsonEncode(retry['payload']) != jsonEncode(payload)) {
      throw const StoreApiException('Finish the pending order in Saved receipts first.', 409);
    }
    retry ??= {
      'key': List.generate(24, (_) => Random.secure().nextInt(256).toRadixString(16).padLeft(2, '0')).join(),
      'payload': payload, 'snapshot': Map<String, dynamic>.from(order),
    };
    if (!await prefs.setString(pendingKey, jsonEncode(retry))) {
      throw StateError('Unable to save checkout retry details');
    }
    Map<String, dynamic> response;
    try {
      response = await api.request('orders', body: payload, key: retry['key'] as String);
    } on StoreApiException catch (error) {
      // Validation rejection is unambiguous; timeouts/5xx keep the same key.
      if (error.status == 422) await prefs.remove(pendingKey);
      rethrow;
    }
    final saved = Map<String, dynamic>.from(response['data'] as Map);
    saved['address'] ??= '';
    saved['source'] = 'store';
    final records = await _records();
    records[saved['order_number'] as String] = {
      'order': saved, 'token': response['access_token'],
    };
    if (!await prefs.setString(storageKey, jsonEncode(records))) {
      throw StateError('Unable to save receipt. Retry the same order.');
    }
    await prefs.remove(pendingKey);
    order..clear()..addAll(saved);
  }

  Future<void> resumePending() async {
    final retry = await pending();
    if (retry != null) await save(Map<String, dynamic>.from(retry['snapshot'] as Map));
  }

  @override
  Future<Map<String, dynamic>> get(String orderNumber) async {
    final records = await _records();
    final record = records[orderNumber] as Map?;
    if (record == null) throw const StoreApiException('Receipt not found on this device.', 404);
    final response = await api.request('orders/${Uri.encodeComponent(orderNumber)}',
        token: record['token'] as String);
    final order = Map<String, dynamic>.from(response['data'] as Map);
    order['address'] ??= '';
    order['source'] = 'store';
    record['order'] = order;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(storageKey, jsonEncode(records));
    return order;
  }

  @override
  Future<List<Map<String, dynamic>>> list() async {
    final records = await _records();
    final orders = <Map<String, dynamic>>[];
    for (final number in records.keys) {
      orders.add(await get(number));
    }
    orders.sort((a, b) => (b['created_at'] as String).compareTo(a['created_at'] as String));
    return orders;
  }
}

OrderRepository orderRepository = ApiOrderRepository(StoreApi(baseUrl: configuredApiUrl));
