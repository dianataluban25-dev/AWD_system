import 'package:flutter/foundation.dart';
import 'brand_theme.dart';
import 'order_repository.dart';
import 'order_queue.dart';
import 'store_api.dart';
import 'dart:async';
import 'product_visual.dart';
import 'receipt_pdf.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.white,
    statusBarIconBrightness: Brightness.dark,
    systemNavigationBarColor: Colors.white,
    systemNavigationBarIconBrightness: Brightness.dark,
  ));
  runApp(const EleeApp());
}

const green = brandGreen;
const brandYellow = brandGold;
const border = brandBorder;

num currentDeliveryFee = 0;
Map<String, dynamic> currentStoreSettings = {};

enum FulfillmentMethod {
  delivery('Delivery', 'delivery'),
  storePickup('Store Pickup', 'store_pickup');
  const FulfillmentMethod(this.label, this.value);
  final String label, value;
}

enum PaymentMethod {
  cashOnDelivery('Cash on Delivery (COD)'),
  cashAtStore('Cash at Store');

  const PaymentMethod(this.label);
  final String label;
  String get instructions => this == cashAtStore
      ? 'Pay at the store.'
      : 'Pay when your order arrives.';
}

int _orderSequence = 0;
String newOrderNumber() =>
    'ELEE-${DateTime.now().microsecondsSinceEpoch}-${++_orderSequence}';

SliverGridDelegate responsiveGrid(BuildContext context,
    {required int phoneColumns}) {
  final width = MediaQuery.sizeOf(context).width.clamp(0.0, 960.0);
  final scale = MediaQuery.textScalerOf(context).scale(14) / 14;
  final columns = (width / (170 * scale.clamp(1.0, 1.5))).floor().clamp(1, 5);
  return SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: columns,
    mainAxisExtent: 120 + 100 * scale,
    crossAxisSpacing: 12,
    mainAxisSpacing: 12,
  );
}

class Product {
  const Product(this.name, this.price, this.icon, this.category,
      {this.id = 0, this.stock = 24, this.imageUrl, this.imageUrls = const [], this.unit = 'piece', this.description, this.recommendedProductIds = const [], this.mlScores = const {}});
  final Map<int, double> mlScores;
  final List<int> recommendedProductIds;
  final String name;
  final num price;
  final IconData icon;
  final String category;
  final int id;
  final int stock;
  final String? imageUrl;
  final List<String> imageUrls;
  final String unit;
  final String? description;
  factory Product.fromJson(Map<String, dynamic> json) => Product(
        json['name']?.toString() ?? 'Unnamed product',
        num.tryParse(json['price']?.toString() ?? '') ?? 0,
        Icons.inventory_2_rounded,
        json['category']?.toString() ?? 'More',
        id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
        stock: int.tryParse(json['stock']?.toString() ?? '') ?? 0,
        imageUrl: json['image_url']?.toString(),
        imageUrls: (json['image_urls'] as List? ?? []).map((url) => url.toString()).where((url) => url.isNotEmpty).toList(),
        unit: json['unit']?.toString() ?? 'piece',
        description: json['description']?.toString(),
        recommendedProductIds: (json['recommended_product_ids'] as List? ?? []).map((id) => (id as num).toInt()).toList(),
        mlScores: json['ml_recommendation_scores'] is Map ? (json['ml_recommendation_scores'] as Map).map((key,value)=>MapEntry(int.parse(key.toString()),(value as num).toDouble())) : {},
      );
}



List<Product> products = [];

class RecommendationEngine {
  static List<Product> forCart(List<CartItem> cart) {
    if (orderRepository is ApiOrderRepository) {
      final selected = cart.map((item) => item.product.id).toSet();
      final related = <int>{};
      final scores = <int,double>{};
      for (final item in cart) {
        final current = products.where((product) => product.id == item.product.id);
        if (current.isNotEmpty) {
          related.addAll(current.first.recommendedProductIds);
          current.first.mlScores.forEach((id,score)=>scores[id]=(scores[id] ?? 0)+score);
        }
      }
      final learned = products.where((product)=>scores.containsKey(product.id) && !selected.contains(product.id) && product.stock>0).toList();
      learned.sort((a,b) { final rank=scores[b.id]!.compareTo(scores[a.id]!); return rank!=0 ? rank : a.id.compareTo(b.id); });
      if (learned.isNotEmpty) return learned.take(3).toList();
      return products.where((product) => related.contains(product.id) && !selected.contains(product.id) && product.stock > 0).take(3).toList();
    }
    if (cart.isEmpty) return products.take(3).toList();
    final selectedIds = cart
        .map((item) =>
            item.product.id == 0 ? item.product.name.hashCode : item.product.id)
        .toSet();
    final selectedCategories =
        cart.map((item) => item.product.category).toSet();
    final candidates = products
        .where((product) => product.stock > 0)
        .where((product) => !selectedIds
            .contains(product.id == 0 ? product.name.hashCode : product.id))
        .toList();
    candidates.sort((a, b) =>
        _score(b, selectedCategories).compareTo(_score(a, selectedCategories)));
    return candidates.take(3).toList();
  }

  static int _score(Product product, Set<String> selectedCategories) {
    var score = 1;
    if (selectedCategories.contains('Building Materials') &&
        ['Tools', 'Electrical', 'Plumbing'].contains(product.category)) {
      score += 8;
    }
    if (selectedCategories.contains('Tools') &&
        product.category == 'Building Materials') {
      score += 7;
    }
    if (selectedCategories.contains('Plumbing') &&
        product.category == 'Tools') {
      score += 6;
    }
    if (selectedCategories.contains('Electrical') &&
        product.category == 'Tools') {
      score += 6;
    }
    if (!selectedCategories.contains(product.category)) score += 2;
    return score;
  }
}

class ApiService {
  ApiService({StoreApi? api}) : api = api ?? StoreApi(baseUrl: configuredApiUrl);
  final StoreApi api;
  Future<List<Product>> fetchProducts({String? search, String? category}) async =>
      (await api.products(search: search, category: category))
          .map(Product.fromJson).toList();
}

class CartItem {
  CartItem(this.product, this.quantity);
  Product product;
  int quantity;
  bool selected = false;
}

bool sameProduct(Product a, Product b) =>
    a.id > 0 && b.id > 0 ? a.id == b.id : a.name == b.name;

bool isHollowBlock(Product product) =>
    RegExp(r'chb|hollow\s*blocks?', caseSensitive: false)
        .hasMatch('${product.name} ${product.category}');

bool isNailProduct(Product product) =>
    RegExp(r'nail|fastener', caseSensitive: false)
        .hasMatch('${product.name} ${product.category}');

String productVariantChoiceLabel(Product product) {
  final chb = RegExp(
    r'\s*\(CHB ([45])" - (Tatlong Butas (?:Maliit|Malaki))\)$',
    caseSensitive: false,
  ).firstMatch(product.unit);
  if (chb != null) {
    final amount = product.unit.replaceFirst(chb[0]!, '').trim();
    return '${chb[1]}" · ${chb[2]}${amount.isEmpty ? '' : ' · $amount'}';
  }
  final nail = RegExp(r'\s*\((Uno|Dos|Tres|Kwatro|Singko|Sais)\)$', caseSensitive: false)
      .firstMatch(product.unit);
  if (nail == null) return product.unit;
  final amount = product.unit.replaceFirst(nail[0]!, '').trim();
  return '${nail[1]}${amount.isEmpty ? '' : ' · $amount'}';
}

String productVariantSizeLabel(Product product) {
  final chb = RegExp(
    r'\s*\(CHB ([45])" - (Tatlong Butas (?:Maliit|Malaki))\)$',
    caseSensitive: false,
  ).firstMatch(product.unit);
  if (chb != null) return '${chb[1]}" · ${chb[2]}';
  final nail = RegExp(r'\s*\((Uno|Dos|Tres|Kwatro|Singko|Sais)\)$', caseSensitive: false)
      .firstMatch(product.unit);
  return nail?.group(1) ?? product.unit;
}

String productVariantAmountLabel(Product product) => product.unit.replaceFirst(
      RegExp(r'\s*\((?:CHB [45]" - Tatlong Butas (?:Maliit|Malaki)|Uno|Dos|Tres|Kwatro|Singko|Sais)\)$', caseSensitive: false),
      '',
    ).trim();

bool hasExplicitProductSize(Product product) => RegExp(
      r'^\s*(?:\d+(?:\.\d+)?|\d+\s*/\s*\d+)\s*(?:ml|milliliters?|l|liters?|litres?|kg|kilograms?|loads?|bags?|pieces?|pcs?|meters?|m|sets?|boxes?)\b',
      caseSensitive: false,
    ).hasMatch(product.unit);

List<Product> productOptions(Product product) {
  final name = product.name.trim().toLowerCase();
  return products.where((candidate) =>
      candidate.category == product.category &&
      candidate.name.trim().toLowerCase() == name).toList();
}

List<Product> groupedProducts(Iterable<Product> source) {
  final groups = <String, List<Product>>{};
  for (final product in source) {
    final key = 'product:${product.category}:${product.name.trim().toLowerCase()}';
    groups.putIfAbsent(key, () => []).add(product);
  }
  return groups.values.map((items) => items.first).toList();
}

class EleeApp extends StatefulWidget {
  const EleeApp({super.key, this.loadCatalog = true});
  final bool loadCatalog;
  @override
  State<EleeApp> createState() => _EleeAppState();
}

class _EleeAppState extends State<EleeApp> {
  int tab = 0;
  Set<String> catalogFilter = {};
  final cart = <CartItem>[];
  final navigatorKey = GlobalKey<NavigatorState>();
  final api = ApiService();
  bool loadingCatalog = false;
  bool fetchingCatalog = false;
  String? catalogError;
  Timer? catalogUpdates;

  @override
  void initState() {
    super.initState();
    if (widget.loadCatalog) {
      products = [];
      loadProducts();
      catalogUpdates = Timer.periodic(const Duration(seconds: 10), (_) {
        if (mounted && !fetchingCatalog) loadProducts(background: true);
      });
    }
  }

  Future<void> loadProducts({bool background = false}) async {
    if (fetchingCatalog) return;
    fetchingCatalog = true;
    if (!background) setState(() { loadingCatalog = true; catalogError = null; });
    try {
      final loaded = await api.fetchProducts();
      if (mounted) {
        setState(() {
          products = loaded;
          final latestById = {for (final product in loaded) product.id: product};
          for (final item in cart) {
            if (item.product.id > 0 && latestById.containsKey(item.product.id)) item.product = latestById[item.product.id]!;
          }
          catalogError = null;
          currentDeliveryFee = api.api.deliveryFee;
          currentStoreSettings = api.api.storeSettings;
        });
      }
    } catch (_) {
      if (mounted && (!background || products.isEmpty)) {
        setState(() => catalogError = 'Could not load store products.');
      }
    } finally {
      fetchingCatalog = false;
      if (mounted) setState(() => loadingCatalog = false);
    }
  }

