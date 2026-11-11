const r=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
<meta charset="UTF-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1.0">\r
<title>EleeSiWeb - Orders & Products</title>\r
\r
<style>\r
*{box-sizing:border-box;margin:0;padding:0}\r
body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111}\r
\r
.sidebar{position:fixed;left:0;top:0;width:235px;height:100vh;background:#00551f;color:#fff;padding:28px 16px;z-index:100}\r
.logo{font-size:36px;font-weight:900;margin-left:12px;letter-spacing:-2px}\r
.logo span{color:#ffbd00}\r
.hardware{color:#ffbd00;font-size:14px;font-weight:bold;margin-left:13px;margin-top:3px;margin-bottom:25px}\r
.menu{display:flex;flex-direction:column;gap:7px}\r
.menu a{text-decoration:none;color:#fff;padding:13px 14px;border-radius:7px;font-size:14px;display:flex;align-items:center;gap:12px}\r
.menu a:hover,.menu a.active{background:#08732e}\r
.icon{width:20px;text-align:center;font-size:18px}\r
\r
.main{margin-left:235px;padding:46px 42px;min-height:100vh}\r
.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;gap:20px}\r
.section-title{font-size:25px;color:#147a36;font-weight:600}\r
.section-description{color:#777;font-size:14px;margin-top:4px}\r
\r
.tabs{\r
    display:grid;\r
    grid-template-columns:repeat(6,minmax(0,1fr));\r
    align-items:center;\r
    column-gap:18px;\r
    width:100%;\r
    min-width:950px;\r
    margin-bottom:18px\r
}\r
.tab{\r
    width:100%;border:none;background:transparent;font-size:15px;\r
    font-weight:600;cursor:pointer;padding:10px 8px;white-space:nowrap;\r
    color:#111;border-radius:7px;text-align:center\r
}\r
.tab.active{background:#b9e8c0;color:#075b21}\r
.tab:hover{background:#e4f5e7;color:#075b21}\r
\r
.search-container{width:100%;margin-bottom:25px}\r
.search-box{\r
    width:100%;height:55px;border:1px solid #dedede;border-radius:10px;\r
    display:flex;align-items:center;padding:0 18px;\r
    box-shadow:0 1px 4px rgba(0,0,0,.03)\r
}\r
.search-icon{font-size:28px;color:#999;margin-right:15px}\r
.search-box input{border:none;outline:none;width:100%;font-size:16px;color:#333}\r
.search-box input::placeholder{color:#999}\r
\r
.orders-table,.products-table{width:100%;overflow-x:auto}\r
.table-header,.order-row{\r
    display:grid;\r
    grid-template-columns:1.45fr 1.25fr 1fr .75fr 1.55fr .55fr;\r
    align-items:center;column-gap:18px;min-width:950px\r
}\r
.table-header{padding:0 3px 16px;font-size:15px;font-weight:700}\r
.order-row{min-height:75px;border-top:1px solid #eee;font-size:14px}\r
.order-id,.customer,.total{font-weight:600}\r
.date{color:#555}\r
\r
.status{display:inline-block;width:max-content;padding:6px 10px;border-radius:5px;font-size:12px;font-weight:600}\r
.pending{background:#fff0bd;color:#e49b00}\r
.processing{background:#c9e0ff;color:#277ed8}\r
.ready{background:#c3edc5;color:#13a52a}\r
.completed{background:#bcebbf;color:#08a425}\r
.cancelled{background:#ffc5c5;color:#e33b3b}\r
\r
.view-btn,.edit-btn{\r
    border:none;background:#b9e8c0;color:#16833a;padding:7px 13px;\r
    border-radius:5px;cursor:pointer;font-size:13px;font-weight:600\r
}\r
.view-btn:hover,.edit-btn:hover{background:#91d99d}\r
\r
.add-btn{\r
    background:#08752f;color:#fff;border:none;padding:11px 18px;\r
    border-radius:7px;cursor:pointer;font-size:14px;font-weight:600\r
}\r
.add-btn:hover{background:#065b25}\r
\r
.no-results{display:none;padding:25px;text-align:center;color:#777}\r
\r
.bottom{\r
    display:flex;justify-content:space-between;align-items:center;\r
    margin-top:30px;margin-bottom:70px;font-size:14px;color:#444\r
}\r
.pagination{display:flex;align-items:center;gap:8px}\r
.page{\r
    cursor:pointer;font-weight:500;min-width:32px;height:32px;\r
    display:flex;align-items:center;justify-content:center;\r
    border-radius:5px;padding:0 7px\r
}\r
.page.active{background:#299b4d;color:#fff}\r
.page:hover{background:#e4f5e7;color:#147a36}\r
.page.disabled{color:#bbb;cursor:not-allowed;background:none}\r
\r
.section-divider{height:1px;background:#e5e5e5;margin:20px 0 45px}\r
\r
.product-header,.product-row{\r
    display:grid;\r
    grid-template-columns:2fr 1fr 1fr 1.2fr 1fr 1fr .8fr;\r
    align-items:center;column-gap:18px;min-width:900px\r
}\r
.product-header{padding:0 3px 16px;font-size:15px;font-weight:700}\r
.product-row{min-height:82px;border-top:1px solid #eee;font-size:14px}\r
.product-info{display:flex;align-items:center;gap:12px}\r
.product-image{\r
    width:48px;height:48px;border-radius:8px;background:#e8f5eb;\r
    display:flex;align-items:center;justify-content:center;\r
    color:#147a36;font-size:22px;font-weight:bold\r
}\r
.product-name{font-weight:700}\r
.product-category{color:#777;font-size:12px;margin-top:3px}\r
.price,.stock{font-weight:600}\r
.stock.low{color:#e49b00}\r
.stock.critical{color:#e33b3b}\r
.availability{\r
    display:inline-block;padding:6px 10px;border-radius:5px;\r
    font-size:12px;font-weight:600\r
}\r
.available{background:#bcebbf;color:#08a425}\r
.unavailable{background:#ffc5c5;color:#e33b3b}\r
\r
.product-form{\r
    display:none;background:#f8faf8;border:1px solid #e2e8e3;\r
    border-radius:12px;padding:25px;margin-bottom:25px\r
}\r
.product-form.show{display:block}\r
.form-title{font-size:20px;color:#147a36;margin-bottom:20px;font-weight:600}\r
.form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}\r
.form-group{display:flex;flex-direction:column}\r
.form-group label{font-size:13px;font-weight:600;margin-bottom:7px;color:#444}\r
.form-group input,.form-group select{\r
    width:100%;height:43px;padding:0 12px;border:1px solid #d7d7d7;\r
    border-radius:7px;outline:none;background:#fff;font-size:14px\r
}\r
.form-buttons{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}\r
.cancel-form{background:#eee;border:none;padding:10px 18px;border-radius:6px;cursor:pointer}\r
.save-product,.save-btn{\r
    background:#08752f;color:#fff;border:none;padding:10px 18px;\r
    border-radius:6px;cursor:pointer\r
}\r
\r
.modal-bg{\r
    display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);\r
    justify-content:center;align-items:center;z-index:999;padding:20px\r
}\r
.modal{\r
    background:#fff;width:500px;max-width:100%;border-radius:12px;\r
    padding:28px;box-shadow:0 10px 40px rgba(0,0,0,.2)\r
}\r
.modal h2{color:#147a36;margin-bottom:22px}\r
.detail{margin-bottom:15px}\r
.detail label{display:block;color:#777;font-size:13px;margin-bottom:5px}\r
.detail strong{font-size:16px}\r
.status-select{\r
    width:100%;padding:11px;border:1px solid #ddd;\r
    border-radius:7px;font-size:15px;outline:none\r
}\r
.modal-buttons{display:flex;justify-content:flex-end;gap:10px;margin-top:25px}\r
.close-btn{background:#eee;border:none;padding:10px 18px;border-radius:6px;cursor:pointer}\r
\r
@media(max-width:1100px){\r
.sidebar{width:190px}\r
.main{margin-left:190px;padding:35px 25px}\r
.form-grid{grid-template-columns:repeat(2,1fr)}\r
}\r
@media(max-width:700px){\r
.sidebar{position:relative;width:100%;height:auto}\r
.menu{display:grid;grid-template-columns:repeat(2,1fr)}\r
.main{margin-left:0;padding:30px 18px}\r
.section-header{align-items:flex-start;flex-direction:column}\r
.form-grid{grid-template-columns:1fr}\r
.bottom{flex-direction:column;gap:20px;align-items:flex-start}\r
}\r
</style>\r
</head>\r
\r
<body>\r
\r
<div class="sidebar">\r
    <div class="logo"><span style="color:white">E</span><span>LEE</span></div>\r
    <div class="hardware">HARDWARE</div>\r
\r
    <div class="menu">\r
        <a href="/"><span class="icon">☼</span><span>Dashboard</span></a>\r
        <a href="/orders" class="active"><span class="icon">▣</span><span>Orders</span></a>\r
        <a href="/products"><span class="icon">◇</span><span>Products</span></a>\r
        <a href="/ai-recommendations"><span class="icon">↗</span><span>AI Recommendations</span></a>\r
        <a href="/payments"><span class="icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 5.5v-.75A1.75 1.75 0 0 1 8.75 3h8.5"/><path d="M16 13h4.5"/><circle cx="16" cy="13" r=".55"/></svg></span><span>Payments</span></a>\r
        <a href="/customers"><span class="icon">♙</span><span>Customers</span></a>\r
        <a href="/queuing"><span class="icon">▱</span><span>Queuing</span></a>\r
        <a href="/receipt-records"><span class="icon">▤</span><span>Receipt Records</span></a>\r
        <a href="/settings"><span class="icon">⚙</span><span>Settings</span></a>\r
    </div>\r
</div>\r
\r
<div class="main">\r
\r
<div class="section-header">\r
    <div>\r
        <div class="section-title">Order Management</div>\r
        <div class="section-description">View customer orders and update order status</div>\r
    </div>\r
</div>\r
\r
<div class="tabs">\r
    <button class="tab active" data-status="All Orders">All Orders</button>\r
    <button class="tab" data-status="Pending">Pending</button>\r
    <button class="tab" data-status="Processing">Processing</button>\r
    <button class="tab" data-status="Ready for Delivery">Ready for Delivery</button>\r
    <button class="tab" data-status="Completed">Completed</button>\r
    <button class="tab" data-status="Cancelled">Cancelled</button>\r
</div>\r
\r
<div class="search-container" id="searchContainer">\r
    <div class="search-box">\r
        <span class="search-icon">⌕</span>\r
        <input type="text" id="searchInput" placeholder="Search order ID or customer...">\r
    </div>\r
</div>\r
\r
<div class="orders-table">\r
\r
    <div class="table-header">\r
        <div>Order ID</div>\r
        <div>Customer</div>\r
        <div>Status</div>\r
        <div>Total</div>\r
        <div>Date</div>\r
        <div>Actions</div>\r
    </div>\r
\r
    <div id="ordersList"></div>\r
\r
    <div class="no-results" id="noResults">\r
        No orders found.\r
    </div>\r
</div>\r
\r
<div class="bottom">\r
    <div id="orderCount">Showing 0 to 0 of 0 orders</div>\r
    <div class="pagination" id="pagination"></div>\r
</div>\r
\r
<div class="section-divider"></div>\r
\r
<div class="section-header">\r
    <div>\r
        <div class="section-title">Products & Inventory</div>\r
        <div class="section-description">\r
            Add, edit, and manage product information, prices, units, categories, availability, images, and stock quantities\r
        </div>\r
    </div>\r
\r
    <button class="add-btn" id="addProductButton" type="button">+ Add Product</button>\r
</div>\r
\r
<div class="product-form" id="productForm">\r
\r
    <div class="form-title">Add / Edit Product</div>\r
\r
    <div class="form-grid">\r
\r
        <div class="form-group">\r
            <label>Product Name</label>\r
            <input type="text" id="productName" placeholder="Enter product name">\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Price</label>\r
            <input type="number" id="productPrice" placeholder="Enter price">\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Unit</label>\r
            <select id="productUnit">\r
                <option value="pc">Piece (pc)</option>\r
                <option value="kg">Kilogram (kg)</option>\r
                <option value="bag">Bag</option>\r
                <option value="box">Box</option>\r
                <option value="meter">Meter</option>\r
            </select>\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Category</label>\r
            <select id="productCategory">\r
                <option value="Construction">Construction</option>\r
                <option value="Electrical">Electrical</option>\r
                <option value="Plumbing">Plumbing</option>\r
                <option value="Tools">Tools</option>\r
                <option value="Others">Others</option>\r
            </select>\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Stock Quantity</label>\r
            <input type="number" id="productStock" placeholder="Enter stock quantity">\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Availability</label>\r
            <select id="productAvailability">\r
                <option value="Available">Available</option>\r
                <option value="Unavailable">Unavailable</option>\r
            </select>\r
        </div>\r
\r
        <div class="form-group">\r
            <label>Product Image</label>\r
            <input type="file" id="productImage" accept="image/*">\r
        </div>\r
\r
    </div>\r
\r
    <div class="form-buttons">\r
        <button class="cancel-form" id="cancelProductButton" type="button">Cancel</button>\r
        <button class="save-product" id="productSaveButton" type="button">Save Product</button>\r
    </div>\r
</div>\r
\r
<div class="search-container">\r
    <div class="search-box">\r
        <span class="search-icon">⌕</span>\r
        <input type="text" id="productSearch" placeholder="Search product...">\r
    </div>\r
</div>\r
\r
<div class="products-table">\r
\r
    <div class="product-header">\r
        <div>Product</div>\r
        <div>Price</div>\r
        <div>Unit</div>\r
        <div>Category</div>\r
        <div>Stock</div>\r
        <div>Availability</div>\r
        <div>Actions</div>\r
    </div>\r
\r
    <div id="productsList"></div>\r
</div>\r
\r
</div>\r
\r
<!-- ORDER MODAL -->\r
\r
<div class="modal-bg" id="modalBg">\r
    <div class="modal">\r
\r
        <h2>Order Details</h2>\r
\r
        <div class="detail">\r
            <label>Order ID</label>\r
            <strong id="modalOrderId"></strong>\r
        </div>\r
\r
        <div class="detail">\r
            <label>Customer</label>\r
            <strong id="modalCustomer"></strong>\r
        </div>\r
\r
        <div class="detail">\r
            <label>Total</label>\r
            <strong id="modalTotal"></strong>\r
        </div>\r
\r
        <div class="detail">\r
            <label>Date</label>\r
            <strong id="modalDate"></strong>\r
        </div>\r
\r
        <div class="detail">\r
            <label>Order Status</label>\r
            <select id="statusSelect" class="status-select">\r
                <option value="Pending">Pending</option>\r
                <option value="Processing">Processing</option>\r
                <option value="Ready for Delivery">Ready for Delivery</option>\r
                <option value="Completed">Completed</option>\r
                <option value="Cancelled">Cancelled</option>\r
            </select>\r
        </div>\r
\r
        <div class="modal-buttons">\r
            <button class="close-btn" id="closeOrderButton" type="button">Close</button>\r
            <button class="save-btn" id="saveOrderStatusButton" type="button">Save Status</button>\r
        </div>\r
\r
    </div>\r
</div>\r
\r
<script>\r
\r
/* =====================================================\r
   DATA\r
===================================================== */\r
\r
const defaultOrders = [\r
    {\r
        id:"#ELEE-2026-000123",\r
        customer:"Elias Goldstein",\r
        status:"Pending",\r
        total:"₱1,234",\r
        date:"September 04, 2026 10:10 AM"\r
    },\r
    {\r
        id:"#ELEE-2026-000124",\r
        customer:"Light Fildora",\r
        status:"Processing",\r
        total:"₱2,450",\r
        date:"September 04, 2026 10:10 AM"\r
    },\r
    {\r
        id:"#ELEE-2026-000125",\r
        customer:"Yukiya Reizen",\r
        status:"Ready for Delivery",\r
        total:"₱3,200",\r
        date:"September 04, 2026 10:10 AM"\r
    },\r
    {\r
        id:"#ELEE-2026-000126",\r
        customer:"Joel Crawford",\r
        status:"Completed",\r
        total:"₱4,120",\r
        date:"September 04, 2026 10:10 AM"\r
    },\r
    {\r
        id:"#ELEE-2026-000127",\r
        customer:"Hiro Tachibana",\r
        status:"Cancelled",\r
        total:"₱1,890",\r
        date:"September 04, 2026 10:10 AM"\r
    }\r
];\r
\r
const defaultProducts = [\r
    {\r
        name:'Hollow Blocks 4"',\r
        price:250,\r
        unit:"pc",\r
        category:"Construction",\r
        stock:340,\r
        availability:"Available"\r
    },\r
    {\r
        name:"GI Sheet 0.3mm",\r
        price:350,\r
        unit:"pc",\r
        category:"Construction",\r
        stock:12,\r
        availability:"Available"\r
    },\r
    {\r
        name:"Cement 25kg",\r
        price:125,\r
        unit:"bag",\r
        category:"Construction",\r
        stock:8,\r
        availability:"Available"\r
    },\r
    {\r
        name:'PVC Elbow 3/4"',\r
        price:35,\r
        unit:"pc",\r
        category:"Plumbing",\r
        stock:15,\r
        availability:"Available"\r
    },\r
    {\r
        name:"Claw Hammer",\r
        price:280,\r
        unit:"pc",\r
        category:"Tools",\r
        stock:5,\r
        availability:"Available"\r
    }\r
];\r
\r
let orders = JSON.parse(localStorage.getItem("eleeOrders")) || defaultOrders;\r
let products = JSON.parse(localStorage.getItem("eleeProducts")) || defaultProducts;\r
\r
let currentOrderIndex = null;\r
let currentPage = 1;\r
let rowsPerPage = 5;\r
let selectedStatus = "All Orders";\r
let searchText = "";\r
let productEditIndex = null;\r
\r
function saveOrders(){\r
    localStorage.setItem("eleeOrders", JSON.stringify(orders));\r
}\r
\r
function saveProducts(){\r
    localStorage.setItem("eleeProducts", JSON.stringify(products));\r
}\r
\r
/* =====================================================\r
   ORDERS\r
===================================================== */\r
\r
function statusClass(status){\r
    if(status === "Pending") return "pending";\r
    if(status === "Processing") return "processing";\r
    if(status === "Ready for Delivery") return "ready";\r
    if(status === "Completed") return "completed";\r
    return "cancelled";\r
}\r
\r
function getFilteredOrders(){\r
\r
    return orders.filter(order => {\r
\r
        const statusMatch =\r
            selectedStatus === "All Orders" ||\r
            order.status === selectedStatus;\r
\r
        const searchMatch =\r
            order.id.toLowerCase().includes(searchText) ||\r
            order.customer.toLowerCase().includes(searchText);\r
\r
        return statusMatch && searchMatch;\r
    });\r
}\r
\r
function renderOrders(){\r
\r
    const list = document.getElementById("ordersList");\r
    const noResults = document.getElementById("noResults");\r
\r
    const filtered = getFilteredOrders();\r
\r
    const totalPages = Math.max(\r
        1,\r
        Math.ceil(filtered.length / rowsPerPage)\r
    );\r
\r
    if(currentPage > totalPages){\r
        currentPage = totalPages;\r
    }\r
\r
    const start = (currentPage - 1) * rowsPerPage;\r
    const end = Math.min(\r
        start + rowsPerPage,\r
        filtered.length\r
    );\r
\r
    const pageOrders = filtered.slice(start,end);\r
\r
    list.innerHTML = "";\r
\r
    pageOrders.forEach(order => {\r
\r
        const originalIndex = orders.indexOf(order);\r
\r
        const row = document.createElement("div");\r
\r
        row.className = "order-row";\r
\r
        row.innerHTML = \`\r
            <div class="order-id">\${order.id}</div>\r
\r
            <div class="customer">\${order.customer}</div>\r
\r
            <div>\r
                <span class="status \${statusClass(order.status)}">\r
                    \${order.status}\r
                </span>\r
            </div>\r
\r
            <div class="total">\${order.total}</div>\r
\r
            <div class="date">\${order.date}</div>\r
\r
            <div>\r
                <button class="view-btn"\r
                    type="button">\r
                    View\r
                </button>\r
            </div>\r
        \`;\r
\r
        row.querySelector(".view-btn").addEventListener("click", () => {\r
            openOrder(originalIndex);\r
        });\r
\r
        list.appendChild(row);\r
    });\r
\r
    noResults.style.display =\r
        filtered.length === 0 ? "block" : "none";\r
\r
    if(filtered.length === 0){\r
        document.getElementById("orderCount").innerText =\r
            "Showing 0 to 0 of 0 orders";\r
    }else{\r
        document.getElementById("orderCount").innerText =\r
            \`Showing \${start + 1} to \${end} of \${filtered.length} orders\`;\r
    }\r
\r
    renderPagination(totalPages);\r
}\r
\r
function renderPagination(totalPages){\r
\r
    const pagination =\r
        document.getElementById("pagination");\r
\r
    pagination.innerHTML = "";\r
\r
    function addPage(textValue,pageNumber,disabled=false){\r
\r
        const span = document.createElement("span");\r
\r
        span.className =\r
            "page" +\r
            (pageNumber === currentPage ? " active" : "") +\r
            (disabled ? " disabled" : "");\r
\r
        span.innerText = textValue;\r
\r
        if(!disabled){\r
            span.onclick = function(){\r
                currentPage = pageNumber;\r
                renderOrders();\r
            };\r
        }\r
\r
        pagination.appendChild(span);\r
    }\r
\r
    addPage(\r
        "<",\r
        Math.max(1,currentPage - 1),\r
        currentPage === 1\r
    );\r
\r
    if(totalPages <= 6){\r
\r
        for(let i=1;i<=totalPages;i++){\r
            addPage(i,i);\r
        }\r
\r
    }else{\r
\r
        addPage(1,1);\r
\r
        if(currentPage > 3){\r
            const dots = document.createElement("span");\r
            dots.innerText = "...";\r
            pagination.appendChild(dots);\r
        }\r
\r
        let start = Math.max(2,currentPage - 1);\r
        let end = Math.min(totalPages - 1,currentPage + 1);\r
\r
        for(let i=start;i<=end;i++){\r
            addPage(i,i);\r
        }\r
\r
        if(currentPage < totalPages - 2){\r
            const dots = document.createElement("span");\r
            dots.innerText = "...";\r
            pagination.appendChild(dots);\r
        }\r
\r
        addPage(totalPages,totalPages);\r
    }\r
\r
    addPage(\r
        ">",\r
        Math.min(totalPages,currentPage + 1),\r
        currentPage === totalPages\r
    );\r
}\r
\r
/* STATUS TABS */\r
\r
document.querySelectorAll(".tab").forEach(tab => {\r
\r
    tab.addEventListener("click",function(){\r
\r
        document.querySelectorAll(".tab").forEach(t =>\r
            t.classList.remove("active")\r
        );\r
\r
        this.classList.add("active");\r
\r
        selectedStatus =\r
            this.getAttribute("data-status");\r
\r
        currentPage = 1;\r
\r
        const searchContainer =\r
            document.getElementById("searchContainer");\r
\r
        searchContainer.style.display =\r
            selectedStatus === "All Orders"\r
            ? "block"\r
            : "none";\r
\r
        renderOrders();\r
    });\r
\r
});\r
\r
/* ORDER SEARCH */\r
\r
document.getElementById("searchInput")\r
.addEventListener("input",function(){\r
\r
    searchText = this.value.toLowerCase().trim();\r
\r
    currentPage = 1;\r
\r
    renderOrders();\r
});\r
\r
/* OPEN ORDER */\r
\r
function openOrder(index){\r
\r
    currentOrderIndex = index;\r
\r
    const order = orders[index];\r
\r
    document.getElementById("modalOrderId").innerText =\r
        order.id;\r
\r
    document.getElementById("modalCustomer").innerText =\r
        order.customer;\r
\r
    document.getElementById("modalTotal").innerText =\r
        order.total;\r
\r
    document.getElementById("modalDate").innerText =\r
        order.date;\r
\r
    document.getElementById("statusSelect").value =\r
        order.status;\r
\r
    document.getElementById("modalBg").style.display =\r
        "flex";\r
}\r
\r
/* CLOSE ORDER */\r
\r
function closeOrder(){\r
\r
    document.getElementById("modalBg").style.display =\r
        "none";\r
\r
    currentOrderIndex = null;\r
}\r
\r
/* SAVE STATUS */\r
\r
function saveStatus(){\r
\r
    if(currentOrderIndex === null) return;\r
\r
    const newStatus =\r
        document.getElementById("statusSelect").value;\r
\r
    orders[currentOrderIndex].status = newStatus;\r
\r
    saveOrders();\r
\r
    closeOrder();\r
\r
    renderOrders();\r
\r
    alert("Order status saved successfully.");\r
}\r
\r
/* CLOSE MODAL */\r
\r
document.getElementById("modalBg")\r
.addEventListener("click",function(e){\r
\r
    if(e.target === this){\r
        closeOrder();\r
    }\r
\r
});\r
\r
/* =====================================================\r
   PRODUCTS\r
===================================================== */\r
\r
function stockClass(stock){\r
\r
    if(Number(stock) <= 5){\r
        return "critical";\r
    }\r
\r
    if(Number(stock) <= 15){\r
        return "low";\r
    }\r
\r
    return "";\r
}\r
\r
function availabilityClass(availability){\r
\r
    return availability === "Available"\r
        ? "available"\r
        : "unavailable";\r
}\r
\r
function renderProducts(){\r
\r
    const list =\r
        document.getElementById("productsList");\r
\r
    const search =\r
        document.getElementById("productSearch")\r
        .value\r
        .toLowerCase()\r
        .trim();\r
\r
    list.innerHTML = "";\r
\r
    products.forEach((product,index) => {\r
\r
        const searchable =\r
            (\r
                product.name + " " +\r
                product.category\r
            ).toLowerCase();\r
\r
        if(!searchable.includes(search)){\r
            return;\r
        }\r
\r
        const row =\r
            document.createElement("div");\r
\r
        row.className = "product-row";\r
\r
        row.innerHTML = \`\r
\r
            <div class="product-info">\r
\r
                <div class="product-image">\r
                    \${product.name.substring(0,2).toUpperCase()}\r
                </div>\r
\r
                <div>\r
                    <div class="product-name">\r
                        \${product.name}\r
                    </div>\r
\r
                    <div class="product-category">\r
                        \${product.category}\r
                    </div>\r
                </div>\r
\r
            </div>\r
\r
            <div class="price">\r
                ₱\${Number(product.price).toLocaleString()}\r
            </div>\r
\r
            <div>\${product.unit}</div>\r
\r
            <div>\${product.category}</div>\r
\r
            <div class="stock \${stockClass(product.stock)}">\r
                \${product.stock}\r
            </div>\r
\r
            <div>\r
                <span class="availability \${availabilityClass(product.availability)}">\r
                    \${product.availability}\r
                </span>\r
            </div>\r
\r
            <div>\r
                <button\r
                    class="edit-btn"\r
                    type="button">\r
                    Edit\r
                </button>\r
            </div>\r
        \`;\r
\r
        row.querySelector(".edit-btn").addEventListener("click", () => {\r
            editProduct(index);\r
        });\r
\r
        list.appendChild(row);\r
    });\r
}\r
\r
/* SHOW FORM */\r
\r
function showProductForm(){\r
\r
    document.getElementById("productForm")\r
        .classList.add("show");\r
\r
    document.getElementById("productName")\r
        .focus();\r
}\r
\r
/* HIDE FORM */\r
\r
function hideProductForm(){\r
\r
    document.getElementById("productForm")\r
        .classList.remove("show");\r
\r
    clearProductForm();\r
\r
    productEditIndex = null;\r
\r
    document.getElementById("productSaveButton")\r
        .innerText = "Save Product";\r
\r
}\r
\r
/* CLEAR FORM */\r
\r
function clearProductForm(){\r
\r
    document.getElementById("productName").value = "";\r
    document.getElementById("productPrice").value = "";\r
    document.getElementById("productStock").value = "";\r
    document.getElementById("productUnit").value = "pc";\r
    document.getElementById("productCategory").value = "Construction";\r
    document.getElementById("productAvailability").value = "Available";\r
    document.getElementById("productImage").value = "";\r
}\r
\r
/* ADD PRODUCT */\r
\r
function addProduct(){\r
\r
    const name =\r
        document.getElementById("productName")\r
        .value.trim();\r
\r
    const price =\r
        document.getElementById("productPrice")\r
        .value;\r
\r
    const unit =\r
        document.getElementById("productUnit")\r
        .value;\r
\r
    const category =\r
        document.getElementById("productCategory")\r
        .value;\r
\r
    const stock =\r
        document.getElementById("productStock")\r
        .value;\r
\r
    const availability =\r
        document.getElementById("productAvailability")\r
        .value;\r
\r
    if(!name || !price || stock === ""){\r
\r
        alert("Please complete the required product information.");\r
\r
        return;\r
    }\r
\r
    products.push({\r
        name:name,\r
        price:Number(price),\r
        unit:unit,\r
        category:category,\r
        stock:Number(stock),\r
        availability:availability\r
    });\r
\r
    saveProducts();\r
\r
    renderProducts();\r
\r
    hideProductForm();\r
\r
    alert("Product added successfully.");\r
}\r
\r
/* EDIT PRODUCT */\r
\r
function editProduct(index){\r
\r
    const product = products[index];\r
\r
    productEditIndex = index;\r
\r
    showProductForm();\r
\r
    document.getElementById("productName").value =\r
        product.name;\r
\r
    document.getElementById("productPrice").value =\r
        product.price;\r
\r
    document.getElementById("productUnit").value =\r
        product.unit;\r
\r
    document.getElementById("productCategory").value =\r
        product.category;\r
\r
    document.getElementById("productStock").value =\r
        product.stock;\r
\r
    document.getElementById("productAvailability").value =\r
        product.availability;\r
\r
    document.getElementById("productSaveButton")\r
        .innerText = "Update Product";\r
\r
}\r
\r
/* UPDATE PRODUCT */\r
\r
function updateProduct(){\r
\r
    if(productEditIndex === null) return;\r
\r
    const name =\r
        document.getElementById("productName")\r
        .value.trim();\r
\r
    const price =\r
        document.getElementById("productPrice")\r
        .value;\r
\r
    const unit =\r
        document.getElementById("productUnit")\r
        .value;\r
\r
    const category =\r
        document.getElementById("productCategory")\r
        .value;\r
\r
    const stock =\r
        document.getElementById("productStock")\r
        .value;\r
\r
    const availability =\r
        document.getElementById("productAvailability")\r
        .value;\r
\r
    if(!name || !price || stock === ""){\r
\r
        alert("Please complete the required product information.");\r
\r
        return;\r
    }\r
\r
    products[productEditIndex] = {\r
        name:name,\r
        price:Number(price),\r
        unit:unit,\r
        category:category,\r
        stock:Number(stock),\r
        availability:availability\r
    };\r
\r
    saveProducts();\r
\r
    renderProducts();\r
\r
    hideProductForm();\r
\r
    alert("Product updated successfully.");\r
}\r
\r
/* PRODUCT SEARCH */\r
\r
document.getElementById("productSearch")\r
.addEventListener("input",function(){\r
\r
    renderProducts();\r
\r
});\r
\r
/* =====================================================\r
   INITIAL LOAD\r
===================================================== */\r
\r
renderOrders();\r
renderProducts();\r
\r
document.getElementById("addProductButton")\r
    .addEventListener("click", showProductForm);\r
\r
document.getElementById("cancelProductButton")\r
    .addEventListener("click", hideProductForm);\r
\r
document.getElementById("productSaveButton")\r
    .addEventListener("click", () => {\r
        if (productEditIndex === null) {\r
            addProduct();\r
        } else {\r
            updateProduct();\r
        }\r
    });\r
\r
document.getElementById("closeOrderButton")\r
    .addEventListener("click", closeOrder);\r
\r
document.getElementById("saveOrderStatusButton")\r
    .addEventListener("click", saveStatus);\r
\r
<\/script>\r
\r
</body>\r
</html>\r
`;export{r as default};
