-- Insert comprehensive vehicle inventory (fixing VIN length issues)
DELETE FROM vehicles; -- Clear existing data first

INSERT INTO vehicles (
    used_vehicle_stock_id, year, make_name, model_name, variant_name, vin, registration, 
    engine_no, mileage, colour, province_name, price, first_price, franchise,
    body_type, transmission, fuel_type, engine_size, stock_code, condition
) VALUES 
-- Toyota Vehicles (10 entries)
(8570001, 2023, 'TOYOTA', 'Corolla', '1.8 XS CVT', 'JTDBR32E403001', 'CA12ABGP', '2ZR8001001', 25000, 'White', 'Western Cape', 385000, 385000, 'Toyota', 'Sedan', 'CVT', 'Petrol', '1.8L', 'TOY001', 'Excellent'),
(8570002, 2022, 'TOYOTA', 'Hilux', '2.4 GD-6 RB S', 'AHTFR32G5N2002', 'JHB22BGP', '2GD2002002', 45000, 'Silver', 'Gauteng', 485000, 485000, 'Toyota', 'Bakkie', 'Manual', 'Diesel', '2.4L', 'TOY002', 'Good'),
(8570003, 2021, 'TOYOTA', 'RAV4', '2.0 GX CVT', 'JTMDF1AE0LD003', 'DBN21CGP', '3ZR3003003', 35000, 'Red', 'KwaZulu-Natal', 545000, 545000, 'Toyota', 'SUV', 'CVT', 'Petrol', '2.0L', 'TOY003', 'Good'),
(8570004, 2023, 'TOYOTA', 'Camry', '2.5 XS', 'JTNBF1AE0N4004', 'PE23DGP', '2AR4004004', 15000, 'Black', 'Eastern Cape', 625000, 625000, 'Toyota', 'Sedan', 'Automatic', 'Petrol', '2.5L', 'TOY004', 'Excellent'),
(8570005, 2020, 'TOYOTA', 'Fortuner', '2.8 GD-6 4x4', 'MMTFR32G5L2005', 'PTA20EGP', '1GD5005005', 65000, 'White', 'Gauteng', 695000, 695000, 'Toyota', 'SUV', 'Automatic', 'Diesel', '2.8L', 'TOY005', 'Good'),
(8570006, 2022, 'TOYOTA', 'Yaris', '1.5 XS CVT', 'VNKBR32F5N2006', 'BFN22FGP', '2NZ6006006', 28000, 'Blue', 'Free State', 285000, 285000, 'Toyota', 'Hatchback', 'CVT', 'Petrol', '1.5L', 'TOY006', 'Good'),
(8570007, 2021, 'TOYOTA', 'Prado', '3.0 DT VX', 'JTEBR33J0L5007', 'RUS21GGP', '5L7007007', 55000, 'Grey', 'North West', 875000, 875000, 'Toyota', 'SUV', 'Automatic', 'Diesel', '3.0L', 'TOY007', 'Good'),
(8570008, 2023, 'TOYOTA', 'C-HR', '1.2T Plus CVT', 'NMTFR32G5N2008', 'PLK23HGP', '8NR8008008', 18000, 'Orange', 'Limpopo', 465000, 465000, 'Toyota', 'SUV', 'CVT', 'Petrol', '1.2L', 'TOY008', 'Excellent'),
(8570009, 2020, 'TOYOTA', 'Quantum', '2.8 SLWB GL', 'JTFEB9CP1L6009', 'UMT20IGP', '1GD9009009', 85000, 'White', 'Mpumalanga', 445000, 445000, 'Toyota', 'Bus', 'Manual', 'Diesel', '2.8L', 'TOY009', 'Good'),
(8570010, 2022, 'TOYOTA', 'Avanza', '1.5 SX', 'MHKFR32G5N2010', 'KIM22JGP', '2NZ10010010', 32000, 'Silver', 'Northern Cape', 325000, 325000, 'Toyota', 'MPV', 'Manual', 'Petrol', '1.5L', 'TOY010', 'Good'),

