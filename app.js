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
const NAV=[['home','index.html#home'],['games','games.html'],['settings','index.html#settings']];
const IC={
home:'<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
games:'<path d="M6.5 6h11a4.5 4.5 0 0 1 4.4 5.4l-.9 4.6a3 3 0 0 1-5 1.6L14 16h-4l-2 1.6a3 3 0 0 1-5-1.6l-.9-4.6A4.5 4.5 0 0 1 6.5 6z"/><g class="cut"><path d="M6.5 11h3M8 9.5v3"/><circle cx="15.5" cy="10.2" r="1"/><circle cx="17.5" cy="12.2" r="1"/></g>',
settings:'<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>'
};
function route(){
 const k=document.body.dataset.title==='games'?'games':location.hash==='#settings'?'settings':'home';
 $$('main section').forEach(s=>s.hidden=s.id!==k);
 $$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.k===k));
}
$$('input[name=theme],input[name=lang]').forEach(i=>i.onchange=()=>{S[i.name]=i.value;save('settings',JSON.stringify(S));apply();beep()});
if($('#sound'))$('#sound').onchange=e=>{S.sound=e.target.checked;save('settings',JSON.stringify(S));beep()};
const nav=$('#nav');
nav.innerHTML=NAV.map(([k,h])=>`<a href="${h}" data-k="${k}"><span class="ic"><svg class="o" viewBox="0 0 24 24">${IC[k]}</svg><svg class="f" viewBox="0 0 24 24">${IC[k]}</svg></span><span data-t="${k}"></span></a>`).join('');
nav.addEventListener('click',e=>{if(e.target.closest('a'))beep()});
nav.addEventListener('pointerdown',e=>{
 const ic=e.target.closest('a')?.querySelector('.ic');if(!ic)return;
 const r=ic.getBoundingClientRect(),s=document.createElement('span');
 s.className='rip';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';
 ic.append(s);s.onanimationend=()=>s.remove();
});
if($('#reset'))$('#reset').onclick=()=>{try{localStorage.clear()}catch{}location.reload()};
matchMedia('(prefers-color-scheme: dark)').onchange=apply;
addEventListener('hashchange',route);
apply();void nav.offsetWidth;route();
