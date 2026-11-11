const r=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
    <title>Receipt Records - ELEE Hardware</title>\r
\r
    <style>\r
        * {\r
            box-sizing: border-box;\r
            margin: 0;\r
            padding: 0;\r
            font-family: Arial, sans-serif;\r
        }\r
\r
        body {\r
            background: #f5f5f5;\r
            color: #222;\r
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
            flex: 1;\r
            background: white;\r
            padding: 40px 50px;\r
            min-width: 0;\r
            margin-left: 235px;\r
        }\r
\r
        .page-title {\r
            color: #075b21;\r
            font-size: 30px;\r
            font-weight: bold;\r
        }\r
\r
        .subtitle {\r
            color: #888;\r
            margin-top: 5px;\r
            margin-bottom: 28px;\r
        }\r
\r
        /* ================= SUMMARY ================= */\r
\r
        .summary {\r
            display: grid;\r
            grid-template-columns: repeat(4, 1fr);\r
            gap: 16px;\r
            margin-bottom: 28px;\r
        }\r
\r
        .summary-card {\r
            border: 1px solid #e5e5e5;\r
            border-radius: 10px;\r
            padding: 18px;\r
            background: white;\r
        }\r
\r
        .summary-card .label {\r
            color: #777;\r
            font-size: 13px;\r
            margin-bottom: 8px;\r
        }\r
\r
        .summary-card .number {\r
            font-size: 25px;\r
            font-weight: bold;\r
            color: #075b21;\r
        }\r
\r
        .summary-card.paid .number {\r
            color: #16853b;\r
        }\r
\r
        .summary-card.unpaid .number {\r
            color: #d88a00;\r
        }\r
\r
        /* ================= TOOLBAR ================= */\r
