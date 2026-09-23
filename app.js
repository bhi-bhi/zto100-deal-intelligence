const STAGES=['Not contacted','Intro needed','Contacted','Meeting','Dialogue','Committed'];
const CASE_STATUSES=['Preparation','Active','On hold','Closed'];
const INVESTOR_STATUSES=['Research','Qualified','Inactive'];
const KEY='zto100-v1';

const seed={
cases:[
{id:'CASE-001',slug:'unlimit',name:'Unlimit Group – Capital Raise',company:'Unlimit Group A/S',target:'15 mio. kr.',status:'Active',notes:''},
{id:'CASE-002',slug:'emd',name:'EMD Service – Capital / Strategic Partner',company:'EMD Service A/S',target:'Ikke fastsat',status:'Preparation',notes:''}
],
investors:[
['INV-001','Henrik Nicolai Hørdum Clausen','H4M / H&M investment','1–5 mio.','Research'],
['INV-002','Hanssen familien / Hanssen koncernen','Hanssen koncernen','100+ mio.','Research'],
['INV-003','Michael Andersen','','','Research'],
['INV-004','Bent Møller','Møller Invest Aabenraa A/S','10–50 mio.','Qualified'],
['INV-005','Hans Christian (HC) Freiberg','H.C.F. Holding, Tønder ApS','5–20 mio.','Research'],
['INV-006','Michael Junker Christensen','','','Research'],
['INV-007','Birktoft I/S / ejerkredsen','Birktoft ApS','2–10 mio.','Qualified'],
['INV-008','Carsten Krag Hildebrandt','','1–5 mio.','Research'],
['INV-009','Thomas Krag Burba','','1–5 mio.','Research'],
['INV-010','Carl Johannes Krag','Krag Investment A/S','10–30 mio.','Research'],
['INV-011','Jes Krag','','','Research'],
['INV-012','Sune Hofsted','','0,5–3 mio.','Research'],
['INV-013','Andreas Nielsen','Andreas Nielsen Holding Aabenraa ApS','2–10 mio.','Qualified'],
['INV-014','Mikkel Ro Larsen','Tandlægeholdingselskabet ML ApS','5–15 mio.','Research'],
['INV-015','Hoffmann familien / Hoffmann Esbjerg','Hoffmann Esbjerg Holding A/S','50–200+ mio.','Research'],
['INV-016','Lasse Meldgaard','Meldgaard Holding A/S','10–50+ mio.','Research'],
['INV-017','Henrik Meldgaard','Meldgaard Holding A/S','10–50+ mio.','Research'],
['INV-018','Jesper Hansen','','','Research'],
['INV-019','Michael Sangild','','','Research'],
['INV-020','Ulrik Frederiksen','OSPA HOLDING ApS','5–20 mio.','Qualified'],
['INV-021','Peter Maindal','MAINDAL HOLDING ApS','2–10 mio.','Qualified']
].map(x=>({id:x[0],name:x[1],company:x[2],capacity:x[3],status:x[4],relation:'',notes:''})),
candidates:[
'Jesper Baungaard|Judica Advokaterne','Thomas Kaa|AK Byg','Ulrich Rasmussen|Tiny Hygge','Michael Anker|EY',
'Kaj Christian Glochau|Eget konsulenthus','Carsten Kjærgaard|Advokat & investor','Johnny Killerup|','Allan Sørensen|',
'Steffan RT|','Tom & Per Roth|','Frank Waller|','Jacob Kobeck|','Mark Ohl|','Jesper Sørensen|Nyit.dk / Softprojects',
'Laust Rich|Tecqan','Brian Jacobsen|Erhvervsfyrtårnet','Bjarne Hansen|','Maria Mølgaard|','Ruben Andersen|','John Heinze|',
'Asbjørn Jacobsen|Judica','Fleggaard familien|','Henrik Glise|ArbejdsmiljøEksperten','Niels Heuer|','Søren Behnfeld|',
'Karsten Færge|','Michael Noer|','Jesper Prior Larsen|','Peder Stein Burgaar|'
].map((s,i)=>{const [name,company]=s.split('|');return{id:'CAN-'+(i+1),name,company,status:'Research',notes:''}}),
matches:[
{id:'M1',caseId:'CASE-001',investorId:'INV-004',status:'Contacted',priority:'A',fit:5,ticket:'10–20 mio.',next:'Følg op',dueDate:'',notes:''},
{id:'M2',caseId:'CASE-001',investorId:'INV-020',status:'Meeting',priority:'A',fit:5,ticket:'5–10 mio.',next:'Forbered møde',dueDate:'',notes:''},
{id:'M3',caseId:'CASE-001',investorId:'INV-021',status:'Not contacted',priority:'A',fit:4,ticket:'2–5 mio.',next:'Kontakt Peter',dueDate:'',notes:''},
{id:'M4',caseId:'CASE-001',investorId:'INV-015',status:'Intro needed',priority:'A',fit:5,ticket:'20–50 mio.',next:'Planlæg intro',dueDate:'',notes:''},
{id:'M5',caseId:'CASE-002',investorId:'INV-004',status:'Not contacted',priority:'A',fit:4,ticket:'5–10 mio.',next:'Vurder fit',dueDate:'',notes:''},
{id:'M6',caseId:'CASE-002',investorId:'INV-020',status:'Not contacted',priority:'A',fit:4,ticket:'5–10 mio.',next:'Vurder interesse',dueDate:'',notes:''},
{id:'M7',caseId:'CASE-002',investorId:'INV-016',status:'Intro needed',priority:'B',fit:4,ticket:'10–20 mio.',next:'Find introvej',dueDate:'',notes:''}
]};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const todayISO=()=>new Date().toISOString().slice(0,10);

