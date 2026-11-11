const n=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
    <title>Settings - ELEE Hardware</title>\r
\r
    <style>\r
        * {\r
            margin: 0;\r
            padding: 0;\r
            box-sizing: border-box;\r
        }\r
\r
        body {\r
            font-family: Arial, sans-serif;\r
            background: #f5f7f5;\r
            color: #333;\r
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
            padding: 38px 45px;\r
            min-height: 100vh;\r
        }\r
\r
        .page-title {\r
            font-size: 30px;\r
            font-weight: bold;\r
            color: #075b21;\r
            margin-bottom: 6px;\r
        }\r
\r
        .page-subtitle {\r
            color: #777;\r
            margin-bottom: 28px;\r
        }\r
\r
        /* ================= TABS ================= */\r
\r
        .setting-tabs {\r
            display: flex;\r
            gap: 9px;\r
            flex-wrap: wrap;\r
            margin-bottom: 22px;\r
        }\r
\r
        .setting-tab {\r
            border: 1px solid #e0e0e0;\r
            background: white;\r
            color: #555;\r
            padding: 11px 17px;\r
            border-radius: 8px;\r
            cursor: pointer;\r
            font-size: 13px;\r
            transition: .2s;\r
        }\r
\r
        .setting-tab:hover {\r
            background: #e9f7ec;\r
            color: #087f23;\r
        }\r
\r
        .setting-tab.active {\r
            background: #087f23;\r
            border-color: #087f23;\r
            color: white;\r
        }\r
\r
        /* ================= CONTENT ================= */\r
\r
        .tab-content {\r
            display: none;\r
            background: white;\r
            padding: 28px;\r
            border-radius: 12px;\r
            box-shadow: 0 2px 8px rgba(0,0,0,.07);\r
            max-width: 900px;\r
        }\r
\r
        .tab-content.active {\r
            display: block;\r
        }\r
\r
        .section-header {\r
            margin-bottom: 24px;\r
            padding-bottom: 16px;\r
            border-bottom: 1px solid #eee;\r
        }\r
\r
        .section-title {\r
            font-size: 21px;\r
            font-weight: bold;\r
            color: #222;\r
            margin-bottom: 5px;\r
        }\r
\r
        .section-description {\r
            color: #888;\r
            font-size: 13px;\r
        }\r
\r
        /* ================= FORM ================= */\r
\r
        .form-grid {\r
            display: grid;\r
            grid-template-columns: 1fr 1fr;\r
            gap: 18px;\r
        }\r
\r
        .full-width {\r
            grid-column: 1 / -1;\r
        }\r
\r
        .form-group {\r
            margin-bottom: 4px;\r
        }\r
\r
        .form-group label {\r
            display: block;\r
            margin-bottom: 7px;\r
            font-size: 13px;\r
            font-weight: bold;\r
            color: #444;\r
        }\r
\r
        .form-group input,\r
        .form-group select,\r
        .form-group textarea {\r
            width: 100%;\r
            padding: 11px 12px;\r
            border: 1px solid #d5d5d5;\r
            border-radius: 7px;\r
            font-size: 14px;\r
            outline: none;\r
            background: white;\r
            transition: .2s;\r
        }\r
\r
        .form-group input:focus,\r
        .form-group select:focus,\r
        .form-group textarea:focus {\r
            border-color: #087f23;\r
            box-shadow: 0 0 0 2px rgba(8,127,35,.08);\r
        }\r
\r
        .form-group textarea {\r
            min-height: 95px;\r
            resize: vertical;\r
        }\r
\r
        .hint {\r
            font-size: 11px;\r
            color: #888;\r
            margin-top: 5px;\r
        }\r
\r
        /* ================= INFO BOX ================= */\r
\r
        .info-box {\r
            padding: 15px 17px;\r
            background: #f1f8f2;\r
            border-left: 4px solid #087f23;\r
            border-radius: 6px;\r
            margin-bottom: 22px;\r
            color: #4d4d4d;\r
            font-size: 13px;\r
            line-height: 1.5;\r
        }\r
\r
        /* ================= PAYMENT CARDS ================= */\r
\r
        .option-list {\r
            display: flex;\r
            flex-direction: column;\r
            gap: 12px;\r
            margin-bottom: 22px;\r
        }\r
