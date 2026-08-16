# دليل Deploy على Render

## الخطوات:

### 1. إنشاء حساب على Render
- اذهب إلى [render.com](https://render.com)
- سجل حساب جديد أو سجل دخول

### 2. ربط Repository
- في Dashboard، اضغط على "New +" → "Web Service"
- اختر "Build and deploy from a Git repository"
- اربط GitHub/GitLab repository الخاص بك

### 3. إعدادات الـ Service

**Name:** `driving-theory-app`

**Environment:** `Node`

**Region:** اختر الأقرب لك (مثلاً: Frankfurt, Germany)

**Branch:** `main` (أو `master`)

**Root Directory:** اتركه فارغ (أو `.`)

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### 4. Environment Variables

اضغط على "Environment" وأضف المتغيرات التالية:

```
NODE_ENV=production

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID_FULL_ACCESS=your_stripe_price_id

NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
```

**ملاحظة:** استبدل القيم بقيمك الفعلية من Supabase و Stripe.

### 5. Plan
- اختر **Starter** plan (مجاني مع قيود)
- أو **Standard** plan للاستخدام الإنتاجي

### 6. Deploy
- اضغط على "Create Web Service"
- Render سيقوم ببناء وتشغيل التطبيق تلقائياً
- انتظر حتى يكتمل البناء (عادة 5-10 دقائق)

### 7. التحقق من الـ Deploy
- بعد اكتمال البناء، ستجد رابط التطبيق في Dashboard
- مثال: `https://driving-theory-app.onrender.com`

## ملاحظات مهمة:

1. **الـ Free Plan:**
   - التطبيق ينام بعد 15 دقيقة من عدم الاستخدام
   - أول طلب بعد النوم قد يستغرق 30-60 ثانية

2. **الـ Environment Variables:**
   - تأكد من إضافة جميع المتغيرات قبل الـ deploy
   - `NEXT_PUBLIC_SITE_URL` يجب أن يكون رابط Render الخاص بك

3. **الـ Build:**
   - إذا فشل البناء، تحقق من logs في Render Dashboard
   - جميع API routes ستعمل بشكل طبيعي (لا يوجد static export)

4. **الـ API Routes:**
   - جميع API routes ستعمل بشكل طبيعي
   - `/api/access/status` و `/api/stripe/*` ستعمل

## Troubleshooting:

### مشكلة: Build فاشل
```bash
# تحقق من logs في Render Dashboard
# تأكد من أن جميع dependencies موجودة في package.json
```

### مشكلة: API routes لا تعمل
```bash
# تأكد من أن next.config.mjs لا يحتوي على output: 'export'
# تأكد من أن التطبيق يعمل في server mode وليس static export
```

### مشكلة: Environment Variables غير موجودة
```bash
# تأكد من إضافة جميع المتغيرات في Render Dashboard
# تأكد من أن القيم صحيحة (بدون مسافات إضافية)
```

## Auto-Deploy:

Render يقوم بالـ auto-deploy تلقائياً عند:
- Push إلى branch المحدد (main/master)
- Merge Pull Request

يمكنك تعطيله من Settings → Auto-Deploy.

## Monitoring:

- **Logs:** متاحة في Render Dashboard → Logs tab
- **Metrics:** متاحة في Render Dashboard → Metrics tab
- **Alerts:** يمكنك إعداد alerts للـ downtime

## Custom Domain:

1. اذهب إلى Settings → Custom Domains
2. أضف domain الخاص بك
3. اتبع التعليمات لإعداد DNS records

---

**جاهز للـ Deploy! 🚀**

