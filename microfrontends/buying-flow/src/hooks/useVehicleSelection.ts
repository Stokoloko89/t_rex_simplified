/**
 * useVehicleSelection Hook
 * Manages selected vehicles state with localStorage persistence
 */

import { useState, useCallback, useEffect } from 'react';
import { SelectedVehicle, Vehicle } from '../types/vehicle';

const STORAGE_KEY = 't-rex-selected-vehicles';
const MAX_VEHICLES = 4;

interface UseVehicleSelectionReturn {
  selectedVehicles: SelectedVehicle[];
  addVehicle: (vehicle: Vehicle) => boolean;
  removeVehicle: (vehicleId: number) => void;
  clearAll: () => void;
  isVehicleSelected: (vehicleId: number) => boolean;
  getSelectedCount: () => number;
  canAddMoreVehicles: () => boolean;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  clearStorage: () => void;
}

/**
 * Custom hook for managing vehicle selection state
 */
export function useVehicleSelection(
  persistToLocalStorage: boolean = true
): UseVehicleSelectionReturn {
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>([]);

  /**
   * Load vehicles from localStorage on mount
   */
  useEffect(() => {
    if (persistToLocalStorage) {
      loadFromStorage();
    }
  }, [persistToLocalStorage]);

  /**
   * Load from localStorage
   */
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const vehicles = JSON.parse(stored) as SelectedVehicle[];
        setSelectedVehicles(vehicles);
      }
    } catch (error) {
      console.error('Failed to load vehicles from localStorage:', error);
      setSelectedVehicles([]);
    }
  }, []);

  /**
   * Save to localStorage
   */
  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedVehicles));
    } catch (error) {
      console.error('Failed to save vehicles to localStorage:', error);
    }
  }, [selectedVehicles]);

  /**
   * Clear localStorage
   */
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  /**
   * Auto-save to localStorage when selectedVehicles changes
   */
  useEffect(() => {
    if (persistToLocalStorage) {
      saveToStorage();
    }
  }, [selectedVehicles, persistToLocalStorage, saveToStorage]);

  /**
   * Add a vehicle to the selection
   * Returns true if added, false if already selected or max reached
   */
  const addVehicle = useCallback((vehicle: Vehicle): boolean => {
    setSelectedVehicles((prev) => {
      // Check if already selected
      if (prev.some((v) => v.vehicleId === vehicle.vehicleId)) {
        return prev;
      }

      // Check if max vehicles reached
      if (prev.length >= MAX_VEHICLES) {
        console.warn(`Cannot add more than ${MAX_VEHICLES} vehicles`);
        return prev;
      }

      // Add vehicle
      const selectedVehicle: SelectedVehicle = {
        vehicleId: vehicle.vehicleId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        imageUrl: vehicle.imageUrl,
      };

      return [...prev, selectedVehicle];
    });

    return true;
  }, []);

  /**
   * Remove a vehicle from selection
   */
  const removeVehicle = useCallback((vehicleId: number): void => {
    setSelectedVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicleId));
  }, []);

  /**
   * Clear all selected vehicles
   */
  const clearAll = useCallback((): void => {
    setSelectedVehicles([]);
  }, []);

  /**
   * Check if a vehicle is selected
   */
  const isVehicleSelected = useCallback(
    (vehicleId: number): boolean => {
      return selectedVehicles.some((v) => v.vehicleId === vehicleId);
    },
    [selectedVehicles]
  );

  /**
   * Get count of selected vehicles
   */
  const getSelectedCount = useCallback((): number => {
    return selectedVehicles.length;
  }, [selectedVehicles]);

  /**
   * Check if more vehicles can be added
   */
  const canAddMoreVehicles = useCallback((): boolean => {
    return selectedVehicles.length < MAX_VEHICLES;
  }, [selectedVehicles]);

  return {
    selectedVehicles,
    addVehicle,
    removeVehicle,
    clearAll,
    isVehicleSelected,
    getSelectedCount,
    canAddMoreVehicles,
    loadFromStorage,
    saveToStorage,
    clearStorage,
  };
}

export type { UseVehicleSelectionReturn };
