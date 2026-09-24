const T={
uk:{home:"Головна",games:"Ігри",settings:"Налаштування",title:"Мої проєкти та завдання",intro:"Тут зібрані мої шкільні роботи та вбудоване Python-середовище.",task:"Завдання 1",taskText:"Опис твого першого завдання або посилання на нього.",pyTitle:"Вбудований Python",pyText:"Пиши та запускай Python-код прямо в браузері:",run:"▶ Запустити код",console:"Консоль виводу:",loading:"Завантаження Python…",look:"Вигляд",sys:"Системна",light:"Світла",dark:"Темна",sounds:"Службові звуки",lang:"Мова",data:"Дані сайту",dataText:"Скинути налаштування та збережений код",reset:"Скинути",gText:"Тут будуть мої ігри та міні-проєкти.",gEmpty:"Ігор поки немає. Додай першу картку в games.html."},
en:{home:"Home",games:"Games",settings:"Settings",title:"My projects and assignments",intro:"My school work and a built-in Python environment.",task:"Assignment 1",taskText:"Description of your first assignment or a link to it.",pyTitle:"Built-in Python",pyText:"Write and run Python code right in the browser:",run:"▶ Run code",console:"Output console:",loading:"Loading Python…",look:"Appearance",sys:"System",light:"Light",dark:"Dark",sounds:"System sounds",lang:"Language",data:"Site data",dataText:"Reset settings and saved code",reset:"Reset",gText:"My games and mini projects will live here.",gEmpty:"No games yet. Add the first card in games.html."},
tr:{home:"Ana sayfa",games:"Oyunlar",settings:"Ayarlar",title:"Projelerim ve ödevlerim",intro:"Okul çalışmalarım ve yerleşik Python ortamı.",task:"Ödev 1",taskText:"İlk ödevinin açıklaması veya bağlantısı.",pyTitle:"Yerleşik Python",pyText:"Python kodunu doğrudan tarayıcıda yaz ve çalıştır:",run:"▶ Kodu çalıştır",console:"Çıktı konsolu:",loading:"Python yükleniyor…",look:"Görünüm",sys:"Sistem",light:"Açık",dark:"Koyu",sounds:"Sistem sesleri",lang:"Dil",data:"Site verileri",dataText:"Ayarları ve kaydedilen kodu sıfırla",reset:"Sıfırla",gText:"Oyunlarım ve mini projelerim burada olacak.",gEmpty:"Henüz oyun yok. İlk kartı games.html içine ekle."}
};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const load=k=>{try{return localStorage.getItem(k)}catch{return null}};
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const S={theme:'system',lang:'uk',sound:true,...JSON.parse(load('settings')||'{}')};

function apply(){
 const dark=S.theme==='dark'||(S.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
 document.documentElement.dataset.theme=dark?'dark':'light';
 document.documentElement.lang=S.lang;
 document.title=T[S.lang][document.body.dataset.title||'title'];
 $$('[data-t]').forEach(e=>e.textContent=T[S.lang][e.dataset.t]);
 $$('input[name=theme],input[name=lang]').forEach(i=>i.checked=S[i.name]===i.value);
 if($('#sound'))$('#sound').checked=S.sound;
}
function beep(){
 if(!S.sound)return;
 try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();
 o.connect(g);g.connect(c.destination);g.gain.value=.05;o.frequency.value=660;o.start();o.stop(c.currentTime+.06)}catch{}
}
function route(){
 const p=location.hash==='#settings'?'settings':'home';
 $$('main section').forEach(s=>s.hidden=s.id!==p);
 $$('nav a[href^="#"]').forEach(a=>a.classList.toggle('on',a.hash==='#'+p));
}
$$('input[name=theme],input[name=lang]').forEach(i=>i.onchange=()=>{S[i.name]=i.value;save('settings',JSON.stringify(S));apply();beep()});
if($('#sound'))$('#sound').onchange=e=>{S.sound=e.target.checked;save('settings',JSON.stringify(S));beep()};
$$('nav a').forEach(a=>a.addEventListener('click',beep));
if($('#reset'))$('#reset').onclick=()=>{try{localStorage.clear()}catch{}location.reload()};
matchMedia('(prefers-color-scheme: dark)').onchange=apply;
addEventListener('hashchange',route);
apply();route();
