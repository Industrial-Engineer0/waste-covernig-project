const $=id=>document.getElementById(id);
const sub=['₁','₂','₃'];
const S=[{n:'S1',x:170,y:210,cost:1000,col:'#d4ae62',on:0},{n:'S2',x:400,y:230,cost:1200,col:'#2fb3b9',on:0},{n:'S3',x:200,y:330,cost:800,col:'#c9ebe6',on:0}];
const B=[{k:'A',x:100,y:300},{k:'B',x:290,y:190},{k:'C',x:480,y:130},{k:'D',x:300,y:330}];
let R=150,showD=true,tick=0;
const dist=(s,b)=>Math.hypot(s.x-b.x,s.y-b.y);
const cov=(s,b,r=R)=>dist(s,b)<=r;
const fmt=n=>n.toLocaleString('en-US');
function solve(r=R){const rows=[];for(let m=0;m<8;m++){const on=S.map((_,i)=>m>>i&1);const cost=S.reduce((a,s,i)=>a+on[i]*s.cost,0);const c=B.filter(b=>S.some((s,i)=>on[i]&&cov(s,b,r))).length;rows.push({on,cost,c,f:c==B.length})}
const f=rows.filter(x=>x.f);const sm=x=>x.on.reduce((a,b)=>a+b,0);
return{rows,best:f.length?f.reduce((a,x)=>x.cost<a.cost||(x.cost==a.cost&&sm(x)<sm(a))?x:a):null}}
const names=on=>S.filter((_,i)=>on[i]).map(s=>s.n).join(' + ')||'لا شيء';
const coverers=b=>S.map((s,i)=>cov(s,b)?i:-1).filter(i=>i>=0);

