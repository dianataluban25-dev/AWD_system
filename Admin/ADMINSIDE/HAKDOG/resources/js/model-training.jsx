import React, { useEffect, useState } from 'react';

export function ModelTraining({api}) {
    const [data,setData]=useState(null), [busy,setBusy]=useState(false), [error,setError]=useState('');
    async function load() { try { setData(await api.request('staff/recommendation-model')); setError(''); } catch(e) {setError(e.message);} }
    useEffect(()=>{load();const timer=setInterval(load,10000);return()=>clearInterval(timer);},[]);
    return <section className="model-training compact-model" aria-label="AI recommendation status">
        <div className="model-status-bar"><div className="model-status-copy"><span className={`model-status-dot ${data?.trained?'is-active':''}`} aria-hidden="true"/><div><h2>{!data?'Checking AI status…':data.trained?'AI recommendations active':'AI is learning'}</h2><p>{data?.trained?'Suggestions update automatically from completed orders.':'More completed orders are needed. Related products are used for now.'}</p></div></div>
        {data?.trained_at && <span className="model-updated">Updated {new Date(data.trained_at).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'Asia/Manila'})}</span>}</div>
        {error && <p role="alert" className="error">{error}</p>}
        <details className="model-details"><summary>Model details</summary><div className="model-details-content">
        {data && <dl className="model-metrics"><div><dt>Training orders</dt><dd>{data.training_orders}</dd></div><div><dt>Products learned</dt><dd>{data.training_products}</dd></div><div><dt>New orders</dt><dd>{data.new_orders}</dd></div></dl>}
        <p>Item-item collaborative filtering · Automatically retrains after paid, completed orders.</p>
        <button disabled={busy} onClick={async()=>{setBusy(true);setError('');try{setData(await api.request('staff/recommendation-model/train',{method:'POST'}));}catch(e){setError(e.message);}finally{setBusy(false);}}}>{busy?'Training…':'Train / Retrain model'}</button>
        {data?.trained && data.limited_data && <p role="status">Limited training data: suggestions are learned from a small order history and may change as more orders are completed.</p>}
        <p>Manual retraining is optional. Initial training needs 3 eligible orders, including products bought together.</p>
        </div></details>
    </section>;
}