\r
        .toolbar {\r
            display: flex;\r
            gap: 15px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .search-box {\r
            flex: 1;\r
            height: 50px;\r
            border: 1px solid #ddd;\r
            border-radius: 9px;\r
            display: flex;\r
            align-items: center;\r
            padding: 0 16px;\r
        }\r
\r
        .search-box span {\r
            font-size: 24px;\r
            color: #666;\r
            margin-right: 12px;\r
        }\r
\r
        .search-box input {\r
            border: none;\r
            outline: none;\r
            width: 100%;\r
            font-size: 14px;\r
        }\r
\r
        .filter-box {\r
            height: 50px;\r
            min-width: 190px;\r
            border: 1px solid #ddd;\r
            border-radius: 9px;\r
            padding: 0 14px;\r
            outline: none;\r
            background: white;\r
            cursor: pointer;\r
            color: #444;\r
        }\r
\r
        /* ================= TABLE ================= */\r
\r
        .table-wrapper {\r
            width: 100%;\r
            overflow-x: auto;\r
        }\r
\r
        table {\r
            width: 100%;\r
            border-collapse: collapse;\r
            min-width: 800px;\r
        }\r
\r
        th {\r
            text-align: left;\r
            padding: 15px 12px;\r
            font-size: 13px;\r
            color: #333;\r
            background: #fafafa;\r
            border-bottom: 1px solid #ddd;\r
        }\r
\r
        td {\r
            padding: 16px 12px;\r
            border-bottom: 1px solid #eee;\r
            font-size: 13px;\r
        }\r
\r
        .order-id {\r
            color: #075b21;\r
            font-weight: bold;\r
        }\r
\r
        .amount {\r
            font-weight: bold;\r
        }\r
\r
        /* ================= STATUS ================= */\r
\r
        .status {\r
            display: inline-flex;\r
            align-items: center;\r
            gap: 6px;\r
            padding: 5px 10px;\r
            border-radius: 20px;\r
            font-size: 11px;\r
            font-weight: bold;\r
        }\r
\r
        .status.paid {\r
            background: #e5f7ea;\r
            color: #16853b;\r
        }\r
\r
        .status.unpaid {\r
            background: #fff3d6;\r
            color: #b87500;\r
        }\r
\r
        .status-dot {\r
            width: 6px;\r
            height: 6px;\r
            border-radius: 50%;\r
            background: currentColor;\r
        }\r
\r
        .payment-method {\r
            color: #555;\r
            font-size: 12px;\r
        }\r
\r
        /* ================= BUTTON ================= */\r
\r
        .view-btn {\r
            border: 1px solid #16a34a;\r
            color: #12813b;\r
            background: white;\r
            padding: 7px 17px;\r
            border-radius: 5px;\r
            cursor: pointer;\r
            font-size: 12px;\r
            transition: .2s;\r
        }\r
\r
        .view-btn:hover {\r
            background: #12813b;\r
            color: white;\r
        }\r
\r
        /* ================= EMPTY ================= */\r
\r
        .empty {\r
            text-align: center;\r
            padding: 50px;\r
            color: #999;\r
        }\r
\r
        /* ================= BOTTOM ================= */\r
\r
        .bottom {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            margin-top: 25px;\r
            color: #777;\r
            font-size: 13px;\r
        }\r
\r
        .pagination {\r
            display: flex;\r
            gap: 6px;\r
            align-items: center;\r
        }\r
\r
        .page {\r
            padding: 7px 11px;\r
            cursor: pointer;\r
            border-radius: 5px;\r
        }\r
\r
        .page:hover {\r
            background: #e8f5eb;\r
        }\r
\r
        .page.active {\r
            background: #239447;\r
            color: white;\r
        }\r
\r
        /* ================= MODAL ================= */\r
\r
        .modal-overlay {\r
            display: none;\r
            position: fixed;\r
            z-index: 999;\r
            inset: 0;\r
            background: rgba(0,0,0,.55);\r
            align-items: center;\r
            justify-content: center;\r
            padding: 20px;\r
        }\r
\r
        .modal-overlay.show {\r
            display: flex;\r
        }\r
\r
        .receipt-modal {\r
            background: white;\r
            width: 680px;\r
            max-width: 100%;\r
            max-height: 92vh;\r
            overflow-y: auto;\r
            border-radius: 10px;\r
            padding: 28px;\r
            box-shadow: 0 10px 40px rgba(0,0,0,.25);\r
        }\r
\r
        .modal-title {\r
            display: flex;\r
            align-items: center;\r
            gap: 10px;\r
            margin-bottom: 20px;\r
        }\r
\r
        .receipt-icon {\r
            width: 34px;\r
            height: 34px;\r
            background: #1c9142;\r
            color: white;\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
            border-radius: 6px;\r
        }\r
\r
        .modal-title h2 {\r
            font-size: 18px;\r
        }\r
\r
        .modal-title p {\r
            font-size: 11px;\r
            color: #999;\r
            margin-top: 3px;\r
        }\r
\r
        /* ================= RECEIPT PAPER ================= */\r
\r
        .receipt-paper {\r
            border: 1px solid #ddd;\r
            padding: 25px;\r
        }\r
\r
        .receipt-header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: flex-start;\r
            padding-bottom: 18px;\r
            border-bottom: 1px solid #ddd;\r
        }\r
\r
        .receipt-logo {\r
            font-size: 32px;\r
            font-weight: 900;\r
            color: #00a52a;\r
        }\r
\r
        .receipt-logo span {\r
            color: #ffb000;\r
        }\r
\r
        .receipt-hardware {\r
            color: #ffb000;\r
            font-size: 9px;\r
            font-weight: bold;\r
        }\r
\r
        .receipt-type {\r
            text-align: right;\r
        }\r
\r
        .receipt-type strong {\r
            display: block;\r
            color: #168537;\r
            font-size: 12px;\r
        }\r
\r
        .receipt-type span {\r
            font-size: 10px;\r
            color: #888;\r
        }\r
\r
        /* ================= RECEIPT INFO ================= */\r
\r
        .receipt-info {\r
            display: grid;\r
            grid-template-columns: 1fr 1fr;\r
            margin-top: 16px;\r
            border-bottom: 1px solid #ddd;\r
            padding-bottom: 15px;\r
        }\r
\r
        .info-box {\r
            padding: 8px 10px;\r
            font-size: 11px;\r
        }\r
\r
        .info-box:nth-child(odd) {\r
            border-right: 1px solid #ddd;\r
        }\r
\r
        .info-label {\r
            color: #777;\r
            margin-bottom: 5px;\r
        }\r
\r
        .info-value {\r
            font-weight: bold;\r
        }\r
\r
        /* ================= CUSTOMER ================= */\r
\r
        .customer-section {\r
            margin-top: 15px;\r
            padding-bottom: 15px;\r
            border-bottom: 1px solid #ddd;\r
        }\r
\r
        .customer-title {\r
            font-size: 11px;\r
            color: #777;\r
            margin-bottom: 5px;\r
        }\r
