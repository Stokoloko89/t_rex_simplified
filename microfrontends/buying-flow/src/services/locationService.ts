/**
 * Location Service
 * Manages fetching and caching of provinces and cities dropdown data
 */

import contactRequestService from './contactRequestService';

/**
 * Location data cache with TTL
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache validity

/**
 * Location Service Class
 */
class LocationService {
  private provincesCache: CacheEntry<{ id: number; name: string }[]> | null = null;
  private citiesCache: Map<number, CacheEntry<{ id: number; name: string }[]>> = new Map();

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid<T>(entry: CacheEntry<T> | null): boolean {
    if (!entry) return false;
    const now = Date.now();
    return now - entry.timestamp < CACHE_TTL_MS;
  }

  /**
   * Get provinces from cache or fetch from API
   */
  async getProvinces(): Promise<{ id: number; name: string }[]> {
    try {
      // Return cached data if valid
      if (this.isCacheValid(this.provincesCache)) {
        return this.provincesCache!.data;
      }

      // Fetch fresh data from API
      const provinces = await contactRequestService.getProvinces();

      // Update cache
      this.provincesCache = {
        data: provinces,
        timestamp: Date.now(),
      };

      return provinces;
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
      throw error;
    }
  }

  /**
   * Get cities for a specific province from cache or fetch from API
   */
  async getCities(provinceId: number): Promise<{ id: number; name: string }[]> {
    try {
      // Return cached data if valid
      const cachedCities = this.citiesCache.get(provinceId) || null;
      if (this.isCacheValid(cachedCities)) {
        return cachedCities!.data;
      }

      // Fetch fresh data from API
      const cities = await contactRequestService.getCities(provinceId);

      // Update cache
      this.citiesCache.set(provinceId, {
        data: cities,
        timestamp: Date.now(),
      });

      return cities;
    } catch (error) {
      console.error(`Failed to fetch cities for province ${provinceId}:`, error);
      throw error;
    }
  }

  /**
   * Clear all caches (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.provincesCache = null;
    this.citiesCache.clear();
  }

  /**
   * Clear specific province cache
   */
  clearProvinceCache(): void {
    this.provincesCache = null;
  }

  /**
   * Clear specific city cache
   */
  clearCitiesCache(provinceId?: number): void {
    if (provinceId !== undefined) {
      this.citiesCache.delete(provinceId);
    } else {
      this.citiesCache.clear();
    }
  }

  /**
   * Get cache stats for debugging
   */
  getCacheStats() {
    return {
      provincesCache: this.provincesCache ? 'valid' : 'empty',
      citiesCacheSize: this.citiesCache.size,
      cacheExpiryMs: CACHE_TTL_MS,
    };
  }
}

/**
 * Create and export singleton instance
 */
const locationService = new LocationService();

export default locationService;

/**
 * Export class for testing
 */
export { LocationService };