  @override
  void dispose() {
    catalogUpdates?.cancel();
    super.dispose();
  }

  void addToCart(Product product, int quantity) {
    CartItem? existing;
    for (final item in cart) {
      if (sameProduct(item.product, product)) existing = item;
    }
    if (quantity < 1 || quantity + (existing?.quantity ?? 0) > product.stock) return;
    setState(() {
      if (existing == null) {
        cart.add(CartItem(product, quantity));
      } else {
        existing.quantity += quantity;
      }
    });
  }

  num get subtotal =>
      cart.fold(0, (sum, item) => sum + item.product.price * item.quantity);

  void openCategory(String category) {
    void showCatalog(String selected) {
      navigatorKey.currentState!.push(MaterialPageRoute(
        builder: (context) => CategoryProductsPage(
          onProduct: openProduct,
          category: selected,
        ),
      ));
    }
    navigatorKey.currentState!.push(MaterialPageRoute(
      builder: (_) => CategoriesPage(onCategory: showCatalog),
    ));
    showCatalog(category);
  }

  void openProduct(Product product) {
    final variants = productOptions(product);
    navigatorKey.currentState!.push(MaterialPageRoute(
        builder: (_) => ProductPage(
            product: product,
            variants: variants,
            onAdd: addToCart,
            cartCount: () => cart.length,
            cartQuantity: (selected) => cart
                .where((item) => sameProduct(item.product, selected))
                .fold<int>(0, (sum, item) => sum + item.quantity),
            onOpenCart: () {
              navigatorKey.currentState!.popUntil((route) => route.isFirst);
              setState(() => tab = 2);
            },
            onBuyNow: (selected, quantity) {
              navigatorKey.currentState!.popUntil((route) => route.isFirst);
              setState(() => tab = 2);
              checkout([CartItem(selected, quantity)], fromCart: false);
            })));
  }

  @override
  Widget build(BuildContext context) {
    Widget page;
    if (tab == 0) {
      page = HomePage(
          onProduct: openProduct,
          onProducts: () => setState(() {
                catalogFilter = {};
                tab = 1;
              }),
          onCategory: openCategory);
    } else if (tab == 1) {
      page = CatalogPage(
          key: ValueKey((catalogFilter.toList()..sort()).join(',')),
          onProduct: openProduct,
          onBack: () => setState(() => tab = 0),
          initialCategories: catalogFilter);
    } else {
      page = CartPage(
          onBack: () => setState(() => tab = 0),
          cart: cart,
          onChanged: () => setState(() {}),
          onRemoveItem: (item) => setState(() => cart.remove(item)),
          onSelectRecommendation: openProduct,
          onCheckout: confirmCheckout);
    }
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ELEE Hardware',
      theme: eleeTheme(),
      navigatorKey: navigatorKey,
      builder: (context, child) => AnnotatedRegion<SystemUiOverlayStyle>(
        value: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarIconBrightness: Brightness.dark,
          systemNavigationBarContrastEnforced: false,
        ),
        child: ColoredBox(
          color: Colors.white,
          child: SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 960),
                child: child!,
              ),
            ),
          ),
        ),
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          toolbarHeight: 72,
          centerTitle: false,
          titleSpacing: 16,
          shape: const Border(bottom: BorderSide(color: border)),
          title: Semantics(label: 'ELEE Hardware', image: true,
            child: const ExcludeSemantics(
              child: SizedBox(height: 50,
                child: FittedBox(fit: BoxFit.scaleDown, alignment: Alignment.centerLeft,
                  child: Brand(stacked: true))))),
          actions: [
          Padding(padding: const EdgeInsets.only(right: 16), child: IconButton(
              tooltip: 'Saved receipts',
              style: IconButton.styleFrom(
                foregroundColor: green,
                backgroundColor: const Color(0xFFF1F5EE),
                minimumSize: const Size(46, 46),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              icon: const Icon(Icons.receipt_long_outlined, size: 23),
              onPressed: () => navigatorKey.currentState!.push(MaterialPageRoute(
                  builder: (_) => const SavedOrdersPage())))),
        ]),
        body: SafeArea(
            child: LayoutBuilder(
                builder: (context, constraints) => Align(
                    alignment: Alignment.topCenter,
                    child: ConstrainedBox(
                        constraints: BoxConstraints(
                            maxWidth: constraints.maxWidth >= 1000
                                ? 960
                                : double.infinity),
                        child: loadingCatalog
                            ? const Center(child: CircularProgressIndicator())
                            : catalogError != null
                                ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                                    Text(catalogError!),
                                    TextButton(onPressed: loadProducts, child: const Text('Retry')),
                                  ]))
                                : page)))),
        bottomNavigationBar: PrototypeBottomNav(
            selectedTab: tab,
            cartCount: cart.length,
            onTap: (value) => setState(() => tab = value)),
      ),
    );
  }

  void checkout(List<CartItem> items, {bool fromCart = true}) {
    if (items.isEmpty) return;
    final ordered = items.map((item) => CartItem(item.product, item.quantity)).toList();
    final total = ordered.fold<num>(currentDeliveryFee, (sum, item) => sum + item.product.price * item.quantity);
    navigatorKey.currentState!.push(MaterialPageRoute(
      builder: (_) => CheckoutPage(
        total: total,
        cartItems: ordered,
        onOrderPlaced: () => setState(() {
          if (fromCart) {
            for (var i = 0; i < items.length; i++) {
              items[i].quantity -= ordered[i].quantity;
              if (items[i].quantity <= 0) cart.remove(items[i]);
            }
          }
          tab = 0;
          if (widget.loadCatalog) loadProducts();
        }),
      ),
    ));
  }
  void confirmCheckout() {
    final selected = cart.where((item) => item.selected).toList();
    if (selected.isEmpty) return;
    final context = navigatorKey.currentState!.context;
    showDialog<void>(
        context: context,
        builder: (dialogContext) => AlertDialog(
                title: const Text('Proceed to checkout?'),
                content:
                    const Text('Review your cart items before continuing.'),
                actions: [
                  TextButton(
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Cancel')),
                  FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: green),
                      onPressed: () {
                        Navigator.pop(dialogContext);
                        checkout(selected);
                      },
                      child: const Text('Continue'))
                ]));
  }
}

class PrototypeBottomNav extends StatelessWidget {
  const PrototypeBottomNav({super.key, required this.selectedTab,
    required this.cartCount, required this.onTap});
  final int selectedTab, cartCount;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) => SafeArea(
    top: false,
    child: Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: border)),
      ),
      child: Row(children: [
        destination('Home', Icons.home, 0),
        destination('Cart', Icons.shopping_cart, 2),
        destination('Catalog', Icons.grid_view_outlined, 1),
      ]),
    ),
  );

  Widget destination(String label, IconData icon, int index) {
    final selected = selectedTab == index;
    return Expanded(child: Semantics(
      selected: selected,
      button: true,
      child: InkWell(
        onTap: () => onTap(index),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            if (index == 2)
              SizedBox(
                height: 32,
                width: 56,
                child: OverflowBox(
                  maxHeight: 56,
                  child: Transform.translate(
                    offset: const Offset(0, -8),
                    child: Badge(
                      isLabelVisible: cartCount > 0,
                      label: Text('$cartCount'),
                      child: Container(
                        width: 56,
                        height: 56,
                        decoration: const BoxDecoration(
                          color: green,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.shopping_cart,
                          size: 32, color: Colors.white),
                      ),
                    ),
                  ),
                ),
              )
            else
              Icon(icon, size: 32,
                color: selected ? green : Colors.black87),
            const SizedBox(height: 6),
            Text(label, textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700,
                color: index == 2 || selected ? green : Colors.black87)),
          ]),
        ),
      ),
    ));
  }
}

class Brand extends StatelessWidget {
  const Brand({super.key, this.small = false, this.stacked = false});
  final bool small;
  final bool stacked;
  @override
  Widget build(BuildContext context) {
    final wordmark = Row(mainAxisSize: MainAxisSize.min, children: [
      Text('E',
          style: TextStyle(
              color: green,
              fontSize: small ? 22 : 30,
              fontWeight: FontWeight.w900,
              height: .95)),
      Text('LEE',
          style: TextStyle(
              color: brandYellow,
              fontSize: small ? 22 : 30,
              fontWeight: FontWeight.w900,
              height: .95))
    ]);
    final hardware = Text('HARDWARE',
        style: TextStyle(
            color: brandYellow,
            fontSize: small ? 9 : 11,
            letterSpacing: .5,
            fontWeight: FontWeight.w900));
    if (stacked) {
      return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            wordmark,
            const SizedBox(height: 2),
            Padding(padding: const EdgeInsets.only(left: 18), child: hardware)
          ]);
    }
    return FittedBox(fit: BoxFit.scaleDown, child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          wordmark,
          Padding(padding: const EdgeInsets.only(left: 5), child: hardware)
        ]));
  }
}

/// Compact store signature for the catalog header.
class CatalogBrand extends StatelessWidget {
  const CatalogBrand({super.key});

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'ELEE Hardware',
    image: true,
    child: ExcludeSemantics(
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text.rich(TextSpan(children: [
                TextSpan(text: 'E', style: TextStyle(color: green)),
                TextSpan(text: 'LEE', style: TextStyle(color: brandYellow)),
              ]), style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900,
                  letterSpacing: 1.2, height: 1.05)),
              const SizedBox(height: 3),
              const Text('HARDWARE', style: TextStyle(
                  color: brandYellow, fontSize: 10, fontWeight: FontWeight.w700,
                  letterSpacing: 2.2, height: 1.15)),
            ],
          ),
        ]),
      ),
    ),
  );
}

