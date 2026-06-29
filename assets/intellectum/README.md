# Intellectum — фото материалы

Загрузите изображения для страницы `intellectum.html` сюда (`assets/intellectum/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.jpg` | Фон Hero (верхний блок) | 1920×1080 | 16:9 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `classroom.jpg` | Секция "More Than Educational Games" | 1280×720 | 16:9 |
| `kit.jpg` | Секция "What Is Included" | 800×600 | 4:3 |

Форматы: `.jpg` / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `intellectum.html`:
- Hero: `style="--hero-bg: url('assets/intellectum/hero.jpg')"`
- Плейсхолдер: заменить блок `.media-frame` на `<img src="assets/intellectum/...jpg" alt="...">`.