function migrate(raw){
  const s=raw&&typeof raw==='object'?raw:structuredClone(seed);
  s.cases=(s.cases||seed.cases).map(c=>({...c,status:c.status||'Preparation',target:c.target||'Ikke fastsat',notes:c.notes||'',slug:c.slug||'custom'}));
  s.investors=(s.investors||seed.investors).map(i=>({...i,status:i.status||'Research',capacity:i.capacity||'',company:i.company||'',relation:i.relation||'',notes:i.notes||''}));
  s.candidates=(s.candidates||seed.candidates).map(c=>({...c,status:c.status||'Research',company:c.company||'',notes:c.notes||''}));
  s.matches=(s.matches||[]).map(m=>({...m,status:STAGES.includes(m.status)?m.status:'Not contacted',priority:m.priority||'B',fit:Number(m.fit)||3,ticket:m.ticket||'Ikke fastsat',next:m.next||'',dueDate:m.dueDate||'',notes:m.notes||''}));
  return s;
}
let state=migrate(JSON.parse(localStorage.getItem(KEY)||'null'));
let current='dashboard';
let currentCase=state.cases[0]?.id||'';
let editing={type:null,id:null};
let draggedMatchId=null;
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const inv=id=>state.investors.find(x=>x.id===id);
const cas=id=>state.cases.find(x=>x.id===id);
const mat=id=>state.matches.find(x=>x.id===id);

function toast(msg){
  const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1800);
}
function head(t,e,s){$('#title').textContent=t;$('#eyebrow').textContent=e;$('#subtitle').textContent=s}
function nav(){$$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.v===current))}
function openModal(id){const d=document.getElementById(id);if(d&&!d.open)d.showModal()}
function closeModal(el){const d=el.closest('dialog');if(d)d.close()}
function option(value,label=value,selected=''){return '<option value="'+esc(value)+'" '+(value===selected?'selected':'')+'>'+esc(label)+'</option>'}
function activeCases(){return state.cases.filter(c=>c.status!=='Closed')}
function isOverdue(m){return !!m.dueDate&&m.dueDate<todayISO()&&!!m.next}