-- BMW Vehicles (5 entries)
(8570051, 2023, 'BMW', '3 Series', '320i M Sport', 'WBA8F1G57N7051', 'CA23KBMW', 'B4851051', 22000, 'Alpine White', 'Western Cape', 745000, 745000, 'BMW', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'BMW051', 'Excellent'),
(8570052, 2022, 'BMW', 'X3', 'xDrive20d M Sport', 'WBY8P0C58M7052', 'JHB22BMW', 'B4752052', 38000, 'Storm Bay', 'Gauteng', 885000, 885000, 'BMW', 'SUV', 'Automatic', 'Diesel', '2.0L', 'BMW052', 'Good'),
(8570053, 2021, 'BMW', '5 Series', '520d M Sport', 'WBA5R1C09L7053', 'DBN21BMW', 'B4753053', 42000, 'Jet Black', 'KwaZulu-Natal', 925000, 925000, 'BMW', 'Sedan', 'Automatic', 'Diesel', '2.0L', 'BMW053', 'Good'),
(8570054, 2023, 'BMW', 'X1', 'sDrive20i M Sport', 'WBY8P4C50N7054', 'PE23BMW1', 'B4854054', 15000, 'Mineral Grey', 'Eastern Cape', 625000, 625000, 'BMW', 'SUV', 'Automatic', 'Petrol', '2.0L', 'BMW054', 'Excellent'),
(8570055, 2020, 'BMW', 'X5', 'xDrive30d M Sport', 'WBY1P2C07L7055', 'PTA20BMW', 'B5755055', 68000, 'Carbon Black', 'Gauteng', 1285000, 1285000, 'BMW', 'SUV', 'Automatic', 'Diesel', '3.0L', 'BMW055', 'Good'),

-- Mercedes-Benz Vehicles (5 entries)
(8570076, 2023, 'MERCEDES-BENZ', 'C-Class', 'C200 AMG Line', 'WDD2050422F076', 'CA23MERC', 'M26476076', 20000, 'Polar White', 'Western Cape', 785000, 785000, 'Mercedes-Benz', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'MER076', 'Excellent'),
(8570077, 2022, 'MERCEDES-BENZ', 'GLC', 'GLC220d AMG', 'WDC2536472F077', 'JHB22MER', 'OM65477077', 35000, 'Obsidian Black', 'Gauteng', 945000, 945000, 'Mercedes-Benz', 'SUV', 'Automatic', 'Diesel', '2.2L', 'MER077', 'Good'),
(8570078, 2021, 'MERCEDES-BENZ', 'E-Class', 'E200 AMG Line', 'WDD2132461F078', 'DBN21MER', 'M26478078', 45000, 'Selenite Grey', 'KwaZulu-Natal', 1045000, 1045000, 'Mercedes-Benz', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'MER078', 'Good'),
(8570079, 2023, 'MERCEDES-BENZ', 'A-Class', 'A200 AMG Line', 'WDD1770422F079', 'PE23MER1', 'M26479079', 18000, 'Mountain Grey', 'Eastern Cape', 585000, 585000, 'Mercedes-Benz', 'Hatchback', 'Automatic', 'Petrol', '2.0L', 'MER079', 'Excellent'),
(8570080, 2020, 'MERCEDES-BENZ', 'GLE', 'GLE350d AMG', 'WDC1664621F080', 'PTA20MER', 'OM65680080', 58000, 'Brilliant Blue', 'Gauteng', 1485000, 1485000, 'Mercedes-Benz', 'SUV', 'Automatic', 'Diesel', '3.0L', 'MER080', 'Good'),

