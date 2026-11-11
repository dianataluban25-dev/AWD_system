const n=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>EleeSiWeb - Dashboard</title>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>

    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            background: #ffffff;
            color: #151515;
        }

        .dashboard {
            display: flex;
            min-height: 100vh;
        }


        /* ================= SIDEBAR ================= */

        .sidebar {
            width: 235px;
            min-height: 100vh;
            background: #00551f;
            color: white;
            padding: 28px 16px;
            flex-shrink: 0;
        }

        .logo {
            font-size: 36px;
            font-weight: 900;
            margin-left: 12px;
            letter-spacing: -2px;
        }

        .logo span {
            color: #ffbd00;
        }

        .hardware {
            color: #ffbd00;
            font-size: 14px;
            font-weight: bold;
            margin-left: 13px;
            margin-top: 3px;
            margin-bottom: 25px;
        }

        .menu {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        .menu a {
            text-decoration: none;
            color: white;
            padding: 13px 14px;
            border-radius: 7px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: 0.2s;
        }

        .menu a:hover {
            background: #08732e;
        }

        .menu a.active {
            background: #08732e;
        }

        .icon {
            width: 20px;
            text-align: center;
            font-size: 18px;
        }

        /* ================= LOGOUT ================= */

        .menu a.logout {
            margin-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 16px;
        }

        .menu a.logout:hover {
            background: #8b1e1e;
        }


        /* ================= MAIN ================= */

        .main {
            flex: 1;
            min-width: 0;
            background: #ffffff;
        }

        .content {
            padding: 30px 28px 35px;
        }

        .header {
            margin-bottom: 22px;
        }

        .header h1 {
            font-size: 31px;
            margin-bottom: 4px;
        }

        .header p {
            color: #8b8b8b;
            font-size: 15px;
        }


        /* ================= SUMMARY CARDS ================= */

        .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 20px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #e5e7e5;
            border-radius: 13px;
            padding: 18px;
            min-height: 135px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .card-top {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .card-icon {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .green-icon {
            background: #d9f8e5;
            color: #08752a;
        }

        .yellow-icon {
            background: #fff0c8;
            color: #e49a00;
        }

        .purple-icon {
            background: #efd8ff;
            color: #8b00c9;
        }

        .red-icon {
            background: #ffe0e0;
            color: #d63031;
        }

        .card-title {
            font-size: 14px;
            font-weight: 600;
        }

        .card-number {
            font-size: 27px;
            font-weight: 700;
            margin-top: 8px;
            margin-left: 54px;
        }

        .card-change {
            color: #16a34a;
            font-size: 11px;
            margin-left: 54px;
            margin-top: 6px;
        }

        .card-warning {
            color: #d63031;
            font-size: 11px;
            margin-left: 54px;
            margin-top: 6px;
        }


        /* ================= CHART ROW ================= */

        .chart-row {
            display: grid;
            grid-template-columns: 1.65fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .box {
            background: white;
            border: 1px solid #e4e7e4;
            border-radius: 13px;
            padding: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .box-title {
            font-size: 16px;
            font-weight: 700;
        }

        .box-subtitle {
            color: #999;
            font-size: 12px;
            margin-top: 4px;
        }

        .chart-container {
            height: 250px;
            margin-top: 10px;
        }


        /* ================= PAYMENT OVERVIEW ================= */

        .payment-overview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
        }

        .payment-card {
            border: 1px solid #e5e7e5;
            border-radius: 10px;
            padding: 15px;
        }

        .payment-label {
            color: #777;
            font-size: 12px;
            margin-bottom: 7px;
        }

        .payment-value {
            font-size: 21px;
            font-weight: bold;
        }

        .paid-value {
            color: #08752a;
        }

        .unpaid-value {
            color: #d97706;
        }


        /* ================= ORDER STATUS ================= */

        .order-status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 250px;
            gap: 15px;
        }

        .donut {
            width: 205px;
            height: 205px;
            position: relative;
            flex-shrink: 0;
        }

        .donut canvas {
            width: 100% !important;
            height: 100% !important;
        }

        .donut-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            pointer-events: none;
        }

        .donut-number {
            font-size: 23px;
            font-weight: 700;
        }

        .donut-total {
            font-size: 11px;
            color: #888;
            margin-top: 2px;
        }

        .status-list {
            display: flex;
            flex-direction: column;
            gap: 17px;
            flex: 1;
        }

        .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
        }

        .status-item strong {
            margin-left: auto;
            font-size: 10px;
        }

        .status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .completed {
            background: #08752a;
        }

        .processing {
            background: #16a34a;
        }

        .pending {
            background: #ffad00;
        }

        .ready {
            background: #8e00c7;
        }


        /* ================= BOTTOM ================= */

        .bottom-row {
            display: grid;
            grid-template-columns: 1.65fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .box-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .see-all {
            color: #08752a;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
        }

        .see-all:hover {
            text-decoration: underline;
        }


        /* ================= TABLE ================= */

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th {
            text-align: left;
            color: #888;
            font-size: 11px;
            font-weight: 500;
            padding: 9px 5px;
            border-bottom: 1px solid #eeeeee;
        }

        td {
            padding: 12px 5px;
            font-size: 12px;
            border-bottom: 1px solid #eeeeee;
        }

        .order-id {
            font-weight: 600;
        }

        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
        }

        .badge-completed {
            background: #d7f8e4;
            color: #08752a;
        }

        .badge-pending {
            background: #fff0bd;
            color: #8a6200;
        }

        .badge-ready {
            background: #efd7ff;
            color: #7800a8;
        }


        /* ================= LOW STOCK ================= */

        .stock-list {
            margin-top: 13px;
        }

        .stock-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 0;
            border-bottom: 1px solid #eeeeee;
        }

        .stock-image {
            width: 43px;
            height: 43px;
            border-radius: 7px;
            background: #ffeaea;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 21px;
        }

        .stock-info {
            flex: 1;
        }

        .stock-name {
            font-size: 12px;
            font-weight: 700;
        }

        .stock-description {
            font-size: 10px;
            color: #888;
            margin-top: 3px;
        }

        .stock-number {
            text-align: right;
        }

        .stock-quantity {
            color: #d63031;
            font-size: 12px;
            font-weight: bold;
        }

        .stock-label {
            color: #888;
            font-size: 9px;
        }


        /* ================= TOP SELLING PRODUCTS ================= */

        .product-list {
            margin-top: 13px;
        }

        .product {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 0;
            border-bottom: 1px solid #eeeeee;
        }

        .product-image {
            width: 43px;
            height: 43px;
            border-radius: 7px;
            background: #eeeeee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }

        .product-info {
            flex: 1;
        }

        .product-name {
            font-size: 12px;
            font-weight: 700;
        }

        .product-price {
            font-size: 10px;
            color: #888;
            margin-top: 3px;
        }

        .product-sales {
            text-align: right;
        }

        .sales-number {
            color: #08752a;
            font-size: 12px;
            font-weight: bold;
        }

        .sold {
            color: #888;
            font-size: 9px;
        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

            .sidebar {
                width: 200px;
            }

            .cards {
                grid-template-columns: repeat(2, 1fr);
            }

            .chart-row,
            .bottom-row {
                grid-template-columns: 1fr;
            }
        }


        @media (max-width: 700px) {

            .sidebar {
                display: none;
            }

            .cards {
                grid-template-columns: 1fr;
            }

            .content {
                padding: 20px;
            }

            .payment-overview {
                grid-template-columns: 1fr;
            }

            .order-status {
                flex-direction: column;
                padding: 15px 0;
            }

            .donut {
                width: 180px;
                height: 180px;
            }

            .box {
                overflow-x: auto;
            }

            table {
                min-width: 600px;
            }
        }

    </style>

</head>


<body>


<div class="dashboard">


    <!-- ================= SIDEBAR ================= -->

    <aside class="sidebar">

        <div class="logo">
            <span style="color:white;">E</span><span>LEE</span>
        </div>

        <div class="hardware">
            HARDWARE
        </div>

        <div class="menu">

            <a href="{{ url('/') }}" class="active">
                <span class="icon">☼</span>
                Dashboard
            </a>

            <a href="{{ url('/orders') }}">
                <span class="icon">▣</span>
                Orders
            </a>

            <a href="{{ url('/products') }}">
                <span class="icon">◇</span>
                Products
            </a>

            <a href="{{ url('/ai-recommendations') }}">
                <span class="icon">↗</span>
                AI Recommendations
            </a>

            <a href="{{ url('/payments') }}">
                <span class="icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 5.5v-.75A1.75 1.75 0 0 1 8.75 3h8.5"/><path d="M16 13h4.5"/><circle cx="16" cy="13" r=".55"/></svg></span>
                Payments
            </a>

            <a href="{{ url('/customers') }}">
                <span class="icon">♙</span>
                Customers
            </a>

            <a href="{{ url('/queuing') }}">
                <span class="icon">▱</span>
                Queuing
            </a>

            <a href="{{ url('/receipt-records') }}">
                <span class="icon">▤</span>
                Receipt Records
            </a>

            <a href="{{ url('/settings') }}">
                <span class="icon">⚙</span>
                Settings
            </a>

            <!-- ================= LOGOUT ================= -->

            <a href="{{ url('/admin/logout') }}" class="logout">
                <span class="icon">↪</span>
                Logout
            </a>

        </div>

    </aside>


    <!-- ================= MAIN ================= -->

    <main class="main">

        <div class="content">


            <!-- ================= HEADER ================= -->

            <div class="header">

                <h1>
                    Dashboard
                </h1>

                <p>
                    Overview of your store orders, sales, payments, and inventory.
                </p>

            </div>


            <!-- ================= SUMMARY CARDS ================= -->

            <div class="cards">


                <!-- TOTAL ORDERS -->

                <div class="card">

                    <div class="card-top">

                        <div class="card-icon green-icon">
                            🛒
                        </div>

                        <div class="card-title">
                            Total Orders
                        </div>

                    </div>

                    <div class="card-number">
                        128
                    </div>

                    <div class="card-change">
                        ↑ 12% from yesterday
                    </div>

                </div>


                <!-- PENDING ORDERS -->

                <div class="card">

                    <div class="card-top">

                        <div class="card-icon yellow-icon">
                            ◷
                        </div>

                        <div class="card-title">
                            Pending Orders
                        </div>

                    </div>

                    <div class="card-number">
                        28
                    </div>

                    <div class="card-change">
                        21.9% of total orders
                    </div>

                </div>


                <!-- TOTAL SALES -->

                <div class="card">

                    <div class="card-top">

                        <div class="card-icon purple-icon">
                            ₱
                        </div>

                        <div class="card-title">
                            Total Sales
                        </div>

                    </div>

                    <div class="card-number">
                        ₱98,450.00
                    </div>

                    <div class="card-change">
                        ↑ 12% from yesterday
                    </div>

                </div>


                <!-- LOW STOCK -->

                <div class="card">

                    <div class="card-top">

                        <div class="card-icon red-icon">
                            ⚠
                        </div>

                        <div class="card-title">
                            Low-Stock Products
                        </div>

                    </div>

                    <div class="card-number">
                        6
                    </div>

                    <div class="card-warning">
                        Requires attention
                    </div>

                </div>


            </div>


            <!-- ================= CHART ROW ================= -->

            <div class="chart-row">


                <!-- SALES REVENUE -->

                <div class="box">

                    <div class="box-title">
                        Sales Revenue Trend
                    </div>

                    <div class="box-subtitle">
                        Monthly performance overview
                    </div>

                    <div class="chart-container">

                        <canvas id="salesChart"></canvas>

                    </div>

                </div>


                <!-- ORDER STATUS -->

                <div class="box">

                    <div class="box-title">
                        Order Status
                    </div>

                    <div class="box-subtitle">
                        Current order overview
                    </div>


                    <div class="order-status">


                        <div class="donut">

                            <canvas id="orderChart"></canvas>

                            <div class="donut-center">

                                <div class="donut-number">
                                    128
                                </div>

                                <div class="donut-total">
                                    Total Orders
                                </div>

                            </div>

                        </div>


                        <div class="status-list">


                            <div class="status-item">

                                <span class="status-dot completed"></span>

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    98
                                </strong>

                            </div>


                            <div class="status-item">

                                <span class="status-dot pending"></span>

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    28
                                </strong>

                            </div>


                            <div class="status-item">

                                <span class="status-dot processing"></span>

                                <span>
                                    Processing
                                </span>

                                <strong>
                                    1
                                </strong>

                            </div>


                            <div class="status-item">

                                <span class="status-dot ready"></span>

                                <span>
                                    Ready
                                </span>

                                <strong>
                                    1
                                </strong>

                            </div>


                        </div>

                    </div>

                </div>


            </div>


            <!-- ================= PAYMENT OVERVIEW ================= -->

            <div class="box" style="margin-bottom:20px;">

                <div class="box-title">
                    Payment Overview
                </div>

                <div class="box-subtitle">
                    Summary of customer payment status
                </div>


                <div class="payment-overview">


                    <div class="payment-card">

                        <div class="payment-label">
                            Paid Orders
                        </div>

                        <div class="payment-value paid-value">
                            98 Orders
                        </div>

                    </div>


                    <div class="payment-card">

                        <div class="payment-label">
                            Unpaid Orders
                        </div>

                        <div class="payment-value unpaid-value">
                            30 Orders
                        </div>

                    </div>


                    <div class="payment-card">

                        <div class="payment-label">
                            Paid Amount
                        </div>

                        <div class="payment-value paid-value">
                            ₱78,320.00
                        </div>

                    </div>


                    <div class="payment-card">

                        <div class="payment-label">
                            Unpaid Amount
                        </div>

                        <div class="payment-value unpaid-value">
                            ₱20,130.00
                        </div>

                    </div>


                </div>

            </div>


            <!-- ================= BOTTOM ROW ================= -->

            <div class="bottom-row">


                <!-- RECENT ORDERS -->

                <div class="box">

                    <div class="box-header">

                        <div>

                            <div class="box-title">
                                Recent Orders
                            </div>

                            <div class="box-subtitle">
                                Latest customer orders
                            </div>

                        </div>

                        <!-- CLICKABLE SEE ALL ORDERS -->

                        <a href="{{ url('/orders') }}" class="see-all">
                            See All Orders →
                        </a>

                    </div>


                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Amount
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            <tr>

                                <td class="order-id">
                                    #ELEE-1024
                                </td>

                                <td>
                                    Customer 1
                                </td>

                                <td>
                                    Oct 24, 2026
                                </td>

                                <td>

                                    <span class="badge badge-completed">
                                        Completed
                                    </span>

                                </td>

                                <td>
                                    ₱2,450.00
                                </td>

                            </tr>


                            <tr>

                                <td class="order-id">
                                    #ELEE-1023
                                </td>

                                <td>
                                    Customer 2
                                </td>

                                <td>
                                    Oct 24, 2026
                                </td>

                                <td>

                                    <span class="badge badge-pending">
                                        Pending
                                    </span>

                                </td>

                                <td>
                                    ₱1,120.00
                                </td>

                            </tr>


                            <tr>

                                <td class="order-id">
                                    #ELEE-1022
                                </td>

                                <td>
                                    Customer 3
                                </td>

                                <td>
                                    Oct 23, 2026
                                </td>

                                <td>

                                    <span class="badge badge-ready">
                                        Ready for Delivery
                                    </span>

                                </td>

                                <td>
                                    ₱3,760.00
                                </td>

                            </tr>


                        </tbody>

                    </table>

                </div>


                <!-- LOW STOCK PRODUCTS -->

                <div class="box">

                    <div class="box-title">
                        Low-Stock Products
                    </div>

                    <div class="box-subtitle">
                        Products that need restocking
                    </div>


                    <div class="stock-list">


                        <div class="stock-item">

                            <div class="stock-image">
                                🧱
                            </div>

                            <div class="stock-info">

                                <div class="stock-name">
                                    Cement 25kg
                                </div>

                                <div class="stock-description">
                                    Inventory level is low
                                </div>

                            </div>

                            <div class="stock-number">

                                <div class="stock-quantity">
                                    8
                                </div>

                                <div class="stock-label">
                                    left
                                </div>

                            </div>

                        </div>


                        <div class="stock-item">

                            <div class="stock-image">
                                🔩
                            </div>

                            <div class="stock-info">

                                <div class="stock-name">
                                    GI Sheet 0.3mm
                                </div>

                                <div class="stock-description">
                                    Inventory level is low
                                </div>

                            </div>

                            <div class="stock-number">

                                <div class="stock-quantity">
                                    5
                                </div>

                                <div class="stock-label">
                                    left
                                </div>

                            </div>

                        </div>


                        <div class="stock-item">

                            <div class="stock-image">
                                🔨
                            </div>

                            <div class="stock-info">

                                <div class="stock-name">
                                    Hammer
                                </div>

                                <div class="stock-description">
                                    Inventory level is low
                                </div>

                            </div>

                            <div class="stock-number">

                                <div class="stock-quantity">
                                    4
                                </div>

                                <div class="stock-label">
                                    left
                                </div>

                            </div>

                        </div>


                        <div class="stock-item">

                            <div class="stock-image">
                                🔩
                            </div>

                            <div class="stock-info">

                                <div class="stock-name">
                                    Nails 1kg
                                </div>

                                <div class="stock-description">
                                    Inventory level is low
                                </div>

                            </div>

                            <div class="stock-number">

                                <div class="stock-quantity">
                                    3
                                </div>

                                <div class="stock-label">
                                    left
                                </div>

                            </div>

                        </div>


                    </div>

                </div>


            </div>


            <!-- ================= TOP SELLING PRODUCTS ================= -->

            <div class="box">

                <div class="box-title">
                    Top-Selling Products
                </div>

                <div class="box-subtitle">
                    Highest demand products this week
                </div>


                <div class="product-list">


                    <div class="product">

                        <div class="product-image">
                            🧱
                        </div>

                        <div class="product-info">

                            <div class="product-name">
                                Hollow Blocks 4"
                            </div>

                            <div class="product-price">
                                ₱250.00/pc
                            </div>

                        </div>

                        <div class="product-sales">

                            <div class="sales-number">
                                340
                            </div>

                            <div class="sold">
                                sold
                            </div>

                        </div>

                    </div>


                    <div class="product">

                        <div class="product-image">
                            🔩
                        </div>

                        <div class="product-info">

                            <div class="product-name">
                                GI Sheet 0.3mm
                            </div>

                            <div class="product-price">
                                ₱350.00/pc
                            </div>

                        </div>

                        <div class="product-sales">

                            <div class="sales-number">
                                180
                            </div>

                            <div class="sold">
                                sold
                            </div>

                        </div>

                    </div>


                    <div class="product">

                        <div class="product-image">
                            🧱
                        </div>

                        <div class="product-info">

                            <div class="product-name">
                                Cement 25kg
                            </div>

                            <div class="product-price">
                                ₱125.00/pc
                            </div>

                        </div>

                        <div class="product-sales">

                            <div class="sales-number">
                                124
                            </div>

                            <div class="sold">
                                sold
                            </div>

                        </div>

                    </div>


                </div>

            </div>


        </div>

    </main>

</div>


<!-- ================= JAVASCRIPT ================= -->

<script>


    /* ================= SALES REVENUE CHART ================= */

    const salesCtx =
        document.getElementById('salesChart').getContext('2d');


    new Chart(salesCtx, {

        type: 'line',

        data: {

            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct'
            ],

            datasets: [

                {

                    label: 'Revenue',

                    data: [
                        30000,
                        42000,
                        35000,
                        58000,
                        47000,
                        62000,
                        68000,
                        74000,
                        82000,
                        92450
                    ],

                    borderColor: '#08752a',

                    backgroundColor:
                        'rgba(8, 117, 42, 0.10)',

                    borderWidth: 3,

                    pointRadius: 4,

                    pointBackgroundColor: '#08752a',

                    pointBorderColor: '#ffffff',

                    pointBorderWidth: 2,

                    tension: 0.35,

                    fill: true

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return '₱' +
                                value.toLocaleString();

                        }

                    },

                    grid: {
                        color: '#eeeeee'
                    }

                },

                x: {

                    grid: {
                        display: false
                    }

                }

            }

        }

    });


    /* ================= ORDER STATUS CHART ================= */

    const orderCtx =
        document.getElementById('orderChart').getContext('2d');


    new Chart(orderCtx, {

        type: 'doughnut',

        data: {

            labels: [
                'Completed',
                'Pending',
                'Processing',
                'Ready for Delivery'
            ],

            datasets: [

                {

                    data: [
                        98,
                        28,
                        1,
                        1
                    ],

                    backgroundColor: [
                        '#08752a',
                        '#ffad00',
                        '#16a34a',
                        '#8e00c7'
                    ],

                    borderColor: '#ffffff',

                    borderWidth: 3

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: '62%',

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });


<\/script>


</body>
</html>`;export{n as default};