function caseCard(c){
  const ms=state.matches.filter(m=>m.caseId===c.id);
  const css=c.slug==='unlimit'?'unlimit':c.slug==='emd'?'emd':'custom';
  return '<button class="case '+css+'" data-case="'+esc(c.id)+'"><span class="statuspill">'+esc(c.status)+'</span><h3>'+esc(c.name)+'</h3><div class="meta">'+esc(c.company||'')+'</div><div class="metrics"><div><b>'+ms.length+'</b><small>Investors</small></div><div><b>'+ms.filter(m=>!['Not contacted','Intro needed'].includes(m.status)).length+'</b><small>Engaged</small></div><div><b>'+esc(c.target)+'</b><small>Target</small></div></div></button>'
}

function dashboard(){
  const openActions=state.matches.filter(m=>m.next).length;
  head('Dashboard','Executive overview','Hvad kræver din opmærksomhed nu.');
  $('#view').innerHTML=
    '<div class="kpis">'+
      '<div class="kpi green"><span>Aktive cases</span><b>'+activeCases().length+'</b><div class="meta">Nuværende portefølje</div></div>'+
      '<div class="kpi blue"><span>Kvalificerede investorer</span><b>'+state.investors.filter(i=>i.status==='Qualified').length+'</b><div class="meta">Investor master</div></div>'+
      '<div class="kpi amber"><span>Nye kandidater</span><b>'+state.candidates.filter(c=>c.status==='Research').length+'</b><div class="meta">Candidate pool</div></div>'+
      '<div class="kpi coral"><span>Åbne handlinger</span><b>'+openActions+'</b><div class="meta">'+state.matches.filter(isOverdue).length+' overdue</div></div>'+
    '</div>'+
    '<div class="section"><h2>Aktive cases</h2><button class="ghost" data-vjump="cases">Se alle →</button></div>'+
    '<div class="cases">'+activeCases().map(caseCard).join('')+'</div>'+
    '<div class="section"><h2>Næste handlinger</h2><button class="ghost" data-vjump="work">Åbn My Work →</button></div>'+
    '<div class="panel actions">'+(state.matches.filter(m=>m.next).slice(0,6).map(m=>{
      const i=inv(m.investorId),c=cas(m.caseId);if(!i||!c)return '';
      return '<div class="row"><div><b>'+esc(i.name)+'</b><div class="meta">'+esc(c.name)+' · '+esc(m.status)+'</div></div><div>'+esc(m.next)+'</div></div>'
    }).join('')||'<div class="empty">Ingen åbne handlinger.</div>')+'</div>';
}

function casesView(){
  head('Cases','Case portfolio','Hver case har sin egen investor-pipeline.');
  $('#view').innerHTML=
    '<div class="toolbar"><div class="toolbar-left"><span class="meta">'+state.cases.length+' cases</span></div><div class="toolbar-right"><button class="primary" data-open="caseCreateModal">+ Ny case</button></div></div>'+
    '<div class="cases">'+state.cases.map(c=>{
      return '<div style="position:relative">'+caseCard(c)+'<button class="mini" data-edit-case="'+esc(c.id)+'" style="position:absolute;right:12px;bottom:12px">Redigér</button></div>'
    }).join('')+'</div>';
}

function investorsView(q=''){
  head('Investors','Shared master','Én fælles investor-master på tværs af cases.');
  const rows=state.investors.filter(i=>(i.name+' '+i.company+' '+i.capacity).toLowerCase().includes(q.toLowerCase()));
  $('#view').innerHTML=
    '<div class="toolbar"><div class="toolbar-left"><span class="meta">'+rows.length+' investorer</span></div><div class="toolbar-right"><button class="primary" data-open="investorCreateModal">+ Ny investor</button></div></div>'+
    '<div class="tablewrap"><table><thead><tr><th>Investor</th><th>Virksomhed</th><th>Kapacitet</th><th>Relation</th><th>Status</th><th></th></tr></thead><tbody>'+
    rows.map(i=>'<tr class="clickable"><td><b>'+esc(i.name)+'</b></td><td>'+esc(i.company||'—')+'</td><td>'+esc(i.capacity||'—')+'</td><td>'+esc(i.relation||'—')+'</td><td><span class="chip">'+esc(i.status)+'</span></td><td><button class="mini" data-edit-investor="'+esc(i.id)+'">Redigér</button></td></tr>').join('')+
    '</tbody></table></div>';
}

