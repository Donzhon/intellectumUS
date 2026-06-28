const LANG_STORAGE_KEY = "intellectum-us-lang";

const SITE_I18N = {
  eng: {
    "nav.products": "Products",
    "nav.solutions": "Solutions",
    "nav.schools": "For Schools",
    "nav.partners": "For Partners",
    "nav.about": "About us",
    "nav.resources": "Resources",
    "nav.contact": "Contact",
    "nav.intellectum": "Intellectum",
    "nav.nodi": "Nodi",
    "nav.iot": "IoT Board",
    "nav.equipment": "School Equipments",
    "hero.nodi.1": "Innovations in",
    "hero.nodi.2": "School Education",
    "hero.cta.partner": "Partner With Us",
    "hero.cta.explore": "Explore Solutions",
    "cta.email.title": "Bring IntellectumUS to your school",
    "cta.email.lead": "Leave your email and our team will reach out with a tailored proposal.",
    "hero.intellectum.1": "Develop your personal",
    "hero.intellectum.2": "intelligence",
    "form.nodi.title": "Nodi Ecosystem",
    "form.nodi.lead":
      "Stepper is an educational IoT device that demonstrates how code transforms into motion using magnetic force.",
    "form.intellectum.title": "Intellectum",
    "form.intellectum.lead":
      "Hands-on tabletop developmental games for kindergarten classrooms — playful activities that build logic, memory, focus, and fine motor skills through guided group play.",
    "form.email": "Your email",
    "form.comment": "Comments about product...",
    "form.reasonLegend": "Why you need it?",
    "form.reasonPersonal": "Personal use",
    "form.reasonSchool": "For school",
    "form.reasonReselling": "For reselling",
    "form.reasonOther": "Other",
    "form.submit": "Submit request",
    "form.success": "Your request has been sent",
    "menu.explore": "Explore Now",
    "menu.close": "Close menu",
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
    "categories.neyri.title": "Neyri",
    "categories.neyri.desc": "Smart learning companion for guided classroom activities.",
    "categories.equipment.title": "School Equipments",
    "categories.equipment.desc": "Lab tools and classroom hardware for STEM programs.",
    "categories.view.grid": "Grid",
    "categories.view.list": "List",
    "categories.cta": "Learn More >",
    "footer.tagline":
      "Educational technology for schools, kindergartens, and STEM classrooms worldwide.",
    "footer.products": "Products",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.categories": "Product categories",
    "footer.location": "San Francisco, CA, United States",
    "footer.copyright": "© 2026 IntellectumUS. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "page.title.about": "About us - IntellectumUS",
    "page.title.partners": "For Partners - IntellectumUS",
    "about.hero.eyebrow": "Company",
    "about.hero.title": "About us",
    "about.hero.lead":
      "IntellectumUS brings modern educational technology to schools, kindergartens, and STEM classrooms across the United States.",
    "about.mission.eyebrow": "Mission",
    "about.mission.title": "Why we exist",
    "about.mission.lead":
      "We make innovative learning tools — Intellectum, Nodi, Pasco, and classroom equipment — accessible and easy to adopt for every educator.",
    "about.do.eyebrow": "What we do",
    "about.do.title": "What we do",
    "about.do.1.title": "Distribution",
    "about.do.1.text": "We supply trusted EdTech product lines to institutions across the United States and beyond.",
    "about.do.2.title": "Implementation & support",
    "about.do.2.text": "From setup to ongoing care, we help teams integrate technology into everyday teaching.",
    "about.do.3.title": "Teacher training",
    "about.do.3.text": "We train educators so they get the most out of every device and methodology.",
    "about.stats.eyebrow": "By the numbers",
    "about.stats.title": "Trusted across classrooms",
    "about.contact.eyebrow": "Get in touch",
    "about.contact.title": "Visit or contact us",
    "about.contact.lead":
      "San Francisco, CA, United States.",
    "about.contact.email": "Email us",
    "partners.hero.eyebrow": "Partners",
    "partners.hero.title": "For Partners",
    "partners.hero.lead":
      "Grow with us. Join a network advancing educational technology across schools, kindergartens, and STEM programs.",
    "partners.benefits.eyebrow": "Why partner",
    "partners.benefits.title": "What you get",
    "partners.benefits.1.title": "Marketing support",
    "partners.benefits.1.text": "Co-branded campaigns and ready-to-use materials to reach your market.",
    "partners.benefits.2.title": "Training",
    "partners.benefits.2.text": "Onboarding and product training for your team and your customers.",
    "partners.benefits.3.title": "Full product portfolio",
    "partners.benefits.3.text": "Access to Intellectum, Nodi, Pasco, and classroom equipment lines.",
    "partners.benefits.4.title": "Technical assistance",
    "partners.benefits.4.text": "Hands-on help with setup, integration, and after-sales support.",
    "partners.types.eyebrow": "Who we work with",
    "partners.types.title": "Partnership types",
    "partners.types.1.title": "Schools",
    "partners.types.1.text": "Bring our solutions directly into your classrooms with full onboarding.",
    "partners.types.2.title": "Resellers",
    "partners.types.2.text": "Resell our product lines with competitive terms and marketing support.",
    "partners.types.3.title": "Integrators",
    "partners.types.3.text": "Deliver complete STEM and EdTech projects backed by our catalog.",
    "partners.cta.eyebrow": "Become a partner",
    "partners.cta.title": "Let's build together",
    "partners.cta.lead": "Tell us about your goals and we'll find the right partnership model.",
    "partners.cta.button": "Become a partner",
  },
  kaz: {
    "nav.products": "Өнімдер",
    "nav.solutions": "Шешімдер",
    "nav.schools": "Мектептерге",
    "nav.partners": "Серіктестерге",
    "nav.about": "Біз туралы",
    "nav.resources": "Ресурстар",
    "nav.contact": "Байланыс",
    "nav.intellectum": "Intellectum",
    "nav.nodi": "Nodi",
    "nav.iot": "IoT тақта",
    "nav.equipment": "Мектеп жабдықтары",
    "hero.nodi.1": "Мектеп білімінде",
    "hero.nodi.2": "инновациялар",
    "hero.cta.partner": "Бізбен серіктес болыңыз",
    "hero.cta.explore": "Шешімдерді көру",
    "cta.email.title": "IntellectumUS-ті мектебіңізге әкеліңіз",
    "cta.email.lead": "Электрондық поштаңызды қалдырыңыз — біз жеке ұсыныспен хабарласамыз.",
    "hero.intellectum.1": "Жеке",
    "hero.intellectum.2": "интеллекті дамытыңыз",
    "form.nodi.title": "Nodi Ecosystem",
    "form.nodi.lead":
      "Stepper — кодтың магниттік күш арқылы қозғалысқа қалай айналатынын көрсететін білім беру IoT құрылғысы.",
    "form.intellectum.title": "Intellectum",
    "form.intellectum.lead":
      "Балабақша сыныптарына арналған үстелдегі дамытушылық ойындар — балалар логика, жад, зейін және ұсақ моториканы ойнай отырып дамытады.",
    "form.email": "Электрондық поштаңыз",
    "form.comment": "Өнім туралы пікірлер...",
    "form.reasonLegend": "Неге қажет?",
    "form.reasonPersonal": "Жеке пайдалану",
    "form.reasonSchool": "Мектепке",
    "form.reasonReselling": "Қайта сатуға",
    "form.reasonOther": "Басқа",
    "form.submit": "Сұрау жіберу",
    "form.success": "Сұрауыңыз жіберілді",
    "menu.explore": "Қазір зерттеу",
    "menu.close": "Жабу",
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
    "categories.neyri.title": "Neyri",
    "categories.neyri.desc": "Бағытталған сабақтарға арналған ақылды оқу серіктесі.",
    "categories.equipment.title": "Мектеп жабдықтары",
    "categories.equipment.desc": "STEM бағдарламаларына арналған зертхана құралдары мен жабдықтар.",
    "categories.view.grid": "Тор",
    "categories.view.list": "Тізім",
    "categories.cta": "Толығырақ >",
    "footer.tagline":
      "Мектептерге, балабақшаларға және STEM сыныптарына арналған білім беру технологиялары.",
    "footer.products": "Өнімдер",
    "footer.company": "Компания",
    "footer.contact": "Байланыс",
    "footer.categories": "Өнім категориялары",
    "footer.location": "АҚШ, Сан-Франциско, CA",
    "footer.copyright": "© 2026 IntellectumUS. Барлық құқықтар қорғалған.",
    "footer.privacy": "Құпиялылық саясаты",
    "footer.terms": "Пайдалану шарттары",
    "page.title.about": "Біз туралы - IntellectumUS",
    "page.title.partners": "Серіктестерге - IntellectumUS",
    "about.hero.eyebrow": "Компания",
    "about.hero.title": "Біз туралы",
    "about.hero.lead":
      "IntellectumUS АҚШ-тағы мектептерге, балабақшаларға және STEM сыныптарына заманауи білім беру технологияларын жеткізеді.",
    "about.mission.eyebrow": "Миссия",
    "about.mission.title": "Біз не үшін жұмыс істейміз",
    "about.mission.lead":
      "Біз инновациялық оқу құралдарын — Intellectum, Nodi, Pasco және мектеп жабдықтарын — әрбір педагог үшін қолжетімді әрі енгізуге оңай етеміз.",
    "about.do.eyebrow": "Біз не істейміз",
    "about.do.title": "Біз не істейміз",
    "about.do.1.title": "Дистрибуция",
    "about.do.1.text": "АҚШ пен одан тыс жердегі мекемелерге сенімді EdTech өнім желілерін жеткіземіз.",
    "about.do.2.title": "Енгізу және қолдау",
    "about.do.2.text": "Орнатудан бастап тұрақты қызмет көрсетуге дейін технологияны күнделікті оқытуға енгізуге көмектесеміз.",
    "about.do.3.title": "Мұғалімдерді оқыту",
    "about.do.3.text": "Әрбір құрылғы мен әдістемеден барынша пайда алу үшін педагогтерді оқытамыз.",
    "about.stats.eyebrow": "Сандармен",
    "about.stats.title": "Сыныптарда сенімге ие",
    "about.contact.eyebrow": "Байланысу",
    "about.contact.title": "Бізге келіңіз немесе хабарласыңыз",
    "about.contact.lead":
      "АҚШ, Сан-Франциско, CA.",
    "about.contact.email": "Бізге жазу",
    "partners.hero.eyebrow": "Серіктестер",
    "partners.hero.title": "Серіктестерге",
    "partners.hero.lead":
      "Бізбен бірге дамыңыз. Мектептерде, балабақшаларда және STEM бағдарламаларында білім беру технологияларын дамытатын желіге қосылыңыз.",
    "partners.benefits.eyebrow": "Неге серіктес болу керек",
    "partners.benefits.title": "Сіз не аласыз",
    "partners.benefits.1.title": "Маркетингтік қолдау",
    "partners.benefits.1.text": "Нарығыңызға жету үшін бірлескен науқандар мен дайын материалдар.",
    "partners.benefits.2.title": "Оқыту",
    "partners.benefits.2.text": "Сіздің команда мен клиенттеріңізге арналған бейімдеу және өнім бойынша оқыту.",
    "partners.benefits.3.title": "Толық өнім портфелі",
    "partners.benefits.3.text": "Intellectum, Nodi, Pasco және мектеп жабдықтары желілеріне қолжетімділік.",
    "partners.benefits.4.title": "Техникалық көмек",
    "partners.benefits.4.text": "Орнату, интеграция және сатудан кейінгі қолдау бойынша практикалық көмек.",
    "partners.types.eyebrow": "Біз кіммен жұмыс істейміз",
    "partners.types.title": "Серіктестік түрлері",
    "partners.types.1.title": "Мектептер",
    "partners.types.1.text": "Толық бейімдеумен шешімдерімізді тікелей сыныптарыңызға енгізіңіз.",
    "partners.types.2.title": "Дилерлер",
    "partners.types.2.text": "Тиімді шарттармен және маркетингтік қолдаумен өнім желілерімізді қайта сатыңыз.",
    "partners.types.3.title": "Интеграторлар",
    "partners.types.3.text": "Каталогымызға негізделген толық STEM және EdTech жобаларын жүзеге асырыңыз.",
    "partners.cta.eyebrow": "Серіктес болыңыз",
    "partners.cta.title": "Бірге құрайық",
    "partners.cta.lead": "Мақсаттарыңыз туралы айтыңыз, біз қолайлы серіктестік моделін табамыз.",
    "partners.cta.button": "Серіктес болу",
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
  document.title = t(document.documentElement.dataset.pageTitle || "page.title");

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
