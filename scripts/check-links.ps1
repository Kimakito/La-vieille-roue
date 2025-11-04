$root = "C:\Users\ikami\Desktop\Dev\La vieille roue"
Get-ChildItem -Path $root -Recurse -Include *.html -File | ForEach-Object {
  $path = $_.FullName
  $content = Get-Content $path -Raw
  $patternDouble = '(?:href|src)\s*=\s*"(/[^\"]+)"'
  $patternSingle = "(?:href|src)\s*=\s*'(/[^']+)'"
  $matches = [regex]::Matches($content, $patternDouble)
  foreach($m in $matches) {
    $target = $m.Groups[1].Value
    $clean = $target.TrimStart('/')
    $candidates = @(
      Join-Path $root ($clean.Replace('/','\\')),
      Join-Path $root (($clean + '.html').Replace('/','\\')),
      Join-Path $root ((Join-Path $clean 'index.html').Replace('/','\\')),
      Join-Path $root ((($clean.TrimEnd('/')) + '.html').Replace('/','\\'))
    )
    $exists = $false
    foreach($c in $candidates){ if(Test-Path $c){ $exists = $true; break } }
    if(-not $exists){ Write-Output "BROKEN: $path -> $target (checked: $($candidates -join '; '))" }
  }
  $matches2 = [regex]::Matches($content, $patternSingle)
  foreach($m in $matches2) {
    $target = $m.Groups[1].Value
    $clean = $target.TrimStart('/')
    $candidates = @(
      Join-Path $root ($clean.Replace('/','\\')),
      Join-Path $root (($clean + '.html').Replace('/','\\')),
      Join-Path $root ((Join-Path $clean 'index.html').Replace('/','\\')),
      Join-Path $root ((($clean.TrimEnd('/')) + '.html').Replace('/','\\'))
    )
    $exists = $false
    foreach($c in $candidates){ if(Test-Path $c){ $exists = $true; break } }
    if(-not $exists){ Write-Output "BROKEN: $path -> $target (checked: $($candidates -join '; '))" }
  }
}