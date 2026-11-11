import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import designCss from '../css/admin-design.css?inline';
import '../css/restored-design.css';
import { RecommendationEditor } from './recommendation-editor';
import { SalesLineChart } from './sales-line-chart';

const sources = import.meta.glob('../legacy/*.html', { query: '?raw', import: 'default', eager: true });
const currency = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
const date = value => new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(value));
const closed = order => ['Completed', 'Cancelled'].includes(order.order_status);

function template(page) {
    const source = sources[`../legacy/${page}.html`]
        .replace(/\{\{\s*url\('([^']+)'\)\s*\}\}/g, '$1')
        .replace(/@if\s*\(session\('error'\)\)[\s\S]*?@endif/g, '')
        .replace(/@csrf/g, '');
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const css = [...doc.querySelectorAll('style')].map(style => style.textContent).join('\n');
    doc.querySelectorAll('script, style, .modal-overlay, .modal-bg, [id$="Modal"], #productForm, .toast').forEach(node => node.remove());
    doc.querySelectorAll('*').forEach(node => {
        [...node.attributes].filter(attr => attr.name.startsWith('on')).forEach(attr => {
            if (attr.name === 'onclick') node.dataset.originalAction = attr.value;
            node.removeAttribute(attr.name);
        });
    });
    doc.querySelectorAll('tbody').forEach(node => node.replaceChildren());
    doc.querySelectorAll('.card-number, .card-change, .payment-value, .donut-number, .status-item strong').forEach(node => { node.textContent = '—'; });
    doc.querySelectorAll('.sidebar a').forEach(link => {
        const href = link.getAttribute('href');
        if (href?.includes('logout')) { link.href = '#sign-out'; return; }
        const target = href === '/' ? 'dashboard' : href?.replace(/^\//, '');
        link.href = `/admin/${target}`;
        link.classList.toggle('active', target === page);
    });
    const pages = new Set(['dashboard', 'orders', 'products', 'queuing', 'customers', 'payments', 'receipt-records', 'settings', 'ai-recommendations']);
    doc.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href'); const key = href === '/' ? 'dashboard' : href?.replace(/^\//, '');
        if (pages.has(key)) link.href = `/admin/${key}`;
    });
    if (page === 'queuing') {
        const pickup = doc.createElement('option'); pickup.value = 'Ready for Pickup'; pickup.textContent = 'Ready for Pickup';
        doc.querySelector('#statusFilter')?.append(pickup);
    }
    if (page === 'orders') {
        const divider = doc.querySelector('.main > .section-divider');
        if (divider) {
            while (divider.nextElementSibling) divider.nextElementSibling.remove();
            divider.remove();
        }
        const tabs = doc.querySelector('.tabs'); const pickup = doc.createElement('button'); pickup.className = 'tab'; pickup.dataset.status = 'Ready for Pickup'; pickup.textContent = 'Ready for Pickup'; tabs?.insertBefore(pickup, tabs.querySelector('[data-status="Completed"]'));
        tabs?.setAttribute('aria-label', 'Filter orders by status');
    }
    if (page === 'dashboard') {
        doc.querySelectorAll('.box-subtitle').forEach(node => {
            if (node.textContent.includes('Monthly performance')) node.textContent = 'Daily paid sales · Philippine peso';
        });
    }
    if (page === 'products') {
        const filter = doc.querySelector('#statusFilter');
        const option = doc.createElement('option'); option.value = 'Archived'; option.textContent = 'Archived';
        filter?.append(option);
    }
    if (page === 'ai-recommendations') {
        doc.querySelector('.add-btn')?.remove();
        const title = doc.querySelector('.page-title'); if (title) title.textContent = 'Product Recommendations';
        const subtitle = doc.querySelector('.page-subtitle'); if (subtitle) subtitle.textContent = 'Manage related products shown in the customer cart';
        doc.querySelectorAll('*').forEach(node => {
            if (node.children.length === 0 && node.textContent.includes('AI recommendations help')) node.textContent = 'Related products selected here appear in the customer cart.';
        });
    }
    if (page !== 'admin-login' && !doc.querySelector('.sidebar a[href="#sign-out"]')) {
        const logout = doc.createElement('a'); logout.href = '#sign-out'; logout.className = 'logout'; logout.textContent = '↪ Logout';
        doc.querySelector('.sidebar .menu')?.append(logout);
    }
    // The script-generated sample records are never executed or displayed.
    if (page === 'settings') {
        const subtitle = doc.querySelector('.page-subtitle'); if (subtitle) subtitle.textContent = 'Manage store details, order options, alerts and your account.';
        const general = doc.querySelector('#general');
        if (general) general.replaceChildren();
        doc.querySelectorAll('.tab-content:not(#general), .tabs, .setting-tabs').forEach(node => node.remove());
    }
    doc.querySelectorAll('input[placeholder^="Search"]').forEach(input => {
        let wrapper = input.parentElement;
        if (!wrapper.matches('.search-box, .search-container')) {
            wrapper = doc.createElement('div'); input.before(wrapper); wrapper.append(input);
        }
        wrapper.classList.add('unified-search');
        [...wrapper.children].filter(node => node !== input && node.tagName !== 'BUTTON').forEach(node => node.remove());
        const icon = doc.createElement('span'); icon.className = 'unified-search-icon'; icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
        wrapper.prepend(icon);
        if (!input.hasAttribute('aria-label')) input.setAttribute('aria-label', input.placeholder.replace(/\.+$/, ''));
    });
    return { html: doc.body.innerHTML, css };
}

export function OriginalLogin({ children }) {
    return <main className="legacy-screen original-login staff-login">
        <div className="login-shell">
            <section className="login-story" aria-label="ELEE Hardware">
                <div className="login-brand" aria-label="ELEE Hardware"><div className="login-wordmark" aria-hidden="true"><span>E</span><span>LEE</span></div><small aria-hidden="true">{'HARDWARE'.split('').map((letter,index)=><span key={index}>{letter}</span>)}</small></div>
                <div className="login-story-copy"><span className="login-eyebrow">YOUR STORE, CONNECTED</span>
                    <h1>Every order.<br/>One clear view.</h1>
                    <p>Keep orders moving, inventory updated, and customers informed.</p>
                    <div className="login-feature-list"><span>Orders &amp; queue</span><span>Live inventory</span><span>Customer updates</span></div>
                </div>
                <div className="login-story-footer"><span className="login-dot"/> ELEE staff workspace</div>
                <div className="login-orbit orbit-one" aria-hidden="true"/><div className="login-orbit orbit-two" aria-hidden="true"/>
            </section>
            <section className="login-card" aria-labelledby="staff-login-title">
                <div className="login-access-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg></div>
                <span className="login-eyebrow">STAFF &amp; ADMIN</span><h2 id="staff-login-title">Welcome back</h2>
                <p className="login-subtitle">Sign in to manage your store.</p>
                {children}
                <p className="login-footnote">Authorized store personnel only.</p>
            </section>
        </div>
    </main>;
}

export function LegacyPage({ page, data, loading, busy, error, navigate, logout, refresh, actions, editProduct, details, settings, saveRecommendations, changeProduct, deleteProduct }) {
    const content = useMemo(() => template(page), [page]);
    const root = useRef(null); const [slots, setSlots] = useState({});
    const [triggerId,setTriggerId] = useState(null);
    const [search, setSearch] = useState(''); const [filter, setFilter] = useState(page === 'queuing' ? 'active' : 'all');
    const [sort, setSort] = useState('oldest'); const [category, setCategory] = useState('All Categories');
    const [stock, setStock] = useState('All Status'); const [current, setCurrent] = useState(1);
    const [history, setHistory] = useState(null);
    const [paymentDate, setPaymentDate] = useState(''); const [productSearch, setProductSearch] = useState('');

    useLayoutEffect(() => {
        const element = root.current; const targets = {};
        element.querySelectorAll('[id], canvas, .card-number, .card-change, .payment-value, .donut-number, .status-item strong, .chart-container, .donut-wrapper').forEach((node, index) => {
            if (node.id) targets[node.id] = node;
        });
        if (page === 'dashboard') {
            targets.dashboardRows = element.querySelector('tbody');
            targets.dashboardCards = [...element.querySelectorAll('.card-number')];
            targets.dashboardChanges = [...element.querySelectorAll('.card-change')];
            targets.dashboardPayments = [...element.querySelectorAll('.payment-value')];
            targets.dashboardStatuses = [...element.querySelectorAll('.status-item strong')];
            targets.salesChart = element.querySelector('#salesChart')?.parentElement;
            targets.orderChart = element.querySelector('#orderChart')?.parentElement;
            targets.lowStock = element.querySelector('.stock-list');
            targets.topProducts = element.querySelector('.product-list');
        }
        const host = element.querySelector('main, .main, .content');
        const notices = document.createElement('div'); notices.className = 'api-notices'; host.prepend(notices); targets.notices = notices;
        targets.allBodies = [...element.querySelectorAll('tbody')];
        Object.values(targets).flat().filter(node => node instanceof HTMLElement && node !== targets.refresh).forEach(node => {
            if (node.tagName === 'TBODY' || ['ordersList', 'productsList', 'productList', 'triggerList', 'productGrid', 'general'].includes(node.id)) node.replaceChildren();
        });
        if (targets.salesChart) targets.salesChart.replaceChildren();
        if (targets.orderChart) targets.orderChart.replaceChildren();
        if (targets.lowStock) targets.lowStock.replaceChildren();
        if (targets.topProducts) targets.topProducts.replaceChildren();
        element.querySelectorAll('.summary-value, .summary-number, .summary-card .number, .summary-card strong, .card-number, .card-change, .payment-value, .status-item strong, #paginationInfo, #showingText, #orderCount, #queueFooter, #customerCount, #pagination, #categoryFilter, #recommendationText, #currentTrigger').forEach(node => node.replaceChildren());
        setSlots(targets);
        const click = event => {
            const link = event.target.closest('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href?.startsWith('/admin/')) { event.preventDefault(); navigate(href.split('/').at(-1)); }
                else if (href === '#sign-out') { event.preventDefault(); logout(); }
            }
            const button = event.target.closest('button'); if (!button) return;
            const action = button.dataset.originalAction || '';
            if (action.includes('toggleFilter')) { const dropdown = element.querySelector('#filterDropdown'); if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'; }
            else if (action.includes('filterPayments')) { const selected = action.match(/'([^']+)'/)?.[1] || 'all'; setFilter(selected); setCurrent(1); const dropdown = element.querySelector('#filterDropdown'); if (dropdown) dropdown.style.display = 'none'; }
            else if (button.id === 'clearSearch') { const input = element.querySelector('#customerSearch'); input.value = ''; setSearch(''); }
            else if (button.dataset.status) { setFilter(button.dataset.status === 'All Orders' ? 'all' : button.dataset.status); setCurrent(1); }
            else if (/open.*(?:add|product).*modal|openModal\(|openAdd|addProduct/i.test(action) || button.id === 'addProductButton') editProduct({});
        };
        const input = event => {
            if (['customerSearch', 'searchInput', 'queueSearch'].includes(event.target.id)) { setSearch(event.target.value); setCurrent(1); }
            if (event.target.id === 'productSearch') setProductSearch(event.target.value);
            if (event.target.id === 'dateFilter') { setPaymentDate(event.target.value); setCurrent(1); }
            if (event.target.id === 'statusFilter') { const value = event.target.value; setFilter(value); setStock(value); setCurrent(1); }
            if (event.target.id === 'categoryFilter') { setCategory(event.target.value); setCurrent(1); }
            if (event.target.id === 'sortBy') setSort(event.target.value);
        };
        element.addEventListener('click', click); element.addEventListener('input', input); element.addEventListener('change', input);
        return () => { element.removeEventListener('click', click); element.removeEventListener('input', input); element.removeEventListener('change', input); };
    }, [page]);

    const orders = data?.orders || []; const products = data?.products || [];
    const lowStockThreshold = data?.store?.low_stock_threshold ?? 10;
    const paid = orders.filter(order => order.payment_status === 'Paid'); const active = orders.filter(order => !closed(order));
    const q = search.trim().toLowerCase();
    let visibleOrders = orders.filter(order => `${order.order_number} ${order.customer_name}`.toLowerCase().includes(q));
    if (page === 'queuing' || page === 'orders') visibleOrders = visibleOrders.filter(order =>
        ['all', 'All', 'All Orders', ''].includes(filter) || (filter === 'active' ? !closed(order) : order.order_status === filter));
    if (page === 'payments' || page === 'receipt-records') visibleOrders = visibleOrders.filter(order =>
        ['all', 'All', 'All Status', ''].includes(filter) || order.payment_status.toLowerCase() === filter.toLowerCase() || (filter === 'cancelled' && order.order_status === 'Cancelled'));
    if (paymentDate) visibleOrders = visibleOrders.filter(order => {
        const parts = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Manila' }).formatToParts(new Date(order.paid_at || order.created_at));
        const value = type => parts.find(part => part.type === type).value;
        return `${value('year')}-${value('month')}-${value('day')}` === paymentDate;
    });
    if (sort === 'newest') visibleOrders = [...visibleOrders].reverse();
    if (sort === 'customer') visibleOrders.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
    if (sort === 'amount') visibleOrders.sort((a, b) => b.total - a.total);
    const customerMap = new Map();
    orders.forEach(order => {
        const record = customerMap.get(order.mobile_number) || { name: order.customer_name, mobile: order.mobile_number, address: '', orders: [], spent: 0 };
        record.name = order.customer_name; record.address = order.address || record.address; record.orders.push(order);
        if (order.payment_status === 'Paid') record.spent += order.total;
        customerMap.set(order.mobile_number, record);
    });
    const customers = [...customerMap.values()].filter(customer => `${customer.name} ${customer.mobile} ${customer.address}`.toLowerCase().includes(q));
    const availability = product => !product.is_active ? 'Archived' : product.stock === 0 ? 'Out of Stock' : product.stock <= lowStockThreshold ? 'Low Stock' : 'In Stock';
    const inventory = products.filter(product => `${product.name} ${product.sku}`.toLowerCase().includes(q)
        && (['All Categories', 'All', 'all', ''].includes(category) || product.category === category)
        && (['All Status', 'All', 'all', ''].includes(stock) || availability(product) === stock));
    const size = 10; const rows = page === 'customers' ? customers : page === 'products' ? inventory : visibleOrders;
    const pages = Math.max(1, Math.ceil(rows.length / size)); const number = Math.min(current, pages);
    const sliced = rows.slice((number - 1) * size, number * size);
    const customerSlice = page === 'customers' ? sliced : [];
    const orderSlice = ['orders', 'queuing', 'payments', 'receipt-records'].includes(page) ? sliced : [];
    const portals = []; const mount = (id, node) => { if (slots[id]) portals.push(createPortal(typeof node === "number" ? String(node) : node, slots[id], id)); };
    const statusBadge = status => <span className={`status status-badge ${status === 'Processing' ? 'processing' : status.startsWith('Ready') ? 'ready' : status.toLowerCase()}`}>{status}</span>;
    mount('notices', <>{error && <div className="error" role="alert">{error} <button onClick={refresh} disabled={loading || busy}>Retry</button></div>}{loading && <p role="status">Loading store data…</p>}</>);
    const recommendationIds = product => Object.keys(product.ml_recommendation_scores || {}).length ? Object.keys(product.ml_recommendation_scores).map(Number) : (product.recommended_product_ids || []);
    const values = {
        totalCustomers: customerMap.size, totalOrders: orders.length, totalSales: currency(paid.reduce((sum, order) => sum + order.total, 0)), activeCustomers: new Set(active.map(order => order.mobile_number)).size,
        activeCount: active.length, pendingCount: orders.filter(order => order.order_status === 'Pending').length, nextOrder: active[0]?.order_number || '—',
        totalProducts: products.length, inStockCount: products.filter(product => product.stock > lowStockThreshold && product.is_active).length,
        lowStockCount: products.filter(product => product.stock > 0 && product.stock <= lowStockThreshold && product.is_active).length, outStockCount: products.filter(product => product.stock === 0 && product.is_active).length,
        totalPayments: orders.length, paidCount: paid.length, unpaidCount: orders.filter(order => order.payment_status === 'Unpaid' && order.order_status !== 'Cancelled').length,
        cancelledCount: orders.filter(order => order.order_status === 'Cancelled').length, totalAmount: currency(orders.reduce((sum, order) => sum + order.total, 0)), paidOrders: paid.length, unpaidOrders: orders.filter(order=>order.payment_status==='Unpaid' && order.order_status!=='Cancelled').length,
        triggerCount: products.filter(product => recommendationIds(product).length).length, recommendationCount: new Set(products.flatMap(recommendationIds)).size, linkCount: products.reduce((sum,product)=>sum+recommendationIds(product).length,0),
    };
    Object.entries(values).forEach(([id, value]) => mount(id, value));
    mount('categoryFilter', <><option>All Categories</option>{[...new Set(products.map(product => product.category))].sort().map(name => <option key={name}>{name}</option>)}</>);
    mount('customerTable', customerSlice.map(customer => <tr key={customer.mobile}><td className="customer-name">{customer.name}</td><td>{customer.mobile}</td><td>{customer.address || 'Store pickup'}</td><td>{customer.orders.length}</td><td>{currency(customer.spent)}</td><td>{date(customer.orders.at(-1).created_at)}</td><td><button className="history-btn" onClick={() => setHistory(customer)}>View History</button></td></tr>));
    mount('queueRows', orderSlice.map(order => <tr key={order.order_number}><td className="position">{order.queue_position ? `#${order.queue_position}` : '—'}</td><td className="order-id">{order.order_number}</td><td className="customer-name">{order.customer_name}</td><td className="order-time">{date(order.created_at)}</td><td>{statusBadge(order.order_status)}</td><td className="total">{currency(order.total)}</td></tr>));
    mount('ordersList', orderSlice.map(order => <div className="order-row" key={order.order_number}><div className="order-id" title={order.order_number}><span className="order-code-prefix">ELEE-</span><span className="order-code-value">{order.order_number.replace(/^ELEE-/, "")}</span></div><div>{order.customer_name}</div><div>{statusBadge(order.order_status)}</div><div>{currency(order.total)}</div><div>{date(order.created_at)}</div><div>{actions(order)}</div></div>));
    const productRows = list => list.map(product => <div className="product-row" key={product.id}>
        <div className="product-image">{product.image_url ? <img src={product.image_url} alt={product.name} /> : <span className="api-product-icon">◇</span>}</div><div className="product-name">{product.name}</div><div>{product.category}</div><div>{currency(product.price)}</div><div>{product.stock}</div><div>{product.unit}</div><div>{statusBadge(product.is_active ? availability(product) : 'Archived')}</div><div className="product-actions"><button className="edit-btn" disabled={busy} onClick={() => editProduct(product)}>Edit</button><button className="product-archive" disabled={busy} onClick={() => {
            if (confirm(product.is_active ? `Archive ${product.name}? It will be hidden from customers. Past orders are kept.` : `Restore ${product.name} to the customer catalog?`)) changeProduct(product.id, {is_active: !product.is_active});
        }}>{product.is_active ? 'Archive' : 'Restore'}</button>{product.can_delete && <button className="product-delete" disabled={busy} onClick={() => { if(confirm(`Permanently delete ${product.name}? This cannot be undone.`)) deleteProduct(product.id); }}>Delete</button>}</div>
    </div>);
    mount('productList', productRows(page === 'products' ? sliced : []));
    mount('productsList', products.filter(product => `${product.name} ${product.sku}`.toLowerCase().includes(productSearch.trim().toLowerCase())).map(product => <div className="product-row" key={product.id}><div className="product-name">{product.name}</div><div>{currency(product.price)}</div><div>{product.unit}</div><div>{product.category}</div><div>{product.stock}</div><div>{availability(product)}</div><div><button onClick={() => editProduct(product)}>Edit</button></div></div>));
    ['paymentBody', 'receiptTableBody'].forEach(id => mount(id, orderSlice.map(order => <tr key={order.order_number}><td>{order.order_number}</td><td>{order.order_number}</td><td>{order.customer_name}</td><td>{currency(order.total)}</td><td>{order.payment_method === 'cash_at_store' ? 'Cash at Store' : 'Cash on Delivery'}</td><td>{statusBadge(order.payment_status)}</td><td>{date(order.paid_at || order.created_at)}</td><td>{actions(order)}</td></tr>)));
    const info = `Showing ${rows.length ? (number - 1) * size + 1 : 0} to ${Math.min(number * size, rows.length)} of ${rows.length}`;
    ['paginationInfo', 'showingText', 'orderCount', 'queueFooter', 'customerCount'].forEach(id => mount(id, info));
    mount('pagination', <><button disabled={number <= 1} onClick={() => setCurrent(number - 1)}>‹</button><span className="api-page-number">{number} / {pages}</span><button disabled={number >= pages} onClick={() => setCurrent(number + 1)}>›</button></>);
    mount('general', settings);
    if (page === 'dashboard') {
        [orders.length, orders.filter(order => order.order_status === 'Pending').length, currency(paid.reduce((sum, order) => sum + order.total, 0)), products.filter(product => product.is_active && product.stock <= lowStockThreshold).length].forEach((value, index) => { if (slots.dashboardCards?.[index]) portals.push(createPortal(String(value), slots.dashboardCards[index], `metric-${index}`)); });
        slots.dashboardChanges?.forEach((node, index) => portals.push(createPortal(index === 1 ? `${orders.length ? Math.round(active.length / orders.length * 100) : 0}% active orders` : 'From recorded orders', node, `change-${index}`)));
        slots.dashboardStatuses?.forEach((node, index) => portals.push(createPortal(String(orders.filter(order => index === 3 ? order.order_status.startsWith('Ready') : order.order_status === ['Completed', 'Pending', 'Processing'][index]).length), node, `status-${index}`)));
        slots.dashboardPayments?.forEach((node, index) => portals.push(createPortal(index === 0 ? `${paid.length} Orders` : index === 1 ? `${orders.length - paid.length} Orders` : currency((index === 2 ? paid : orders.filter(order => order.payment_status !== 'Paid')).reduce((sum, order) => sum + order.total, 0)), node, `payment-${index}`)));
        mount('dashboardRows', orders.slice(-3).reverse().map(order => <tr key={order.order_number}><td><button className="text-button" onClick={() => details(order)}>{order.order_number}</button></td><td>{order.customer_name}</td><td>{date(order.created_at)}</td><td>{statusBadge(order.order_status)}</td><td>{currency(order.total)}</td></tr>));
        mount('salesChart', <SalesLineChart orders={paid}/>);
        mount('orderChart', <div className="api-donut"><strong>{orders.length}</strong><span>Total Orders</span></div>);
        const low = products.filter(product => product.is_active && product.stock <= lowStockThreshold);
        mount('lowStock', low.length ? low.map(product => <div className="stock-item" key={product.id}><div className="stock-image">◇</div><div className="stock-info"><div className="stock-name">{product.name}</div><div className="stock-description">{product.category}</div></div><div className="stock-number"><div className="stock-quantity">{product.stock}</div><div className="stock-label">{product.unit} left</div></div></div>) : <p>No products need restocking.</p>);
        const sold = new Map(); const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
        paid.filter(order => new Date(order.paid_at || order.created_at).getTime() >= week).forEach(order => order.items.forEach(item => {
            const value = sold.get(item.product_id) || { ...item, quantity: 0 }; value.quantity += item.quantity; sold.set(item.product_id, value);
        }));
        mount('topProducts', sold.size ? [...sold.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 3).map(item => <div className="product" key={item.product_id}><div className="product-image">◇</div><div className="product-info"><div className="product-name">{item.name}</div><div className="product-price">{currency(item.price)} / {item.unit}</div></div><div className="product-sales"><div className="sales-number">{item.quantity}</div><div className="sold">sold</div></div></div>) : <p>No paid sales this week.</p>);
    }
    if (page === 'ai-recommendations') {
        const trigger = products.find(product=>product.id===triggerId);
        mount('triggerList', products.filter(product=>product.name.toLowerCase().includes(search.toLowerCase())).map(product => <button key={product.id} className={`trigger-item ${triggerId===product.id?'active':''}`} onClick={() => setTriggerId(product.id)}>{product.name} <small>({recommendationIds(product).length})</small></button>));
        mount('productGrid', trigger ? <RecommendationEditor key={trigger.id+JSON.stringify(trigger.recommended_product_ids)} product={trigger} products={products} save={saveRecommendations} busy={busy}/> : <p>Select a trigger product to choose its related products.</p>);
        mount('recommendationText', 'Select a product to inspect its automatically learned customer suggestions.'); mount('currentTrigger', trigger?.name || 'No trigger selected');
    }
    useLayoutEffect(() => {
        if (!root.current) return;
        root.current.querySelectorAll('#emptyState, #queueEmpty, #noResults').forEach(node => { node.style.display = rows.length ? 'none' : 'block'; });
        root.current.querySelectorAll('.tab[data-status]').forEach(node => {
            const selected = node.dataset.status === filter || (node.dataset.status === 'All Orders' && filter === 'all');
            node.classList.toggle('active', selected); node.setAttribute('aria-pressed', String(selected));
        });
        root.current.querySelectorAll('a[href="/admin/settings"]').forEach(node => { node.style.display = data?.account?.is_admin === false ? 'none' : ''; });
    }, [rows.length, filter, loading, busy, slots, data?.account?.is_admin]);
    return <div className={`legacy-screen restored-page page-${page}`}>
        <style>{content.css}</style><style>{designCss}</style><div ref={root} dangerouslySetInnerHTML={{ __html: content.html }} />{portals}
        {history && <div className="api-history-backdrop"><section className="api-history-dialog" role="dialog" aria-modal="true"><h2>Customer Details</h2><p>{history.name} · {history.mobile}</p><p>{history.address || 'Store pickup'}</p><table><thead><tr><th>Order</th><th>Status</th><th>Total</th></tr></thead><tbody>{history.orders.map(order => <tr key={order.order_number}><td>{order.order_number}</td><td>{order.order_status}</td><td>{currency(order.total)}</td></tr>)}</tbody></table><button onClick={() => setHistory(null)}>Close</button></section></div>}
    </div>;
}

