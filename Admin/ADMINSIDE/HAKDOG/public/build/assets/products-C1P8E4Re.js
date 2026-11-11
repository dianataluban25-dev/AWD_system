const r=`<!DOCTYPE html>\r
<html lang="en">\r
\r
<head>\r
\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
\r
    <title>EleeSiWeb - Products</title>\r
\r
    <style>\r
\r
        * {\r
            margin: 0;\r
            padding: 0;\r
            box-sizing: border-box;\r
            font-family: Arial, Helvetica, sans-serif;\r
        }\r
\r
        body {\r
            background: #fff;\r
            color: #111;\r
        }\r
\r
        .layout {\r
            display: flex;\r
            min-height: 100vh;\r
        }\r
\r
        /* ================= SIDEBAR ================= */\r
\r
        .sidebar {\r
            position: fixed;\r
            left: 0;\r
            top: 0;\r
            width: 235px;\r
            height: 100vh;\r
            background: #00551f;\r
            color: white;\r
            padding: 28px 16px;\r
            z-index: 100;\r
        }\r
\r
        .logo {\r
            font-size: 36px;\r
            font-weight: 900;\r
            margin-left: 12px;\r
            letter-spacing: -2px;\r
        }\r
\r
        .logo span {\r
            color: #ffbd00;\r
        }\r
\r
        .hardware {\r
            color: #ffbd00;\r
            font-size: 14px;\r
            font-weight: bold;\r
            margin-left: 13px;\r
            margin-top: 3px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .menu {\r
            display: flex;\r
            flex-direction: column;\r
            gap: 7px;\r
        }\r
\r
        .menu a {\r
            text-decoration: none;\r
            color: white;\r
            padding: 13px 14px;\r
            border-radius: 7px;\r
            font-size: 14px;\r
            display: flex;\r
            align-items: center;\r
            gap: 12px;\r
            transition: 0.2s;\r
            cursor: pointer;\r
        }\r
\r
        .menu a:hover {\r
            background: #08732e;\r
        }\r
\r
        .menu a.active {\r
            background: #08732e;\r
        }\r
\r
        .icon {\r
            width: 20px;\r
            text-align: center;\r
            font-size: 18px;\r
        }\r
\r
        /* ================= MAIN ================= */\r
\r
        .main {\r
            flex: 1;\r
            min-width: 0;\r
            margin-left: 235px;\r
        }\r
\r
        .content {\r
            padding: 28px 25px;\r
        }\r
\r
        .header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: flex-start;\r
        }\r
\r
        .title {\r
            font-size: 30px;\r
            font-weight: 700;\r
            margin-bottom: 3px;\r
        }\r
\r
        .subtitle {\r
            color: #888;\r
            font-size: 14px;\r
        }\r
\r
        .add-btn {\r
            border: none;\r
            background: #069b45;\r
            color: white;\r
            padding: 10px 16px;\r
            border-radius: 9px;\r
            font-size: 13px;\r
            cursor: pointer;\r
        }\r
\r
        .add-btn:hover {\r
            background: #057d38;\r
        }\r
\r
        /* ================= INVENTORY SUMMARY ================= */\r
\r
        .inventory-summary {\r
            display: grid;\r
            grid-template-columns: repeat(4, 1fr);\r
            gap: 15px;\r
            margin-top: 30px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .summary-card {\r
            border: 1px solid #e5e5e5;\r
            border-radius: 10px;\r
            padding: 18px;\r
            background: white;\r
        }\r
\r
        .summary-title {\r
            font-size: 12px;\r
            color: #888;\r
            margin-bottom: 8px;\r
        }\r
\r
        .summary-number {\r
            font-size: 25px;\r
            font-weight: 700;\r
        }\r
\r
        .summary-green {\r
            color: #069b45;\r
        }\r
\r
        .summary-yellow {\r
            color: #c58a00;\r
        }\r
\r
        .summary-red {\r
            color: #d84848;\r
        }\r
\r
        /* ================= SEARCH ================= */\r
\r
        .search-area {\r
            margin-top: 15px;\r
            margin-bottom: 28px;\r
        }\r
\r
        .search-box {\r
            width: 100%;\r
            height: 48px;\r
            border: 1px solid #ddd;\r
            border-radius: 9px;\r
            display: flex;\r
            align-items: center;\r
        }\r
\r
        .search-icon {\r
            font-size: 27px;\r
            color: #999;\r
            margin-left: 12px;\r
            margin-right: 12px;\r
        }\r
\r
        .search-box input {\r
            width: 100%;\r
            border: none;\r
            outline: none;\r
            font-size: 14px;\r
        }\r
\r
        .filter-area {\r
            display: flex;\r
            justify-content: flex-end;\r
            gap: 10px;\r
            margin-top: 15px;\r
        }\r
\r
        .filter-area select {\r
            border: 1px solid #ddd;\r
            border-radius: 7px;\r
            padding: 8px 12px;\r
            color: #666;\r
            outline: none;\r
            background: white;\r
        }\r
\r
        /* ================= PRODUCT TABLE ================= */\r
\r
        .product-table {\r
            width: 100%;\r
            overflow-x: auto;\r
        }\r
\r
        .product-header,\r
        .product-row {\r
            display: grid;\r
\r
            grid-template-columns:\r
                80px\r
                1.4fr\r
                1.1fr\r
                .7fr\r
                .7fr\r
                .7fr\r
                .8fr\r
                85px;\r
\r
            align-items: center;\r
            column-gap: 15px;\r
            min-width: 900px;\r
        }\r
\r
        .product-header {\r
            font-weight: 700;\r
            font-size: 13px;\r
            padding: 0 10px 16px;\r
        }\r
\r
        .product-row {\r
            min-height: 83px;\r
            border: 1px solid #e5e5e5;\r
            border-radius: 9px;\r
            padding: 10px;\r
            margin-bottom: 14px;\r
            background: white;\r
        }\r
\r
        .product-row:hover {\r
            border-color: #b9dfc5;\r
            box-shadow: 0 2px 8px rgba(0,0,0,.04);\r
        }\r
\r
        /* ================= IMAGE ================= */\r
\r
        .product-image-box {\r
            width: 60px;\r
            height: 55px;\r
            border: 1px solid #e5e5e5;\r
            border-radius: 7px;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            overflow: hidden;\r
            background: #fafafa;\r
        }\r
\r
        .product-image {\r
            width: 100%;\r
            height: 100%;\r
            object-fit: contain;\r
        }\r
\r
        .image-placeholder {\r
            font-size: 27px;\r
        }\r
\r
        .product-name {\r
            font-size: 14px;\r
            font-weight: 600;\r
        }\r
\r
        .category {\r
            font-size: 12px;\r
            color: #888;\r
        }\r
\r
        .price,\r
        .stock,\r
        .unit {\r
            font-size: 12px;\r
            font-weight: 600;\r
        }\r
\r
        /* ================= STATUS ================= */\r
\r
        .status {\r
            display: inline-block;\r
            padding: 5px 9px;\r
            border-radius: 5px;\r
            font-size: 10px;\r
            font-weight: 600;\r
        }\r
\r
        .in-stock {\r
            background: #c9f1ce;\r
            color: #258b3e;\r
        }\r
\r
        .low-stock {\r
            background: #fff0c2;\r
            color: #a87500;\r
        }\r
\r
        .out-stock {\r
            background: #ffd6d6;\r
            color: #c53b3b;\r
        }\r
\r
        .unavailable {\r
            background: #eeeeee;\r
            color: #777;\r
        }\r
\r
        /* ================= ACTIONS ================= */\r
\r
        .actions {\r
            display: flex;\r
            gap: 7px;\r
        }\r
\r
        .edit,\r
        .stock-btn,\r
        .delete {\r
            width: 30px;\r
            height: 30px;\r
            border: none;\r
            background: none;\r
            border-radius: 6px;\r
            cursor: pointer;\r
            font-size: 16px;\r
        }\r
\r
        .edit {\r
            color: #777;\r
        }\r
\r
        .edit:hover {\r
            background: #eeeeee;\r
        }\r
\r
        .stock-btn {\r
            color: #069b45;\r
        }\r
\r
        .stock-btn:hover {\r
            background: #e4f5e9;\r
        }\r
\r
        .delete {\r
            color: #e75b5b;\r
        }\r
\r
        .delete:hover {\r
            background: #ffe7e7;\r
        }\r
\r
        /* ================= NO RESULTS ================= */\r
\r
        .no-results {\r
            display: none;\r
            text-align: center;\r
            padding: 35px;\r
            color: #888;\r
            font-size: 14px;\r
            border: 1px solid #eee;\r
            border-radius: 9px;\r
            min-width: 900px;\r
        }\r
\r
        /* ================= STOCK NOTICE ================= */\r
\r
        .stock-notice {\r
            display: flex;\r
            align-items: center;\r
            gap: 10px;\r
            background: #f4faf5;\r
            border: 1px solid #d6eadb;\r
            border-radius: 9px;\r
            padding: 13px 15px;\r
            margin-top: 30px;\r
            color: #397049;\r
            font-size: 12px;\r
        }\r
\r
        .stock-notice strong {\r
            color: #17612d;\r
        }\r
\r
        /* ================= PAGINATION ================= */\r
\r
        .bottom {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            margin-top: 35px;\r
            padding: 0 10px;\r
            gap: 15px;\r
        }\r
\r
        .showing-text {\r
            font-size: 12px;\r
            color: #777;\r
        }\r
\r
        .pagination {\r
            display: flex;\r
            align-items: center;\r
            gap: 6px;\r
        }\r
\r
        .page {\r
            min-width: 30px;\r
            height: 30px;\r
            padding: 0 8px;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            border: 1px solid #ddd;\r
            border-radius: 6px;\r
            font-size: 12px;\r
            color: #555;\r
            cursor: pointer;\r
            background: white;\r
            user-select: none;\r
        }\r
\r
        .page:hover:not(.disabled):not(.dots) {\r
            border-color: #299447;\r
            color: #299447;\r
        }\r
\r
        .page.active {\r
            background: #299447;\r
            color: white;\r
            border-color: #299447;\r
        }\r
\r
        .page.disabled {\r
            color: #ccc;\r
            cursor: not-allowed;\r
            background: #f8f8f8;\r
        }\r
\r
        .page.dots {\r
            border: none;\r
            cursor: default;\r
            background: transparent;\r
        }\r
\r
        /* ================= MODAL ================= */\r
\r
        .modal {\r
            display: none;\r
            position: fixed;\r
            inset: 0;\r
            background: rgba(0,0,0,.45);\r
            align-items: center;\r
            justify-content: center;\r
            z-index: 1000;\r
            padding: 20px;\r
        }\r
\r
        .modal-box {\r
            background: white;\r
            width: 470px;\r
            max-width: 100%;\r
            max-height: 92vh;\r
            overflow-y: auto;\r
            border-radius: 12px;\r
            padding: 25px;\r
        }\r
\r
        .modal-box h2 {\r
            margin-bottom: 20px;\r
            font-size: 22px;\r
        }\r
\r
        .form-group {\r
            margin-bottom: 15px;\r
        }\r
\r
        .form-group label {\r
            display: block;\r
            font-size: 13px;\r
            font-weight: 600;\r
            margin-bottom: 6px;\r
        }\r
\r
        .form-group input,\r
        .form-group select {\r
            width: 100%;\r
            padding: 10px;\r
            border: 1px solid #ddd;\r
            border-radius: 7px;\r
            outline: none;\r
            background: white;\r
        }\r
\r
        .form-group input:focus,\r
        .form-group select:focus {\r
            border-color: #069b45;\r
        }\r
\r
        /* ================= IMAGE UPLOAD ================= */\r
\r
        .image-upload-area {\r
            border: 2px dashed #cfcfcf;\r
            border-radius: 9px;\r
            padding: 15px;\r
            text-align: center;\r
            background: #fafafa;\r
        }\r
\r
        .image-upload-area:hover {\r
            border-color: #069b45;\r
        }\r
\r
        .image-upload-area input[type="file"] {\r
            border: none;\r
            padding: 0;\r
            cursor: pointer;\r
        }\r
\r
        .image-preview {\r
            width: 120px;\r
            height: 100px;\r
            object-fit: contain;\r
            border: 1px solid #ddd;\r
            border-radius: 8px;\r
            margin: 10px auto;\r
            display: none;\r
            background: white;\r
        }\r
\r
        .upload-text {\r
            color: #888;\r
            font-size: 12px;\r
            margin-top: 5px;\r
        }\r
\r
        /* ================= AVAILABILITY ================= */\r
\r
        .availability-box {\r
            display: flex;\r
            align-items: center;\r
            gap: 8px;\r
        }\r
\r
        .availability-box input {\r
            width: auto;\r
        }\r
\r
        /* ================= MODAL BUTTONS ================= */\r
\r
        .modal-buttons {\r
            display: flex;\r
            justify-content: flex-end;\r
            gap: 10px;\r
            margin-top: 20px;\r
        }\r
\r
        .cancel-btn {\r
            border: 1px solid #ccc;\r
            background: white;\r
            padding: 9px 15px;\r
            border-radius: 7px;\r
            cursor: pointer;\r
        }\r
\r
        .save-btn {\r
            border: none;\r
            background: #069b45;\r
            color: white;\r
            padding: 9px 15px;\r
            border-radius: 7px;\r
            cursor: pointer;\r
        }\r
\r
        .save-btn:hover {\r
            background: #057d38;\r
        }\r
\r
        /* ================= RESPONSIVE ================= */\r
\r
        @media (max-width: 1000px) {\r
\r
            .sidebar {\r
                width: 190px;\r
            }\r
\r
            .main {\r
                margin-left: 190px;\r
            }\r
\r
            .inventory-summary {\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
\r
        }\r
\r
        @media (max-width: 650px) {\r
\r
            .sidebar {\r
                display: none;\r
            }\r
\r
            .main {\r
                margin-left: 0;\r
            }\r
\r
            .content {\r
                padding: 18px;\r
            }\r
\r
            .header {\r
                align-items: center;\r
            }\r
\r
            .title {\r
                font-size: 25px;\r
            }\r
\r
            .add-btn {\r
                padding: 8px 12px;\r
            }\r
\r
            .inventory-summary {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .bottom {\r
                flex-direction: column;\r
                align-items: flex-start;\r
            }\r
\r
        }\r
\r
    </style>\r
\r
</head>\r
\r
\r
<body>\r
\r
\r
<div class="layout">\r
\r
\r
    <!-- ================= SIDEBAR ================= -->\r
\r
    <aside class="sidebar">\r
\r
        <div class="logo">\r
            <span style="color:white;">E</span><span>LEE</span>\r
        </div>\r
\r
        <div class="hardware">\r
            HARDWARE\r
        </div>\r
\r
        <div class="menu">\r
\r
            <a href="{{ url('/') }}">\r
                <span class="icon">☼</span>\r
                Dashboard\r
            </a>\r
\r
            <a href="{{ url('/orders') }}">\r
                <span class="icon">▣</span>\r
                Orders\r
            </a>\r
\r
            <a href="{{ url('/products') }}" class="active">\r
                <span class="icon">◇</span>\r
                Products\r
            </a>\r
\r
            <a href="{{ url('/ai-recommendations') }}">\r
                <span class="icon">↗</span>\r
                AI Recommendations\r
            </a>\r
\r
            <a href="{{ url('/payments') }}">\r
                <span class="icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 5.5v-.75A1.75 1.75 0 0 1 8.75 3h8.5"/><path d="M16 13h4.5"/><circle cx="16" cy="13" r=".55"/></svg></span>\r
                Payments\r
            </a>\r
\r
            <a href="{{ url('/customers') }}">\r
                <span class="icon">♙</span>\r
                Customers\r
            </a>\r
\r
            <a href="{{ url('/queuing') }}">\r
                <span class="icon">▱</span>\r
                Queuing\r
            </a>\r
\r
            <a href="{{ url('/receipt-records') }}">\r
                <span class="icon">▤</span>\r
                Receipt Records\r
            </a>\r
\r
            <a href="{{ url('/settings') }}">\r
                <span class="icon">⚙</span>\r
                Settings\r
            </a>\r
\r
        </div>\r
\r
    </aside>\r
\r
\r
    <!-- ================= MAIN ================= -->\r
\r
    <main class="main">\r
\r
        <div class="content">\r
\r
\r
            <!-- HEADER -->\r
\r
            <div class="header">\r
\r
                <div>\r
\r
                    <h1 class="title">\r
                        Products & Inventory\r
                    </h1>\r
\r
                    <p class="subtitle">\r
                        Manage products, prices, availability and stock\r
                    </p>\r
\r
                </div>\r
\r
                <button\r
                    class="add-btn"\r
                    onclick="openAddModal()"\r
                >\r
                    + Add Product\r
                </button>\r
\r
            </div>\r
\r
\r
            <!-- ================= INVENTORY SUMMARY ================= -->\r
\r
            <div class="inventory-summary">\r
\r
                <div class="summary-card">\r
\r
                    <div class="summary-title">\r
                        Total Products\r
                    </div>\r
\r
                    <div\r
                        class="summary-number summary-green"\r
                        id="totalProducts"\r
                    >\r
                        0\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="summary-card">\r
\r
                    <div class="summary-title">\r
                        In Stock\r
                    </div>\r
\r
                    <div\r
                        class="summary-number summary-green"\r
                        id="inStockCount"\r
                    >\r
                        0\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="summary-card">\r
\r
                    <div class="summary-title">\r
                        Low Stock\r
                    </div>\r
\r
                    <div\r
                        class="summary-number summary-yellow"\r
                        id="lowStockCount"\r
                    >\r
                        0\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="summary-card">\r
\r
                    <div class="summary-title">\r
                        Out of Stock\r
                    </div>\r
\r
                    <div\r
                        class="summary-number summary-red"\r
                        id="outStockCount"\r
                    >\r
                        0\r
                    </div>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
            <!-- ================= SEARCH ================= -->\r
\r
            <div class="search-area">\r
\r
                <div class="search-box">\r
\r
                    <span class="search-icon">\r
                        ⌕\r
                    </span>\r
\r
                    <input\r
                        type="text"\r
                        id="searchInput"\r
                        placeholder="Search products..."\r
                        oninput="filterProducts()"\r
                    >\r
\r
                </div>\r
\r
\r
                <div class="filter-area">\r
\r
                    <select\r
                        id="categoryFilter"\r
                        onchange="filterProducts()"\r
                    >\r
\r
                        <option value="all">\r
                            All Categories\r
                        </option>\r
\r
                        <option value="Building Materials">\r
                            Building Materials\r
                        </option>\r
\r
                        <option value="Tools">\r
                            Tools\r
                        </option>\r
\r
                        <option value="Electrical">\r
                            Electrical\r
                        </option>\r
\r
                        <option value="Plumbing">\r
                            Plumbing\r
                        </option>\r
\r
                    </select>\r
\r
\r
                    <select\r
                        id="statusFilter"\r
                        onchange="filterProducts()"\r
                    >\r
\r
                        <option value="all">\r
                            All Status\r
                        </option>\r
\r
                        <option value="In Stock">\r
                            In Stock\r
                        </option>\r
\r
                        <option value="Low Stock">\r
                            Low Stock\r
                        </option>\r
\r
                        <option value="Out of Stock">\r
                            Out of Stock\r
                        </option>\r
\r
                        <option value="Unavailable">\r
                            Unavailable\r
                        </option>\r
\r
                    </select>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
            <!-- ================= PRODUCT TABLE ================= -->\r
\r
            <div class="product-table">\r
\r
                <div class="product-header">\r
\r
                    <div>Image</div>\r
                    <div>Product Name</div>\r
                    <div>Category</div>\r
                    <div>Price</div>\r
                    <div>Stock</div>\r
                    <div>Unit</div>\r
                    <div>Status</div>\r
                    <div>Actions</div>\r
\r
                </div>\r
\r
\r
                <div id="productList"></div>\r
\r
\r
                <div\r
                    id="noResults"\r
                    class="no-results"\r
                >\r
                    No products found.\r
                </div>\r
\r
            </div>\r
\r
\r
            <!-- ================= AUTOMATIC STOCK NOTICE ================= -->\r
\r
            <div class="stock-notice">\r
\r
                <span>\r
                    📦\r
                </span>\r
\r
                <span>\r
                    <strong>Automatic Stock Update:</strong>\r
                    Stock is automatically deducted when an order is confirmed.\r
                    Staff can use the <strong>+</strong> button to add new stock\r
                    when supplies arrive.\r
                </span>\r
\r
            </div>\r
\r
\r
            <!-- ================= PAGINATION ================= -->\r
\r
            <div class="bottom">\r
\r
                <div\r
                    class="showing-text"\r
                    id="showingText"\r
                >\r
                    Showing 0 to 0 of 0 products\r
                </div>\r
\r
                <div\r
                    class="pagination"\r
                    id="pagination"\r
                ></div>\r
\r
            </div>\r
\r
\r
        </div>\r
\r
    </main>\r
\r
</div>\r
\r
\r
<!-- ================================================= -->\r
<!-- ADD / EDIT PRODUCT MODAL -->\r
<!-- ================================================= -->\r
\r
<div\r
    class="modal"\r
    id="productModal"\r
>\r
\r
    <div class="modal-box">\r
\r
        <h2 id="modalTitle">\r
            Add Product\r
        </h2>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Product Image\r
            </label>\r
\r
            <div class="image-upload-area">\r
\r
                <img\r
                    id="imagePreview"\r
                    class="image-preview"\r
                    alt="Image Preview"\r
                >\r
\r
                <input\r
                    type="file"\r
                    id="productImage"\r
                    accept="image/*"\r
                    onchange="previewImage(event)"\r
                >\r
\r
                <div class="upload-text">\r
                    Choose a product picture\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Product Name\r
            </label>\r
\r
            <input\r
                type="text"\r
                id="productName"\r
                placeholder="Enter product name"\r
            >\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Category\r
            </label>\r
\r
            <select id="productCategory">\r
\r
                <option value="">\r
                    Select category\r
                </option>\r
\r
                <option value="Building Materials">\r
                    Building Materials\r
                </option>\r
\r
                <option value="Tools">\r
                    Tools\r
                </option>\r
\r
                <option value="Electrical">\r
                    Electrical\r
                </option>\r
\r
                <option value="Plumbing">\r
                    Plumbing\r
                </option>\r
\r
            </select>\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Price\r
            </label>\r
\r
            <input\r
                type="number"\r
                id="productPrice"\r
                min="0"\r
                step="0.01"\r
                placeholder="Enter price"\r
            >\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Unit\r
            </label>\r
\r
            <select id="productUnit">\r
\r
                <option value="">\r
                    Select unit\r
                </option>\r
\r
                <option value="piece">\r
                    Piece\r
                </option>\r
\r
                <option value="set">\r
                    Set\r
                </option>\r
\r
                <option value="box">\r
                    Box\r
                </option>\r
\r
                <option value="meter">\r
                    Meter\r
                </option>\r
\r
                <option value="kg">\r
                    Kilogram\r
                </option>\r
\r
                <option value="liter">\r
                    Liter\r
                </option>\r
\r
            </select>\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Stock Quantity\r
            </label>\r
\r
            <input\r
                type="number"\r
                id="productStock"\r
                min="0"\r
                placeholder="Enter stock quantity"\r
            >\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Availability\r
            </label>\r
\r
            <div class="availability-box">\r
\r
                <input\r
                    type="checkbox"\r
                    id="productAvailability"\r
                    checked\r
                >\r
\r
                <span>\r
                    Product is available for ordering\r
                </span>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <div class="modal-buttons">\r
\r
            <button\r
                class="cancel-btn"\r
                onclick="closeModal()"\r
            >\r
                Cancel\r
            </button>\r
\r
            <button\r
                class="save-btn"\r
                onclick="saveProduct()"\r
                id="saveButton"\r
            >\r
                Add Product\r
            </button>\r
\r
        </div>\r
\r
    </div>\r
\r
</div>\r
\r
\r
<!-- ================================================= -->\r
<!-- ADD STOCK MODAL -->\r
<!-- ================================================= -->\r
\r
<div\r
    class="modal"\r
    id="stockModal"\r
>\r
\r
    <div class="modal-box">\r
\r
        <h2>\r
            Add New Stock\r
        </h2>\r
\r
\r
        <p\r
            id="stockProductName"\r
            style="\r
                font-size:13px;\r
                color:#777;\r
                margin-bottom:18px;\r
            "\r
        >\r
            Product\r
        </p>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Current Stock\r
            </label>\r
\r
            <input\r
                type="number"\r
                id="currentStock"\r
                readonly\r
            >\r
\r
        </div>\r
\r
\r
        <div class="form-group">\r
\r
            <label>\r
                Quantity to Add\r
            </label>\r
\r
            <input\r
                type="number"\r
                id="stockToAdd"\r
                min="1"\r
                placeholder="Enter quantity"\r
            >\r
\r
        </div>\r
\r
\r
        <div\r
            style="\r
                background:#f4faf5;\r
                border:1px solid #d6eadb;\r
                padding:12px;\r
                border-radius:7px;\r
                font-size:12px;\r
                color:#397049;\r
            "\r
        >\r
            New stock will be added to the existing quantity.\r
        </div>\r
\r
\r
        <div class="modal-buttons">\r
\r
            <button\r
                class="cancel-btn"\r
                onclick="closeStockModal()"\r
            >\r
                Cancel\r
            </button>\r
\r
            <button\r
                class="save-btn"\r
                onclick="addStock()"\r
            >\r
                Add Stock\r
            </button>\r
\r
        </div>\r
\r
    </div>\r
\r
</div>\r
\r
\r
<script>\r
\r
/* =====================================================\r
   SETTINGS\r
===================================================== */\r
\r
const STORAGE_KEY = "elee_products";\r
\r
const productsPerPage = 5;\r
\r
let products = [];\r
\r
let currentPage = 1;\r
\r
let editingProductId = null;\r
\r
let stockProductId = null;\r
\r
let pendingImage = "";\r
\r
\r
/* =====================================================\r
   DEFAULT PRODUCTS\r
===================================================== */\r
\r
const defaultProducts = [\r
\r
    {\r
        id: 1,\r
        name: "Claw Hammer",\r
        category: "Building Materials",\r
        price: 1200,\r
        stock: 200,\r
        unit: "piece",\r
        available: true,\r
        image: ""\r
    },\r
\r
    {\r
        id: 2,\r
        name: "Screwdriver Set",\r
        category: "Tools",\r
        price: 1200,\r
        stock: 120,\r
        unit: "set",\r
        available: true,\r
        image: ""\r
    },\r
\r
    {\r
        id: 3,\r
        name: 'Hollow Blocks 4"',\r
        category: "Building Materials",\r
        price: 1200,\r
        stock: 8,\r
        unit: "piece",\r
        available: true,\r
        image: ""\r
    }\r
\r
];\r
\r
\r
/* =====================================================\r
   LOAD PRODUCTS\r
===================================================== */\r
\r
function loadProducts() {\r
\r
    const savedProducts =\r
        localStorage.getItem(STORAGE_KEY);\r
\r
    if (!savedProducts) {\r
\r
        products = [...defaultProducts];\r
\r
        saveProducts();\r
\r
        return;\r
    }\r
\r
    try {\r
\r
        const parsed =\r
            JSON.parse(savedProducts);\r
\r
        if (Array.isArray(parsed)) {\r
\r
            products = parsed;\r
\r
        } else {\r
\r
            products = [...defaultProducts];\r
\r
            saveProducts();\r
\r
        }\r
\r
    } catch (error) {\r
\r
        products = [...defaultProducts];\r
\r
        saveProducts();\r
\r
    }\r
\r
}\r
\r
\r
/* =====================================================\r
   SAVE PRODUCTS\r
===================================================== */\r
\r
function saveProducts() {\r
\r
    localStorage.setItem(\r
        STORAGE_KEY,\r
        JSON.stringify(products)\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   PRODUCT STATUS\r
===================================================== */\r
\r
function getProductStatus(stock, available) {\r
\r
    stock = Number(stock);\r
\r
    if (!available) {\r
\r
        return {\r
            text: "Unavailable",\r
            className: "unavailable"\r
        };\r
\r
    }\r
\r
    if (stock <= 0) {\r
\r
        return {\r
            text: "Out of Stock",\r
            className: "out-stock"\r
        };\r
\r
    }\r
\r
    if (stock <= 10) {\r
\r
        return {\r
            text: "Low Stock",\r
            className: "low-stock"\r
        };\r
\r
    }\r
\r
    return {\r
        text: "In Stock",\r
        className: "in-stock"\r
    };\r
\r
}\r
\r
\r
/* =====================================================\r
   GET FILTERED PRODUCTS\r
===================================================== */\r
\r
function getFilteredProducts() {\r
\r
    const search =\r
        document.getElementById("searchInput")\r
            .value\r
            .toLowerCase()\r
            .trim();\r
\r
    const category =\r
        document.getElementById("categoryFilter")\r
            .value;\r
\r
    const status =\r
        document.getElementById("statusFilter")\r
            .value;\r
\r
\r
    return products.filter(function(product) {\r
\r
        const productStatus =\r
            getProductStatus(\r
                product.stock,\r
                product.available\r
            ).text;\r
\r
\r
        const matchesSearch =\r
            product.name\r
                .toLowerCase()\r
                .includes(search) ||\r
\r
            product.category\r
                .toLowerCase()\r
                .includes(search) ||\r
\r
            product.unit\r
                .toLowerCase()\r
                .includes(search);\r
\r
\r
        const matchesCategory =\r
            category === "all" ||\r
            product.category === category;\r
\r
\r
        const matchesStatus =\r
            status === "all" ||\r
            productStatus === status;\r
\r
\r
        return (\r
            matchesSearch &&\r
            matchesCategory &&\r
            matchesStatus\r
        );\r
\r
    });\r
\r
}\r
\r
\r
/* =====================================================\r
   RENDER PRODUCTS\r
===================================================== */\r
\r
function renderProducts() {\r
\r
    const productList =\r
        document.getElementById("productList");\r
\r
    productList.innerHTML = "";\r
\r
\r
    const filteredProducts =\r
        getFilteredProducts();\r
\r
\r
    const totalPages =\r
        Math.max(\r
            1,\r
            Math.ceil(\r
                filteredProducts.length /\r
                productsPerPage\r
            )\r
        );\r
\r
\r
    if (currentPage > totalPages) {\r
\r
        currentPage = totalPages;\r
\r
    }\r
\r
\r
    const startIndex =\r
        (currentPage - 1) *\r
        productsPerPage;\r
\r
\r
    const endIndex =\r
        startIndex +\r
        productsPerPage;\r
\r
\r
    const pageProducts =\r
        filteredProducts.slice(\r
            startIndex,\r
            endIndex\r
        );\r
\r
\r
    pageProducts.forEach(function(product) {\r
\r
        const status =\r
            getProductStatus(\r
                product.stock,\r
                product.available\r
            );\r
\r
\r
        const row =\r
            document.createElement("div");\r
\r
        row.className =\r
            "product-row";\r
\r
        row.dataset.id =\r
            product.id;\r
\r
\r
        let imageHTML = \`\r
            <span class="image-placeholder">\r
                📦\r
            </span>\r
        \`;\r
\r
\r
        if (product.image) {\r
\r
            imageHTML = \`\r
                <img\r
                    src="\${product.image}"\r
                    class="product-image"\r
                    alt="\${escapeHTML(product.name)}"\r
                >\r
            \`;\r
\r
        } else {\r
\r
            if (product.category === "Tools") {\r
\r
                imageHTML = \`\r
                    <span class="image-placeholder">\r
                        🪛\r
                    </span>\r
                \`;\r
\r
            } else if (\r
                product.category === "Building Materials"\r
            ) {\r
\r
                imageHTML = \`\r
                    <span class="image-placeholder">\r
                        🧱\r
                    </span>\r
                \`;\r
\r
            } else if (\r
                product.category === "Electrical"\r
            ) {\r
\r
                imageHTML = \`\r
                    <span class="image-placeholder">\r
                        💡\r
                    </span>\r
                \`;\r
\r
            } else if (\r
                product.category === "Plumbing"\r
            ) {\r
\r
                imageHTML = \`\r
                    <span class="image-placeholder">\r
                        🔧\r
                    </span>\r
                \`;\r
\r
            }\r
\r
        }\r
\r
\r
        row.innerHTML = \`\r
\r
            <div class="product-image-box">\r
                \${imageHTML}\r
            </div>\r
\r
\r
            <div class="product-name">\r
                \${escapeHTML(product.name)}\r
            </div>\r
\r
\r
            <div class="category">\r
                \${escapeHTML(product.category)}\r
            </div>\r
\r
\r
            <div class="price">\r
                ₱\${Number(product.price).toLocaleString()}\r
            </div>\r
\r
\r
            <div class="stock">\r
                \${Number(product.stock)}\r
            </div>\r
\r
\r
            <div class="unit">\r
                \${escapeHTML(product.unit)}\r
            </div>\r
\r
\r
            <div>\r
\r
                <span class="status \${status.className}">\r
                    \${status.text}\r
                </span>\r
\r
            </div>\r
\r
\r
            <div class="actions">\r
\r
                <button\r
                    class="edit"\r
                    onclick="editProduct(\${product.id})"\r
                    title="Edit Product"\r
                >\r
                    ✎\r
                </button>\r
\r
\r
                <button\r
                    class="stock-btn"\r
                    onclick="openStockModal(\${product.id})"\r
                    title="Add New Stock"\r
                >\r
                    +\r
                </button>\r
\r
\r
                <button\r
                    class="delete"\r
                    onclick="deleteProduct(\${product.id})"\r
                    title="Delete Product"\r
                >\r
                    🗑\r
                </button>\r
\r
            </div>\r
\r
        \`;\r
\r
\r
        productList.appendChild(row);\r
\r
    });\r
\r
\r
    const noResults =\r
        document.getElementById("noResults");\r
\r
\r
    if (filteredProducts.length === 0) {\r
\r
        noResults.style.display = "block";\r
\r
    } else {\r
\r
        noResults.style.display = "none";\r
\r
    }\r
\r
\r
    updateSummary();\r
\r
\r
    updateShowingText(\r
        filteredProducts.length,\r
        startIndex,\r
        pageProducts.length\r
    );\r
\r
\r
    renderPagination(totalPages);\r
\r
}\r
\r
\r
/* =====================================================\r
   SEARCH / FILTER\r
===================================================== */\r
\r
function filterProducts() {\r
\r
    currentPage = 1;\r
\r
    renderProducts();\r
\r
}\r
\r
\r
/* =====================================================\r
   SHOWING TEXT\r
===================================================== */\r
\r
function updateShowingText(\r
    total,\r
    startIndex,\r
    visibleCount\r
) {\r
\r
    const showing =\r
        document.getElementById(\r
            "showingText"\r
        );\r
\r
\r
    if (total === 0) {\r
\r
        showing.innerText =\r
            "Showing 0 to 0 of 0 products";\r
\r
        return;\r
\r
    }\r
\r
\r
    const start =\r
        startIndex + 1;\r
\r
\r
    const end =\r
        startIndex + visibleCount;\r
\r
\r
    showing.innerText =\r
        "Showing " +\r
        start +\r
        " to " +\r
        end +\r
        " of " +\r
        total +\r
        " products";\r
\r
}\r
\r
\r
/* =====================================================\r
   PAGINATION\r
===================================================== */\r
\r
function renderPagination(totalPages) {\r
\r
    const pagination =\r
        document.getElementById(\r
            "pagination"\r
        );\r
\r
\r
    pagination.innerHTML = "";\r
\r
\r
    /*\r
       PREVIOUS BUTTON\r
    */\r
\r
    const previous =\r
        document.createElement("div");\r
\r
    previous.className =\r
        "page";\r
\r
\r
    if (currentPage === 1) {\r
\r
        previous.classList.add(\r
            "disabled"\r
        );\r
\r
    }\r
\r
\r
    previous.innerText = "‹";\r
\r
\r
    previous.title = "Previous";\r
\r
\r
    previous.onclick =\r
        function() {\r
\r
            if (\r
                currentPage > 1\r
            ) {\r
\r
                currentPage--;\r
\r
                renderProducts();\r
\r
                window.scrollTo({\r
                    top: 0,\r
                    behavior: "smooth"\r
                });\r
\r
            }\r
\r
        };\r
\r
\r
    pagination.appendChild(\r
        previous\r
    );\r
\r
\r
    /*\r
       PAGE NUMBERS\r
    */\r
\r
    const pageNumbers =\r
        getPageNumbers(\r
            currentPage,\r
            totalPages\r
        );\r
\r
\r
    pageNumbers.forEach(function(page) {\r
\r
        if (page === "...") {\r
\r
            const dots =\r
                document.createElement(\r
                    "div"\r
                );\r
\r
            dots.className =\r
                "page dots";\r
\r
            dots.innerText =\r
                "...";\r
\r
            pagination.appendChild(\r
                dots\r
            );\r
\r
            return;\r
\r
        }\r
\r
\r
        const pageButton =\r
            document.createElement(\r
                "div"\r
            );\r
\r
        pageButton.className =\r
            "page";\r
\r
\r
        if (\r
            page === currentPage\r
        ) {\r
\r
            pageButton.classList.add(\r
                "active"\r
            );\r
\r
        }\r
\r
\r
        pageButton.innerText =\r
            page;\r
\r
\r
        pageButton.onclick =\r
            function() {\r
\r
                currentPage =\r
                    page;\r
\r
                renderProducts();\r
\r
                window.scrollTo({\r
                    top: 0,\r
                    behavior: "smooth"\r
                });\r
\r
            };\r
\r
\r
        pagination.appendChild(\r
            pageButton\r
        );\r
\r
    });\r
\r
\r
    /*\r
       NEXT BUTTON\r
    */\r
\r
    const next =\r
        document.createElement("div");\r
\r
    next.className =\r
        "page";\r
\r
\r
    if (\r
        currentPage === totalPages\r
    ) {\r
\r
        next.classList.add(\r
            "disabled"\r
        );\r
\r
    }\r
\r
\r
    next.innerText = "›";\r
\r
\r
    next.title = "Next";\r
\r
\r
    next.onclick =\r
        function() {\r
\r
            if (\r
                currentPage <\r
                totalPages\r
            ) {\r
\r
                currentPage++;\r
\r
                renderProducts();\r
\r
                window.scrollTo({\r
                    top: 0,\r
                    behavior: "smooth"\r
                });\r
\r
            }\r
\r
        };\r
\r
\r
    pagination.appendChild(\r
        next\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   PAGE NUMBERS\r
===================================================== */\r
\r
function getPageNumbers(\r
    current,\r
    total\r
) {\r
\r
    if (total <= 7) {\r
\r
        return Array.from(\r
            {\r
                length: total\r
            },\r
            function(_, index) {\r
\r
                return index + 1;\r
\r
            }\r
        );\r
\r
    }\r
\r
\r
    if (current <= 4) {\r
\r
        return [\r
            1,\r
            2,\r
            3,\r
            4,\r
            5,\r
            "...",\r
            total\r
        ];\r
\r
    }\r
\r
\r
    if (\r
        current >= total - 3\r
    ) {\r
\r
        return [\r
            1,\r
            "...",\r
            total - 4,\r
            total - 3,\r
            total - 2,\r
            total - 1,\r
            total\r
        ];\r
\r
    }\r
\r
\r
    return [\r
        1,\r
        "...",\r
        current - 1,\r
        current,\r
        current + 1,\r
        "...",\r
        total\r
    ];\r
\r
}\r
\r
\r
/* =====================================================\r
   OPEN ADD MODAL\r
===================================================== */\r
\r
function openAddModal() {\r
\r
    editingProductId = null;\r
\r
    pendingImage = "";\r
\r
\r
    document.getElementById(\r
        "modalTitle"\r
    ).innerText =\r
        "Add Product";\r
\r
\r
    document.getElementById(\r
        "saveButton"\r
    ).innerText =\r
        "Add Product";\r
\r
\r
    clearForm();\r
\r
\r
    document.getElementById(\r
        "productModal"\r
    ).style.display =\r
        "flex";\r
\r
}\r
\r
\r
/* =====================================================\r
   CLOSE PRODUCT MODAL\r
===================================================== */\r
\r
function closeModal() {\r
\r
    document.getElementById(\r
        "productModal"\r
    ).style.display =\r
        "none";\r
\r
\r
    clearForm();\r
\r
\r
    editingProductId = null;\r
\r
    pendingImage = "";\r
\r
}\r
\r
\r
/* =====================================================\r
   CLEAR FORM\r
===================================================== */\r
\r
function clearForm() {\r
\r
    document.getElementById(\r
        "productName"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "productCategory"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "productPrice"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "productUnit"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "productStock"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "productAvailability"\r
    ).checked = true;\r
\r
\r
    document.getElementById(\r
        "productImage"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "imagePreview"\r
    ).src = "";\r
\r
\r
    document.getElementById(\r
        "imagePreview"\r
    ).style.display =\r
        "none";\r
\r
}\r
\r
\r
/* =====================================================\r
   PREVIEW IMAGE\r
===================================================== */\r
\r
function previewImage(event) {\r
\r
    const file =\r
        event.target.files[0];\r
\r
\r
    const preview =\r
        document.getElementById(\r
            "imagePreview"\r
        );\r
\r
\r
    if (!file) {\r
\r
        pendingImage = "";\r
\r
        preview.src = "";\r
\r
        preview.style.display =\r
            "none";\r
\r
        return;\r
\r
    }\r
\r
\r
    const reader =\r
        new FileReader();\r
\r
\r
    reader.onload =\r
        function(event) {\r
\r
            pendingImage =\r
                event.target.result;\r
\r
\r
            preview.src =\r
                event.target.result;\r
\r
\r
            preview.style.display =\r
                "block";\r
\r
        };\r
\r
\r
    reader.readAsDataURL(file);\r
\r
}\r
\r
\r
/* =====================================================\r
   SAVE PRODUCT\r
===================================================== */\r
\r
function saveProduct() {\r
\r
    const name =\r
        document.getElementById(\r
            "productName"\r
        ).value.trim();\r
\r
\r
    const category =\r
        document.getElementById(\r
            "productCategory"\r
        ).value;\r
\r
\r
    const price =\r
        document.getElementById(\r
            "productPrice"\r
        ).value;\r
\r
\r
    const unit =\r
        document.getElementById(\r
            "productUnit"\r
        ).value;\r
\r
\r
    const stock =\r
        document.getElementById(\r
            "productStock"\r
        ).value;\r
\r
\r
    const available =\r
        document.getElementById(\r
            "productAvailability"\r
        ).checked;\r
\r
\r
    if (\r
        name === "" ||\r
        category === "" ||\r
        price === "" ||\r
        unit === "" ||\r
        stock === ""\r
    ) {\r
\r
        alert(\r
            "Please complete all product fields."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    if (\r
        Number(price) < 0 ||\r
        Number(stock) < 0\r
    ) {\r
\r
        alert(\r
            "Price and stock cannot be negative."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    if (\r
        editingProductId !== null\r
    ) {\r
\r
        updateExistingProduct(\r
            name,\r
            category,\r
            Number(price),\r
            unit,\r
            Number(stock),\r
            available\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    addNewProduct(\r
        name,\r
        category,\r
        Number(price),\r
        unit,\r
        Number(stock),\r
        available\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   ADD NEW PRODUCT\r
===================================================== */\r
\r
function addNewProduct(\r
    name,\r
    category,\r
    price,\r
    unit,\r
    stock,\r
    available\r
) {\r
\r
    const newId =\r
        products.length > 0\r
            ? Math.max(\r
                ...products.map(\r
                    function(product) {\r
                        return Number(\r
                            product.id\r
                        );\r
                    }\r
                )\r
            ) + 1\r
            : 1;\r
\r
\r
    products.push({\r
\r
        id: newId,\r
\r
        name: name,\r
\r
        category: category,\r
\r
        price: price,\r
\r
        stock: stock,\r
\r
        unit: unit,\r
\r
        available: available,\r
\r
        image: pendingImage || ""\r
\r
    });\r
\r
\r
    saveProducts();\r
\r
\r
    closeModal();\r
\r
\r
    const filteredProducts =\r
        getFilteredProducts();\r
\r
\r
    currentPage =\r
        Math.max(\r
            1,\r
            Math.ceil(\r
                filteredProducts.length /\r
                productsPerPage\r
            )\r
        );\r
\r
\r
    renderProducts();\r
\r
\r
    alert(\r
        "Product added successfully."\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   UPDATE EXISTING PRODUCT\r
===================================================== */\r
\r
function updateExistingProduct(\r
    name,\r
    category,\r
    price,\r
    unit,\r
    stock,\r
    available\r
) {\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(editingProductId);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        alert(\r
            "Product not found."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    product.name =\r
        name;\r
\r
    product.category =\r
        category;\r
\r
    product.price =\r
        price;\r
\r
    product.stock =\r
        stock;\r
\r
    product.unit =\r
        unit;\r
\r
    product.available =\r
        available;\r
\r
\r
    if (pendingImage) {\r
\r
        product.image =\r
            pendingImage;\r
\r
    }\r
\r
\r
    saveProducts();\r
\r
\r
    closeModal();\r
\r
\r
    renderProducts();\r
\r
\r
    alert(\r
        "Product updated successfully."\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   EDIT PRODUCT\r
===================================================== */\r
\r
function editProduct(id) {\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(id);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        alert(\r
            "Product not found."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    editingProductId =\r
        Number(id);\r
\r
\r
    pendingImage = "";\r
\r
\r
    document.getElementById(\r
        "modalTitle"\r
    ).innerText =\r
        "Edit Product";\r
\r
\r
    document.getElementById(\r
        "saveButton"\r
    ).innerText =\r
        "Save Changes";\r
\r
\r
    document.getElementById(\r
        "productName"\r
    ).value =\r
        product.name;\r
\r
\r
    document.getElementById(\r
        "productCategory"\r
    ).value =\r
        product.category;\r
\r
\r
    document.getElementById(\r
        "productPrice"\r
    ).value =\r
        product.price;\r
\r
\r
    document.getElementById(\r
        "productUnit"\r
    ).value =\r
        product.unit;\r
\r
\r
    document.getElementById(\r
        "productStock"\r
    ).value =\r
        product.stock;\r
\r
\r
    document.getElementById(\r
        "productAvailability"\r
    ).checked =\r
        product.available;\r
\r
\r
    document.getElementById(\r
        "productImage"\r
    ).value = "";\r
\r
\r
    const preview =\r
        document.getElementById(\r
            "imagePreview"\r
        );\r
\r
\r
    if (product.image) {\r
\r
        preview.src =\r
            product.image;\r
\r
        preview.style.display =\r
            "block";\r
\r
    } else {\r
\r
        preview.src = "";\r
\r
        preview.style.display =\r
            "none";\r
\r
    }\r
\r
\r
    document.getElementById(\r
        "productModal"\r
    ).style.display =\r
        "flex";\r
\r
}\r
\r
\r
/* =====================================================\r
   DELETE PRODUCT\r
===================================================== */\r
\r
function deleteProduct(id) {\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(id);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        return;\r
\r
    }\r
\r
\r
    const confirmed =\r
        confirm(\r
            "Are you sure you want to delete " +\r
            product.name +\r
            "?"\r
        );\r
\r
\r
    if (!confirmed) {\r
\r
        return;\r
\r
    }\r
\r
\r
    products =\r
        products.filter(\r
            function(item) {\r
\r
                return Number(item.id) !==\r
                    Number(id);\r
\r
            }\r
        );\r
\r
\r
    saveProducts();\r
\r
\r
    const filteredProducts =\r
        getFilteredProducts();\r
\r
\r
    const totalPages =\r
        Math.max(\r
            1,\r
            Math.ceil(\r
                filteredProducts.length /\r
                productsPerPage\r
            )\r
        );\r
\r
\r
    if (\r
        currentPage >\r
        totalPages\r
    ) {\r
\r
        currentPage =\r
            totalPages;\r
\r
    }\r
\r
\r
    renderProducts();\r
\r
\r
    alert(\r
        "Product deleted successfully."\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   OPEN STOCK MODAL\r
===================================================== */\r
\r
function openStockModal(id) {\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(id);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        return;\r
\r
    }\r
\r
\r
    stockProductId =\r
        Number(id);\r
\r
\r
    document.getElementById(\r
        "stockProductName"\r
    ).innerText =\r
        "Product: " +\r
        product.name;\r
\r
\r
    document.getElementById(\r
        "currentStock"\r
    ).value =\r
        Number(product.stock);\r
\r
\r
    document.getElementById(\r
        "stockToAdd"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "stockModal"\r
    ).style.display =\r
        "flex";\r
\r
}\r
\r
\r
/* =====================================================\r
   CLOSE STOCK MODAL\r
===================================================== */\r
\r
function closeStockModal() {\r
\r
    document.getElementById(\r
        "stockModal"\r
    ).style.display =\r
        "none";\r
\r
\r
    stockProductId = null;\r
\r
\r
    document.getElementById(\r
        "stockToAdd"\r
    ).value = "";\r
\r
}\r
\r
\r
/* =====================================================\r
   ADD STOCK\r
===================================================== */\r
\r
function addStock() {\r
\r
    if (\r
        stockProductId === null\r
    ) {\r
\r
        return;\r
\r
    }\r
\r
\r
    const stockToAdd =\r
        Number(\r
            document.getElementById(\r
                "stockToAdd"\r
            ).value\r
        );\r
\r
\r
    if (\r
        !Number.isInteger(stockToAdd) ||\r
        stockToAdd <= 0\r
    ) {\r
\r
        alert(\r
            "Please enter a valid whole number greater than 0."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(stockProductId);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        alert(\r
            "Product not found."\r
        );\r
\r
        return;\r
\r
    }\r
\r
\r
    const previousStock =\r
        Number(product.stock);\r
\r
\r
    product.stock =\r
        previousStock +\r
        stockToAdd;\r
\r
\r
    saveProducts();\r
\r
\r
    closeStockModal();\r
\r
\r
    renderProducts();\r
\r
\r
    alert(\r
        "Stock added successfully.\\n\\n" +\r
        "Previous Stock: " +\r
        previousStock +\r
        "\\n" +\r
        "Added Stock: " +\r
        stockToAdd +\r
        "\\n" +\r
        "New Stock: " +\r
        product.stock\r
    );\r
\r
}\r
\r
\r
/* =====================================================\r
   AUTOMATIC ORDER STOCK DEDUCTION\r
===================================================== */\r
\r
function confirmOrderAndDeductStock(\r
    productId,\r
    orderedQuantity\r
) {\r
\r
    const product =\r
        products.find(\r
            function(item) {\r
\r
                return Number(item.id) ===\r
                    Number(productId);\r
\r
            }\r
        );\r
\r
\r
    if (!product) {\r
\r
        alert(\r
            "Product not found."\r
        );\r
\r
        return false;\r
\r
    }\r
\r
\r
    orderedQuantity =\r
        Number(orderedQuantity);\r
\r
\r
    if (\r
        !Number.isInteger(\r
            orderedQuantity\r
        ) ||\r
        orderedQuantity <= 0\r
    ) {\r
\r
        alert(\r
            "Invalid ordered quantity."\r
        );\r
\r
        return false;\r
\r
    }\r
\r
\r
    if (\r
        orderedQuantity >\r
        Number(product.stock)\r
    ) {\r
\r
        alert(\r
            "Not enough stock available."\r
        );\r
\r
        return false;\r
\r
    }\r
\r
\r
    product.stock =\r
        Number(product.stock) -\r
        orderedQuantity;\r
\r
\r
    saveProducts();\r
\r
\r
    renderProducts();\r
\r
\r
    return true;\r
\r
}\r
\r
\r
/* =====================================================\r
   UPDATE SUMMARY\r
===================================================== */\r
\r
function updateSummary() {\r
\r
    const total =\r
        products.length;\r
\r
\r
    let inStock = 0;\r
\r
    let lowStock = 0;\r
\r
    let outStock = 0;\r
\r
\r
    products.forEach(\r
        function(product) {\r
\r
            const status =\r
                getProductStatus(\r
                    product.stock,\r
                    product.available\r
                );\r
\r
\r
            if (\r
                status.text ===\r
                "In Stock"\r
            ) {\r
\r
                inStock++;\r
\r
            }\r
\r
\r
            if (\r
                status.text ===\r
                "Low Stock"\r
            ) {\r
\r
                lowStock++;\r
\r
            }\r
\r
\r
            if (\r
                status.text ===\r
                "Out of Stock"\r
            ) {\r
\r
                outStock++;\r
\r
            }\r
\r
        }\r
    );\r
\r
\r
    document.getElementById(\r
        "totalProducts"\r
    ).innerText =\r
        total;\r
\r
\r
    document.getElementById(\r
        "inStockCount"\r
    ).innerText =\r
        inStock;\r
\r
\r
    document.getElementById(\r
        "lowStockCount"\r
    ).innerText =\r
        lowStock;\r
\r
\r
    document.getElementById(\r
        "outStockCount"\r
    ).innerText =\r
        outStock;\r
\r
}\r
\r
\r
/* =====================================================\r
   ESCAPE HTML\r
===================================================== */\r
\r
function escapeHTML(value) {\r
\r
    return String(value)\r
\r
        .replace(\r
            /&/g,\r
            "&amp;"\r
        )\r
\r
        .replace(\r
            /</g,\r
            "&lt;"\r
        )\r
\r
        .replace(\r
            />/g,\r
            "&gt;"\r
        )\r
\r
        .replace(\r
            /"/g,\r
            "&quot;"\r
        )\r
\r
        .replace(\r
            /'/g,\r
            "&#039;"\r
        );\r
\r
}\r
\r
\r
/* =====================================================\r
   CLOSE MODALS WHEN CLICKING OUTSIDE\r
===================================================== */\r
\r
window.addEventListener(\r
    "click",\r
    function(event) {\r
\r
        const productModal =\r
            document.getElementById(\r
                "productModal"\r
            );\r
\r
\r
        const stockModal =\r
            document.getElementById(\r
                "stockModal"\r
            );\r
\r
\r
        if (\r
            event.target ===\r
            productModal\r
        ) {\r
\r
            closeModal();\r
\r
        }\r
\r
\r
        if (\r
            event.target ===\r
            stockModal\r
        ) {\r
\r
            closeStockModal();\r
\r
        }\r
\r
    }\r
);\r
\r
\r
/* =====================================================\r
   INITIALIZE\r
===================================================== */\r
\r
loadProducts();\r
\r
renderProducts();\r
\r
<\/script>\r
\r
</body>\r
\r
</html>`;export{r as default};
