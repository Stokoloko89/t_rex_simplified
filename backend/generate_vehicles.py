#!/usr/bin/env python3
"""
Generate comprehensive vehicle inventory SQL for South Africa
Creates 400+ vehicles across all provinces and major cities
"""

import random

# South African provinces and their major cities
LOCATIONS = {
    'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester'],
    'Gauteng': ['Johannesburg', 'Pretoria', 'Sandton', 'Centurion', 'Midrand', 'Roodepoort'],
    'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Port Shepstone'],
    'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown', 'Uitenhage'],
    'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem', 'Kroonstad', 'Sasolburg'],
    'Limpopo': ['Polokwane', 'Tzaneen', 'Mokopane', 'Thohoyandou', 'Musina'],
    'Mpumalanga': ['Nelspruit', 'Witbank', 'Middelburg', 'Secunda', 'Ermelo'],
    'North West': ['Rustenburg', 'Mahikeng', 'Klerksdorp', 'Potchefstroom', 'Brits'],
    'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'Kuruman', 'De Aar']
}

# Vehicle makes and their popular models
VEHICLES = {
    'TOYOTA': {
        'models': ['Corolla', 'Hilux', 'RAV4', 'Fortuner', 'Yaris', 'Camry', 'Prado', 'C-HR', 'Quantum', 'Avanza', 'Corolla Cross', 'Starlet'],
        'variants': ['1.8 XS CVT', '2.4 GD-6 RB', '2.0 GX CVT', '2.8 GD-6 4x4', '1.5 XS', '2.5 XS', '3.0 DT VX', '1.2T Plus', '2.8 SLWB', '1.5 SX', '1.8 XS', '1.4 Xi'],
        'body_types': ['Sedan', 'Bakkie', 'SUV', 'Hatchback', 'Bus', 'MPV'],
        'franchise': 'Toyota'
    },
    'BMW': {
        'models': ['3 Series', 'X3', '5 Series', 'X1', 'X5', '1 Series', 'X7', '2 Series', '4 Series', 'X2'],
        'variants': ['320i M Sport', 'xDrive20d M Sport', '520d M Sport', 'sDrive20i M Sport', 'xDrive30d M Sport', '118i M Sport', 'xDrive40i M Sport', '220i M Sport', '420i M Sport', 'sDrive18i M Sport'],
        'body_types': ['Sedan', 'SUV', 'Hatchback', 'Coupe'],
        'franchise': 'BMW'
    },
    'MERCEDES-BENZ': {
        'models': ['C-Class', 'GLC', 'E-Class', 'A-Class', 'GLE', 'B-Class', 'CLA', 'GLA', 'S-Class', 'GLB'],
        'variants': ['C200 AMG Line', 'GLC220d AMG', 'E200 AMG Line', 'A200 AMG Line', 'GLE350d AMG', 'B200 AMG Line', 'CLA200 AMG Line', 'GLA200 AMG Line', 'S400d AMG Line', 'GLB200 AMG Line'],
        'body_types': ['Sedan', 'SUV', 'Hatchback', 'Coupe'],
        'franchise': 'Mercedes-Benz'
    },
    'VOLKSWAGEN': {
        'models': ['Polo', 'Golf', 'Tiguan', 'Passat', 'Amarok', 'T-Cross', 'Polo Vivo', 'T-Roc', 'Touareg', 'Arteon'],
        'variants': ['1.0 TSI Comfortline', '2.0 TSI GTI', '2.0 TSI 4Motion', '2.0 TDI Elegance', '3.0 TDI Highline', '1.0 TSI Comfortline', '1.4 Comfortline', '2.0 TSI Design', '3.0 TDI Luxury', '2.0 TSI Elegance'],
        'body_types': ['Hatchback', 'SUV', 'Sedan', 'Bakkie'],
        'franchise': 'Volkswagen'
    },
    'FORD': {
        'models': ['Ranger', 'Everest', 'Fiesta', 'Focus', 'Kuga', 'Mustang', 'EcoSport', 'Figo', 'Territory', 'Puma'],
        'variants': ['3.2 Wildtrak 4x4', '2.0 Bi-Turbo XLT', '1.0 EcoBoost Titanium', '1.5 EcoBoost Titanium', '1.5 EcoBoost Ambiente', '5.0 GT Fastback', '1.0 EcoBoost Titanium', '1.5 Titanium', '1.5 Turbo Titanium', '1.0 EcoBoost ST-Line'],
        'body_types': ['Bakkie', 'SUV', 'Hatchback', 'Sedan', 'Coupe'],
        'franchise': 'Ford'
    },
    'AUDI': {
        'models': ['A3', 'Q3', 'A4', 'Q5', 'A6', 'Q7', 'A1', 'Q2', 'A5', 'Q8'],
        'variants': ['1.4 TFSI S tronic', '35 TFSI S tronic', '35 TFSI S tronic', '40 TDI quattro', '40 TDI S tronic', '45 TDI quattro', '30 TFSI S tronic', '35 TFSI S tronic', '40 TFSI S tronic', '45 TDI quattro'],
        'body_types': ['Sedan', 'SUV', 'Hatchback'],
        'franchise': 'Audi'
    },
    'HONDA': {
        'models': ['Civic', 'HR-V', 'Jazz', 'Ballade', 'CR-V', 'Accord', 'Brio', 'WR-V'],
        'variants': ['1.5T Sport', '1.8 Elegance CVT', '1.5 Elegance CVT', '1.5 Elegance CVT', '2.0 Comfort CVT', '2.0 Elegance', '1.2 Comfort', '1.2 Elegance'],
        'body_types': ['Sedan', 'SUV', 'Hatchback'],
        'franchise': 'Honda'
    },
    'NISSAN': {
        'models': ['Qashqai', 'X-Trail', 'Micra', 'Navara', 'Magnite', 'Almera', 'NP200', 'NP300'],
        'variants': ['1.5 dCi Acenta', '2.5 Tekna 4x4', '0.9T Acenta Plus', '2.3D LE 4x4', '1.0T Acenta Plus', '1.5 Acenta Plus', '1.6i Pack', '2.5 LE 4x4'],
        'body_types': ['SUV', 'Hatchback', 'Bakkie', 'Sedan'],
        'franchise': 'Nissan'
    },
    'HYUNDAI': {
        'models': ['Tucson', 'Creta', 'i20', 'Venue', 'Grand i10', 'Palisade', 'Kona', 'Elantra'],
        'variants': ['2.0 Executive', '1.5 Executive', '1.2 Motion', '1.0T Fluid', '1.2 Motion', '2.2D Elite', '2.0 Executive', '1.6 Executive'],
        'body_types': ['SUV', 'Hatchback', 'Sedan'],
        'franchise': 'Hyundai'
    },
    'KIA': {
        'models': ['Sportage', 'Seltos', 'Picanto', 'Sonet', 'Rio', 'Sorento', 'Stonic', 'Cerato'],
        'variants': ['2.0 Ignite', '1.6 EX', '1.2 Style', '1.5 EX', '1.4 TEC', '2.2D SX', '1.0T Street', '1.6 EX'],
        'body_types': ['SUV', 'Hatchback', 'Sedan'],
        'franchise': 'Kia'
    },
    'MAZDA': {
        'models': ['CX-5', 'CX-3', '2', 'CX-30', '3', 'CX-9', 'BT-50'],
        'variants': ['2.0 Active', '2.0 Dynamic', '1.5 Dynamic', '2.0 Active', '2.0 Astina', '2.5T Azami', '3.0 SLE 4x4'],
        'body_types': ['SUV', 'Hatchback', 'Sedan', 'Bakkie'],
        'franchise': 'Mazda'
    },
    'ISUZU': {
        'models': ['D-Max', 'MU-X', 'KB'],
        'variants': ['3.0 V-Cross 4x4', '3.0 4x4', '2.5 LX 4x4'],
        'body_types': ['Bakkie', 'SUV'],
        'franchise': 'Isuzu'
    },
    'CHEVROLET': {
        'models': ['Trailblazer', 'Utility'],
        'variants': ['2.8 LTZ 4x4', '1.4 Club'],
        'body_types': ['SUV', 'Bakkie'],
        'franchise': 'Chevrolet'
    },
    'RENAULT': {
        'models': ['Kwid', 'Clio', 'Duster', 'Captur', 'Triber', 'Kiger'],
        'variants': ['1.0 Dynamique', '1.2T Expression', '1.5 dCi Dynamique', '1.2T Dynamique', '1.0 Dynamique', '1.0 Zen'],
        'body_types': ['Hatchback', 'SUV', 'MPV'],
        'franchise': 'Renault'
    },
    'MITSUBISHI': {
        'models': ['ASX', 'Triton', 'Pajero Sport', 'Outlander'],
        'variants': ['2.0 GL CVT', '2.4 DI-D 4x4', '2.4 DI-D 4x4', '2.4 GLS CVT'],
        'body_types': ['SUV', 'Bakkie'],
        'franchise': 'Mitsubishi'
    },
    'SUBARU': {
        'models': ['Forester', 'Outback', 'XV', 'WRX'],
        'variants': ['2.0i-S ES CVT', '2.5i-S CVT', '2.0i CVT', '2.0 Premium'],
        'body_types': ['SUV', 'Sedan'],
        'franchise': 'Subaru'
    },
    'JEEP': {
        'models': ['Compass', 'Wrangler', 'Grand Cherokee', 'Renegade'],
        'variants': ['2.4 Limited CVT', '3.6 Unlimited Sahara', '3.6 Limited', '1.4T Longitude'],
        'body_types': ['SUV'],
        'franchise': 'Jeep'
    },
    'JAGUAR': {
        'models': ['XE', 'F-PACE', 'E-PACE', 'XF'],
        'variants': ['P200 R-Dynamic S', 'P250 R-Dynamic S', 'P200 R-Dynamic S', 'P250 R-Dynamic S'],
        'body_types': ['Sedan', 'SUV'],
        'franchise': 'Jaguar'
    },
    'LAND ROVER': {
        'models': ['Discovery Sport', 'Range Rover Evoque', 'Discovery', 'Defender'],
        'variants': ['P200 R-Dynamic S', 'P200 R-Dynamic S', 'P300 S', 'P300 S'],
        'body_types': ['SUV'],
        'franchise': 'Land Rover'
    },
    'SUZUKI': {
        'models': ['Swift', 'Vitara', 'Baleno', 'Ertiga', 'Jimny', 'S-Presso'],
        'variants': ['1.2 GL', '1.6 GL+', '1.4 GL', '1.5 GL', '1.5 GLX', '1.0 GL+'],
        'body_types': ['Hatchback', 'SUV', 'MPV'],
        'franchise': 'Suzuki'
    },
    'HAVAL': {
        'models': ['Jolion', 'H6', 'H2'],
        'variants': ['1.5T Luxury', '2.0T Luxury', '1.5T Luxury'],
        'body_types': ['SUV'],
        'franchise': 'Haval'
    },
    'GWM': {
        'models': ['P-Series', 'Steed'],
        'variants': ['2.0TD Lux 4x4', '2.0TD Lux 4x4'],
        'body_types': ['Bakkie'],
        'franchise': 'GWM'
    },
    'MAHINDRA': {
        'models': ['Pik Up', 'Scorpio', 'XUV500'],
        'variants': ['2.2 S10', '2.2 Pik Up', '2.2 W8'],
        'body_types': ['Bakkie', 'SUV'],
        'franchise': 'Mahindra'
    },
    'PEUGEOT': {
        'models': ['208', '2008', '3008', '5008'],
        'variants': ['1.2T Active', '1.2T Active', '1.6T Active', '1.6T Active'],
        'body_types': ['Hatchback', 'SUV'],
        'franchise': 'Peugeot'
    },
    'CITROEN': {
        'models': ['C3', 'C3 Aircross', 'C5 Aircross'],
        'variants': ['1.2T Feel', '1.2T Feel', '1.6T Feel'],
        'body_types': ['Hatchback', 'SUV'],
        'franchise': 'Citroen'
    }
}

