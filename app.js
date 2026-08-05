/* Clean My Area — app
   Rendering, events, boot. */

let L=DB.get('lang','en');
const t=(en,bn)=>L==='bn'?bn:en;
const today=new Date();
let iScores=new Array(10).fill(null), ynDone=null, vClosed=null;

function toast(msg,err){const el=document.getElementById('toast');el.textContent=msg;
  el.className='toast on'+(err?' err':'');setTimeout(()=>el.className='toast'+(err?' err':''),2200)}

/* =============================================================
   RENDER — TODAY
   ============================================================= */
function renderToday(){
  const d=today, a=assignment(d), ph=phaseOf(d), cw=cycleWeek(d);
  document.getElementById('heroDate').textContent=d.getDate()+' '+MON[d.getMonth()];
  document.getElementById('heroDow').textContent=L==='bn'?DAYS_BN[d.getDay()]:DAYS[d.getDay()];
  document.getElementById('hero').className='hero'+(a.holiday?' holiday':'');

  const tags=[];
  tags.push(`<span class="tag">${ph[0]} · ${t(ph[1],ph[2])}</span>`);
  if(cw)tags.push(`<span class="tag">${t('Cycle week','চক্র সপ্তাহ')} ${cw}</span>`);
  tags.push(`<span class="tag solid" style="background:${isMonsoon(d)?'var(--green)':'var(--blue)'};color:#fff">${isMonsoon(d)?t('Monsoon','বর্ষা'):t('Dry season','শুষ্ক মৌসুম')}</span>`);
  document.getElementById('heroTags').innerHTML=tags.join('');

  const z=ZM[a.zid];
  document.getElementById('pmZone').textContent=t(a.en,a.bn);
  document.getElementById('pmZid').textContent=a.zid||(a.training?'TRN':'—');
  document.getElementById('pmZid').className='badge '+(z?z.col:'slate');
  document.getElementById('pmBody').className='card-b zc '+(z?z.col:'');
  document.getElementById('pmNote').textContent=z
    ? t('Equipment: take the '+z.col.toUpperCase()+' set. Owner: '+z.owner,
        'সরঞ্জাম: '+z.col.toUpperCase()+' সেট নিন। দায়িত্ব: '+z.owner)
    : t('No rotation zone today.','আজ কোনো রোটেশন জোন নেই।');

  // blocks
  document.getElementById('blocks').innerHTML=BLOCKS.map(b=>{
    if(b[3]===null){
      const lbl=b[2]==='REST'?t('Rest interval — all teams','বিশ্রাম — সব টিম')
              :b[2]==='LUNCH'?t('Lunch','দুপুরের খাবার')
              :t('Tools returned · chemicals locked · roster signed','সরঞ্জাম ফেরত · কেমিক্যাল তালাবদ্ধ · রোস্টার স্বাক্ষর');
      return `<div class="blk rest"><div class="blk-t">${b[0]}<small>${b[1]}</small></div><div class="blk-c">${lbl}</div></div>`;
    }
    if(b[3]==='DEEP'){
      return `<div class="blk"><div class="blk-t">${b[0]}<small>${b[1]}</small></div><div class="blk-c">
        <div class="team"><span class="chip" style="background:${z?'var(--'+z.col+')':'var(--ink)'};${z&&z.col==='yellow'?'color:#101211':''}">◆</span>
        <p><strong>${t(a.en,a.bn)}</strong></p></div></div></div>`;
    }
    const rows=b[3].map(x=>`<div class="team"><span class="chip">${x[0]}</span><p>${t(x[1],x[2])}</p></div>`).join('');
    return `<div class="blk"><div class="blk-t">${b[0]}<small>${b[1]}</small></div><div class="blk-c">${rows}</div></div>`;
  }).join('');

  // sign-off prefill
  const rec=store.roster[iso(d)];
  if(rec){
    document.getElementById('fLead').value=rec.lead||'';
    document.getElementById('fVer').value=rec.verifier||'';
    document.getElementById('fScore').value=rec.score??'';
    ynDone=rec.done??null; paintYN();
  }
  document.getElementById('hdrMeta').textContent=t('Good & Fast Packaging','গুড অ্যান্ড ফাস্ট প্যাকেজিং');
}
function paintYN(){
  document.getElementById('ynY').setAttribute('aria-pressed',ynDone===true);
  document.getElementById('ynN').setAttribute('aria-pressed',ynDone===false);
  const w=document.getElementById('vwarn');
  const lead=document.getElementById('fLead').value.trim().toLowerCase();
  const ver=document.getElementById('fVer').value.trim().toLowerCase();
  w.textContent=(lead&&ver&&lead===ver)
    ? t('Team lead and verifier must be different people.','টিম লিড ও ভেরিফায়ার আলাদা ব্যক্তি হতে হবে।'):'';
  w.style.color=w.textContent?'var(--red)':'';
  w.style.fontWeight=w.textContent?'700':'';
}