function render(){
const {rows,best}=solve();
// model
$('m-c').textContent='c = ('+S.map(s=>fmt(s.cost)).join(', ')+')';
$('m-z').textContent='min Z = '+S.map((s,i)=>fmt(s.cost)+'x'+sub[i]).join(' + ');
$('m-cons').innerHTML=B.map(b=>{const c=coverers(b);return`<li><b>${b.k}:</b> <span class="m">${c.length?c.map(i=>'x'+sub[i]).join(' + ')+' ≥ 1':'0 ≥ 1 (مستحيل)'}</span></li>`}).join('');
// hero
$('h-z').textContent=best?fmt(best.cost):'لا حل';$('h-s').textContent=best?names(best.on):'–';$('h-r').textContent=R+' م';
$('tb-r').textContent='📍 نصف القطر = '+R+' متراً';
// sim
$('sbs').innerHTML=S.map((s,i)=>`<button class="sb ${s.on?'on':''}" data-i="${i}"><span>الموقع ${i+1} (${s.n})</span><b><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${s.col};box-shadow:0 0 0 1px var(--ln);margin-inline-end:8px"></i>${fmt(s.cost)} ر.س</b></button>`).join('');
const z=S.reduce((a,s)=>a+s.on*s.cost,0);
const cv=B.map(b=>S.some(s=>s.on&&cov(s,b)));const n=cv.filter(Boolean).length,pc=n/B.length*100;
$('pc').textContent=pc+'%';$('fl').style.width=pc+'%';$('fl').style.background=pc==100?'var(--ok)':pc?'var(--wn)':'var(--er)';
$('zv').textContent=fmt(z)+' ر.س';
const bd=$('bd'),al=$('al');al.textContent='';
if(n<B.length){bd.textContent='غير ممكن';bd.className='bd er'}
else if(best&&z==best.cost){bd.textContent='الحل الأمثل';bd.className='bd ok'}
else{bd.textContent='ممكن لكن غير أمثل';bd.className='bd wn';al.textContent='هدر مالي: الأمثل هو '+names(best.on)+' بتكلفة '+fmt(best.cost)+' ر.س.'}
$('cl').innerHTML=B.map((b,i)=>`<li><span>المربع ${b.k}</span><span class="${cv[i]?'ok':'er'}">${cv[i]?'✔ محقق':'✖ مكشوف'}</span></li>`).join('');
// solver
const forced=B.filter(b=>coverers(b).length==1);
$('st').innerHTML=(forced.length?forced.map(b=>`<li>المربع ${b.k} يغطيه ${S[coverers(b)[0]].n} فقط، فهو إجباري.</li>`).join(''):'<li>لا يوجد مربع يغطيه موقع واحد فقط.</li>')+
'<li>نفحص الحالات الثماني ونستبعد غير الممكنة.</li>'+(best?`<li>أقل تكلفة بين الممكنة: <b>${names(best.on)} = ${fmt(best.cost)} ر.س</b>.</li>`:'<li class="er">لا توجد حالة تغطي كل المربعات، زد نصف القطر.</li>');
$('tb').innerHTML=rows.map(r=>`<tr class="${r===best?'best':''}"><td><span class="m">${r.on.join(' ')}</span></td><td>${fmt(r.cost)}</td><td>${r.c}/4</td><td class="${r.f?'ok':'er'}">${r===best?'الأمثل ★':r.f?'ممكن':'غير ممكن'}</td></tr>`).join('');
// sensitivity
$('rv').textContent=R+' م';S.forEach((s,i)=>$('c'+(i+1)+'v').textContent=fmt(s.cost)+' ر.س');
let svg='',first=null,mx=0;const pts=[];
for(let r=80;r<=250;r+=5){const b=solve(r).best;pts.push([r,b?b.cost:null]);if(b){mx=Math.max(mx,b.cost);if(first===null)first=r}}
const top=Math.max(mx,1000)*1.15;
pts.forEach(([r,c])=>{const x=20+(r-80)*3.3;if(c===null){svg+=`<rect x="${x}" y="190" width="14" height="4" rx="2" fill="var(--er)" opacity=".5"/>`}else{const h=c/top*170;svg+=`<rect x="${x}" y="${195-h}" width="14" height="${h}" rx="4" fill="${r==R?'var(--ac)':'var(--mu)'}" opacity="${r==R?1:.55}"><title>R=${r}: ${fmt(c)}</title></rect>`}});
[100,150,200,250].forEach(r=>svg+=`<text x="${20+(r-80)*3.3+7}" y="216" text-anchor="middle" font-size="12" fill="var(--mu)">${r}</text>`);
$('ch').innerHTML=svg;
$('ins').textContent=first?`أقل نصف قطر يجعل المسألة ممكنة: ${first} م. الخطوط الحمراء تعني عدم وجود حل.`:'لا يوجد حل في هذا المجال.';
}
// canvas
const cvs=$('cv'),ctx=cvs.getContext('2d');
function frame(){
tick+=.05;ctx.clearRect(0,0,600,420);
ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
for(let i=0;i<=600;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,420);ctx.stroke()}
for(let i=0;i<=420;i+=40){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(600,i);ctx.stroke()}
S.forEach(s=>{if(!s.on)return;ctx.save();ctx.beginPath();ctx.arc(s.x,s.y,R,0,7);ctx.fillStyle=s.col+'1f';ctx.fill();ctx.setLineDash([6,4]);ctx.lineWidth=2;ctx.strokeStyle=s.col;ctx.stroke();ctx.restore()});
if(showD){ctx.save();ctx.font='bold 11px Tajawal';ctx.textAlign='center';ctx.textBaseline='middle';
S.forEach(s=>{if(!s.on)return;B.forEach(b=>{const d=dist(s,b),ok=d<=R,c=ok?s.col:'#e8806f';
ctx.setLineDash([5,5]);ctx.strokeStyle=c;ctx.globalAlpha=ok?1:.35;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(b.x,b.y);ctx.stroke();
if(ok){const t=.5,mx=s.x+(b.x-s.x)*t,my=s.y+(b.y-s.y)*t;ctx.setLineDash([]);ctx.fillStyle='rgba(5,42,45,.95)';ctx.beginPath();ctx.roundRect(mx-29,my-11,58,22,7);ctx.fill();ctx.stroke();ctx.fillStyle=c;ctx.fillText(Math.round(d)+' م',mx,my+1)}ctx.globalAlpha=1})});ctx.restore()}
B.forEach(b=>{const c=S.some(s=>s.on&&cov(s,b));ctx.save();if(c){ctx.shadowColor='#4fd1c0';ctx.shadowBlur=14}ctx.fillStyle=c?'#4fd1c0':'#3d5f61';ctx.beginPath();ctx.roundRect(b.x-17,b.y-17,34,34,9);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 13px Tajawal';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.k,b.x,b.y+1);ctx.restore()});
S.forEach(s=>{ctx.save();if(s.on){ctx.beginPath();ctx.arc(s.x,s.y,19+Math.sin(tick)*2,0,7);ctx.strokeStyle=s.col+'88';ctx.lineWidth=2;ctx.stroke();ctx.shadowColor=s.col;ctx.shadowBlur=14}
ctx.fillStyle=s.on?s.col:'#3d5f61';ctx.beginPath();ctx.arc(s.x,s.y,14,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 11px Tajawal';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.n,s.x,s.y+1);ctx.restore()});
requestAnimationFrame(frame)}
// events
const tog=i=>{S[i].on^=1;render()};
cvs.onclick=e=>{const r=cvs.getBoundingClientRect(),x=(e.clientX-r.left)*600/r.width,y=(e.clientY-r.top)*420/r.height;const i=S.findIndex(s=>Math.hypot(s.x-x,s.y-y)<24);if(i>=0)tog(i)};
$('sbs').onclick=e=>{const b=e.target.closest('.sb');if(b)tog(+b.dataset.i)};
$('rs').onclick=()=>{S.forEach(s=>s.on=0);render()};
$('opt').onclick=()=>{const b=solve().best;if(b){S.forEach((s,i)=>s.on=b.on[i]);render()}};
$('tg').onclick=e=>{showD=!showD;e.target.textContent=showD?'إخفاء المسافات':'إظهار المسافات'};
$('rg').oninput=e=>{R=+e.target.value;render()};
[1,2,3].forEach(i=>$('c'+i).oninput=e=>{S[i-1].cost=+e.target.value;render()});
// nav highlight
const links=[...document.querySelectorAll('nav a')],secs=links.map(a=>document.querySelector(a.getAttribute('href')));
addEventListener('scroll',()=>{let k=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<200)k=i});links.forEach((a,i)=>a.classList.toggle('on',i==k))},{passive:true});
// كشف التمرير + شاشة المقدمة
(function(){
const d=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches,it=$('intro');
const els=[...document.querySelectorAll('.hero h1,.hero p,.hero .cta,.stats .glass,section>h2,section>.lead,.grid2>.glass,.cv,.side>.glass,footer')],cnt=new Map();
if(!rm&&'IntersectionObserver' in window)els.forEach(el=>{const p=el.parentElement,i=cnt.get(p)||0;cnt.set(p,i+1);el.style.setProperty('--d',(Math.min(i,5)*90+(el.closest('.stats')?270:0))+'ms');el.classList.add('rv');if(el.matches('.cv,.stats .glass'))el.classList.add('sc')});
let started=0;
function go(){if(started++||rm||!('IntersectionObserver' in window))return;
const io=new IntersectionObserver(es=>es.forEach(e=>{const el=e.target;if(!e.isIntersecting){el.classList.remove('is');return}if(e.intersectionRect.height>=Math.min(90,e.boundingClientRect.height*.5))el.classList.add('is')}),{threshold:[0,.05,.1,.15,.25,.4,.6,1],rootMargin:'0px 0px -6% 0px'});
els.forEach(el=>io.observe(el))}
function finish(){d.classList.remove('intro');if(it)it.remove()}
if(d.classList.contains('intro')&&it){
try{sessionStorage.setItem('uqu-intro','1')}catch(e){}
const img=it.querySelector('img');let ran=0;
const run=()=>{if(ran++)return;requestAnimationFrame(()=>it.classList.add('in'));setTimeout(()=>{it.classList.add('out');go()},rm?1300:2500);setTimeout(finish,rm?1700:3500)};
const dk=d.dataset.theme==='dark'||(d.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);img.onload=run;img.onerror=()=>{finish();go()};img.src=dk&&window.UQU_LOGO_W?window.UQU_LOGO_W:window.UQU_LOGO;
it.onclick=()=>{it.classList.add('out');go();setTimeout(finish,500)};
}else{finish();go()}
})();
render();requestAnimationFrame(frame);
