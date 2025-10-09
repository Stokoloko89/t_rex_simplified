/**
 * South African Localization Utilities
 * Handles currency formatting, metric system conversions, and local preferences
 */

// Currency formatting for South African Rand (ZAR)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency with decimals when needed
export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Distance formatting (kilometers)
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toLocaleString('en-ZA')} km`;
};

// Fuel consumption (liters per 100km)
export const formatFuelConsumption = (litersPerHundredKm: number): string => {
  return `${litersPerHundredKm.toFixed(1)} L/100km`;
};

// Engine size (liters)
export const formatEngineSize = (liters: number): string => {
  return `${liters.toFixed(1)}L`;
};

// Weight formatting (kilograms/tonnes)
export const formatWeight = (weightInKg: number): string => {
  if (weightInKg >= 1000) {
    return `${(weightInKg / 1000).toFixed(1)} tonnes`;
  }
  return `${weightInKg.toLocaleString('en-ZA')} kg`;
};

// Speed formatting (km/h)
export const formatSpeed = (speedInKmh: number): string => {
  return `${speedInKmh} km/h`;
};

// Power formatting (kW and HP)
export const formatPower = (powerInKw: number): string => {
  const hp = Math.round(powerInKw * 1.34102);
  return `${powerInKw} kW (${hp} HP)`;
};

// Torque formatting (Nm)
export const formatTorque = (torqueInNm: number): string => {
  return `${torqueInNm} Nm`;
};

// Number formatting with South African locale
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-ZA');
};

// Percentage formatting
export const formatPercentage = (decimal: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(decimal);
};

// Date formatting for South Africa
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Short date formatting
export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Convert miles to kilometers
export const milesToKm = (miles: number): number => {
  return miles * 1.60934;
};

// Convert kilometers to miles
export const kmToMiles = (km: number): number => {
  return km / 1.60934;
};

// Convert MPG to L/100km
export const mpgToLitersPer100km = (mpg: number): number => {
  return 235.214 / mpg;
};

// Convert L/100km to MPG
export const litersPer100kmToMpg = (liters: number): number => {
  return 235.214 / liters;
};

// Convert HP to kW
export const hpToKw = (hp: number): number => {
  return hp / 1.34102;
};

// Convert kW to HP
export const kwToHp = (kw: number): number => {
  return kw * 1.34102;
};

// South African provinces for location selection
export const southAfricanProvinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

// Major South African cities
export const majorCities = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Pietermaritzburg',
  'Kimberley',
  'Polokwane',
  'Nelspruit',
  'Mahikeng',
];

// Vehicle registration format validation for South Africa
export const validateSARegistration = (registration: string): boolean => {
  // South African registration format: ABC 123 GP or ABC123GP
  const saRegex = /^[A-Z]{2,3}\s?\d{3,4}\s?[A-Z]{2}$/i;
  return saRegex.test(registration.trim());
};

// Format South African phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as +27 XX XXX XXXX
  if (digits.startsWith('27') && digits.length === 11) {
    return `+27 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  
  // Format as 0XX XXX XXXX
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  return phone; // Return original if doesn't match expected format
};

export default {
  formatCurrency,
  formatCurrencyDetailed,
  formatDistance,
  formatFuelConsumption,
  formatEngineSize,
  formatWeight,
  formatSpeed,
  formatPower,
  formatTorque,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateShort,
  milesToKm,
  kmToMiles,
  mpgToLitersPer100km,
  litersPer100kmToMpg,
  hpToKw,
  kwToHp,
  southAfricanProvinces,
  majorCities,
  validateSARegistration,
  formatPhoneNumber,
};