\r
        .option-card {\r
            display: flex;\r
            align-items: center;\r
            gap: 14px;\r
            border: 1px solid #ddd;\r
            border-radius: 9px;\r
            padding: 16px;\r
            cursor: pointer;\r
            transition: .2s;\r
        }\r
\r
        .option-card:hover {\r
            border-color: #087f23;\r
            background: #f8fcf8;\r
        }\r
\r
        .option-card input {\r
            width: 18px;\r
            height: 18px;\r
            accent-color: #087f23;\r
            cursor: pointer;\r
        }\r
\r
        .option-icon {\r
            width: 40px;\r
            height: 40px;\r
            background: #eaf6ed;\r
            color: #087f23;\r
            border-radius: 8px;\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
            font-size: 20px;\r
        }\r
\r
        .option-info {\r
            flex: 1;\r
        }\r
\r
        .option-title {\r
            font-weight: bold;\r
            font-size: 14px;\r
            margin-bottom: 3px;\r
        }\r
\r
        .option-description {\r
            color: #888;\r
            font-size: 11px;\r
        }\r
\r
        /* ================= NOTIFICATIONS ================= */\r
\r
        .notification-list {\r
            display: flex;\r
            flex-direction: column;\r
            gap: 12px;\r
            margin-bottom: 24px;\r
        }\r
\r
        .notification-item {\r
            display: flex;\r
            align-items: center;\r
            justify-content: space-between;\r
            gap: 15px;\r
            padding: 16px;\r
            border: 1px solid #e2e2e2;\r
            border-radius: 9px;\r
        }\r
\r
        .notification-left {\r
            display: flex;\r
            align-items: center;\r
            gap: 13px;\r
        }\r
\r
        .notification-icon {\r
            width: 40px;\r
            height: 40px;\r
            background: #eaf6ed;\r
            color: #087f23;\r
            border-radius: 8px;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            font-size: 18px;\r
        }\r
\r
        .notification-name {\r
            font-size: 14px;\r
            font-weight: bold;\r
        }\r
\r
        .notification-description {\r
            color: #888;\r
            font-size: 11px;\r
            margin-top: 3px;\r
        }\r
\r
        /* ================= SWITCH ================= */\r
\r
        .switch {\r
            position: relative;\r
            width: 45px;\r
            height: 24px;\r
            flex-shrink: 0;\r
        }\r
\r
        .switch input {\r
            opacity: 0;\r
            width: 0;\r
            height: 0;\r
        }\r
\r
        .slider {\r
            position: absolute;\r
            inset: 0;\r
            background: #ccc;\r
            border-radius: 30px;\r
            cursor: pointer;\r
            transition: .2s;\r
        }\r
\r
        .slider:before {\r
            content: "";\r
            position: absolute;\r
            width: 18px;\r
            height: 18px;\r
            left: 3px;\r
            top: 3px;\r
            background: white;\r
            border-radius: 50%;\r
            transition: .2s;\r
            box-shadow: 0 1px 3px rgba(0,0,0,.2);\r
        }\r
\r
        .switch input:checked + .slider {\r
            background: #087f23;\r
        }\r
\r
        .switch input:checked + .slider:before {\r
            transform: translateX(21px);\r
        }\r
\r
        /* ================= ACCOUNT ================= */\r
\r
        .account-card {\r
            display: flex;\r
            align-items: center;\r
            gap: 15px;\r
            padding: 18px;\r
            background: #f8faf8;\r
            border: 1px solid #e5e5e5;\r
            border-radius: 9px;\r
            margin-bottom: 22px;\r
        }\r
\r
        .account-avatar {\r
            width: 55px;\r
            height: 55px;\r
            background: #087f23;\r
            color: white;\r
            border-radius: 50%;\r
            display: flex;\r
            align-items: center;\r
            justify-content: center;\r
            font-size: 23px;\r
            font-weight: bold;\r
        }\r
\r
        .account-name {\r
            font-weight: bold;\r
            font-size: 15px;\r
        }\r
\r
        .account-role {\r
            color: #888;\r
            font-size: 12px;\r
            margin-top: 3px;\r
        }\r
\r
        /* ================= BUTTON ================= */\r