function candidatesView(){
  head('Candidate Pool','Research inbox','Navne der skal kvalificeres før de bliver investorer.');
  $('#view').innerHTML=
    '<div class="toolbar"><div class="toolbar-left"><span class="meta">'+state.candidates.length+' kandidater</span></div><div class="toolbar-right"><button class="primary" data-open="candidateCreateModal">+ Ny kandidat</button></div></div>'+
    '<div class="tablewrap"><table><thead><tr><th>Navn</th><th>Virksomhed</th><th>Status</th><th></th></tr></thead><tbody>'+
    state.candidates.map(c=>'<tr><td><b>'+esc(c.name)+'</b></td><td>'+esc(c.company||'—')+'</td><td><span class="chip">'+esc(c.status)+'</span></td><td><button class="mini" data-edit-candidate="'+esc(c.id)+'">Åbn</button></td></tr>').join('')+
    '</tbody></table></div>';
}

function dealCard(m){
  const i=inv(m.investorId);if(!i)return '';
  return '<div class="deal" draggable="true" data-match="'+esc(m.id)+'">'+
    '<div class="dealtop"><div class="dealname">'+esc(i.name)+'</div><span class="chip '+esc((m.priority||'B').toLowerCase())+'">'+esc(m.priority||'B')+'</span></div>'+
    '<div class="dealmeta">Fit '+esc(m.fit)+'/5 · '+esc(m.ticket||'Ikke fastsat')+'</div>'+
    '<div class="dealnext">'+(m.next?esc(m.next):'<span class="meta">Ingen næste handling</span>')+'</div>'+
    (m.dueDate?'<div class="due '+(isOverdue(m)?'overdueText':'')+'">Due '+esc(m.dueDate)+'</div>':'')+
    '<div class="dealcontrols"><button class="mini" data-move-left="'+esc(m.id)+'" title="Flyt venstre">←</button><button class="mini" data-edit-match="'+esc(m.id)+'">Redigér</button><button class="mini" data-move-right="'+esc(m.id)+'" title="Flyt højre">→</button></div>'+
  '</div>';
}

function pipelineView(id=currentCase){
  const c=cas(id)||state.cases[0];if(!c){head('Pipeline','Case specific','Ingen cases endnu.');$('#view').innerHTML='<div class="empty">Opret en case først.</div>';return}
  currentCase=c.id;
  const data=state.matches.filter(m=>m.caseId===c.id);
  head('Pipeline','Case specific',c.name);
  $('#view').innerHTML=
    '<div class="toolbar"><div class="toolbar-left"><select id="caseSel" class="select">'+state.cases.map(x=>option(x.id,x.name,c.id)).join('')+'</select><span class="chip">'+esc(c.status)+'</span></div><div class="toolbar-right"><button class="secondary" data-edit-case="'+esc(c.id)+'">Redigér case</button><button class="primary" id="addInvestorToCase">+ Tilføj investor</button></div></div>'+
    '<div class="notice">Træk investorkort mellem kolonnerne på desktop, eller brug ← / →. Klik Redigér for status, prioritet, fit, ticket, næste handling, dato og noter.</div>'+
    '<div class="kanban" id="kanban">'+STAGES.map(s=>{
      const list=data.filter(m=>m.status===s);
      return '<div class="col" data-stage="'+esc(s)+'"><div class="colhead"><b>'+esc(s)+'</b><span class="chip">'+list.length+'</span></div>'+(list.map(dealCard).join('')||'<div class="empty">Slip kort her</div>')+'</div>'
    }).join('')+'</div>';
  $('#caseSel').onchange=e=>pipelineView(e.target.value);
  $('#addInvestorToCase').onclick=()=>openAddInvestorToCase(c.id);
  wireDnD();
}

