# Fix-image-refs.ps1
# Scans HTML/XML/MD files for references to /assets/images and attempts to fix broken references
# by normalizing the referenced filename (remove accents, spaces -> hyphens, lowercase) and
# replacing the reference when a matching file exists.

$root = Get-Location
$imagesRoot = Join-Path $root 'assets\images'
Write-Output "Scanning references for /assets/images under: $root"

# Build a set of existing files (relative paths starting with /assets/images/...)
$existing = @{}
Get-ChildItem -Path $imagesRoot -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($root.Path.Length) -replace '\\\\','/'
    # ensure leading slash
    if (-not $relative.StartsWith('/')) { $relative = '/' + $relative }
    $existing[$relative.ToLower()] = $_.FullName
}

$pattern = '/assets/images/[^\s"<>\)>]+'
$files = Get-ChildItem -Path $root -Include *.html,*.xml,*.md -Recurse
$missingRefs = @()
foreach ($f in $files) {
    $content = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $matches = [regex]::Matches($content, $pattern)
    if ($matches.Count -eq 0) { continue }
    $updatedContent = $content
    $changed = $false
    foreach ($m in $matches) {
        $ref = $m.Value.Trim()
    # strip trailing punctuation and whitespace
    $cleanRef = $ref -replace '[\p{P}\s]+$',''
        $lc = $cleanRef.ToLower()
        if ($existing.ContainsKey($lc)) { continue } # file exists
        # try normalization on filename part
        $uriParts = $cleanRef -split '/'
        $fileName = $uriParts[-1]
        # normalize: remove diacritics, spaces->-, remove unsafe chars
        $nameOnly = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
        $ext = [System.IO.Path]::GetExtension($fileName)
        $norm = $nameOnly.Normalize([System.Text.NormalizationForm]::FormD)
        $chars = $norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne 'NonSpacingMark' }
        $cleanName = -join $chars
        $cleanName = $cleanName -replace '\s+','-' -replace '[^A-Za-z0-9\-_.]','' -replace '-+','-'
        $cleanName = $cleanName.Trim('-').ToLower()
        if ([string]::IsNullOrWhiteSpace($cleanName)) { continue }
        $candidate = ($uriParts[0..($uriParts.Length-2)] -join '/') + '/' + $cleanName + $ext.ToLower()
        # ensure leading slash
        if (-not $candidate.StartsWith('/')) { $candidate = '/' + $candidate }
        if ($existing.ContainsKey($candidate.ToLower())) {
            # replace all occurrences of original ref with candidate
            $escapedOld = [regex]::Escape($cleanRef)
            $updatedContent = [regex]::Replace($updatedContent, $escapedOld, $candidate)
            Write-Output "In $($f.FullName): replaced $cleanRef -> $candidate"
            $changed = $true
        } else {
            # try broader candidate variations: look for any file with same cleaned name in images tree
            $found = Get-ChildItem -Path $imagesRoot -Recurse -File | Where-Object {
                $cf = $_.BaseName.Normalize([System.Text.NormalizationForm]::FormD).ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne 'NonSpacingMark' } | ForEach-Object -Begin {$s=''} -Process { $s += $_ } -End { $s }
                $cf = ($cf -replace '\s+','-' -replace '[^A-Za-z0-9\-_.]','' -replace '-+','-').ToLower()
                $cf -eq $cleanName
            }
            if ($found) {
                $first = $found | Select-Object -First 1
                $rel = $first.FullName.Substring($root.Path.Length) -replace '\\\\','/'
                if (-not $rel.StartsWith('/')) { $rel = '/' + $rel }
                $escapedOld = [regex]::Escape($cleanRef)
                $updatedContent = [regex]::Replace($updatedContent, $escapedOld, $rel)
                Write-Output "In $($f.FullName): replaced $cleanRef -> $rel (found by name)"
                $changed = $true
            } else {
                $missingRefs += @{ file = $f.FullName; ref = $cleanRef }
            }
        }
    }
    if ($changed) {
        Set-Content -LiteralPath $f.FullName -Value $updatedContent
    }
}

Write-Output "Done. Missing references count: $($missingRefs.Count)"
if ($missingRefs.Count -gt 0) {
    Write-Output "List of missing references:"
    $missingRefs | ForEach-Object { Write-Output "File: $($_.file) -> Missing: $($_.ref)" }
}