-- Volkswagen Vehicles (5 entries)
(8570101, 2023, 'VOLKSWAGEN', 'Polo', '1.0 TSI Comfortline', 'WVWZZZ6RZPF101', 'CA23VW01', '04C101101', 25000, 'Pure White', 'Western Cape', 345000, 345000, 'Volkswagen', 'Hatchback', 'Manual', 'Petrol', '1.0L', 'VW101', 'Excellent'),
(8570102, 2022, 'VOLKSWAGEN', 'Golf', '1.4 TSI Comfortline', 'WVWZZZ5KZMF102', 'JHB22VW2', '04E102102', 32000, 'Reflex Silver', 'Gauteng', 485000, 485000, 'Volkswagen', 'Hatchback', 'Automatic', 'Petrol', '1.4L', 'VW102', 'Good'),
(8570103, 2021, 'VOLKSWAGEN', 'Tiguan', '2.0 TSI 4Motion', 'WVGZZZ5NZMF103', 'DBN21VW3', '04E103103', 38000, 'Atlantic Blue', 'KwaZulu-Natal', 645000, 645000, 'Volkswagen', 'SUV', 'Automatic', 'Petrol', '2.0L', 'VW103', 'Good'),
(8570104, 2023, 'VOLKSWAGEN', 'Passat', '2.0 TDI Elegance', 'WVWZZZ3CZPF104', 'PE23VW04', '04L104104', 22000, 'Deep Black', 'Eastern Cape', 585000, 585000, 'Volkswagen', 'Sedan', 'Automatic', 'Diesel', '2.0L', 'VW104', 'Excellent'),
(8570105, 2020, 'VOLKSWAGEN', 'Amarok', '3.0 TDI Highline', 'WVWZZZ2HZLF105', 'PTA20VW5', '04L105105', 65000, 'Candy White', 'Gauteng', 725000, 725000, 'Volkswagen', 'Bakkie', 'Automatic', 'Diesel', '3.0L', 'VW105', 'Good'),

-- Ford Vehicles (5 entries)
(8570131, 2023, 'FORD', 'Fiesta', '1.0 EcoBoost Titanium', 'WF0BXXGAJBNF131', 'CA23FOR1', 'M2D131131', 28000, 'Race Red', 'Western Cape', 325000, 325000, 'Ford', 'Hatchbook', 'Manual', 'Petrol', '1.0L', 'FOR131', 'Excellent'),
(8570132, 2022, 'FORD', 'Focus', '1.5 EcoBoost Titanium', 'WF0DXXGDXNF132', 'JHB22FOR', 'M8D132132', 35000, 'Moondust Silver', 'Gauteng', 425000, 425000, 'Ford', 'Hatchback', 'Automatic', 'Petrol', '1.5L', 'FOR132', 'Good'),
(8570133, 2021, 'FORD', 'Kuga', '1.5 EcoBoost Ambiente', 'WF0GXXGDXMF133', 'DBN21FOR', 'M8D133133', 42000, 'Magnetic Grey', 'KwaZulu-Natal', 545000, 545000, 'Ford', 'SUV', 'Automatic', 'Petrol', '1.5L', 'FOR133', 'Good'),
(8570134, 2023, 'FORD', 'Mustang', '5.0 GT Fastback', 'WF0FXXGDXPF134', 'PE23FOR1', '50G134134', 15000, 'Shadow Black', 'Eastern Cape', 945000, 945000, 'Ford', 'Coupe', 'Manual', 'Petrol', '5.0L', 'FOR134', 'Excellent'),
(8570135, 2020, 'FORD', 'Ranger', '3.2 Wildtrak 4x4', 'WF0GXXTTXLF135', 'PTA20FOR', 'P5A135135', 75000, 'Lightning Blue', 'Gauteng', 585000, 585000, 'Ford', 'Bakkie', 'Automatic', 'Diesel', '3.2L', 'FOR135', 'Good'),