class HomePage extends StatelessWidget {
  const HomePage(
      {super.key,
      required this.onProduct,
      required this.onProducts,
      required this.onCategory});
  final ValueChanged<Product> onProduct;
  final VoidCallback onProducts;
  final ValueChanged<String> onCategory;
  @override
  Widget build(BuildContext context) =>
      ListView(padding: const EdgeInsets.fromLTRB(12, 16, 12, 24), children: [
        const Text('Hello, Shoppers!',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
        const SizedBox(height: 10),
        SearchField(
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
                builder: (_) => ProductSearchPage(onProduct: onProduct))),
            readOnly: true),
        const SizedBox(height: 18),
        Container(
            constraints: const BoxConstraints(minHeight: 210),
            child: Container(
                padding: const EdgeInsets.fromLTRB(20, 18, 14, 16),
                decoration: BoxDecoration(
                    color: const Color(0xFFF1F5EE),
                    borderRadius: BorderRadius.circular(10)),
                child: Row(children: [
                  Expanded(
                      child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        const Text('Quality Hardware\nfor Every Project',
                            style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 16,
                                height: 1.06)),
                        const SizedBox(height: 7),
                        const Text('Build to last. Made for you.',
                            style: TextStyle(fontSize: 12)),
                        const SizedBox(height: 14),
                        ShopNowButton(onTap: onProducts)
                      ])),
                  const Icon(Icons.home_repair_service_rounded,
                      color: green, size: 98)
                ]))),
        const SizedBox(height: 22),
        Header(title: 'Categories', onTap: () {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (categoryContext) => CategoriesPage(onCategory: (category) {
              Navigator.of(categoryContext).push(MaterialPageRoute(
                builder: (context) => CategoryProductsPage(
                  onProduct: onProduct,
                  category: category,
                ),
              ));
            }),
          ));
        }),
        const SizedBox(height: 10),
        SizedBox(
            height: 80 + MediaQuery.textScalerOf(context).scale(40),
            child: ListView(scrollDirection: Axis.horizontal, children: [
              for (final category in (products.map((product) => product.category).toSet().toList()..sort()))
                Category(category, CategoriesPage.categoryIcon(category),
                    onTap: () => onCategory(category)),
            ])),
        const SizedBox(height: 22),
        const Header(title: 'Featured Products'),
        const SizedBox(height: 10),
        GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: groupedProducts(products).take(3).length,
            gridDelegate: responsiveGrid(context, phoneColumns: 2),
            itemBuilder: (_, index) {
              final product = groupedProducts(products)[index];
              return ProductCard(
                  product: product, variants: productOptions(product), onTap: () => onProduct(product));
            }),
      ]);
}

class CatalogPage extends StatefulWidget {
  const CatalogPage(
      {super.key,
      required this.onProduct,
      required this.onBack,
      this.backLabel = 'Back to Home',
      required this.initialCategories});
  final String backLabel;
  final ValueChanged<Product> onProduct;
  final VoidCallback onBack;
  final Set<String> initialCategories;
  @override
  State<CatalogPage> createState() => _CatalogPageState();
}

class _CatalogPageState extends State<CatalogPage> {
  late Set<String> categories;
  String query = '';
  @override
  void initState() {
    super.initState();
    categories = Set.of(widget.initialCategories);
  }

  @override
  Widget build(BuildContext context) {
    final filters = ['All', ...(products.map((product) => product.category).toSet().toList()..sort())];
    final shown = groupedProducts(products.where((product) =>
            (categories.isEmpty || categories.contains(product.category)) &&
            '${product.name} ${product.unit}'.toLowerCase().contains(query.toLowerCase())))
        .toList();
    return CustomScrollView(slivers: [
      SliverToBoxAdapter(child: Column(children: [
      Padding(
          padding: const EdgeInsets.fromLTRB(12, 16, 12, 18),
          child: Row(children: [
            IconButton(
                tooltip: widget.backLabel,
                style: IconButton.styleFrom(
                    foregroundColor: green,
                    backgroundColor: const Color(0xFFF1F5EE)),
                onPressed: widget.onBack,
                icon: const Icon(Icons.arrow_back_ios_new, size: 18)),
            const Expanded(child: Center(child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Text('Product Catalog',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: green))))),
            const SizedBox(width: 48)
          ])),
      Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: SearchField(
              onTap: () {},
              onChanged: (value) => setState(() => query = value))),
      const Padding(
        padding: EdgeInsets.fromLTRB(12, 10, 12, 0),
        child: Align(alignment: Alignment.centerLeft,
          child: Text('Browse all products', style: TextStyle(fontWeight: FontWeight.w600))),
      ),
      const SizedBox(height: 10),
      SizedBox(
          height: 24 + MediaQuery.textScalerOf(context).scale(24),
          child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: filters
                  .map((filter) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                          label: Text(filter),
                          selected: filter == 'All' ? categories.isEmpty : categories.contains(filter),
                          selectedColor: green,
                          labelStyle: TextStyle(
                              color: (filter == 'All' ? categories.isEmpty : categories.contains(filter))
                                  ? Colors.white
                                  : Colors.black,
                              fontSize: 14),
                          onSelected: (_) => setState(() {
                            categories = filter == 'All' ? {} : {filter};
                          }))))
                  .toList())),
      ])),
      if (shown.isEmpty)
        const SliverFillRemaining(hasScrollBody: false, child: Center(child: Text('No products found')))
      else
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(12, 16, 12, 20),
          sliver: SliverGrid(
            gridDelegate: responsiveGrid(context, phoneColumns: 2),
            delegate: SliverChildBuilderDelegate((context, index) => ProductCard(
              product: shown[index], variants: productOptions(shown[index]), onTap: () => widget.onProduct(shown[index])),
              childCount: shown.length),
          )),
    ]);
  }
}

class CategoryProductsPage extends StatelessWidget {
  const CategoryProductsPage({super.key, required this.category, required this.onProduct});
  final String category;
  final ValueChanged<Product> onProduct;

  @override
  Widget build(BuildContext context) {
    final items = groupedProducts(products.where((product) => product.category == category));
    return Scaffold(
      appBar: AppBar(
        title: Text(category),
        leading: IconButton(tooltip: 'Back to Categories',
          icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.of(context).pop()),
      ),
      body: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(padding: const EdgeInsets.all(16),
          child: Text('${items.length} ${items.length == 1 ? 'product' : 'products'} in $category')),
        Expanded(child: ProductResults(items: items, onProduct: onProduct,
          emptyMessage: 'No products in this category yet.')),
      ]),
    );
  }
}

class ProductSearchPage extends StatefulWidget {
  const ProductSearchPage({super.key, required this.onProduct});
  final ValueChanged<Product> onProduct;
  @override
  State<ProductSearchPage> createState() => _ProductSearchPageState();
}

class _ProductSearchPageState extends State<ProductSearchPage> {
  final controller = TextEditingController();
  @override
  void dispose() { controller.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final query = controller.text.trim().toLowerCase();
    final matches = query.isEmpty ? <Product>[] : groupedProducts(products.where((product) =>
        '${product.name} ${product.unit}'.toLowerCase().contains(query)));
    return Scaffold(
      appBar: AppBar(title: const Text('Search Products')),
      body: Column(children: [
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          controller: controller,
          autofocus: true,
          textInputAction: TextInputAction.search,
          onChanged: (_) => setState(() {}),
          onSubmitted: (_) => FocusScope.of(context).unfocus(),
          decoration: InputDecoration(
            hintText: 'Search by product name...',
            prefixIcon: const Icon(Icons.search),
            suffixIcon: controller.text.isEmpty ? null : IconButton(
              tooltip: 'Clear search', icon: const Icon(Icons.close),
              onPressed: () => setState(controller.clear)),
            border: const OutlineInputBorder(),
          ),
        )),
        if (query.isNotEmpty) Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Align(alignment: Alignment.centerLeft,
            child: Text('${matches.length} ${matches.length == 1 ? 'result' : 'results'} for "${controller.text.trim()}"'))),
        Expanded(child: query.isEmpty
          ? const Center(child: Padding(padding: EdgeInsets.all(24),
              child: Text('What are you looking for?\nType a product name, such as hammer or cement.',
                textAlign: TextAlign.center)))
          : ProductResults(items: matches, onProduct: widget.onProduct,
              emptyMessage: 'No matching products. Try another product name.')),
      ]),
    );
  }
}

class ProductResults extends StatelessWidget {
  const ProductResults({super.key, required this.items, required this.onProduct,
    required this.emptyMessage});
  final List<Product> items;
  final ValueChanged<Product> onProduct;
  final String emptyMessage;
  @override
  Widget build(BuildContext context) => items.isEmpty
    ? Center(child: Padding(padding: const EdgeInsets.all(24),
        child: Text(emptyMessage, textAlign: TextAlign.center)))
    : GridView.builder(
        padding: const EdgeInsets.all(16),
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        gridDelegate: responsiveGrid(context, phoneColumns: 2),
        itemCount: groupedProducts(items).length,
        itemBuilder: (_, index) {
          final item = groupedProducts(items)[index];
          return ProductCard(product: item, variants: productOptions(item),
            onTap: () => onProduct(item));
        },
      );
}

class CategoriesPage extends StatelessWidget {
  const CategoriesPage({super.key, required this.onCategory});
  final ValueChanged<String> onCategory;

  static IconData categoryIcon(String category) => switch (category) {
    'Tools' => Icons.handyman,
    'Plumbing' => Icons.plumbing,
    'Electrical' => Icons.bolt,
    'Paints' => Icons.format_paint,
    'Construction' => Icons.construction,
    _ => Icons.inventory_2,
  };

