const i18n = {
  kk: {
    logo: 'Психолог', home: 'Басты бет', services: 'Қызметтер', parents: 'Ата-аналарға', booking: 'Жазылу',
    heroTag: 'Мектеп психологы',
    heroLead: 'Балаларға, ата-аналарға және мұғалімдерге мектеп ортасында психологиялық тепе-теңдік пен сенімділік табуға көмектесемін.',
    cta1: 'WhatsApp арқылы жазылу', cta2: 'Қызметтерді көру',
    c1t: '20+ жыл тәжірибе', c1d: 'Әртүрлі жастағы оқушылармен ұзақ жылдық практикалық жұмыс.',
    c2t: 'Отбасымен жұмыс', c2d: 'Тәрбие, стресс және қарым-қатынас бойынша ата-аналарға кеңес.',
    c3t: 'Мектептегі қолдау', c3d: 'Бейімделу, мазасыздық, өзін-өзі бағалау және қақтығыстармен жұмыс.',
    servicesTitle: 'Қызметтер',
    s1t: 'Оқушыларға', s2t: 'Ата-аналарға', s3t: 'Педагогтерге',
    pTitle: 'Ата-аналарға ұсыныстар',
    p1t: 'Буллинг', p1d: 'Көңіл-күйдің күрт өзгеруі, мектепке барғысы келмеу, тұйықталу — маңызды белгілер.',
    p2t: 'Бала мектепке барғысы келмесе', p2d: 'Себебін жұмсақ анықтап, сынып жетекшісі мен психологты қосу маңызды.',
    p3t: 'Жасөспіріммен қалай сөйлесу керек', p3d: 'Сыннан гөрі түсіністік пен диалогты көбейту керек.',
    bTitle: 'Қабылдау уақыты',
    b1: 'Дүйсенбі — Жұма', b2: '09:00 — 17:00', b3: 'Психолог кабинеті',
    formTitle: 'Онлайн жазылу', name: 'Аты-жөні', phone: 'Телефон', msg: 'Сұраныс', send: 'WhatsApp-қа жіберу'
  },
  ru: {
    logo: 'Психолог', home: 'Главная', services: 'Услуги', parents: 'Родителям', booking: 'Запись',
    heroTag: 'Школьный психолог',
    heroLead: 'Помогаю детям, родителям и учителям находить психологическое равновесие, уверенность и спокойствие в школьной среде.',
    cta1: 'Записаться в WhatsApp', cta2: 'Смотреть услуги',
    c1t: '20+ лет опыта', c1d: 'Большой практический опыт сопровождения школьников разных возрастов.',
    c2t: 'Работа с семьёй', c2d: 'Консультации для родителей по воспитанию, стрессу и коммуникации.',
    c3t: 'Поддержка в школе', c3d: 'Помощь с адаптацией, тревожностью, самооценкой и конфликтами.',
    servicesTitle: 'Услуги',
    s1t: 'Для учеников', s2t: 'Для родителей', s3t: 'Для педагогов',
    pTitle: 'Рекомендации родителям',
    p1t: 'Буллинг', p1d: 'Обратите внимание на резкие изменения настроения, нежелание идти в школу, замкнутость и страх.',
    p2t: 'Если ребенок не хочет в школу', p2d: 'Важно мягко выяснить причину и подключить классного руководителя и психолога.',
    p3t: 'Как говорить с подростком', p3d: 'Больше диалога и принятия, меньше критики и давления.',
    bTitle: 'Время приема',
    b1: 'Понедельник — Пятница', b2: '09:00 — 17:00', b3: 'Кабинет психолога',
    formTitle: 'Онлайн запись', name: 'Имя', phone: 'Телефон', msg: 'Запрос', send: 'Отправить в WhatsApp'
  }
};

function setLang(lang) {
  localStorage.setItem('lang', lang);
  const d = i18n[lang] || i18n.ru;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (d[k]) el.textContent = d[k];
  });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}

document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
setLang(localStorage.getItem('lang') || 'kk');

const form = document.getElementById('waForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, phone, message } = form.elements;
    const lang = localStorage.getItem('lang') || 'kk';
    const text = lang === 'kk'
      ? `Сәлеметсіз бе! Кеңеске жазылғым келеді.\nАты-жөні: ${name.value}\nТелефон: ${phone.value}\nСұраныс: ${message.value}`
      : `Здравствуйте! Хочу записаться на консультацию.\nИмя: ${name.value}\nТелефон: ${phone.value}\nЗапрос: ${message.value}`;
    window.open(`https://wa.me/77071679445?text=${encodeURIComponent(text)}`, '_blank');
  });
}

document.querySelectorAll('#year').forEach(el => (el.textContent = new Date().getFullYear()));