-- Audi Vehicles (5 entries)
(8570156, 2023, 'AUDI', 'A3', '1.4 TFSI S tronic', 'WAUZZZ8V5PF156', 'CA23AUD1', 'CZC156156', 22000, 'Glacier White', 'Western Cape', 565000, 565000, 'Audi', 'Sedan', 'Automatic', 'Petrol', '1.4L', 'AUD156', 'Excellent'),
(8570157, 2022, 'AUDI', 'Q3', '35 TFSI S tronic', 'WAUZZZ8U5NF157', 'JHB22AUD', 'CZC157157', 38000, 'Mythos Black', 'Gauteng', 685000, 685000, 'Audi', 'SUV', 'Automatic', 'Petrol', '2.0L', 'AUD157', 'Good'),
(8570158, 2021, 'AUDI', 'A4', '2.0 TFSI S tronic', 'WAUZZZ8K5MF158', 'DBN21AUD', 'CYR158158', 45000, 'Florett Silver', 'KwaZulu-Natal', 745000, 745000, 'Audi', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'AUD158', 'Good'),
(8570159, 2023, 'AUDI', 'Q5', '40 TDI S tronic', 'WAUZZZ8R7PF159', 'PE23AUD1', 'DEU159159', 25000, 'Navarra Blue', 'Eastern Cape', 885000, 885000, 'Audi', 'SUV', 'Automatic', 'Diesel', '2.0L', 'AUD159', 'Excellent'),
(8570160, 2020, 'AUDI', 'A6', '3.0 TFSI S tronic', 'WAUZZZ4F5LF160', 'PTA20AUD', 'CYR160160', 65000, 'Phantom Black', 'Gauteng', 1045000, 1045000, 'Audi', 'Sedan', 'Automatic', 'Petrol', '3.0L', 'AUD160', 'Good'),

-- Nissan Vehicles (5 entries)
(8570181, 2023, 'NISSAN', 'Micra', '1.2 Active Visia', 'SJNFAAE10U2181', 'CA23NIS1', 'HR12181181', 28000, 'Pearl White', 'Western Cape', 285000, 285000, 'Nissan', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'NIS181', 'Excellent'),
(8570182, 2022, 'NISSAN', 'Qashqai', '1.5 dCi Acenta', 'SJNFCAE10N2182', 'JHB22NIS', 'K9K182182', 35000, 'Gun Metallic', 'Gauteng', 445000, 445000, 'Nissan', 'SUV', 'Manual', 'Diesel', '1.5L', 'NIS182', 'Good'),
(8570183, 2021, 'NISSAN', 'X-Trail', '2.5 4x4 LE CVT', 'SJNFRAE10M2183', 'DBN21NIS', 'QR25183183', 42000, 'Storm White', 'KwaZulu-Natal', 585000, 585000, 'Nissan', 'SUV', 'CVT', 'Petrol', '2.5L', 'NIS183', 'Good'),
(8570184, 2023, 'NISSAN', 'Navara', '2.3 dCi Stealth', 'SJNFGAE10P2184', 'PE23NIS1', 'YS23184184', 25000, 'Flame Red', 'Eastern Cape', 625000, 625000, 'Nissan', 'Bakkie', 'Automatic', 'Diesel', '2.3L', 'NIS184', 'Excellent'),
(8570185, 2020, 'NISSAN', 'Patrol', '5.6 V8 LE Premium', 'SJNFHAE10L2185', 'PTA20NIS', 'VK56185185', 68000, 'Super Black', 'Gauteng', 945000, 945000, 'Nissan', 'SUV', 'Automatic', 'Petrol', '5.6L', 'NIS185', 'Good'),