  @override
  Widget build(BuildContext context) {
    final categories = products.map((product) => product.category).toSet().toList()..sort();
    return Scaffold(
      appBar: AppBar(title: const Text('All Categories')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: categories.length,
        separatorBuilder: (_, index) => const SizedBox(height: 10),
        itemBuilder: (_, index) {
          final category = categories[index];
          final count = groupedProducts(products.where((product) => product.category == category)).length;
          return Card(
            margin: EdgeInsets.zero,
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Icon(categoryIcon(category), color: green, size: 32),
              title: Text(category, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              subtitle: Text('$count ${count == 1 ? 'product' : 'products'}'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => onCategory(category),
            ),
          );
        },
      ),
    );
  }
}

class ProductPage extends StatefulWidget {
  const ProductPage(
      {super.key,
      required this.product,
      required this.variants,
      required this.onAdd,
      this.cartQuantity,
      required this.onBuyNow, required this.cartCount, required this.onOpenCart});
  final Product product;
  final List<Product> variants;
  final int Function(Product)? cartQuantity;
  final void Function(Product, int) onAdd;
  final void Function(Product, int) onBuyNow;
  final int Function() cartCount;
  final VoidCallback onOpenCart;
  @override
  State<ProductPage> createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  int quantity = 1;
  late Product selectedVariant;
  String? selectedNailSize;
  String? selectedNailAmount;
  int get remaining => (selectedVariant.stock - (widget.cartQuantity?.call(selectedVariant) ?? 0))
      .clamp(0, selectedVariant.stock > 0 ? selectedVariant.stock : 0);
  Timer? confirmationTimer;
  int confirmationVersion = 0;
  bool added = false;
  bool variantChosen = false;
  bool get isChbProduct => isHollowBlock(widget.product);
  bool get isNail => isNailProduct(widget.product);
  List<Product> get sizeOptions => widget.variants.isEmpty ? [widget.product] : widget.variants;
  List<Product> get nailOptions => sizeOptions.where(isNailProduct).toList();
  List<String> get nailSizeChoices {
    final available = nailOptions.map(productVariantSizeLabel).toSet();
    const order = ['Uno', 'Dos', 'Tres', 'Kwatro', 'Singko', 'Sais'];
    return [...order.where(available.contains), ...available.where((value) => !order.contains(value))];
  }
  List<String> get nailAmountChoices {
    final available = nailOptions.map(productVariantAmountLabel).toSet();
    const order = ['1/4 kg', '1/2 kg', '1 kg'];
    return [...order.where(available.contains), ...available.where((value) => !order.contains(value))];
  }
  List<String> get availableNailAmountChoices {
    if (selectedNailSize == null) return const [];
    final available = nailOptions.where((option) => productVariantSizeLabel(option) == selectedNailSize)
        .map(productVariantAmountLabel).toSet();
    const order = ['1/4 kg', '1/2 kg', '1 kg'];
    return [...order.where(available.contains), ...available.where((value) => !order.contains(value))];
  }
  bool get requiresSizeChoice => widget.variants.length > 1 || isChbProduct || isNail || sizeOptions.any(hasExplicitProductSize);
  @override
  void initState() {
    super.initState();
    selectedVariant = widget.variants.firstWhere(
      (variant) => variant.stock > 0,
      orElse: () => widget.product,
    );
  }
  void add() {
    if (requiresSizeChoice && !variantChosen) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(isChbProduct
            ? 'Choose a hollowblock type first.'
            : isNail ? 'Choose a nail size and package amount first.' : 'Choose a size first.'),
      ));
      return;
    }
    if (quantity < 1 || quantity > remaining) return;
    widget.onAdd(selectedVariant, quantity);
    confirmationTimer?.cancel();
    setState(() {
      added = true;
      quantity = 1;
      confirmationVersion++;
    });
    confirmationTimer = Timer(const Duration(seconds: 2), () {
      if (mounted) setState(() => added = false);
    });
  }

  @override
  void dispose() {
    confirmationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
          centerTitle: true,
          actions: [
            IconButton(
              tooltip: 'Open cart',
              onPressed: widget.onOpenCart,
              icon: Badge(
                isLabelVisible: widget.cartCount() > 0,
                label: Text('${widget.cartCount()}'),
                child: const Icon(Icons.shopping_cart, color: green, size: 28),
              ),
            ),
            const SizedBox(width: 8),
          ],
          title: Text(widget.product.name,
              style:
                  const TextStyle(fontSize: 15, fontWeight: FontWeight.w700))),
      body: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 18),
          child: Column(children: [
            Expanded(
                child: ListView(children: [
              SizedBox(
                  height: 245,
                  child: Center(
                      child: ProductGallery(
                          key: ValueKey(selectedVariant.id),
                          name: widget.product.name,
                          imageUrls: selectedVariant.imageUrls,
                          fallbackUrl: selectedVariant.imageUrl))),
              const SizedBox(height: 12),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text(widget.product.name,
                    style: const TextStyle(
                        fontSize: 19, fontWeight: FontWeight.w800))),
                Flexible(child: Text(requiresSizeChoice && !variantChosen ? 'Choose a size' : selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock',
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                        color: green,
                        fontSize: 14,
                        fontWeight: FontWeight.w700)))
              ]),
              const SizedBox(height: 4),
              Text(requiresSizeChoice && !variantChosen
                  ? 'Price depends on the selected size'
                  : '₱ ${selectedVariant.price.toStringAsFixed(2)}',
                  style: TextStyle(
                      fontSize: requiresSizeChoice && !variantChosen ? 13 : 17,
                      color: requiresSizeChoice && !variantChosen ? Colors.black54 : Colors.black87,
                      fontWeight: FontWeight.w800)),
              const SizedBox(height: 22),
              const Text('Description',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
              const SizedBox(height: 6),
              Text(
                  selectedVariant.description ?? '${widget.product.name}, sold per ${selectedVariant.unit}. Contact ELEE Hardware for specifications.',
                  style: const TextStyle(
                      color: Colors.black54, fontSize: 14, height: 1.35)),
              const SizedBox(height: 19),
              if (requiresSizeChoice) ...[
                Text(isChbProduct ? 'Choose hollowblock type' : isNail ? 'Choose nail size and amount' : 'Choose unit / size',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                const SizedBox(height: 8),
                if (isNail)
                  Column(children: [
                    DropdownButtonFormField<String>(
                      value: selectedNailSize,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Nail size',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      hint: const Text('Pumili ng Uno, Dos, Tres, atbp.'),
                      items: nailSizeChoices.map((size) => DropdownMenuItem(value: size, child: Text(size))).toList(),
                      onChanged: (size) {
                        if (size == null) return;
                        setState(() {
                          selectedNailSize = size;
                          selectedNailAmount = null;
                          variantChosen = false;
                          quantity = 1;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      value: selectedNailAmount,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Timbang',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      hint: Text(selectedNailSize == null ? 'Pili muna ng nail size' : 'Pumili ng timbang'),
                      items: const ['1/4 kg', '1/2 kg', '1 kg'].map((amount) {
                        final available = availableNailAmountChoices.contains(amount);
                        return DropdownMenuItem(
                          value: amount,
                          enabled: available,
                          child: Text(available ? amount : '$amount · Hindi pa available'),
                        );
                      }).toList(),
                      onChanged: selectedNailSize == null ? null : (amount) {
                        if (amount == null) return;
                        final matches = nailOptions.where((option) =>
                            productVariantSizeLabel(option) == selectedNailSize &&
                            productVariantAmountLabel(option) == amount).toList();
                        if (matches.isEmpty) return;
                        setState(() {
                          selectedNailAmount = amount;
                          selectedVariant = matches.first;
                          quantity = 1;
                          variantChosen = true;
                        });
                      },
                    ),
                  ])
                else
                  Column(children: [
                    for (final variant in sizeOptions)
                      _SizeOptionCard(
                        variant: variant,
                        sizeLabel: productVariantSizeLabel(variant),
                        amountLabel: isChbProduct ? productVariantAmountLabel(variant) : '',
                        showUnitAmount: isChbProduct,
                        selected: variantChosen && sameProduct(variant, selectedVariant),
                        onTap: () => setState(() {
                          selectedVariant = variant;
                          quantity = 1;
                          variantChosen = true;
                        }),
                      ),
                  ]),
                if (requiresSizeChoice && !variantChosen) const Padding(
                  padding: EdgeInsets.only(top: 6),
                  child: Text('Select a size before adding this product.',
                      style: TextStyle(fontSize: 12, color: Colors.black54)),
                ),
                const SizedBox(height: 14),
              ],
              if (!requiresSizeChoice || variantChosen) ...[
                const Text('Unit',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                Text('Per ${productVariantAmountLabel(selectedVariant)}   (${selectedVariant.stock.clamp(0, 2147483647)} in stock)',
                    style: const TextStyle(fontSize: 14)),
                Text('$remaining available to add to cart',
                    style: const TextStyle(fontSize: 14)),
              ],
              const SizedBox(height: 18),
              const Text('Quantity',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
              QuantityControl(
                  value: quantity,
                  max: remaining,
                  onChanged: (value) => setState(() => quantity = value))
            ])),
            OutlinedButton(
                style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 42),
                    side: const BorderSide(color: border),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6))),
                onPressed: quantity <= remaining && (!requiresSizeChoice || variantChosen) ? add : null,
                child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    transitionBuilder: (child, animation) => ScaleTransition(
                        scale: animation,
                        child:
                            FadeTransition(opacity: animation, child: child)),
                    child: added
                        ? Row(
                            key: ValueKey(confirmationVersion),
                            mainAxisSize: MainAxisSize.min,
                            children: [
                                const Icon(Icons.check_circle,
                                    color: green, size: 20),
                                const SizedBox(width: 8),
                                Flexible(
                                    child: Text('${widget.product.name} added',
                                        style: const TextStyle(color: green)))
                              ])
                        : const Text('Add to Cart',
                            key: ValueKey('add'),
                            style: TextStyle(color: Colors.black)))),
            const SizedBox(height: 10),
            GreenButton(
                label: 'Buy Now',
                onTap: selectedVariant.stock < quantity || (requiresSizeChoice && !variantChosen) ? null : () {
                  widget.onBuyNow(selectedVariant, quantity);
                })
          ])));
}

