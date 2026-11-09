const CATS={"Logement":"#3b5bfd","Courses":"#12a36b","Transport":"#f59e0b","Restaurants":"#ff7a45","Loisirs":"#a855f7","Abonnements":"#ec4899","Santé":"#06b6d4","Autres":"#8e94ab"};
const KW={Courses:/carrefour|leclerc|lidl|auchan|intermarch|monoprix|super u|casino/i,Transport:/total|essence|sncf|uber|ratp|peage|navigo/i,Restaurants:/restau|mcdo|burger|pizza|kebab|cafe|boulang/i,Abonnements:/netflix|spotify|canal|free|orange|sfr|prime|disney/i,"Santé":/pharmac|docteur|medecin|mutuelle/i,Loisirs:/cinema|fnac|steam|playstation|decathlon/i,Logement:/loyer|edf|engie|eau |assurance/i};
const KEY="depenses-v1";
let S=null;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||{tx:[],bud:{},subs:[]};
const save=()=>{S.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(G){clearTimeout(tm);setSt("Modifications en attente…");tm=setTimeout(()=>push(),1500)}};
const $=s=>document.querySelector(s);
const eur=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
let month=new Date().getFullYear()+"-"+pad(new Date().getMonth()+1),tab="dash";
const mtx=m=>S.tx.filter(t=>t.date.slice(0,7)===m);
const sum=a=>a.reduce((x,t)=>x+t.amt,0);
const col=c=>CATS[c]||"#8e94ab";
const opts=sel=>Object.keys(CATS).map(c=>`<option${c===sel?" selected":""}>${c}</option>`).join("");