function workView(){
  head('My Work','Execution','Dine åbne handlinger på tværs af cases.');
  const rows=state.matches.filter(m=>m.next).sort((a,b)=>{
    if(a.dueDate&&!b.dueDate)return -1;if(!a.dueDate&&b.dueDate)return 1;
    return (a.dueDate||'9999').localeCompare(b.dueDate||'9999');
  });
  $('#view').innerHTML='<div class="toolbar"><span class="meta">'+rows.length+' åbne handlinger · '+rows.filter(isOverdue).length+' overdue</span></div><div class="cards">'+
    (rows.map(m=>{const i=inv(m.investorId),c=cas(m.caseId);if(!i||!c)return '';
      return '<div class="work '+(isOverdue(m)?'overdue':'')+'"><div><b>'+esc(m.next)+'</b><div class="meta">'+esc(i.name)+' · '+esc(c.name)+' · '+esc(m.status)+'</div>'+(m.dueDate?'<div class="due">Due '+esc(m.dueDate)+'</div>':'')+'</div><button class="mini" data-edit-match="'+esc(m.id)+'">Redigér</button><button class="mini" data-complete="'+esc(m.id)+'">Udført</button></div>'
    }).join('')||'<div class="empty">Ingen åbne handlinger.</div>')+'</div>';
}

function render(){
  nav();
  if(current==='dashboard')dashboard();
  if(current==='cases')casesView();
  if(current==='investors')investorsView($('#search').value);
  if(current==='candidates')candidatesView();
  if(current==='pipeline')pipelineView(currentCase);
  if(current==='work')workView();
}

function wireDnD(){
  $$('.deal').forEach(el=>{
    el.addEventListener('dragstart',()=>{draggedMatchId=el.dataset.match;el.classList.add('dragging')});
    el.addEventListener('dragend',()=>{draggedMatchId=null;el.classList.remove('dragging');$$('.col').forEach(c=>c.classList.remove('dragover'))});
  });
  $$('.col').forEach(col=>{
    col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('dragover')});
    col.addEventListener('dragleave',()=>col.classList.remove('dragover'));
    col.addEventListener('drop',e=>{
      e.preventDefault();col.classList.remove('dragover');if(!draggedMatchId)return;
      const m=mat(draggedMatchId);if(!m)return;m.status=col.dataset.stage;save();pipelineView(currentCase);toast('Status opdateret');
    });
  });
}

function moveMatch(id,dir){
  const m=mat(id);if(!m)return;const n=Math.max(0,Math.min(STAGES.length-1,STAGES.indexOf(m.status)+dir));m.status=STAGES[n];save();pipelineView(m.caseId);toast('Flyttet til '+m.status);
}
function completeMatch(id){const m=mat(id);if(!m)return;m.next='';m.dueDate='';save();render();toast('Handling markeret udført')}

function fillCaseForm(c){
  editing={type:'case',id:c.id};const f=$('#caseEditForm');f.name.value=c.name||'';f.company.value=c.company||'';f.target.value=c.target||'';f.status.value=c.status||'Preparation';f.notes.value=c.notes||'';openModal('caseEditModal');
}
function fillInvestorForm(i){
  editing={type:'investor',id:i.id};const f=$('#investorEditForm');f.name.value=i.name||'';f.company.value=i.company||'';f.capacity.value=i.capacity||'';f.relation.value=i.relation||'';f.status.value=i.status||'Research';f.notes.value=i.notes||'';openModal('investorEditModal');
}
function fillCandidateForm(c){
  editing={type:'candidate',id:c.id};const f=$('#candidateEditForm');f.name.value=c.name||'';f.company.value=c.company||'';f.status.value=c.status||'Research';f.notes.value=c.notes||'';openModal('candidateEditModal');
}
function fillMatchForm(m){
  editing={type:'match',id:m.id};const f=$('#matchEditForm');const i=inv(m.investorId),c=cas(m.caseId);
  $('#matchEditTitle').textContent=(i?.name||'Investor')+' · '+(c?.name||'Case');
  f.status.value=m.status;f.priority.value=m.priority||'B';f.fit.value=m.fit||3;f.ticket.value=m.ticket||'';f.next.value=m.next||'';f.dueDate.value=m.dueDate||'';f.notes.value=m.notes||'';openModal('matchEditModal');
}
function openAddInvestorToCase(caseId){
  editing={type:'addToCase',id:caseId};
  const existing=new Set(state.matches.filter(m=>m.caseId===caseId).map(m=>m.investorId));
  const available=state.investors.filter(i=>!existing.has(i.id));
  const sel=$('#addInvestorSelect');sel.innerHTML=available.map(i=>option(i.id,i.name+' — '+(i.company||'uden selskab'))).join('');
  $('#addInvestorEmpty').classList.toggle('hidden',available.length>0);$('#addInvestorForm button[type="submit"]').disabled=!available.length;openModal('addInvestorModal');
}