/* =============================================================
   RENDER — INSPECT
   ============================================================= */
function renderInspect(){
  const sel=document.getElementById('iZone');
  if(!sel.options.length){
    sel.innerHTML=Z.map(z=>`<option value="${z.id}">${z.id} · ${t(z.en,z.bn)}</option>`).join('');
    document.getElementById('iDate').value=iso(today);
    const a=assignment(today); if(a.zid)sel.value=a.zid;
  }
  document.getElementById('qList').innerHTML=CRIT.map((c,i)=>`
    <div class="q">
      <h4>${L==='bn'?CRIT_BN[i]:c}</h4>
      <p>${L==='bn'?CRIT_D_BN[i]:CRIT_D[i]}</p>
      <div class="pad" role="group">
        ${[0,1,2,3,4,5].map(n=>`<button type="button" data-q="${i}" data-n="${n}"
          class="${n<=2?'lo':n<=3?'mid':'hi'}" aria-pressed="${iScores[i]===n}">${n}</button>`).join('')}
      </div>
    </div>`).join('');
  document.querySelectorAll('#qList .pad button').forEach(b=>b.onclick=()=>{
    iScores[+b.dataset.q]=+b.dataset.n; renderInspect(); tally();
  });
  tally();
}
function tally(){
  const done=iScores.filter(v=>v!==null).length;
  const tot=iScores.reduce((a,b)=>a+(b||0),0);
  document.getElementById('iProg').textContent=done+'/10';
  document.getElementById('iProg').className='badge '+(done===10?'green':'slate');
  document.getElementById('iTot').textContent=tot;
  const r=document.getElementById('iRate'), adv=document.getElementById('iAdvice');
  if(done<10){r.textContent='—';adv.textContent=t('Score every criterion to get a rating.','রেটিং পেতে সব ১০টি স্কোর দিন।');return}
  const zero=[2,3,6,7].some(i=>iScores[i]===0);
  if(tot>=45){r.textContent=t('EXCELLENT','চমৎকার');adv.textContent=t('Nothing to correct.','সংশোধনের কিছু নেই।')}
  else if(tot>=40){r.textContent=t('PASS','উত্তীর্ণ');adv.textContent=t('Meets the standard.','মান পূরণ হয়েছে।')}
  else if(tot>=30){r.textContent=t('IMPROVE','উন্নতি দরকার');adv.textContent=t('Coach the team. Below 30 twice in a row escalates.','টিমকে শেখান। পরপর দুইবার ৩০ এর নিচে হলে এসকেলেট হবে।')}
  else {r.textContent=t('FAIL — re-clean today','ব্যর্থ — আজই আবার পরিষ্কার');adv.textContent=t('Escalate to the Area Owner.','এরিয়া ওনারকে জানান।')}
  if(zero)adv.textContent=t('Zero on sanitary, consumables, drainage or vector — escalate today regardless of total.','স্যানিটারি, সরবরাহ, নিষ্কাশন বা মশায় শূন্য — মোট যাই হোক আজই এসকেলেট করুন।');
}

/* =============================================================
   RENDER — ZONES / VECTOR / KPI / PLAN
   ============================================================= */
