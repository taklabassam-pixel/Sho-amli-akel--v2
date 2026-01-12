// 1. تحديد اسم ونسخة ذاكرة التخزين المؤقت
const CACHE_NAME = 'sho amli akel?-v1';

// قائمة الملفات الأساسية التي يجب تخزينها مؤقتًا عند التثبيت
// ⚠️ يجب عليك تحديث هذه القائمة لتشمل جميع ملفاتك الأساسية
const urlsToCache = [
  '/', // الصفحة الرئيسية (إذا كانت index.html أو /)
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  '/index.html',
  '/favicon.ico',
  '/index_prompt1.html',
  '/mealsdatabase1.js',
  '/analyse_meals_m.js',
  '/style.css',
  '/Amiri-Regular.ttf',
  '/Amiri-Bold.ttf',
  '/ExtendedKufic-Bold.ttf',
  '/Segoe UI-Regular.ttf',
  '/Segoe UI-Bold.ttf',
  '/Sans-Serif-Regular.ttf',
  '/Sans-Serif-Bold.ttf',
  '/J7aRnpd8CGxBHpUgtLMA7w.woff2',
  '/J7acnpd8CGxBHp2VkaY6zp5yGw.woff2',
  '/J7acnpd8CGxBHp2VkaYxzp5yGw.woff2',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
   '/hello.png'
  // أضف جميع ملفات الخطوط والصور الثابتة هنا
];

// 2. حدث التثبيت (Install Event)
// يتم تشغيل هذا الحدث عندما يقوم المتصفح بتثبيت الـ Service Worker لأول مرة
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 3. حدث الجلب (Fetch Event)
// يتم تشغيل هذا الحدث في كل مرة يحاول فيها المتصفح جلب مورد (مثل صورة أو ملف CSS)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان المورد موجودًا في ذاكرة التخزين المؤقت، يتم إرجاعه مباشرة
        if (response) {
          return response;
        }
        // وإلا، يتم طلبه من الشبكة
        return fetch(event.request);
      })
  );
});

// 4. حدث التفعيل (Activate Event)
// يتم تشغيله عند تفعيل نسخة جديدة من الـ Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  // حذف أي ذاكرة تخزين مؤقت قديمة
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
