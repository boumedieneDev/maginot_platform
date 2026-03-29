# دليل نظام الإيميلات في مشروع Maginot Platform

هذا الملف يلخص نظام الإيميلات التلقائية والحملات البريدية داخل المشروع، حتى يكون مرجعًا سريعًا لفريق التطوير أو لأي أداة مساعدة مثل Antigravity.

## 1) الفكرة العامة

النظام الحالي لا يعتمد على خدمة تسويق خارجية مثل Mailchimp أو SendGrid كمنصة مستقلة.  
المنظومة مبنية بالكامل داخل المشروع وتعتمد على:

- Next.js للواجهة
- Supabase كقاعدة بيانات وEdge Functions
- SMTP الخاص بـ cPanel للإرسال الفعلي

الهدف هو:

- إرسال إيميل تلقائي بعد تسجيل lead جديد
- إنشاء حملات بريدية من لوحة الإدارة
- تخزين الرسائل أولًا في `email_queue`
- إرسال الرسائل عبر `email-worker`
- تتبع بسيط لفتح الرسالة

---

## 2) البنية الحالية

### الجداول المهمة

- `leads`
  - يخزن بيانات المستخدمين الذين يسجلون في الموقع

- `email_templates`
  - يخزن قوالب البريد
  - يدعم:
    - قالب خاص بخدمة معينة `service_id`
    - قالب عام `is_global_default`
    - حالة التفعيل `status = Active / Inactive`

- `email_queue`
  - الطابور الداخلي للإيميلات
  - كل رسالة تذهب إليه أولًا قبل الإرسال

### Edge Functions

- `email-trigger`
  - يشتغل عند إدخال lead جديد
  - يجهز رسالة البريد ويضيفها إلى `email_queue`

- `email-campaign`
  - يستخدم من صفحة الحملات
  - يضيف رسائل الحملة إلى `email_queue`

- `email-worker`
  - يقرأ الرسائل `pending`
  - يرسلها فعليًا عبر SMTP
  - يحدّث الحالة إلى `sent` أو `failed`
  - يدير retry حتى 3 محاولات

- `email-open`
  - endpoint للتتبع البسيط لفتح الرسائل
  - يحدّث `opened_at` و `open_count`

---

## 3) مسار الإرسال

### A. بعد التسجيل

1. المستخدم يملأ نموذج التسجيل.
2. يتم إدخال البيانات في جدول `leads`.
3. Trigger في قاعدة البيانات يلتقط `INSERT`.
4. يتم اختيار القالب المناسب:
   - قالب خاص بالخدمة إن وجد
   - وإلا القالب العام النشط
5. يتم إدخال رسالة جديدة في `email_queue`.
6. `email-worker` يرسل الرسالة لاحقًا.

### B. من صفحة الحملات

1. الأدمن يختار قالبًا.
2. يختار:
   - Test
   - All leads
   - Service leads
3. النظام لا يرسل مباشرة.
4. الرسائل تُضاف إلى `email_queue`.
5. `email-worker` يرسلها عند التشغيل.

---

## 4) منطق القوالب

### المتغيرات المدعومة

في `subject` و `html_body` يتم استبدال:

- `{{form_name}}`
- `{{submission_date}}`
- `{{submitter_name}}`
- `{{email}}`
- `{{phone}}`
- `{{company_name}}`

### من أين تأتي القيم

- `form_name`
  - اسم الخدمة المرتبطة بالـ lead
  - أو "Notre service" / "Notre plateforme" عند عدم وجود خدمة

- `submission_date`
  - تاريخ تسجيل lead أو تاريخ الاختبار

- `submitter_name`
  - الاسم الكامل

- `email`
  - البريد الإلكتروني للعميل

- `phone`
  - الهاتف

- `company_name`
  - اسم الشركة إذا كان متوفرًا

---

## 5) الإرسال الفعلي SMTP

الإرسال يتم عبر بيانات cPanel:

- `SMTP_HOST=mail.maginot.app`
- `SMTP_PORT=465`
- `SMTP_USER=contact@maginot.app`
- `SMTP_PASSWORD=...`

### المبدأ

- المستخدم لا يتعامل مع SMTP مباشرة.
- `email-worker` يتصل بخادم البريد.
- إذا نجح الاتصال:
  - يتم إرسال الرسالة
  - وتحديث الحالة إلى `sent`

