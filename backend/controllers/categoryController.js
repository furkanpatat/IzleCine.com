const axios = require('axios');
const { setCache, getCache } = require('../utils/redis');

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// TMDB API için axios instance
const tmdbAxios = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  params: {
    language: 'tr-TR'
  }
});

const categoryController = {
  // Popüler filmleri getir (Redis cache ile)
  getPopularMovies: async (req, res) => {
    try {
      const cacheKey = 'category:popular';
      const page = req.query.page || 1;
      
      console.log(`🔍 [CACHE CHECK] Checking cache for: ${cacheKey}:${page}`);
      
      // Önce cache'den kontrol et
      const cachedData = await getCache(`${cacheKey}:${page}`);
      if (cachedData) {
        console.log(`✅ [CACHE HIT] Data found in cache for: ${cacheKey}:${page}`);
        return res.json({
          ...cachedData,
          fromCache: true,
          cacheKey: `${cacheKey}:${page}`
        });
      }

      console.log(`❌ [CACHE MISS] No data in cache, fetching from TMDB API for: ${cacheKey}:${page}`);
      
      // Cache'de yoksa TMDB'den al
      const response = await tmdbAxios.get('/movie/popular', {
        params: { page }
      });

      const data = response.data;
      
      console.log(`💾 [CACHE SAVE] Saving data to cache for: ${cacheKey}:${page}`);
      
      // Cache'e kaydet (1 saat)
      await setCache(`${cacheKey}:${page}`, data, 3600);

      res.json({
        ...data,
        fromCache: false,
        cacheKey: `${cacheKey}:${page}`
      });
    } catch (error) {
      console.error('❌ [ERROR] Error fetching popular movies:', error);
      res.status(500).json({ 
        message: 'Error fetching popular movies',
        error: error.message 
      });
    }
  },

  // Trend filmleri getir (Redis cache ile)
  getTrendingMovies: async (req, res) => {
    try {
      const cacheKey = 'category:trending';
      const page = req.query.page || 1;
      
      console.log(`🔍 [CACHE CHECK] Checking cache for: ${cacheKey}:${page}`);
      
      // Önce cache'den kontrol et
      const cachedData = await getCache(`${cacheKey}:${page}`);
      if (cachedData) {
        console.log(`✅ [CACHE HIT] Data found in cache for: ${cacheKey}:${page}`);
        return res.json({
          ...cachedData,
          fromCache: true,
          cacheKey: `${cacheKey}:${page}`
        });
      }

      console.log(`❌ [CACHE MISS] No data in cache, fetching from TMDB API for: ${cacheKey}:${page}`);
      
      // Cache'de yoksa TMDB'den al
      const response = await tmdbAxios.get('/trending/movie/week', {
        params: { page }
      });

      const data = response.data;
      
      console.log(`💾 [CACHE SAVE] Saving data to cache for: ${cacheKey}:${page}`);
      
      // Cache'e kaydet (1 saat)
      await setCache(`${cacheKey}:${page}`, data, 3600);

      res.json({
        ...data,
        fromCache: false,
        cacheKey: `${cacheKey}:${page}`
      });
    } catch (error) {
      console.error('❌ [ERROR] Error fetching trending movies:', error);
      res.status(500).json({ 
        message: 'Error fetching trending movies',
        error: error.message 
      });
    }
  },

  // Kategoriye göre filmleri getir (Redis cache ile)
  getMoviesByGenre: async (req, res) => {
    try {
      const { genreId } = req.params;
      const page = req.query.page || 1;
      const cacheKey = `category:genre:${genreId}`;
      
      console.log(`🔍 [CACHE CHECK] Checking cache for: ${cacheKey}:${page}`);
      
      // Önce cache'den kontrol et
      const cachedData = await getCache(`${cacheKey}:${page}`);
      if (cachedData) {
        console.log(`✅ [CACHE HIT] Data found in cache for: ${cacheKey}:${page}`);
        return res.json({
          ...cachedData,
          fromCache: true,
          cacheKey: `${cacheKey}:${page}`
        });
      }

      console.log(`❌ [CACHE MISS] No data in cache, fetching from TMDB API for: ${cacheKey}:${page}`);
      
      // Cache'de yoksa TMDB'den al
      const response = await tmdbAxios.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page: page,
          sort_by: 'popularity.desc'
        }
      });

      const data = response.data;
      
      console.log(`💾 [CACHE SAVE] Saving data to cache for: ${cacheKey}:${page}`);
      
      // Cache'e kaydet (1 saat)
      await setCache(`${cacheKey}:${page}`, data, 3600);

      res.json({
        ...data,
        fromCache: false,
        cacheKey: `${cacheKey}:${page}`
      });
    } catch (error) {
      console.error('❌ [ERROR] Error fetching movies by genre:', error);
      res.status(500).json({ 
        message: 'Error fetching movies by genre',
        error: error.message 
      });
    }
  },

  // Tüm kategorileri tek seferde getir (Redis cache ile)
  getAllCategories: async (req, res) => {
    try {
      const cacheKey = 'categories:all';
      
      console.log(`🔍 [CACHE CHECK] Checking cache for: ${cacheKey}`);
      
      // Önce cache'den kontrol et
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log(`✅ [CACHE HIT] Data found in cache for: ${cacheKey}`);
        return res.json({
          ...cachedData,
          fromCache: true,
          cacheKey: cacheKey
        });
      }

      console.log(`❌ [CACHE MISS] No data in cache, fetching from TMDB API for: ${cacheKey}`);
      
      // Cache'de yoksa tüm kategorileri paralel olarak al
      const categoryPromises = [
        tmdbAxios.get('/movie/popular', { params: { page: 1 } }),
        tmdbAxios.get('/trending/movie/week', { params: { page: 1 } }),
        tmdbAxios.get('/discover/movie', { 
          params: { with_genres: 28, page: 1, sort_by: 'popularity.desc' } 
        }),
        tmdbAxios.get('/discover/movie', { 
          params: { with_genres: 35, page: 1, sort_by: 'popularity.desc' } 
        }),
        tmdbAxios.get('/discover/movie', { 
          params: { with_genres: 18, page: 1, sort_by: 'popularity.desc' } 
        })
      ];

      const results = await Promise.all(categoryPromises);
      
      const categories = {
        popular: results[0].data,
        trending: results[1].data,
        action: results[2].data,
        comedy: results[3].data,
        drama: results[4].data
      };
      
      console.log(`💾 [CACHE SAVE] Saving data to cache for: ${cacheKey}`);
      
      // Cache'e kaydet (30 dakika)
      await setCache(cacheKey, categories, 1800);

      res.json({
        ...categories,
        fromCache: false,
        cacheKey: cacheKey
      });
    } catch (error) {
      console.error('❌ [ERROR] Error fetching all categories:', error);
      res.status(500).json({ 
        message: 'Error fetching all categories',
        error: error.message 
      });
    }
  },

  // Cache'i temizle (admin için)
  clearCategoryCache: async (req, res) => {
    try {
      const { deleteCache } = require('../utils/redis');
      
      console.log('🗑️ [CACHE CLEAR] Clearing all category caches...');
      
      // Tüm kategori cache'lerini temizle
      const cacheKeys = [
        'category:popular',
        'category:trending',
        'category:genre:28',
        'category:genre:35',
        'category:genre:18',
        'categories:all'
      ];

      let deletedCount = 0;
      for (const key of cacheKeys) {
        try {
          await deleteCache(key);
          console.log(`🗑️ [CACHE CLEAR] Deleted: ${key}`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ [CACHE CLEAR ERROR] Failed to delete ${key}:`, error);
        }
      }

      // Tüm category: ile başlayan key'leri de temizle
      const { getRedisClient } = require('../utils/redis');
      const client = getRedisClient();
      const allKeys = await client.keys('category:*');
      
      if (allKeys.length > 0) {
        console.log(`🗑️ [CACHE CLEAR] Found additional keys to delete:`, allKeys);
        for (const key of allKeys) {
          try {
            await client.del(key);
            console.log(`🗑️ [CACHE CLEAR] Deleted additional key: ${key}`);
            deletedCount++;
          } catch (error) {
            console.error(`❌ [CACHE CLEAR ERROR] Failed to delete ${key}:`, error);
          }
        }
      }

      console.log(`✅ [CACHE CLEAR] Cache clearing completed. Total deleted: ${deletedCount}`);

      res.json({ 
        message: 'Category cache cleared successfully',
        deletedCount: deletedCount,
        clearedKeys: cacheKeys,
        additionalKeys: allKeys || []
      });
    } catch (error) {
      console.error('❌ [ERROR] Error clearing category cache:', error);
      res.status(500).json({ 
        message: 'Error clearing category cache',
        error: error.message 
      });
    }
  }
};

module.exports = categoryController; 