\r
        .save-btn {\r
            background: #087f23;\r
            color: white;\r
            border: none;\r
            padding: 11px 23px;\r
            border-radius: 7px;\r
            cursor: pointer;\r
            font-size: 13px;\r
            font-weight: bold;\r
            transition: .2s;\r
        }\r
\r
        .save-btn:hover {\r
            background: #06691c;\r
        }\r
\r
        .secondary-btn {\r
            background: white;\r
            color: #087f23;\r
            border: 1px solid #087f23;\r
            padding: 10px 20px;\r
            border-radius: 7px;\r
            cursor: pointer;\r
            font-size: 13px;\r
        }\r
\r
        .secondary-btn:hover {\r
            background: #eaf6ed;\r
        }\r
\r
        .button-row {\r
            display: flex;\r
            gap: 10px;\r
            margin-top: 22px;\r
        }\r
\r
        /* ================= TOAST ================= */\r
\r
        .toast {\r
            position: fixed;\r
            right: 25px;\r
            bottom: 25px;\r
            background: #087f23;\r
            color: white;\r
            padding: 14px 20px;\r
            border-radius: 8px;\r
            box-shadow: 0 5px 20px rgba(0,0,0,.2);\r
            font-size: 13px;\r
            display: flex;\r
            align-items: center;\r
            gap: 10px;\r
            transform: translateY(100px);\r
            opacity: 0;\r
            pointer-events: none;\r
            transition: .3s;\r
            z-index: 2000;\r
        }\r
\r
        .toast.show {\r
            transform: translateY(0);\r
            opacity: 1;\r
        }\r
\r
        /* ================= RESPONSIVE ================= */\r
\r
        @media(max-width: 900px) {\r
\r
            .sidebar {\r
                width: 210px;\r
            }\r
\r
            .main {\r
                margin-left: 210px;\r
                padding: 25px;\r
            }\r
\r
            .form-grid {\r
                grid-template-columns: 1fr;\r
            }\r
\r
            .full-width {\r
                grid-column: auto;\r
            }\r
        }\r
\r
        @media(max-width: 650px) {\r
\r
            .sidebar {\r
                position: relative;\r
                width: 100%;\r
                height: auto;\r
                padding: 20px;\r
            }\r
\r
            .menu {\r
                display: grid;\r
                grid-template-columns: 1fr 1fr;\r
            }\r
\r
            .menu a {\r
                padding: 11px 15px;\r
            }\r
\r
            .main {\r
                margin-left: 0;\r
                padding: 20px 15px;\r
            }\r
\r
            .page-title {\r
                font-size: 25px;\r
            }\r
\r
            .tab-content {\r
                padding: 20px;\r
            }\r
\r
            .setting-tabs {\r
                display: grid;\r
                grid-template-columns: 1fr 1fr;\r
            }\r
\r
            .setting-tab {\r
                width: 100%;\r
            }\r
\r
            .notification-item {\r
                align-items: flex-start;\r
            }\r
        }\r
    </style>\r
</head>\r
\r
<body>\r
\r
<!-- ================= SIDEBAR ================= -->\r
\r
<div class="sidebar">\r
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
        <a href="{{ url('/receipt-records') }}">\r
            <span class="icon">▤</span>\r
            Receipt Records\r
        </a>\r
\r
        <a href="{{ url('/settings') }}" class="active">\r
            <span class="icon">⚙</span>\r
            Settings\r
        </a>\r
\r
    </div>\r
</div>\r
\r
\r
<!-- ================= MAIN ================= -->\r
\r
<main class="main settings-page">\r
\r
    <h1 class="page-title">\r
        Settings\r
    </h1>\r
\r
    <p class="page-subtitle">\r
        Manage your store information, payment options, notifications, and admin account.\r
    </p>\r
\r
\r
    <!-- ================= TABS ================= -->\r
\r
    <div class="setting-tabs">\r
\r
        <button\r
            type="button"\r
            class="setting-tab active"\r
            onclick="openTab('general', this)"\r
        >\r
            ⚙️ General\r
        </button>\r
\r
        <button\r
            type="button"\r
            class="setting-tab"\r
            onclick="openTab('store', this)"\r
        >\r
            🏪 Store Information\r
        </button>\r
