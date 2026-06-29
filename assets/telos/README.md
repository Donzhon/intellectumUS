# TELOS — фото материалы

Загрузите изображения для страницы `telos.html` сюда (`assets/telos/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.png` | Фон Hero (верхний блок) | 1024×576 | 16:9 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `workflow.jpg` | Секция "How TELOS Works" (плейсхолдер) | 800×600 | 4:3 |

Форматы: `.png` (мастер) / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `telos.html`:
- Hero: класс `inner-page__hero--telos` (фон `assets/telos/hero.webp`, на мобилке `hero-800.webp`)
- Плейсхолдер: заменить блок `.media-frame` на `<img src="assets/telos/workflow.jpg" alt="...">`.
