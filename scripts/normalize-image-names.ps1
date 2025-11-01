$root = Get-Location
$imagesPath = Join-Path $root 'assets\images'
Write-Output "Scanning images under: $imagesPath"
$files = Get-ChildItem -Path $imagesPath -Recurse -File | Where-Object { $_.Name -match '\s' -or $_.Name -cmatch '[^\u0000-\u007F]' }
if ($files.Count -eq 0) { Write-Output 'No files to rename.'; exit 0 }
foreach ($f in $files) {
    $old = $f.FullName
    $name = $f.BaseName
    $ext = $f.Extension
    # remove diacritics
    $norm = $name.Normalize([System.Text.NormalizationForm]::FormD)
    $chars = $norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne 'NonSpacingMark' }
    $clean = -join $chars
    # replace spaces with hyphens, remove other unsafe chars, collapse hyphens
    $clean = $clean -replace '\s+','-' -replace '[^A-Za-z0-9\-_.]','' -replace '-+','-'
    $clean = $clean.Trim('-').ToLower()
    if ([string]::IsNullOrWhiteSpace($clean)) { $clean = 'img' + (Get-Random -Minimum 1000 -Maximum 9999) }
    $dir = $f.DirectoryName
    $newName = $clean + $ext.ToLower()
    $newPath = Join-Path $dir $newName
    $counter = 1
    while (Test-Path $newPath) {
        $newName = $clean + '-' + $counter + $ext.ToLower()
        $newPath = Join-Path $dir $newName
        $counter++
    }
    Rename-Item -LiteralPath $old -NewName (Split-Path $newPath -Leaf)
    Write-Output "Renamed: '$($f.Name)' -> '$(Split-Path $newPath -Leaf)'"
    $oldNameOnly = $f.Name
    $newNameOnly = Split-Path $newPath -Leaf
    # Update references in HTML/XML/MD files
    Get-ChildItem -Path $root -Include *.html,*.xml,*.md -Recurse | ForEach-Object {
        $path = $_.FullName
        try {
            $content = Get-Content -LiteralPath $path -Raw -ErrorAction Stop
            if ($content -like "*${oldNameOnly}*") {
                $newContent = $content -replace [Regex]::Escape($oldNameOnly), $newNameOnly
                Set-Content -LiteralPath $path -Value $newContent
                Write-Output "Updated refs in: $path"
            }
        } catch {
            Write-Output "Skipped file $path due to read error"
        }
    }
}
Write-Output 'Done.'
