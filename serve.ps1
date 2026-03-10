# YONETICI HAKLARI KONTROLU (HttpListener icin gereklidir)
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Sunucu icin Yonetici (Administrator) izni gerekiyor. Lutfen cikan uyariya 'Evet' deyin..." -ForegroundColor Yellow
    try {
        Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$($MyInvocation.MyCommand.Path)`"" -Verb RunAs
    } catch {
        Write-Host "Yonetici izni verilmedi veya islem iptal edildi." -ForegroundColor Red
    }
    exit
}

$port = 8080
$appPath = "HurdaKompozisyonHazırlamaEkranı/index.html"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Sunucu baslatildi: http://127.0.0.1:$port/$appPath" -ForegroundColor Green
    Write-Host "Durdurmak icin Ctrl+C" -ForegroundColor Yellow
} catch {
    Write-Host "Sunucu baslatilamadi! Hata: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Baska bir program 8080 portunu kullaniyor olabilir." -ForegroundColor Yellow
    exit
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # RawUrl kullan; query string'i at
        $rawUrl = $request.RawUrl.Split("?")[0]
        if ($rawUrl -eq "/") { $rawUrl = "/$appPath" }

        # UTF-8 ile decode et
        $decoded = [System.Uri]::UnescapeDataString($rawUrl)
        $filePath = Join-Path $rootPath $decoded.TrimStart("/").Replace("/", "\")

        Write-Host "$($request.HttpMethod) $decoded" -ForegroundColor Cyan

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html"       { "text/html; charset=utf-8" }
                ".js"         { "application/javascript; charset=utf-8" }
                ".json"       { "application/json; charset=utf-8" }
                ".xml"        { "application/xml; charset=utf-8" }
                ".css"        { "text/css; charset=utf-8" }
                ".properties" { "text/plain; charset=utf-8" }
                ".png"        { "image/png" }
                ".jpg"        { "image/jpeg" }
                ".svg"        { "image/svg+xml" }
                default       { "application/octet-stream" }
            }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            Write-Host "  404: $filePath" -ForegroundColor Red
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decoded")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.OutputStream.Close()
    } catch {
        if ($listener.IsListening) { Write-Host "Hata: $_" -ForegroundColor Red }
    }
}
