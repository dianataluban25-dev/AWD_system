import React, { useState } from 'react';

export function RecommendationEditor({ product, products, save, busy }) {
    const [selected,setSelected]=useState((product.recommended_product_ids || []).filter(id=>products.some(item=>item.id===id)));
    const [message,setMessage]=useState('');
    const learned=Object.entries(product.ml_recommendation_scores || {}).map(([id,score])=>({product:products.find(item=>item.id===Number(id)),score})).filter(item=>item.product?.is_active && item.product.stock>0).sort((a,b)=>b.score-a.score);
    return <section className="recommendation-editor"><h3>Automatic AI suggestions for {product.name}</h3><p>Learned from completed order history. No manual selection is needed.</p>
        {learned.length ? <div className="recommendation-options">{learned.map(({product:item,score})=><article className="learned-product" key={item.id}><strong>{item.name}</strong><p>{item.category} · ₱{item.price.toFixed(2)}</p><small>Learned similarity: {score.toFixed(3)}</small></article>)}</div> : <p>No learned suggestions for this product yet. Complete orders containing this product with other items so the model can learn.</p>}
        <details><summary>Optional manual fallback</summary><form onSubmit={async event=>{
        event.preventDefault(); setMessage('');
        if(await save(product.id,selected)) setMessage('Recommendations saved. Customers will see these products in their cart.');
    }}><h3>Related products for {product.name}</h3><p>Choose up to 20 products. Hidden and out-of-stock products are excluded from customer suggestions.</p>
        <div className="recommendation-options">{products.filter(item=>item.id!==product.id).map(item=><label key={item.id}>
            <input type="checkbox" checked={selected.includes(item.id)} disabled={busy || (!selected.includes(item.id) && selected.length>=20)} onChange={event=>setSelected(ids=>event.target.checked?[...ids,item.id]:ids.filter(id=>id!==item.id))}/>
            <span><strong>{item.name}</strong><small>{item.category} · ₱{item.price.toFixed(2)} · {item.is_active ? `${item.stock} in stock`:'Hidden'}</small></span>
        </label>)}</div><button disabled={busy} type="submit">{busy?'Saving…':'Save recommendations'}</button>
        {message && <p role="status">{message}</p>}
    </form></details></section>;
}