class CartPage extends StatefulWidget {
  const CartPage(
      {super.key,
      required this.cart,
      required this.onChanged,
      required this.onRemoveItem,
      required this.onSelectRecommendation,
      required this.onCheckout,
      required this.onBack});
  final List<CartItem> cart;
  final VoidCallback onChanged, onCheckout, onBack;
  final ValueChanged<CartItem> onRemoveItem;
  final ValueChanged<Product> onSelectRecommendation;
  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  bool deleteMode = false;
  List<CartItem> get selectedItems => widget.cart.where((item) => item.selected).toList();
  num get deliveryFee => selectedItems.isEmpty ? 0 : currentDeliveryFee;
  num get subtotal => selectedItems
      .fold(0, (sum, item) => sum + item.product.price * item.quantity);
  List<Product> get recommendations =>
      RecommendationEngine.forCart(selectedItems);
  void confirmRemove(CartItem item) {
    showDialog<void>(
        context: context,
        builder: (dialogContext) => AlertDialog(
                title: const Text('Remove this item?'),
                content: Text(
                    '${item.product.name} will be removed from your cart.'),
                actions: [
                  TextButton(
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Cancel')),
                  FilledButton(
                      style: FilledButton.styleFrom(
                          backgroundColor: Colors.red.shade700),
                      onPressed: () {
                        widget.onRemoveItem(item);
                        Navigator.pop(dialogContext);
                        if (widget.cart.isEmpty) {
                          setState(() => deleteMode = false);
                        }
                      },
                      child: const Text('Remove'))
                ]));
  }

  @override
  Widget build(BuildContext context) => Column(children: [
        Padding(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 10),
            child: Row(children: [
              IconButton(
                  tooltip: 'Back to Home',
                  onPressed: widget.onBack,
                  icon: const Icon(Icons.arrow_back)),
              Expanded(child: Text(deleteMode ? 'Select item to remove' : 'My Cart', textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.w800))),
              IconButton(
                  tooltip: deleteMode ? 'Done' : 'Delete items',
                  onPressed: widget.cart.isEmpty
                      ? null
                      : () => setState(() => deleteMode = !deleteMode),
                  icon: Icon(deleteMode ? Icons.close : Icons.delete_outline))
            ])),
        Expanded(
            child: widget.cart.isEmpty
                ? const Center(child: Text('Your cart is empty'))
                : ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    children: [
                        CheckboxListTile(
                          title: Text('Select all (${selectedItems.length}/${widget.cart.length})'),
                          controlAffinity: ListTileControlAffinity.leading,
                          contentPadding: EdgeInsets.zero,
                          tristate: true,
                          value: selectedItems.isEmpty ? false : selectedItems.length == widget.cart.length ? true : null,
                          onChanged: (_) {
                            final selectAll = selectedItems.length != widget.cart.length;
                            for (final item in widget.cart) { item.selected = selectAll; }
                            widget.onChanged();
                          },
                        ),
                        for (final item in widget.cart)
                          CartRow(
                              item: item,
                              onChanged: widget.onChanged,
                              showDelete: deleteMode,
                              onRemove: () => confirmRemove(item)),
                        const Divider(),
                        const SizedBox(height: 8),
                        Row(children: [
                          Icon(Icons.auto_awesome, size: 18),
                          SizedBox(width: 8),
                          Expanded(child: Text(recommendations.any((product)=>selectedItems.any((item)=>products.any((source)=>source.id==item.product.id && source.mlScores.containsKey(product.id)))) ? 'AI Recommendations' : 'Related Products',
                              style: TextStyle(fontWeight: FontWeight.w800)))
                        ]),
                        const SizedBox(height: 6),
                        const Text(
                            'Based on your selected items, you might also need',
                            style:
                                TextStyle(fontSize: 13, color: Colors.black54)),
                        const SizedBox(height: 8),
                        for (final product in recommendations)
                          AiRecommendation(
                              product: product,
                              onAdd: () => widget.onSelectRecommendation(product)),
                        const Divider(height: 30),
                        PriceRow('Subtotal', subtotal),
                        PriceRow('Estimated Delivery Fee', deliveryFee),
                        PriceRow('Total', subtotal + deliveryFee, bold: true)
                      ])),
        if (widget.cart.isNotEmpty)
          Padding(
              padding: const EdgeInsets.all(20),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                if (selectedItems.isEmpty) const Padding(padding: EdgeInsets.only(bottom: 8), child: Text('Select items to checkout')),
                GreenButton(label: 'Checkout (${selectedItems.length})', onTap: selectedItems.isEmpty ? null : widget.onCheckout),
              ]))
      ]);
}

class AiRecommendation extends StatelessWidget {
  const AiRecommendation(
      {super.key, required this.product, required this.onAdd});
  final Product product;
  final VoidCallback onAdd;
  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.only(bottom: 9),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
          border: Border.all(color: border),
          borderRadius: BorderRadius.circular(8)),
      child: Row(children: [
        Icon(product.icon, size: 36, color: Colors.grey),
        const SizedBox(width: 12),
        Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(product.name,
              style:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
          Text('₱ ${product.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13))
        ])),
        OutlinedButton(onPressed: product.stock > 0 ? onAdd : null, child: const Text('Choose'))
      ]));
}

class CheckoutPage extends StatefulWidget {
  const CheckoutPage(
      {super.key,
      required this.total,
      this.cartItems = const [],
      required this.onOrderPlaced});
  final VoidCallback onOrderPlaced;
  final num total;
  final List<CartItem> cartItems;
  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final formKey = GlobalKey<FormState>();
  final name = TextEditingController();
  final mobile = TextEditingController();
  final address = TextEditingController();
  final houseNumber = TextEditingController();
  PaymentMethod paymentMethod = PaymentMethod.cashOnDelivery;
  FulfillmentMethod fulfillmentMethod = FulfillmentMethod.delivery;
  bool orderPlaced = false;
  Timer? settingsUpdates;
  bool settingsLoading = false;
  String? settingsError;
  List<FulfillmentMethod> get availableMethods => FulfillmentMethod.values.where((method) =>
      currentStoreSettings[method == FulfillmentMethod.delivery ? 'delivery_enabled' : 'pickup_enabled'] != false).toList();

  @override
  void initState() {
    super.initState();
    if (availableMethods.isNotEmpty && !availableMethods.contains(fulfillmentMethod)) {
      fulfillmentMethod = availableMethods.first;
      if (fulfillmentMethod == FulfillmentMethod.storePickup) paymentMethod = PaymentMethod.cashAtStore;
    }
    if (orderRepository is ApiOrderRepository) {
      updateSettings();
      settingsUpdates = Timer.periodic(const Duration(seconds: 10), (_) => updateSettings());
    }
  }

  Future<void> updateSettings() async {
    if (settingsLoading || orderPlaced || !mounted) return;
    settingsLoading = true;
    try {
      final api = (orderRepository as ApiOrderRepository).api;
      final settings = await api.fetchStore();
      if (!mounted || orderPlaced) return;
      setState(() {
        currentStoreSettings = settings;
        currentDeliveryFee = api.deliveryFee;
        settingsError = null;
        if (availableMethods.isNotEmpty && !availableMethods.contains(fulfillmentMethod)) {
          fulfillmentMethod = availableMethods.first;
          if (fulfillmentMethod == FulfillmentMethod.storePickup) paymentMethod = PaymentMethod.cashAtStore;
        }
      });
    } catch (_) {
      if (mounted) setState(() => settingsError = 'Could not update store settings.');
    } finally { settingsLoading = false; }
  }
  num get deliveryFee => fulfillmentMethod == FulfillmentMethod.delivery ? currentDeliveryFee : 0;
  num get orderTotal => widget.cartItems.fold<num>(0,
      (sum, item) => sum + item.product.price * item.quantity) + deliveryFee;
  @override
  void dispose() {
    settingsUpdates?.cancel();
    name.dispose();
    mobile.dispose();
    address.dispose();
    houseNumber.dispose();
    super.dispose();
  }

  void placeOrder() {
    if (!availableMethods.contains(fulfillmentMethod)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Ordering is currently unavailable.')));
      return;
    }
    if (orderPlaced || !formKey.currentState!.validate()) return;
    if (widget.cartItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Add an item to your cart before placing an order.')));
      return;
    }
    FocusScope.of(context).unfocus();
    showDialog<void>(
        context: context,
        builder: (dialogContext) => AlertDialog(
                title: const Text('Confirm your details?'),
                content: SingleChildScrollView(
                    child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Text('Receive: ${fulfillmentMethod.label}'),
                      Text('Payment: ${paymentMethod.label}'),
                      if (name.text.trim().isNotEmpty)
                        Text('Name: ${name.text.trim()}'),
                      if (mobile.text.trim().isNotEmpty)
                        Text('Mobile: ${mobile.text.trim()}'),
                      if (fulfillmentMethod == FulfillmentMethod.delivery)
                        Text('Address: ${houseNumber.text.trim()}, ${address.text.trim()}'),
                      const SizedBox(height: 12),
                      Text('Total: ₱${orderTotal.toStringAsFixed(2)}',
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      const Text('Payment Status: Unpaid'),
                      const SizedBox(height: 12),
                      Text(paymentMethod.instructions),
                      if (orderRepository is LocalOrderRepository) ...[
                        const SizedBox(height: 12),
                        const Text('This order will be saved on this device only. It will not be submitted to the store.'),
                      ],
                    ])),
                actions: [
                  TextButton(
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Cancel')),
                  FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: green),
                      onPressed: () async {
                        if (orderPlaced) return;
                        setState(() => orderPlaced = true);
                        final orderNumber = newOrderNumber();
                        final customerName = name.text.trim();
                        final customerMobile = mobile.text.trim();
                        final customerAddress = fulfillmentMethod == FulfillmentMethod.delivery
                            ? '${houseNumber.text.trim()}, ${address.text.trim()}' : '';
                        final savedTotal = orderTotal;
                        final savedDeliveryFee = deliveryFee;
                        final savedPayment = paymentMethod;
                        final savedFulfillment = fulfillmentMethod;
                        final savedItems = widget.cartItems
                            .map((item) => CartItem(item.product, item.quantity)).toList();
                        Navigator.pop(dialogContext);
                        try {
                          final order = <String, dynamic>{
                            'order_number': orderNumber,
                            'created_at': DateTime.now().toUtc().toIso8601String(),
                            'customer_name': customerName,
                            'mobile_number': customerMobile,
                            'address': customerAddress,
                            'payment_method': savedPayment == PaymentMethod.cashAtStore
                                ? 'cash_at_store' : 'cash_on_delivery',
                            'fulfillment_method': savedFulfillment.value,
                            'delivery_fee': savedDeliveryFee,
                            'payment_status': 'Unpaid',
                            'order_status': 'Pending',
                            'paid_at': null,
                            'total': savedTotal,
                            'items': savedItems.map((item) => {
                              'id': item.product.id, 'name': item.product.name,
                              'price': item.product.price, 'category': item.product.category,
                              'quantity': item.quantity,
                              'unit': item.product.unit,
                            }).toList(),
                          };
                          await orderRepository.save(order);
                          if (!mounted) return;
                          widget.onOrderPlaced();
                          Navigator.of(context).pushReplacement(MaterialPageRoute(
                              builder: (_) => ConfirmationPage(
                                  total: order['total'] as num, orderNumber: order['order_number'] as String,
                                  paymentMethod: savedPayment, fulfillmentMethod: savedFulfillment,
                                  cartItems: (order['items'] as List).map((item) => CartItem(
                                      Product.fromJson({...Map<String, dynamic>.from(item as Map),
                                        'id': item['product_id'] ?? item['id']}), item['quantity'] as int)).toList(),
                                  customerName: customerName, customerMobile: customerMobile,
                                  customerAddress: customerAddress)));
                        } catch (error) {
                          if (!mounted) return;
                          setState(() => orderPlaced = false);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(error is StoreApiException ? error.message
                                  : 'Could not save order. Your cart is unchanged. Please try again.')));
                        }
                      },
                      child: const Text('Confirm'))
                ]));
  }

  @override
  Widget build(BuildContext context) => PopScope(
      canPop: !orderPlaced,
      child: Scaffold(
      appBar: AppBar(
          automaticallyImplyLeading: !orderPlaced,
          centerTitle: true,
          title: const Text('Checkout',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700))),
      body: Form(
          key: formKey,
          child: SingleChildScrollView(padding: const EdgeInsets.all(20),
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('Receive Your Order',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
            const SizedBox(height: 8),
            DropdownButtonFormField<FulfillmentMethod>(
              key: ValueKey('fulfillment-${fulfillmentMethod.value}-${availableMethods.length}'),
              initialValue: availableMethods.contains(fulfillmentMethod) ? fulfillmentMethod : null,
              isExpanded: true,
              items: availableMethods.map((method) => DropdownMenuItem(
                  value: method, child: Text(method.label))).toList(),
              onChanged: orderPlaced ? null : (method) {
                if (method == null) return;
                setState(() {
                  fulfillmentMethod = method;
                  if (method == FulfillmentMethod.storePickup) {
                    paymentMethod = PaymentMethod.cashAtStore;
                  }
                });
              },
            ),
            const SizedBox(height: 8),
            if (availableMethods.isEmpty) const Text('Ordering is currently unavailable.', style: TextStyle(color: Colors.red)),
            if (settingsError != null) Text(settingsError!, style: const TextStyle(color: Colors.red)),
            if (fulfillmentMethod == FulfillmentMethod.delivery && currentStoreSettings['delivery_notice'] != null)
              Container(margin: const EdgeInsets.symmetric(vertical: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: const Color(0xFFFFF3D6), borderRadius: BorderRadius.circular(8)), child: Text(currentStoreSettings['delivery_notice'].toString(), style: const TextStyle(fontSize: 12, color: Color(0xFF805600)))),
            if (fulfillmentMethod == FulfillmentMethod.storePickup)
              for (final key in ['store_name', 'store_address', 'store_phone', 'store_hours'])
                if ((currentStoreSettings[key]?.toString() ?? '').isNotEmpty)
                  Padding(padding: const EdgeInsets.only(bottom: 6), child: Text(currentStoreSettings[key].toString())),
            Text(fulfillmentMethod == FulfillmentMethod.delivery
                ? 'Delivery fee: ₱${deliveryFee.toStringAsFixed(2)}'
                : 'Free pickup at ELEE Hardware Store.'),
            const SizedBox(height: 16),
            const Text('Customer Information',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
            CheckoutField(
                label: 'Full Name',
                enabled: !orderPlaced,
                controller: name,
                optional: fulfillmentMethod == FulfillmentMethod.storePickup && orderRepository is LocalOrderRepository,
                hint: fulfillmentMethod == FulfillmentMethod.storePickup
                    ? 'You can claim using your order number' : 'Enter your full name'),
            CheckoutField(
                label: 'Mobile Number',
                enabled: !orderPlaced,
                controller: mobile,
                optional: fulfillmentMethod == FulfillmentMethod.storePickup && orderRepository is LocalOrderRepository,
                hint: fulfillmentMethod == FulfillmentMethod.storePickup
                    ? 'For order updates, if provided' : 'Enter your mobile number',
                keyboardType: TextInputType.phone),
            const SizedBox(height: 16),
            if (fulfillmentMethod == FulfillmentMethod.delivery) ...[
            const Text('Delivery Address',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
            CheckoutField(
                label: 'House/Unit Number',
                enabled: !orderPlaced,
                controller: houseNumber,
                hint: 'e.g. 123, Blk 2 Lot 5, Unit 4B'),
            CheckoutField(
                label: 'Street, Barangay, City/Municipality, Province',
                enabled: !orderPlaced,
                controller: address,
                hint: 'Enter the rest of your delivery address'),
            const SizedBox(height: 16),
            ],
            const Text('Payment Method',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
            const SizedBox(height: 8),
            DropdownButtonFormField<PaymentMethod>(
                key: ValueKey(fulfillmentMethod),
                isExpanded: true,
                initialValue: paymentMethod,
                items: PaymentMethod.values.where((method) =>
                    fulfillmentMethod == FulfillmentMethod.delivery || method == PaymentMethod.cashAtStore).map((method) => DropdownMenuItem(
                    value: method, child: Text(method.label))).toList(),
                onChanged: orderPlaced ? null : (method) {
                  if (method != null) setState(() => paymentMethod = method);
                }),
            const SizedBox(height: 12),
            Text(paymentMethod.instructions),
            const SizedBox(height: 24),
            CheckoutSummary(items: widget.cartItems, total: orderTotal),
            const SizedBox(height: 24),
            if (orderRepository is LocalOrderRepository) ...[
              const Text('Saved on this device only. Not sent to the store.',
                  textAlign: TextAlign.center, style: TextStyle(color: Colors.black54)),
              const SizedBox(height: 12),
            ],
            GreenButton(label: orderPlaced ? 'Saving order...' : 'Place Order', onTap: orderPlaced ? null : placeOrder)
          ])))));
}