function lastScore(zid){
  const rs=store.inspections.filter(x=>x.zone===zid).sort((a,b)=>b.date.localeCompare(a.date));
  return rs.length?rs[0]:null;
}
function renderZones(){
  document.getElementById('zCrit').textContent=Z.filter(z=>z.risk==='CRITICAL').length+' '+t('critical','জরুরি');
  document.getElementById('zoneList').innerHTML=Z.map(z=>{
    const ls=lastScore(z.id);
    const cls=!ls?'none':ls.total>=40?'ok':ls.total>=30?'warn':'bad';
    return `<div class="rowitem zc ${z.col}">
      <div><h4>${z.id} · ${t(z.en,z.bn)}</h4>
      <p><span class="badge ${z.risk==='CRITICAL'?'red':z.risk==='HIGH'?'yellow':'slate'}">${z.risk}</span>
      &nbsp;${z.freq} · ${z.owner}</p></div>
      <div class="meta"><span class="scorepill ${cls}">${ls?ls.total:'—'}</span></div>
    </div>`}).join('');
}
function renderVector(){
  const mons=isMonsoon(today);
  const s=document.getElementById('vSeason');
  s.textContent=mons?t('Active','সক্রিয়'):t('Weekly check only','শুধু সাপ্তাহিক');
  s.className='badge '+(mons?'red':'slate');
  const list=store.vector.slice().reverse();
  const closed=store.vector.filter(v=>v.closed).length;
  document.getElementById('vRate').textContent=store.vector.length
    ? Math.round(closed/store.vector.length*100)+'% '+t('closed','বন্ধ'):'—';
  document.getElementById('vRate').className='badge '+(store.vector.length&&closed===store.vector.length?'green':store.vector.length?'red':'slate');
  document.getElementById('vecList').innerHTML=list.length?list.map(v=>`
    <div class="rowitem">
      <div><h4>${v.loc}</h4><p>${v.type} — ${v.action} · ${v.date}</p></div>
      <div class="meta"><span class="badge ${v.closed?'green':'red'}">${v.closed?t('24H','২৪ ঘ'):t('OPEN','খোলা')}</span></div>
    </div>`).join(''):`<div class="empty"><strong>${t('No sites logged','কোনো সাইট নেই')}</strong>${t('Log every container you find holding water. Even the ones you emptied.','পানি জমে থাকা প্রতিটি পাত্র লগ করুন। যেগুলো খালি করেছেন সেগুলোও।')}</div>`;
}
function renderKPI(){
  const ym=iso(today).slice(0,7);
  document.getElementById('kMonth').textContent=MON[today.getMonth()]+' '+today.getFullYear();
  const recs=Object.entries(store.roster).filter(([k])=>k.startsWith(ym));
  const workdays=recs.filter(([k])=>parse(k).getDay()!==6);
  const doneN=workdays.filter(([,v])=>v.done===true).length;
  const adh=workdays.length?Math.round(doneN/workdays.length*100):null;
  const insp=store.inspections.filter(x=>x.date.startsWith(ym));
  const avg=insp.length?Math.round(insp.reduce((a,b)=>a+b.total,0)/insp.length*10)/10:null;
  const critZ=Z.filter(z=>z.risk==='CRITICAL').map(z=>z.id);
  const miss=workdays.filter(([k,v])=>v.done===false&&critZ.includes(assignment(parse(k)).zid)).length;
  const vec=store.vector.filter(v=>v.date.startsWith(ym));
  const vRate=vec.length?Math.round(vec.filter(v=>v.closed).length/vec.length*100):null;
  const l1=store.l1[ym]??null;

  const set=(id,v,suf)=>document.getElementById(id).textContent=v===null?'—':v+(suf||'');
  set('kAdh',adh,'%'); set('kScore',avg); set('kMiss',miss); set('kVec',vRate,'%');
  document.getElementById('kMiss').style.color=miss>0?'var(--red)':'';

  const bar=(iid,tid,val,target,max)=>{
    const el=document.getElementById(iid),tx=document.getElementById(tid);
    if(val===null){el.style.width='0';tx.textContent='—';return}
    el.style.width=Math.min(100,val/max*100)+'%';
    el.className=val>=target?'':val>=target*0.8?'warn':'bad';
    tx.textContent=val+(max===100?'%':'/50');
  };
  bar('bAdh','bAdhT',adh,95,100); bar('bScore','bScoreT',avg,40,50); bar('bL1','bL1T',l1,90,100);
  if(l1!==null)document.getElementById('fL1').value=l1;
  document.getElementById('recCount').textContent=
    t(`${Object.keys(store.roster).length} day records · ${store.inspections.length} inspections · ${store.vector.length} water sites`,
      `${Object.keys(store.roster).length} দিনের রেকর্ড · ${store.inspections.length} পরিদর্শন · ${store.vector.length} পানির সাইট`);
}
function renderPlan(){
  const now=iso(today);
  document.getElementById('gateList').innerHTML=GATES.map((g,i)=>{
    const done=now>g[1], isNext=!done&&(i===0||now>GATES[i-1][1]);
    const cls=done?'done':isNext?'now':'next';
    const d=parse(g[1]);
    return `<div class="gate ${cls}"><div class="g">${done?'✓':g[0]}</div>
      <div><h4>${t(g[2],g[3])}</h4><p>${g[0]} · ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}</p></div></div>`;
  }).join('');
  const cw=cycleWeek(today), mons=isMonsoon(today);
  document.getElementById('cycTag').textContent=cw?t('Week ','সপ্তাহ ')+cw:'—';
  const days=[0,1,2,3,4,5];
  document.getElementById('rotList').innerHTML=days.map(dy=>{
    let en,bn,zid;
    if(dy===1){ if(mons||cw%2===1){en='Landscaping — grass & bush cutting';bn='ল্যান্ডস্কেপিং';zid='Z-26'}
                else{en='Reserve / catch-up + Layer 1 coaching';bn='রিজার্ভ / বকেয়া';zid=''} }
    else if(dy===5){ if(mons){en='Drain, roof & vector control';bn='নালা, ছাদ ও মশা নিয়ন্ত্রণ';zid='Z-09'}
                     else{const f=FRI_DRY[cw];en=f[0];bn=f[1];zid=f[2]} }
    else{ const r=ROT[cw+'-'+(dy===0?0:dy===2?2:dy===3?3:dy===4?4:0)]; if(!r)return'';
          en=r[0];bn=r[1];zid=r[2]; }
    const z=ZM[zid];
    return `<div class="rowitem zc ${z?z.col:''}">
      <div><h4>${L==='bn'?DAYS_BN[dy]:DAYS[dy]}</h4><p>${t(en,bn)}</p></div>
      <div class="meta"><span class="badge ${z?z.col:'slate'}">${zid||'—'}</span></div></div>`;
  }).join('');
}

