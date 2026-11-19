const TRIP_DATE = new Date('2026-12-29T16:35:00');
const GOAL = 16339.31;
const RESERVE = 404.31;
const KEY = 'lua-de-mel-v1';
const places = [
 ['Maceió','Praia de Pajuçara','Orla, jangadas e piscinas naturais','Praia'],
 ['Maceió','Praia de Ponta Verde','Caminhada na orla e mar azul','Praia'],
 ['Maceió','Praia do Francês','Praia famosa com trechos de mar calmo e ondas','Praia'],
 ['Maceió','Praia do Gunga','Coqueiros, falésias e mirantes','Natureza'],
 ['Maceió','Ipioca','Praia tranquila e beach clubs','Praia'],
 ['Maceió','Centro histórico de Maceió','Cultura, arquitetura e história local','Cultura'],
 ['Porto de Galinhas','Piscinas Naturais de Porto de Galinhas','Passeio de jangada conforme maré','Passeio'],
 ['Porto de Galinhas','Praia de Muro Alto','Piscina natural protegida por arrecifes','Praia'],
 ['Porto de Galinhas','Praia dos Carneiros','Coqueiros e águas claras em Tamandaré','Praia'],
 ['Porto de Galinhas','Pontal de Maracaípe','Encontro do rio com o mar e pôr do sol','Natureza'],
 ['Porto de Galinhas','Vila de Porto de Galinhas','Lojas, restaurantes e vida noturna','Gastronomia'],
 ['Recife','Instituto Ricardo Brennand','Museu e jardins','Cultura'],
 ['Recife','Recife Antigo','Centro histórico, Marco Zero e cafés','Cultura'],
 ['Recife','Parque das Esculturas','Arte e vista para o mar','Passeio'],
 ['Recife','Praia de Boa Viagem','Orla urbana e quiosques','Praia'],
 ['Recife','Olinda – Centro Histórico','Casario colorido, ladeiras e mirantes','Cultura']
].map((p,i)=>({id:'p'+i,city:p[0],name:p[1],desc:p[2],kind:p[3]}));
const initial = {
 transactions:[
  {id:'old-in',type:'income',amount:1000,description:'Entradas anteriores',date:'2026-11-01',historic:true},
  {id:'old-out',type:'expense',amount:1000,description:'Festa de Réveillon na praia',date:'2026-11-01',historic:true}
 ],
 itinerary:[],reservations:[]
};
let state = load();
function load(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(initial)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));renderFinance();renderTransactions();renderItinerary();renderReservations()}
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderCountdown(){const n=Math.max(0,Math.ceil((TRIP_DATE-new Date())/86400000));document.getElementById('daysLeft').textContent=n}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.go)));
function showTab(name){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===name));document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id==='panel-'+name));window.scrollTo({top:0,behavior:'smooth'})}
let selectedDestination='Todos';
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{selectedDestination=b.dataset.destination;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderSuggestions()}));
function renderSuggestions(){const list=document.getElementById('suggestions');const filtered=places.filter(p=>selectedDestination==='Todos'||p.city===selectedDestination);list.innerHTML=filtered.map(p=>{const added=state.itinerary.some(x=>x.id===p.id);return `<article class="suggestion"><span class="place-dot">✦</span><div class="place-info"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.city)} · ${escapeHtml(p.kind)} · ${escapeHtml(p.desc)}</small></div><div class="place-actions"><a class="map-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city+' Brasil')}">Mapa ↗</a><button class="add-button" data-add="${p.id}" ${added?'disabled':''} aria-label="Adicionar ${escapeHtml(p.name)}">${added?'✓':'+'}</button></div></article>`}).join('');list.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const p=places.find(x=>x.id===b.dataset.add);if(p&&!state.itinerary.some(x=>x.id===p.id)){state.itinerary.push(p);save()}}))}
function renderItinerary(){const el=document.getElementById('myItinerary');document.getElementById('itineraryCount').textContent=state.itinerary.length+' lugares';if(!state.itinerary.length){el.className='saved-list empty-state';el.textContent='Adicionem os lugares que mais gostarem para montar o roteiro.';renderSuggestions();return}el.className='saved-list';el.innerHTML=state.itinerary.map((p,i)=>`<article class="saved-item"><span class="place-dot">${i+1}</span><div class="place-info"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.city)} · ${escapeHtml(p.kind)}</small></div><div class="place-actions"><a class="map-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city+' Brasil')}">Mapa ↗</a><button class="delete-button" data-remove="${p.id}" aria-label="Remover">×</button></div></article>`).join('');el.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{state.itinerary=state.itinerary.filter(x=>x.id!==b.dataset.remove);save()}));renderSuggestions()}
function totals(){const income=state.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);const expense=state.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);return {income,expense,balance:income-expense}}
function renderFinance(){const t=totals(),remaining=Math.max(0,GOAL-t.income),pct=Math.min(100,t.income/GOAL*100);document.getElementById('goalValue').textContent=money(GOAL);document.getElementById('balanceValue').textContent=money(t.balance);document.getElementById('incomeValue').textContent=money(t.income);document.getElementById('expenseValue').textContent=money(t.expense);document.getElementById('remainingValue').textContent=money(remaining);document.getElementById('fundProgress').style.width=pct+'%';document.getElementById('fundCaption').textContent=pct.toFixed(1).replace('.',',')+'% da meta recebida · '+money(remaining)+' para completar';}
function renderTransactions(){const el=document.getElementById('transactions');const sorted=[...state.transactions].sort((a,b)=>b.date.localeCompare(a.date));el.innerHTML=sorted.map(t=>`<article class="transaction"><span class="tx-symbol ${t.type==='expense'?'expense':''}">${t.type==='income'?'↙':'↗'}</span><div class="place-info"><b>${escapeHtml(t.description)}</b><small>${new Date(t.date+'T12:00:00').toLocaleDateString('pt-BR')}${t.historic?' · Histórico':''}</small></div><span class="amount ${t.type==='expense'?'expense':''}">${t.type==='income'?'+':'−'} ${money(t.amount)}</span>${t.historic?'':'<button class="delete-button" data-tx-del="'+t.id+'" aria-label="Excluir">×</button>'}</article>`).join('');el.querySelectorAll('[data-tx-del]').forEach(b=>b.addEventListener('click',()=>{state.transactions=state.transactions.filter(t=>t.id!==b.dataset.txDel);save()}))}
document.getElementById('txDate').value=new Date().toISOString().slice(0,10);
document.getElementById('transactionForm').addEventListener('submit',e=>{e.preventDefault();const amount=Number(document.getElementById('txAmount').value);if(!(amount>0))return;state.transactions.push({id:crypto.randomUUID(),type:document.getElementById('txType').value,amount,description:document.getElementById('txDescription').value.trim(),date:document.getElementById('txDate').value});e.target.reset();document.getElementById('txDate').value=new Date().toISOString().slice(0,10);save()});
document.getElementById('reservationForm').addEventListener('submit',e=>{e.preventDefault();state.reservations.push({id:crypto.randomUUID(),name:document.getElementById('resName').value.trim(),place:document.getElementById('resPlace').value.trim(),status:document.getElementById('resStatus').value,details:document.getElementById('resDetails').value.trim()});e.target.reset();save()});
function renderReservations(){const el=document.getElementById('extraReservations');el.innerHTML=state.reservations.map(r=>`<article class="transaction"><span class="tx-symbol">⌂</span><div class="place-info"><b>${escapeHtml(r.name)}</b><small>${escapeHtml(r.place)} · ${escapeHtml(r.status)} · ${escapeHtml(r.details)}</small></div><button class="delete-button" data-res-del="${r.id}" aria-label="Excluir">×</button></article>`).join('');el.querySelectorAll('[data-res-del]').forEach(b=>b.addEventListener('click',()=>{state.reservations=state.reservations.filter(r=>r.id!==b.dataset.resDel);save()}))}
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;const btn=document.getElementById('installBtn');btn.hidden=false;btn.addEventListener('click',async()=>{deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;btn.hidden=true},{once:true})});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderCountdown();renderFinance();renderTransactions();renderSuggestions();renderItinerary();renderReservations();
