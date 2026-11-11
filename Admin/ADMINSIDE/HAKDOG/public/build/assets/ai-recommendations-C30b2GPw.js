const r=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
    <title>AI Recommendations - ELEE Hardware</title>\r
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
            background: #f5f7f6;\r
            min-height: 100vh;\r
        }\r
\r
        .dashboard {\r
            display: flex;\r
            width: 100%;\r
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
            flex-shrink: 0;\r
            z-index: 1000;\r
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
        .menu-icon {\r
            width: 20px;\r
            text-align: center;\r
            font-size: 18px;\r
        }\r
\r
        /* ================= CONTENT ================= */\r
\r
        .content {\r
            background: #f8faf9;\r
            flex: 1;\r
            min-height: 100vh;\r
            margin-left: 235px;\r
            padding: 35px 40px;\r
            overflow-x: hidden;\r
        }\r
\r
        .page-header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: flex-start;\r
            gap: 20px;\r
            margin-bottom: 25px;\r
        }\r
\r
        .page-title {\r
            color: #19803c;\r
            font-size: 28px;\r
            font-weight: 700;\r
            margin-bottom: 5px;\r
        }\r
\r
        .page-subtitle {\r
            color: #888;\r
            font-size: 14px;\r
        }\r
\r
        .add-btn {\r
            background: #069b45;\r
            border: none;\r
            color: white;\r
            padding: 12px 18px;\r
            border-radius: 8px;\r
            cursor: pointer;\r
            font-size: 13px;\r
            font-weight: 600;\r
            transition: 0.2s;\r
        }\r
\r
        .add-btn:hover {\r
            background: #057c37;\r
        }\r
\r
        /* ================= SUMMARY ================= */\r
\r
        .summary {\r
            display: grid;\r
            grid-template-columns: repeat(3, 1fr);\r
            gap: 15px;\r
            margin-bottom: 22px;\r
        }\r
\r
        .summary-card {\r
            background: white;\r
            border: 1px solid #e5e8e6;\r
            border-radius: 12px;\r
            padding: 18px;\r
            display: flex;\r
            align-items: center;\r
            gap: 14px;\r
        }\r
\r
        .summary-icon {\r
            width: 45px;\r
            height: 45px;\r
            border-radius: 10px;\r
            background: #e7f8ec;\r
            color: #08752a;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            font-size: 21px;\r
        }\r
\r
        .summary-info small {\r
            display: block;\r
            color: #999;\r
            font-size: 12px;\r
            margin-bottom: 4px;\r
        }\r
\r
        .summary-info strong {\r
            color: #222;\r
            font-size: 20px;\r
        }\r
\r
        /* ================= SEARCH ================= */\r
\r
        .search-section {\r
            background: white;\r
            border: 1px solid #e5e8e6;\r
            border-radius: 12px;\r
            padding: 15px;\r
            margin-bottom: 20px;\r
        }\r
\r
        .search-box {\r
            position: relative;\r
        }\r
\r
        .search-box input {\r
            width: 100%;\r
            height: 42px;\r
            border: 1px solid #ddd;\r
            border-radius: 8px;\r
            padding: 0 15px 0 40px;\r
            outline: none;\r
            font-size: 13px;\r
        }\r
\r
        .search-box input:focus {\r
            border-color: #19803c;\r
        }\r
\r
        .search-icon {\r
            position: absolute;\r
            left: 14px;\r
            top: 12px;\r
            color: #999;\r
        }\r
\r
        /* ================= MAIN RECOMMENDATION ================= */\r
\r
        .recommendation-wrapper {\r
            display: flex;\r
            gap: 18px;\r
            align-items: stretch;\r
        }\r
\r
        /* ================= TRIGGER PRODUCT ================= */\r
\r
        .trigger-box {\r
            width: 220px;\r
            border: 1px solid #e2e6e3;\r
            border-radius: 13px;\r
            overflow: hidden;\r
            background: white;\r
            flex-shrink: 0;\r
        }\r
\r
        .trigger-title {\r
            height: 60px;\r
            display: flex;\r
            align-items: center;\r
            padding: 0 20px;\r
            color: #444;\r
            font-size: 15px;\r
            font-weight: 700;\r
            border-bottom: 1px solid #eeeeee;\r
        }\r
\r
        .trigger-subtitle {\r
            padding: 12px 20px;\r
            color: #999;\r
            font-size: 11px;\r
            border-bottom: 1px solid #f1f1f1;\r
        }\r
\r
        .trigger-list {\r
            display: flex;\r
            flex-direction: column;\r
            max-height: 480px;\r
            overflow-y: auto;\r
        }\r
\r
        .trigger-item {\r
            width: 100%;\r
            border: none;\r
            background: white;\r
            text-align: left;\r
            padding: 14px 16px;\r
            min-height: 55px;\r
            display: flex;\r
            align-items: center;\r
            justify-content: space-between;\r
            font-size: 13px;\r
            color: #222;\r
            border-bottom: 1px solid #f1f1f1;\r
            cursor: pointer;\r
            transition: 0.2s;\r
        }\r