-- Hyundai Vehicles (5 entries)
(8570211, 2023, 'HYUNDAI', 'i20', '1.2 Motion', 'KMHB241BBPU211', 'CA23HYU1', 'G4L211211', 25000, 'Polar White', 'Western Cape', 285000, 285000, 'Hyundai', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'HYU211', 'Excellent'),
(8570212, 2022, 'HYUNDAI', 'Tucson', '2.0 Executive', 'KMHJE81CBNU212', 'JHB22HYU', 'G4N212212', 38000, 'Phantom Black', 'Gauteng', 545000, 545000, 'Hyundai', 'SUV', 'Automatic', 'Petrol', '2.0L', 'HYU212', 'Good'),
(8570213, 2021, 'HYUNDAI', 'Elantra', '1.6 Executive', 'KMHDH41BBMU213', 'DBN21HYU', 'G4F213213', 42000, 'Fluidic Metal', 'KwaZulu-Natal', 385000, 385000, 'Hyundai', 'Sedan', 'Automatic', 'Petrol', '1.6L', 'HYU213', 'Good'),
(8570214, 2023, 'HYUNDAI', 'Creta', '1.5 Executive', 'KMHH381CBPU214', 'PE23HYU1', 'G4F214214', 22000, 'Fiery Red', 'Eastern Cape', 425000, 425000, 'Hyundai', 'SUV', 'Manual', 'Petrol', '1.5L', 'HYU214', 'Excellent'),
(8570215, 2020, 'HYUNDAI', 'Santa Fe', '2.2 CRDi Elite', 'KMHSH81CBLU215', 'PTA20HYU', 'D4H215215', 65000, 'Creamy White', 'Gauteng', 685000, 685000, 'Hyundai', 'SUV', 'Automatic', 'Diesel', '2.2L', 'HYU215', 'Good'),

-- Kia Vehicles (4 entries)
(8570236, 2023, 'KIA', 'Picanto', '1.2 Start', 'KNABT811BPF236', 'CA23KIA1', 'G3L236236', 28000, 'Clear White', 'Western Cape', 265000, 265000, 'Kia', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'KIA236', 'Excellent'),
(8570237, 2022, 'KIA', 'Sportage', '2.0 Ignite', 'KNDMC233BNF237', 'JHB22KIA', 'G4N237237', 35000, 'Steel Silver', 'Gauteng', 485000, 485000, 'Kia', 'SUV', 'Automatic', 'Petrol', '2.0L', 'KIA237', 'Good'),
(8570238, 2021, 'KIA', 'Cerato', '1.6 EX', 'KNAFK511BMF238', 'DBN21KIA', 'G4F238238', 42000, 'Aurora Black', 'KwaZulu-Natal', 345000, 345000, 'Kia', 'Sedan', 'Automatic', 'Petrol', '1.6L', 'KIA238', 'Good'),
(8570239, 2023, 'KIA', 'Sorento', '2.2 CRDi SX', 'KNAGC411BPF239', 'PE23KIA1', 'D4H239239', 25000, 'Gravity Blue', 'Eastern Cape', 745000, 745000, 'Kia', 'SUV', 'Automatic', 'Diesel', '2.2L', 'KIA239', 'Excellent'),

-- Mazda Vehicles (4 entries)
(8570256, 2023, 'MAZDA', 'CX-3', '2.0 Active', 'JM1DK336BPF256', 'CA23MAZ1', 'PE256256', 22000, 'Soul Red Crystal', 'Western Cape', 425000, 425000, 'Mazda', 'SUV', 'Manual', 'Petrol', '2.0L', 'MAZ256', 'Excellent'),
(8570257, 2022, 'MAZDA', 'CX-5', '2.0 Active', 'JM3KE2BE5NF257', 'JHB22MAZ', 'PE257257', 38000, 'Machine Grey', 'Gauteng', 545000, 545000, 'Mazda', 'SUV', 'Automatic', 'Petrol', '2.0L', 'MAZ257', 'Good'),
(8570258, 2021, 'MAZDA', 'Mazda3', '2.0 Astina', 'JM1BP4CF5MF258', 'DBN21MAZ', 'PE258258', 45000, 'Jet Black Mica', 'KwaZulu-Natal', 485000, 485000, 'Mazda', 'Hatchback', 'Automatic', 'Petrol', '2.0L', 'MAZ258', 'Good'),
(8570259, 2023, 'MAZDA', 'CX-9', '2.5 Signature', 'JM3TCBCY5PF259', 'PE23MAZ1', 'PY259259', 18000, 'Snowflake White', 'Eastern Cape', 785000, 785000, 'Mazda', 'SUV', 'Automatic', 'Petrol', '2.5L', 'MAZ259', 'Excellent'),

