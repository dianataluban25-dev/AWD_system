import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createApiClient } from './api-client';
import { LegacyPage, OriginalLogin } from './legacy-design';
import { StoreSettings, StoreAlerts } from './store-settings';
import { ModelTraining } from './model-training';
import '../css/live-admin.css';
import '../css/brand-theme.css';
import '../css/ui-polish.css';
import '../css/typography.css';
import '../css/notifications.css';
import '../css/search-fields.css';

const api = createApiClient();
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
const date = value => new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(value));
const nav = [['dashboard', 'Dashboard'], ['orders', 'Orders'], ['products', 'Products'], ['queuing', 'Order Queue'], ['payments', 'Payments'], ['customers', 'Customers'], ['receipt-records', 'Receipt Records'], ['ai-recommendations', 'Recommendations'], ['settings', 'Settings']];
const active = order => order.queue_position !== null;

function Login({ onLogin }) {
    const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    async function submit(event) {
        event.preventDefault(); const fields = new FormData(event.currentTarget); setBusy(true); setError('');
        try { await api.login(fields.get('email'), fields.get('password')); onLogin(); }
        catch (error) { setError(error.message); } finally { setBusy(false); }
    }
    return <OriginalLogin><form onSubmit={submit} aria-busy={busy}>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-group"><label>Email<input name="email" type="email" autoComplete="username" required /></label></div>
        <div className="form-group"><label>Password<input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required /></label></div>
        <label className="check"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} /> Show password</label>
        <button className="login-btn" disabled={busy}>{busy && <span className="login-spinner" aria-hidden="true"/>}{busy ? 'Signing in…' : 'Sign in'}</button>
    </form></OriginalLogin>;
}

function PasswordReset() {
    const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false); const [show, setShow] = useState(false);
    async function submit(event) {
        event.preventDefault(); const form = new FormData(event.currentTarget);
        const query = new URLSearchParams(location.search); setBusy(true); setError('');
        try {
            await api.request('admin/reset-password', { method: 'POST', token: null, body: {
                email: query.get('email'), token: query.get('token'), password: form.get('password'), password_confirmation: form.get('password_confirmation'),
            } });
            api.forget(); setDone(true); history.replaceState(null, '', '/admin/reset-password');
        } catch (error) { setError(error.message); } finally { setBusy(false); }
    }
    return <main className="login-page"><section className="login-card"><div className="brand">ELEE<span>HARDWARE</span></div><h1>Set admin password</h1>
        {error && <p className="error" role="alert">{error}</p>}
        {done ? <><p>Password updated.</p><a href="/admin/login">Go to sign in</a></> : <form onSubmit={submit}>
            <label>New password<input name="password" type={show ? 'text' : 'password'} minLength={12} maxLength={255} autoComplete="new-password" required /></label>
            <label>Confirm password<input name="password_confirmation" type={show ? 'text' : 'password'} minLength={12} maxLength={255} autoComplete="new-password" required /></label>
            <label className="check"><input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} /> Show password</label>
            <button disabled={busy}>{busy ? 'Saving…' : 'Save password'}</button>
        </form>}
    </section></main>;
}

function VariantPhotoPicker({ title, imageUrls, selectedImages, onFiles, onRemoveUrl, onRemoveImage }) {
    return <>
        <label>{title}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => {
            onFiles([...event.target.files || []]);
            event.target.value = '';
        }} /></label>
        {(imageUrls.length > 0 || selectedImages.length > 0) && <div className="product-image-gallery">
            {imageUrls.map((url, index) => <div className="product-image-preview" key={`${url}-${index}`}><img src={url} alt={`${title} ${index + 1}`} /><button type="button" className="secondary" onClick={() => onRemoveUrl(index)}>Remove</button></div>)}
            {selectedImages.map((item, index) => <div className="product-image-preview" key={item.preview}><img src={item.preview} alt={`New ${title} ${index + 1}`} /><button type="button" className="secondary" onClick={() => onRemoveImage(item)}>Remove</button></div>)}
        </div>}
    </>;
}

