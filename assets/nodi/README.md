# Nodi — фото материалы

Загрузите изображения для страницы `nodi.html` сюда (`assets/nodi/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.jpg` | Фон Hero (верхний блок) | 1920×1080 | 16:9 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `hardware.jpg` | Секция "Learn Engineering by Seeing It Work" | 1280×720 | 16:9 |

Форматы: `.jpg` / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `nodi.html`:
- Hero: `style="--hero-bg: url('assets/nodi/hero.jpg')"`
- Плейсхолдер: заменить блок `.media-frame` на `<img src="assets/nodi/hardware.jpg" alt="...">`.