\r
        .trigger-item:hover {\r
            background: #f1faee;\r
        }\r
\r
        .trigger-item.active {\r
            background: #d9f5ce;\r
            color: #08752a;\r
            font-weight: 700;\r
            border-left: 4px solid #069b45;\r
        }\r
\r
        .trigger-count {\r
            background: #e9e9e9;\r
            color: #777;\r
            border-radius: 20px;\r
            padding: 3px 8px;\r
            font-size: 10px;\r
        }\r
\r
        .trigger-item.active .trigger-count {\r
            background: #b9e9aa;\r
            color: #08752a;\r
        }\r
\r
        /* ================= RECOMMENDED ================= */\r
\r
        .recommended-box {\r
            flex: 1;\r
            border: 1px solid #e2e6e3;\r
            border-radius: 13px;\r
            padding: 22px;\r
            background: white;\r
            min-height: 500px;\r
        }\r
\r
        .recommended-header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: flex-start;\r
            gap: 15px;\r
            margin-bottom: 22px;\r
        }\r
\r
        .recommended-title {\r
            font-size: 20px;\r
            font-weight: 700;\r
            color: #111;\r
        }\r
\r
        .recommended-subtitle {\r
            color: #999;\r
            font-size: 13px;\r
            margin-top: 5px;\r
        }\r
\r
        .current-trigger {\r
            background: #e8f7ec;\r
            color: #19803c;\r
            border-radius: 20px;\r
            padding: 7px 12px;\r
            font-size: 11px;\r
            font-weight: 600;\r
            white-space: nowrap;\r
        }\r
\r
        .product-grid {\r
            display: grid;\r
            grid-template-columns: repeat(3, 1fr);\r
            gap: 16px;\r
        }\r
\r
        /* ================= PRODUCT CARD ================= */\r
\r
        .product-card {\r
            border: 1px solid #e5e5e5;\r
            border-radius: 12px;\r
            overflow: hidden;\r
            background: #fff;\r
            min-height: 300px;\r
            display: flex;\r
            flex-direction: column;\r
            transition: 0.2s;\r
        }\r
\r
        .product-card:hover {\r
            transform: translateY(-3px);\r
            box-shadow: 0 6px 18px rgba(0,0,0,0.09);\r
            border-color: #2c984d;\r
        }\r
\r
        .product-image-wrapper {\r
            position: relative;\r
            height: 145px;\r
            background: #f2f2f2;\r
            overflow: hidden;\r
        }\r
\r
        .product-image {\r
            width: 100%;\r
            height: 100%;\r
            object-fit: cover;\r
            display: block;\r
        }\r
\r
        .recommend-badge {\r
            position: absolute;\r
            top: 9px;\r
            left: 9px;\r
            background: #19803c;\r
            color: white;\r
            padding: 5px 8px;\r
            border-radius: 6px;\r
            font-size: 9px;\r
            font-weight: bold;\r
        }\r
\r
        .product-info {\r
            padding: 12px;\r
            flex: 1;\r
            display: flex;\r
            flex-direction: column;\r
        }\r
\r
        .product-name {\r
            font-size: 14px;\r
            font-weight: 700;\r
            color: #111;\r
            line-height: 1.3;\r
            margin-bottom: 6px;\r
        }\r
\r
        .product-category {\r
            font-size: 11px;\r
            color: #999;\r
            margin-bottom: 8px;\r
        }\r
\r
        .product-price {\r
            font-size: 15px;\r
            font-weight: 700;\r
            color: #19803c;\r
            margin-top: auto;\r
        }\r
\r
        .card-actions {\r
            display: flex;\r
            gap: 6px;\r
            margin-top: 10px;\r
        }\r
\r
        .card-btn {\r
            flex: 1;\r
            border: none;\r
            border-radius: 6px;\r
            padding: 8px 5px;\r
            cursor: pointer;\r
            font-size: 11px;\r
            font-weight: 600;\r
        }\r
\r
        .view-btn {\r
            background: #eef7f0;\r
            color: #19803c;\r
        }\r
\r
        .edit-btn {\r
            background: #fff5d8;\r
            color: #9a7100;\r
        }\r
\r
        .delete-btn {\r
            background: #ffe9e9;\r
            color: #c62828;\r
        }\r
\r
        .card-btn:hover {\r
            opacity: 0.8;\r
        }\r
\r
        /* ================= EMPTY ================= */\r
\r
        .empty-state {\r
            display: none;\r
            text-align: center;\r
            padding: 60px 20px;\r
            color: #999;\r
        }\r
\r
        .empty-state .empty-icon {\r
            font-size: 45px;\r
            margin-bottom: 12px;\r
        }\r
\r
        .empty-state h3 {\r
            color: #555;\r
            margin-bottom: 5px;\r
        }\r
\r
        /* ================= INFO ================= */\r
