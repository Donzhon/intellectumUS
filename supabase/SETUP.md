# Сбор заявок: настройка Supabase + уведомления + админка

Этот документ описывает ручные шаги, чтобы запустить сбор заявок с сайта,
хранение в Supabase, уведомления на Email (и опционально в Telegram), и
админ-панель `/adminintus`.

Telegram пока не подключаем — шаг 3 можно пропустить. Функция `submit-lead`
сама пропускает отправку в Telegram, если переменные `TELEGRAM_*` не заданы.

Код уже готов:
- Миграция БД: `supabase/migrations/0001_lead_requests.sql`
- Функция приёма заявок: `supabase/functions/submit-lead/index.ts`
- Функция админки: `supabase/functions/admin/index.ts`
- Форма на сайте: обработчик в `js/app.js`, конфиг в `js/config.js`
- Админ-панель: `admin.html`, `js/admin.js`, `css/admin.css`

---

## 1. Создать проект Supabase

1. Зайдите на https://supabase.com → New project.
2. Запишите **Project URL** (вид `https://xxxx.supabase.co`) и **service_role key**
   (Project Settings → API). service_role — секретный, не попадает в браузер.
3. Reference ID проекта (`xxxx`) понадобится для CLI и для `js/config.js`.

## 2. Применить миграцию (создать таблицу)

Вариант A — через SQL Editor в дашборде: скопируйте содержимое
`supabase/migrations/0001_lead_requests.sql` и выполните.

Вариант B — через CLI:

```bash
npm i -g supabase
supabase login
supabase link --project-ref <ваш-ref>   # сначала впишите ref в supabase/config.toml
supabase db push
```

## 3. Telegram-бот (опционально, можно пропустить сейчас)

1. В Telegram напишите @BotFather → `/newbot` → получите **TELEGRAM_BOT_TOKEN**.
2. Узнайте **TELEGRAM_CHAT_ID**:
   - Напишите своему боту любое сообщение (или добавьте его в группу/канал и
     дайте права постить).
   - Откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` и найдите
     `chat.id` (для группы — отрицательное число, для канала — вида `-100...`).

## 4. Email через Resend

1. Зарегистрируйтесь на https://resend.com → API Keys → создайте **RESEND_API_KEY**.
2. Подтвердите домен (Domains) или используйте тестовый отправитель Resend.
3. Адрес отправителя — **NOTIFY_EMAIL_FROM** (напр. `IntellectumUS <noreply@ваш-домен>`).
4. Кому слать — **NOTIFY_EMAIL_TO** (можно несколько через запятую).

## 5. Задать секреты функций

В дашборде: Edge Functions → Secrets, либо через CLI (см. `supabase/.env.example`):

```bash
supabase secrets set \
  ALLOWED_ORIGINS="https://www.intellectumus.com,https://intellectumus.com" \
  ADMIN_PASSWORD="длинный-случайный-пароль" \
  TELEGRAM_BOT_TOKEN="..." \
  TELEGRAM_CHAT_ID="..." \
  RESEND_API_KEY="..." \
  NOTIFY_EMAIL_FROM="IntellectumUS <noreply@ваш-домен>" \
  NOTIFY_EMAIL_TO="admin@ваш-домен"
```

`SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в задеплоенных функциях
подставляются автоматически — отдельно задавать не нужно.

## 6. Задеплоить функции

```bash
supabase functions deploy submit-lead --no-verify-jwt
supabase functions deploy admin --no-verify-jwt
```

`--no-verify-jwt` обязателен: форма и админка вызывают функции без anon-ключа
(в `supabase/config.toml` уже стоит `verify_jwt = false`). При деплое через
дашборд выключите "Verify JWT" у обеих функций.

## 7. Прописать URL функций на сайте

В `js/config.js` замените `YOUR-PROJECT-ref` на ваш Reference ID:

```js
window.SiteConfig = {
  SUBMIT_LEAD_URL: "https://<ref>.supabase.co/functions/v1/submit-lead",
  ADMIN_URL: "https://<ref>.supabase.co/functions/v1/admin",
};
```

## 8. Проверка

1. Отправьте заявку с формы на сайте → строка появляется в таблице
   `lead_requests`, приходят сообщение в Telegram и письмо на почту.
2. Откройте `/adminintus`, введите `ADMIN_PASSWORD` → видны заявки, работают
   фильтры (статус/поиск/даты) и смена статуса. Неверный пароль отклоняется.

## Безопасность

- Таблица `lead_requests` закрыта RLS без публичных policy: из браузера к ней
  обращаться нельзя, всё идёт через функции с service_role.
- Пароль админки сверяется внутри функции `admin` (constant-time), прямого
  доступа к БД он не даёт.
- Honeypot-поле `company` в форме отсекает простых ботов.
- Для нескольких админов/большей надёжности позже можно заменить общий пароль
  на Supabase Auth.