class CheckoutSummary extends StatelessWidget {
  const CheckoutSummary({super.key, required this.items, required this.total});
  final List<CartItem> items;
  final num total;

  @override
  Widget build(BuildContext context) {
    final subtotal = items.fold<num>(0,
        (sum, item) => sum + item.product.price * item.quantity);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: border),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Order Summary',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
          const SizedBox(height: 12),
          for (final item in items)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(item.product.icon, color: green, size: 28),
                  const SizedBox(width: 10),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.product.name,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Text('Qty: ${item.quantity} × ₱${item.product.price.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 14, color: Colors.black54)),
                    ],
                  )),
                  const SizedBox(width: 8),
                  Flexible(child: Text('₱${(item.product.price * item.quantity).toStringAsFixed(2)}',
                      textAlign: TextAlign.right,
                      style: const TextStyle(fontWeight: FontWeight.w700))),
                ],
              ),
            ),
          const Divider(),
          PriceRow('Subtotal', subtotal),
          PriceRow('Delivery Fee', total - subtotal),
          PriceRow('Total', total, bold: true),
        ],
      ),
    );
  }
}

class CheckoutField extends StatelessWidget {
  const CheckoutField(
      {super.key,
      required this.label,
      required this.controller,
      required this.hint,
      this.keyboardType,
      this.isMobile = false,
      this.enabled = true,
      this.optional = false});
  final String label, hint;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final bool isMobile;
  final bool optional;
  final bool enabled;
  @override
  Widget build(BuildContext context) {
    final mobileField = isMobile || label == 'Mobile Number';
    return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: TextFormField(
            enabled: enabled,
            controller: controller,
            keyboardType: keyboardType,
            inputFormatters: mobileField
                ? [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(11)
                  ]
                : null,
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return optional ? null : 'Please enter your $label';
              }
              if (mobileField && !RegExp(r'^\d{11}$').hasMatch(value)) {
                return 'Mobile number must have exactly 11 digits';
              }
              return null;
            },
            decoration: InputDecoration(
                labelText: optional ? '$label (Optional)' : label,
                hintText: hint,
                isDense: true,
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(6)))));
  }
}

class ConfirmationPage extends StatelessWidget {
  const ConfirmationPage(
      {super.key,
      this.total = 0,
      this.cartItems = const [],
      this.customerName = '',
      this.customerMobile = '',
      this.customerAddress = '',
      required this.orderNumber,
      this.fulfillmentMethod,
      this.paymentMethod = PaymentMethod.cashOnDelivery});
  final num total;
  final List<CartItem> cartItems;
  final String customerName, customerMobile, customerAddress;
  final String orderNumber;
  final PaymentMethod paymentMethod;
  final FulfillmentMethod? fulfillmentMethod;
  @override
  Widget build(BuildContext context) => Scaffold(
      body: SafeArea(child: Center(child: SingleChildScrollView(
          child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircleAvatar(
                        radius: 30,
                        backgroundColor: green,
                        child:
                            Icon(Icons.check, color: Colors.white, size: 38)),
                    const SizedBox(height: 18),
                    Text(orderRepository is LocalOrderRepository ? 'Order Saved!' : 'Order Confirmed!',
                        style: TextStyle(
                            color: green,
                            fontSize: 23,
                            fontWeight: FontWeight.w800)),
                    const SizedBox(height: 10),
                    Text(
                        orderRepository is LocalOrderRepository
                            ? 'Saved on this device. Not sent to the store.' : 'Your order has been sent to the store.',
                        textAlign: TextAlign.center),
                    const SizedBox(height: 24),
                    InfoBox('Order Number', orderNumber),
                    OrderQueueButton(orderNumber: orderNumber),
                    const SizedBox(height: 12),
                    InfoBox('Receive Your Order', fulfillmentMethod?.label ?? 'Not recorded'),
                    const SizedBox(height: 12),
                    InfoBox('Payment Method', paymentMethod.label),
                    const SizedBox(height: 12),
                    const InfoBox('Payment Status', 'Unpaid'),
                    const SizedBox(height: 12),
                    Text(paymentMethod.instructions, textAlign: TextAlign.center),
                    const SizedBox(height: 24),
                    GreenButton(
                        label: 'View Digital Receipt',
                        onTap: () => Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                                builder: (_) => ReceiptPage(
                                    total: total,
                                    orderNumber: orderNumber,
                                    paymentMethod: paymentMethod,
                                    fulfillmentMethod: fulfillmentMethod,
                                    cartItems: cartItems,
                                    customerName: customerName,
                                    customerMobile: customerMobile,
                                    customerAddress: customerAddress)))),
                    const SizedBox(height: 12),
                    TextButton.icon(
                        onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                        icon: const Icon(Icons.storefront_outlined),
                        label: const Text('Continue Shopping')),
                    const Text('Find this order in Saved receipts.',
                        textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: Colors.black54)),
                  ]))))));
}

class ReceiptPage extends StatefulWidget {
  const ReceiptPage(
      {super.key,
      required this.total,
      required this.cartItems,
      required this.customerName,
      required this.customerMobile,
      required this.customerAddress,
      required this.orderNumber,
      this.receiptSaver = saveReceiptPdf,
      this.fulfillmentMethod,
      this.paymentMethod = PaymentMethod.cashOnDelivery});
  final num total;
  final ReceiptSaver receiptSaver;
  final List<CartItem> cartItems;
  final String customerName, customerMobile, customerAddress;
  final String orderNumber;
  final PaymentMethod paymentMethod;
  final FulfillmentMethod? fulfillmentMethod;
  @override
  State<ReceiptPage> createState() => _ReceiptPageState();
}

class _ReceiptPageState extends State<ReceiptPage> {
  Timer? statusUpdates;
  String paymentStatus = 'Unpaid';
  String orderStatus = 'Pending';
  String? paidAt;
  String? refreshError;
  String? deliveryNotice;
  bool refreshing = false;
  bool downloading = false;
  bool localReceipt = false;
  num get total => widget.total;
  List<CartItem> get cartItems => widget.cartItems;
  String get customerName => widget.customerName;
  String get customerMobile => widget.customerMobile;
  String get customerAddress => widget.customerAddress;
  String get orderNumber => widget.orderNumber;
  PaymentMethod get paymentMethod => widget.paymentMethod;
  FulfillmentMethod? get fulfillmentMethod => widget.fulfillmentMethod;