-- Isuzu Vehicles (3 entries)
(8570276, 2023, 'ISUZU', 'D-Max', '3.0 V-Cross 4x4', 'JAANR33V1PF276', 'CA23ISU1', '4JJ1276276', 25000, 'Cosmic Black', 'Western Cape', 645000, 645000, 'Isuzu', 'Bakkie', 'Automatic', 'Diesel', '3.0L', 'ISU276', 'Excellent'),
(8570277, 2022, 'ISUZU', 'MU-X', '3.0 Onyx 4x4', 'JAANR53V1NF277', 'JHB22ISU', '4JJ1277277', 42000, 'Titanium Silver', 'Gauteng', 745000, 745000, 'Isuzu', 'SUV', 'Automatic', 'Diesel', '3.0L', 'ISU277', 'Good'),
(8570278, 2021, 'ISUZU', 'KB', '2.5 LX Single Cab', 'JAANR26V1MF278', 'DBN21ISU', '4JA1278278', 65000, 'Splash White', 'KwaZulu-Natal', 385000, 385000, 'Isuzu', 'Bakkie', 'Manual', 'Diesel', '2.5L', 'ISU278', 'Good'),

-- Chevrolet Vehicles (3 entries) - Including our reference vehicle
(8570291, 2012, 'CHEVROLET', 'Sonic', '1.4 LS', '1G1JA5SH8D4291', 'Pc5o12003', '1.4L291291', 85000, 'Silver', 'Gauteng', 185000, 185000, 'Chevrolet', 'Sedan', 'Manual', 'Petrol', '1.4L', 'CHE291', 'Good'),
(8570292, 2015, 'CHEVROLET', 'Cruze', '1.4T LTZ', '1G1PA5SHXF7292', 'CHE15292', 'LE2292292', 95000, 'Summit White', 'Western Cape', 245000, 245000, 'Chevrolet', 'Sedan', 'Automatic', 'Petrol', '1.4L', 'CHE292', 'Good'),
(8570293, 2014, 'CHEVROLET', 'Captiva', '2.4 LT', '3GNAL3EK9ES293', 'CHE14293', 'LE5293293', 125000, 'Carbon Flash', 'Gauteng', 285000, 285000, 'Chevrolet', 'SUV', 'Automatic', 'Petrol', '2.4L', 'CHE293', 'Fair'),

-- Renault Vehicles (3 entries)
(8570301, 2023, 'RENAULT', 'Kwid', '1.0 Dynamique', 'VF1RXD00463301', 'CA23REN1', 'SCe301301', 22000, 'Ice Cool White', 'Western Cape', 225000, 225000, 'Renault', 'Hatchback', 'Manual', 'Petrol', '1.0L', 'REN301', 'Excellent'),
(8570302, 2022, 'RENAULT', 'Duster', '1.5 dCi Dynamique', 'VF1MMDHFXNP302', 'JHB22REN', 'K9K302302', 38000, 'Highland Grey', 'Gauteng', 385000, 385000, 'Renault', 'SUV', 'Manual', 'Diesel', '1.5L', 'REN302', 'Good'),
(8570303, 2021, 'RENAULT', 'Clio', '1.2T Expression', 'VF1RJAA0463303', 'DBN21REN', 'TCe303303', 45000, 'Flame Red', 'KwaZulu-Natal', 285000, 285000, 'Renault', 'Hatchback', 'Manual', 'Petrol', '1.2L', 'REN303', 'Good'),

-- Mitsubishi Vehicles (3 entries)
(8570321, 2023, 'MITSUBISHI', 'ASX', '2.0 GL CVT', 'JA4AJ3AU6PZ321', 'CA23MIT1', '4B11321321', 25000, 'Lightning Blue', 'Western Cape', 445000, 445000, 'Mitsubishi', 'SUV', 'CVT', 'Petrol', '2.0L', 'MIT321', 'Excellent'),
(8570322, 2022, 'MITSUBISHI', 'Triton', '2.4 DI-D 4x4', 'MMBNJ4B7XNJ322', 'JHB22MIT', '4N15322322', 42000, 'Graphite Grey', 'Gauteng', 585000, 585000, 'Mitsubishi', 'Bakkie', 'Manual', 'Diesel', '2.4L', 'MIT322', 'Good'),
(8570323, 2021, 'MITSUBISHI', 'Pajero Sport', '2.4 DI-D 4x4', 'MMCNKB37WMJ323', 'DBN21MIT', '4N15323323', 55000, 'White Diamond', 'KwaZulu-Natal', 685000, 685000, 'Mitsubishi', 'SUV', 'Automatic', 'Diesel', '2.4L', 'MIT323', 'Good'),