function ProductForm({ product, relatedProducts = [], onSave, onClose, busy, error }) {
    const nailSizes = ['uno', 'dos', 'tres', 'kwatro', 'singko', 'sais'];
    const nailAmounts = [
        { key: 'quarter', amount: '1/4', sku: 'QTR', label: '1/4 kg' },
        { key: 'half', amount: '1/2', sku: 'HALF', label: '1/2 kg' },
        { key: 'kilo', amount: '1', sku: '1KG', label: '1 kg' },
    ];
    const chbOptions = [
        { value: 'small', suffix: 'CHB 4" - Tatlong Butas Maliit', label: 'Tatlong Butas Maliit — 4" (100 mm) · 8" × 16" (20 × 40 cm)' },
        { value: 'large', suffix: 'CHB 5" - Tatlong Butas Malaki', label: 'Tatlong Butas Malaki — 5" (125 mm) · 8" × 16" (20 × 40 cm)' },
    ];
    const savedUnit = product?.unit?.trim() || '';
    const savedNailSize = /\s*\((uno|dos|tres|kwatro|singko|sais)\)$/i.exec(savedUnit);
    const legacyNailSize = /^(uno|dos|tres|kwatro|singko|sais)$/i.exec(savedUnit);
    const savedChbOption = chbOptions.find(option => savedUnit.toLowerCase().endsWith(` (${option.suffix.toLowerCase()})`));
    const chbProducts = relatedProducts.length ? relatedProducts : product?.id ? [product] : [];
    const chbTypeFor = unit => chbOptions.find(option => unit?.toLowerCase().endsWith(` (${option.suffix.toLowerCase()})`))?.value;
    const nailSizeFor = unit => {
        const match = /\s*\((uno|dos|tres|kwatro|singko|sais)\)$/i.exec(unit || '') || /^(uno|dos|tres|kwatro|singko|sais)$/i.exec((unit || '').trim());
        return match?.[1]?.toLowerCase();
    };
    const nailAmountFor = unit => {
        const match = /^\s*(1\s*\/\s*4|1\s*\/\s*2|1(?:\.0+)?)\s*(?:kg|kilograms?)\b/i.exec(unit || '');
        const amount = match?.[1]?.replace(/\s/g, '');
        return nailAmounts.find(option => option.amount === amount)?.key;
    };
    const nailProducts = (relatedProducts.length ? relatedProducts : product?.id ? [product] : []).filter(item => nailSizeFor(item.unit));
    const galleryOf = item => item?.image_urls?.length ? item.image_urls : item?.image_url ? [item.image_url] : [];
    const withoutChb = savedChbOption ? savedUnit.slice(0, -(` (${savedChbOption.suffix})`.length)) : savedUnit;
    const baseUnit = withoutChb.replace(/\s*\((?:uno|dos|tres|kwatro|singko|sais)\)$/i, '');
    const unitMatch = /^(?:(\d+(?:\.\d+)?|\d+\s*\/\s*\d+)\s*)?(ml|milliliters?|l|liters?|litres?|pieces?|pcs?|loads?|bags?|kg|kilograms?|meters?|m|sets?|boxes?)$/i.exec(baseUnit);
    const unitTypeFor = value => {
        const unit = value?.toLowerCase() || '';
        if (/^ml|milliliter/.test(unit)) return 'ml';
        if (/^(l|liter|litre)/.test(unit)) return 'liter';
        if (/^(piece|pc)/.test(unit)) return 'piece';
        if (/^load/.test(unit)) return 'load';
        if (/^bag/.test(unit)) return 'bag';
        if (/^(kg|kilogram)/.test(unit)) return 'kg';
        if (/^(m|meter)/.test(unit)) return 'meter';
        if (/^set/.test(unit)) return 'set';
        if (/^box/.test(unit)) return 'box';
        return 'custom';
    };
    const [unitType, setUnitType] = useState(unitMatch ? unitTypeFor(unitMatch[2]) : 'custom');
    const [nailSizesSelected, setNailSizesSelected] = useState(() => [...new Set(nailProducts.filter(item => item.is_active !== false).map(item => nailSizeFor(item.unit)).filter(Boolean))]);
    const [nailAmountsSelected, setNailAmountsSelected] = useState(() => nailAmounts.map(option => option.key));
    const [chbTypes, setChbTypes] = useState(() => [...new Set(chbProducts.filter(item => item.is_active !== false).map(item => chbTypeFor(item.unit)).filter(Boolean))]);
    const [productName, setProductName] = useState(product?.name || '');
    const [productCategory, setProductCategory] = useState(product?.category || '');
    const [imageUrls, setImageUrls] = useState(() => product?.image_urls?.length ? product.image_urls : product?.image_url ? [product.image_url] : []);
    const [selectedImages, setSelectedImages] = useState([]);
    const [variantImageUrls, setVariantImageUrls] = useState(() => Object.fromEntries([
        ...chbProducts.map(item => [`chb_${chbTypeFor(item.unit)}`, galleryOf(item)]),
        ...nailProducts.map(item => [`nail_${nailSizeFor(item.unit)}`, galleryOf(item)]),
    ].filter(([key]) => !key.endsWith('_undefined'))));
    const [variantSelectedImages, setVariantSelectedImages] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [saving, setSaving] = useState(false);
    const imageInput = useRef(null);
    const unitAmountInput = useRef(null);
    const previewUrls = useRef(new Set());
    const hasNailSize = /nail|fastener/i.test(`${productName} ${productCategory}`);
    const hasChbType = /chb|hollow\s*blocks?/i.test(`${productName} ${productCategory}`);
    function addVariantFiles(key, files) {
        setVariantSelectedImages(current => ({
            ...current,
            [key]: [...(current[key] || []), ...files.map(file => {
                const preview = URL.createObjectURL(file); previewUrls.current.add(preview); return { file, preview };
            })],
        }));
    }
    function removeVariantImage(key, item) {
        URL.revokeObjectURL(item.preview); previewUrls.current.delete(item.preview);
        setVariantSelectedImages(current => ({ ...current, [key]: (current[key] || []).filter(value => value !== item) }));
    }
    async function saveVariantGallery(key, existing) {
        let urls = variantImageUrls[key] ?? galleryOf(existing);
        const files = variantSelectedImages[key] || [];
        if (!files.length) return urls;
        setUploading(true);
        const upload = new FormData();
        files.forEach(item => upload.append('images[]', item.file));
        const result = await api.request('staff/products/image', { method: 'POST', body: upload });
        urls = [...urls, ...(result.image_urls || [result.image_url]).filter(Boolean)];
        files.forEach(item => { URL.revokeObjectURL(item.preview); previewUrls.current.delete(item.preview); });
        setVariantImageUrls(current => ({ ...current, [key]: urls }));
        setVariantSelectedImages(current => ({ ...current, [key]: [] }));
        setUploading(false);
        return urls;
    }
    useEffect(() => () => previewUrls.current.forEach(url => URL.revokeObjectURL(url)), []);
    return <div className="modal-backdrop api-dialog-backdrop"><section className="api-dialog" role="dialog" aria-modal="true" aria-labelledby="product-title">
        <h2 id="product-title">{product?.id ? 'Edit product' : 'Add product'}</h2>
        {(error || uploadError) && <p className="error" role="alert">{uploadError || error}</p>}
        <form onSubmit={async event => {
            event.preventDefault();
            if (saving) return;
            setSaving(true);
            try {
            const form = event.currentTarget; const fields = new FormData(form); const amountInput = form.elements.namedItem('unit_amount'); setUploadError('');
            let nextImageUrls = [...imageUrls];
            if (selectedImages.length && !hasChbType && !hasNailSize) {
                setUploading(true);
                try {
                    const upload = new FormData();
                    selectedImages.forEach(item => upload.append('images[]', item.file));
                    const result = await api.request('staff/products/image', { method: 'POST', body: upload });
                    nextImageUrls = [...nextImageUrls, ...(result.image_urls || [result.image_url]).filter(Boolean)];
                    selectedImages.forEach(item => { URL.revokeObjectURL(item.preview); previewUrls.current.delete(item.preview); });
                    setSelectedImages([]);
                    setImageUrls(nextImageUrls);
                } catch (uploadFailure) {
                    setUploadError(uploadFailure.message); setUploading(false); return;
                }
                setUploading(false);
            }
            const image_url = nextImageUrls[0] || null;
            const enteredAmount = fields.get('unit_amount')?.toString().trim() || '';
            const fraction = ['kg', 'load'].includes(unitType) ? /^(\d+)\s*\/\s*(\d+)$/.exec(enteredAmount) : null;
            const numericAmount = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(enteredAmount);
            if (!hasNailSize && unitType !== 'custom' && (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1000000)) {
                amountInput?.setCustomValidity(['kg', 'load'].includes(unitType) ? 'Enter an amount like 1/4, 1/2, or 1.' : 'Enter an amount greater than zero.');
                amountInput?.reportValidity(); return;
            }
            const amount = fraction ? `${fraction[1]}/${fraction[2]}` : enteredAmount;
            const unitNames = { ml: 'ml', liter: numericAmount === 1 ? 'liter' : 'liters', piece: numericAmount === 1 ? 'piece' : 'pieces', load: numericAmount === 1 ? 'load' : 'loads', bag: numericAmount === 1 ? 'bag' : 'bags', kg: 'kg', meter: numericAmount === 1 ? 'meter' : 'meters', set: numericAmount === 1 ? 'set' : 'sets', box: numericAmount === 1 ? 'box' : 'boxes' };
            const base = unitType === 'custom' ? fields.get('unit_other')?.toString().trim() : `${amount} ${unitNames[unitType]}`;
            if (hasNailSize) {
                if (!nailSizesSelected.length || !nailAmountsSelected.length) {
                    setUploadError('Choose at least one nail size and one package amount.');
                    return;
                }
                const selectedCombos = nailSizesSelected.flatMap(size => nailAmountsSelected.map(amountKey => ({
                    size, amount: nailAmounts.find(item => item.key === amountKey),
                })));
                const nailImagesBySize = Object.fromEntries(await Promise.all(nailSizesSelected.map(async size => [
                    size,
                    await saveVariantGallery(`nail_${size}`, nailProducts.find(item => nailSizeFor(item.unit) === size)),
                ])));
                const selectedRows = await Promise.all(selectedCombos.map(async ({ size, amount: option }) => {
                    const comboKey = `nail_${size}_${option.key}`;
                    const existing = nailProducts.find(item => nailSizeFor(item.unit) === size && nailAmountFor(item.unit) === option.key);
                    const sku = fields.get(`${comboKey}_sku`)?.toString().trim() || '';
                    const price = Number(fields.get(`${comboKey}_price`));
                    const stock = Number(fields.get(`${comboKey}_stock`));
                    const images = nailImagesBySize[size] ?? galleryOf(existing);
                    return { id: existing?.id, sku, name: fields.get('name'), category: fields.get('category'),
                        unit: `${option.amount} kg (${size[0].toUpperCase() + size.slice(1)})`, price_centavos: Math.round(price * 100), stock,
                        description: fields.get('description') || null, image_url: images[0] || null, image_urls: images,
                        is_active: fields.get('is_active') === 'on' };
                }));
                if (selectedRows.some(row => !row.sku || row.sku.length > 100 || row.price_centavos < 1 || !Number.isFinite(row.stock) || row.stock < 0)) {
                    setUploadError('Enter a unique SKU, price, and stock for every selected nail size and amount.');
                    return;
                }
                const selectedComboKeys = new Set(selectedCombos.map(({ size, amount: option }) => `${size}_${option.key}`));
                const deselectedRows = nailProducts.filter(item => !selectedComboKeys.has(`${nailSizeFor(item.unit)}_${nailAmountFor(item.unit)}`)).map(item => {
                    const images = variantImageUrls[`nail_${nailSizeFor(item.unit)}`] ?? galleryOf(item);
                    return { id: item.id, sku: item.sku, name: fields.get('name'), category: fields.get('category'), unit: item.unit,
                        price_centavos: Math.round(Number(item.price) * 100), stock: Number(item.stock),
                        description: fields.get('description') || null, image_url: images[0] || null, image_urls: images, is_active: false };
                });
                await onSave([...selectedRows, ...deselectedRows]);
                return;
            }
            if (hasChbType) {
                if (!base || !chbTypes.length) {
                    setUploadError('Choose at least one CHB type and enter its unit/amount.');
                    return;
                }
                const selectedRows = await Promise.all(chbTypes.map(async value => {
                    const option = chbOptions.find(item => item.value === value);
                    const existing = chbProducts.find(item => chbTypeFor(item.unit) === value);
                    const sku = fields.get(`chb_${value}_sku`)?.toString().trim() || '';
                    const price = Number(fields.get(`chb_${value}_price`));
                    const stock = Number(fields.get(`chb_${value}_stock`));
                    const images = await saveVariantGallery(`chb_${value}`, existing);
                    return { id: existing?.id, sku, name: fields.get('name'), category: fields.get('category'),
                        unit: `${base} (${option.suffix})`, price_centavos: Math.round(price * 100), stock,
                        description: fields.get('description') || null, image_url: images[0] || null, image_urls: images,
                        is_active: fields.get('is_active') === 'on' };
                }));
                if (selectedRows.some(row => !row.sku || row.sku.length > 100 || row.price_centavos < 1 || !Number.isFinite(row.stock) || row.stock < 0)) {
                    setUploadError('Enter a unique SKU, price, and stock for each selected CHB type.');
                    return;
                }
                const deselectedRows = chbProducts.filter(item => !chbTypes.includes(chbTypeFor(item.unit))).map(item => {
                    const images = variantImageUrls[`chb_${chbTypeFor(item.unit)}`] ?? galleryOf(item);
                    return { id: item.id, sku: item.sku, name: fields.get('name'), category: fields.get('category'), unit: item.unit,
                        price_centavos: Math.round(Number(item.price) * 100), stock: Number(item.stock),
                        description: fields.get('description') || null, image_url: images[0] || null, image_urls: images, is_active: false };
                });
                await onSave([...selectedRows, ...deselectedRows]);
                return;
            }
            const unit = `${base || ''}`.trim();
            if (!unit) return;
            await onSave([{
                id: product?.id,
                sku: fields.get('sku'), name: fields.get('name'), category: fields.get('category'), unit,
                price_centavos: Math.round(Number(fields.get('price')) * 100), stock: Number(fields.get('stock')),
                description: fields.get('description') || null, image_url, image_urls: nextImageUrls,
                is_active: fields.get('is_active') === 'on',
            }]);
            } catch (saveFailure) {
                setUploadError(saveFailure.message || 'Could not save the product. Please try again.');
            } finally {
                setSaving(false);
                setUploading(false);
            }
        }}>
            <div className="form-grid">
                {!hasChbType && !hasNailSize && <label>SKU<input name="sku" defaultValue={product?.sku || ''} maxLength={100} required /></label>}
                <label>Name<input name="name" defaultValue={product?.name || ''} onChange={event => setProductName(event.target.value)} maxLength={255} required /></label>
                <label>Category<input name="category" defaultValue={product?.category || ''} onChange={event => setProductCategory(event.target.value)} maxLength={100} required /></label>
                {!hasNailSize && <label>Unit<select name="unit_type" value={unitType} onChange={event => setUnitType(event.target.value)}>
                    <option value="piece">Pieces</option><option value="load">Load</option><option value="bag">Bag</option>
                    <option value="ml">Milliliter (ml)</option><option value="liter">Liter</option><option value="kg">Kilogram (kg)</option>
                    <option value="meter">Meter</option><option value="set">Set</option><option value="box">Box</option><option value="custom">Other unit</option>
                </select></label>}
                {!hasNailSize && (unitType === 'custom' ? <label>Unit name<input name="unit_other" defaultValue={legacyNailSize ? 'piece' : baseUnit || ''} maxLength={50} placeholder="e.g. sheet, bundle" required /></label> :
                    <label>Amount ({unitType === 'ml' ? 'ml' : unitType === 'liter' ? 'liter' : unitType === 'kg' ? 'kg' : unitType === 'meter' ? 'meter' : unitType === 'piece' ? 'pieces' : unitType})<input ref={unitAmountInput} name="unit_amount" type={['kg', 'load'].includes(unitType) ? 'text' : 'number'} inputMode={['kg', 'load'].includes(unitType) ? 'text' : undefined} min={['kg', 'load'].includes(unitType) ? undefined : '0.01'} max={['kg', 'load'].includes(unitType) ? undefined : '1000000'} step={['kg', 'load'].includes(unitType) ? undefined : '0.01'} defaultValue={unitMatch?.[1] || (unitMatch ? '1' : '')} placeholder={['kg', 'load'].includes(unitType) ? 'e.g. 1/4, 1/2, 1' : unitType === 'piece' ? 'e.g. 500' : 'Enter amount'} onInput={event => event.currentTarget.setCustomValidity('')} required /></label>)}
                {hasNailSize && <div className="nail-size-picker"><strong>Nail sizes available to customers</strong>{nailSizes.map(size => <label className="check" key={size}><input type="checkbox" checked={nailSizesSelected.includes(size)} onChange={event => setNailSizesSelected(current => event.target.checked ? [...current, size] : current.filter(value => value !== size))} />{size[0].toUpperCase() + size.slice(1)}</label>)}</div>}
                {hasNailSize && <div className="nail-size-picker"><strong>Nail package amount available to customers</strong>{nailAmounts.map(option => <label className="check" key={option.key}><input type="checkbox" checked={nailAmountsSelected.includes(option.key)} onChange={event => setNailAmountsSelected(current => event.target.checked ? [...current, option.key] : current.filter(value => value !== option.key))} />{option.label}</label>)}</div>}
                {hasNailSize && nailSizesSelected.map(size => {
                    const imageExisting = nailProducts.find(item => nailSizeFor(item.unit) === size);
                    const skuBase = product?.sku?.replace(/-(UNO|DOS|TRES|KWATRO|SINGKO|SAIS)(?:-.+)?$/i, '');
                    return <React.Fragment key={size}>
                        <div className="nail-option-heading">Nail size: {size[0].toUpperCase() + size.slice(1)}</div>
                        <VariantPhotoPicker title={`Photos for ${size[0].toUpperCase() + size.slice(1)} nails`} imageUrls={variantImageUrls[`nail_${size}`] ?? galleryOf(imageExisting)} selectedImages={variantSelectedImages[`nail_${size}`] || []}
                            onFiles={files => addVariantFiles(`nail_${size}`, files)}
                            onRemoveUrl={index => setVariantImageUrls(current => ({ ...current, [`nail_${size}`]: (current[`nail_${size}`] ?? galleryOf(imageExisting)).filter((_, photoIndex) => photoIndex !== index) }))}
                            onRemoveImage={item => removeVariantImage(`nail_${size}`, item)} />
                        {nailAmountsSelected.map(amountKey => {
                            const option = nailAmounts.find(item => item.key === amountKey);
                            const existing = nailProducts.find(item => nailSizeFor(item.unit) === size && nailAmountFor(item.unit) === amountKey);
                            const comboKey = `nail_${size}_${amountKey}`;
                            const generatedSku = skuBase ? `${skuBase}-${size.toUpperCase()}-${option.sku}` : '';
                            return <React.Fragment key={amountKey}>
                                <div className="nail-option-heading">{size[0].toUpperCase() + size.slice(1)} · {option.label}</div>
                                <label>SKU<input name={`${comboKey}_sku`} defaultValue={existing?.sku || generatedSku} maxLength={100} required /></label>
                                <label>Price (PHP)<input name={`${comboKey}_price`} type="number" min="0.01" max="1000000" step="0.01" defaultValue={existing?.price ?? ''} required /></label>
                                <label>Available stock<input name={`${comboKey}_stock`} type="number" min="0" max="1000000" step="1" defaultValue={existing?.stock ?? ''} required /></label>
                            </React.Fragment>;
                        })}
                    </React.Fragment>;
                })}
                {hasChbType && <div className="chb-type-picker"><strong>CHB types available to customers</strong>{chbOptions.map(option => <label className="check" key={option.value}><input type="checkbox" checked={chbTypes.includes(option.value)} onChange={event => setChbTypes(current => event.target.checked ? [...current, option.value] : current.filter(value => value !== option.value))} />{option.label}</label>)}</div>}
                {hasChbType && chbTypes.map(value => {
                    const option = chbOptions.find(item => item.value === value);
                    const existing = chbProducts.find(item => chbTypeFor(item.unit) === value);
                    const generatedSku = product?.sku ? `${product.sku.replace(/-CHB[45]$/i, '')}-CHB${value === 'small' ? '4' : '5'}` : '';
                    return <React.Fragment key={value}>
                        <div className="chb-option-heading">{option.label}</div>
                        <label>SKU ({value === 'small' ? '4-inch' : '5-inch'})<input name={`chb_${value}_sku`} defaultValue={existing?.sku || generatedSku} maxLength={100} required /></label>
                        <label>Price (PHP)<input name={`chb_${value}_price`} type="number" min="0.01" max="1000000" step="0.01" defaultValue={existing?.price ?? ''} required /></label>
                        <label>Available stock<input name={`chb_${value}_stock`} type="number" min="0" max="1000000" step="1" defaultValue={existing?.stock ?? ''} required /></label>
                        <VariantPhotoPicker title={`Photos for ${value === 'small' ? '4-inch small' : '5-inch large'} hollowblocks`} imageUrls={variantImageUrls[`chb_${value}`] ?? galleryOf(existing)} selectedImages={variantSelectedImages[`chb_${value}`] || []}
                            onFiles={files => addVariantFiles(`chb_${value}`, files)}
                            onRemoveUrl={index => setVariantImageUrls(current => ({ ...current, [`chb_${value}`]: (current[`chb_${value}`] ?? galleryOf(existing)).filter((_, photoIndex) => photoIndex !== index) }))}
                            onRemoveImage={item => removeVariantImage(`chb_${value}`, item)} />
                    </React.Fragment>;
                })}
                {!hasNailSize && ['kg', 'load'].includes(unitType) && <div className="unit-fraction-options" aria-label="Fraction shortcuts"><button type="button" className="secondary" onClick={() => { if (unitAmountInput.current) { unitAmountInput.current.value = '1/4'; unitAmountInput.current.setCustomValidity(''); } }}>1/4 {unitType}</button><button type="button" className="secondary" onClick={() => { if (unitAmountInput.current) { unitAmountInput.current.value = '1/2'; unitAmountInput.current.setCustomValidity(''); } }}>1/2 {unitType}</button></div>}
                {!hasChbType && !hasNailSize && <><label>Price (PHP)<input name="price" type="number" min="0.01" max="1000000" step="0.01" defaultValue={product?.price ?? ''} required /></label>
                <label>Available stock<input name="stock" type="number" min="0" max="1000000" step="1" defaultValue={product?.stock ?? ''} required /></label></>}
            </div>
            <p className="form-help">Choose a unit and amount that fit the product. For nails, select each available size and package amount (1/4 kg, 1/2 kg, or 1 kg), then set the SKU, price, and stock for every combination. Customers can choose the exact size and amount they want.</p>
            <label>Description<textarea name="description" defaultValue={product?.description || ''} maxLength={5000} /></label>
            {!hasChbType && !hasNailSize && <label>Product photos<input ref={imageInput} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => {
                const files = [...(event.target.files || [])];
                setSelectedImages(current => [...current, ...files.map(file => {
                    const preview = URL.createObjectURL(file); previewUrls.current.add(preview); return { file, preview };
                })]);
                event.target.value = '';
            }} /></label>}
            {!hasChbType && !hasNailSize && (imageUrls.length > 0 || selectedImages.length > 0) && <div className="product-image-gallery">
                {imageUrls.map((url, index) => <div className="product-image-preview" key={`${url}-${index}`}><img src={url} alt={`Product photo ${index + 1}`} /><button type="button" className="secondary" onClick={() => setImageUrls(current => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div>)}
                {selectedImages.map((item, index) => <div className="product-image-preview" key={item.preview}><img src={item.preview} alt={`New product photo ${index + 1}`} /><button type="button" className="secondary" onClick={() => { URL.revokeObjectURL(item.preview); previewUrls.current.delete(item.preview); setSelectedImages(current => current.filter(value => value !== item)); }}>Remove</button></div>)}
            </div>}
            <label className="check"><input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} /> Visible to customers</label>
            <div className="actions"><button type="submit" disabled={saving || uploading}>{uploading ? 'Uploading photos…' : saving ? 'Saving…' : 'Save product'}</button><button className="secondary" type="button" onClick={onClose} disabled={saving || uploading}>Cancel</button></div>
        </form>
    </section></div>;
}

