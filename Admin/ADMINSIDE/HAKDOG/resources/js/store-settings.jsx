import React, { useEffect, useRef, useState } from 'react';
import { notificationAudio } from './notification-audio';

const tabs = [['store','Store Information'], ['orders','Order Settings'], ['notifications','Notifications'], ['account','Admin Account']];
const notifications = [['notify_new_orders','New Orders'], ['notify_order_changes','Order Changes'], ['notify_cancellations','Cancellations'], ['notify_low_stock','Low Stock']];

export function StoreSettings({ api }) {
    const [data,setData] = useState(null), [tab,setTab] = useState('store');
    const [busy,setBusy] = useState(false), [error,setError] = useState(''), [message,setMessage] = useState(''), [revision,setRevision] = useState(0);
    async function load() {
        try { const [account,store] = await Promise.all([api.request('staff/me'),api.request('staff/settings')]); setData({account,store}); }
        catch(e) { setError(e.message); }
    }
    useEffect(() => { load(); }, []);
    async function save(event) {
        event.preventDefault(); const form = new FormData(event.currentTarget);
        let body = Object.fromEntries(form);
        if(tab === 'orders') body = {delivery_fee_centavos:Math.round(Number(form.get('fee'))*100),pickup_enabled:form.has('pickup_enabled'),delivery_enabled:form.has('delivery_enabled')};
        if(tab === 'notifications') body = {...Object.fromEntries(notifications.map(([key])=>[key,form.has(key)])),low_stock_threshold:Number(form.get('low_stock_threshold'))};
        if(tab === 'account' && !body.password) { delete body.password; delete body.password_confirmation; }
        setBusy(true);setError('');setMessage('');
        try { await api.request(tab === 'account' ? 'staff/account':'staff/settings',{method:'PATCH',body}); await load(); setRevision(value=>value+1); setMessage('Changes saved.'); }
        catch(e) { setError(e.message); } finally { setBusy(false); }
    }
    const field=(key,title,props={})=><label>{title}<input name={key} defaultValue={data.store[key] ?? ''} {...props}/></label>;
    const toggle=(key,title,description)=><label className="settings-toggle"><span><strong>{title}</strong><small>{description}</small></span><input name={key} type="checkbox" defaultChecked={data.store[key]}/></label>;
    return <div className="connected-settings"><nav className="settings-tabs" aria-label="Settings sections">{tabs.map(([key,title])=><button key={key} type="button" className={tab===key?'active':''} aria-pressed={tab===key} disabled={busy} onClick={()=>{setTab(key);setError('');setMessage('');}}>{title}</button>)}</nav><section className="settings-card">
        {error && <p className="error" role="alert">{error}</p>}{message && <p className="settings-success" role="status">{message}</p>}
        {!data ? <p>{error ? <button onClick={load}>Retry</button>:'Loading settings…'}</p> : <form key={tab+revision+JSON.stringify(data)} onSubmit={save}><h2>{tabs.find(([key])=>key===tab)[1]}</h2>
        {tab==='store' && <><p className="settings-help">Contact details and pickup information.</p><div className="settings-grid">{field('store_name','Store name',{required:true,maxLength:255})}{field('store_phone','Contact number',{type:'tel',maxLength:50})}</div>{field('store_address','Store address',{maxLength:2000})}{field('store_hours','Store hours',{maxLength:500,placeholder:'Monday–Saturday, 8 AM–5 PM'})}</>}
        {tab==='orders' && <><p className="settings-help">Applies to new orders. Existing orders retain their original fees. Sunday orders are accepted for Monday delivery; no deliveries on Sunday.</p>{toggle('pickup_enabled','Store Pickup','Accept orders for collection at the store.')}{toggle('delivery_enabled','Delivery','Accept delivery orders.')}<label>Delivery fee (PHP)<input name="fee" type="number" min="0" max="1000000" step="0.01" defaultValue={data.store.delivery_fee_centavos/100} required/></label></>}
        {tab==='notifications' && <><p className="settings-help">Show alerts while the admin website is open.</p>{notifications.map(([key,title])=><React.Fragment key={key}>{toggle(key,title,'Show this alert in the admin website.')}</React.Fragment>)}{field('low_stock_threshold','Low stock threshold',{type:'number',min:0,max:1000000,required:true})}</>}
        {tab==='account' && <><p className="settings-help">Enter your current password to save changes.</p><div className="settings-grid"><label>Name<input name="name" defaultValue={data.account.name} maxLength={255} required/></label><label>Email<input name="email" type="email" defaultValue={data.account.email} required/></label></div><label>Current password<input name="current_password" type="password" autoComplete="current-password" required/></label><div className="settings-grid"><label>New password (optional)<input name="password" type="password" autoComplete="new-password" minLength={12}/></label><label>Confirm new password<input name="password_confirmation" type="password" autoComplete="new-password" minLength={12}/></label></div><p className="settings-help">At least 12 characters. Leave blank to keep your password.</p></>}
        <div className="settings-footer"><button disabled={busy}>{busy?'Saving…':'Save changes'}</button></div></form>}
    </section></div>;
}