$$('.nav button').forEach(b=>b.onclick=()=>{current=b.dataset.v;render()});
$('#quick').onclick=()=>openModal('quickModal');
$('#search').oninput=e=>{current='investors';investorsView(e.target.value);nav()};

document.addEventListener('click',e=>{
  const open=e.target.closest('[data-open]');if(open){openModal(open.dataset.open);return}
  const close=e.target.closest('[data-close]');if(close){closeModal(close);return}
  const j=e.target.closest('[data-vjump]');if(j){current=j.dataset.vjump;render();return}
  const cc=e.target.closest('[data-case]');if(cc&&!e.target.closest('[data-edit-case]')){current='pipeline';currentCase=cc.dataset.case;render();return}
  const ec=e.target.closest('[data-edit-case]');if(ec){const c=cas(ec.dataset.editCase);if(c)fillCaseForm(c);return}
  const ei=e.target.closest('[data-edit-investor]');if(ei){const i=inv(ei.dataset.editInvestor);if(i)fillInvestorForm(i);return}
  const ecan=e.target.closest('[data-edit-candidate]');if(ecan){const c=state.candidates.find(x=>x.id===ecan.dataset.editCandidate);if(c)fillCandidateForm(c);return}
  const em=e.target.closest('[data-edit-match]');if(em){const m=mat(em.dataset.editMatch);if(m)fillMatchForm(m);return}
  const ml=e.target.closest('[data-move-left]');if(ml){moveMatch(ml.dataset.moveLeft,-1);return}
  const mr=e.target.closest('[data-move-right]');if(mr){moveMatch(mr.dataset.moveRight,1);return}
  const cp=e.target.closest('[data-complete]');if(cp){completeMatch(cp.dataset.complete);return}
});

$('#caseCreateForm').onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target);
  state.cases.push({id:'CASE-'+Date.now(),slug:'custom',name:f.get('name').trim(),company:f.get('company').trim(),target:f.get('target').trim()||'Ikke fastsat',status:f.get('status'),notes:f.get('notes').trim()});
  save();e.target.reset();$('#caseCreateModal').close();current='cases';render();toast('Case oprettet');
};
$('#investorCreateForm').onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target);
  state.investors.push({id:'INV-'+Date.now(),name:f.get('name').trim(),company:f.get('company').trim(),capacity:f.get('capacity').trim(),relation:f.get('relation').trim(),status:f.get('status'),notes:f.get('notes').trim()});
  save();e.target.reset();$('#investorCreateModal').close();current='investors';render();toast('Investor oprettet');
};
$('#candidateCreateForm').onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target);
  state.candidates.unshift({id:'CAN-'+Date.now(),name:f.get('name').trim(),company:f.get('company').trim(),status:'Research',notes:f.get('notes').trim()});
  save();e.target.reset();$('#candidateCreateModal').close();current='candidates';render();toast('Kandidat oprettet');
};