### ملاحظات مهمة

- يجب أن يكون عنوان المرسل المتسق هو `contact@maginot.app`
- لا يُفترض استعمال `.dz` في هذا المشروع إذا كان البريد الرسمي هو `.app`
- إذا خادم SMTP غير صحيح أو كلمة المرور خاطئة، ستفشل الرسائل كلها

---

## 6) الطابور Email Queue

### الحقول الحالية

- `id`
- `queue_type`
  - `trigger`
  - `campaign`
  - `test`
- `to_email`
- `subject`
- `html`
- `from_name`
- `from_email`
- `status`
  - `pending`
  - `sent`
  - `failed`
- `attempts`
- `last_error`
- `payload`
- `created_at`
- `sent_at`
- `opened_at`
- `open_count`
- `updated_at`

### سلوك الطابور

- الرسائل تدخل أولًا بـ `pending`
- `email-worker` يعالجها دفعةً دفعة
- إذا فشلت:
  - يزيد `attempts`
  - إذا وصلت 3 محاولات تتحول إلى `failed`

---

## 7) صفحة الإدارة

### صفحة الحملات

الموجودة في:

- `app/admin/marketing/campaigns/page.tsx`

هذه الصفحة:

- تختار القالب
- تختار المستلمين
- تضيف الرسائل إلى `email_queue`

### صفحة المراقبة

الموجودة في:

- `app/admin/marketing/queue/page.tsx`

تعرض:

- عدد pending
- عدد sent
- عدد failed
- آخر الرسائل
- `attempts`
- `last_error`
- `open_count`

وفيها زر:

- `Run Worker`

لتشغيل الإرسال يدويًا.

---

## 8) التتبع Tracking

التتبع هنا بسيط جدًا وداخلي:

- يتم إضافة صورة صغيرة جدًا داخل HTML:
  - `<img src=".../functions/v1/email-open?id=QUEUE_ID" />`
- عند فتح الرسالة:
  - `opened_at` يتحدث
  - `open_count` يزيد

هذا لا يعطي analytics متقدمة، لكنه يكفي لمعرفة إن كانت الرسالة تُفتح أم لا.

---

## 9) الملفات الأساسية

### SQL

- `database/03_email_templates.sql`
- `database/05_fix_email_templates.sql`
- `database/06_email_queue.sql`
- `database/07_enqueue_leads_trigger.sql`

### Edge Functions

- `supabase/functions/email-trigger/index.ts`
- `supabase/functions/email-campaign/index.ts`
- `supabase/functions/email-worker/index.ts`
- `supabase/functions/email-open/index.ts`

### الواجهة

- `app/(site)/register/page.tsx`
- `app/admin/marketing/campaigns/page.tsx`
- `app/admin/marketing/queue/page.tsx`
- `app/admin/marketing/templates/page.tsx`
- `app/admin/marketing/templates/edit/page.tsx`

### الأنواع

- `types/database.ts`

---

## 10) المطلوب في Supabase

### 1. تشغيل SQL

شغّل هذه الملفات في Supabase SQL Editor:

- `database/03_email_templates.sql`
- `database/05_fix_email_templates.sql`
- `database/06_email_queue.sql`
- `database/07_enqueue_leads_trigger.sql`

### 2. نشر Edge Functions

انشر:

- `email-worker`
- `email-open`

### 3. Secrets

لازم تكون موجودة:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

اختياري لكن مفيد:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 11) نقاط مهمة جدًا

- النظام الحالي يعتمد على queue، وليس إرسال مباشر من الواجهة.
- إذا لم يشغل `email-worker` فلن تخرج الرسائل من الطابور.
- إذا كان SMTP غير مضبوط، ستبقى الرسائل `failed`.
- `Rafraîchir` في لوحة الطابور يعرض الحالة فقط، ولا يرسل شيئًا.
- `Run Worker` هو الذي يبدأ الإرسال اليدوي.

---

## 12) الخلاصة

النظام الحالي داخل المشروع يعمل بهذه السلسلة:

`lead / campaign -> email_queue -> email_worker -> SMTP -> sent`

والتتبع:

`sent email -> open pixel -> email-open -> opened_at/open_count`

هذه البنية داخلية بالكامل، بدون خدمة تسويق خارجية منفصلة.

