# TELOS — фото материалы

Загрузите изображения для страницы `telos.html` сюда (`assets/telos/`).

Рекомендуемые слоты и размеры:

| Слот | Где на странице | Реком. размер | Пропорции |
| --- | --- | --- | --- |
| `hero.png` | Фон Hero — ПК | 1024×576 | 16:9 |
| `hero-mobile.png` | Фон Hero — мобилка | 576×1024 | 9:16 |
| `eco_4-3.png` | Секция «From Classroom Observation…» | 1024×768 | 4:3 |
| `develop_5-6.png` | Блок «Develop» | 853×1024 | 5:6 |
| `observe_5-6.png` | Блок «Observe» | 853×1024 | 5:6 |
| `analyze_5-6.png` | Блок «Analyze» | 853×1024 | 5:6 |
| `bento/` | Карточка Products на главной | см. `bento/*.png` | — |
| `workflow_4-3.png` | Секция «How TELOS Works» | 1024×768 | 4:3 |

Форматы: `.png` (мастер) / `.webp` (фон), прозрачные `.png` при необходимости.
После загрузки можно подставить путь в `telos.html`:
- Hero: класс `inner-page__hero--telos` (ПК: `hero.png`, мобилка: `hero-mobile.webp`, на узких экранах `hero-mobile-400.webp` q95). На мобилке в hero только заголовок внизу; форма — в блоке ниже.
- Workflow: `assets/telos/workflow_4-3.png` в секции «How TELOS Works».
