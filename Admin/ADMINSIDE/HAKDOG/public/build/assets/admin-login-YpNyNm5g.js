const r=`<!DOCTYPE html>\r
<html lang="en">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
\r
    <title>EleeSiWeb - Admin Login</title>\r
\r
    <style>\r
\r
        * {\r
            box-sizing: border-box;\r
            margin: 0;\r
            padding: 0;\r
        }\r
\r
        body {\r
            font-family: Arial, Helvetica, sans-serif;\r
            background: #f4f7f5;\r
            min-height: 100vh;\r
\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
        }\r
\r
        .login-container {\r
            width: 420px;\r
            max-width: 90%;\r
        }\r
\r
        .login-card {\r
            background: white;\r
            border-radius: 14px;\r
            padding: 40px;\r
            box-shadow: 0 8px 30px rgba(0,0,0,0.10);\r
        }\r
\r
        /* ================= LOGO ================= */\r
\r
        .logo {\r
            text-align: center;\r
            font-size: 42px;\r
            font-weight: 900;\r
            letter-spacing: -3px;\r
            color: #ffbd00;\r
            margin-bottom: 3px;\r
        }\r
\r
        .logo span {\r
            color: #00551f;\r
        }\r
\r
        .hardware {\r
            text-align: center;\r
            color: #ffbd00;\r
            font-size: 13px;\r
            font-weight: bold;\r
            letter-spacing: 1px;\r
            margin-bottom: 30px;\r
        }\r
\r
        /* ================= TITLE ================= */\r
\r
        .login-title {\r
            text-align: center;\r
            color: #147a36;\r
            font-size: 27px;\r
            font-weight: 600;\r
            margin-bottom: 7px;\r
        }\r
\r
        .login-subtitle {\r
            text-align: center;\r
            color: #777;\r
            font-size: 14px;\r
            margin-bottom: 28px;\r
        }\r
\r
        /* ================= FORM ================= */\r
\r
        .form-group {\r
            margin-bottom: 18px;\r
        }\r
\r
        .form-group label {\r
            display: block;\r
            font-size: 14px;\r
            font-weight: 600;\r
            color: #333;\r
            margin-bottom: 7px;\r
        }\r
\r
        .form-group input {\r
            width: 100%;\r
            height: 48px;\r
            border: 1px solid #d8d8d8;\r
            border-radius: 8px;\r
            padding: 0 14px;\r
            font-size: 15px;\r
            outline: none;\r
        }\r
\r
        .form-group input:focus {\r
            border-color: #299b4d;\r
            box-shadow: 0 0 0 3px rgba(41,155,77,0.10);\r
        }\r
\r
        /* ================= PASSWORD ================= */\r
\r
        .password-wrapper {\r
            position: relative;\r
        }\r
\r
        .password-wrapper input {\r
            padding-right: 50px;\r
        }\r
\r
        .show-password {\r
            position: absolute;\r
            right: 14px;\r
            top: 50%;\r
            transform: translateY(-50%);\r
\r
            border: none;\r
            background: transparent;\r
            cursor: pointer;\r
\r
            font-size: 18px;\r
            color: #777;\r
        }\r
\r
        /* ================= REMEMBER ================= */\r
\r
        .remember {\r
            display: flex;\r
            align-items: center;\r
            gap: 8px;\r
            margin-bottom: 22px;\r
            font-size: 13px;\r
            color: #555;\r
        }\r
\r
        .remember input {\r
            width: 15px;\r
            height: 15px;\r
            accent-color: #08752f;\r
        }\r
\r
        /* ================= LOGIN BUTTON ================= */\r
\r
        .login-btn {\r
            width: 100%;\r
            height: 48px;\r
\r
            background: #08752f;\r
            color: white;\r
\r
            border: none;\r
            border-radius: 8px;\r
\r
            font-size: 15px;\r
            font-weight: 600;\r
\r
            cursor: pointer;\r
            transition: 0.2s;\r
        }\r
\r
        .login-btn:hover {\r
            background: #065b25;\r
        }\r
\r
        /* ================= ERROR ================= */\r
\r
        .error-message {\r
            background: #ffe3e3;\r
            color: #c62828;\r
            border: 1px solid #ffc7c7;\r
\r
            padding: 10px 12px;\r
            border-radius: 7px;\r
\r
            font-size: 13px;\r
            margin-bottom: 18px;\r
        }\r
\r
        /* ================= FOOTER ================= */\r
\r
        .footer {\r
            text-align: center;\r
            margin-top: 22px;\r
            color: #999;\r
            font-size: 12px;\r
        }\r
\r
        @media(max-width: 500px) {\r
\r
            .login-card {\r
                padding: 30px 25px;\r
            }\r
\r
            .logo {\r
                font-size: 36px;\r
            }\r
\r
            .login-title {\r
                font-size: 24px;\r
            }\r
        }\r
\r
    </style>\r
</head>\r
\r
<body>\r
\r
    <div class="login-container">\r
\r
        <div class="login-card">\r
\r
            <!-- LOGO -->\r
\r
            <div class="logo">\r
                <span>E</span>LEE\r
            </div>\r
\r
            <div class="hardware">\r
                HARDWARE\r
            </div>\r
\r
\r
            <!-- TITLE -->\r
\r
            <div class="login-title">\r
                Admin Login\r
            </div>\r
\r
            <div class="login-subtitle">\r
                Sign in to access the EleeSiWeb admin system\r
            </div>\r
\r
\r
            <!-- ERROR MESSAGE -->\r
\r
            @if(session('error'))\r
\r
                <div class="error-message">\r
                    {{ session('error') }}\r
                </div>\r
\r
            @endif\r
\r
\r
            <!-- LOGIN FORM -->\r
\r
            <form action="{{ url('/admin/login') }}" method="POST">\r
\r
                @csrf\r
\r
\r
                <!-- USERNAME -->\r
\r
                <div class="form-group">\r
\r
                    <label for="username">\r
                        Username\r
                    </label>\r
\r
                    <input\r
                        type="text"\r
                        id="username"\r
                        name="username"\r
                        placeholder="Enter admin username"\r
                        required\r
                    >\r
\r
                </div>\r
\r
\r
                <!-- PASSWORD -->\r
\r
                <div class="form-group">\r
\r
                    <label for="password">\r
                        Password\r
                    </label>\r
\r
                    <div class="password-wrapper">\r
\r
                        <input\r
                            type="password"\r
                            id="password"\r
                            name="password"\r
                            placeholder="Enter admin password"\r
                            required\r
                        >\r
\r
                        <button\r
                            type="button"\r
                            class="show-password"\r
                            onclick="togglePassword()">\r
                            👁\r
                        </button>\r
\r
                    </div>\r
\r
                </div>\r
\r
\r
                <!-- REMEMBER -->\r
\r
                <div class="remember">\r
\r
                    <input\r
                        type="checkbox"\r
                        id="remember"\r
                        name="remember"\r
                    >\r
\r
                    <label for="remember">\r
                        Remember me\r
                    </label>\r
\r
                </div>\r
\r
\r
                <!-- LOGIN -->\r
\r
                <button\r
                    type="submit"\r
                    class="login-btn">\r
\r
                    Login \r
\r
                </button>\r
\r
            </form>\r
\r
\r
            <div class="footer">\r
                EleeSiWeb Admin System\r
            </div>\r
\r
        </div>\r
\r
    </div>\r
\r
\r
    <script>\r
\r
        function togglePassword() {\r
\r
            const password =\r
                document.getElementById("password");\r
\r
            const button =\r
                document.querySelector(".show-password");\r
\r
\r
            if (password.type === "password") {\r
\r
                password.type = "text";\r
\r
                button.innerText = "🙈";\r
\r
            } else {\r
\r
                password.type = "password";\r
\r
                button.innerText = "👁";\r
\r
            }\r
\r
        }\r
\r
    <\/script>\r
\r
</body>\r
</html>`;export{r as default};
