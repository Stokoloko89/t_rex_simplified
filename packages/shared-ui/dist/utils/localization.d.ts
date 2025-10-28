/**
 * South African Localization Utilities
 * Handles currency formatting, metric system conversions, and local preferences
 */
export declare const formatCurrency: (amount: number) => string;
export declare const formatCurrencyDetailed: (amount: number) => string;
export declare const formatDistance: (distanceInKm: number) => string;
export declare const formatFuelConsumption: (litersPerHundredKm: number) => string;
export declare const formatEngineSize: (liters: number) => string;
export declare const formatWeight: (weightInKg: number) => string;
export declare const formatSpeed: (speedInKmh: number) => string;
export declare const formatPower: (powerInKw: number) => string;
export declare const formatTorque: (torqueInNm: number) => string;
export declare const formatNumber: (num: number) => string;
export declare const formatPercentage: (decimal: number) => string;
export declare const formatDate: (date: Date) => string;
export declare const formatDateShort: (date: Date) => string;
export declare const milesToKm: (miles: number) => number;
export declare const kmToMiles: (km: number) => number;
export declare const mpgToLitersPer100km: (mpg: number) => number;
export declare const litersPer100kmToMpg: (liters: number) => number;
export declare const hpToKw: (hp: number) => number;
export declare const kwToHp: (kw: number) => number;
export declare const southAfricanProvinces: string[];
export declare const majorCities: string[];
export declare const validateSARegistration: (registration: string) => boolean;
export declare const formatPhoneNumber: (phone: string) => string;
declare const _default: {
    formatCurrency: (amount: number) => string;
    formatCurrencyDetailed: (amount: number) => string;
    formatDistance: (distanceInKm: number) => string;
    formatFuelConsumption: (litersPerHundredKm: number) => string;
    formatEngineSize: (liters: number) => string;
    formatWeight: (weightInKg: number) => string;
    formatSpeed: (speedInKmh: number) => string;
    formatPower: (powerInKw: number) => string;
    formatTorque: (torqueInNm: number) => string;
    formatNumber: (num: number) => string;
    formatPercentage: (decimal: number) => string;
    formatDate: (date: Date) => string;
    formatDateShort: (date: Date) => string;
    milesToKm: (miles: number) => number;
    kmToMiles: (km: number) => number;
    mpgToLitersPer100km: (mpg: number) => number;
    litersPer100kmToMpg: (liters: number) => number;
    hpToKw: (hp: number) => number;
    kwToHp: (kw: number) => number;
    southAfricanProvinces: string[];
    majorCities: string[];
    validateSARegistration: (registration: string) => boolean;
    formatPhoneNumber: (phone: string) => string;
};
export default _default;