\r
        <button\r
            type="button"\r
            class="setting-tab"\r
            onclick="openTab('payment', this)"\r
        >\r
            💳 Payment Methods\r
        </button>\r
\r
        <button\r
            type="button"\r
            class="setting-tab"\r
            onclick="openTab('notification', this)"\r
        >\r
            🔔 Notifications\r
        </button>\r
\r
        <button\r
            type="button"\r
            class="setting-tab"\r
            onclick="openTab('account', this)"\r
        >\r
            👤 Admin Account\r
        </button>\r
\r
    </div>\r
\r
\r
    <!-- GENERAL SETTINGS -->\r
\r
    <section id="general" class="tab-content active">\r
\r
        <div class="section-header">\r
\r
            <h2 class="section-title">\r
                General Settings\r
            </h2>\r
\r
            <p class="section-description">\r
                Manage the basic settings of the ELEE Hardware system.\r
            </p>\r
\r
        </div>\r
\r
        <div class="info-box">\r
            These settings control the basic information displayed\r
            throughout the store management system.\r
        </div>\r
\r
        <div class="form-grid">\r
\r
            <div class="form-group">\r
                <label>System Name</label>\r
                <input\r
                    type="text"\r
                    id="systemName"\r
                    value="ELEE Hardware"\r
                >\r
            </div>\r
\r
            <div class="form-group">\r
                <label>Language</label>\r
\r
                <!-- ENGLISH ONLY -->\r
                <select id="language">\r
                    <option value="English">English</option>\r
                </select>\r
\r
            </div>\r
\r
        </div>\r
\r
        <div class="button-row">\r
            <button\r
                type="button"\r
                class="save-btn"\r
                onclick="saveGeneralSettings()"\r
            >\r
                Save Settings\r
            </button>\r
        </div>\r
\r
    </section>\r
\r
\r
    <!-- STORE INFORMATION -->\r
\r
    <section id="store" class="tab-content">\r
\r
        <div class="section-header">\r
\r
            <h2 class="section-title">\r
                Store Information\r
            </h2>\r
\r
            <p class="section-description">\r
                Update the basic information of your hardware store.\r
            </p>\r
\r
        </div>\r
\r
        <div class="form-grid">\r
\r
            <div class="form-group">\r
                <label>Store Name</label>\r
                <input\r
                    type="text"\r
                    id="storeName"\r
                    value="ELEE Hardware"\r
                >\r
            </div>\r
\r
            <div class="form-group">\r
                <label>Contact Number</label>\r
                <input\r
                    type="text"\r
                    id="storeContact"\r
                    placeholder="Enter contact number"\r
                >\r
            </div>\r
\r
            <div class="form-group full-width">\r
                <label>Store Address</label>\r
                <textarea\r
                    id="storeAddress"\r
                    placeholder="Enter store address"\r
                ></textarea>\r
            </div>\r
\r
            <div class="form-group">\r
                <label>Email Address</label>\r
                <input\r
                    type="email"\r
                    id="storeEmail"\r
                    placeholder="Enter store email"\r
                >\r
            </div>\r
\r
            <div class="form-group">\r
                <label>Store Status</label>\r
                <select id="storeStatus">\r
                    <option value="Open">Open</option>\r
                    <option value="Closed">Closed</option>\r
                </select>\r
            </div>\r
\r
        </div>\r
\r
        <div class="button-row">\r
            <button\r
                type="button"\r
                class="save-btn"\r
                onclick="saveStoreSettings()"\r
            >\r
                Save Store Information\r
            </button>\r
        </div>\r
\r
    </section>\r
\r
\r
    <!-- PAYMENT METHODS -->\r
\r
    <section id="payment" class="tab-content">\r
\r
        <div class="section-header">\r
\r
            <h2 class="section-title">\r
                Payment Methods\r
            </h2>\r
\r
            <p class="section-description">\r
                Select the payment methods available to customers.\r
            </p>\r
\r
        </div>\r
\r
        <div class="info-box">\r
            The system currently supports cash payments for\r
            Cash at Store and Cash on Delivery orders.\r
        </div>\r
\r
        <div class="option-list">\r
\r
            <label class="option-card">\r
\r
                <input\r
                    type="checkbox"\r
                    id="cashStore"\r
                    checked\r
                >\r
