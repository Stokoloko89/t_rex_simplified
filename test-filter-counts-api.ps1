# PowerShell test script for /api/vehicles/filter-counts endpoint
# Run this after starting the backend server

$BaseUrl = "http://localhost:8080/api/vehicles"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Testing Vehicle Filter Counts API" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: No filters (get all counts)
Write-Host "Test 1: No filters - Get all vehicle counts" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 2: Filter by make
Write-Host "Test 2: Filter by make=Toyota" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?make=Toyota" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?make=Toyota" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 3: Filter by make and province
Write-Host "Test 3: Filter by make=Toyota&province=Gauteng" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?make=Toyota&province=Gauteng" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?make=Toyota&province=Gauteng" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 4: Filter by multiple body types
Write-Host "Test 4: Filter by bodyTypes=SUV&bodyTypes=Sedan" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?bodyTypes=SUV&bodyTypes=Sedan" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?bodyTypes=SUV&bodyTypes=Sedan" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 5: Filter by fuel types
Write-Host "Test 5: Filter by fuelTypes=Petrol&fuelTypes=Diesel" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?fuelTypes=Petrol&fuelTypes=Diesel" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?fuelTypes=Petrol&fuelTypes=Diesel" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 6: Filter by price range
Write-Host "Test 6: Filter by priceMin=200000&priceMax=500000" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?priceMin=200000&priceMax=500000" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?priceMin=200000&priceMax=500000" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 7: Filter by year range
Write-Host "Test 7: Filter by yearMin=2020&yearMax=2023" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?yearMin=2020&yearMax=2023" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?yearMin=2020&yearMax=2023" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 8: Complex filter combination
Write-Host "Test 8: Complex filters - make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/filter-counts?make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/filter-counts?make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "All tests completed!" -ForegroundColor Green
