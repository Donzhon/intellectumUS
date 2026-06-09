const LANG_STORAGE_KEY = "intellectum-us-lang";

const SITE_I18N = {
  eng: {
    "nav.products": "Products",
    "nav.partners": "For Partners",
    "nav.about": "About us",
    "nav.intellectum": "Intellectum",
    "nav.nodi": "Nodi",
    "nav.iot": "IoT Board",
    "nav.equipment": "School Equipments",
    "hero.nodi.1": "Innovations in",
    "hero.nodi.2": "School Education",
    "hero.intellectum.1": "Develop your personal",
    "hero.intellectum.2": "intelligence",
    "form.title": "Nodi Ecosystem",
    "form.lead":
      "Stepper is an educational IoT device that demonstrates how code transforms into motion using magnetic force.",
    "form.email": "Your email",
    "form.comment": "Comments about product...",
    "form.reasonLegend": "Why you need it?",
    "form.reasonPersonal": "Personal use",
    "form.reasonSchool": "For school",
    "form.reasonReselling": "For reselling",
    "form.reasonOther": "Other",
    "form.submit": "Submit request",
    "menu.explore": "Explore Now",
    "gallery.products": "Products",
    "gallery.prev": "Previous product",
    "gallery.next": "Next product",
    "search.country": "Search country...",
    "search.empty": "No countries found",
    "land.learning.eyebrow": "01 · Learning",
    "land.learning.title": "Learning Labs",
    "land.learning.lead":
      "Hands-on digital labs where students explore STEM, design, and AI through guided simulations and real-time feedback.",
    "land.learning.item1": "Adaptive lesson paths for grades 6–12",
    "land.learning.item2": "Collaborative whiteboards and group projects",
    "land.learning.item3": "Progress dashboards for teachers and parents",
    "land.learning.cta": "Explore labs",
    "land.teacher.eyebrow": "02 · Educators",
    "land.teacher.title": "Teacher Toolkit",
    "land.teacher.lead":
      "Everything educators need to plan lessons, assess outcomes, and connect with families — in one calm, focused workspace.",
    "land.teacher.item1": "Curriculum templates aligned to national standards",
    "land.teacher.item2": "AI-assisted rubrics and assignment builders",
    "land.teacher.item3": "Secure messaging with students and guardians",
    "land.teacher.cta": "Request access",
    "land.teacher.stat1": "Partner schools",
    "land.teacher.stat2": "Active learners",
    "land.teacher.stat3": "Satisfaction rate",
    "lang.group": "Language",
    "page.title": "IntellectumUS",
    "categories.eyebrow": "Products",
    "categories.title": "Product categories",
    "categories.lead": "Three product lines for schools, kindergartens, and STEM classrooms.",
    "categories.pasco.title": "Pasco",
    "categories.pasco.desc": "Digital measuring instruments.",
    "categories.intellectum.title": "Intellectum",
    "categories.intellectum.desc": "A developmental methodology for kindergartens.",
    "categories.nodi.title": "Nodi Ecosystem",
    "categories.nodi.desc": "Educational robotics and STEM learning.",
    "categories.cta": "Learn More >",
  },
  kaz: {
    "nav.products": "Өнімдер",
    "nav.partners": "Серіктестерге",
    "nav.about": "Біз туралы",
    "nav.intellectum": "Intellectum",
    "nav.nodi": "Nodi",
    "nav.iot": "IoT тақта",
    "nav.equipment": "Мектеп жабдықтары",
    "hero.nodi.1": "Мектеп білімінде",
    "hero.nodi.2": "инновациялар",
    "hero.intellectum.1": "Жеке",
    "hero.intellectum.2": "интеллекті дамытыңыз",
    "form.title": "Nodi Ecosystem",
    "form.lead":
      "Stepper — кодтың магниттік күш арқылы қозғалысқа қалай айналатынын көрсететін білім беру IoT құрылғысы.",
    "form.email": "Электрондық поштаңыз",
    "form.comment": "Өнім туралы пікірлер...",
    "form.reasonLegend": "Неге қажет?",
    "form.reasonPersonal": "Жеке пайдалану",
    "form.reasonSchool": "Мектепке",
    "form.reasonReselling": "Қайта сатуға",
    "form.reasonOther": "Басқа",
    "form.submit": "Сұрау жіберу",
    "menu.explore": "Қазір зерттеу",
    "gallery.products": "Өнімдер",
    "gallery.prev": "Алдыңғы өнім",
    "gallery.next": "Келесі өнім",
    "search.country": "Елді іздеу...",
    "search.empty": "Елдер табылмады",
    "land.learning.eyebrow": "01 · Оқу",
    "land.learning.title": "Оқу зертханалары",
    "land.learning.lead":
      "Оқушылар STEM, дизайн және AI-ды бағытталған симуляциялар мен нақты уақыттағы кері байланыс арқылы зерттейтін практикалық цифрлық зертханалар.",
    "land.learning.item1": "6–12 сыныптарға бейімделетін сабақ жолдары",
    "land.learning.item2": "Бірлескен тақталар және топтық жобалар",
    "land.learning.item3": "Мұғалімдер мен ата-аналарға арналған прогресс панельдері",
    "land.learning.cta": "Зертханаларды қарау",
    "land.teacher.eyebrow": "02 · Мұғалімдер",
    "land.teacher.title": "Мұғалім құралдары",
    "land.teacher.lead":
      "Мұғалімдерге сабақ жоспарлау, нәтижелерді бағалау және отбасылармен байланысу үшін қажеттінің бәрі — бір тыныш, шоғырланған жұмыс кеңістігінде.",
    "land.teacher.item1": "Ұлттық стандарттарға сәйкес оқу бағдарламаларының үлгілері",
    "land.teacher.item2": "AI көмегімен рубрикалар мен тапсырма құрастырушылар",
    "land.teacher.item3": "Оқушылар мен қамқоршылармен қауіпсіз хабарлама",
    "land.teacher.cta": "Қолжетімділік сұрау",
    "land.teacher.stat1": "Серіктес мектептер",
    "land.teacher.stat2": "Белсенді оқушылар",
    "land.teacher.stat3": "Қанағаттану деңгейі",
    "lang.group": "Тіл",
    "page.title": "IntellectumUS",
    "categories.eyebrow": "Өнімдер",
    "categories.title": "Өнім категориялары",
    "categories.lead": "Мектептерге, балабақшаларға және STEM сыныптарына арналған үш өнім желісі.",
    "categories.pasco.title": "Pasco",
    "categories.pasco.desc": "Сандық өлшеу құралдары.",
    "categories.intellectum.title": "Intellectum",
    "categories.intellectum.desc": "Балабақшаларға арналған дамытушылық методология.",
    "categories.nodi.title": "Nodi Ecosystem",
    "categories.nodi.desc": "Білім беру робототехникасы және STEM оқыту.",
    "categories.cta": "Толығырақ >",
  },
};

const getStoredLang = () => {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return saved === "kaz" || saved === "eng" ? saved : "eng";
};

let currentLang = getStoredLang();

const t = (key) => SITE_I18N[currentLang]?.[key] ?? SITE_I18N.eng[key] ?? key;

const applySiteLanguage = (lang) => {
  currentLang = lang === "kaz" ? "kaz" : "eng";
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);

  document.documentElement.lang = currentLang === "kaz" ? "kk" : "en";
  document.title = t("page.title");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (key) {
      el.setAttribute("aria-label", t(key));
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (key) {
      el.setAttribute("alt", t(key));
    }
  });

  document.querySelectorAll(".site-lang__btn").forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  document.dispatchEvent(new CustomEvent("site-language-change", { detail: { lang: currentLang } }));
};

const initSiteLanguage = () => {
  document.querySelectorAll(".site-lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang && lang !== currentLang) {
        applySiteLanguage(lang);
      }
    });
  });

  applySiteLanguage(currentLang);
};

window.SiteI18n = { t, applySiteLanguage, getLang: () => currentLang };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteLanguage);
} else {
  initSiteLanguage();
}