\r
        .customer-name {\r
            font-size: 13px;\r
            font-weight: bold;\r
        }\r
\r
        .customer-phone {\r
            font-size: 10px;\r
            color: #666;\r
            margin-top: 3px;\r
        }\r
\r
        /* ================= ITEMS ================= */\r
\r
        .items-title {\r
            margin-top: 18px;\r
            background: #e8f6e9;\r
            padding: 9px;\r
            font-size: 11px;\r
            font-weight: bold;\r
        }\r
\r
        .items-table {\r
            width: 100%;\r
            min-width: 0;\r
            border-collapse: collapse;\r
        }\r
\r
        .items-table th {\r
            background: #f3faf4;\r
            font-size: 10px;\r
            padding: 9px;\r
        }\r
\r
        .items-table td {\r
            font-size: 10px;\r
            padding: 9px;\r
            border-bottom: 1px solid #eee;\r
        }\r
\r
        /* ================= TOTAL ================= */\r
\r
        .totals {\r
            margin-top: 15px;\r
            margin-left: auto;\r
            width: 260px;\r
        }\r
\r
        .total-row {\r
            display: flex;\r
            justify-content: space-between;\r
            padding: 5px 0;\r
            font-size: 11px;\r
        }\r
\r
        .total-row.final {\r
            border-top: 1px solid #bbb;\r
            margin-top: 5px;\r
            padding-top: 10px;\r
            font-weight: bold;\r
            font-size: 14px;\r
            color: #075b21;\r
        }\r
\r
        /* ================= MODAL ACTIONS ================= */\r
\r
        .modal-actions {\r
            display: flex;\r
            justify-content: flex-end;\r
            gap: 10px;\r
            margin-top: 16px;\r
        }\r
\r
        .close-btn {\r
            background: white;\r
            border: 1px solid #ddd;\r
            padding: 9px 18px;\r
            border-radius: 5px;\r
            cursor: pointer;\r
        }\r
\r
        .print-btn {\r
            background: #238f45;\r
            border: none;\r
            color: white;\r
            padding: 9px 18px;\r
            border-radius: 5px;\r
            cursor: pointer;\r
        }\r
\r
        .print-btn:hover {\r
            background: #176d32;\r
        }\r
\r
        /* ================= RESPONSIVE ================= */\r