-- Subaru Vehicles (3 entries)
(8570341, 2023, 'SUBARU', 'Forester', '2.0i-S ES CVT', 'JF2SJADC6PH341', 'CA23SUB1', 'FB20341341', 28000, 'Ice Silver', 'Western Cape', 585000, 585000, 'Subaru', 'SUV', 'CVT', 'Petrol', '2.0L', 'SUB341', 'Excellent'),
(8570342, 2022, 'SUBARU', 'Outback', '2.5i-S CVT', 'JF1BSADC6NH342', 'JHB22SUB', 'FB25342342', 35000, 'Crystal White', 'Gauteng', 645000, 645000, 'Subaru', 'SUV', 'CVT', 'Petrol', '2.5L', 'SUB342', 'Good'),
(8570343, 2021, 'SUBARU', 'XV', '2.0i CVT', 'JF2GTADC6MH343', 'DBN21SUB', 'FB20343343', 42000, 'Dark Grey', 'KwaZulu-Natal', 485000, 485000, 'Subaru', 'SUV', 'CVT', 'Petrol', '2.0L', 'SUB343', 'Good'),

-- Jeep Vehicles (2 entries)
(8570361, 2023, 'JEEP', 'Compass', '2.4 Limited CVT', 'ZACCJEAA4PD361', 'CA23JEP1', '2.4L361361', 22000, 'Granite Crystal', 'Western Cape', 685000, 685000, 'Jeep', 'SUV', 'CVT', 'Petrol', '2.4L', 'JEP361', 'Excellent'),
(8570362, 2022, 'JEEP', 'Wrangler', '3.6 Unlimited Sahara', 'ZACCJEAA4ND362', 'JHB22JEP', 'ERB362362', 38000, 'Bright White', 'Gauteng', 945000, 945000, 'Jeep', 'SUV', 'Automatic', 'Petrol', '3.6L', 'JEP362', 'Good'),

-- Jaguar Vehicles (2 entries)
(8570381, 2023, 'JAGUAR', 'XE', 'P200 R-Dynamic S', 'SAJAD4GX4PCP81', 'CA23JAG1', 'AJ20381381', 18000, 'Yulong White', 'Western Cape', 785000, 785000, 'Jaguar', 'Sedan', 'Automatic', 'Petrol', '2.0L', 'JAG381', 'Excellent'),
(8570382, 2022, 'JAGUAR', 'F-PACE', 'P250 R-Dynamic S', 'SAJAG4GX4NCP82', 'JHB22JAG', 'AJ20382382', 32000, 'Santorini Black', 'Gauteng', 1145000, 1145000, 'Jaguar', 'SUV', 'Automatic', 'Petrol', '2.0L', 'JAG382', 'Good'),

-- Land Rover Vehicles (2 entries)
(8570391, 2023, 'LAND ROVER', 'Discovery Sport', 'P200 R-Dynamic S', 'SALCA2BN4PH391', 'CA23LR01', 'AJ20391391', 25000, 'Fuji White', 'Western Cape', 885000, 885000, 'Land Rover', 'SUV', 'Automatic', 'Petrol', '2.0L', 'LR391', 'Excellent'),
(8570392, 2022, 'LAND ROVER', 'Range Rover Evoque', 'P200 R-Dynamic S', 'SALVA2BN4NH392', 'JHB22LR2', 'AJ20392392', 35000, 'Narvik Black', 'Gauteng', 1045000, 1045000, 'Land Rover', 'SUV', 'Automatic', 'Petrol', '2.0L', 'LR392', 'Good');