  @override
  void initState() {
    super.initState();
    refreshStatus();
    statusUpdates = Timer.periodic(const Duration(seconds: 10), (_) {
      if (mounted && ModalRoute.of(context)?.isCurrent == true) refreshStatus();
    });
  }

  @override
  void dispose() {
    statusUpdates?.cancel();
    super.dispose();
  }

  Future<void> refreshStatus({bool showFeedback = false}) async {
    if (refreshing || downloading) return;
    final previousPayment = paymentStatus;
    final previousOrder = orderStatus;
    if (showFeedback) ScaffoldMessenger.of(context).hideCurrentSnackBar();
    setState(() { refreshing = true; });
    try {
      final order = await orderRepository.get(orderNumber)
          .timeout(const Duration(seconds: 10));
      if (!mounted) return;
      setState(() {
        localReceipt = order['source'] != 'store';
        paymentStatus = order['payment_status'] as String;
        orderStatus = order['order_status'] as String;
        paidAt = order['paid_at'] as String?;
        deliveryNotice = order['delivery_notice'] as String?;
        refreshError = null;
      });
      if (showFeedback && mounted) {
        final changed = previousPayment != paymentStatus || previousOrder != orderStatus;
        showDialog<void>(context: context, builder: (dialogContext) => AlertDialog(
          title: Text(changed ? 'Payment status updated' : 'Receipt is up to date'),
          content: Text('Payment: $paymentStatus\nOrder: $orderStatus\n\n'
              '${localReceipt
                  ? 'Local record only.'
                  : changed ? 'The latest status has been loaded.' : 'No new payment or order update is available yet.'}'),
          actions: [TextButton(onPressed: () => Navigator.pop(dialogContext),
              child: const Text('OK'))],
        ));
      }
    } catch (_) {
      if (mounted) setState(() => refreshError = 'Could not refresh payment status. Please try again.');
    } finally {
      if (mounted) setState(() => refreshing = false);
    }
  }

  Future<void> downloadReceipt() async {
    if (downloading || refreshing) return;
    setState(() => downloading = true);
    try {
      // Re-read the source before exporting; never export a stale Paid status.
      final order = await orderRepository.get(orderNumber)
          .timeout(const Duration(seconds: 10));
      final bytes = await buildReceiptPdf(order,
          demo: order['source'] != 'store')
          .timeout(const Duration(seconds: 15));
      if (!mounted) return;
      setState(() {
        localReceipt = order['source'] != 'store';
        paymentStatus = order['payment_status'] as String;
        orderStatus = order['order_status'] as String;
        paidAt = order['paid_at'] as String?;
        refreshError = null;
      });
      final saved = await widget.receiptSaver(bytes, receiptFilename(order));
      if (!mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text(saved
            ? kIsWeb
                ? 'PDF download started. Check your browser downloads.'
                : 'PDF saved to your selected location.'
            : 'Save cancelled. No PDF was saved.')));
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(const SnackBar(content: Text(
              'Could not download receipt. Check your connection and try again.')));
      }
    } finally {
      if (mounted) setState(() => downloading = false);
    }
  }

  num get subtotal => cartItems.fold(
      0, (sum, item) => sum + item.product.price * item.quantity);
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
          centerTitle: true,
          title: const Text('Digital Order Receipt',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700))),
      body: ListView(
          padding: const EdgeInsets.fromLTRB(22, 8, 22, 25),
          children: [
            const Center(child: Brand()),
            OrderQueueButton(orderNumber: orderNumber),
            const SizedBox(height: 12),
            if (orderRepository is LocalOrderRepository || localReceipt)
              const Text('Saved on this device • Not submitted to the store', textAlign: TextAlign.center),
            if (refreshError != null)
              OutlinedButton.icon(onPressed: refreshing || downloading ? null : () => refreshStatus(),
                  icon: const Icon(Icons.replay), label: const Text('Retry')),
            if (refreshError != null) Text(refreshError!, style: const TextStyle(color: Colors.red)),
            if (deliveryNotice != null) Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Text(deliveryNotice!, style: const TextStyle(fontSize: 13, color: green))),
            FilledButton.icon(
                onPressed: refreshing || downloading ? null : downloadReceipt,
                icon: const Icon(Icons.download_outlined),
                label: Text(downloading ? 'Preparing PDF...' : paymentStatus == 'Paid'
                    ? 'Download Paid Receipt (PDF)' : 'Download Order Summary (PDF)')),
            const Text('Download your latest receipt after payment.',
                textAlign: TextAlign.center, style: TextStyle(fontSize: 12)),
            const SizedBox(height: 25),
            const Text('Order Number',
                style: TextStyle(fontSize: 13, color: Colors.black54)),
            Text(orderNumber,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                    border: Border.all(color: border),
                    borderRadius: BorderRadius.circular(7)),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Customer Information',
                          style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w800)),
                      const SizedBox(height: 7),
                      Text([customerName, customerMobile, customerAddress]
                          .where((value) => value.trim().isNotEmpty).join('\n'),
                          style: const TextStyle(fontSize: 13, height: 1.45))
                    ])),
            const SizedBox(height: 18),
            const Text('Order Details',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
            const SizedBox(height: 7),
            for (final item in cartItems)
              PriceRow('${item.product.name}  ×${item.quantity}',
                  item.product.price * item.quantity),
            const Divider(height: 23),
            PriceRow('Subtotal', subtotal),
            PriceRow('Delivery Fee', total - subtotal),
            PriceRow('Total', total, bold: true),
            const SizedBox(height: 16),
            InfoBox('Receive Your Order', fulfillmentMethod?.label ?? 'Not recorded'),
            const SizedBox(height: 12),
            InfoBox('Payment Method', paymentMethod.label),
            const SizedBox(height: 12),
            InfoBox('Payment Status', paymentStatus),
            const SizedBox(height: 12),
            Text(paymentStatus == 'Paid'
                ? 'Payment received.'
                : 'Order summary • Not proof of payment'),
            const SizedBox(height: 12),
            InfoBox('Order Status', orderStatus),
            if (paidAt != null) InfoBox('Payment recorded', DateTime.parse(paidAt!).toLocal().toString()),
            const SizedBox(height: 25),
            const Center(
                child: Text('Thank you for shopping with ELEE Hardware!',
                    style: TextStyle(
                        color: green,
                        fontSize: 13,
                        fontWeight: FontWeight.w700))),
            const SizedBox(height: 12),
            OutlinedButton.icon(
                onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                icon: const Icon(Icons.storefront_outlined),
                label: const Text('Continue Shopping')),
          ]));
}

class AiHelpPage extends StatefulWidget {
  const AiHelpPage({super.key});
  @override
  State<AiHelpPage> createState() => _AiHelpPageState();
}

class _AiHelpPageState extends State<AiHelpPage> {
  final input = TextEditingController();
  String message = 'Hi! I can help you find supplies for your project.';
  @override
  void dispose() {
    input.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Brand(small: true),
        const SizedBox(height: 28),
        const Text('ELEE AI Assistant',
            style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        const Text('Ask for product recommendations or project materials.',
            style: TextStyle(color: Colors.black54)),
        const SizedBox(height: 22),
        Container(
            width: double.infinity,
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
                color: const Color(0xFFF1F5EE),
                borderRadius: BorderRadius.circular(12)),
            child: Text(message)),
        const Spacer(),
        Row(children: [
          Expanded(
              child: TextField(
                  controller: input,
                  decoration: const InputDecoration(
                      hintText: 'Ask about a project',
                      border: OutlineInputBorder()))),
          IconButton.filled(
              onPressed: () {
                if (input.text.trim().isNotEmpty) {
                  setState(() {
                    message =
                        'I recommend checking the tools and materials in our product catalog.';
                    input.clear();
                  });
                }
              },
              icon: const Icon(Icons.send))
        ])
      ]));
}

class SearchField extends StatelessWidget {
  const SearchField(
      {super.key,
      required this.onTap,
      this.onChanged,
      this.readOnly = false});
  final VoidCallback onTap;
  final ValueChanged<String>? onChanged;
  final bool readOnly;
  @override
  Widget build(BuildContext context) => TextField(
      readOnly: readOnly,
      onTap: onTap,
      onChanged: onChanged,
      decoration: InputDecoration(
          hintText: 'Search products...',
          prefixIcon: const Icon(Icons.search),
          filled: true,
          fillColor: const Color(0xFFFAFAFA),
          isDense: true,
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: border))));
}

class Header extends StatelessWidget {
  const Header({super.key, required this.title, this.onTap});
  final String title;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) =>
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Expanded(child: Text(title,
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 17))),
        if (onTap != null) TextButton(onPressed: onTap, child: const Text('View all'))
      ]);
}

class Category extends StatelessWidget {
  const Category(this.label, this.icon, {super.key, required this.onTap});
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
          width: 112,
          margin: const EdgeInsets.only(right: 10),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
              border: Border.all(color: border),
              borderRadius: BorderRadius.circular(8)),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32, color: green),
              const SizedBox(height: 10),
              SizedBox(
                height: MediaQuery.textScalerOf(context).scale(40),
                child: Center(
                  child: Text(label,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          )));
}

class _SizeOptionCard extends StatelessWidget {
  const _SizeOptionCard({
    required this.variant,
    required this.sizeLabel,
    required this.amountLabel,
    required this.showUnitAmount,
    required this.selected,
    required this.onTap,
  });

