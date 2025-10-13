-- Insert sample vehicles for testing
INSERT INTO vehicles (
    used_vehicle_stock_id, year, make_name, model_name, variant_name, vin, registration, 
    engine_no, mileage, colour, province_name, price, first_price, franchise,
    body_type, transmission, fuel_type, engine_size, stock_code, condition
) VALUES 
-- Additional Toyota Vehicles
(8570004, 2023, 'TOYOTA', 'Camry', '2.5 XS', 'JTNBF1AE0N4004004', 'PE23DGP', '2AR4004004', 15000, 'Black', 'Eastern Cape', 625000, 625000, 'Toyota', 'Sedan', 'Automatic', 'Petrol', '2.5L', 'TOY004', 'Excellent'),
(8570005, 2020, 'TOYOTA', 'Fortuner', '2.8 GD-6 4x4', 'MMTFR32G5L2005005', 'PTA20EGP', '1GD5005005', 65000, 'White', 'Gauteng', 695000, 695000, 'Toyota', 'SUV', 'Automatic', 'Diesel', '2.8L', 'TOY005', 'Good'),
(8570006, 2022, 'TOYOTA', 'Yaris', '1.5 XS CVT', 'VNKBR32F5N2006006', 'BFN22FGP', '2NZ6006006', 28000, 'Blue', 'Free State', 285000, 285000, 'Toyota', 'Hatchback', 'CVT', 'Petrol', '1.5L', 'TOY006', 'Good'),

-- BMW Vehicles
(8570051, 2023, 'BMW', '3 Series', '320i M Sport', 'WBA8F1G57N7051051', 'CA23KBMW', 'B4851051', 22000, 'Alpine White', 'Western Cape', 745000, 745000, 'BMW', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'BMW051', 'Excellent'),
(8570052, 2022, 'BMW', 'X3', 'xDrive20d M Sport', 'WBY8P0C58M7052052', 'JHB22BMW', 'B4752052', 38000, 'Storm Bay', 'Gauteng', 885000, 885000, 'BMW', 'SUV', 'Automatic', 'Diesel', '2.0L', 'BMW052', 'Good'),
(8570053, 2021, 'BMW', '5 Series', '520d M Sport', 'WBA5R1C09L7053053', 'DBN21BMW', 'B4753053', 42000, 'Jet Black', 'KwaZulu-Natal', 925000, 925000, 'BMW', 'Sedan', 'Automatic', 'Diesel', '2.0L', 'BMW053', 'Good'),

-- Mercedes-Benz Vehicles
(8570076, 2023, 'MERCEDES-BENZ', 'C-Class', 'C200 AMG Line', 'WDD2050422F076076', 'CA23MERC', 'M26476076', 20000, 'Polar White', 'Western Cape', 785000, 785000, 'Mercedes-Benz', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'MER076', 'Excellent'),
(8570077, 2022, 'MERCEDES-BENZ', 'GLC', 'GLC220d AMG', 'WDC2536472F077077', 'JHB22MER', 'OM65477077', 35000, 'Obsidian Black', 'Gauteng', 945000, 945000, 'Mercedes-Benz', 'SUV', 'Automatic', 'Diesel', '2.2L', 'MER077', 'Good'),
(8570078, 2021, 'MERCEDES-BENZ', 'E-Class', 'E200 AMG Line', 'WDD2132461F078078', 'DBN21MER', 'M26478078', 45000, 'Selenite Grey', 'KwaZulu-Natal', 1045000, 1045000, 'Mercedes-Benz', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'MER078', 'Good'),

-- Volkswagen Vehicles
(8570101, 2023, 'VOLKSWAGEN', 'Polo', '1.0 TSI Comfortline', 'WVWZZZ6RZPF101101', 'CA23VW01', '04C101101', 25000, 'Pure White', 'Western Cape', 345000, 345000, 'Volkswagen', 'Hatchback', 'Manual', 'Petrol', '1.0L', 'VW101', 'Excellent'),
(8570102, 2022, 'VOLKSWAGEN', 'Golf', '1.4 TSI Comfortline', 'WVWZZZ5KZMF102102', 'JHB22VW2', '04E102102', 32000, 'Reflex Silver', 'Gauteng', 485000, 485000, 'Volkswagen', 'Hatchback', 'Automatic', 'Petrol', '1.4L', 'VW102', 'Good'),
(8570103, 2021, 'VOLKSWAGEN', 'Tiguan', '2.0 TSI 4Motion', 'WVGZZZ5NZMF103103', 'DBN21VW3', '04E103103', 38000, 'Atlantic Blue', 'KwaZulu-Natal', 645000, 645000, 'Volkswagen', 'SUV', 'Automatic', 'Petrol', '2.0L', 'VW103', 'Good'),

-- Ford Vehicles
(8570131, 2023, 'FORD', 'Fiesta', '1.0 EcoBoost Titanium', 'WF0BXXGAJBNF131131', 'CA23FOR1', 'M2D131131', 28000, 'Race Red', 'Western Cape', 325000, 325000, 'Ford', 'Hatchback', 'Manual', 'Petrol', '1.0L', 'FOR131', 'Excellent'),
(8570132, 2022, 'FORD', 'Focus', '1.5 EcoBoost Titanium', 'WF0DXXGDXNF132132', 'JHB22FOR', 'M8D132132', 35000, 'Moondust Silver', 'Gauteng', 425000, 425000, 'Ford', 'Hatchback', 'Automatic', 'Petrol', '1.5L', 'FOR132', 'Good'),

-- Nissan Vehicles
(8570181, 2023, 'NISSAN', 'Micra', '1.2 Active Visia', 'SJNFAAE10U2181181', 'CA23NIS1', 'HR12181181', 28000, 'Pearl White', 'Western Cape', 285000, 285000, 'Nissan', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'NIS181', 'Excellent'),
(8570182, 2022, 'NISSAN', 'Qashqai', '1.5 dCi Acenta', 'SJNFCAE10N2182182', 'JHB22NIS', 'K9K182182', 35000, 'Gun Metallic', 'Gauteng', 445000, 445000, 'Nissan', 'SUV', 'Manual', 'Diesel', '1.5L', 'NIS182', 'Good'),

-- Hyundai Vehicles
(8570211, 2023, 'HYUNDAI', 'i20', '1.2 Motion', 'KMHB241BBPU211211', 'CA23HYU1', 'G4L211211', 25000, 'Polar White', 'Western Cape', 285000, 285000, 'Hyundai', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'HYU211', 'Excellent'),
(8570212, 2022, 'HYUNDAI', 'Tucson', '2.0 Executive', 'KMHJE81CBNU212212', 'JHB22HYU', 'G4N212212', 38000, 'Phantom Black', 'Gauteng', 545000, 545000, 'Hyundai', 'SUV', 'Automatic', 'Petrol', '2.0L', 'HYU212', 'Good'),

-- The reference Chevrolet vehicle
(8570291, 2012, 'CHEVROLET', 'Sonic', '1.4 LS', '1G1JA5SH8D4291291', 'Pc5o12003', '1.4L291291', 85000, 'Silver', 'Gauteng', 185000, 185000, 'Chevrolet', 'Sedan', 'Manual', 'Petrol', '1.4L', 'CHE291', 'Good')

ON CONFLICT (used_vehicle_stock_id) DO NOTHING;