$('#caseEditForm').onsubmit=e=>{
  e.preventDefault();const c=cas(editing.id);if(!c)return;const f=new FormData(e.target);
  Object.assign(c,{name:f.get('name').trim(),company:f.get('company').trim(),target:f.get('target').trim()||'Ikke fastsat',status:f.get('status'),notes:f.get('notes').trim()});
  save();$('#caseEditModal').close();render();toast('Case opdateret');
};
$('#investorEditForm').onsubmit=e=>{
  e.preventDefault();const i=inv(editing.id);if(!i)return;const f=new FormData(e.target);
  Object.assign(i,{name:f.get('name').trim(),company:f.get('company').trim(),capacity:f.get('capacity').trim(),relation:f.get('relation').trim(),status:f.get('status'),notes:f.get('notes').trim()});
  save();$('#investorEditModal').close();render();toast('Investor opdateret');
};
$('#candidateEditForm').onsubmit=e=>{
  e.preventDefault();const c=state.candidates.find(x=>x.id===editing.id);if(!c)return;const f=new FormData(e.target);
  Object.assign(c,{name:f.get('name').trim(),company:f.get('company').trim(),status:f.get('status'),notes:f.get('notes').trim()});
  save();$('#candidateEditModal').close();render();toast('Kandidat opdateret');
};
$('#matchEditForm').onsubmit=e=>{
  e.preventDefault();const m=mat(editing.id);if(!m)return;const f=new FormData(e.target);
  Object.assign(m,{status:f.get('status'),priority:f.get('priority'),fit:Number(f.get('fit')),ticket:f.get('ticket').trim()||'Ikke fastsat',next:f.get('next').trim(),dueDate:f.get('dueDate'),notes:f.get('notes').trim()});
  save();$('#matchEditModal').close();current='pipeline';currentCase=m.caseId;render();toast('Pipeline-kort opdateret');
};
$('#addInvestorForm').onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target),caseId=editing.id,investorId=f.get('investorId');
  if(!caseId||!investorId)return;
  state.matches.push({id:'M'+Date.now(),caseId,investorId,status:'Not contacted',priority:'B',fit:3,ticket:'Ikke fastsat',next:'Definér næste handling',dueDate:'',notes:''});
  save();$('#addInvestorModal').close();current='pipeline';currentCase=caseId;render();toast('Investor tilføjet til case');
};

$('#deleteMatch').onclick=()=>{
  const m=mat(editing.id);if(!m||!confirm('Fjern investoren fra denne case?'))return;
  state.matches=state.matches.filter(x=>x.id!==m.id);save();$('#matchEditModal').close();current='pipeline';currentCase=m.caseId;render();toast('Fjernet fra case');
};
$('#deleteCase').onclick=()=>{
  const c=cas(editing.id);if(!c||!confirm('Slet casen og alle dens pipeline-kort?'))return;
  state.cases=state.cases.filter(x=>x.id!==c.id);state.matches=state.matches.filter(m=>m.caseId!==c.id);save();$('#caseEditModal').close();current='cases';currentCase=state.cases[0]?.id||'';render();toast('Case slettet');
};
$('#deleteInvestor').onclick=()=>{
  const i=inv(editing.id);if(!i)return;
  if(state.matches.some(m=>m.investorId===i.id)){alert('Investoren bruges i en case. Fjern først investoren fra de relevante cases.');return}
  if(!confirm('Slet investor fra master?'))return;state.investors=state.investors.filter(x=>x.id!==i.id);save();$('#investorEditModal').close();render();toast('Investor slettet');
};
$('#deleteCandidate').onclick=()=>{
  const c=state.candidates.find(x=>x.id===editing.id);if(!c||!confirm('Slet kandidaten?'))return;state.candidates=state.candidates.filter(x=>x.id!==c.id);save();$('#candidateEditModal').close();render();toast('Kandidat slettet');
};
$('#promoteCandidate').onclick=()=>{
  const c=state.candidates.find(x=>x.id===editing.id);if(!c)return;
  state.investors.push({id:'INV-'+Date.now(),name:c.name,company:c.company,capacity:'',relation:'',status:'Research',notes:c.notes||''});
  state.candidates=state.candidates.filter(x=>x.id!==c.id);save();$('#candidateEditModal').close();current='investors';render();toast('Kandidat flyttet til Investor Master');
};

save();render();
