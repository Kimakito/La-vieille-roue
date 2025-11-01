# add-img-lazy.ps1
# Adds loading="lazy" decoding="async" fetchpriority="low" to <img> tags missing a loading attribute

$root = Get-Location
$files = Get-ChildItem -Path $root -Include *.html,*.xml,*.md -Recurse
Write-Output "Scanning files for <img> tags under: $root"

foreach ($f in $files) {
    $text = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $text) { continue }
    $pattern = '<img\b([^>]*)>'
    $script:changed = $false
    $text2 = [regex]::Replace($text, $pattern, {
        param($m)
        $attrs = $m.Groups[1].Value
        if ($attrs -match '\bloading\s*=') { return $m.Value } # already has loading
        # Add lazy attributes
        $insertion = ' loading="lazy" decoding="async" fetchpriority="low"'
        $replacement = "<img$attrs$insertion>"
        $script:changed = $true
        return $replacement
    }, 'IgnoreCase')
    if ($script:changed) {
        Set-Content -LiteralPath $f.FullName -Value $text2
        Write-Output "Updated images in: $($f.FullName)"
    }
}
Write-Output "Done adding lazy attributes."