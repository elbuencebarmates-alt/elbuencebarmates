$ErrorActionPreference = "Stop"
$path = "C:\Users\usuario\.gemini\antigravity\scratch\cebateuno-store"
$files = Get-ChildItem -Path $path -Recurse -Include *.html,*.js

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content.Replace("instagram.com/buencebar", "instagram.com/elbuen.cebar")
    $newContent = $newContent.Replace("@buencebar", "@elbuen.cebar")
    
    if ($content -cne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    }
}
Write-Host "Instagram handle update complete"
