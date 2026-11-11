const n=`<!DOCTYPE html>\r
<html lang="en">\r
\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
\r
    <title>Payments - ELEE Hardware</title>\r
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
            background: #f5f7f6;\r
            min-height: 100vh;\r
        }\r
\r
        .dashboard {\r
            display: flex;\r
            min-height: 100vh;\r
            width: 100%;\r
        }\r
\r
\r
        /* =====================================================\r
           SIDEBAR\r
        ===================================================== */\r
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
            z-index: 1000;\r
        }\r
\r
        .logo {\r
            font-size: 36px;\r
            font-weight: 900;\r
            margin-left: 12px;\r
            letter-spacing: -2px;\r
            color: white;\r
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
\r
        /* =====================================================\r
           CONTENT\r
        ===================================================== */\r
\r
        .content {\r
            flex: 1;\r
            min-height: 100vh;\r
            background: #f8faf9;\r
            padding: 35px 40px;\r
            margin-left: 235px;\r
            overflow-x: hidden;\r
        }\r
\r
        .page-header {\r
            margin-bottom: 25px;\r
        }\r
\r
        .page-title {\r
            color: #0b5c25;\r
            font-size: 28px;\r
            font-weight: 700;\r
            margin-bottom: 5px;\r
        }\r
\r
        .page-subtitle {\r
            color: #929292;\r
            font-size: 14px;\r
        }\r
\r
\r
        /* =====================================================\r
           SUMMARY CARDS\r
        ===================================================== */\r
\r
        .summary {\r
            display: grid;\r
            grid-template-columns: repeat(4, 1fr);\r
            gap: 15px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .summary-card {\r
            background: white;\r
            border: 1px solid #e2e7e4;\r
            border-radius: 12px;\r
            padding: 17px;\r
            display: flex;\r
            align-items: center;\r
            gap: 13px;\r
        }\r
\r
        .summary-icon {\r
            width: 43px;\r
            height: 43px;\r
            border-radius: 10px;\r
            background: #e8f7ec;\r
            color: #19803c;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            font-size: 20px;\r
        }\r
\r
        .summary-info small {\r
            display: block;\r
            color: #999;\r
            font-size: 11px;\r
            margin-bottom: 4px;\r
        }\r
\r
        .summary-info strong {\r
            color: #222;\r
            font-size: 19px;\r
        }\r
\r
\r
        /* =====================================================\r
           FILTERS\r
        ===================================================== */\r
\r
        .filters {\r
            display: grid;\r
            grid-template-columns: 170px 1fr 220px;\r
            gap: 15px;\r
            margin-bottom: 22px;\r
        }\r
\r
        .filter-wrapper {\r
            position: relative;\r
        }\r
\r
        .filter-box {\r
            width: 100%;\r
            height: 46px;\r
            border: 1px solid #dedede;\r
            border-radius: 7px;\r
            background: white;\r
            display: flex;\r
            align-items: center;\r
            justify-content: space-between;\r
            padding: 0 14px;\r
            cursor: pointer;\r
            font-size: 13px;\r
            color: #333;\r
        }\r
\r
        .filter-box:hover {\r
            border-color: #239447;\r
        }\r
\r
        .filter-arrow {\r
            color: #555;\r
        }\r
\r
        .filter-dropdown {\r
            display: none;\r
            position: absolute;\r
            top: 52px;\r
            left: 0;\r
            width: 100%;\r
            background: white;\r
            border: 1px solid #dedede;\r
            border-radius: 7px;\r
            box-shadow: 0 5px 15px rgba(0,0,0,0.12);\r
            z-index: 1000;\r
            overflow: hidden;\r
        }\r
\r
        .filter-dropdown.show {\r
            display: block;\r
        }\r
\r
        .filter-dropdown button {\r
            width: 100%;\r
            padding: 11px 14px;\r
            border: none;\r
            background: white;\r
            text-align: left;\r
            cursor: pointer;\r
            font-size: 12px;\r
            color: #333;\r
        }\r
\r
        .filter-dropdown button:hover {\r
            background: #eaf8ed;\r
            color: #19803c;\r
        }\r
\r
\r
        /* =====================================================\r
           SEARCH\r
        ===================================================== */\r
\r
        .search-box {\r
            height: 46px;\r
            border: 1px solid #dedede;\r
            border-radius: 7px;\r
            background: white;\r
            display: flex;\r
            align-items: center;\r
            padding: 0 14px;\r
            gap: 10px;\r
        }\r
\r
        .search-icon {\r
            font-size: 20px;\r
            color: #555;\r
        }\r
\r
        .search-box input {\r
            border: none;\r
            outline: none;\r
            width: 100%;\r
            font-size: 13px;\r
        }\r
\r
\r
        /* =====================================================\r
           DATE\r
        ===================================================== */\r
\r
        .date-box {\r
            height: 46px;\r
            border: 1px solid #dedede;\r
            border-radius: 7px;\r
            background: white;\r
            display: flex;\r
            align-items: center;\r
            padding: 0 12px;\r
            gap: 8px;\r
        }\r
\r
        .calendar-icon {\r
            font-size: 17px;\r
        }\r
\r
        .date-box input {\r
            border: none;\r
            outline: none;\r
            width: 100%;\r
            font-size: 12px;\r
            background: transparent;\r
        }\r
\r
\r
        /* =====================================================\r
           PAYMENT TABLE\r
        ===================================================== */\r
\r
        .table-card {\r
            background: white;\r
            border: 1px solid #e2e7e4;\r
            border-radius: 12px;\r
            overflow: hidden;\r
        }\r
\r
        .table-wrapper {\r
            width: 100%;\r
            overflow-x: auto;\r
        }\r
\r
        table {\r
            width: 100%;\r
            min-width: 1100px;\r
            border-collapse: collapse;\r
        }\r
\r
        thead {\r
            background: #f8faf9;\r
        }\r
\r
        thead th {\r
            text-align: left;\r
            font-size: 12px;\r
            font-weight: 700;\r
            color: #444;\r
            padding: 16px 12px;\r
            border-bottom: 1px solid #e5e5e5;\r
            white-space: nowrap;\r
        }\r
\r
        tbody td {\r
            font-size: 12px;\r
            color: #222;\r
            padding: 16px 12px;\r
            border-bottom: 1px solid #f0f0f0;\r
            vertical-align: middle;\r
            white-space: nowrap;\r
        }\r
\r
        tbody tr:hover {\r
            background: #fbfdfb;\r
        }\r
\r
\r
        /* =====================================================\r
           PAYMENT METHOD\r
        ===================================================== */\r
\r
        .payment-method {\r
            display: inline-flex;\r
            align-items: center;\r
            gap: 6px;\r
            background: #f1f7f3;\r
            color: #167636;\r
            padding: 6px 9px;\r
            border-radius: 6px;\r
            font-size: 10px;\r
            font-weight: 600;\r
        }\r
\r
        .method-icon {\r
            font-size: 12px;\r
        }\r
\r
\r
        /* =====================================================\r
           STATUS\r
        ===================================================== */\r
\r
        .status {\r
            display: inline-flex;\r
            align-items: center;\r
            justify-content: center;\r
            min-width: 68px;\r
            height: 24px;\r
            padding: 0 9px;\r
            border-radius: 6px;\r
            font-size: 10px;\r
            font-weight: 700;\r
        }\r
\r
        .unpaid {\r
            background: #fff0bd;\r
            color: #966f00;\r
        }\r
\r
        .paid {\r
            background: #b8f2b9;\r
            color: #268238;\r
        }\r
\r
        .cancelled {\r
            background: #ffb6b6;\r
            color: #d83c3c;\r
        }\r
\r
\r
        /* =====================================================\r
           ACTION BUTTONS\r
        ===================================================== */\r
\r
        .actions {\r
            display: flex;\r
            gap: 6px;\r
            flex-wrap: wrap;\r
        }\r
\r
        .action-btn {\r
            border: none;\r
            border-radius: 6px;\r
            padding: 7px 9px;\r
            cursor: pointer;\r
            font-size: 10px;\r
            font-weight: 600;\r
            transition: 0.2s;\r
        }\r
\r
        .action-btn:hover {\r
            opacity: 0.8;\r
        }\r
\r
        .view-btn {\r
            background: #edf5ff;\r
            color: #2766a5;\r
        }\r
\r
        .pay-btn {\r
            background: #dff6e5;\r
            color: #16813a;\r
        }\r
\r
        .undo-btn {\r
            background: #fff0bd;\r
            color: #966f00;\r
        }\r
\r
        .cancel-btn {\r
            background: #ffe8e8;\r
            color: #c93434;\r
        }\r
\r
\r
        /* =====================================================\r
           EMPTY\r
        ===================================================== */\r
\r
        .no-results {\r
            display: none;\r
            text-align: center;\r
            padding: 45px;\r
            color: #999;\r
            font-size: 14px;\r
        }\r
\r
\r
        /* =====================================================\r
           BOTTOM\r
        ===================================================== */\r
\r
        .table-bottom {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            padding: 18px 20px;\r
            gap: 20px;\r
        }\r
\r
        .showing {\r
            color: #929292;\r
            font-size: 12px;\r
            font-weight: 600;\r
        }\r
\r
        .pagination {\r
            display: flex;\r
            align-items: center;\r
            gap: 7px;\r
        }\r
\r
        .page-number,\r
        .next {\r
            width: 28px;\r
            height: 28px;\r
            border: none;\r
            background: transparent;\r
            color: #777;\r
            border-radius: 5px;\r
            cursor: pointer;\r
            font-size: 12px;\r
        }\r
\r
        .page-number:hover,\r
        .next:hover {\r
            background: #eaf8ed;\r
            color: #19803c;\r
        }\r
\r
        .page-number.active {\r
            background: #239447;\r
            color: white;\r
        }\r
\r
        .next:disabled {\r
            color: #ccc;\r
            cursor: not-allowed;\r
            background: transparent;\r
        }\r
\r
        .page-dots {\r
            color: #777;\r
            font-size: 12px;\r
            padding: 0 2px;\r
        }\r
\r
\r
        /* =====================================================\r
           MODAL\r
        ===================================================== */\r
\r
        .modal {\r
            display: none;\r
            position: fixed;\r
            inset: 0;\r
            background: rgba(0,0,0,0.55);\r
            align-items: center;\r
            justify-content: center;\r
            z-index: 9999;\r
            padding: 20px;\r
        }\r
\r
        .modal.show {\r
            display: flex;\r
        }\r
\r
        .modal-content {\r
            width: 470px;\r
            max-width: 100%;\r
            max-height: 90vh;\r
            overflow-y: auto;\r
            background: white;\r
            border-radius: 15px;\r
            padding: 25px;\r
            position: relative;\r
        }\r
\r
        .close-modal {\r
            position: absolute;\r
            right: 15px;\r
            top: 10px;\r
            border: none;\r
            background: transparent;\r
            font-size: 25px;\r
            color: #555;\r
            cursor: pointer;\r
        }\r
\r
        .modal-title {\r
            color: #19803c;\r
            font-size: 21px;\r
            margin-bottom: 5px;\r
        }\r
\r
        .modal-subtitle {\r
            color: #999;\r
            font-size: 12px;\r
            margin-bottom: 20px;\r
        }\r
\r
\r
        /* =====================================================\r
           RECEIPT\r
        ===================================================== */\r
\r
        .receipt {\r
            border: 1px solid #ddd;\r
            border-radius: 10px;\r
            padding: 20px;\r
            background: white;\r
        }\r
\r
        .receipt-header {\r
            text-align: center;\r
            border-bottom: 1px dashed #bbb;\r
            padding-bottom: 15px;\r
            margin-bottom: 15px;\r
        }\r
\r
        .receipt-logo {\r
            color: #00551b;\r
            font-size: 25px;\r
            font-weight: 900;\r
        }\r
\r
        .receipt-logo span {\r
            color: #ffc400;\r
        }\r
\r
        .receipt-title {\r
            color: #777;\r
            font-size: 12px;\r
            margin-top: 4px;\r
        }\r
\r
        .receipt-row {\r
            display: flex;\r
            justify-content: space-between;\r
            gap: 15px;\r
            padding: 7px 0;\r
            font-size: 12px;\r
        }\r
\r
        .receipt-row span:first-child {\r
            color: #888;\r
        }\r
\r
        .receipt-row span:last-child {\r
            color: #222;\r
            font-weight: 600;\r
            text-align: right;\r
        }\r
\r
        .receipt-total {\r
            border-top: 1px dashed #bbb;\r
            margin-top: 10px;\r
            padding-top: 12px;\r
        }\r
\r
        .receipt-total span:last-child {\r
            color: #19803c;\r
            font-size: 17px;\r
        }\r
\r
        .receipt-note {\r
            margin-top: 15px;\r
            background: #eaf8ed;\r
            padding: 10px;\r
            border-radius: 7px;\r
            text-align: center;\r
            color: #19803c;\r
            font-size: 11px;\r
            font-weight: 600;\r
        }\r
\r
        .modal-actions {\r
            display: flex;\r
            gap: 10px;\r
            margin-top: 18px;\r
        }\r
\r
        .modal-btn {\r
            flex: 1;\r
            height: 40px;\r
            border: none;\r
            border-radius: 7px;\r
            cursor: pointer;\r
            font-size: 12px;\r
            font-weight: 600;\r
        }\r
\r
        .modal-green {\r
            background: #069b45;\r
            color: white;\r
        }\r
\r
        .modal-gray {\r
            background: #eeeeee;\r
            color: #555;\r
        }\r
\r
\r
        /* =====================================================\r
           PAYMENT FLOW\r
        ===================================================== */\r
\r
        .flow-box {\r
            margin-top: 18px;\r
            background: #f7faf8;\r
            border: 1px solid #e5ebe7;\r
            border-radius: 10px;\r
            padding: 15px;\r
        }\r
\r
        .flow-title {\r
            color: #19803c;\r
            font-size: 13px;\r
            font-weight: 700;\r
            margin-bottom: 12px;\r
        }\r
\r
        .flow-step {\r
            display: flex;\r
            align-items: center;\r
            gap: 10px;\r
            margin-bottom: 8px;\r
            font-size: 11px;\r
            color: #555;\r
        }\r
\r
        .flow-number {\r
            width: 22px;\r
            height: 22px;\r
            border-radius: 50%;\r
            background: #dff4e5;\r
            color: #19803c;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            font-weight: bold;\r
            flex-shrink: 0;\r
        }\r
\r
\r
        /* =====================================================\r
           PRINT\r
        ===================================================== */\r
\r
        @media print {\r
\r
            body * {\r
                visibility: hidden;\r
            }\r
\r
            #receiptModal,\r
            #receiptModal * {\r
                visibility: visible;\r
            }\r
\r
            #receiptModal {\r
                position: absolute;\r
                left: 0;\r
                top: 0;\r
                width: 100%;\r
                background: white;\r
            }\r
\r
            .close-modal,\r
            .modal-actions {\r
                display: none !important;\r
            }\r
\r
            .modal-content {\r
                box-shadow: none;\r
                width: 100%;\r
            }\r
\r
        }\r
\r
\r
        /* =====================================================\r
           RESPONSIVE\r
        ===================================================== */\r
\r
        @media (max-width: 1100px) {\r
\r
            .content {\r
                padding: 30px;\r
            }\r
\r
            .summary {\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
\r
            .filters {\r
                grid-template-columns: 1fr 1fr;\r
            }\r
\r
            .date-box {\r
                grid-column: 1 / 3;\r
            }\r
\r
        }\r
\r
\r
        @media (max-width: 800px) {\r
\r
            .dashboard {\r
                flex-direction: column;\r
            }\r
\r
            .sidebar {\r
                position: relative;\r
                width: 100%;\r
                height: auto;\r
                min-height: auto;\r
            }\r
\r
            .content {\r
                margin-left: 0;\r
                padding: 25px 20px;\r
            }\r
\r
            .menu {\r
                display: grid;\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
\r
            .summary {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .filters {\r
                display: flex;\r
                flex-direction: column;\r
            }\r
\r
            .date-box {\r
                width: 100%;\r
            }\r
\r
            .table-bottom {\r
                flex-direction: column;\r
                align-items: flex-start;\r
            }\r
\r
        }\r
\r
    </style>\r
</head>\r
\r
\r
<body>\r
\r
<div class="dashboard">\r
\r
\r
    <!-- =====================================================\r
         SIDEBAR\r
    ===================================================== -->\r
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
            <a href="{{ url('/payments') }}" class="active">\r
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
        </nav>\r
\r
    </aside>\r
\r
\r
\r
    <!-- =====================================================\r
         MAIN CONTENT\r
    ===================================================== -->\r
\r
    <main class="content">\r
\r
\r
        <div class="page-header">\r
\r
            <h1 class="page-title">\r
                Payments\r
            </h1>\r
\r
            <p class="page-subtitle">\r
                Manage customer payments and payment status\r
            </p>\r
\r
        </div>\r
\r
\r
\r
        <!-- =====================================================\r
             SUMMARY\r
        ===================================================== -->\r
\r
        <div class="summary">\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    ₱\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Total Payments</small>\r
                    <strong id="totalPayments">0</strong>\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    ✓\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Paid</small>\r
                    <strong id="paidCount">0</strong>\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    !\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Unpaid</small>\r
                    <strong id="unpaidCount">0</strong>\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    #\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Cancelled</small>\r
                    <strong id="cancelledCount">0</strong>\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
\r
        <!-- =====================================================\r
             FILTERS\r
        ===================================================== -->\r
\r
        <div class="filters">\r
\r
\r
            <!-- STATUS FILTER -->\r
\r
            <div class="filter-wrapper">\r
\r
                <button\r
                    type="button"\r
                    class="filter-box"\r
                    onclick="toggleFilter()"\r
                >\r
\r
                    <span id="filterText">\r
                        All Payments\r
                    </span>\r
\r
                    <span class="filter-arrow">\r
                        ▾\r
                    </span>\r
\r
                </button>\r
\r
\r
                <div\r
                    class="filter-dropdown"\r
                    id="filterDropdown"\r
                >\r
\r
                    <button\r
                        type="button"\r
                        onclick="filterPayments('all')"\r
                    >\r
                        All Payments\r
                    </button>\r
\r
                    <button\r
                        type="button"\r
                        onclick="filterPayments('unpaid')"\r
                    >\r
                        Unpaid\r
                    </button>\r
\r
                    <button\r
                        type="button"\r
                        onclick="filterPayments('paid')"\r
                    >\r
                        Paid\r
                    </button>\r
\r
                    <button\r
                        type="button"\r
                        onclick="filterPayments('cancelled')"\r
                    >\r
                        Cancelled\r
                    </button>\r
\r
                </div>\r
\r
            </div>\r
\r
\r
\r
            <!-- SEARCH -->\r
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
                    placeholder="Search payment ID, order ID, customer..."\r
                    oninput="applyFilters()"\r
                >\r
\r
            </div>\r
\r
\r
\r
            <!-- DATE -->\r
\r
            <div class="date-box">\r
\r
                <span class="calendar-icon">\r
                    ▣\r
                </span>\r
\r
                <input\r
                    type="date"\r
                    id="dateFilter"\r
                    onchange="applyFilters()"\r
                >\r
\r
            </div>\r
\r
        </div>\r
\r
\r
\r
        <!-- =====================================================\r
             TABLE\r
        ===================================================== -->\r
\r
        <div class="table-card">\r
\r
            <div class="table-wrapper">\r
\r
                <table id="paymentTable">\r
\r
                    <thead>\r
\r
                        <tr>\r
\r
                            <th>Payment ID</th>\r
\r
                            <th>Order ID</th>\r
\r
                            <th>Customer</th>\r
\r
                            <th>Amount</th>\r
\r
                            <th>Payment Method</th>\r
\r
                            <th>Status</th>\r
\r
                            <th>Date</th>\r
\r
                            <th>Actions</th>\r
\r
                        </tr>\r
\r
                    </thead>\r
\r
\r
                    <tbody id="paymentBody">\r
                    </tbody>\r
\r
                </table>\r
\r
\r
                <div\r
                    class="no-results"\r
                    id="noResults"\r
                >\r
                    No payments found.\r
                </div>\r
\r
            </div>\r
\r
\r
            <!-- TABLE BOTTOM -->\r
\r
            <div class="table-bottom">\r
\r
                <div\r
                    class="showing"\r
                    id="showingText"\r
                >\r
                    Showing 0 payments\r
                </div>\r
\r
\r
                <div\r
                    class="pagination"\r
                    id="pagination"\r
                >\r
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
\r
<!-- =====================================================\r
     PAYMENT DETAILS MODAL\r
===================================================== -->\r
\r
<div\r
    class="modal"\r
    id="paymentModal"\r
>\r
\r
    <div class="modal-content">\r
\r
        <button\r
            class="close-modal"\r
            onclick="closePaymentModal()"\r
        >\r
            ×\r
        </button>\r
\r
\r
        <h2 class="modal-title">\r
            Payment Details\r
        </h2>\r
\r
        <p class="modal-subtitle">\r
            Review the customer's payment information.\r
        </p>\r
\r
\r
        <div class="receipt">\r
\r
            <div class="receipt-header">\r
\r
                <div class="receipt-logo">\r
                    EL<span>EE</span>\r
                </div>\r
\r
                <div class="receipt-title">\r
                    HARDWARE\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="receipt-row">\r
                <span>Payment ID</span>\r
                <span id="detailPaymentId">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Order ID</span>\r
                <span id="detailOrderId">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Customer</span>\r
                <span id="detailCustomer">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Amount</span>\r
                <span id="detailAmount">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Payment Method</span>\r
                <span id="detailMethod">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Status</span>\r
                <span id="detailStatus">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Date</span>\r
                <span id="detailDate">-</span>\r
            </div>\r
\r
\r
            <div\r
                class="flow-box"\r
                id="flowBox"\r
            >\r
\r
                <div class="flow-title">\r
                    Payment Flow\r
                </div>\r
\r
                <div id="flowContent">\r
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
                class="modal-btn modal-gray"\r
                onclick="closePaymentModal()"\r
            >\r
                Close\r
            </button>\r
\r
            <button\r
                class="modal-btn modal-green"\r
                id="modalPayButton"\r
                onclick="markModalPaymentPaid()"\r
            >\r
                Mark as Paid\r
            </button>\r
\r
        </div>\r
\r
    </div>\r
\r
</div>\r
\r
\r
\r
<!-- =====================================================\r
     PAID RECEIPT MODAL\r
===================================================== -->\r
\r
<div\r
    class="modal"\r
    id="receiptModal"\r
>\r
\r
    <div class="modal-content">\r
\r
        <button\r
            class="close-modal"\r
            onclick="closeReceiptModal()"\r
        >\r
            ×\r
        </button>\r
\r
\r
        <h2 class="modal-title">\r
            Paid Receipt\r
        </h2>\r
\r
        <p class="modal-subtitle">\r
            Physical receipt record\r
        </p>\r
\r
\r
        <div class="receipt">\r
\r
            <div class="receipt-header">\r
\r
                <div class="receipt-logo">\r
                    EL<span>EE</span>\r
                </div>\r
\r
                <div class="receipt-title">\r
                    HARDWARE\r
                </div>\r
\r
                <div\r
                    style="\r
                        color:#19803c;\r
                        font-size:12px;\r
                        font-weight:bold;\r
                        margin-top:8px;\r
                    "\r
                >\r
                    PAID RECEIPT\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="receipt-row">\r
                <span>Payment ID</span>\r
                <span id="receiptPaymentId">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Order ID</span>\r
                <span id="receiptOrderId">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Customer</span>\r
                <span id="receiptCustomer">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Payment Method</span>\r
                <span id="receiptMethod">-</span>\r
            </div>\r
\r
            <div class="receipt-row receipt-total">\r
                <span>Total Paid</span>\r
                <span id="receiptAmount">-</span>\r
            </div>\r
\r
            <div class="receipt-row">\r
                <span>Date Paid</span>\r
                <span id="receiptDate">-</span>\r
            </div>\r
\r
\r
            <div class="receipt-note">\r
                Payment received successfully.\r
                Thank you for shopping at ELEE Hardware.\r
            </div>\r
\r
        </div>\r
\r
\r
        <div class="modal-actions">\r
\r
            <button\r
                class="modal-btn modal-gray"\r
                onclick="closeReceiptModal()"\r
            >\r
                Close\r
            </button>\r
\r
            <button\r
                class="modal-btn modal-green"\r
                onclick="window.print()"\r
            >\r
                Print Receipt\r
            </button>\r
\r
        </div>\r
\r
    </div>\r
\r
</div>\r
\r
\r
\r
<script>\r
\r
    /* =====================================================\r
       STORAGE + PAGINATION\r
    ===================================================== */\r
\r
    const PAYMENT_STORAGE_KEY = "elee_payments";\r
    const PAYMENTS_PER_PAGE = 5;\r
\r
    let payments = [];\r
    let currentFilter = "all";\r
    let currentPage = 1;\r
    let selectedPaymentId = null;\r
\r
\r
    /* =====================================================\r
       DEFAULT PAYMENT DATA\r
    ===================================================== */\r
\r
    const defaultPayments = [\r
\r
        {\r
            id: "PAY-2026-000119",\r
            orderId: "#ELEE-2026-000119",\r
            customer: "Kobe Foster",\r
            amount: "₱1,090.00",\r
            method: "Cash at Store",\r
            status: "paid",\r
            date: "2026-01-02",\r
            displayDate: "January 2, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000120",\r
            orderId: "#ELEE-2026-000120",\r
            customer: "Myka Santos",\r
            amount: "₱750.00",\r
            method: "Cash on Delivery",\r
            status: "paid",\r
            date: "2026-01-08",\r
            displayDate: "January 8, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000121",\r
            orderId: "#ELEE-2026-000121",\r
            customer: "Janna Salvador",\r
            amount: "₱2,090.00",\r
            method: "Cash at Store",\r
            status: "unpaid",\r
            date: "2026-01-17",\r
            displayDate: "January 17, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000122",\r
            orderId: "#ELEE-2026-000122",\r
            customer: "Anna Corpuz",\r
            amount: "₱3,090.00",\r
            method: "Cash at Store",\r
            status: "paid",\r
            date: "2026-01-18",\r
            displayDate: "January 18, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000123",\r
            orderId: "#ELEE-2026-000123",\r
            customer: "Bea Sanchez",\r
            amount: "₱16,090.00",\r
            method: "Cash on Delivery",\r
            status: "unpaid",\r
            date: "2026-02-02",\r
            displayDate: "February 2, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000124",\r
            orderId: "#ELEE-2026-000124",\r
            customer: "John Bautista",\r
            amount: "₱7,090.00",\r
            method: "Cash on Delivery",\r
            status: "paid",\r
            date: "2026-02-11",\r
            displayDate: "February 11, 2026"\r
        },\r
\r
        {\r
            id: "PAY-2026-000125",\r
            orderId: "#ELEE-2026-000125",\r
            customer: "Lito Navares",\r
            amount: "₱14,090.00",\r
            method: "Cash on Delivery",\r
            status: "cancelled",\r
            date: "2026-02-14",\r
            displayDate: "February 14, 2026"\r
        }\r
\r
    ];\r
\r
\r
    /* =====================================================\r
       LOAD PAYMENTS\r
    ===================================================== */\r
\r
    function loadPayments() {\r
\r
        try {\r
\r
            const savedPayments =\r
                localStorage.getItem(PAYMENT_STORAGE_KEY);\r
\r
            if (savedPayments) {\r
\r
                payments = JSON.parse(savedPayments);\r
\r
            } else {\r
\r
                payments = JSON.parse(\r
                    JSON.stringify(defaultPayments)\r
                );\r
\r
                savePayments();\r
\r
            }\r
\r
        } catch (error) {\r
\r
            console.error(\r
                "Unable to load payments:",\r
                error\r
            );\r
\r
            payments = JSON.parse(\r
                JSON.stringify(defaultPayments)\r
            );\r
\r
            savePayments();\r
\r
        }\r
\r
    }\r
\r
\r
    /* =====================================================\r
       SAVE PAYMENTS\r
    ===================================================== */\r
\r
    function savePayments() {\r
\r
        localStorage.setItem(\r
            PAYMENT_STORAGE_KEY,\r
            JSON.stringify(payments)\r
        );\r
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
            .replace(/&/g, "&amp;")\r
            .replace(/</g, "&lt;")\r
            .replace(/>/g, "&gt;")\r
            .replace(/"/g, "&quot;")\r
            .replace(/'/g, "&#039;");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       PAYMENT METHOD ICON\r
    ===================================================== */\r
\r
    function getMethodIcon(method) {\r
\r
        if (method === "Cash on Delivery") {\r
            return "▱";\r
        }\r
\r
        return "▣";\r
\r
    }\r
\r
\r
    /* =====================================================\r
       GET FILTERED PAYMENTS\r
    ===================================================== */\r
\r
    function getFilteredPayments() {\r
\r
        const search =\r
            document\r
                .getElementById("searchInput")\r
                .value\r
                .toLowerCase()\r
                .trim();\r
\r
        const date =\r
            document\r
                .getElementById("dateFilter")\r
                .value;\r
\r
        return payments.filter(function(payment) {\r
\r
            const matchesStatus =\r
                currentFilter === "all" ||\r
                payment.status === currentFilter;\r
\r
            const searchableText =\r
                (\r
                    payment.id +\r
                    " " +\r
                    payment.orderId +\r
                    " " +\r
                    payment.customer +\r
                    " " +\r
                    payment.amount +\r
                    " " +\r
                    payment.method\r
                ).toLowerCase();\r
\r
            const matchesSearch =\r
                search === "" ||\r
                searchableText.includes(search);\r
\r
            const matchesDate =\r
                date === "" ||\r
                payment.date === date;\r
\r
            return (\r
                matchesStatus &&\r
                matchesSearch &&\r
                matchesDate\r
            );\r
\r
        });\r
\r
    }\r
\r
\r
    /* =====================================================\r
       RENDER PAYMENT TABLE\r
    ===================================================== */\r
\r
    function renderPayments() {\r
\r
        const filteredPayments =\r
            getFilteredPayments();\r
\r
        const totalItems =\r
            filteredPayments.length;\r
\r
        const totalPages =\r
            Math.max(\r
                1,\r
                Math.ceil(\r
                    totalItems / PAYMENTS_PER_PAGE\r
                )\r
            );\r
\r
        if (currentPage > totalPages) {\r
            currentPage = totalPages;\r
        }\r
\r
        if (currentPage < 1) {\r
            currentPage = 1;\r
        }\r
\r
        const startIndex =\r
            (currentPage - 1) *\r
            PAYMENTS_PER_PAGE;\r
\r
        const endIndex =\r
            Math.min(\r
                startIndex + PAYMENTS_PER_PAGE,\r
                totalItems\r
            );\r
\r
        const visiblePayments =\r
            filteredPayments.slice(\r
                startIndex,\r
                endIndex\r
            );\r
\r
        const paymentBody =\r
            document.getElementById(\r
                "paymentBody"\r
            );\r
\r
        paymentBody.innerHTML = "";\r
\r
\r
        /* =====================================================\r
           NO RESULTS\r
        ===================================================== */\r
\r
        const noResults =\r
            document.getElementById(\r
                "noResults"\r
            );\r
\r
        if (totalItems === 0) {\r
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
        /* =====================================================\r
           CREATE ROWS\r
        ===================================================== */\r
\r
        visiblePayments.forEach(function(payment) {\r
\r
            const row =\r
                document.createElement("tr");\r
\r
            row.setAttribute(\r
                "data-payment-id",\r
                payment.id\r
            );\r
\r
            let statusHTML = "";\r
\r
            if (payment.status === "paid") {\r
\r
                statusHTML = \`\r
                    <span class="status paid">\r
                        Paid\r
                    </span>\r
                \`;\r
\r
            }\r
\r
            else if (payment.status === "unpaid") {\r
\r
                statusHTML = \`\r
                    <span class="status unpaid">\r
                        Unpaid\r
                    </span>\r
                \`;\r
\r
            }\r
\r
            else {\r
\r
                statusHTML = \`\r
                    <span class="status cancelled">\r
                        Cancelled\r
                    </span>\r
                \`;\r
\r
            }\r
\r
\r
            let actionHTML = \`\r
                <button\r
                    class="action-btn view-btn"\r
                    onclick="viewPayment('\${escapeHTML(payment.id)}')"\r
                >\r
                    View\r
                </button>\r
            \`;\r
\r
\r
            if (payment.status === "unpaid") {\r
\r
                actionHTML += \`\r
                    <button\r
                        class="action-btn pay-btn"\r
                        onclick="markAsPaid('\${escapeHTML(payment.id)}')"\r
                    >\r
                        Mark Paid\r
                    </button>\r
                \`;\r
\r
            }\r
\r
            else if (payment.status === "paid") {\r
\r
                actionHTML += \`\r
                    <button\r
                        class="action-btn undo-btn"\r
                        onclick="undoPaid('\${escapeHTML(payment.id)}')"\r
                    >\r
                        Undo Paid\r
                    </button>\r
                \`;\r
\r
            }\r
\r
\r
            row.innerHTML = \`\r
\r
                <td>\r
                    \${escapeHTML(payment.id)}\r
                </td>\r
\r
                <td>\r
                    \${escapeHTML(payment.orderId)}\r
                </td>\r
\r
                <td>\r
                    \${escapeHTML(payment.customer)}\r
                </td>\r
\r
                <td>\r
                    \${escapeHTML(payment.amount)}\r
                </td>\r
\r
                <td>\r
\r
                    <span class="payment-method">\r
\r
                        <span class="method-icon">\r
                            \${getMethodIcon(payment.method)}\r
                        </span>\r
\r
                        \${escapeHTML(payment.method)}\r
\r
                    </span>\r
\r
                </td>\r
\r
                <td>\r
                    \${statusHTML}\r
                </td>\r
\r
                <td>\r
                    \${escapeHTML(payment.displayDate)}\r
                </td>\r
\r
                <td>\r
\r
                    <div class="actions">\r
\r
                        \${actionHTML}\r
\r
                    </div>\r
\r
                </td>\r
\r
            \`;\r
\r
            paymentBody.appendChild(row);\r
\r
        });\r
\r
\r
        /* =====================================================\r
           SHOWING TEXT\r
        ===================================================== */\r
\r
        const showingText =\r
            document.getElementById(\r
                "showingText"\r
            );\r
\r
        if (totalItems === 0) {\r
\r
            showingText.innerText =\r
                "Showing 0 payments";\r
\r
        } else {\r
\r
            showingText.innerText =\r
                "Showing " +\r
                (startIndex + 1) +\r
                " to " +\r
                endIndex +\r
                " of " +\r
                totalItems +\r
                " payments";\r
\r
        }\r
\r
\r
        renderPagination(totalPages);\r
\r
        updateSummary();\r
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
        pagination.innerHTML = "";\r
\r
\r
        /* PREVIOUS */\r
\r
        const previous =\r
            document.createElement("button");\r
\r
        previous.type = "button";\r
        previous.className = "next";\r
        previous.innerText = "‹";\r
        previous.title = "Previous page";\r
\r
        previous.disabled =\r
            currentPage === 1;\r
\r
        previous.onclick = function() {\r
\r
            if (currentPage > 1) {\r
\r
                currentPage--;\r
\r
                renderPayments();\r
\r
            }\r
\r
        };\r
\r
        pagination.appendChild(previous);\r
\r
\r
        /* PAGE NUMBERS */\r
\r
        const pages = getPageNumbers(\r
            currentPage,\r
            totalPages\r
        );\r
\r
        pages.forEach(function(page) {\r
\r
            if (page === "...") {\r
\r
                const dots =\r
                    document.createElement("span");\r
\r
                dots.className = "page-dots";\r
                dots.innerText = "...";\r
\r
                pagination.appendChild(dots);\r
\r
                return;\r
\r
            }\r
\r
\r
            const pageButton =\r
                document.createElement("button");\r
\r
            pageButton.type = "button";\r
            pageButton.className =\r
                "page-number";\r
\r
            pageButton.innerText = page;\r
\r
\r
            if (page === currentPage) {\r
\r
                pageButton.classList.add(\r
                    "active"\r
                );\r
\r
            }\r
\r
\r
            pageButton.onclick = function() {\r
\r
                currentPage = page;\r
\r
                renderPayments();\r
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
        /* NEXT */\r
\r
        const next =\r
            document.createElement("button");\r
\r
        next.type = "button";\r
        next.className = "next";\r
        next.innerText = "›";\r
        next.title = "Next page";\r
\r
        next.disabled =\r
            currentPage === totalPages;\r
\r
        next.onclick = function() {\r
\r
            if (currentPage < totalPages) {\r
\r
                currentPage++;\r
\r
                renderPayments();\r
\r
            }\r
\r
        };\r
\r
        pagination.appendChild(next);\r
\r
    }\r
\r
\r
    /* =====================================================\r
       PAGE NUMBER GENERATOR\r
    ===================================================== */\r
\r
    function getPageNumbers(\r
        current,\r
        total\r
    ) {\r
\r
        if (total <= 7) {\r
\r
            const pages = [];\r
\r
            for (\r
                let i = 1;\r
                i <= total;\r
                i++\r
            ) {\r
\r
                pages.push(i);\r
\r
            }\r
\r
            return pages;\r
\r
        }\r
\r
\r
        const pages = [];\r
\r
\r
        pages.push(1);\r
\r
\r
        if (current > 4) {\r
\r
            pages.push("...");\r
\r
        }\r
\r
\r
        const start =\r
            Math.max(\r
                2,\r
                current - 1\r
            );\r
\r
        const end =\r
            Math.min(\r
                total - 1,\r
                current + 1\r
            );\r
\r
\r
        for (\r
            let i = start;\r
            i <= end;\r
            i++\r
        ) {\r
\r
            pages.push(i);\r
\r
        }\r
\r
\r
        if (current < total - 3) {\r
\r
            pages.push("...");\r
\r
        }\r
\r
\r
        pages.push(total);\r
\r
\r
        return pages;\r
\r
    }\r
\r
\r
    /* =====================================================\r
       TOGGLE FILTER\r
    ===================================================== */\r
\r
    function toggleFilter() {\r
\r
        document\r
            .getElementById("filterDropdown")\r
            .classList.toggle("show");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       FILTER PAYMENTS\r
    ===================================================== */\r
\r
    function filterPayments(status) {\r
\r
        currentFilter = status;\r
\r
        currentPage = 1;\r
\r
\r
        const filterText =\r
            document.getElementById(\r
                "filterText"\r
            );\r
\r
\r
        if (status === "all") {\r
\r
            filterText.innerText =\r
                "All Payments";\r
\r
        }\r
\r
        else if (status === "unpaid") {\r
\r
            filterText.innerText =\r
                "Unpaid";\r
\r
        }\r
\r
        else if (status === "paid") {\r
\r
            filterText.innerText =\r
                "Paid";\r
\r
        }\r
\r
        else if (status === "cancelled") {\r
\r
            filterText.innerText =\r
                "Cancelled";\r
\r
        }\r
\r
\r
        document\r
            .getElementById("filterDropdown")\r
            .classList.remove("show");\r
\r
\r
        renderPayments();\r
\r
    }\r
\r
\r
    /* =====================================================\r
       APPLY FILTERS\r
    ===================================================== */\r
\r
    function applyFilters() {\r
\r
        currentPage = 1;\r
\r
        renderPayments();\r
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
        let paid = 0;\r
        let unpaid = 0;\r
        let cancelled = 0;\r
\r
        payments.forEach(function(payment) {\r
\r
            if (payment.status === "paid") {\r
\r
                paid++;\r
\r
            }\r
\r
            else if (payment.status === "unpaid") {\r
\r
                unpaid++;\r
\r
            }\r
\r
            else if (payment.status === "cancelled") {\r
\r
                cancelled++;\r
\r
            }\r
\r
        });\r
\r
\r
        document.getElementById(\r
            "totalPayments"\r
        ).innerText = payments.length;\r
\r
\r
        document.getElementById(\r
            "paidCount"\r
        ).innerText = paid;\r
\r
\r
        document.getElementById(\r
            "unpaidCount"\r
        ).innerText = unpaid;\r
\r
\r
        document.getElementById(\r
            "cancelledCount"\r
        ).innerText = cancelled;\r
\r
    }\r
\r
\r
    /* =====================================================\r
       FIND PAYMENT\r
    ===================================================== */\r
\r
    function findPayment(paymentId) {\r
\r
        return payments.find(\r
            function(payment) {\r
\r
                return payment.id === paymentId;\r
\r
            }\r
        );\r
\r
    }\r
\r
\r
    /* =====================================================\r
       MARK AS PAID\r
    ===================================================== */\r
\r
    function markAsPaid(paymentId) {\r
\r
        const payment =\r
            findPayment(paymentId);\r
\r
\r
        if (!payment) {\r
            return;\r
        }\r
\r
\r
        if (payment.status !== "unpaid") {\r
            return;\r
        }\r
\r
\r
        const confirmation =\r
            confirm(\r
                "Confirm payment received from " +\r
                payment.customer +\r
                "?\\n\\n" +\r
                "Payment Method: " +\r
                payment.method +\r
                "\\n" +\r
                "Amount: " +\r
                payment.amount\r
            );\r
\r
\r
        if (!confirmation) {\r
            return;\r
        }\r
\r
\r
        payment.status = "paid";\r
\r
        savePayments();\r
\r
        renderPayments();\r
\r
\r
        alert(\r
            "Payment successfully marked as Paid.\\n\\n" +\r
            "You can use 'Undo Paid' if this was done by mistake."\r
        );\r
\r
\r
        openPaidReceipt(payment);\r
\r
    }\r
\r
\r
    /* =====================================================\r
       UNDO PAID\r
    ===================================================== */\r
\r
    function undoPaid(paymentId) {\r
\r
        const payment =\r
            findPayment(paymentId);\r
\r
\r
        if (!payment) {\r
            return;\r
        }\r
\r
\r
        if (payment.status !== "paid") {\r
            return;\r
        }\r
\r
\r
        const confirmation =\r
            confirm(\r
                "Undo the Paid status for " +\r
                payment.customer +\r
                "?\\n\\n" +\r
                "The payment will be changed back to Unpaid."\r
            );\r
\r
\r
        if (!confirmation) {\r
            return;\r
        }\r
\r
\r
        payment.status = "unpaid";\r
\r
        savePayments();\r
\r
        renderPayments();\r
\r
\r
        alert(\r
            "Payment status changed back to Unpaid."\r
        );\r
\r
    }\r
\r
\r
    /* =====================================================\r
       VIEW PAYMENT\r
    ===================================================== */\r
\r
    function viewPayment(paymentId) {\r
\r
        const payment =\r
            findPayment(paymentId);\r
\r
\r
        if (!payment) {\r
            return;\r
        }\r
\r
\r
        selectedPaymentId =\r
            payment.id;\r
\r
\r
        document.getElementById(\r
            "detailPaymentId"\r
        ).innerText =\r
            payment.id;\r
\r
\r
        document.getElementById(\r
            "detailOrderId"\r
        ).innerText =\r
            payment.orderId;\r
\r
\r
        document.getElementById(\r
            "detailCustomer"\r
        ).innerText =\r
            payment.customer;\r
\r
\r
        document.getElementById(\r
            "detailAmount"\r
        ).innerText =\r
            payment.amount;\r
\r
\r
        document.getElementById(\r
            "detailMethod"\r
        ).innerText =\r
            payment.method;\r
\r
\r
        document.getElementById(\r
            "detailStatus"\r
        ).innerText =\r
            payment.status\r
                .charAt(0)\r
                .toUpperCase() +\r
            payment.status.slice(1);\r
\r
\r
        document.getElementById(\r
            "detailDate"\r
        ).innerText =\r
            payment.displayDate;\r
\r
\r
        createPaymentFlow(\r
            payment.method,\r
            payment.status\r
        );\r
\r
\r
        const payButton =\r
            document.getElementById(\r
                "modalPayButton"\r
            );\r
\r
\r
        if (payment.status === "unpaid") {\r
\r
            payButton.style.display =\r
                "block";\r
\r
            payButton.innerText =\r
                "Mark as Paid";\r
\r
        }\r
\r
        else if (payment.status === "paid") {\r
\r
            payButton.style.display =\r
                "block";\r
\r
            payButton.innerText =\r
                "Undo Paid";\r
\r
        }\r
\r
        else {\r
\r
            payButton.style.display =\r
                "none";\r
\r
        }\r
\r
\r
        document\r
            .getElementById("paymentModal")\r
            .classList.add("show");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       PAYMENT FLOW\r
    ===================================================== */\r
\r
    function createPaymentFlow(\r
        method,\r
        status\r
    ) {\r
\r
        const flowContent =\r
            document.getElementById(\r
                "flowContent"\r
            );\r
\r
\r
        if (method === "Cash at Store") {\r
\r
            flowContent.innerHTML = \`\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">1</span>\r
                    Place Order\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">2</span>\r
                    Digital Order Receipt – Unpaid\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">3</span>\r
                    Customer Pays at Store\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">4</span>\r
                    Staff Marks Payment as Paid\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">5</span>\r
                    Physical Paid Receipt\r
                </div>\r
\r
            \`;\r
\r
        }\r
\r
        else if (method === "Cash on Delivery") {\r
\r
            flowContent.innerHTML = \`\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">1</span>\r
                    Place Order\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">2</span>\r
                    Digital Order Receipt – Unpaid\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">3</span>\r
                    Staff Prepares Order\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">4</span>\r
                    Delivery to Customer\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">5</span>\r
                    Customer Pays Cash\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">6</span>\r
                    Staff Marks as Paid / Completed\r
                </div>\r
\r
                <div class="flow-step">\r
                    <span class="flow-number">7</span>\r
                    Physical Paid Receipt\r
                </div>\r
\r
            \`;\r
\r
        }\r
\r
\r
        if (status === "paid") {\r
\r
            document.getElementById(\r
                "flowBox"\r
            ).style.borderColor =\r
                "#b8e7c2";\r
\r
        }\r
\r
        else {\r
\r
            document.getElementById(\r
                "flowBox"\r
            ).style.borderColor =\r
                "#e5ebe7";\r
\r
        }\r
\r
    }\r
\r
\r
    /* =====================================================\r
       MARK / UNDO FROM MODAL\r
    ===================================================== */\r
\r
    function markModalPaymentPaid() {\r
\r
        if (!selectedPaymentId) {\r
            return;\r
        }\r
\r
\r
        const payment =\r
            findPayment(\r
                selectedPaymentId\r
            );\r
\r
\r
        if (!payment) {\r
            return;\r
        }\r
\r
\r
        if (payment.status === "unpaid") {\r
\r
            const confirmation =\r
                confirm(\r
                    "Confirm that payment from " +\r
                    payment.customer +\r
                    " has been received?"\r
                );\r
\r
\r
            if (!confirmation) {\r
                return;\r
            }\r
\r
\r
            payment.status = "paid";\r
\r
            savePayments();\r
\r
            closePaymentModal();\r
\r
            renderPayments();\r
\r
\r
            alert(\r
                "Payment successfully marked as Paid."\r
            );\r
\r
\r
            openPaidReceipt(payment);\r
\r
        }\r
\r
        else if (payment.status === "paid") {\r
\r
            const confirmation =\r
                confirm(\r
                    "Undo the Paid status for " +\r
                    payment.customer +\r
                    "?\\n\\n" +\r
                    "The payment will be changed back to Unpaid."\r
                );\r
\r
\r
            if (!confirmation) {\r
                return;\r
            }\r
\r
\r
            payment.status = "unpaid";\r
\r
            savePayments();\r
\r
            closePaymentModal();\r
\r
            renderPayments();\r
\r
\r
            alert(\r
                "Payment status changed back to Unpaid."\r
            );\r
\r
        }\r
\r
    }\r
\r
\r
    /* =====================================================\r
       OPEN PAID RECEIPT\r
    ===================================================== */\r
\r
    function openPaidReceipt(payment) {\r
\r
        if (!payment) {\r
            return;\r
        }\r
\r
\r
        document.getElementById(\r
            "receiptPaymentId"\r
        ).innerText =\r
            payment.id;\r
\r
\r
        document.getElementById(\r
            "receiptOrderId"\r
        ).innerText =\r
            payment.orderId;\r
\r
\r
        document.getElementById(\r
            "receiptCustomer"\r
        ).innerText =\r
            payment.customer;\r
\r
\r
        document.getElementById(\r
            "receiptMethod"\r
        ).innerText =\r
            payment.method;\r
\r
\r
        document.getElementById(\r
            "receiptAmount"\r
        ).innerText =\r
            payment.amount;\r
\r
\r
        document.getElementById(\r
            "receiptDate"\r
        ).innerText =\r
            payment.displayDate;\r
\r
\r
        document\r
            .getElementById("receiptModal")\r
            .classList.add("show");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLOSE PAYMENT MODAL\r
    ===================================================== */\r
\r
    function closePaymentModal() {\r
\r
        document\r
            .getElementById("paymentModal")\r
            .classList.remove("show");\r
\r
        selectedPaymentId = null;\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLOSE RECEIPT MODAL\r
    ===================================================== */\r
\r
    function closeReceiptModal() {\r
\r
        document\r
            .getElementById("receiptModal")\r
            .classList.remove("show");\r
\r
    }\r
\r
\r
    /* =====================================================\r
       CLOSE DROPDOWN OUTSIDE\r
    ===================================================== */\r
\r
    document.addEventListener(\r
        "click",\r
        function(event) {\r
\r
            const wrapper =\r
                document.querySelector(\r
                    ".filter-wrapper"\r
                );\r
\r
\r
            if (\r
                wrapper &&\r
                !wrapper.contains(event.target)\r
            ) {\r
\r
                document\r
                    .getElementById(\r
                        "filterDropdown"\r
                    )\r
                    .classList.remove("show");\r
\r
            }\r
\r
        }\r
    );\r
\r
\r
    /* =====================================================\r
       CLOSE PAYMENT MODAL OUTSIDE\r
    ===================================================== */\r
\r
    document\r
        .getElementById("paymentModal")\r
        .addEventListener(\r
            "click",\r
            function(event) {\r
\r
                if (event.target === this) {\r
\r
                    closePaymentModal();\r
\r
                }\r
\r
            }\r
        );\r
\r
\r
    /* =====================================================\r
       CLOSE RECEIPT MODAL OUTSIDE\r
    ===================================================== */\r
\r
    document\r
        .getElementById("receiptModal")\r
        .addEventListener(\r
            "click",\r
            function(event) {\r
\r
                if (event.target === this) {\r
\r
                    closeReceiptModal();\r
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
    loadPayments();\r
\r
    renderPayments();\r
\r
<\/script>\r
\r
</body>\r
</html>`;export{n as default};