\r
        .info-box {\r
            margin-top: 22px;\r
            background: #c9f0d5;\r
            border-radius: 13px;\r
            min-height: 70px;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            text-align: center;\r
            padding: 15px 20px;\r
        }\r
\r
        .info-box p {\r
            color: #258642;\r
            font-size: 13px;\r
            font-weight: 600;\r
        }\r
\r
        /* ================= MODAL ================= */\r
\r
        .modal {\r
            display: none;\r
            position: fixed;\r
            inset: 0;\r
            background: rgba(0,0,0,0.55);\r
            justify-content: center;\r
            align-items: center;\r
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
        .modal-header {\r
            margin-bottom: 20px;\r
        }\r
\r
        .modal-header h2 {\r
            color: #19803c;\r
            font-size: 21px;\r
            margin-bottom: 5px;\r
        }\r
\r
        .modal-header p {\r
            color: #999;\r
            font-size: 12px;\r
        }\r
\r
        .close-modal {\r
            position: absolute;\r
            top: 12px;\r
            right: 15px;\r
            border: none;\r
            background: transparent;\r
            font-size: 25px;\r
            cursor: pointer;\r
            color: #555;\r
        }\r
\r
        .form-group {\r
            margin-bottom: 14px;\r
        }\r
\r
        .form-group label {\r
            display: block;\r
            color: #444;\r
            font-size: 12px;\r
            font-weight: 600;\r
            margin-bottom: 6px;\r
        }\r
\r
        .form-group input,\r
        .form-group select {\r
            width: 100%;\r
            height: 40px;\r
            border: 1px solid #ddd;\r
            border-radius: 7px;\r
            padding: 0 11px;\r
            outline: none;\r
            font-size: 13px;\r
        }\r
\r
        .form-group input:focus,\r
        .form-group select:focus {\r
            border-color: #19803c;\r
        }\r
\r
        .image-preview {\r
            width: 100%;\r
            height: 150px;\r
            border: 1px dashed #ccc;\r
            border-radius: 9px;\r
            margin-top: 8px;\r
            overflow: hidden;\r
            background: #f5f5f5;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            color: #999;\r
            font-size: 12px;\r
        }\r
\r
        .image-preview img {\r
            width: 100%;\r
            height: 100%;\r
            object-fit: cover;\r
        }\r
\r
        .modal-actions {\r
            display: flex;\r
            gap: 10px;\r
            margin-top: 20px;\r
        }\r
\r
        .save-btn,\r
        .cancel-btn {\r
            flex: 1;\r
            height: 42px;\r
            border: none;\r
            border-radius: 7px;\r
            cursor: pointer;\r
            font-size: 13px;\r
            font-weight: 600;\r
        }\r
\r
        .save-btn {\r
            background: #069b45;\r
            color: white;\r
        }\r
\r
        .cancel-btn {\r
            background: #eeeeee;\r
            color: #555;\r
        }\r
\r
        /* ================= PRODUCT DETAILS MODAL ================= */\r
\r
        .details-modal-content {\r
            width: 420px;\r
            text-align: center;\r
        }\r
\r
        .details-modal-content img {\r
            width: 100%;\r
            height: 230px;\r
            object-fit: cover;\r
            border-radius: 10px;\r
            margin-bottom: 15px;\r
        }\r
\r
        .details-modal-content h2 {\r
            color: #111;\r
            margin-bottom: 7px;\r
        }\r
\r
        .details-modal-content p {\r
            color: #777;\r
            margin-bottom: 8px;\r
            font-size: 13px;\r
        }\r
\r
        .modal-price {\r
            font-size: 21px;\r
            font-weight: bold;\r
            color: #19803c;\r
            margin-bottom: 15px;\r
        }\r
\r
        .relation-label {\r
            display: inline-block;\r
            background: #e7f8ec;\r
            color: #19803c;\r
            padding: 6px 10px;\r
            border-radius: 20px;\r
            font-size: 11px;\r
            font-weight: 600;\r
        }\r
\r
        /* ================= RESPONSIVE ================= */\r
\r
        @media (max-width: 1100px) {\r
            .product-grid {\r
                grid-template-columns: repeat(2, 1fr);\r
            }\r
\r
            .summary {\r
                grid-template-columns: repeat(3, 1fr);\r
            }\r
        }\r
\r
        @media (max-width: 850px) {\r
            .sidebar {\r
                width: 190px;\r
            }\r
\r
            .content {\r
                margin-left: 190px;\r
                padding: 30px 20px;\r
            }\r
\r
            .recommendation-wrapper {\r
                flex-direction: column;\r
            }\r
\r
            .trigger-box {\r
                width: 100%;\r
            }\r
\r
            .trigger-list {\r
                max-height: 250px;\r
            }\r
\r
            .trigger-item {\r
                min-height: 48px;\r
            }\r
        }\r
\r
        @media (max-width: 650px) {\r
            .dashboard {\r
                flex-direction: column;\r
            }\r
\r
            .sidebar {\r
                display: none;\r
            }\r
\r
            .content {\r
                margin-left: 0;\r
            }\r
\r
            .page-header {\r
                flex-direction: column;\r
            }\r
\r
            .add-btn {\r
                width: 100%;\r
            }\r
\r
            .summary {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .product-grid {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .recommended-header {\r
                flex-direction: column;\r
            }\r
        }\r
    </style>\r
</head>\r
\r
<body>\r
\r
<div class="dashboard">\r
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
                <span class="menu-icon">☼</span>\r
                Dashboard\r
            </a>\r
\r
            <a href="{{ url('/orders') }}">\r
                <span class="menu-icon">▣</span>\r
                Orders\r
            </a>\r
\r
            <a href="{{ url('/products') }}">\r
                <span class="menu-icon">◇</span>\r
                Products\r
            </a>\r
\r
            <a href="{{ url('/ai-recommendations') }}" class="active">\r
                <span class="menu-icon">↗</span>\r
                AI Recommendations\r
            </a>\r
\r
            <a href="{{ url('/payments') }}">\r
                <span class="menu-icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 5.5v-.75A1.75 1.75 0 0 1 8.75 3h8.5"/><path d="M16 13h4.5"/><circle cx="16" cy="13" r=".55"/></svg></span>\r
                Payments\r
            </a>\r
\r
            <a href="{{ url('/customers') }}">\r
                <span class="menu-icon">♙</span>\r
                Customers\r
            </a>\r
\r
            <a href="{{ url('/queuing') }}">\r
                <span class="menu-icon">▱</span>\r
                Queuing\r
            </a>\r
\r
            <a href="{{ url('/receipt-records') }}">\r
                <span class="menu-icon">▤</span>\r
                Receipt Records\r
            </a>\r
\r
            <a href="{{ url('/settings') }}">\r
                <span class="menu-icon">⚙</span>\r
                Settings\r
            </a>\r
\r
        </nav>\r
    </aside>\r
\r
\r
    <!-- ================= MAIN CONTENT ================= -->\r
\r
    <main class="content">\r
\r
        <div class="page-header">\r
\r
            <div>\r
                <h1 class="page-title">\r
                    AI Recommendations\r
                </h1>\r
\r
                <p class="page-subtitle">\r
                    Manage related products used for AI-assisted product recommendations\r
                </p>\r
            </div>\r
\r
            <button class="add-btn" onclick="openAddModal()">\r
                + Add Recommendation\r
            </button>\r
\r
        </div>\r
\r
\r
        <!-- ================= SUMMARY ================= -->\r
\r
        <div class="summary">\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    ♧\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Trigger Products</small>\r
                    <strong id="triggerCount">0</strong>\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="summary-card">\r
\r
                <div class="summary-icon">\r
                    ◈\r
                </div>\r
\r
                <div class="summary-info">\r
                    <small>Recommended Products</small>\r
                    <strong id="recommendationCount">0</strong>\r
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
                    <small>Recommendation Links</small>\r
                    <strong id="linkCount">0</strong>\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= SEARCH ================= -->\r
\r
        <div class="search-section">\r
\r
            <div class="search-box">\r
\r
                <span class="search-icon">⌕</span>\r
\r
                <input\r
                    type="text"\r
                    id="searchInput"\r
                    placeholder="Search trigger or recommended product..."\r
                    oninput="searchRecommendations()"\r
                >\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= RECOMMENDATION AREA ================= -->\r
\r
        <div class="recommendation-wrapper">\r
\r
            <div class="trigger-box">\r
\r
                <div class="trigger-title">\r
                    Trigger Products\r
                </div>\r
\r
                <div class="trigger-subtitle">\r
                    Select a product to see its related recommendations.\r
                </div>\r
\r
                <div class="trigger-list" id="triggerList">\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="recommended-box">\r
\r
                <div class="recommended-header">\r
\r
                    <div>\r
\r
                        <h2 class="recommended-title">\r
                            Recommended Products\r
                        </h2>\r
\r
                        <p class="recommended-subtitle" id="recommendationText">\r
                            Products that will be suggested when the selected item is added to cart.\r
                        </p>\r
\r
                    </div>\r
\r
                    <div class="current-trigger" id="currentTrigger">\r
                        No trigger selected\r
                    </div>\r
\r
                </div>\r
\r
\r
                <div class="product-grid" id="productGrid">\r
                </div>\r
\r
\r
                <div class="empty-state" id="emptyState">\r
\r
                    <div class="empty-icon">\r
                        ♧\r
                    </div>\r
\r
                    <h3>\r
                        No Recommendations Yet\r
                    </h3>\r
\r
                    <p>\r
                        Add related products for this trigger product.\r
                    </p>\r
\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
\r
        <!-- ================= INFO ================= -->\r
\r
        <div class="info-box">\r
\r
            <p>\r
                AI recommendations help customers discover related products based on the item they are viewing or adding to their cart.\r
            </p>\r
\r
        </div>\r
\r
    </main>\r
\r
</div>\r
\r
\r
\r
<!-- ================= ADD / EDIT MODAL ================= -->\r
\r
<div class="modal" id="recommendationModal">\r
\r
    <div class="modal-content">\r
\r
        <button class="close-modal" onclick="closeRecommendationModal()">\r
            ×\r
        </button>\r
\r
        <div class="modal-header">\r
\r
            <h2 id="formTitle">\r
                Add Recommendation\r
            </h2>\r
\r
            <p>\r
                Add a related product that can be suggested to customers.\r
            </p>\r
\r
        </div>\r
\r
\r
        <form id="recommendationForm">\r
\r
            <div class="form-group">\r
\r
                <label>\r
                    Trigger Product\r
                </label>\r
\r
                <select id="triggerProduct" required>\r
                </select>\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>\r
                    Recommended Product Name\r
                </label>\r
\r
                <input\r
                    type="text"\r
                    id="recommendedName"\r
                    placeholder="Example: Sand (1 cu.ft)"\r
                    required\r
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
                <input\r
                    type="text"\r
                    id="recommendedCategory"\r
                    placeholder="Example: Construction Materials"\r
                    required\r
                >\r
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
                    id="recommendedPrice"\r
                    placeholder="0.00"\r
                    min="0"\r
                    step="0.01"\r
                    required\r
                >\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>\r
                    Product Image\r
                </label>\r
\r
                <input\r
                    type="file"\r
                    id="recommendedImage"\r
                    accept="image/*"\r
                    onchange="previewImage(event)"\r
                >\r
\r
                <div class="image-preview" id="imagePreview">\r
                    No image selected\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="modal-actions">\r
\r
                <button\r
                    type="button"\r
                    class="cancel-btn"\r
                    onclick="closeRecommendationModal()"\r
                >\r
                    Cancel\r
                </button>\r
\r
                <button\r
                    type="submit"\r
                    class="save-btn"\r
                >\r
                    Save Recommendation\r
                </button>\r
\r
            </div>\r
\r
        </form>\r
\r
    </div>\r
\r
</div>\r
\r
\r
\r
<!-- ================= PRODUCT DETAILS MODAL ================= -->\r
\r
<div class="modal" id="productModal">\r
\r
    <div class="modal-content details-modal-content">\r
\r
        <button class="close-modal" onclick="closeProductModal()">\r
            ×\r
        </button>\r
\r
        <img id="modalImage" src="" alt="Product">\r
\r
        <h2 id="modalName">\r
            Product\r
        </h2>\r
\r
        <p id="modalCategory">\r
            Category\r
        </p>\r
\r
        <div class="modal-price" id="modalPrice">\r
            ₱0.00\r
        </div>\r
\r
        <span class="relation-label">\r
            AI Recommended Product\r
        </span>\r
\r
    </div>\r
\r
</div>\r
\r
\r
\r
<script>\r
\r
    const defaultData = [\r
        {\r
            id: 1,\r
            trigger: "Cement (40kg)",\r
            name: "Sand (1 cu.ft)",\r
            category: "Construction Materials",\r
            price: 70,\r
            image: "https://placehold.co/600x400?text=Sand"\r
        },\r
\r
        {\r
            id: 2,\r
            trigger: "Cement (40kg)",\r
            name: "Gravel (1 cu.ft)",\r
            category: "Construction Materials",\r
            price: 80,\r
            image: "https://placehold.co/600x400?text=Gravel"\r
        },\r
\r
        {\r
            id: 3,\r
            trigger: "Cement (40kg)",\r
            name: "Concrete Mix (1kg)",\r
            category: "Construction Materials",\r
            price: 100,\r
            image: "https://placehold.co/600x400?text=Concrete+Mix"\r
        },\r
\r
        {\r
            id: 4,\r
            trigger: "01 Sheet 0.3 mm",\r
            name: "Steel Bar 10mm",\r
            category: "Building Materials",\r
            price: 150,\r
            image: "https://placehold.co/600x400?text=Steel+Bar"\r
        },\r
\r
        {\r
            id: 5,\r
            trigger: "01 Sheet 0.3 mm",\r
            name: "Roofing Screw",\r
            category: "Hardware",\r
            price: 95,\r
            image: "https://placehold.co/600x400?text=Roofing+Screw"\r
        },\r
\r
        {\r
            id: 6,\r
            trigger: 'Hollow Block 4"',\r
            name: "Cement (40kg)",\r
            category: "Construction Materials",\r
            price: 285,\r
            image: "https://placehold.co/600x400?text=Cement"\r
        },\r
\r
        {\r
            id: 7,\r
            trigger: 'Hollow Block 4"',\r
            name: "Sand (1 cu.ft)",\r
            category: "Construction Materials",\r
            price: 70,\r
            image: "https://placehold.co/600x400?text=Sand"\r
        },\r
\r
        {\r
            id: 8,\r
            trigger: "Paint (1L)",\r
            name: "Paint Brush 2 inch",\r
            category: "Painting Supplies",\r
            price: 85,\r
            image: "https://placehold.co/600x400?text=Paint+Brush"\r
        },\r
\r
        {\r
            id: 9,\r
            trigger: "Paint (1L)",\r
            name: "Paint Roller",\r
            category: "Painting Supplies",\r
            price: 120,\r
            image: "https://placehold.co/600x400?text=Paint+Roller"\r
        },\r
\r
        {\r
            id: 10,\r
            trigger: "Steel Bar 10mm",\r
            name: "Tie Wire",\r
            category: "Construction Materials",\r
            price: 110,\r
            image: "https://placehold.co/600x400?text=Tie+Wire"\r
        }\r
    ];\r
\r
    let recommendations =\r
        JSON.parse(localStorage.getItem("eleeRecommendations")) ||\r
        defaultData;\r
\r
    let selectedTrigger = "";\r
    let editingId = null;\r
\r
    function saveData() {\r
        localStorage.setItem(\r
            "eleeRecommendations",\r
            JSON.stringify(recommendations)\r
        );\r
    }\r
\r
    function getTriggers() {\r
        return [...new Set(\r
            recommendations.map(item => item.trigger)\r
        )];\r
    }\r
\r
    function renderTriggers() {\r
\r
        const triggerList =\r
            document.getElementById("triggerList");\r
\r
        triggerList.innerHTML = "";\r
\r
        const triggers = getTriggers();\r
\r
        document.getElementById("triggerCount").innerText =\r
            triggers.length;\r
\r
        if (triggers.length === 0) {\r
\r
            triggerList.innerHTML = \`\r
                <div style="\r
                    padding:25px;\r
                    text-align:center;\r
                    color:#999;\r
                    font-size:12px;\r
                ">\r
                    No trigger products.\r
                </div>\r
            \`;\r
\r
            return;\r
        }\r
\r
        if (!selectedTrigger ||\r
            !triggers.includes(selectedTrigger)) {\r
\r
            selectedTrigger = triggers[0];\r
        }\r
\r
        triggers.forEach(trigger => {\r
\r
            const count =\r
                recommendations.filter(\r
                    item => item.trigger === trigger\r
                ).length;\r
\r
            const button =\r
                document.createElement("button");\r
\r
            button.className =\r
                "trigger-item " +\r
                (trigger === selectedTrigger ? "active" : "");\r
\r
            button.innerHTML = \`\r
                <span>\${escapeHtml(trigger)}</span>\r
\r
                <span class="trigger-count">\r
                    \${count}\r
                </span>\r
            \`;\r
\r
            button.onclick = function() {\r
                selectTrigger(trigger);\r
            };\r
\r
            triggerList.appendChild(button);\r
\r
        });\r
\r
    }\r
\r
    function selectTrigger(trigger) {\r
\r
        selectedTrigger = trigger;\r
\r
        document.getElementById("currentTrigger").innerText =\r
            trigger;\r
\r
        document.getElementById("recommendationText").innerText =\r
            "Products recommended when " +\r
            trigger +\r
            " is added to cart.";\r
\r
        renderTriggers();\r
        renderRecommendations();\r
    }\r
\r
    function renderRecommendations(searchTerm = "") {\r
\r
        const grid =\r
            document.getElementById("productGrid");\r
\r
        const emptyState =\r
            document.getElementById("emptyState");\r
\r
        grid.innerHTML = "";\r
\r
        let items =\r
            recommendations.filter(\r
                item => item.trigger === selectedTrigger\r
            );\r
\r
        if (searchTerm.trim() !== "") {\r
\r
            const search =\r
                searchTerm.toLowerCase();\r
\r
            items = recommendations.filter(item =>\r
\r
                item.trigger.toLowerCase().includes(search) ||\r
\r
                item.name.toLowerCase().includes(search) ||\r
\r
                item.category.toLowerCase().includes(search)\r
\r
            );\r
        }\r
\r
        if (items.length === 0) {\r
            emptyState.style.display = "block";\r
        } else {\r
            emptyState.style.display = "none";\r
        }\r
\r
        items.forEach(item => {\r
\r
            const card =\r
                document.createElement("div");\r
\r
            card.className = "product-card";\r
\r
            card.innerHTML = \`\r
\r
                <div class="product-image-wrapper">\r
\r
                    <img\r
                        src="\${escapeAttribute(item.image)}"\r
                        class="product-image"\r
                        alt="\${escapeAttribute(item.name)}"\r
                        onerror="this.src='https://placehold.co/600x400?text=No+Image'"\r
                    >\r
\r
                    <span class="recommend-badge">\r
                        AI Recommended\r
                    </span>\r
\r
                </div>\r
\r
                <div class="product-info">\r
\r
                    <div class="product-name">\r
                        \${escapeHtml(item.name)}\r
                    </div>\r
\r
                    <div class="product-category">\r
                        \${escapeHtml(item.category)}\r
                    </div>\r
\r
                    <div class="product-price">\r
                        ₱\${Number(item.price).toLocaleString(\r
                            "en-PH",\r
                            {\r
                                minimumFractionDigits: 2\r
                            }\r
                        )}\r
                    </div>\r
\r
                    <div class="card-actions">\r
\r
                        <button\r
                            class="card-btn view-btn"\r
                            onclick="showProduct(\${item.id})"\r
                        >\r
                            View\r
                        </button>\r
\r
                        <button\r
                            class="card-btn edit-btn"\r
                            onclick="editRecommendation(\${item.id})"\r
                        >\r
                            Edit\r
                        </button>\r
\r
                        <button\r
                            class="card-btn delete-btn"\r
                            onclick="deleteRecommendation(\${item.id})"\r
                        >\r
                            Delete\r
                        </button>\r
\r
                    </div>\r
\r
                </div>\r
\r
            \`;\r
\r
            grid.appendChild(card);\r
\r
        });\r
\r
    }\r
\r
    function searchRecommendations() {\r
\r
        const search =\r
            document.getElementById("searchInput").value;\r
\r
        renderRecommendations(search);\r
    }\r
\r
    function openAddModal() {\r
\r
        editingId = null;\r
\r
        document.getElementById("formTitle").innerText =\r
            "Add Recommendation";\r
\r
        document.getElementById("recommendationForm").reset();\r
\r
        document.getElementById("imagePreview").innerHTML =\r
            "No image selected";\r
\r
        populateTriggerSelect();\r
\r
        document.getElementById("triggerProduct").value =\r
            selectedTrigger;\r
\r
        document\r
            .getElementById("recommendationModal")\r
            .classList.add("show");\r
    }\r
\r
    function populateTriggerSelect() {\r
\r
        const select =\r
            document.getElementById("triggerProduct");\r
\r
        select.innerHTML = "";\r
\r
        const triggers = getTriggers();\r
\r
        triggers.forEach(trigger => {\r
\r
            const option =\r
                document.createElement("option");\r
\r
            option.value = trigger;\r
            option.textContent = trigger;\r
\r
            select.appendChild(option);\r
\r
        });\r
    }\r
\r
    function editRecommendation(id) {\r
\r
        const item =\r
            recommendations.find(\r
                product => product.id === id\r
            );\r
\r
        if (!item) return;\r
\r
        editingId = id;\r
\r
        document.getElementById("formTitle").innerText =\r
            "Edit Recommendation";\r
\r
        populateTriggerSelect();\r
\r
        document.getElementById("triggerProduct").value =\r
            item.trigger;\r
\r
        document.getElementById("recommendedName").value =\r
            item.name;\r
\r
        document.getElementById("recommendedCategory").value =\r
            item.category;\r
\r
        document.getElementById("recommendedPrice").value =\r
            item.price;\r
\r
        document.getElementById("imagePreview").innerHTML = \`\r
\r
            <img\r
                src="\${escapeAttribute(item.image)}"\r
                alt="Preview"\r
                onerror="this.src='https://placehold.co/600x400?text=No+Image'"\r
            >\r
\r
        \`;\r
\r
        document\r
            .getElementById("recommendationModal")\r
            .classList.add("show");\r
    }\r
\r
    function previewImage(event) {\r
\r
        const file =\r
            event.target.files[0];\r
\r
        if (!file) return;\r
\r
        const reader =\r
            new FileReader();\r
\r
        reader.onload = function(e) {\r
\r
            document.getElementById(\r
                "imagePreview"\r
            ).innerHTML = \`\r
\r
                <img\r
                    src="\${e.target.result}"\r
                    alt="Preview"\r
                >\r
\r
            \`;\r
        };\r
\r
        reader.readAsDataURL(file);\r
    }\r
\r
    document\r
        .getElementById("recommendationForm")\r
        .addEventListener("submit", function(event) {\r
\r
            event.preventDefault();\r
\r
            const trigger =\r
                document.getElementById(\r
                    "triggerProduct"\r
                ).value;\r
\r
            const name =\r
                document.getElementById(\r
                    "recommendedName"\r
                ).value.trim();\r
\r
            const category =\r
                document.getElementById(\r
                    "recommendedCategory"\r
                ).value.trim();\r
\r
            const price =\r
                parseFloat(\r
                    document.getElementById(\r
                        "recommendedPrice"\r
                    ).value\r
                );\r
\r
            const imageInput =\r
                document.getElementById(\r
                    "recommendedImage"\r
                );\r
\r
            if (\r
                !trigger ||\r
                !name ||\r
                !category ||\r
                isNaN(price)\r
            ) {\r
\r
                alert(\r
                    "Please complete all required fields."\r
                );\r
\r
                return;\r
            }\r
\r
            function saveRecommendation(image) {\r
\r
                if (editingId !== null) {\r
\r
                    const index =\r
                        recommendations.findIndex(\r
                            item => item.id === editingId\r
                        );\r
\r
                    if (index !== -1) {\r
\r
                        recommendations[index] = {\r
\r
                            ...recommendations[index],\r
\r
                            trigger: trigger,\r
                            name: name,\r
                            category: category,\r
                            price: price,\r
\r
                            image: image ||\r
                                recommendations[index].image\r
                        };\r
                    }\r
\r
                } else {\r
\r
                    recommendations.push({\r
\r
                        id: Date.now(),\r
\r
                        trigger: trigger,\r
                        name: name,\r
                        category: category,\r
                        price: price,\r
\r
                        image: image ||\r
                            "https://placehold.co/600x400?text=" +\r
                            encodeURIComponent(name)\r
\r
                    });\r
                }\r
\r
                saveData();\r
\r
                selectedTrigger = trigger;\r
\r
                renderTriggers();\r
                renderRecommendations();\r
                updateSummary();\r
\r
                closeRecommendationModal();\r
\r
                alert(\r
                    editingId !== null\r
                        ? "Recommendation updated successfully!"\r
                        : "Recommendation added successfully!"\r
                );\r
            }\r
\r
            if (imageInput.files.length > 0) {\r
\r
                const reader =\r
                    new FileReader();\r
\r
                reader.onload = function(e) {\r
\r
                    saveRecommendation(\r
                        e.target.result\r
                    );\r
                };\r
\r
                reader.readAsDataURL(\r
                    imageInput.files[0]\r
                );\r
\r
            } else {\r
\r
                saveRecommendation("");\r
            }\r
\r
        });\r
\r
    function deleteRecommendation(id) {\r
\r
        const item =\r
            recommendations.find(\r
                product => product.id === id\r
            );\r
\r
        if (!item) return;\r
\r
        const confirmDelete =\r
            confirm(\r
                "Delete recommendation for " +\r
                item.name +\r
                "?"\r
            );\r
\r
        if (!confirmDelete) return;\r
\r
        recommendations =\r
            recommendations.filter(\r
                product => product.id !== id\r
            );\r
\r
        saveData();\r
\r
        const triggers = getTriggers();\r
\r
        if (!triggers.includes(selectedTrigger)) {\r
\r
            selectedTrigger =\r
                triggers.length > 0\r
                    ? triggers[0]\r
                    : "";\r
        }\r
\r
        renderTriggers();\r
        renderRecommendations();\r
        updateSummary();\r
    }\r
\r
    function showProduct(id) {\r
\r
        const item =\r
            recommendations.find(\r
                product => product.id === id\r
            );\r
\r
        if (!item) return;\r
\r
        document.getElementById("modalName").innerText =\r
            item.name;\r
\r
        document.getElementById("modalCategory").innerText =\r
            item.category;\r
\r
        document.getElementById("modalPrice").innerText =\r
            "₱" +\r
            Number(item.price).toLocaleString(\r
                "en-PH",\r
                {\r
                    minimumFractionDigits: 2\r
                }\r
            );\r
\r
        document.getElementById("modalImage").src =\r
            item.image;\r
\r
        document\r
            .getElementById("productModal")\r
            .classList.add("show");\r
    }\r
\r
    function closeRecommendationModal() {\r
\r
        document\r
            .getElementById("recommendationModal")\r
            .classList.remove("show");\r
    }\r
\r
    function closeProductModal() {\r
\r
        document\r
            .getElementById("productModal")\r
            .classList.remove("show");\r
    }\r
\r
    document\r
        .getElementById("recommendationModal")\r
        .addEventListener("click", function(event) {\r
\r
            if (event.target === this) {\r
                closeRecommendationModal();\r
            }\r
\r
        });\r
\r
    document\r
        .getElementById("productModal")\r
        .addEventListener("click", function(event) {\r
\r
            if (event.target === this) {\r
                closeProductModal();\r
            }\r
\r
        });\r
\r
    function updateSummary() {\r
\r
        const triggers =\r
            getTriggers();\r
\r
        document.getElementById("triggerCount").innerText =\r
            triggers.length;\r
\r
        document.getElementById("recommendationCount").innerText =\r
            recommendations.length;\r
\r
        document.getElementById("linkCount").innerText =\r
            recommendations.length;\r
    }\r
\r
    function escapeHtml(value) {\r
\r
        return String(value)\r
            .replace(/&/g, "&amp;")\r
            .replace(/</g, "&lt;")\r
            .replace(/>/g, "&gt;")\r
            .replace(/"/g, "&quot;")\r
            .replace(/'/g, "&#039;");\r
    }\r
\r
    function escapeAttribute(value) {\r
\r
        return escapeHtml(value);\r
    }\r
\r
    function initializePage() {\r
\r
        const triggers = getTriggers();\r
\r
        if (triggers.length > 0) {\r
            selectedTrigger = triggers[0];\r
        }\r
\r
        renderTriggers();\r
        renderRecommendations();\r
        updateSummary();\r
    }\r
\r
    initializePage();\r
\r
<\/script>\r
\r
</body>\r
</html>`;export{r as default};
