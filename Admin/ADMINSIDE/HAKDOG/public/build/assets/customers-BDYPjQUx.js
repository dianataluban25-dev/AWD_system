const n=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
    <title>Customers - ELEE Hardware</title>\r
\r
    <style>\r
        * {\r
            margin: 0;\r
            padding: 0;\r
            box-sizing: border-box;\r
            font-family: Arial, Helvetica, sans-serif;\r
        }\r
\r
        body {\r
            background: #ffffff;\r
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
            margin-left: 235px;\r
            width: calc(100% - 235px);\r
            min-height: 100vh;\r
            padding: 30px 40px;\r
        }\r
\r
        .page-header {\r
            margin-bottom: 25px;\r
        }\r
\r
        .page-header h1 {\r
            font-size: 28px;\r
            font-weight: 700;\r
            margin-bottom: 6px;\r
        }\r
\r
        .page-header p {\r
            color: #8c8c8c;\r
            font-size: 14px;\r
        }\r
\r
        /* ================= SUMMARY CARDS ================= */\r
\r
        .summary-grid {\r
            display: grid;\r
            grid-template-columns: repeat(4, 1fr);\r
            gap: 15px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .summary-card {\r
            border: 1px solid #e5e5e5;\r
            border-radius: 12px;\r
            padding: 18px;\r
            background: white;\r
        }\r
\r
        .summary-label {\r
            color: #777;\r
            font-size: 12px;\r
            margin-bottom: 8px;\r
        }\r
\r
        .summary-value {\r
            font-size: 24px;\r
            font-weight: 700;\r
            color: #00551b;\r
        }\r
\r
        /* ================= TOOLBAR ================= */\r
\r
        .toolbar {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            gap: 15px;\r
            margin-bottom: 25px;\r
            flex-wrap: wrap;\r
        }\r
\r
        .search-container {\r
            width: 350px;\r
            height: 43px;\r
            border: 1px solid #dddddd;\r
            border-radius: 10px;\r
            display: flex;\r
            align-items: center;\r
            padding: 0 13px;\r
            background: white;\r
        }\r
\r
        .search-icon {\r
            font-size: 22px;\r
            color: #999;\r
            margin-right: 10px;\r
        }\r
\r
        .search-container input {\r
            border: none;\r
            outline: none;\r
            width: 100%;\r
            font-size: 13px;\r
        }\r
\r
        .search-container input::placeholder {\r
            color: #999;\r
        }\r
\r
        .clear-search {\r
            border: none;\r
            background: none;\r
            cursor: pointer;\r
            color: #999;\r
            font-size: 17px;\r
            display: none;\r
        }\r
\r
        .clear-search:hover {\r
            color: #00551b;\r
        }\r
\r
        .customer-count {\r
            color: #777;\r
            font-size: 13px;\r
        }\r
\r
        /* ================= TABLE CARD ================= */\r
\r
        .table-card {\r
            border: 1px solid #e5e5e5;\r
            border-radius: 12px;\r
            overflow: hidden;\r
            background: white;\r
        }\r
\r
        .table-wrapper {\r
            width: 100%;\r
            overflow-x: auto;\r
        }\r
\r
        .customer-table {\r
            width: 100%;\r
            border-collapse: collapse;\r
            min-width: 1000px;\r
        }\r
\r
        .customer-table thead {\r
            background: #f8f9f8;\r
        }\r
\r
        .customer-table th {\r
            text-align: left;\r
            font-size: 12px;\r
            font-weight: 700;\r
            color: #555;\r
            padding: 16px 18px;\r
            border-bottom: 1px solid #e5e5e5;\r
            white-space: nowrap;\r
        }\r
\r
        .customer-table td {\r
            padding: 17px 18px;\r
            font-size: 13px;\r
            border-bottom: 1px solid #eeeeee;\r
            vertical-align: middle;\r
        }\r
\r
        .customer-table tbody tr:hover {\r
            background: #fafafa;\r
        }\r
\r
        .customer-table tbody tr:last-child td {\r
            border-bottom: none;\r
        }\r
\r
        .customer-name {\r
            font-weight: 700;\r
            color: #222;\r
        }\r
\r
        .mobile-number {\r
            color: #444;\r
        }\r
\r
        .address {\r
            color: #666;\r
            max-width: 260px;\r
            white-space: normal !important;\r
            line-height: 1.4;\r
        }\r
\r
        .orders-count {\r
            font-weight: 600;\r
            color: #00551b;\r
        }\r
\r
        .amount {\r
            font-weight: 600;\r
        }\r
\r
        .last-order {\r
            color: #555;\r
        }\r
\r
        /* ================= VIEW HISTORY BUTTON ================= */\r
\r
        .history-btn {\r
            border: 1px solid #00551b;\r
            background: white;\r
            color: #00551b;\r
            padding: 8px 12px;\r
            border-radius: 7px;\r
            cursor: pointer;\r
            font-size: 12px;\r
            font-weight: 600;\r
            transition: 0.2s;\r
        }\r
\r
        .history-btn:hover {\r
            background: #00551b;\r
            color: white;\r
        }\r
\r
        /* ================= EMPTY STATE ================= */\r
\r
        .empty-state {\r
            display: none;\r
            text-align: center;\r
            padding: 55px 20px;\r
        }\r
\r
        .empty-icon {\r
            font-size: 40px;\r
            color: #bbb;\r
            margin-bottom: 12px;\r
        }\r
\r
        .empty-state h3 {\r
            font-size: 17px;\r
            margin-bottom: 6px;\r
        }\r
\r
        .empty-state p {\r
            color: #888;\r
            font-size: 13px;\r
        }\r
\r
        /* ================= PAGINATION ================= */\r
\r
        .pagination-area {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            padding: 18px 20px;\r
            border-top: 1px solid #eeeeee;\r
        }\r
\r
        .pagination-info {\r
            color: #777;\r
            font-size: 12px;\r
        }\r
\r
        .pagination {\r
            display: flex;\r
            align-items: center;\r
            gap: 5px;\r
        }\r
\r
        .page-btn {\r
            min-width: 30px;\r
            height: 30px;\r
            border: 1px solid #dddddd;\r
            background: white;\r
            border-radius: 6px;\r
            cursor: pointer;\r
            font-size: 12px;\r
            color: #555;\r
        }\r
\r
        .page-btn:hover {\r
            background: #f0f0f0;\r
        }\r
\r
        .page-btn.active {\r
            background: #299447;\r
            border-color: #299447;\r
            color: white;\r
            font-weight: bold;\r
        }\r
\r
        .page-btn:disabled {\r
            opacity: 0.4;\r
            cursor: not-allowed;\r
        }\r
\r
        /* ================= MODAL ================= */\r
\r
        .modal-overlay {\r
            display: none;\r
            position: fixed;\r
            inset: 0;\r
            background: rgba(0, 0, 0, 0.45);\r
            z-index: 500;\r
            align-items: center;\r
            justify-content: center;\r
            padding: 20px;\r
        }\r
\r
        .modal-overlay.show {\r
            display: flex;\r
        }\r
\r
        .modal {\r
            width: 100%;\r
            max-width: 750px;\r
            max-height: 90vh;\r
            overflow-y: auto;\r
            background: white;\r
            border-radius: 14px;\r
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);\r
        }\r