COLORS = ['White', 'Silver', 'Black', 'Grey', 'Blue', 'Red', 'Beige', 'Brown', 'Green', 'Orange', 
          'Pearl White', 'Metallic Silver', 'Jet Black', 'Graphite Grey', 'Midnight Blue', 'Ruby Red',
          'Champagne', 'Bronze', 'Emerald Green', 'Sunset Orange', 'Alpine White', 'Storm Bay',
          'Obsidian Black', 'Selenite Grey', 'Polar White', 'Brilliant Blue', 'Candy White']

TRANSMISSIONS = ['Manual', 'Automatic', 'CVT']
FUEL_TYPES = ['Petrol', 'Diesel']
CONDITIONS = ['Excellent', 'Good', 'Fair']

def generate_vin(stock_id):
    """Generate a realistic VIN"""
    prefixes = ['JTD', 'WBA', 'WDD', 'WVW', 'WF0', 'WAU', 'JHM', 'SJN', 'KMH', 'KNA', 
                'JM3', 'MPA', 'LGW', 'MA3', 'MMB', 'JF2', 'ZAC', 'SAJ', 'SAL', 'JSA']
    prefix = random.choice(prefixes)
    suffix = f"{stock_id:011d}"[-11:]
    return f"{prefix}{suffix}"