function dash(){
  const t=mtx(month),inc=sum(t.filter(x=>x.amt>0)),exp=-sum(t.filter(x=>x.amt<0)),sav=inc-exp,rate=inc?Math.round(sav/inc*100):0;
  const by={};t.filter(x=>x.amt<0).forEach(x=>by[x.cat]=(by[x.cat]||0)-x.amt);
  const ents=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  const C=2*Math.PI*40;let off=0;
  const arcs=ents.map(([c,v])=>{const l=v/exp*C,s=`<circle r="40" cx="60" cy="60" fill="none" stroke="${col(c)}" stroke-width="16" stroke-dasharray="${l} ${C-l}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;off+=l;return s}).join("");
  const legend=ents.map(([c,v])=>`<div class="leg"><span class="dot" style="background:${col(c)}"></span>${esc(c)}<b>${eur(v)}</b></div>`).join("");
  const ms=[...Array(6)].map((_,i)=>{const d=new Date(+month.slice(0,4),+month.slice(5)-1-(5-i),1);return d.getFullYear()+"-"+pad(d.getMonth()+1)});
  const dat=ms.map(m=>{const x=mtx(m);return{m,i:sum(x.filter(q=>q.amt>0)),e:-sum(x.filter(q=>q.amt<0))}});
  const mx=Math.max(1,...dat.map(d=>Math.max(d.i,d.e)));
  const bars=dat.map((d,k)=>{const x=k*50+8,hi=d.i/mx*100,he=d.e/mx*100;return`<rect x="${x}" y="${110-hi}" width="16" height="${hi}" rx="3" fill="var(--ok)"/><rect x="${x+19}" y="${110-he}" width="16" height="${he}" rx="3" fill="var(--ko)"/><text x="${x+17}" y="128" text-anchor="middle" font-size="10" fill="var(--mu)">${d.m.slice(5)}/${d.m.slice(2,4)}</text>`}).join("");
  const bl=Object.entries(S.bud).filter(([,v])=>v>0).map(([c,v])=>{const s=by[c]||0,p=s/v*100;return`<div style="margin-top:12px"><div class="row"><span class="dot" style="background:${col(c)}"></span>${esc(c)}<span class="mu" style="margin-left:auto">${eur(s)} / ${eur(v)}</span></div><div class="bar"><i style="width:${Math.min(p,100)}%;background:${p>100?"var(--ko)":col(c)}"></i></div></div>`}).join("");
  return`<div class="grid" style="margin-bottom:14px">
<div class="card"><h2>Revenus</h2><div class="big ok">${eur(inc)}</div></div>
<div class="card"><h2>Dépenses</h2><div class="big ko">${eur(exp)}</div></div>
<div class="card"><h2>Épargne du mois</h2><div class="big ${sav<0?"ko":""}">${eur(sav)}</div><div class="mu">Taux d’épargne : ${rate} %</div></div></div>
<div class="grid" style="margin-bottom:14px">
<div class="card"><h2>Répartition des dépenses</h2>${exp?`<div class="dn"><svg width="130" height="130" viewBox="0 0 120 120" role="img" aria-label="Répartition par catégorie">${arcs}<text x="60" y="64" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tx)">${eur(exp)}</text></svg><div style="flex:1;min-width:150px">${legend}</div></div>`:`<div class="empty">Aucune dépense ce mois-ci.</div>`}</div>
<div class="card"><h2>Évolution sur 6 mois</h2><svg viewBox="0 0 300 135" width="100%" role="img" aria-label="Revenus et dépenses sur 6 mois">${bars}</svg><div class="leg"><span class="dot" style="background:var(--ok)"></span>Revenus<span class="dot" style="background:var(--ko);margin-left:12px"></span>Dépenses</div></div></div>
<div class="card"><h2>Budgets du mois</h2>${bl||`<div class="empty">Définis des budgets dans l’onglet Budgets.</div>`}</div>`;
}

function txv(){
  const t=mtx(month).sort((a,b)=>b.date.localeCompare(a.date));
  const list=t.map(x=>`<div class="li"><span class="dot" style="background:${x.amt>0?"var(--ok)":col(x.cat)}"></span><div class="n">${esc(x.label)}<div class="mu" style="font-size:12px">${x.date.split("-").reverse().join("/")} · ${esc(x.cat)}</div></div><b class="${x.amt>0?"ok":""}">${eur(x.amt)}</b><button class="x" onclick="delTx('${x.id}')" aria-label="Supprimer">×</button></div>`).join("");
  return`<div class="card"><h2>Ajouter une transaction</h2><div class="row"><input type="date" id="fd" value="${new Date().toISOString().slice(0,10)}"><input id="fl" placeholder="Libellé"><input id="fa" type="number" step="0.01" min="0" placeholder="Montant €"><select id="ft"><option value="d">Dépense</option><option value="r">Revenu</option></select><select id="fc">${opts()}</select><button class="b" onclick="addTx()">Ajouter</button></div></div>
<div class="card"><h2>Import et sauvegarde</h2><div class="row"><label class="b g" style="padding:9px 11px;cursor:pointer;border-radius:10px;background:var(--in);border:1px solid var(--bd)">Importer un CSV ou JSON<input type="file" id="fi" hidden></label><button class="b g" onclick="expCSV()">Exporter CSV</button><button class="b g" onclick="expJSON()">Sauvegarde JSON</button></div><p class="mu" style="margin:10px 0 0;font-size:13px">Le CSV doit avoir une ligne d’en-tête avec date, libellé et montant (ou débit/crédit). Les données sont enregistrées dans ce navigateur, et sur GitHub si la synchro est activée : pense aux sauvegardes JSON.</p></div>
<div class="card"><h2>Transactions du mois (${t.length})</h2>${list||`<div class="empty">Aucune transaction ce mois-ci.</div>`}</div>`;
}

function budv(){
  const by={};mtx(month).filter(x=>x.amt<0).forEach(x=>by[x.cat]=(by[x.cat]||0)-x.amt);
  return`<div class="card"><h2>Budget mensuel par catégorie</h2>${Object.keys(CATS).map(c=>{const v=S.bud[c]||"",s=by[c]||0;return`<div class="li"><span class="dot" style="background:${col(c)}"></span><div class="n">${c}<div class="mu" style="font-size:12px">Dépensé ce mois : ${eur(s)}</div></div><input type="number" min="0" step="10" value="${v}" placeholder="0 €" style="width:110px" onchange="setBud('${c}',this.value)"></div>`}).join("")}</div>`;
}

function subv(){
  const tot=S.subs.reduce((a,s)=>a+s.amt,0);
  const list=S.subs.map(s=>`<div class="li"><span class="dot" style="background:${col(s.cat)}"></span><div class="n">${esc(s.label)}<div class="mu" style="font-size:12px">Le ${s.day} de chaque mois · ${esc(s.cat)}</div></div><b>${eur(s.amt)}</b><button class="x" onclick="delSub('${s.id}')" aria-label="Supprimer">×</button></div>`).join("");
  return`<div class="card"><h2>Ajouter un abonnement ou une charge récurrente</h2><div class="row"><input id="sl" placeholder="Nom (ex. Netflix)"><input id="sa" type="number" step="0.01" min="0" placeholder="Montant €"><input id="sd" type="number" min="1" max="28" value="1" title="Jour du mois"><select id="sc">${opts("Abonnements")}</select><button class="b" onclick="addSub()">Ajouter</button></div></div>
<div class="card"><h2>Total mensuel</h2><div class="big">${eur(tot)}</div><p class="mu" style="margin:4px 0 12px">Soit ${eur(tot*12)} par an.</p><button class="b" onclick="applySubs()">Ajouter à ${month.slice(5)}/${month.slice(0,4)}</button></div>
<div class="card"><h2>Mes abonnements</h2>${list||`<div class="empty">Aucun abonnement pour le moment.</div>`}</div>`;
}

function addTx(){
  const a=parseFloat($("#fa").value),l=$("#fl").value.trim(),d=$("#fd").value;
  if(!a||!l||!d){alert("Renseigne la date, le libellé et le montant.");return}
  S.tx.push({id:uid(),date:d,label:l,amt:$("#ft").value==="r"?Math.abs(a):-Math.abs(a),cat:$("#ft").value==="r"?"Revenu":$("#fc").value});
  save();if(d.slice(0,7)!==month)month=d.slice(0,7),$("#mo").value=month;render();
}
function delTx(id){S.tx=S.tx.filter(t=>t.id!==id);save();render()}
function setBud(c,v){S.bud[c]=parseFloat(v)||0;save()}
function addSub(){
  const a=parseFloat($("#sa").value),l=$("#sl").value.trim();
  if(!a||!l){alert("Renseigne le nom et le montant.");return}
  S.subs.push({id:uid(),label:l,amt:Math.abs(a),day:Math.min(28,Math.max(1,+$("#sd").value||1)),cat:$("#sc").value});save();render();
}
function delSub(id){S.subs=S.subs.filter(s=>s.id!==id);save();render()}
function applySubs(){
  let n=0;
  S.subs.forEach(s=>{if(!S.tx.some(t=>t.subId===s.id&&t.date.slice(0,7)===month)){S.tx.push({id:uid(),subId:s.id,date:month+"-"+pad(s.day),label:s.label,amt:-s.amt,cat:s.cat});n++}});
  save();alert(n?n+" abonnement(s) ajouté(s) au mois.":"Tout est déjà ajouté pour ce mois.");
}

function dl(name,txt,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}
function expJSON(){dl("depenses-sauvegarde.json",JSON.stringify(S),"application/json")}
function expCSV(){dl("depenses.csv","date;libelle;montant;categorie\n"+S.tx.map(t=>[t.date,'"'+t.label.replace(/"/g,"'")+'"',String(t.amt).replace(".",","),t.cat].join(";")).join("\n"),"text/csv")}

function parseCSV(txt){
  let L=txt.replace(/^\uFEFF/,"").replace(/\r/g,"").split("\n").filter(l=>l.trim());
  const hi=L.findIndex((l,n)=>n<25&&/date/i.test(l)&&/montant|amount|d.bit|cr.dit/i.test(l));
  if(hi>0)L=L.slice(hi);
  if(L.length<2)return[];
  const d=L[0].split(";").length>=L[0].split(",").length?";":",";
  const sp=l=>{const r=[];let c="",q=false;for(const ch of l){if(ch==='"')q=!q;else if(ch===d&&!q){r.push(c);c=""}else c+=ch}r.push(c);return r.map(s=>s.trim())};
  const h=sp(L[0]).map(s=>s.toLowerCase()),f=re=>h.findIndex(x=>re.test(x));
  const i=f(/date/),j=f(/libell|label|descr|intitul|tiers|nom/),k=f(/montant|amount/),dc=f(/d.bit/),cr=f(/cr.dit/);
  if(i<0||(k<0&&dc<0&&cr<0))return null;
  const num=s=>{s=String(s||"0").replace(/[−–]/g,"-").replace(/[\s\u00a0€]/g,"");if(/,\d{1,2}$/.test(s))s=s.replace(/\./g,"").replace(",",".");return parseFloat(s)||0};
  return L.slice(1).map(l=>{
    const c=sp(l);let dt=c[i]||"";
    const m=dt.match(/^(\d{2})[\/.-](\d{2})[\/.-](\d{4})/);dt=m?`${m[3]}-${m[2]}-${m[1]}`:dt.slice(0,10);
    const amt=k>=0?num(c[k]):num(c[cr])-Math.abs(num(c[dc])),lab=c[j]||"Sans libellé";
    let cat="Autres";if(amt>0)cat="Revenu";else for(const g in KW)if(KW[g].test(lab)){cat=g;break}
    return{id:uid(),date:dt,label:lab,amt,cat};
  }).filter(t=>/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&t.amt);
}
function importFile(f){
  const r=new FileReader();
  r.onload=()=>{
    let t=new TextDecoder("utf-8").decode(r.result);
    if(t.includes("\uFFFD"))t=new TextDecoder("windows-1252").decode(r.result);
    try{
      if(f.name.endsWith(".json")){const o=JSON.parse(t);if(!o.tx)throw 0;if(!confirm("Remplacer toutes les données actuelles par cette sauvegarde ?"))return;S=o;save();render();return}
      const rows=parseCSV(t);
      if(!rows){alert("Colonnes introuvables : il faut une colonne date et une colonne montant (ou débit/crédit).\nEn-tête lu : "+(t.split("\n").find(l=>l.trim())||"").slice(0,150));return}
      if(!rows.length){alert("Aucune ligne reconnue : vérifie le format des dates (JJ/MM/AAAA ou AAAA-MM-JJ) et la colonne montant.");return}
      const seen=new Set(S.tx.map(t=>t.date+t.label+t.amt));let n=0;
      rows.forEach(t=>{const k=t.date+t.label+t.amt;if(!seen.has(k)){seen.add(k);S.tx.push(t);n++}});
      save();if(rows[0])month=rows[0].date.slice(0,7),$("#mo").value=month;render();alert(n+" transaction(s) importée(s).");
    }catch(e){alert("Fichier illisible.")}
  };
  r.readAsArrayBuffer(f);
}

/* Synchro GitHub */
const SK="depenses-sync";
let G=null,sha=null,tm=null,st="";
try{G=JSON.parse(localStorage.getItem(SK))}catch(e){}
const setSt=t=>{st=t;const a=$("#sst"),b=$("#sstat");if(a)a.textContent=G?t:"";if(b)b.textContent=t};
const api=()=>`https://api.github.com/repos/${G.repo}/contents/${G.path||"data.json"}`;
const hd=()=>({Authorization:"Bearer "+G.token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"});
const enc=s=>{let r="";new TextEncoder().encode(s).forEach(c=>r+=String.fromCharCode(c));return btoa(r)};
const dec=b=>new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g,"")),c=>c.charCodeAt(0)));
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const errMsg=r=>r.status===401?"Token refusé":r.status===403?"Droits insuffisants sur le dépôt":r.status===404?"Dépôt introuvable ou token sans accès":"Erreur "+r.status;
function merge(a,b){
  const m={tx:[...a.tx],subs:[...(a.subs||[])],bud:(b.updated>(a.updated||0)?b:a).bud||{},updated:Date.now()};
  const ti=new Set(a.tx.map(t=>t.id));b.tx.forEach(t=>{if(!ti.has(t.id))m.tx.push(t)});
  const si=new Set(m.subs.map(s=>s.id));(b.subs||[]).forEach(s=>{if(!si.has(s.id))m.subs.push(s)});
  return m;
}
async function pull(){
  if(!G)return;setSt("Synchronisation…");
  try{
    const r=await fetch(api(),{headers:hd(),cache:"no-store"});
    if(r.status===404){sha=null;await push();return}
    if(!r.ok)throw new Error(errMsg(r));
    const j=await r.json(),o=JSON.parse(dec(j.content));sha=j.sha;
    if(!S.updated&&S.tx.length){S=merge(o,S);store();render();await push();return}
    if((o.updated||0)>(S.updated||0)){S=o;store();render();setSt("Synchronisé")}
    else if((S.updated||0)>(o.updated||0))await push();
    else setSt("Synchronisé");
  }catch(e){setSt("Hors ligne ou erreur : "+e.message)}
}
async function push(retried){
  if(!G)return;setSt("Synchronisation…");
  try{
    const body={message:"Mise à jour "+new Date().toISOString(),content:enc(JSON.stringify(S))};
    if(sha)body.sha=sha;
    const r=await fetch(api(),{method:"PUT",headers:hd(),body:JSON.stringify(body)});
    if((r.status===409||r.status===422)&&!retried){
      const g=await fetch(api(),{headers:hd(),cache:"no-store"});
      if(g.ok){const j=await g.json();sha=j.sha;S=merge(JSON.parse(dec(j.content)),S);store();render();return push(true)}
    }
    if(!r.ok)throw new Error(errMsg(r));
    sha=(await r.json()).content.sha;
    setSt("Synchronisé à "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}));
  }catch(e){setSt("Hors ligne ou erreur : "+e.message)}
}
function syncv(){
  const g=G||{};
  return`<div class="card"><h2>Synchronisation GitHub</h2><p class="mu" style="margin:0 0 12px;font-size:13px">Tes données sont enregistrées dans un fichier JSON d’un dépôt GitHub <b>privé</b>, différent de celui de l’app. Crée un token « fine-grained » limité à ce dépôt, avec le droit Contents en lecture et écriture.</p>
<div class="row"><input id="gr" placeholder="pseudo/depot-donnees" value="${esc(g.repo||"")}" autocomplete="off"><input id="gp" placeholder="data.json" value="${esc(g.path||"data.json")}"></div>
<div class="row" style="margin-top:8px"><input id="gt" type="password" placeholder="Token GitHub" value="${esc(g.token||"")}" autocomplete="off"></div>
<div class="row" style="margin-top:12px"><button class="b" onclick="saveSync()">Enregistrer et synchroniser</button>${G?`<button class="b g" onclick="pull()">Synchroniser maintenant</button><button class="b g" onclick="offSync()">Déconnecter</button>`:""}</div>
<p id="sstat" class="mu" style="margin:12px 0 0;font-size:13px">${esc(G?st:"Non connecté.")}</p></div>
<div class="card"><h2>À savoir</h2><p class="mu" style="margin:0;font-size:13px">Le token est stocké dans ce navigateur : ne l’utilise que sur tes propres appareils. Si tu modifies depuis deux appareils en même temps, les transactions des deux côtés sont fusionnées, mais une suppression peut réapparaître.</p></div>`;
}
function saveSync(){
  const repo=$("#gr").value.trim(),token=$("#gt").value.trim(),path=$("#gp").value.trim()||"data.json";
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo)||!token){alert("Renseigne le dépôt (pseudo/depot) et le token.");return}
  G={repo,token,path};sha=null;
  try{localStorage.setItem(SK,JSON.stringify(G))}catch(e){}
  render();pull();
}
function offSync(){
  if(!confirm("Déconnecter la synchronisation de cet appareil ? Tes données locales sont conservées."))return;
  G=null;sha=null;try{localStorage.removeItem(SK)}catch(e){}
  setSt("");render();
}

function render(){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===tab));
  $("#app").innerHTML={dash,tx:txv,bud:budv,subs:subv,sync:syncv}[tab]();
  const fi=$("#fi");if(fi)fi.onchange=e=>{const f=e.target.files[0];e.target.value="";if(f)importFile(f)};
}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
$("#mo").value=month;
$("#mo").onchange=e=>{if(e.target.value){month=e.target.value;render()}};
render();
if(G)pull();
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&G)pull()});