  final Product variant;
  final String sizeLabel;
  final String amountLabel;
  final bool showUnitAmount;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 9),
        child: Material(
          color: selected ? const Color(0xFFF0F8F1) : Colors.white,
          borderRadius: BorderRadius.circular(10),
          child: InkWell(
            borderRadius: BorderRadius.circular(10),
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.all(13),
              decoration: BoxDecoration(
                border: Border.all(color: selected ? green : border, width: selected ? 1.6 : 1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(children: [
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(showUnitAmount ? 'SIZE' : 'SIZE / UNIT', style: const TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.w700, letterSpacing: .5)),
                    const SizedBox(height: 2),
                    Text(sizeLabel, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                    if (showUnitAmount) ...[
                      const SizedBox(height: 9),
                      const Text('UNIT / DAMI', style: TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.w700, letterSpacing: .5)),
                      const SizedBox(height: 2),
                      Text(amountLabel, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 5),
                    ] else
                      const SizedBox(height: 5),
                    Text(variant.stock > 0 ? '${variant.stock} in stock' : 'Out of stock',
                        style: TextStyle(fontSize: 11, color: variant.stock > 0 ? green : Colors.red.shade700)),
                  ]),
                ),
                const SizedBox(width: 10),
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  const Text('PRICE', style: TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.w700, letterSpacing: .5)),
                  const SizedBox(height: 3),
                  Text('₱${variant.price.toStringAsFixed(2)}',
                      textAlign: TextAlign.right,
                      style: const TextStyle(fontSize: 16, color: green, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Icon(selected ? Icons.check_circle : Icons.radio_button_unchecked,
                      color: selected ? green : Colors.black38, size: 20),
                ]),
              ]),
            ),
          ),
        ),
      );
}

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.product, required this.onTap, this.variants = const []});
  final Product product;
  final List<Product> variants;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => InkWell(
      onTap: onTap,
      child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
              border: Border.all(color: border),
              borderRadius: BorderRadius.circular(10)),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(
                child: Center(
                    child: ProductVisual(name: product.name, imageUrl: product.imageUrl))),
            Text(product.name,
                maxLines: 2, overflow: TextOverflow.ellipsis,
                style:
                    const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
            Text('${variants.length > 1 ? 'From ' : ''}₱${(variants.isEmpty ? product.price : variants.map((variant) => variant.price).reduce((a, b) => a < b ? a : b)).toStringAsFixed(2)}',
                style: const TextStyle(
                    fontSize: 14, color: green, fontWeight: FontWeight.w800)),
            Text(variants.length > 1 ? '${variants.length} sizes available' : 'Per ${product.unit}',
                style: const TextStyle(fontSize: 12, color: Colors.black54))
          ])));
}

class QuantityControl extends StatelessWidget {
  const QuantityControl(
      {super.key, required this.value, required this.onChanged, this.max});
  final int value;
  final int? max;
  final ValueChanged<int> onChanged;
  @override
  Widget build(BuildContext context) => Row(children: [
        IconButton(
            onPressed: value > 1 ? () => onChanged(value - 1) : null,
            icon: const Icon(Icons.remove_circle_outline)),
        Text('$value'),
        IconButton(
            onPressed: max == null || value < max! ? () => onChanged(value + 1) : null,
            icon: const Icon(Icons.add_circle_outline))
      ]);
}

class CartRow extends StatelessWidget {
  const CartRow(
      {super.key,
      required this.item,
      required this.onChanged,
      required this.onRemove,
      required this.showDelete});
  final CartItem item;
  final VoidCallback onChanged, onRemove;
  final bool showDelete;
  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(9),
      decoration: BoxDecoration(
          border: Border.all(color: showDelete ? const Color(0xFFFFD5D5) : border),
          borderRadius: BorderRadius.circular(8)),
      child: LayoutBuilder(builder: (context, constraints) {
        final controls = showDelete
            ? IconButton(tooltip: 'Remove this item', onPressed: onRemove,
                icon: const Icon(Icons.remove_circle, color: Colors.red, size: 27))
            : QuantityControl(value: item.quantity, max: item.product.stock,
                onChanged: (value) {
                  if (value < 1 || value > item.product.stock) return;
                  item.quantity = value;
                  onChanged();
                });
        final narrow = constraints.maxWidth < 430;
        final details = Row(children: [
          Checkbox(semanticLabel: 'Select ${item.product.name}', value: item.selected,
              onChanged: (value) { item.selected = value ?? false; onChanged(); }),
          SizedBox(width: 40, height: 40, child: ProductVisual(
              name: item.product.name, imageUrl: item.product.imageUrl)),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(item.product.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
            Text('₱${item.product.price.toStringAsFixed(2)}', style: const TextStyle(color: green, fontSize: 13)),
          ])),
          if (!narrow) controls,
        ]);
        return narrow ? Column(children: [details, Align(alignment: Alignment.centerRight,
            child: SizedBox(width: 160, child: controls))]) : details;
      }));
}

class PriceRow extends StatelessWidget {
  const PriceRow(this.label, this.value, {super.key, this.bold = false});
  final String label;
  final num value;
  final bool bold;
  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Expanded(child: Text(label,
            style: TextStyle(
                fontWeight: bold ? FontWeight.w800 : FontWeight.normal))),
        const SizedBox(width: 12),
        Flexible(child: Text('₱${value.toStringAsFixed(2)}',
            textAlign: TextAlign.right,
            style: TextStyle(
                fontWeight: bold ? FontWeight.w800 : FontWeight.normal)))
      ]));
}

class Field extends StatelessWidget {
  const Field({super.key, required this.label});
  final String label;
  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.only(top: 10),
      child: TextField(
          decoration: InputDecoration(
              labelText: label,
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(6)))));
}

class InfoBox extends StatelessWidget {
  const InfoBox(this.title, this.value, {super.key});
  final String title, value;
  @override
  Widget build(BuildContext context) => Container(
      width: double.infinity,
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
          border: Border.all(color: border),
          borderRadius: BorderRadius.circular(7)),
      child: Column(children: [
        Text(title, style: const TextStyle(fontSize: 14)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800))
      ]));
}

class GreenButton extends StatelessWidget {
  const GreenButton({super.key, required this.label, required this.onTap});
  final String label;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => SizedBox(
      width: double.infinity,
      child: FilledButton(
          style: FilledButton.styleFrom(
              backgroundColor: green,
              minimumSize: const Size(0, 48),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5))),
          onPressed: onTap,
          child: Text(label)));
}

class ShopNowButton extends StatelessWidget {
  const ShopNowButton({super.key, required this.onTap});
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => FilledButton(
    style: FilledButton.styleFrom(
      backgroundColor: green,
      minimumSize: const Size(120, 48),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
    onPressed: onTap,
    child: const Text('Shop Now',
      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
  );
}



class SavedOrdersPage extends StatefulWidget {
  const SavedOrdersPage({super.key, this.simulator = false});
  final bool simulator;
  @override
  State<SavedOrdersPage> createState() => _SavedOrdersPageState();
}

class _SavedOrdersPageState extends State<SavedOrdersPage> {
  late Future<List<Map<String, dynamic>>> orders;
  Future<Map<String, dynamic>?>? pendingOrder;
  bool saving = false;
  bool get canSimulate => widget.simulator && kDebugMode &&
      const bool.fromEnvironment('DEMO_STAFF_TOOLS') &&
      orderRepository is LocalOrderRepository;
  @override
  void initState() {
    super.initState();
    reload();
  }

  void reload() {
    orders = orderRepository.list();
    pendingOrder = orderRepository is ApiOrderRepository
        ? (orderRepository as ApiOrderRepository).pending() : null;
  }

  Future<void> resumePending() async {
    if (saving) return;
    setState(() => saving = true);
    try {
      await (orderRepository as ApiOrderRepository).resumePending();
      if (mounted) setState(reload);
    } catch (error) {
      if (mounted) {
        setState(reload);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(
            error is StoreApiException ? error.message : 'Could not recover order. Try again.')));
      }
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  Future<void> simulate(Map<String, dynamic> order) async {
    if (!canSimulate || saving) return;
    final confirmed = await showDialog<bool>(context: context, builder: (context) => AlertDialog(
      title: const Text('Simulate cash received?'),
      content: Text('DEMO ONLY: ${order['order_number']} will become Paid locally. No real payment is recorded. COD also becomes Completed.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Simulate')),
      ],
    ));
    if (confirmed != true || !mounted) return;
    setState(() => saving = true);
    try {
      await (orderRepository as LocalOrderRepository).simulatePayment(order['order_number'] as String);
      if (mounted) setState(() => orders = orderRepository.list());
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not save simulated payment. Try again.')));
      }
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  void openReceipt(Map<String, dynamic> order) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => ReceiptPage(
      total: order['total'] as num,
      orderNumber: order['order_number'] as String,
      customerName: order['customer_name'] as String,
      customerMobile: order['mobile_number'] as String,
      customerAddress: order['address'] as String,
      fulfillmentMethod: order['fulfillment_method'] == 'delivery'
          ? FulfillmentMethod.delivery : order['fulfillment_method'] == 'store_pickup'
          ? FulfillmentMethod.storePickup : null,
      paymentMethod: order['payment_method'] == 'cash_at_store'
          ? PaymentMethod.cashAtStore : PaymentMethod.cashOnDelivery,
      cartItems: (order['items'] as List).map((item) => CartItem(
          Product(item['name'] as String, item['price'] as num, Icons.inventory_2,
              item['category'] as String? ?? 'More', id: (item['product_id'] ?? item['id']) as int,
              unit: item['unit'] as String? ?? 'piece'),
          item['quantity'] as int)).toList(),
    ))).then((_) { if (mounted) setState(() => orders = orderRepository.list()); });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(canSimulate ? 'Demo staff simulator' : 'Saved receipts'), actions: [
      IconButton(tooltip: 'Refresh orders', onPressed: () => setState(reload),
          icon: const Icon(Icons.refresh)),
    ]),
    body: FutureBuilder<List<Map<String, dynamic>>>(future: orders, builder: (context, snapshot) {
      if (snapshot.hasError) {
        return Center(child: TextButton(
          onPressed: () => setState(() => orders = orderRepository.list()),
          child: const Text('Could not load saved receipts. Retry')));
      }
      if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
      return ListView(padding: const EdgeInsets.all(16), children: [
        if (pendingOrder != null)
          FutureBuilder<Map<String, dynamic>?>(future: pendingOrder, builder: (context, pending) {
            if (!pending.hasData) return const SizedBox.shrink();
            return Card(child: Padding(padding: const EdgeInsets.all(12), child: Column(
              crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('An order needs confirmation.'),
                TextButton(onPressed: saving ? null : resumePending,
                    child: Text(saving ? 'Checking...' : 'Recover pending order')),
              ])));
          }),
        Text(canSimulate ? 'TEST ONLY • Simulates staff collecting cash. This does not contact the store.'
            : 'Receipts are saved on this device. Clearing site data removes them.'),
        const SizedBox(height: 12),
        if (snapshot.data!.isEmpty) const Text('No saved orders yet.'),
        for (final order in snapshot.data!) Card(child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(order['order_number'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
            Text('${order['customer_name']} • ₱${order['total']}'),
            Text('${order['payment_status']} • ${order['order_status']}'),
            OrderQueueButton(orderNumber: order['order_number'] as String),
            TextButton(onPressed: () => openReceipt(order), child: const Text('Open receipt')),
            if (canSimulate && order['payment_status'] != 'Paid')
              OutlinedButton(onPressed: saving ? null : () => simulate(order),
                  child: const Text('Simulate cash received')),
          ]),
        )),
      ]);
    }),
  );
}