export function StoreAlerts({ api, data }) {
    const [settings,setSettings]=useState(null), [alerts,setAlerts]=useState([]);
    const [dismissedStock,setDismissedStock]=useState(''), [stockOpen,setStockOpen]=useState(false);
    const previous=useRef(null);
    const [soundOn,setSoundOn]=useState(()=>{try{return localStorage.getItem('elee.alert-sound')!=='off';}catch{return true;}});
    const [audioReady,setAudioReady]=useState(false);
    const previousStock=useRef(null);
    useEffect(()=>{
        const unlock=()=>{notificationAudio.unlock().then(setAudioReady);};
        window.addEventListener('pointerdown',unlock,{once:true});window.addEventListener('keydown',unlock,{once:true});
        return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);};
    },[]);
    useEffect(()=>{let alive=true; const read=()=>api.request('staff/settings').then(value=>{if(alive)setSettings(value);}).catch(()=>{}); read(); const timer=setInterval(read,10000); return()=>{alive=false;clearInterval(timer);};},[]);
    useEffect(()=>{
        if(!data || !settings) return;
        const before=previous.current, next=[];
        if(before) data.orders.forEach(order=>{
            const old=before.get(order.order_number);
            if(!old && settings.notify_new_orders) next.push({id:`${order.order_number}-new`,title:'New order received',body:order.customer_name,detail:order.order_number});
            else if(old && old!==order.order_status && (order.order_status==='Cancelled'?settings.notify_cancellations:settings.notify_order_changes)) next.push({id:`${order.order_number}-${order.order_status}`,title:order.order_status==='Cancelled'?'Order cancelled':'Order updated',body:`${order.customer_name} · ${order.order_status}`,detail:order.order_number});
        });
        previous.current=new Map(data.orders.map(order=>[order.order_number,order.order_status]));
        if(next.length) {setAlerts(current=>[...next,...current.filter(item=>!next.some(value=>value.id===item.id))].slice(0,3));if(soundOn)notificationAudio.play();}
        const stock=settings.notify_low_stock ? data.products.filter(p=>p.is_active && p.stock<=settings.low_stock_threshold).map(p=>`${p.id}:${p.stock}`).join('|'):'';
        if(stock && previousStock.current!==null && stock!==previousStock.current && !next.length && soundOn)notificationAudio.play();
        previousStock.current=stock;
    },[data,settings,soundOn]);
    useEffect(()=>{if(!alerts.length)return;const timer=setTimeout(()=>setAlerts([]),10000);return()=>clearTimeout(timer);},[alerts]);
    if(!settings) return null;
    const low=settings.notify_low_stock ? data.products.filter(p=>p.is_active && p.stock<=settings.low_stock_threshold):[];
    const stockKey=low.map(p=>`${p.id}:${p.stock}`).join('|');
    const showStock=low.length>0 && stockKey!==dismissedStock;
    const icon=<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>;
    return <><button className="notification-sound-toggle" title={soundOn && audioReady?'Mute notification sound':'Enable notification sound'} onClick={async()=>{
        const next=!soundOn||!audioReady;setSoundOn(next);try{localStorage.setItem('elee.alert-sound',next?'on':'off');}catch{}
        if(next){const ready=await notificationAudio.unlock();setAudioReady(ready);if(ready)notificationAudio.play();}
    }}>{soundOn&&audioReady?'♪ Sound on':'♪ Enable sound'}</button>{(alerts.length || showStock) ? <aside className="notification-stack" aria-label="Store notifications" aria-live="polite">
        {alerts.map(item=><section className="notification-toast" key={item.id}><span className="notification-icon">{icon}</span><div className="notification-copy"><strong>{item.title}</strong><p>{item.body}</p><small title={item.detail}>{item.detail}</small></div><button className="notification-close" aria-label={`Dismiss ${item.title}`} onClick={()=>setAlerts(current=>current.filter(value=>value.id!==item.id))}>×</button></section>)}
        {showStock && <section className="notification-toast stock-notification"><span className="notification-icon">!</span><div className="notification-copy"><strong>Stock needs attention</strong><p>{low.length} {low.length===1?'product is':'products are'} running low.</p><button className="notification-details" aria-expanded={stockOpen} onClick={()=>setStockOpen(value=>!value)}>{stockOpen?'Hide products':'View products'}</button>{stockOpen && <ul>{low.slice(0,5).map(product=><li key={product.id}>{product.name}<span>{product.stock} {product.unit}</span></li>)}{low.length>5&&<li>+{low.length-5} more in Products</li>}</ul>}</div><button className="notification-close" aria-label="Dismiss low stock notification" onClick={()=>{setDismissedStock(stockKey);setStockOpen(false);}}>×</button></section>}
    </aside>:null}</>;
}
