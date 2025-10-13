-- Insert test vehicle data
INSERT INTO vehicles (
    used_vehicle_stock_id, make_name, model_name, variant_name, year, price, mileage, 
    body_type, fuel_type, transmission, province_name, condition, engine_size, colour,
    stock_code, vin, registration, created_at, updated_at
) VALUES
-- BMW Vehicles
(1001, 'BMW', '3 Series', '320i M Sport', 2021, 650000, 35000, 'Sedan', 'Petrol', 'Automatic', 'Gauteng', 'Excellent', '2.0L', 'Mineral Grey', 'BMW001', '1BMWG31040B123456', 'GP-123-ABC', NOW(), NOW()),
(1002, 'BMW', '3 Series', '330i xDrive', 2020, 580000, 48000, 'Sedan', 'Petrol', 'Automatic', 'Western Cape', 'Good', '2.0L', 'Alpine White', 'BMW002', '1BMWG31040B123457', 'CA-456-DEF', NOW(), NOW()),
(1003, 'BMW', 'X3', 'xDrive30d M Sport', 2022, 950000, 22000, 'SUV', 'Diesel', 'Automatic', 'KwaZulu-Natal', 'Excellent', '3.0L', 'Black Sapphire', 'BMW003', '1BMWX83040B123458', 'ND-789-GHI', NOW(), NOW()),
(1004, 'BMW', 'X5', 'xDrive40i M Sport', 2021, 1200000, 30000, 'SUV', 'Petrol', 'Automatic', 'Gauteng', 'Excellent', '3.0L', 'Mineral White', 'BMW004', '1BMWX53040B123459', 'GP-321-JKL', NOW(), NOW()),
(1005, 'BMW', 'X1', 'sDrive20i', 2020, 480000, 55000, 'SUV', 'Petrol', 'Automatic', 'Western Cape', 'Good', '2.0L', 'Storm Bay', 'BMW005', '1BMWX13040B123460', 'CA-654-MNO', NOW(), NOW()),

-- Mercedes-Benz Vehicles  
(2001, 'Mercedes-Benz', 'C-Class', 'C220d AMG Line', 2021, 720000, 28000, 'Sedan', 'Diesel', 'Automatic', 'Gauteng', 'Excellent', '2.0L', 'Obsidian Black', 'MB001', '1MERC31040B123461', 'GP-987-PQR', NOW(), NOW()),
(2002, 'Mercedes-Benz', 'GLC', 'GLC300 4MATIC', 2022, 890000, 18000, 'SUV', 'Petrol', 'Automatic', 'KwaZulu-Natal', 'Excellent', '2.0L', 'Iridium Silver', 'MB002', '1MERC83040B123462', 'ND-123-STU', NOW(), NOW()),
(2003, 'Mercedes-Benz', 'E-Class', 'E250 Avantgarde', 2020, 650000, 42000, 'Sedan', 'Petrol', 'Automatic', 'Western Cape', 'Good', '2.0L', 'Polar White', 'MB003', '1MERC21040B123463', 'CA-456-VWX', NOW(), NOW()),
(2004, 'Mercedes-Benz', 'A-Class', 'A200 AMG Line', 2021, 520000, 33000, 'Hatchback', 'Petrol', 'Automatic', 'Gauteng', 'Excellent', '1.3L', 'Mountain Grey', 'MB004', '1MERC11040B123464', 'GP-789-YZA', NOW(), NOW()),

-- Audi Vehicles
(3001, 'Audi', 'A4', '2.0T FSI S tronic', 2021, 680000, 31000, 'Sedan', 'Petrol', 'Automatic', 'Gauteng', 'Excellent', '2.0L', 'Ibis White', 'AUD001', '1AUDIA4040B123465', 'GP-147-BCD', NOW(), NOW()),
(3002, 'Audi', 'Q5', '45 TFSI quattro S line', 2022, 980000, 15000, 'SUV', 'Petrol', 'Automatic', 'Western Cape', 'Excellent', '2.0L', 'Mythos Black', 'AUD002', 'AUDIQ5040B123466', 'CA-258-EFG', NOW(), NOW()),
(3003, 'Audi', 'A3', '1.4T FSI S tronic', 2020, 450000, 47000, 'Hatchback', 'Petrol', 'Automatic', 'KwaZulu-Natal', 'Good', '1.4L', 'Florett Silver', 'AUD003', '1AUDIA3040B123467', 'ND-369-HIJ', NOW(), NOW()),

