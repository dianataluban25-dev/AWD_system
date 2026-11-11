import 'package:elee_mobile/main.dart';
import 'package:elee_mobile/order_repository.dart';
import 'package:elee_mobile/store_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Customer cart uses staff mappings from latest catalog, excluding unavailable items', () {
    final oldProducts=products, oldRepository=orderRepository;
    addTearDown(() { products=oldProducts; orderRepository=oldRepository; });
    orderRepository=ApiOrderRepository(StoreApi(baseUrl:'http://store.test/api'));
    final cement=Product.fromJson({'id':1,'name':'Cement','price':100,'stock':5,'recommended_product_ids':[2,3,4]});
    const sand=Product('Sand',80,Icons.inventory,'Materials',id:2,stock:3);
    const gravel=Product('Gravel',70,Icons.inventory,'Materials',id:3,stock:0);
    const unrelated=Product('Hammer',50,Icons.handyman,'Tools',id:5,stock:5);
    products=[cement,sand,gravel,unrelated];
    expect(RecommendationEngine.forCart([CartItem(cement,1)]).map((p)=>p.id),[2]);
    expect(RecommendationEngine.forCart([CartItem(cement,1),CartItem(sand,1)]),isEmpty);
    products=[Product.fromJson({'id':1,'name':'Cement','price':100,'stock':5,'recommended_product_ids':[]}),sand,unrelated];
    expect(RecommendationEngine.forCart([CartItem(cement,1)]),isEmpty);
    products=[Product.fromJson({'id':1,'name':'Cement','price':100,'stock':5,'recommended_product_ids':[2], 'ml_recommendation_scores':{'5':0.9,'2':0.5}}),sand,unrelated];
    expect(RecommendationEngine.forCart([CartItem(cement,1)]).map((p)=>p.id),[5,2]);
  });
}