\r
        .modal-header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            padding: 20px 24px;\r
            border-bottom: 1px solid #eeeeee;\r
            position: sticky;\r
            top: 0;\r
            background: white;\r
            z-index: 2;\r
        }\r
\r
        .modal-header h2 {\r
            font-size: 19px;\r
            color: #222;\r
        }\r
\r
        .close-btn {\r
            border: none;\r
            background: #f1f1f1;\r
            width: 32px;\r
            height: 32px;\r
            border-radius: 50%;\r
            cursor: pointer;\r
            font-size: 18px;\r
            color: #555;\r
        }\r
\r
        .close-btn:hover {\r
            background: #e5e5e5;\r
        }\r
\r
        .modal-body {\r
            padding: 24px;\r
        }\r
\r
        /* ================= CUSTOMER INFO ================= */\r
\r
        .customer-info {\r
            display: grid;\r
            grid-template-columns: repeat(2, 1fr);\r
            gap: 15px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .info-box {\r
            background: #f8faf8;\r
            border-radius: 9px;\r
            padding: 14px;\r
        }\r
\r
        .info-box.full {\r
            grid-column: 1 / -1;\r
        }\r
\r
        .info-label {\r
            font-size: 11px;\r
            color: #888;\r
            margin-bottom: 5px;\r
        }\r
\r
        .info-value {\r
            font-size: 13px;\r
            font-weight: 600;\r
            color: #222;\r
        }\r
\r
        /* ================= ORDER HISTORY ================= */\r
\r
        .history-title {\r
            font-size: 16px;\r
            margin-bottom: 12px;\r
            color: #222;\r
        }\r
\r
        .history-table-wrapper {\r
            overflow-x: auto;\r
            border: 1px solid #e5e5e5;\r
            border-radius: 9px;\r
        }\r
\r
        .history-table {\r
            width: 100%;\r
            border-collapse: collapse;\r
            min-width: 600px;\r
        }\r
\r
        .history-table th {\r
            background: #f7f8f7;\r
            text-align: left;\r
            padding: 12px;\r
            font-size: 11px;\r
            color: #666;\r
            white-space: nowrap;\r
        }\r
\r
        .history-table td {\r
            padding: 12px;\r
            border-top: 1px solid #eeeeee;\r
            font-size: 12px;\r
            white-space: nowrap;\r
        }\r
\r
        .status {\r
            display: inline-block;\r
            padding: 5px 9px;\r
            border-radius: 20px;\r
            font-size: 10px;\r
            font-weight: 700;\r
        }\r
\r
        .status.paid {\r
            background: #e4f6e9;\r
            color: #168139;\r
        }\r
\r
        .status.unpaid {\r
            background: #fff4d6;\r
            color: #9a7000;\r
        }\r
\r
        .status.cancelled {\r
            background: #fce8e8;\r
            color: #b52a2a;\r
        }\r
\r
        /* ================= RESPONSIVE ================= */\r
\r
        @media (max-width: 1100px) {\r
            .summary-grid {\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
        }\r
\r
        @media (max-width: 900px) {\r
\r
            .sidebar {\r
                width: 190px;\r
            }\r
\r
            .main {\r
                margin-left: 190px;\r
                width: calc(100% - 190px);\r
                padding: 25px;\r
            }\r
\r
            .customer-table {\r
                min-width: 1050px;\r
            }\r
\r
            .toolbar {\r
                align-items: flex-start;\r
            }\r
        }\r
\r
        @media (max-width: 650px) {\r
\r
            .sidebar {\r
                width: 70px;\r
                padding: 20px 8px;\r
            }\r
\r
            .logo {\r
                margin-left: 5px;\r
            }\r
\r
            .logo-name {\r
                font-size: 20px;\r
                letter-spacing: -1px;\r
            }\r
\r
            .hardware {\r
                display: none;\r
            }\r
\r
            .menu a {\r
                justify-content: center;\r
                padding: 12px 5px;\r
            }\r
\r
            .menu a span:not(.icon) {\r
                display: none;\r
            }\r
\r
            .main {\r
                margin-left: 70px;\r
                width: calc(100% - 70px);\r
                padding: 20px;\r
            }\r
\r
            .summary-grid {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .search-container {\r
                width: 100%;\r
            }\r
\r
            .toolbar {\r
                display: block;\r
            }\r
\r
            .customer-count {\r
                display: block;\r
                margin-top: 10px;\r
            }\r
\r
            .pagination-area {\r
                display: block;\r
            }\r
\r
            .pagination {\r
                margin-top: 12px;\r
                justify-content: center;\r
            }\r
\r
            .customer-info {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .info-box.full {\r
                grid-column: auto;\r
            }\r
        }\r
    </style>\r
</head>\r
\r
<body>\r
\r
<div class="layout">\r
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
        <nav class="menu">\r
\r
            <a href="{{ url('/dashboard') }}">\r
                <span class="icon">☼</span>\r
                Dashboard\r
            </a>\r
\r
            <a href="{{ url('/orders') }}">\r
                <span class="icon">▣</span>\r
                Orders\r
            </a>\r
\r
            <a href="{{ url('/products') }}">\r
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
            <a href="{{ url('/customers') }}" class="active">\r
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
        </nav>\r
\r
    </aside>\r
\r
\r
    <!-- ================= MAIN ================= -->\r
\r
    <main class="main customer-page">\r
\r
        <div class="page-header">\r
            <h1>Customer Records</h1>\r
            <p>View customer information and order history</p>\r
        </div>\r
\r
\r
        <!-- ================= SUMMARY ================= -->\r
\r
        <div class="summary-grid">\r
\r
            <div class="summary-card">\r
                <div class="summary-label">Total Customers</div>\r
                <div class="summary-value" id="totalCustomers">0</div>\r
            </div>\r
\r
            <div class="summary-card">\r
                <div class="summary-label">Total Orders</div>\r
                <div class="summary-value" id="totalOrders">0</div>\r
            </div>\r
\r
            <div class="summary-card">\r
                <div class="summary-label">Total Sales</div>\r
                <div class="summary-value" id="totalSales">₱ 0.00</div>\r
            </div>\r
\r
            <div class="summary-card">\r
                <div class="summary-label">Active Customers</div>\r
                <div class="summary-value" id="activeCustomers">0</div>\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= SEARCH ================= -->\r
\r
        <div class="toolbar">\r
\r
            <div class="search-container">\r
\r
                <span class="search-icon">⌕</span>\r
\r
                <input\r
                    type="text"\r
                    id="customerSearch"\r
                    placeholder="Search customer, mobile number, or address..."\r
                    oninput="searchCustomer()"\r
                >\r
\r
                <button\r
                    type="button"\r
                    class="clear-search"\r
                    id="clearSearch"\r
                    onclick="clearSearch()"\r
                >\r
                    ×\r
                </button>\r
\r
            </div>\r
\r
            <div class="customer-count" id="customerCount">\r
                Showing 0 customers\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= CUSTOMER TABLE ================= -->\r
\r
        <div class="table-card">\r
\r
            <div class="table-wrapper">\r
\r
                <table class="customer-table">\r
\r
                    <thead>\r
                        <tr>\r
                            <th>Customer Name</th>\r
                            <th>Mobile Number</th>\r
                            <th>Delivery Address</th>\r
                            <th>Total Orders</th>\r
                            <th>Total Spent</th>\r
                            <th>Last Order</th>\r
                            <th>Order History</th>\r
                        </tr>\r
                    </thead>\r
\r
                    <tbody id="customerTable">\r
                    </tbody>\r
\r
                </table>\r
\r
            </div>\r
\r
\r
            <!-- EMPTY STATE -->\r
\r
            <div class="empty-state" id="emptyState">\r
\r
                <div class="empty-icon">⌕</div>\r
\r
                <h3>No customer found</h3>\r
\r
                <p>\r
                    Try searching using a different customer name,\r
                    mobile number, or address.\r
                </p>\r
\r
            </div>\r
\r
\r
            <!-- PAGINATION -->\r
\r
            <div class="pagination-area">\r
\r
                <div class="pagination-info" id="paginationInfo">\r
                    Showing 0 to 0 of 0 customers\r
                </div>\r
\r
                <div class="pagination" id="pagination">\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
    </main>\r
\r
</div>\r
\r
\r
<!-- ================= ORDER HISTORY MODAL ================= -->\r
\r
<div class="modal-overlay" id="historyModal">\r
\r
    <div class="modal">\r
\r
        <div class="modal-header">\r
\r
            <h2>Customer Details</h2>\r
\r
            <button\r
                class="close-btn"\r
                onclick="closeHistory()"\r
            >\r
                ×\r
            </button>\r
\r
        </div>\r
\r
\r
        <div class="modal-body">\r
\r
            <!-- CUSTOMER INFORMATION -->\r
\r
            <div class="customer-info">\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Customer Name\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalCustomerName"\r
                    >\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Mobile Number\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalMobile"\r
                    >\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box full">\r
\r
                    <div class="info-label">\r
                        Delivery Address\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalAddress"\r
                    >\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Total Orders\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalTotalOrders"\r
                    >\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Total Spent\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalTotalSpent"\r
                    >\r
                    </div>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
            <!-- ORDER HISTORY -->\r
\r
            <h3 class="history-title">\r
                Order History\r
            </h3>\r
\r
            <div class="history-table-wrapper">\r
\r
                <table class="history-table">\r
\r
                    <thead>\r
                        <tr>\r
                            <th>Order ID</th>\r
                            <th>Date</th>\r
                            <th>Items</th>\r
                            <th>Amount</th>\r
                            <th>Payment</th>\r
                            <th>Status</th>\r
                        </tr>\r
                    </thead>\r
\r
                    <tbody id="historyTable">\r
                    </tbody>\r
\r
                </table>\r
\r
            </div>\r
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
       CUSTOMER DATA\r
       ===================================================== */\r
\r
    const customers = [\r
\r
        {\r
            name: "Juan Dela Cruz",\r
            mobile: "0917 123 4507",\r
            address: "123 Mabini Street, Barangay San Jose, Manila",\r
            orders: [\r
                {\r
                    id: "ORD-1001",\r
                    date: "2025-05-10",\r
                    items: "Cement, Nails",\r
                    amount: 1250,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1015",\r
                    date: "2025-05-14",\r
                    items: "Paint, Paint Brush",\r
                    amount: 1850,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1028",\r
                    date: "2025-05-18",\r
                    items: "PVC Pipe, Elbow",\r
                    amount: 950,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1042",\r
                    date: "2025-05-23",\r
                    items: "Door Lock Set",\r
                    amount: 1100,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1055",\r
                    date: "2025-05-27",\r
                    items: "Electrical Wires, Switch",\r
                    amount: 1300,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Maria Santos",\r
            mobile: "0920 007 6543",\r
            address: "45 Rizal Avenue, Barangay Poblacion, Quezon City",\r
            orders: [\r
                {\r
                    id: "ORD-1008",\r
                    date: "2025-05-09",\r
                    items: "LED Bulbs",\r
                    amount: 1200,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1031",\r
                    date: "2025-05-20",\r
                    items: "Extension Cord",\r
                    amount: 1500,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1058",\r
                    date: "2025-05-27",\r
                    items: "Electric Fan",\r
                    amount: 1500,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Pedro Reyes",\r
            mobile: "0906 555 7788",\r
            address: "78 Bonifacio Street, Barangay Maligaya, Pasig City",\r
            orders: [\r
                {\r
                    id: "ORD-1003",\r
                    date: "2025-05-05",\r
                    items: "Cement, Sand",\r
                    amount: 1800,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1012",\r
                    date: "2025-05-09",\r
                    items: "Steel Bars",\r
                    amount: 2200,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1021",\r
                    date: "2025-05-14",\r
                    items: "Paint, Roller",\r
                    amount: 1350,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1035",\r
                    date: "2025-05-18",\r
                    items: "PVC Pipes",\r
                    amount: 1100,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1044",\r
                    date: "2025-05-21",\r
                    items: "Drill Machine",\r
                    amount: 1750,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1052",\r
                    date: "2025-05-25",\r
                    items: "Power Tools",\r
                    amount: 1050,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1060",\r
                    date: "2025-05-27",\r
                    items: "Safety Equipment",\r
                    amount: 600,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Ana Garcia",\r
            mobile: "0916 444 5322",\r
            address: "22 Luna Street, Barangay Santo Niño, Makati City",\r
            orders: [\r
                {\r
                    id: "ORD-1025",\r
                    date: "2025-05-16",\r
                    items: "Paint",\r
                    amount: 950,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1057",\r
                    date: "2025-05-26",\r
                    items: "Paint Brush Set",\r
                    amount: 1200,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Ramon Mendoza",\r
            mobile: "0933 111 2222",\r
            address: "91 Bonifacio Avenue, Barangay San Isidro, Taguig City",\r
            orders: [\r
                {\r
                    id: "ORD-1006",\r
                    date: "2025-05-06",\r
                    items: "Cement",\r
                    amount: 1450,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1018",\r
                    date: "2025-05-11",\r
                    items: "Steel Bars",\r
                    amount: 1250,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1029",\r
                    date: "2025-05-17",\r
                    items: "Power Tools",\r
                    amount: 1500,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1047",\r
                    date: "2025-05-22",\r
                    items: "Electrical Supplies",\r
                    amount: 1800,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1054",\r
                    date: "2025-05-25",\r
                    items: "PVC Pipes",\r
                    amount: 900,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1061",\r
                    date: "2025-05-26",\r
                    items: "Door Lock",\r
                    amount: 600,\r
                    payment: "Cash on Delivery",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Bea Sanchez",\r
            mobile: "0918 333 7788",\r
            address: "15 Quezon Street, Barangay Central, Manila",\r
            orders: [\r
                {\r
                    id: "ORD-1062",\r
                    date: "2025-05-27",\r
                    items: "Power Drill",\r
                    amount: 2450,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                },\r
                {\r
                    id: "ORD-1065",\r
                    date: "2025-05-28",\r
                    items: "Drill Bits",\r
                    amount: 850,\r
                    payment: "Cash on Delivery",\r
                    status: "Unpaid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "John Bautista",\r
            mobile: "0927 555 8899",\r
            address: "88 Marcos Highway, Barangay Dela Paz, Marikina City",\r
            orders: [\r
                {\r
                    id: "ORD-1066",\r
                    date: "2025-05-28",\r
                    items: "Hammer, Nails",\r
                    amount: 1250,\r
                    payment: "Cash on Delivery",\r
                    status: "Unpaid"\r
                },\r
                {\r
                    id: "ORD-1067",\r
                    date: "2025-05-29",\r
                    items: "Cement, Sand",\r
                    amount: 2100,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                }\r
            ]\r
        },\r
\r
        {\r
            name: "Liza Fernandez",\r
            mobile: "0919 777 3344",\r
            address: "31 Mabini Street, Barangay San Antonio, Pasay City",\r
            orders: [\r
                {\r
                    id: "ORD-1068",\r
                    date: "2025-05-29",\r
                    items: "Paint, Roller",\r
                    amount: 1650,\r
                    payment: "Cash at Store",\r
                    status: "Paid"\r
                }\r
            ]\r
        }\r
\r
    ];\r
\r
\r
    /* =====================================================\r
       VARIABLES\r
       ===================================================== */\r
\r
    let filteredCustomers = [...customers];\r
\r
    let currentPage = 1;\r
\r
    const rowsPerPage = 5;\r
\r
\r
    /* =====================================================\r
       FORMAT CURRENCY\r
       ===================================================== */\r
\r
    function formatCurrency(amount) {\r
\r
        return "₱ " + Number(amount).toLocaleString("en-PH", {\r
            minimumFractionDigits: 2,\r
            maximumFractionDigits: 2\r
        });\r
\r
    }\r
\r
\r
    /* =====================================================\r
       FORMAT DATE\r
       ===================================================== */\r
\r
    function formatDate(dateString) {\r
\r
        const date = new Date(dateString + "T00:00:00");\r
\r
        return date.toLocaleDateString("en-PH", {\r
            month: "short",\r
            day: "numeric",\r
            year: "numeric"\r
        });\r
\r
    }\r
\r
\r
    /* =====================================================\r
       GET CUSTOMER TOTAL\r
       ===================================================== */\r
\r
    function getCustomerTotal(customer) {\r
\r
        return customer.orders.reduce(function(total, order) {\r
\r
            return total + order.amount;\r
\r
        }, 0);\r
\r
    }\r
\r
\r
    /* =====================================================\r
       RENDER CUSTOMERS\r
       ===================================================== */\r
\r
    function renderCustomers() {\r
\r
        const table = document.getElementById("customerTable");\r
\r
        const emptyState = document.getElementById("emptyState");\r
\r
        table.innerHTML = "";\r
\r
\r
        if (filteredCustomers.length === 0) {\r
\r
            emptyState.style.display = "block";\r
\r
            document.getElementById("pagination").innerHTML = "";\r
\r
            document.getElementById("paginationInfo").textContent =\r
                "Showing 0 to 0 of 0 customers";\r
\r
            document.getElementById("customerCount").textContent =\r
                "Showing 0 customers";\r
\r
            return;\r
\r
        }\r
\r
\r
        emptyState.style.display = "none";\r
\r
\r
        const startIndex = (currentPage - 1) * rowsPerPage;\r
\r
        const endIndex = startIndex + rowsPerPage;\r
\r
        const pageCustomers =\r
            filteredCustomers.slice(startIndex, endIndex);\r
\r
\r
        pageCustomers.forEach(function(customer) {\r
\r
            const totalOrders = customer.orders.length;\r
\r
            const totalSpent = getCustomerTotal(customer);\r
\r
            const lastOrder =\r
                customer.orders[customer.orders.length - 1];\r
\r
\r
            const row = document.createElement("tr");\r
\r
\r
            row.innerHTML = \`\r
\r
                <td>\r
                    <div class="customer-name">\r
                        \${escapeHtml(customer.name)}\r
                    </div>\r
                </td>\r
\r
                <td>\r
                    <span class="mobile-number">\r
                        \${escapeHtml(customer.mobile)}\r
                    </span>\r
                </td>\r
\r
                <td>\r
                    <div class="address">\r
                        \${escapeHtml(customer.address)}\r
                    </div>\r
                </td>\r
\r
                <td>\r
                    <span class="orders-count">\r
                        \${totalOrders}\r
                    </span>\r
                </td>\r
\r
                <td>\r
                    <span class="amount">\r
                        \${formatCurrency(totalSpent)}\r
                    </span>\r
                </td>\r
\r
                <td>\r
                    <span class="last-order">\r
                        \${formatDate(lastOrder.date)}\r
                    </span>\r
                </td>\r
\r
                <td>\r
                    <button\r
                        class="history-btn"\r
                        onclick="openHistory(\${customers.indexOf(customer)})"\r
                    >\r
                        View History\r
                    </button>\r
                </td>\r
\r
            \`;\r
\r
\r
            table.appendChild(row);\r
\r
        });\r
\r
\r
        const showingFrom = startIndex + 1;\r
\r
        const showingTo =\r
            Math.min(endIndex, filteredCustomers.length);\r
\r
\r
        document.getElementById("paginationInfo").textContent =\r
            \`Showing \${showingFrom} to \${showingTo} of \${filteredCustomers.length} customers\`;\r
\r
\r
        document.getElementById("customerCount").textContent =\r
            \`\${filteredCustomers.length} customer\${filteredCustomers.length !== 1 ? "s" : ""}\`;\r
\r
\r
        renderPagination();\r
\r
    }\r
\r
\r
    /* =====================================================\r
       PAGINATION\r
       ===================================================== */\r
\r
    function renderPagination() {\r
\r
        const pagination =\r
            document.getElementById("pagination");\r
\r
        pagination.innerHTML = "";\r
\r
\r
        const totalPages =\r
            Math.ceil(filteredCustomers.length / rowsPerPage);\r
\r
\r
        if (totalPages <= 1) {\r
            return;\r
        }\r
\r
\r
        const previousButton =\r
            document.createElement("button");\r
\r
        previousButton.className = "page-btn";\r
\r
        previousButton.innerHTML = "‹";\r
\r
        previousButton.disabled = currentPage === 1;\r
\r
        previousButton.onclick = function() {\r
\r
            if (currentPage > 1) {\r
\r
                currentPage--;\r
\r
                renderCustomers();\r
\r
            }\r
\r
        };\r
\r
        pagination.appendChild(previousButton);\r
\r
\r
        for (let page = 1; page <= totalPages; page++) {\r
\r
            const button =\r
                document.createElement("button");\r
\r
            button.className = "page-btn";\r
\r
            if (page === currentPage) {\r
\r
                button.classList.add("active");\r
\r
            }\r
\r
            button.textContent = page;\r
\r
\r
            button.onclick = function() {\r
\r
                currentPage = page;\r
\r
                renderCustomers();\r
\r
            };\r
\r
\r
            pagination.appendChild(button);\r
\r
        }\r
\r
\r
        const nextButton =\r
            document.createElement("button");\r
\r
        nextButton.className = "page-btn";\r
\r
        nextButton.innerHTML = "›";\r
\r
        nextButton.disabled =\r
            currentPage === totalPages;\r
\r
        nextButton.onclick = function() {\r
\r
            if (currentPage < totalPages) {\r
\r
                currentPage++;\r
\r
                renderCustomers();\r
\r
            }\r
\r
        };\r
\r
        pagination.appendChild(nextButton);\r
\r
    }\r
\r
\r
    /* =====================================================\r
       SEARCH CUSTOMER\r
       ===================================================== */\r
\r
    function searchCustomer() {\r
\r
        const input =\r
            document\r
                .getElementById("customerSearch")\r
                .value\r
                .toLowerCase()\r
                .trim();\r
\r
\r
        const clearButton =\r
            document.getElementById("clearSearch");\r
\r
\r
        clearButton.style.display =\r
            input.length > 0 ? "block" : "none";\r
\r
\r
        filteredCustomers = customers.filter(function(customer) {\r
\r
            return (\r
\r
                customer.name.toLowerCase().includes(input) ||\r
\r
                customer.mobile.toLowerCase().includes(input) ||\r
\r
                customer.address.toLowerCase().includes(input)\r
\r
            );\r
\r
        });\r
\r
\r
        currentPage = 1;\r
\r
        renderCustomers();\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLEAR SEARCH\r
       ===================================================== */\r
\r
    function clearSearch() {\r
\r
        document.getElementById("customerSearch").value = "";\r
\r
        document.getElementById("clearSearch").style.display = "none";\r
\r
        filteredCustomers = [...customers];\r
\r
        currentPage = 1;\r
\r
        renderCustomers();\r
\r
    }\r
\r
\r
    /* =====================================================\r
       OPEN ORDER HISTORY\r
       ===================================================== */\r
\r
    function openHistory(customerIndex) {\r
\r
        const customer = customers[customerIndex];\r
\r
\r
        document.getElementById("modalCustomerName").textContent =\r
            customer.name;\r
\r
        document.getElementById("modalMobile").textContent =\r
            customer.mobile;\r
\r
        document.getElementById("modalAddress").textContent =\r
            customer.address;\r
\r
        document.getElementById("modalTotalOrders").textContent =\r
            customer.orders.length;\r
\r
        document.getElementById("modalTotalSpent").textContent =\r
            formatCurrency(getCustomerTotal(customer));\r
\r
\r
        const historyTable =\r
            document.getElementById("historyTable");\r
\r
        historyTable.innerHTML = "";\r
\r
\r
        customer.orders.forEach(function(order) {\r
\r
            let statusClass = "unpaid";\r
\r
\r
            if (order.status === "Paid") {\r
\r
                statusClass = "paid";\r
\r
            } else if (order.status === "Cancelled") {\r
\r
                statusClass = "cancelled";\r
\r
            }\r
\r
\r
            const row = document.createElement("tr");\r
\r
\r
            row.innerHTML = \`\r
\r
                <td>\r
                    <strong>\r
                        \${escapeHtml(order.id)}\r
                    </strong>\r
                </td>\r
\r
                <td>\r
                    \${formatDate(order.date)}\r
                </td>\r
\r
                <td>\r
                    \${escapeHtml(order.items)}\r
                </td>\r
\r
                <td>\r
                    \${formatCurrency(order.amount)}\r
                </td>\r
\r
                <td>\r
                    \${escapeHtml(order.payment)}\r
                </td>\r
\r
                <td>\r
                    <span class="status \${statusClass}">\r
                        \${escapeHtml(order.status)}\r
                    </span>\r
                </td>\r
\r
            \`;\r
\r
\r
            historyTable.appendChild(row);\r
\r
        });\r
\r
\r
        document\r
            .getElementById("historyModal")\r
            .classList.add("show");\r
\r
\r
        document.body.style.overflow = "hidden";\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLOSE ORDER HISTORY\r
       ===================================================== */\r
\r
    function closeHistory() {\r
\r
        document\r
            .getElementById("historyModal")\r
            .classList.remove("show");\r
\r
\r
        document.body.style.overflow = "";\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLOSE MODAL WHEN CLICKING OUTSIDE\r
       ===================================================== */\r
\r
    document\r
        .getElementById("historyModal")\r
        .addEventListener("click", function(event) {\r
\r
            if (event.target === this) {\r
\r
                closeHistory();\r
\r
            }\r
\r
        });\r
\r
\r
    /* =====================================================\r
       ESC KEY TO CLOSE MODAL\r
       ===================================================== */\r
\r
    document.addEventListener("keydown", function(event) {\r
\r
        if (event.key === "Escape") {\r
\r
            closeHistory();\r
\r
        }\r
\r
    });\r
\r
\r
    /* =====================================================\r
       ESCAPE HTML\r
       ===================================================== */\r
\r
    function escapeHtml(value) {\r
\r
        return String(value)\r
\r
            .replace(/&/g, "&amp;")\r
\r
            .replace(/</g, "&lt;")\r
\r
            .replace(/>/g, "&gt;")\r
\r
            .replace(/"/g, "&quot;")\r
\r
            .replace(/'/g, "&#039;");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       SUMMARY\r
       ===================================================== */\r
\r
    function updateSummary() {\r
\r
        const totalCustomers =\r
            customers.length;\r
\r
\r
        let totalOrders = 0;\r
\r
        let totalSales = 0;\r
\r
        let activeCustomers = 0;\r
\r
\r
        customers.forEach(function(customer) {\r
\r
            totalOrders += customer.orders.length;\r
\r
            totalSales += getCustomerTotal(customer);\r
\r
\r
            if (customer.orders.length > 0) {\r
\r
                activeCustomers++;\r
\r
            }\r
\r
        });\r
\r
\r
        document.getElementById("totalCustomers").textContent =\r
            totalCustomers;\r
\r
\r
        document.getElementById("totalOrders").textContent =\r
            totalOrders;\r
\r
\r
        document.getElementById("totalSales").textContent =\r
            formatCurrency(totalSales);\r
\r
\r
        document.getElementById("activeCustomers").textContent =\r
            activeCustomers;\r
\r
    }\r
\r
\r
    /* =====================================================\r
       INITIAL LOAD\r
       ===================================================== */\r
\r
    updateSummary();\r
\r
    renderCustomers();\r
\r
<\/script>\r
\r
</body>\r
</html>\r
`;export{n as default};