/* =============================================================
   ACTIONS
   ============================================================= */
document.getElementById('ynY').onclick=()=>{ynDone=true;paintYN()};
document.getElementById('ynN').onclick=()=>{ynDone=false;paintYN()};
document.getElementById('fLead').oninput=paintYN;
document.getElementById('fVer').oninput=paintYN;
document.getElementById('vY').onclick=()=>{vClosed=true;paintV()};
document.getElementById('vN').onclick=()=>{vClosed=false;paintV()};
function paintV(){document.getElementById('vY').setAttribute('aria-pressed',vClosed===true);
 document.getElementById('vN').setAttribute('aria-pressed',vClosed===false)}

document.getElementById('saveDay').onclick=()=>{
  const lead=document.getElementById('fLead').value.trim();
  const ver=document.getElementById('fVer').value.trim();
  if(!lead||!ver)return toast(t('Team lead and verifier are required','টিম লিড ও ভেরিফায়ার লাগবে'),1);
  if(lead.toLowerCase()===ver.toLowerCase())return toast(t('Verifier must be a different person','ভেরিফায়ার আলাদা ব্যক্তি হতে হবে'),1);
  if(ynDone===null)return toast(t('Mark the work Yes or No','কাজ হ্যাঁ বা না চিহ্নিত করুন'),1);
  const sc=document.getElementById('fScore').value.trim();
  const a=assignment(today);
  store.roster[iso(today)]={lead,verifier:ver,done:ynDone,score:sc===''?null:Math.min(50,Math.max(0,+sc||0)),
    zone:a.zid,at:new Date().toISOString()};
  save(); push('roster',{date:iso(today),...store.roster[iso(today)]});
  toast(t('Saved today','আজকের কাজ সংরক্ষিত')); renderKPI();
};
document.getElementById('saveInsp').onclick=()=>{
  if(iScores.some(v=>v===null))return toast(t('Score all ten criteria','দশটি মানদণ্ডেই স্কোর দিন'),1);
  const ver=document.getElementById('iVer').value.trim();
  if(!ver)return toast(t('Verifier name is required','ভেরিফায়ারের নাম লাগবে'),1);
  const rec={zone:document.getElementById('iZone').value,date:document.getElementById('iDate').value,
    verifier:ver,scores:[...iScores],total:iScores.reduce((a,b)=>a+b,0),
    obs:document.getElementById('iObs').value.trim(),at:new Date().toISOString()};
  store.inspections.push(rec); save(); push('inspection',rec);
  toast(t('Inspection saved · '+rec.total+'/50','পরিদর্শন সংরক্ষিত · '+rec.total+'/50'));
  resetInsp(); renderZones(); renderKPI();
};
function resetInsp(){iScores=new Array(10).fill(null);document.getElementById('iObs').value='';renderInspect()}
document.getElementById('clearInsp').onclick=resetInsp;