def generate_registration(province, year, index):
    """Generate a realistic registration number"""
    province_codes = {
        'Western Cape': 'CA',
        'Gauteng': 'JHB',
        'KwaZulu-Natal': 'DBN',
        'Eastern Cape': 'PE',
        'Free State': 'BFN',
        'Limpopo': 'PLK',
        'Mpumalanga': 'UMT',
        'North West': 'RUS',
        'Northern Cape': 'KIM'
    }
    code = province_codes.get(province, 'ZA')
    year_short = str(year)[-2:]
    return f"{code}{year_short}{chr(65 + (index % 26))}{chr(65 + ((index // 26) % 26))}{chr(65 + ((index // 676) % 26))}"

def generate_engine_no(make, stock_id):
    """Generate engine number"""
    engine_codes = {
        'TOYOTA': '2ZR', 'BMW': 'B48', 'MERCEDES-BENZ': 'M264', 'VOLKSWAGEN': '04E',
        'FORD': 'M2D', 'AUDI': 'CZC', 'HONDA': 'L15B', 'NISSAN': 'HR12', 'HYUNDAI': 'G4NA',
        'KIA': 'G4NA', 'MAZDA': 'PE', 'ISUZU': '4JJ1', 'CHEVROLET': 'LWH', 'RENAULT': 'SCe',
        'MITSUBISHI': '4N15', 'SUBARU': 'FB20', 'JEEP': '2.4L', 'JAGUAR': 'AJ20',
        'LAND ROVER': 'AJ20', 'SUZUKI': 'K12M', 'HAVAL': 'GW4', 'GWM': 'GW4',
        'MAHINDRA': 'mHawk', 'PEUGEOT': 'EB2', 'CITROEN': 'EB2'
    }
    code = engine_codes.get(make, 'ENG')
    return f"{code}{stock_id:06d}"

