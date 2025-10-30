#!/bin/bash

# Test script for /api/vehicles/filter-counts endpoint
# Run this after starting the backend server

BASE_URL="http://localhost:8080/api/vehicles"

echo "========================================="
echo "Testing Vehicle Filter Counts API"
echo "========================================="
echo ""

# Test 1: No filters (get all counts)
echo "Test 1: No filters - Get all vehicle counts"
echo "GET $BASE_URL/filter-counts"
curl -s "$BASE_URL/filter-counts" | json_pp
echo ""
echo "========================================="
echo ""

# Test 2: Filter by make
echo "Test 2: Filter by make=Toyota"
echo "GET $BASE_URL/filter-counts?make=Toyota"
curl -s "$BASE_URL/filter-counts?make=Toyota" | json_pp
echo ""
echo "========================================="
echo ""

# Test 3: Filter by make and province
echo "Test 3: Filter by make=Toyota&province=Gauteng"
echo "GET $BASE_URL/filter-counts?make=Toyota&province=Gauteng"
curl -s "$BASE_URL/filter-counts?make=Toyota&province=Gauteng" | json_pp
echo ""
echo "========================================="
echo ""

# Test 4: Filter by multiple body types
echo "Test 4: Filter by bodyTypes=SUV&bodyTypes=Sedan"
echo "GET $BASE_URL/filter-counts?bodyTypes=SUV&bodyTypes=Sedan"
curl -s "$BASE_URL/filter-counts?bodyTypes=SUV&bodyTypes=Sedan" | json_pp
echo ""
echo "========================================="
echo ""

# Test 5: Filter by fuel types
echo "Test 5: Filter by fuelTypes=Petrol&fuelTypes=Diesel"
echo "GET $BASE_URL/filter-counts?fuelTypes=Petrol&fuelTypes=Diesel"
curl -s "$BASE_URL/filter-counts?fuelTypes=Petrol&fuelTypes=Diesel" | json_pp
echo ""
echo "========================================="
echo ""

# Test 6: Filter by price range
echo "Test 6: Filter by priceMin=200000&priceMax=500000"
echo "GET $BASE_URL/filter-counts?priceMin=200000&priceMax=500000"
curl -s "$BASE_URL/filter-counts?priceMin=200000&priceMax=500000" | json_pp
echo ""
echo "========================================="
echo ""

# Test 7: Filter by year range
echo "Test 7: Filter by yearMin=2020&yearMax=2023"
echo "GET $BASE_URL/filter-counts?yearMin=2020&yearMax=2023"
curl -s "$BASE_URL/filter-counts?yearMin=2020&yearMax=2023" | json_pp
echo ""
echo "========================================="
echo ""

# Test 8: Complex filter combination
echo "Test 8: Complex filters - make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020"
echo "GET $BASE_URL/filter-counts?make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020"
curl -s "$BASE_URL/filter-counts?make=Toyota&province=Gauteng&fuelTypes=Petrol&yearMin=2020" | json_pp
echo ""
echo "========================================="
echo ""

echo "All tests completed!"
