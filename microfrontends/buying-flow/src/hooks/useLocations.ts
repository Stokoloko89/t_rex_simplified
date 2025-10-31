/**
 * useLocations Hook
 * Manages provinces and cities dropdown data fetching and state
 */

import { useState, useEffect, useCallback } from 'react';
import locationService from '../services/locationService';

interface LocationOption {
  id: number;
  name: string;
}

interface UseLocationsReturn {
  provinces: LocationOption[];
  cities: LocationOption[];
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;
  errorProvinces: string | null;
  errorCities: string | null;
  selectedProvince: number | null;
  loadCities: (provinceId: number) => Promise<void>;
  setSelectedProvince: (provinceId: number | null) => void;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing location dropdown data
 */
export function useLocations(): UseLocationsReturn {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [errorProvinces, setErrorProvinces] = useState<string | null>(null);
  const [errorCities, setErrorCities] = useState<string | null>(null);

  /**
   * Load provinces on component mount
   */
  useEffect(() => {
    loadProvinces();
  }, []);

  /**
   * Load cities when province selection changes
   */
  useEffect(() => {
    if (selectedProvince) {
      loadCities(selectedProvince);
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  /**
   * Load provinces from service
   */
  const loadProvinces = useCallback(async () => {
    setIsLoadingProvinces(true);
    setErrorProvinces(null);
    try {
      const data = await locationService.getProvinces();
      setProvinces(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load provinces';
      setErrorProvinces(message);
      console.error('Error loading provinces:', error);
    } finally {
      setIsLoadingProvinces(false);
    }
  }, []);

  /**
   * Load cities for a specific province
   */
  const loadCities = useCallback(async (provinceId: number) => {
    setIsLoadingCities(true);
    setErrorCities(null);
    try {
      const data = await locationService.getCities(provinceId);
      setCities(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load cities';
      setErrorCities(message);
      console.error(`Error loading cities for province ${provinceId}:`, error);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  /**
   * Refresh all location data
   */
  const refresh = useCallback(async () => {
    locationService.clearCache();
    await loadProvinces();
    if (selectedProvince) {
      await loadCities(selectedProvince);
    }
  }, [selectedProvince, loadProvinces, loadCities]);

  return {
    provinces,
    cities,
    isLoadingProvinces,
    isLoadingCities,
    errorProvinces,
    errorCities,
    selectedProvince,
    loadCities,
    setSelectedProvince,
    refresh,
  };
}

export type { UseLocationsReturn, LocationOption };