-- Toyota Vehicles
(4001, 'Toyota', 'Hilux', '2.8 GD-6 Double Cab Legend', 2021, 680000, 35000, 'Bakkie', 'Diesel', 'Automatic', 'Gauteng', 'Excellent', '2.8L', 'White', 'TOY001', 'TOY12345678901234', 'GP-753-KLM', NOW(), NOW()),
(4002, 'Toyota', 'Hilux', '2.4 GD-6 Single Cab', 2020, 450000, 65000, 'Bakkie', 'Diesel', 'Manual', 'Limpopo', 'Good', '2.4L', 'Silver', 'TOY002', 'TOY12345678901235', 'LP-159-NOP', NOW(), NOW()),
(4003, 'Toyota', 'Corolla', '1.2T XS CVT', 2021, 350000, 28000, 'Sedan', 'Petrol', 'CVT', 'Western Cape', 'Excellent', '1.2L', 'Silver Metallic', 'TOY003', 'TOY12345678901236', 'CA-951-QRS', NOW(), NOW()),
(4004, 'Toyota', 'RAV4', '2.0 GX CVT', 2022, 580000, 12000, 'SUV', 'Petrol', 'CVT', 'Gauteng', 'Excellent', '2.0L', 'Red Mica', 'TOY004', 'TOY12345678901237', 'GP-357-TUV', NOW(), NOW()),
(4005, 'Toyota', 'Fortuner', '2.8 GD-6 4x4 VX', 2021, 750000, 38000, 'SUV', 'Diesel', 'Automatic', 'KwaZulu-Natal', 'Excellent', '2.8L', 'Pearl White', 'TOY005', 'TOY12345678901238', 'ND-468-WXY', NOW(), NOW()),

-- Ford Vehicles
(5001, 'Ford', 'Ranger', '3.2 Double Cab Wildtrak', 2020, 520000, 55000, 'Bakkie', 'Diesel', 'Automatic', 'Eastern Cape', 'Good', '3.2L', 'Lightning Blue', 'FOR001', 'FOR12345678901239', 'EC-579-ZAB', NOW(), NOW()),
(5002, 'Ford', 'EcoSport', '1.0T Titanium', 2021, 320000, 25000, 'SUV', 'Petrol', 'Automatic', 'Gauteng', 'Excellent', '1.0L', 'Smoke Grey', 'FOR002', 'FOR12345678901240', 'GP-680-CDE', NOW(), NOW()),
(5003, 'Ford', 'Fiesta', '1.0T Trend', 2020, 280000, 42000, 'Hatchback', 'Petrol', 'Manual', 'Western Cape', 'Good', '1.0L', 'Magnetic Grey', 'FOR003', 'FOR12345678901241', 'CA-791-FGH', NOW(), NOW()),

-- Volkswagen Vehicles
(6001, 'Volkswagen', 'Amarok', '3.0 V6 TDI Highline', 2021, 720000, 32000, 'Bakkie', 'Diesel', 'Automatic', 'Gauteng', 'Excellent', '3.0L', 'Indium Grey', 'VW001', 'VW123456789012345', 'GP-123-IJK', NOW(), NOW()),
(6002, 'Volkswagen', 'Tiguan', '2.0 TSI Highline 4Motion', 2022, 650000, 18000, 'SUV', 'Petrol', 'Automatic', 'Western Cape', 'Excellent', '2.0L', 'Pure White', 'VW002', 'VW123456789012346', 'CA-234-LMN', NOW(), NOW()),
(6003, 'Volkswagen', 'Golf', '1.4 TSI Comfortline', 2020, 380000, 45000, 'Hatchback', 'Petrol', 'Automatic', 'KwaZulu-Natal', 'Good', '1.4L', 'Tornado Red', 'VW003', 'VW123456789012347', 'ND-345-OPQ', NOW(), NOW());