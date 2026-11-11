import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

const _apiOverride = String.fromEnvironment('API_BASE_URL');
final configuredApiUrl = _apiOverride.isNotEmpty
    ? _apiOverride
    : kIsWeb ? Uri.base.resolve('/api').toString() : '';

class StoreApiException implements Exception {
  const StoreApiException(this.message, this.status);
  final String message;
  final int status;
  @override
  String toString() => message;
}

class StoreApi {
  StoreApi({required String baseUrl, http.Client? client})
      : baseUrl = baseUrl.replaceFirst(RegExp(r'/+$'), ''),
        client = client ?? http.Client();
  final String baseUrl;
  final http.Client client;
  num deliveryFee = 0;
  Map<String, dynamic> storeSettings = {};

  void updateStore(Map<String, dynamic> store) {
    storeSettings = store;
    if (store['delivery_fee_centavos'] is num) {
      deliveryFee = (store['delivery_fee_centavos'] as num) / 100;
    }
  }

  Future<Map<String, dynamic>> fetchStore() async {
    final result = await request('store');
    updateStore(result);
    return result;
  }

  Future<Map<String, dynamic>> request(String path,
      {Map<String, dynamic>? body, String? token, String? key}) async {
    if (baseUrl.isEmpty) {
      throw const StoreApiException('Store is unavailable. Please try again.', 503);
    }
    final uri = Uri.parse('$baseUrl/$path');
    final headers = {
      'Accept': 'application/json',
      if (body != null) 'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
      if (key != null) 'Idempotency-Key': key,
    };
    final response = await (body == null
        ? client.get(uri, headers: headers)
        : client.post(uri, headers: headers, body: jsonEncode(body)))
        .timeout(const Duration(seconds: 10));
    Map<String, dynamic> payload = {};
    try {
      payload = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      throw StoreApiException('Store returned an invalid response. Try again.', response.statusCode);
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final errors = payload['errors'];
      final message = errors is Map && errors.isNotEmpty
          ? (errors.values.first as List).first.toString()
          : response.statusCode == 429
              ? 'Too many requests. Please wait a moment.'
              : payload['message']?.toString() ?? 'Store is unavailable. Try again.';
      throw StoreApiException(message, response.statusCode);
    }
    return payload;
  }

  Future<List<Map<String, dynamic>>> products({String? search, String? category}) async {
    final rows = <Map<String, dynamic>>[];
    var page = 1;
    while (true) {
      final query = Uri(queryParameters: {
        'page': '$page',
        if (search != null && search.isNotEmpty) 'search': search,
        if (category != null && category != 'All') 'category': category,
      }).query;
      final result = await request('products?$query');
      final store = result['store'] as Map?;
      if (store != null) updateStore(Map<String, dynamic>.from(store));
      rows.addAll((result['data'] as List).cast<Map<String, dynamic>>());
      if ((result['links'] as Map?)?['next'] == null) break;
      page++;
    }
    return rows;
  }
}