def generate_stock_code(city, index):
    """Generate stock code"""
    city_codes = {
        'Cape Town': 'CPT', 'Stellenbosch': 'STL', 'Johannesburg': 'JHB', 'Pretoria': 'PTA',
        'Durban': 'DBN', 'Port Elizabeth': 'PE', 'Bloemfontein': 'BFN', 'Polokwane': 'PLK',
        'Nelspruit': 'NLS', 'Rustenburg': 'RST', 'Kimberley': 'KIM', 'Sandton': 'SDN',
        'Centurion': 'CEN', 'Pietermaritzburg': 'PMB', 'East London': 'EL', 'George': 'GEO',
        'Paarl': 'PAL', 'Worcester': 'WOR', 'Midrand': 'MDR', 'Roodepoort': 'RDP',
        'Richards Bay': 'RB', 'Newcastle': 'NEW', 'Port Shepstone': 'PS', 'Mthatha': 'MTH',
        'Grahamstown': 'GHM', 'Uitenhage': 'UIT', 'Welkom': 'WEL', 'Bethlehem': 'BTH',
        'Kroonstad': 'KRN', 'Sasolburg': 'SAS', 'Tzaneen': 'TZN', 'Mokopane': 'MKP',
        'Thohoyandou': 'THO', 'Musina': 'MUS', 'Witbank': 'WIT', 'Middelburg': 'MID',
        'Secunda': 'SEC', 'Ermelo': 'ERM', 'Mahikeng': 'MAH', 'Klerksdorp': 'KLK',
        'Potchefstroom': 'POT', 'Brits': 'BRT', 'Upington': 'UPN', 'Springbok': 'SPR',
        'Kuruman': 'KUR', 'De Aar': 'DAR'
    }
    code = city_codes.get(city, 'ZA')
    return f"{code}{index:03d}"

