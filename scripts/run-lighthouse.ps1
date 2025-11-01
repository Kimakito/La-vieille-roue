# run-lighthouse.ps1
# Starts a simple static server for ./_site, runs Lighthouse headless, saves JSON report, then stops the server.

$ErrorActionPreference = 'Stop'

$server = Start-Process -FilePath 'npx' -ArgumentList 'http-server','./_site','-p','4000','--silent' -PassThru
Start-Sleep -Seconds 2
Write-Output "Server started PID:$($server.Id)"

# Run lighthouse via npx (will download if needed)
npx lighthouse http://127.0.0.1:4000 --chrome-flags='--headless' --output=json --output-path=./lighthouse-report.json --only-categories=performance,accessibility,seo,best-practices --quiet
$exit = $LASTEXITCODE

# Stop the server process
Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
Write-Output "Lighthouse exit code: $exit"
Write-Output "Report written to: ./lighthouse-report.json"
