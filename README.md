# İzleCine - Film ve Dizi İzleme Platformu

**Proje Tanımı:**  İzleCine.com, film severler için bir eleştiri ve öneri platformudur. Kullanıcılar, en yeni filmleri keşfederken,kullanıcıların kişilsel yorumlarını görebilir, film önerileri sayesinde izleyecekleri yeni yapımlara karar verebilirler. Sitemizde yer alan detaylı film incelemeleri, kullanıcı yorumları ve puanlama sistemi, ziyaretçilere film seçme konusunda yardımcı olur. Ayrıca, kullanıcılar izledikleri filmleri derecelendirip, kendi yorumlarını paylaşarak topluluğumuza katkıda bulunabilirler. izleseMi.com olarak, kaliteli ve güvenilir içerik sunarak, film severlerin doğru film seçimlerini yapmalarına yardımcı olmayı hedefliyoruz. Filmlerle ilgili güncel haberler ile sinema dünyasına dair her şey bir arada!

**Proje Kategorisi:**  Film Eleştirisi ve Öneri Platformu

**Referans Uygulama:** [IMDb](https://www.imdb.com/)

**Uygulama Adresi:** [izlecine.com](https://www.izlecine.com/)

**Grup Adı:** fivebytes

**Proje Ekibi:** Ayten Coşkun,Burak Sayan,Enes Buğra Demirel,Furkan Patat,İbrahim Halil Yılmaz

1. [Gereksinim Analizi](Gereksinim-Analizi.md)
2. [Durum-Diyagrami](Durum-Diyagrami.md)
3. [Durum Senaryoları](Durum-Senaryoları.md)
4. [Front-End](movieapp-frontend)
5. [Back-End](backend)
6. [Video Sunum](Sunum.md)


## 🚀 Production Deployment

### Backend (Render.com)
- **URL:** https://backend-2ikj.onrender.com
- **Environment Variables:**
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: JWT secret key
  - `PORT`: Server port (Render otomatik ayarlar)
  - `EMAIL_USER`: Email service user
  - `EMAIL_PASS`: Email service password
  - `TMDB_ACCESS_TOKEN`: TMDB API access token
  - `REDIS_URL`: Redis connection string

### Frontend (Render.com)
- **URL:** https://movieapp-frontend-ih7l.onrender.com
- **Environment Variables:**
  - `REACT_APP_API_URL`: https://backend-2ikj.onrender.com/api
  - `REACT_APP_ACCESS_TOKEN`: TMDB API access token

### Domain
- **Production Domain:** www.izlecine.com

## 🛠️ Local Development

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd movieapp-frontend
npm install
npm start
```

### Redis Setup (Local)
```bash
# Docker ile Redis başlatma
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Veya Docker Compose ile tüm servisleri başlatma
docker-compose up -d
```

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://furkanpatat:f2002urkan@cluster0.cy9ra.mongodb.net/izlecine?retryWrites=true&w=majority
JWT_SECRET=supersecretkey
PORT=5002
EMAIL_USER=aytenmmmcoskun@gmail.com
EMAIL_PASS=fsiyponpixyjtqqd
TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```
REACT_APP_ACCESS_TOKEN=your_tmdb_access_token
REACT_APP_API_URL=https://backend-2ikj.onrender.com/api
```

## 🔧 Production Changes Made

1. **Backend:**
   - Added `start` script to package.json
   - Updated CORS configuration for production domains
   - Fixed main entry point
   - **Added Redis integration for category caching**

2. **Frontend:**
   - Removed proxy configuration
   - Updated all API calls to use environment variables
   - Added production API URL configuration
   - **Updated category service to use Redis-cached data**

## 🌐 API Endpoints

- **Authentication:** `/api/users`
- **Comments:** `/api/comments`
- **Ratings:** `/api/ratings`
- **Admin:** `/api/admin`
- **Categories:** `/api/categories` (Redis cached)

## 📱 Features

- User authentication and registration
- Movie browsing and search
- User comments and ratings
- Admin panel for user management
- Multi-language support (Turkish/English)
- **Redis-powered category caching for improved performance**

## 🔄 Redis Integration

### Category Caching
- **Popular Movies:** `/api/categories/popular`
- **Trending Movies:** `/api/categories/trending`
- **Genre Movies:** `/api/categories/genre/:genreId`
- **All Categories:** `/api/categories/all`

### Cache Management
- **Cache Duration:** 1 hour for individual categories, 30 minutes for all categories
- **Admin Cache Clear:** Available in admin dashboard
- **Automatic Fallback:** Falls back to TMDB API if Redis is unavailable

### Performance Benefits
- **Faster Response Times:** Cached data returns instantly
- **Reduced API Calls:** Fewer requests to TMDB API
- **Better User Experience:** Smoother category navigation



# Backend

Node.js, Express.js ve MongoDB ile hazırlanmış backend projesi bu dizinde yer alacaktır.

## Kurulum

1. `cd backend`
2. `npm install`
3. `.env` dosyasını oluşturun ve `MONGO_URI` değerini girin.
4. `npm start` ile başlatın.

## Klasör Yapısı

- backend/
  - controllers/
  - models/
  - routes/
  - utils/
    - redis.js (Redis cache utilities)
  - server.js
  - .env