def generate_vehicles(total=420):
    """Generate vehicle data"""
    vehicles = []
    stock_id = 9000001
    
    # Calculate vehicles per location
    total_cities = sum(len(cities) for cities in LOCATIONS.values())
    vehicles_per_city = total // total_cities
    extra_vehicles = total % total_cities
    
    city_index = 0
    for province, cities in LOCATIONS.items():
        for city in cities:
            # Determine how many vehicles for this city
            num_vehicles = vehicles_per_city
            if city_index < extra_vehicles:
                num_vehicles += 1
            
            for i in range(num_vehicles):
                # Select random make
                make = random.choice(list(VEHICLES.keys()))
                vehicle_data = VEHICLES[make]
                
                # Select random model and variant
                model = random.choice(vehicle_data['models'])
                variant = random.choice(vehicle_data['variants'])
                body_type = random.choice(vehicle_data['body_types'])
                
                # Generate vehicle details
                year = random.choice([2020, 2021, 2022, 2023])
                mileage = random.randint(10000, 80000) if year < 2023 else random.randint(5000, 30000)
                color = random.choice(COLORS)
                transmission = random.choice(TRANSMISSIONS)
                fuel_type = random.choice(FUEL_TYPES)
                condition = random.choice(CONDITIONS) if year < 2022 else 'Excellent'
                
                # Generate price based on year and make
                base_prices = {
                    'TOYOTA': 350000, 'BMW': 650000, 'MERCEDES-BENZ': 700000, 'VOLKSWAGEN': 350000,
                    'FORD': 400000, 'AUDI': 550000, 'HONDA': 350000, 'NISSAN': 320000,
                    'HYUNDAI': 300000, 'KIA': 300000, 'MAZDA': 350000, 'ISUZU': 450000,
                    'CHEVROLET': 500000, 'RENAULT': 200000, 'MITSUBISHI': 400000, 'SUBARU': 450000,
                    'JEEP': 550000, 'JAGUAR': 700000, 'LAND ROVER': 800000, 'SUZUKI': 220000,
                    'HAVAL': 350000, 'GWM': 400000, 'MAHINDRA': 380000, 'PEUGEOT': 300000,
                    'CITROEN': 300000
                }
                base_price = base_prices.get(make, 300000)
                year_factor = 1.0 + (year - 2020) * 0.1
                price = int(base_price * year_factor * random.uniform(0.9, 1.2))
                
                # Generate engine size
                engine_sizes = ['1.0L', '1.2L', '1.4L', '1.5L', '1.6L', '1.8L', '2.0L', '2.2L', '2.4L', '2.5L', '2.8L', '3.0L', '3.2L', '3.6L', '5.0L']
                engine_size = random.choice(engine_sizes)
                
                # Generate identifiers
                vin = generate_vin(stock_id)
                registration = generate_registration(province, year, i)
                engine_no = generate_engine_no(make, stock_id)
                stock_code = generate_stock_code(city, stock_id)
                franchise = vehicle_data['franchise']
                
                vehicle = (
                    stock_id, year, make, model, variant, vin, registration,
                    engine_no, mileage, color, province, city, price, price, franchise,
                    body_type, transmission, fuel_type, engine_size, stock_code, condition
                )
                vehicles.append(vehicle)
                stock_id += 1
            
            city_index += 1
    
    return vehicles

def write_sql_file(vehicles, filename='comprehensive-vehicles-400.sql'):
    """Write vehicles to SQL file"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("-- Comprehensive Vehicle Inventory for South Africa\n")
        f.write("-- 400+ vehicles across all provinces and major cities\n")
        f.write("DELETE FROM vehicles; -- Clear existing data first\n\n")
        f.write("INSERT INTO vehicles (\n")
        f.write("    used_vehicle_stock_id, year, make_name, model_name, variant_name, vin, registration,\n")
        f.write("    engine_no, mileage, colour, province_name, city_name, price, first_price, franchise,\n")
        f.write("    body_type, transmission, fuel_type, engine_size, stock_code, condition\n")
        f.write(") VALUES\n")
        
        for i, vehicle in enumerate(vehicles):
            # Format the values
            values = f"({vehicle[0]}, {vehicle[1]}, '{vehicle[2]}', '{vehicle[3]}', '{vehicle[4]}', " \
                    f"'{vehicle[5]}', '{vehicle[6]}', '{vehicle[7]}', {vehicle[8]}, '{vehicle[9]}', " \
                    f"'{vehicle[10]}', '{vehicle[11]}', {vehicle[12]}, {vehicle[13]}, '{vehicle[14]}', " \
                    f"'{vehicle[15]}', '{vehicle[16]}', '{vehicle[17]}', '{vehicle[18]}', '{vehicle[19]}', '{vehicle[20]}')"
            
            # Add comma or semicolon
            if i < len(vehicles) - 1:
                f.write(values + ",\n")
            else:
                f.write(values + ";\n")
        
        f.write("\n-- Verify data loaded\n")
        f.write("-- SELECT COUNT(*) as total_vehicles FROM vehicles;\n")
        f.write("-- SELECT province_name, city_name, COUNT(*) as count FROM vehicles GROUP BY province_name, city_name ORDER BY province_name, city_name;\n")

if __name__ == '__main__':
    print("Generating 420 vehicles across South Africa...")
    vehicles = generate_vehicles(420)
    print(f"Generated {len(vehicles)} vehicles")
    
    output_file = 'comprehensive-vehicles-400.sql'
    write_sql_file(vehicles, output_file)
    print(f"SQL file written to: {output_file}")
    
    # Print summary
    provinces = {}
    for vehicle in vehicles:
        province = vehicle[10]
        city = vehicle[11]
        key = f"{province} - {city}"
        provinces[key] = provinces.get(key, 0) + 1
    
    print("\nVehicles by location:")
    for location, count in sorted(provinces.items()):
        print(f"  {location}: {count}")
