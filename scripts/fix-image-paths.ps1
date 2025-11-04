# Fix-image-paths.ps1
# More robust fixer that handles several variants of Windows-style paths in HTML/XML/MD files.
# - Converts occurrences like "\assets\", "/\assets\", "\assets/" etc. into "/assets/"
# - Then normalizes any remaining backslashes under the /assets/ subtree to forward slashes
# - Fixes known missing reference 'homme-dessous-800.webp' -> 'homme-dessous.jpg'

$root = Get-Location
Write-Output "Scanning files under: $($root.Path)"
$files = Get-ChildItem -Path $root -Include *.html,*.xml,*.md -Recurse -File -ErrorAction SilentlyContinue
$boundaryPattern = '[/\\]assets[\\/]'
foreach ($f in $files) {
    try {
        $p = $f.FullName
        $c = Get-Content -LiteralPath $p -Raw -ErrorAction SilentlyContinue
        if ([string]::IsNullOrEmpty($c)) { continue }

        $new = $c -replace $boundaryPattern, '/assets/'    # handle leading/trailing slash/backslash variants

        # If the file now contains /assets/ but still has backslashes anywhere, replace backslashes
        # inside the file to forward slashes. We limit this to files that mention '/assets/' to avoid
        # touching unrelated backslashes in other contexts.
        if ($new -match '/assets/' -and $new -match '\\') {
            $new = $new -replace '\\','/'
        }

        # Known filename normalization
        $new = $new -replace 'homme-dessous-800.webp','homme-dessous.jpg'

        if ($new -ne $c) {
            Set-Content -LiteralPath $p -Value $new
            Write-Output "Updated: $p"
        }
    } catch {
        Write-Warning "Error processing $($f.FullName): $_"
    }
}
Write-Output "Done."