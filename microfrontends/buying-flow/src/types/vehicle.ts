/**
 * Vehicle Type Definitions
 * Data structures for vehicle selection and display
 */

/**
 * Vehicle - Represents a single vehicle available on the platform
 */
export interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string; // Province/region
  mileage: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  color: string;
  bodyType: string;
  imageUrl: string;
  stockNumber: string;
  dealershipId?: number; // Optional, may not be revealed to user
}

/**
 * SelectedVehicle - A vehicle selected by the user for contact request
 * Subset of Vehicle properties to reduce payload size
 */
export interface SelectedVehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
}

/**
 * VehicleSelectionState - Manages the state of selected vehicles
 */
export interface VehicleSelectionState {
  selectedVehicles: SelectedVehicle[];
  isLoading: boolean;
  error?: string;
}

/**
 * Type guard to check if value is a valid Vehicle
 */
export function isVehicle(value: unknown): value is Vehicle {
  return (
    typeof value === 'object' &&
    value !== null &&
    'vehicleId' in value &&
    'make' in value &&
    'model' in value &&
    'year' in value
  );
}

/**
 * Type guard to check if value is a valid SelectedVehicle
 */
export function isSelectedVehicle(value: unknown): value is SelectedVehicle {
  return (
    typeof value === 'object' &&
    value !== null &&
    'vehicleId' in value &&
    'make' in value &&
    'model' in value &&
    'year' in value
  );
}
