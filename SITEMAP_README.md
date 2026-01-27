# Sitemap & Robots.txt - دليل سريع

## ✅ الإعداد التلقائي

تم إعداد `next-sitemap` تلقائياً لتوليد:
- `/sitemap.xml` 
- `/robots.txt`

## 📋 الملفات المُعدة

1. **`next-sitemap.config.js`** - ملف الإعدادات
2. **`package.json`** - يحتوي على `postbuild` script

## 🔄 كيف يعمل

عند تشغيل `npm run build`:
1. Next.js يبني المشروع
2. تلقائياً `postbuild` script يعمل
3. `next-sitemap` يولد الملفات في `public/`
4. مع static export، الملفات تُنسخ إلى `out/`

## ✅ كيف تتأكد أن sitemap يعمل؟

### 1. بعد البناء:
```bash
npm run build
```

### 2. تحقق من الملفات:
```bash
# في public/
ls public/sitemap.xml
ls public/robots.txt

# في out/ (بعد static export)
ls out/sitemap.xml
ls out/robots.txt
```

### 3. تحقق محلياً:
```bash
# افتح المتصفح
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

### 4. تحقق في Production:
```
https://www.lingotheory.org/sitemap.xml
https://www.lingotheory.org/robots.txt
```

### 5. اختبار مع Google Search Console:
- اذهب إلى [Google Search Console](https://search.google.com/search-console)
- أضف الموقع
- أرسل sitemap: `https://www.lingotheory.org/sitemap.xml`

## 📝 الصفحات المضمنة

- `/` (priority: 1.0)
- `/practice` (priority: 0.9)
- `/mock-test` (priority: 0.9)
- `/auth` (priority: 0.8)
- `/terms` (priority: 0.5)
- `/privacy` (priority: 0.5)

## 🚫 الصفحات المستثناة

- `/dashboard`
- `/api/*`
- `/auth/callback`
- `/auth/reset`
- `/cover`

## 🔧 التعديل

لتعديل الإعدادات، عدّل `next-sitemap.config.js`