\r
        @media(max-width: 1000px) {\r
\r
            .sidebar {\r
                width: 200px;\r
            }\r
\r
            .main {\r
                margin-left: 200px;\r
                padding: 30px;\r
            }\r
\r
            .summary {\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
\r
        }\r
\r
        @media(max-width: 700px) {\r
\r
            .layout {\r
                display: block;\r
            }\r
\r
            .sidebar {\r
                position: relative;\r
                width: 100%;\r
                height: auto;\r
                min-height: auto;\r
                padding: 20px;\r
            }\r
\r
            .menu {\r
                display: grid;\r
                grid-template-columns: repeat(2, 1fr);\r
                gap: 7px;\r
            }\r
\r
            .menu a {\r
                margin: 0;\r
            }\r
\r
            .main {\r
                margin-left: 0;\r
                padding: 25px 18px;\r
            }\r
\r
            .summary {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .toolbar {\r
                flex-direction: column;\r
            }\r
\r
            .filter-box {\r
                width: 100%;\r
            }\r
\r
            .bottom {\r
                flex-direction: column;\r
                gap: 15px;\r
                align-items: flex-start;\r
            }\r
\r
            .receipt-paper {\r
                padding: 15px;\r
            }\r
\r
        }\r
\r
        /* ================= PRINT ================= */\r
\r
        @media print {\r
\r
            body * {\r
                visibility: hidden;\r
            }\r
\r
            .receipt-modal,\r
            .receipt-modal * {\r
                visibility: visible;\r
            }\r
\r
            .receipt-modal {\r
                position: absolute;\r
                left: 0;\r
                top: 0;\r
                width: 100%;\r
                max-width: none;\r
                max-height: none;\r
                box-shadow: none;\r
                border-radius: 0;\r
            }\r
\r
            .modal-actions {\r
                display: none;\r
            }\r
\r
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
            <a href="{{ url('/receipt-records') }}" class="active">\r
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
        <h1 class="page-title">Receipt Records</h1>\r
\r
        <p class="subtitle">\r
            View and manage order receipts, totals, payment methods, and payment status.\r
        </p>\r
\r
\r
        <!-- ================= SUMMARY ================= -->\r
\r
        <div class="summary">\r
\r
            <div class="summary-card">\r
                <div class="label">Total Orders</div>\r
                <div class="number" id="totalOrders">0</div>\r
            </div>\r
\r
            <div class="summary-card">\r
                <div class="label">Total Amount</div>\r
                <div class="number" id="totalAmount">₱0.00</div>\r
            </div>\r
\r
            <div class="summary-card paid">\r
                <div class="label">Paid Orders</div>\r
                <div class="number" id="paidOrders">0</div>\r
            </div>\r
\r
            <div class="summary-card unpaid">\r
                <div class="label">Unpaid Orders</div>\r
                <div class="number" id="unpaidOrders">0</div>\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= TOOLBAR ================= -->\r
\r
        <div class="toolbar">\r
\r
            <div class="search-box">\r
                <span>⌕</span>\r
\r
                <input\r
                    type="text"\r
                    id="searchInput"\r
                    placeholder="Search receipt, order, or customer..."\r
                    oninput="renderReceipts()"\r
                >\r
            </div>\r
\r
            <select\r
                class="filter-box"\r
                id="statusFilter"\r
                onchange="renderReceipts()"\r
            >\r
                <option value="all">All Payment Status</option>\r
                <option value="Paid">Paid</option>\r
                <option value="Unpaid">Unpaid</option>\r
            </select>\r
\r
        </div>\r
\r
\r
        <!-- ================= TABLE ================= -->\r
\r
        <div class="table-wrapper">\r
\r
            <table>\r
\r
                <thead>\r
                    <tr>\r
                        <th>Receipt No.</th>\r
                        <th>Order ID</th>\r
                        <th>Customer</th>\r
                        <th>Order Total</th>\r
                        <th>Payment Method</th>\r
                        <th>Payment Status</th>\r
                        <th>Date</th>\r
                        <th>Action</th>\r
                    </tr>\r
                </thead>\r
\r
                <tbody id="receiptTableBody"></tbody>\r
\r
            </table>\r
\r
        </div>\r
\r
\r
        <!-- ================= BOTTOM ================= -->\r
\r
        <div class="bottom">\r
\r
            <div id="showingText">\r
                Showing 0 orders\r
            </div>\r
\r
            <div class="pagination">\r
\r
                <span class="page active">\r
                    1\r
                </span>\r
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
<!-- ================= RECEIPT MODAL ================= -->\r
\r
<div\r
    class="modal-overlay"\r
    id="receiptModal"\r
    onclick="closeOutside(event)"\r
>\r
\r
    <div class="receipt-modal">\r
\r
        <div class="modal-title">\r
\r
            <div class="receipt-icon">\r
                ▣\r
            </div>\r
\r
            <div>\r
                <h2>View Receipt</h2>\r
\r
                <p>\r
                    Order and payment details\r
                </p>\r
            </div>\r
\r
        </div>\r
\r
\r
        <div class="receipt-paper">\r
\r
            <div class="receipt-header">\r
\r
                <div>\r
\r
                    <div class="receipt-logo">\r
                        EL<span>EE</span>\r
                    </div>\r
\r
                    <div class="receipt-hardware">\r
                        HARDWARE\r
                    </div>\r
\r
                </div>\r
\r
                <div class="receipt-type">\r
\r
                    <strong>ORDER RECEIPT</strong>\r
\r
                    <span>\r
                        Thank you for your purchase\r
                    </span>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="receipt-info">\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Receipt No.\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalReceiptNo">\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Order ID\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalOrderId">\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Date\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalDate">\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Payment Method\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalPaymentMethod">\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="info-box">\r
\r
                    <div class="info-label">\r
                        Payment Status\r
                    </div>\r
\r
                    <div\r
                        class="info-value"\r
                        id="modalPaymentStatus">\r
                    </div>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="customer-section">\r
\r
                <div class="customer-title">\r
                    Customer\r
                </div>\r
\r
                <div\r
                    class="customer-name"\r
                    id="modalCustomer">\r
                </div>\r
\r
                <div\r
                    class="customer-phone"\r
                    id="modalPhone">\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="items-title">\r
                Items Ordered\r
            </div>\r
\r
            <table class="items-table">\r
\r
                <thead>\r
\r
                    <tr>\r
                        <th>Product</th>\r
                        <th>Qty</th>\r
                        <th>Unit Price</th>\r
                        <th>Subtotal</th>\r
                    </tr>\r
\r
                </thead>\r
\r
                <tbody id="modalItems"></tbody>\r
\r
            </table>\r
\r
\r
            <div class="totals">\r
\r
                <div class="total-row">\r
\r
                    <span>\r
                        Subtotal\r
                    </span>\r
\r
                    <span id="modalSubtotal">\r
                        ₱0.00\r
                    </span>\r
\r
                </div>\r
\r
\r
                <div class="total-row">\r
\r
                    <span>\r
                        Delivery Fee\r
                    </span>\r
\r
                    <span id="modalDeliveryFee">\r
                        ₱0.00\r
                    </span>\r
\r
                </div>\r
\r
\r
                <div class="total-row final">\r
\r
                    <span>\r
                        Order Total\r
                    </span>\r
\r
                    <span id="modalTotal">\r
                        ₱0.00\r
                    </span>\r
\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <div class="modal-actions">\r
\r
            <button\r
                class="close-btn"\r
                onclick="closeReceipt()"\r
            >\r
                Close\r
            </button>\r
\r
            <button\r
                class="print-btn"\r
                onclick="printReceipt()"\r
            >\r
                🖨 Print Receipt\r
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
const receipts = [\r
\r
    {\r
        receipt: "RCP-2026-000119",\r
        order: "#ELEE-2026-000119",\r
        customer: "Kobe Foster",\r
        phone: "0911 122 8765",\r
        total: 4390,\r
        method: "Cash on Delivery",\r
        status: "Paid",\r
        date: "September 2, 2026",\r
        items: [\r
            {\r
                name: "Cement (40 kg)",\r
                qty: 10,\r
                price: 250\r
            },\r
            {\r
                name: "GI Roofing Sheet",\r
                qty: 5,\r
                price: 320\r
            },\r
            {\r
                name: "Nails (1kg)",\r
                qty: 1,\r
                price: 240\r
            }\r
        ],\r
        deliveryFee: 50\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000120",\r
        order: "#ELEE-2026-000120",\r
        customer: "Myka Santos",\r
        phone: "0912 345 6789",\r
        total: 2750,\r
        method: "Cash at Store",\r
        status: "Paid",\r
        date: "September 5, 2026",\r
        items: [\r
            {\r
                name: "Paint 4L",\r
                qty: 2,\r
                price: 850\r
            },\r
            {\r
                name: "Paint Brush",\r
                qty: 2,\r
                price: 250\r
            },\r
            {\r
                name: "Sandpaper",\r
                qty: 5,\r
                price: 100\r
            }\r
        ],\r
        deliveryFee: 0\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000121",\r
        order: "#ELEE-2026-000121",\r
        customer: "Janna Salvador",\r
        phone: "0913 456 7890",\r
        total: 3180,\r
        method: "Cash on Delivery",\r
        status: "Unpaid",\r
        date: "September 9, 2026",\r
        items: [\r
            {\r
                name: "PVC Pipe",\r
                qty: 10,\r
                price: 180\r
            },\r
            {\r
                name: "PVC Elbow",\r
                qty: 8,\r
                price: 120\r
            },\r
            {\r
                name: "PVC Cement",\r
                qty: 1,\r
                price: 580\r
            }\r
        ],\r
        deliveryFee: 100\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000122",\r
        order: "#ELEE-2026-000122",\r
        customer: "Anna Corpuz",\r
        phone: "0914 567 8901",\r
        total: 5120,\r
        method: "Cash at Store",\r
        status: "Paid",\r
        date: "September 12, 2026",\r
        items: [\r
            {\r
                name: "Steel Bar",\r
                qty: 10,\r
                price: 350\r
            },\r
            {\r
                name: "Tie Wire",\r
                qty: 4,\r
                price: 150\r
            },\r
            {\r
                name: "Cement (40 kg)",\r
                qty: 1,\r
                price: 850\r
            }\r
        ],\r
        deliveryFee: 20\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000123",\r
        order: "#ELEE-2026-000123",\r
        customer: "Bea Sanchez",\r
        phone: "0915 678 9012",\r
        total: 6890,\r
        method: "Cash on Delivery",\r
        status: "Unpaid",\r
        date: "September 15, 2026",\r
        items: [\r
            {\r
                name: "Cement (40 kg)",\r
                qty: 15,\r
                price: 250\r
            },\r
            {\r
                name: "GI Roofing Sheet",\r
                qty: 8,\r
                price: 320\r
            },\r
            {\r
                name: "Nails (1kg)",\r
                qty: 2,\r
                price: 240\r
            }\r
        ],\r
        deliveryFee: 50\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000124",\r
        order: "#ELEE-2026-000124",\r
        customer: "John Bautista",\r
        phone: "0916 789 0123",\r
        total: 2340,\r
        method: "Cash at Store",\r
        status: "Paid",\r
        date: "September 18, 2026",\r
        items: [\r
            {\r
                name: "Hammer",\r
                qty: 2,\r
                price: 450\r
            },\r
            {\r
                name: "Screwdriver Set",\r
                qty: 1,\r
                price: 850\r
            },\r
            {\r
                name: "Nails",\r
                qty: 3,\r
                price: 180\r
            }\r
        ],\r
        deliveryFee: 0\r
    },\r
\r
    {\r
        receipt: "RCP-2026-000125",\r
        order: "#ELEE-2026-000125",\r
        customer: "Vito Navarro",\r
        phone: "0917 890 1234",\r
        total: 4250,\r
        method: "Cash on Delivery",\r
        status: "Paid",\r
        date: "September 20, 2026",\r
        items: [\r
            {\r
                name: "Power Drill",\r
                qty: 1,\r
                price: 3500\r
            },\r
            {\r
                name: "Drill Bit Set",\r
                qty: 1,\r
                price: 700\r
            }\r
        ],\r
        deliveryFee: 50\r
    }\r
\r
];\r
\r
\r
function formatMoney(amount) {\r
\r
    return new Intl.NumberFormat("en-PH", {\r
        style: "currency",\r
        currency: "PHP"\r
    }).format(amount);\r
\r
}\r
\r
\r
function updateSummary() {\r
\r
    const totalOrders = receipts.length;\r
\r
    const totalAmount = receipts.reduce(\r
        (sum, receipt) => sum + receipt.total,\r
        0\r
    );\r
\r
    const paidOrders = receipts.filter(\r
        receipt => receipt.status === "Paid"\r
    ).length;\r
\r
    const unpaidOrders = receipts.filter(\r
        receipt => receipt.status === "Unpaid"\r
    ).length;\r
\r
\r
    document.getElementById("totalOrders").innerText =\r
        totalOrders;\r
\r
    document.getElementById("totalAmount").innerText =\r
        formatMoney(totalAmount);\r
\r
    document.getElementById("paidOrders").innerText =\r
        paidOrders;\r
\r
    document.getElementById("unpaidOrders").innerText =\r
        unpaidOrders;\r
\r
}\r
\r
\r
function renderReceipts() {\r
\r
    const tbody =\r
        document.getElementById("receiptTableBody");\r
\r
    const search =\r
        document\r
            .getElementById("searchInput")\r
            .value\r
            .toLowerCase()\r
            .trim();\r
\r
    const status =\r
        document\r
            .getElementById("statusFilter")\r
            .value;\r
\r
\r
    const filtered = receipts.filter(receipt => {\r
\r
        const searchableText = (\r
\r
            receipt.receipt +\r
            " " +\r
            receipt.order +\r
            " " +\r
            receipt.customer +\r
            " " +\r
            receipt.method\r
\r
        ).toLowerCase();\r
\r
\r
        const matchesSearch =\r
            searchableText.includes(search);\r
\r
\r
        const matchesStatus =\r
            status === "all" ||\r
            receipt.status === status;\r
\r
\r
        return matchesSearch && matchesStatus;\r
\r
    });\r
\r
\r
    tbody.innerHTML = "";\r
\r
\r
    if (filtered.length === 0) {\r
\r
        tbody.innerHTML = \`\r
            <tr>\r
                <td colspan="8" class="empty">\r
                    No receipt records found.\r
                </td>\r
            </tr>\r
        \`;\r
\r
        document.getElementById("showingText").innerText =\r
            "Showing 0 orders";\r
\r
        return;\r
    }\r
\r
\r
    filtered.forEach((receipt) => {\r
\r
        const row = document.createElement("tr");\r
\r
\r
        row.innerHTML = \`\r
\r
            <td>\r
                <strong>\${receipt.receipt}</strong>\r
            </td>\r
\r
            <td>\r
                <span class="order-id">\r
                    \${receipt.order}\r
                </span>\r
            </td>\r
\r
            <td>\r
                \${receipt.customer}\r
            </td>\r
\r
            <td>\r
                <span class="amount">\r
                    \${formatMoney(receipt.total)}\r
                </span>\r
            </td>\r
\r
            <td>\r
                <span class="payment-method">\r
                    \${receipt.method}\r
                </span>\r
            </td>\r
\r
            <td>\r
\r
                <span class="status \${receipt.status.toLowerCase()}">\r
\r
                    <span class="status-dot"></span>\r
\r
                    \${receipt.status}\r
\r
                </span>\r
\r
            </td>\r
\r
            <td>\r
                \${receipt.date}\r
            </td>\r
\r
            <td>\r
\r
                <button\r
                    class="view-btn"\r
                    onclick="showReceipt(\${receipts.indexOf(receipt)})"\r
                >\r
                    View\r
                </button>\r
\r
            </td>\r
\r
        \`;\r
\r
\r
        tbody.appendChild(row);\r
\r
    });\r
\r
\r
    document.getElementById("showingText").innerText =\r
        \`Showing 1 to \${filtered.length} of \${filtered.length} orders\`;\r
\r
}\r
\r
\r
function showReceipt(index) {\r
\r
    const data = receipts[index];\r
\r
\r
    document.getElementById("modalReceiptNo").innerText =\r
        data.receipt;\r
\r
\r
    document.getElementById("modalOrderId").innerText =\r
        data.order;\r
\r
\r
    document.getElementById("modalDate").innerText =\r
        data.date;\r
\r
\r
    document.getElementById("modalPaymentMethod").innerText =\r
        data.method;\r
\r
\r
    document.getElementById("modalPaymentStatus").innerHTML = \`\r
\r
        <span class="status \${data.status.toLowerCase()}">\r
\r
            <span class="status-dot"></span>\r
\r
            \${data.status}\r
\r
        </span>\r
\r
    \`;\r
\r
\r
    document.getElementById("modalCustomer").innerText =\r
        data.customer;\r
\r
\r
    document.getElementById("modalPhone").innerText =\r
        data.phone;\r
\r
\r
    const itemsContainer =\r
        document.getElementById("modalItems");\r
\r
    itemsContainer.innerHTML = "";\r
\r
\r
    let subtotal = 0;\r
\r
\r
    data.items.forEach(item => {\r
\r
        const itemSubtotal =\r
            item.qty * item.price;\r
\r
        subtotal += itemSubtotal;\r
\r
\r
        const row =\r
            document.createElement("tr");\r
\r
\r
        row.innerHTML = \`\r
\r
            <td>\r
                \${item.name}\r
            </td>\r
\r
            <td>\r
                \${item.qty}\r
            </td>\r
\r
            <td>\r
                \${formatMoney(item.price)}\r
            </td>\r
\r
            <td>\r
                \${formatMoney(itemSubtotal)}\r
            </td>\r
\r
        \`;\r
\r
\r
        itemsContainer.appendChild(row);\r
\r
    });\r
\r
\r
    document.getElementById("modalSubtotal").innerText =\r
        formatMoney(subtotal);\r
\r
\r
    document.getElementById("modalDeliveryFee").innerText =\r
        formatMoney(data.deliveryFee);\r
\r
\r
    document.getElementById("modalTotal").innerText =\r
        formatMoney(data.total);\r
\r
\r
    document\r
        .getElementById("receiptModal")\r
        .classList.add("show");\r
\r
}\r
\r
\r
function closeReceipt() {\r
\r
    document\r
        .getElementById("receiptModal")\r
        .classList.remove("show");\r
\r
}\r
\r
\r
function closeOutside(event) {\r
\r
    if (\r
        event.target.id === "receiptModal"\r
    ) {\r
\r
        closeReceipt();\r
\r
    }\r
\r
}\r
\r
\r
function printReceipt() {\r
\r
    window.print();\r
\r
}\r
\r
\r
document.addEventListener(\r
    "keydown",\r
    function(event) {\r
\r
        if (event.key === "Escape") {\r
\r
            closeReceipt();\r
\r
        }\r
\r
    }\r
);\r
\r
\r
updateSummary();\r
renderReceipts();\r
\r
<\/script>\r
\r
</body>\r
</html>`;export{r as default};
