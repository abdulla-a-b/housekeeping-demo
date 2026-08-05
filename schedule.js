/* Clean My Area — schedule
   Date logic. Same rules as the workbook — the roster is computed,
   not stored, so it keeps working past December 2026. */

/* ---------- date helpers ---------- */
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
function cycleWeek(d){const n=Math.floor((d-CYCLE0)/864e5);return n<0?0:(Math.floor(n/7)%6)+1}
function isMonsoon(d){const m=d.getMonth();return m>=3&&m<=9}
function thirdThu(y,m){let d=new Date(y,m,1),n=0;while(true){if(d.getDay()===4){n++;if(n===3)return iso(d)}d.setDate(d.getDate()+1)}}
function phaseOf(d){const s=iso(d);
 if(s<='2026-08-08')return['P0','Mobilise','প্রস্তুতি'];
 if(s<='2026-09-04')return['P1','Foundation','ভিত্তি'];
 if(s<='2026-10-03')return['P2','Stabilise','স্থিতিশীল'];
 if(s<='2026-10-31')return['P3','Embed Layer 1','লেয়ার ১'];
 if(s<='2026-11-30')return['P4','Audit readiness','অডিট প্রস্তুতি'];
 if(s<='2026-12-31')return['P5','Review & Year 2','পর্যালোচনা'];
 return['—','Business as usual','নিয়মিত'];}

function assignment(d){
  const day=d.getDay(), cw=cycleWeek(d), mons=isMonsoon(d);
  if(day===6)return{holiday:true,en:'Weekly holiday',bn:'সাপ্তাহিক ছুটি',zid:''};
  if(iso(d)<'2026-08-09')return{en:'Phase 0 — mobilisation, no rotation yet',bn:'ফেজ ০ — প্রস্তুতি, এখনো রোটেশন নয়',zid:''};
  if(iso(d)===thirdThu(d.getFullYear(),d.getMonth()))
    return{training:true,en:'Monthly training — 45 minutes, after lunch',bn:'মাসিক প্রশিক্ষণ — ৪৫ মিনিট, দুপুরের পর',zid:''};
  if(day===1){
    if(mons||cw%2===1)return{en:'Landscaping — grass & bush cutting',bn:'ল্যান্ডস্কেপিং — ঘাস ও ঝোপ কাটা',zid:'Z-26'};
    return{en:'Reserve / catch-up + Layer 1 coaching walk',bn:'রিজার্ভ / বকেয়া + লেয়ার ১ কোচিং',zid:''};
  }
  if(day===5){
    if(mons)return{en:'Drain, roof & vector control',bn:'নালা, ছাদ ও মশা নিয়ন্ত্রণ',zid:'Z-09'};
    const f=FRI_DRY[cw];return{en:f[0],bn:f[1],zid:f[2]};
  }
  const r=ROT[cw+'-'+day];
  return r?{en:r[0],bn:r[1],zid:r[2]}:{en:'—',bn:'—',zid:''};
}