document.getElementById('saveVec').onclick=()=>{
  const loc=document.getElementById('vLoc').value.trim();
  if(!loc)return toast(t('Where did you find it?','কোথায় পেয়েছেন?'),1);
  if(vClosed===null)return toast(t('Mark whether it was closed in 24 hours','২৪ ঘণ্টায় বন্ধ হয়েছে কিনা চিহ্নিত করুন'),1);
  const rec={date:iso(today),loc,type:document.getElementById('vType').value.trim()||'—',
    action:document.getElementById('vAct').value.trim()||'—',closed:vClosed,at:new Date().toISOString()};
  store.vector.push(rec); save(); push('vector',rec);
  ['vLoc','vType','vAct'].forEach(i=>document.getElementById(i).value=''); vClosed=null; paintV();
  toast(t('Site logged','সাইট লগ হয়েছে')); renderVector(); renderKPI();
};
document.getElementById('saveL1').onclick=()=>{
  const v=+document.getElementById('fL1').value;
  if(isNaN(v)||v<0||v>100)return toast(t('Enter 0 to 100','০ থেকে ১০০ দিন'),1);
  store.l1[iso(today).slice(0,7)]=v; save(); push('layer1',{month:iso(today).slice(0,7),pct:v});
  toast(t('Updated','হালনাগাদ হয়েছে')); renderKPI();
};

/* ---------- export ---------- */
document.getElementById('exportBtn').onclick=()=>{
  const rows=[['type','date','zone','person','done','score','detail']];
  Object.entries(store.roster).forEach(([d,v])=>rows.push(['roster',d,v.zone||'',v.lead+' / '+v.verifier,v.done?'Y':'N',v.score??'','']));
  store.inspections.forEach(v=>rows.push(['inspection',v.date,v.zone,v.verifier,'',v.total,v.scores.join('|')+' '+v.obs]));
  store.vector.forEach(v=>rows.push(['vector',v.date,'','',v.closed?'Y':'N','',v.loc+' — '+v.type+' — '+v.action]));
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download='clean-my-area-'+iso(today)+'.csv'; a.click();
  toast(t('CSV downloaded','সিএসভি ডাউনলোড হয়েছে'));
};

/* ---------- sync ---------- */
document.getElementById('syncBtn').onclick=async()=>{
  if(!API_URL)return toast(t('Add your Apps Script URL first','প্রথমে অ্যাপস স্ক্রিপ্ট URL যোগ করুন'),1);
  toast(t('Syncing…','সিঙ্ক হচ্ছে…'));
  Object.entries(store.roster).forEach(([d,v])=>push('roster',{date:d,...v}));
  store.inspections.forEach(v=>push('inspection',v));
  store.vector.forEach(v=>push('vector',v));
  setTimeout(()=>toast(t('Sent to Google Sheet','গুগল শিটে পাঠানো হয়েছে')),900);
};

/* ---------- nav + language ---------- */
const VIEWS={today:renderToday,inspect:renderInspect,zones:renderZones,vector:renderVector,kpi:renderKPI,plan:renderPlan};
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#nav button').forEach(x=>x.removeAttribute('aria-current'));
  b.setAttribute('aria-current','page');
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
  document.getElementById('v-'+b.dataset.v).classList.add('on');
  VIEWS[b.dataset.v]();
  window.scrollTo(0,0);
});
function applyLang(){
  document.querySelectorAll('[data-t]').forEach(el=>{const k=T[el.dataset.t];if(k)el.textContent=L==='bn'?k[1]:k[0]});
  document.getElementById('langBtn').textContent=L==='bn'?'English':'বাংলা';
  document.body.classList.toggle('bn',L==='bn');
  const cur=document.querySelector('#nav button[aria-current]');
  VIEWS[cur?cur.dataset.v:'today']();
}
document.getElementById('langBtn').onclick=()=>{L=L==='bn'?'en':'bn';DB.set('lang',L);applyLang()};


/* ---------- offline: register the service worker ---------- */
function registerSW(){
  if(!('serviceWorker' in navigator))return;
  if(location.protocol!=='https:'&&location.hostname!=='localhost')return; // skip on file://
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

/* ---------- boot ---------- */
applyLang();

registerSW();
