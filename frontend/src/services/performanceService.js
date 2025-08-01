// Performance optimization utilities
export const performanceService = {
  // Cache for API responses
  cache: new Map(),
  
  // Debounce function for search/input
  debounce: (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  // Throttle function for scroll/resize events
  throttle: (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Cache API responses with expiration
  cacheResponse: (key, data, expirationMinutes = 5) => {
    const expiration = Date.now() + (expirationMinutes * 60 * 1000);
    performanceService.cache.set(key, {
      data,
      expiration
    });
  },

  // Get cached response if not expired
  getCachedResponse: (key) => {
    const cached = performanceService.cache.get(key);
    if (cached && cached.expiration > Date.now()) {
      return cached.data;
    }
    performanceService.cache.delete(key);
    return null;
  },

  // Clear expired cache entries
  clearExpiredCache: () => {
    const now = Date.now();
    for (const [key, value] of performanceService.cache.entries()) {
      if (value.expiration <= now) {
        performanceService.cache.delete(key);
      }
    }
  },

  // Preload critical resources
  preloadImages: (imagePaths) => {
    imagePaths.forEach(path => {
      const img = new Image();
      img.src = path;
    });
  },

  // Lazy load components
  lazyLoad: (importFunction) => {
    return React.lazy(importFunction);
  },

  // Optimize large datasets
  optimizeDataset: (data, maxItems = 1000) => {
    if (data.length <= maxItems) return data;
    
    const step = Math.ceil(data.length / maxItems);
    return data.filter((_, index) => index % step === 0);
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
      };
    }
    return null;
  }
};

export default performanceService;
