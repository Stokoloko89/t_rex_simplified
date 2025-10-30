// Vehicle Image Utilities - Provides consistent image selection across components

export const FALLBACK_VEHICLE_IMAGES = [
  'https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1283',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1125',
  'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
  'https://images.unsplash.com/photo-1588258219511-64eb629cb833?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1593544340816-93d84a106415?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1195',
  'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1172',
];

// Simple seeded random function to ensure consistent image selection
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Vehicle interface for typing
export interface VehicleWithImages {
  id: number;
  usedVehicleStockId: number;
  imageUrl?: string;
  selectedImage?: string;
  imageGallery?: string[];
  [key: string]: any; // Allow other vehicle properties
}

/**
 * Get a consistent array of images for a vehicle based on its ID
 * @param vehicle - Vehicle object with id or usedVehicleStockId
 * @param count - Number of images to return (default: 5)
 * @returns Array of image URLs
 */
export const getVehicleImages = (vehicle: VehicleWithImages, count: number = 5): string[] => {
  // Use vehicle ID as seed to ensure consistent image selection
  const seed = vehicle.id || vehicle.usedVehicleStockId || 1;
  
  // Create a deterministic shuffle based on vehicle ID
  const shuffledImages = [...FALLBACK_VEHICLE_IMAGES]
    .map((img, index) => ({ img, sort: seededRandom(seed + index) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ img }) => img)
    .slice(0, count);
  
  return shuffledImages;
};

/**
 * Get the main/primary image for a vehicle
 * @param vehicle - Vehicle object
 * @returns Primary image URL
 */
export const getVehicleMainImage = (vehicle: VehicleWithImages): string => {
  // Priority: selectedImage > imageUrl > first from consistent gallery > fallback
  if (vehicle.selectedImage) return vehicle.selectedImage;
  if (vehicle.imageUrl) return vehicle.imageUrl;
  
  const images = getVehicleImages(vehicle, 1);
  return images.length > 0 ? images[0] : FALLBACK_VEHICLE_IMAGES[0];
};

/**
 * Enrich a vehicle object with consistent image information
 * @param vehicle - Vehicle object to enrich
 * @returns Vehicle object with selectedImage and imageGallery properties
 */
export const enrichVehicleWithImages = (vehicle: VehicleWithImages): VehicleWithImages => {
  return {
    ...vehicle,
    selectedImage: getVehicleMainImage(vehicle),
    imageGallery: getVehicleImages(vehicle),
  };
};

/**
 * Enrich an array of vehicles with consistent image information
 * @param vehicles - Array of vehicle objects
 * @returns Array of vehicles with image information
 */
export const enrichVehiclesWithImages = (vehicles: VehicleWithImages[]): VehicleWithImages[] => {
  return vehicles.map(enrichVehicleWithImages);
};