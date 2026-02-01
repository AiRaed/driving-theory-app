# إصلاح مشكلة Password Reset في Supabase

## المشكلة الحالية
الرابط الذي يأتي من Supabase **لا يحتوي على** `token_hash` و `type=recovery` في الـ URL.

## الحل: فحص إعدادات Supabase Dashboard

### 1. Email Template (الأهم!)

1. اذهب إلى: **Supabase Dashboard → Authentication → Email Templates**
2. اختر: **"Reset password"** template
3. تأكد أن الرابط في الـ template يستخدم **فقط** `{{ .ConfirmationURL }}`

**مثال صحيح:**
```
Click here to reset your password: {{ .ConfirmationURL }}
```

**مثال خاطئ (لا تستخدمه):**
```
Click here: {{ .SiteURL }}/auth/reset?token={{ .Token }}
```

**لماذا؟**
- `{{ .ConfirmationURL }}` يحتوي تلقائياً على `token_hash` و `type=recovery`
- إذا بنيت الرابط يدوياً، لن يعمل بشكل صحيح

### 2. URL Configuration

1. اذهب إلى: **Supabase Dashboard → Authentication → URL Configuration**

2. **Site URL** يجب أن يكون:
   ```
   https://www.lingotheory.org
   ```
   (أو `http://localhost:3000` للاختبار المحلي)

3. **Redirect URLs** يجب أن تحتوي على:
   ```
   http://localhost:3000/auth/reset
   https://www.lingotheory.org/auth/reset
   http://localhost:3000/auth/callback
   https://www.lingotheory.org/auth/callback
   ```

   **مهم:** لا تستخدم wildcards مثل `*` أو `**`

### 3. Environment Variables

تأكد أن `NEXT_PUBLIC_SITE_URL` مضبوط:

**Development (.env.local):**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production (Render):**
```env
NEXT_PUBLIC_SITE_URL=https://www.lingotheory.org
```

## كيفية التحقق من المشكلة

1. افتح Console في المتصفح (F12)
2. اطلب إعادة تعيين كلمة المرور
3. افتح الرابط من الإيميل
4. في Console ستجد:
   - `🔍 FULL URL:` - الرابط الكامل
   - `🔍 All query params:` - جميع المعاملات في الـ URL
   - `✅ Final parsed values:` - القيم التي تم قراءتها

## إذا كان الرابط لا يحتوي على token_hash

هذا يعني أن:
1. **Email Template غير صحيح** - يجب استخدام `{{ .ConfirmationURL }}` فقط
2. **Redirect URL غير موجود** في Supabase Dashboard
3. **Site URL غير صحيح** في Supabase Dashboard

## الخطوات التالية

1. ✅ فحص Email Template في Supabase
2. ✅ فحص URL Configuration في Supabase
3. ✅ طلب إيميل جديد لإعادة تعيين كلمة المرور
4. ✅ فحص Console لمعرفة المعاملات الموجودة في الرابط

