export declare const FALLBACK_VEHICLE_IMAGES: string[];
export interface VehicleWithImages {
    id: number;
    usedVehicleStockId: number;
    imageUrl?: string;
    selectedImage?: string;
    imageGallery?: string[];
    [key: string]: any;
}
/**
 * Get a consistent array of images for a vehicle based on its ID
 * @param vehicle - Vehicle object with id or usedVehicleStockId
 * @param count - Number of images to return (default: 5)
 * @returns Array of image URLs
 */
export declare const getVehicleImages: (vehicle: VehicleWithImages, count?: number) => string[];
/**
 * Get the main/primary image for a vehicle
 * @param vehicle - Vehicle object
 * @returns Primary image URL
 */
export declare const getVehicleMainImage: (vehicle: VehicleWithImages) => string;
/**
 * Enrich a vehicle object with consistent image information
 * @param vehicle - Vehicle object to enrich
 * @returns Vehicle object with selectedImage and imageGallery properties
 */
export declare const enrichVehicleWithImages: (vehicle: VehicleWithImages) => VehicleWithImages;
/**
 * Enrich an array of vehicles with consistent image information
 * @param vehicles - Array of vehicle objects
 * @returns Array of vehicles with image information
 */
export declare const enrichVehiclesWithImages: (vehicles: VehicleWithImages[]) => VehicleWithImages[];
