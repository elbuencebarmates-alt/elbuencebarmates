$ErrorActionPreference = "Stop"
$path = "C:\Users\usuario\.gemini\antigravity\scratch\cebateuno-store"
$files = Get-ChildItem -Path $path -Recurse -Include *.html,*.js,*.svg

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content.Replace("Cebate Uno", "El Buen Cebar")
    $newContent = $newContent.Replace("Cebate <span>Uno</span>", "El Buen <span>Cebar</span>")
    $newContent = $newContent.Replace("cebateuno_cart", "elbuencebar_cart")
    $newContent = $newContent.Replace("cebateuno.store", "elbuencebar.com")
    $newContent = $newContent.Replace("instagram.com/cebateuno", "instagram.com/buencebar")
    $newContent = $newContent.Replace("@cebateuno", "@buencebar")
    $newContent = $newContent.Replace("cebateuno", "elbuencebar")
    $newContent = $newContent.Replace("CEBATE UNO", "EL BUEN CEBAR")
    
    if ($content -cne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    }
}
Write-Host "Rename complete"
