<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EleeSiWeb Admin</title>
    @vite('resources/js/app.js')
</head>
<body>
    <div id="app" data-page="{{ $page }}" data-error="{{ $loginError ?? '' }}"></div>
</body>
</html>