\r
                <div class="option-icon">\r
                    🏪\r
                </div>\r
\r
                <div class="option-info">\r
\r
                    <div class="option-title">\r
                        Cash at Store\r
                    </div>\r
\r
                    <div class="option-description">\r
                        Customer pays the order at the physical store.\r
                    </div>\r
\r
                </div>\r
\r
            </label>\r
\r
\r
            <label class="option-card">\r
\r
                <input\r
                    type="checkbox"\r
                    id="cashDelivery"\r
                    checked\r
                >\r
\r
                <div class="option-icon">\r
                    🚚\r
                </div>\r
\r
                <div class="option-info">\r
\r
                    <div class="option-title">\r
                        Cash on Delivery\r
                    </div>\r
\r
                    <div class="option-description">\r
                        Customer pays cash when the order is delivered.\r
                    </div>\r
\r
                </div>\r
\r
            </label>\r
\r
        </div>\r
\r
        <div class="button-row">\r
\r
            <button\r
                type="button"\r
                class="save-btn"\r
                onclick="savePaymentSettings()"\r
            >\r
                Save Payment Settings\r
            </button>\r
\r
        </div>\r
\r
    </section>\r
\r
\r
    <!-- NOTIFICATIONS -->\r
\r
    <section id="notification" class="tab-content">\r
\r
        <div class="section-header">\r
\r
            <h2 class="section-title">\r
                Notifications\r
            </h2>\r
\r
            <p class="section-description">\r
                Choose which alerts should be shown to staff.\r
            </p>\r
\r
        </div>\r
\r
        <div class="info-box">\r
            Notifications help staff monitor new orders, changes,\r
            cancellations, and products that are running low in stock.\r
        </div>\r
\r
        <div class="notification-list">\r
\r
            <div class="notification-item">\r
\r
                <div class="notification-left">\r
\r
                    <div class="notification-icon">\r
                        🛒\r
                    </div>\r
\r
                    <div>\r
\r
                        <div class="notification-name">\r
                            New Orders\r
                        </div>\r
\r
                        <div class="notification-description">\r
                            Alert staff when a new order is received.\r
                        </div>\r
\r
                    </div>\r
\r
                </div>\r
\r
                <label class="switch">\r
\r
                    <input\r
                        type="checkbox"\r
                        id="notifyNewOrders"\r
                        checked\r
                    >\r
\r
                    <span class="slider"></span>\r
\r
                </label>\r
\r
            </div>\r
\r
\r
            <div class="notification-item">\r
\r
                <div class="notification-left">\r
\r
                    <div class="notification-icon">\r
                        ✏️\r
                    </div>\r
\r
                    <div>\r
\r
                        <div class="notification-name">\r
                            Order Changes\r
                        </div>\r
\r
                        <div class="notification-description">\r
                            Alert staff when an existing order is changed.\r
                        </div>\r
\r
                    </div>\r
\r
                </div>\r
\r
                <label class="switch">\r
\r
                    <input\r
                        type="checkbox"\r
                        id="notifyOrderChanges"\r
                        checked\r
                    >\r
\r
                    <span class="slider"></span>\r
\r
                </label>\r
\r
            </div>\r
\r
\r
            <div class="notification-item">\r
\r
                <div class="notification-left">\r
\r
                    <div class="notification-icon">\r
                        ❌\r
                    </div>\r
\r
                    <div>\r
\r
                        <div class="notification-name">\r
                            Order Cancellations\r
                        </div>\r
\r
                        <div class="notification-description">\r
                            Alert staff when an order is cancelled.\r
                        </div>\r
\r
                    </div>\r
\r
                </div>\r
\r
                <label class="switch">\r
\r
                    <input\r
                        type="checkbox"\r
                        id="notifyCancellations"\r
                        checked\r
                    >\r
\r
                    <span class="slider"></span>\r
\r
                </label>\r
\r
            </div>\r
\r
\r
            <div class="notification-item">\r
\r
                <div class="notification-left">\r
\r
                    <div class="notification-icon">\r
                        ⚠️\r
                    </div>\r
\r
                    <div>\r
\r
                        <div class="notification-name">\r
                            Low-Stock Products\r
                        </div>\r
