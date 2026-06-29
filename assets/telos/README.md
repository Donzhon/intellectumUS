# TELOS — фото материалы

Загрузите изображения для страницы `telos.html` сюда (`assets/telos/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.png` | Фон Hero — ПК | 1024×576 | 16:9 |
| `hero-mobile.png` | Фон Hero — мобилка | 576×1024 | 9:16 |
| `eco_4-3.png` | Секция «From Classroom Observation…» | 1024×768 | 4:3 |
| `develop_1-1.png` | Блок «Develop» | 1024×1024 | 1:1 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `workflow.jpg` | Секция "How TELOS Works" (плейсхолдер) | 800×600 | 4:3 |

Форматы: `.png` (мастер) / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `telos.html`:
- Hero: класс `inner-page__hero--telos` (ПК: `hero.webp`, мобилка: `hero-mobile.webp`, на узких экранах `hero-mobile-400.webp`). На мобилке в hero только заголовок внизу; форма — в блоке ниже.
- Плейсхолдер: заменить блок `.media-frame` на `<img src="assets/telos/workflow.jpg" alt="...">`.