function OrderDetails({ order, onClose }) {
    return <div className="modal-backdrop api-dialog-backdrop"><section className="api-dialog" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <h2 id="order-title">{order.order_number}</h2><p>{order.customer_name} · {order.mobile_number}</p>
        <p>{order.fulfillment_method === 'store_pickup' ? 'Store pickup' : `Delivery: ${order.address}`}</p><p>{order.order_status} · Payment: {order.payment_status}</p>
        {order.delivery_notice && <p>{order.delivery_notice}</p>}
        <div className="table-wrap"><table><thead><tr><th>Item</th><th>Quantity</th><th>Amount</th></tr></thead><tbody>
            {order.items.map(item => <tr key={item.product_id}><td>{item.name}</td><td>{item.quantity} {item.unit}</td><td>{money(item.line_total)}</td></tr>)}
        </tbody></table></div><p>Delivery fee: {money(order.delivery_fee)}</p><strong>Total: {money(order.total)}</strong>
        <div className="actions"><button onClick={onClose}>Close</button></div>
    </section></div>;
}


function App() {
    const initial = location.pathname.split('/').filter(Boolean).at(-1);
    const [page, setPage] = useState(nav.some(([key]) => key === initial) ? initial : 'dashboard');
    const [signedIn, setSignedIn] = useState(api.hasToken()); const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
    const [search, setSearch] = useState(''); const [filter, setFilter] = useState(initial === 'queuing' ? 'active' : 'all');
    const [editing, setEditing] = useState(null); const [details, setDetails] = useState(null);
    const autoLoading = useRef(false);
    const updateVersion = useRef(0);

    async function load({ background = false } = {}) {
        if (background && autoLoading.current) return;
        const version = ++updateVersion.current;
        autoLoading.current = true;
        if (!background) setLoading(true);
        setError('');
        try { const [orders, products, account, store] = await Promise.all([api.all('staff/orders'), api.all('staff/products'), api.request('staff/me'), api.request('staff/settings')]); if (version === updateVersion.current) { setData({ orders, products, account, store }); if (!account.is_admin && page === 'settings') setPage('dashboard'); } }
        catch (error) { if (version !== updateVersion.current) return; setError(error.message); if ([401, 403].includes(error.status)) { api.forget(); setSignedIn(false); setData(null); } }
        finally { if (version === updateVersion.current) { autoLoading.current = false; if (!background) setLoading(false); } }
    }
    useEffect(() => { if (signedIn) load(); }, [signedIn]);
    useEffect(() => {
        if (!signedIn || busy || editing || details || page === 'settings') return;
        const update = () => { if (document.visibilityState === 'visible') load({ background: true }); };
        const timer = window.setInterval(update, 10000);
        window.addEventListener('focus', update);
        return () => { window.clearInterval(timer); window.removeEventListener('focus', update); };
    }, [signedIn, busy, editing, details, page]);
    useEffect(() => {
        const back = () => { const key = location.pathname.split('/').filter(Boolean).at(-1); setPage(nav.some(([name]) => name === key) ? key : 'dashboard'); };
        window.addEventListener('popstate', back); return () => window.removeEventListener('popstate', back);
    }, []);
    function navigate(key) { setPage(key); setSearch(''); setFilter(key === 'queuing' ? 'active' : 'all'); history.pushState(null, '', `/admin/${key}`); }
    async function mutate(path, body, method = 'PATCH') {
        setBusy(true); setError('');
        try { await api.request(path, { method, body }); await load(); return true; }
        catch (error) { setError(error.message); return false; } finally { setBusy(false); }
    }
    async function logout() {
        updateVersion.current++; autoLoading.current = false;
        setBusy(true);
        try { await api.request('staff/logout', { method: 'POST' }); api.forget(); setData(null); setSignedIn(false); history.replaceState(null, '', '/admin/login'); }
        catch (error) { if (error.status === 401) { api.forget(); setData(null); setSignedIn(false); } else setError(error.message); }
        finally { setBusy(false); }
    }
    if (!signedIn) return <Login onLogin={() => { setSignedIn(true); history.replaceState(null, '', `/admin/${page}`); }} />;
    const orders = data?.orders || []; const products = data?.products || []; const queue = orders.filter(active); const query = search.trim().toLowerCase();
    const visible = orders.filter(order => (filter === 'all' || (filter === 'active' ? active(order) : order.order_status === filter)) && `${order.order_number} ${order.customer_name}`.toLowerCase().includes(query));
    const customers = new Map();
    orders.forEach(order => { const customer = customers.get(order.mobile_number) || { name: order.customer_name, mobile: order.mobile_number, count: 0, total: 0 }; customer.count++; customer.total += order.total; customers.set(order.mobile_number, customer); });
    function actions(order) {
        const path = `staff/orders/${encodeURIComponent(order.order_number)}`;
        return <div className="row-actions"><button className="secondary" onClick={() => setDetails(order)}>Details</button>
            {order.order_status === 'Pending' && <button disabled={busy || loading} onClick={() => mutate(`${path}/status`, { status: 'Processing' })}>Start processing</button>}
            {order.order_status === 'Processing' && <button disabled={busy || loading} onClick={() => mutate(`${path}/status`, { status: order.fulfillment_method === 'store_pickup' ? 'Ready for Pickup' : 'Ready for Delivery' })}>Mark ready</button>}
            {active(order) && order.payment_status !== 'Paid' && (order.payment_method !== 'cash_on_delivery' || order.order_status === 'Ready for Delivery') && <button className="secondary" disabled={busy || loading} onClick={() => { if (confirm(order.payment_method === 'cash_on_delivery' ? 'Confirm this order was delivered and cash was received? This completes the order.' : 'Confirm cash was received at the store?')) mutate(`${path}/paid`); }}>{order.payment_method === 'cash_on_delivery' ? 'Confirm delivered & paid' : 'Record cash received'}</button>}
            {active(order) && order.payment_status === 'Paid' && order.order_status === (order.fulfillment_method === 'delivery' ? 'Ready for Delivery' : 'Ready for Pickup') && <button disabled={busy || loading} onClick={() => { if (confirm('Confirm this order was handed to the customer?')) mutate(`${path}/complete`); }}>Complete order</button>}
            {active(order) && order.payment_status !== 'Paid' && <button className="danger" disabled={busy || loading} onClick={() => { if (confirm('Cancel this order and return its stock?')) mutate(`${path}/status`, { status: 'Cancelled' }); }}>Cancel</button>}
        </div>;
    }
    function orderTable(rows, manage = false) {
        return <div className="table-wrap"><table><thead><tr><th>Queue</th><th>Order</th><th>Customer</th><th>Placed</th><th>Fulfillment</th><th>Status</th><th>Total</th>{manage && <th>Actions</th>}</tr></thead><tbody>{rows.map(order => <tr key={order.order_number}>
            <td className="position">{order.queue_position ? `#${order.queue_position}` : '—'}</td><td><button className="text-button" onClick={() => setDetails(order)}>{order.order_number}</button><small>{order.queue_number}</small></td><td>{order.customer_name}</td><td>{date(order.created_at)}</td><td>{order.fulfillment_method === 'store_pickup' ? 'Store pickup' : 'Delivery'}</td><td><span className="badge">{order.order_status}</span><small>{order.payment_status}</small></td><td>{money(order.total)}</td>{manage && <td>{actions(order)}</td>}
        </tr>)}</tbody></table>{rows.length === 0 && <p className="empty">No orders found.</p>}</div>;
    }
    return <>
        {page === 'ai-recommendations' && <ModelTraining api={api}/>}
        {data && page !== 'settings' && <StoreAlerts api={api} data={data} />}
        <LegacyPage key={page} page={page} data={data} loading={loading} busy={busy} error={error}
            navigate={navigate} logout={logout} refresh={load} actions={actions} editProduct={product => { setError(''); setEditing(product); }}
            details={setDetails} settings={<StoreSettings api={api} />}
            saveRecommendations={(id,ids)=>mutate(`staff/products/${id}/recommendations`,{recommended_product_ids:ids})}
            changeProduct={(id,body)=>mutate(`staff/products/${id}`,body)} deleteProduct={id=>mutate(`staff/products/${id}`,undefined,'DELETE')} />
        {editing && <ProductForm
            product={editing}
            relatedProducts={editing.id ? products.filter(item => item.category === editing.category && item.name.trim().toLowerCase() === editing.name.trim().toLowerCase()) : []}
            busy={busy}
            error={error}
            onClose={() => setEditing(null)}
            onSave={async variants => {
                for (const variant of variants) {
                    const { id, ...body } = variant;
                    if (!await mutate(id ? `staff/products/${id}` : 'staff/products', body, id ? 'PATCH' : 'POST')) return;
                }
                setEditing(null);
            }}
        />}
        {details && <OrderDetails order={details} onClose={() => setDetails(null)} />}
    </>;
}
createRoot(document.getElementById('root')).render(location.pathname === '/admin/reset-password' ? <PasswordReset /> : <App />);