\r
                        <div class="notification-description">\r
                            Alert staff when product inventory reaches a low level.\r
                        </div>\r
\r
                    </div>\r
\r
                </div>\r
\r
                <label class="switch">\r
\r
                    <input\r
                        type="checkbox"\r
                        id="notifyLowStock"\r
                        checked\r
                    >\r
\r
                    <span class="slider"></span>\r
\r
                </label>\r
\r
            </div>\r
\r
        </div>\r
\r
        <div class="button-row">\r
\r
            <button\r
                type="button"\r
                class="save-btn"\r
                onclick="saveNotificationSettings()"\r
            >\r
                Save Notification Settings\r
            </button>\r
\r
        </div>\r
\r
    </section>\r
\r
\r
    <!-- ADMIN ACCOUNT -->\r
\r
    <section id="account" class="tab-content">\r
\r
        <div class="section-header">\r
\r
            <h2 class="section-title">\r
                Admin Account\r
            </h2>\r
\r
            <p class="section-description">\r
                Manage the administrator account information.\r
            </p>\r
\r
        </div>\r
\r
        <div class="account-card">\r
\r
            <div class="account-avatar">\r
                A\r
            </div>\r
\r
            <div>\r
\r
                <div\r
                    class="account-name"\r
                    id="accountDisplayName"\r
                >\r
                    Administrator\r
                </div>\r
\r
                <div class="account-role">\r
                    Store Administrator\r
                </div>\r
\r
            </div>\r
\r
        </div>\r
\r
        <div class="form-grid">\r
\r
            <div class="form-group">\r
\r
                <label>Admin Name</label>\r
\r
                <input\r
                    type="text"\r
                    id="adminName"\r
                    value="Administrator"\r
                >\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>Username</label>\r
\r
                <input\r
                    type="text"\r
                    id="adminUsername"\r
                    value="admin"\r
                >\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>Email Address</label>\r
\r
                <input\r
                    type="email"\r
                    id="adminEmail"\r
                    placeholder="admin@example.com"\r
                >\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>Role</label>\r
\r
                <select id="adminRole">\r
\r
                    <option value="Administrator">\r
                        Administrator\r
                    </option>\r
\r
                    <option value="Staff">\r
                        Staff\r
                    </option>\r
\r
                </select>\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>New Password</label>\r
\r
                <input\r
                    type="password"\r
                    id="adminPassword"\r
                    placeholder="Enter new password"\r
                >\r
\r
                <div class="hint">\r
                    Leave blank if you do not want to change the password.\r
                </div>\r
\r
            </div>\r
\r
\r
            <div class="form-group">\r
\r
                <label>Confirm Password</label>\r
\r
                <input\r
                    type="password"\r
                    id="confirmPassword"\r
                    placeholder="Confirm new password"\r
                >\r
\r
            </div>\r
\r
        </div>\r
\r
        <div class="button-row">\r
\r
            <button\r
                type="button"\r
                class="save-btn"\r
                onclick="saveAccountSettings()"\r
            >\r
                Save Account Settings\r
            </button>\r
\r
        </div>\r
\r
    </section>\r
\r
</main>\r
\r
\r
<!-- ================= TOAST ================= -->\r
\r
<div class="toast" id="toast">\r
\r
    <span>✓</span>\r
\r
    <span id="toastMessage">\r
        Settings saved successfully!\r
    </span>\r
