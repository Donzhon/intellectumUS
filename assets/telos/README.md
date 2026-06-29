# TELOS — фото материалы

Загрузите изображения для страницы `telos.html` сюда (`assets/telos/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.jpg` | Фон Hero (верхний блок) | 1920×1080 | 16:9 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `workflow.jpg` | Секция "How TELOS Works" (плейсхолдер) | 800×600 | 4:3 |

Форматы: `.jpg` / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `telos.html`:
- Hero: `style="--hero-bg: url('assets/telos/hero.jpg')"`
- Плейсхолдер: заменить блок `.media-frame` на `<img src="assets/telos/workflow.jpg" alt="...">`.