\r
</div>\r
\r
\r
<script>\r
\r
/* ================= OPEN TAB ================= */\r
\r
function openTab(tabName, button) {\r
\r
    const contents = document.querySelectorAll(".tab-content");\r
    const buttons = document.querySelectorAll(".setting-tab");\r
\r
    contents.forEach(function(content) {\r
        content.classList.remove("active");\r
    });\r
\r
    buttons.forEach(function(btn) {\r
        btn.classList.remove("active");\r
    });\r
\r
    const selected = document.getElementById(tabName);\r
\r
    if (selected) {\r
        selected.classList.add("active");\r
    }\r
\r
    if (button) {\r
        button.classList.add("active");\r
    }\r
}\r
\r
\r
/* ================= TOAST ================= */\r
\r
function showToast(message) {\r
\r
    const toast = document.getElementById("toast");\r
    const toastMessage = document.getElementById("toastMessage");\r
\r
    if (!toast || !toastMessage) {\r
        return;\r
    }\r
\r
    toastMessage.innerText = message;\r
    toast.classList.add("show");\r
\r
    setTimeout(function() {\r
        toast.classList.remove("show");\r
    }, 2500);\r
}\r
\r
\r
/* ================= GENERAL ================= */\r
\r
function saveGeneralSettings() {\r
\r
    const systemName = document.getElementById("systemName").value.trim();\r
\r
    const settings = {\r
        systemName: systemName || "ELEE Hardware",\r
        language: "English"\r
    };\r
\r
    localStorage.setItem(\r
        "eleeGeneralSettings",\r
        JSON.stringify(settings)\r
    );\r
\r
    showToast("General settings saved successfully!");\r
}\r
\r
\r
/* ================= STORE ================= */\r
\r
function saveStoreSettings() {\r
\r
    const settings = {\r
\r
        storeName:\r
            document.getElementById("storeName").value,\r
\r
        contact:\r
            document.getElementById("storeContact").value,\r
\r
        address:\r
            document.getElementById("storeAddress").value,\r
\r
        email:\r
            document.getElementById("storeEmail").value,\r
\r
        status:\r
            document.getElementById("storeStatus").value\r
    };\r
\r
    localStorage.setItem(\r
        "eleeStoreSettings",\r
        JSON.stringify(settings)\r
    );\r
\r
    showToast("Store information saved successfully!");\r
}\r
\r
\r
/* ================= PAYMENT ================= */\r
\r
function savePaymentSettings() {\r
\r
    const settings = {\r
\r
        cashStore:\r
            document.getElementById("cashStore").checked,\r
\r
        cashDelivery:\r
            document.getElementById("cashDelivery").checked\r
    };\r
\r
    localStorage.setItem(\r
        "eleePaymentSettings",\r
        JSON.stringify(settings)\r
    );\r
\r
    showToast("Payment settings saved successfully!");\r
}\r
\r
\r
/* ================= NOTIFICATIONS ================= */\r
\r
function saveNotificationSettings() {\r
\r
    const settings = {\r
\r
        newOrders:\r
            document.getElementById("notifyNewOrders").checked,\r
\r
        orderChanges:\r
            document.getElementById("notifyOrderChanges").checked,\r
\r
        cancellations:\r
            document.getElementById("notifyCancellations").checked,\r
\r
        lowStock:\r
            document.getElementById("notifyLowStock").checked\r
    };\r
\r
    localStorage.setItem(\r
        "eleeNotificationSettings",\r
        JSON.stringify(settings)\r
    );\r
\r
    showToast("Notification settings saved successfully!");\r
}\r
\r
\r
/* ================= ADMIN ACCOUNT ================= */\r
\r
function saveAccountSettings() {\r
\r
    const name =\r
        document.getElementById("adminName").value.trim();\r
\r
    const username =\r
        document.getElementById("adminUsername").value.trim();\r
\r
    const email =\r
        document.getElementById("adminEmail").value.trim();\r
\r
    const role =\r
        document.getElementById("adminRole").value;\r
\r
    const password =\r
        document.getElementById("adminPassword").value;\r
\r
    const confirmPassword =\r
        document.getElementById("confirmPassword").value;\r
\r
\r
    if (name === "") {\r
\r
        showToast("Please enter the admin name.");\r
        return;\r
\r
    }\r
\r
\r
    if (username === "") {\r
\r
        showToast("Please enter the username.");\r
        return;\r
\r
    }\r
\r
\r
    if (\r
        password !== "" &&\r
        password !== confirmPassword\r
    ) {\r
\r
        showToast("Passwords do not match.");\r
        return;\r
\r
    }\r
\r
\r
    const account = {\r
\r
        name: name,\r
        username: username,\r
        email: email,\r
        role: role\r
    };\r
\r
\r
    localStorage.setItem(\r
        "eleeAdminAccount",\r
        JSON.stringify(account)\r
    );\r
\r
\r
    document.getElementById(\r
        "accountDisplayName"\r
    ).innerText = name;\r
\r
\r
    document.getElementById(\r
        "adminPassword"\r
    ).value = "";\r
\r
\r
    document.getElementById(\r
        "confirmPassword"\r
    ).value = "";\r
\r
\r
    showToast("Admin account settings saved!");\r
}\r
\r
\r
/* ================= LOAD SETTINGS ================= */\r
\r
function loadSettings() {\r
\r
    /* GENERAL */\r
\r
    const generalData =\r
        localStorage.getItem("eleeGeneralSettings");\r
\r
    if (generalData) {\r
\r
        try {\r
\r
            const settings =\r
                JSON.parse(generalData);\r
\r
            document.getElementById("systemName").value =\r
                settings.systemName || "ELEE Hardware";\r
\r
            /* English only */\r
            document.getElementById("language").value = "English";\r
\r
        } catch (error) {\r
\r
            console.log("General settings could not be loaded.");\r
\r
        }\r
\r
    }\r
\r
\r
    /* STORE */\r
\r
    const storeData =\r
        localStorage.getItem("eleeStoreSettings");\r
\r
    if (storeData) {\r
\r
        try {\r
\r
            const settings =\r
                JSON.parse(storeData);\r
\r
            document.getElementById("storeName").value =\r
                settings.storeName || "ELEE Hardware";\r
\r
            document.getElementById("storeContact").value =\r
                settings.contact || "";\r
\r
            document.getElementById("storeAddress").value =\r
                settings.address || "";\r
\r
            document.getElementById("storeEmail").value =\r
                settings.email || "";\r
\r
            document.getElementById("storeStatus").value =\r
                settings.status || "Open";\r
\r
        } catch (error) {\r
\r
            console.log("Store settings could not be loaded.");\r
\r
        }\r
\r
    }\r
\r
\r
    /* PAYMENT */\r
\r
    const paymentData =\r
        localStorage.getItem("eleePaymentSettings");\r
\r
    if (paymentData) {\r
\r
        try {\r
\r
            const settings =\r
                JSON.parse(paymentData);\r
\r
            document.getElementById("cashStore").checked =\r
                settings.cashStore !== false;\r
\r
            document.getElementById("cashDelivery").checked =\r
                settings.cashDelivery !== false;\r
\r
        } catch (error) {\r
\r
            console.log("Payment settings could not be loaded.");\r
\r
        }\r
\r
    }\r
\r
\r
    /* NOTIFICATIONS */\r
\r
    const notificationData =\r
        localStorage.getItem("eleeNotificationSettings");\r
\r
    if (notificationData) {\r
\r
        try {\r
\r
            const settings =\r
                JSON.parse(notificationData);\r
\r
            document.getElementById("notifyNewOrders").checked =\r
                settings.newOrders !== false;\r
\r
            document.getElementById("notifyOrderChanges").checked =\r
                settings.orderChanges !== false;\r
\r
            document.getElementById("notifyCancellations").checked =\r
                settings.cancellations !== false;\r
\r
            document.getElementById("notifyLowStock").checked =\r
                settings.lowStock !== false;\r
\r
        } catch (error) {\r
\r
            console.log("Notification settings could not be loaded.");\r
\r
        }\r
\r
    }\r
\r
\r
    /* ADMIN ACCOUNT */\r
\r
    const accountData =\r
        localStorage.getItem("eleeAdminAccount");\r
\r
    if (accountData) {\r
\r
        try {\r
\r
            const account =\r
                JSON.parse(accountData);\r
\r
            document.getElementById("adminName").value =\r
                account.name || "Administrator";\r
\r
            document.getElementById("adminUsername").value =\r
                account.username || "admin";\r
\r
            document.getElementById("adminEmail").value =\r
                account.email || "";\r
\r
            document.getElementById("adminRole").value =\r
                account.role || "Administrator";\r
\r
            document.getElementById("accountDisplayName").innerText =\r
                account.name || "Administrator";\r
\r
        } catch (error) {\r
\r
            console.log("Admin account could not be loaded.");\r
\r
        }\r
\r
    }\r
}\r
\r
\r
/* ================= START ================= */\r
\r
document.addEventListener(\r
    "DOMContentLoaded",\r
    function() {\r
        loadSettings();\r
    }\r
);\r
\r
<\/script>\r
\r
</body>\r
</html>\r
`;export{n as default};
