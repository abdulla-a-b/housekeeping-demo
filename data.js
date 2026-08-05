/* Clean My Area — data
   Zones, rotation, gates, criteria, standard work, translations.
   Change the area owner in the Z array when you assign real names. */

const CYCLE0=new Date(2026,7,9);      // Sun 09 Aug 2026 = cycle week 1
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAYS_BN=['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* equipment colour = the bucket you take */
const Z=[
 ['Z-01','Toilets & washrooms — Production Building','টয়লেট ও ওয়াশরুম — প্রোডাকশন ভবন','CRITICAL','red','3 rounds daily','Admin / Housekeeping'],
 ['Z-02','Toilets & washrooms — YD / Elastic / Utility','টয়লেট ও ওয়াশরুম — ইয়ার্ন ডাইং / ইলাস্টিক / ইউটিলিটি','CRITICAL','red','3 rounds daily','Admin / Housekeeping'],
 ['Z-03','Canteen & dining hall','ক্যান্টিন ও ডাইনিং হল','CRITICAL','green','After each meal','Canteen In-charge'],
 ['Z-04','Canteen kitchen & utensil wash','ক্যান্টিন রান্নাঘর ও বাসন ধোয়ার এলাকা','CRITICAL','green','Daily after service','Canteen In-charge'],
 ['Z-05','Drinking water points & filters','খাবার পানির পয়েন্ট ও ফিল্টার','CRITICAL','green','Daily wipe + weekly sanitise','Admin / Housekeeping'],
 ['Z-06','Medical / first-aid room','মেডিকেল / প্রাথমিক চিকিৎসা কক্ষ','CRITICAL','blue','Daily','Medical Officer'],
 ['Z-07','Child care room','শিশু যত্ন কক্ষ','CRITICAL','blue','2 rounds daily','Welfare Officer'],
 ['Z-08','Overhead water tanks & reservoir','ওভারহেড পানির ট্যাংক ও রিজার্ভার','CRITICAL','green','Weekly visual + quarterly clean','Utility / Maintenance'],
 ['Z-09','Surface drains & storm-water channels','সারফেস ড্রেন ও বৃষ্টির পানির নালা','CRITICAL','blue','Weekly · 2× in monsoon','Utility / Maintenance'],
 ['Z-10','Waste collection points — floor bins','বর্জ্য সংগ্রহ পয়েন্ট — ফ্লোর বিন','HIGH','blue','2 rounds daily','Section Heads'],
 ['Z-11','Central waste yard & segregation','কেন্দ্রীয় বর্জ্য ইয়ার্ড ও পৃথকীকরণ','HIGH','blue','Daily','Store / Admin'],
 ['Z-12','Elastic production floor','ইলাস্টিক প্রোডাকশন ফ্লোর','HIGH','yellow','Layer 1 + daily sweep','Elastic Section Head'],
 ['Z-13','Yarn dyeing floor','ইয়ার্ন ডাইং ফ্লোর','HIGH','yellow','Layer 1 + daily','Yarn Dyeing Head'],
 ['Z-14','ETP area & sludge bed to workshop','ইটিপি এলাকা ও স্লাজ বেড থেকে ওয়ার্কশপ','HIGH','blue','Daily walk-through','ETP In-charge'],
 ['Z-15','Utility building — boiler, generator','ইউটিলিটি ভবন — বয়লার, জেনারেটর','HIGH','yellow','Daily','Utility In-charge'],
 ['Z-16','Chemical & dyes store + spill station','কেমিক্যাল ও ডাই স্টোর + স্পিল স্টেশন','HIGH','yellow','Weekly','Store In-charge'],
 ['Z-17','Fire exits, stairwells & escape routes','ফায়ার এক্সিট, সিঁড়ি ও নির্গমন পথ','HIGH','blue','Daily obstruction check','HSE Officer'],
 ['Z-18','Fans, light fittings, dust extraction','ফ্যান, লাইট ফিটিং, ডাস্ট এক্সট্রাকশন','HIGH','yellow','Monthly','Maintenance'],
 ['Z-19','Machine underside & under-table','মেশিনের নিচ ও টেবিলের নিচের অংশ','HIGH','yellow','Layer 1 weekly','Section Heads'],
 ['Z-20','Production Building — ground + 1st floor','প্রোডাকশন ভবন — নিচতলা ও ১ম তলা','MEDIUM','yellow','Daily sweep','Section Heads'],
 ['Z-21','Production Building — 2nd + 3rd floor','প্রোডাকশন ভবন — ২য় ও ৩য় তলা','MEDIUM','yellow','Daily sweep','Section Heads'],
 ['Z-22','PB + UTB roof, standing-water check','ছাদ — দাঁড়ানো পানি পরীক্ষা','MEDIUM','blue','Weekly in monsoon','Maintenance'],
 ['Z-23','Warehouse — raw material & finished goods','গুদাম — কাঁচামাল ও তৈরি পণ্য','MEDIUM','yellow','Daily aisle sweep','Store In-charge'],
 ['Z-24','Security gate to canteen corridor','নিরাপত্তা গেট থেকে ক্যান্টিন করিডোর','MEDIUM','blue','Daily','Admin'],
 ['Z-25','Internal roads & yard','অভ্যন্তরীণ রাস্তা ও আঙিনা','MEDIUM','blue','Daily 07:00–10:00','Admin'],
 ['Z-26','Landscaping — grass & bush cutting','ল্যান্ডস্কেপিং — ঘাস ও ঝোপ কাটা','LOW','slate','Weekly Apr–Oct','Admin'],
 ['Z-27','Changing, prayer & rest rooms','চেঞ্জিং, নামাজ ও বিশ্রাম কক্ষ','MEDIUM','blue','Daily','Welfare Officer'],
 ['Z-28','Admin office & meeting rooms','প্রশাসনিক অফিস ও মিটিং রুম','LOW','blue','Daily','Admin'],
 ['Z-29','Parking, perimeter & boundary','পার্কিং, চারপাশ ও সীমানা','LOW','slate','Weekly','Security / Admin']
].map(a=>({id:a[0],en:a[1],bn:a[2],risk:a[3],col:a[4],freq:a[5],owner:a[6]}));
const ZM=Object.fromEntries(Z.map(z=>[z.id,z]));

/* rotation: [cycleWeek][jsDay] → [en, bn, zoneId] */
const ROT={
 '1-0':['Toilets & washrooms — Production Building (deep)','টয়লেট ও ওয়াশরুম — প্রোডাকশন ভবন (গভীর)','Z-01'],
 '1-2':['Elastic production floor (deep)','ইলাস্টিক ফ্লোর (গভীর)','Z-12'],
 '1-3':['Canteen, dining hall & kitchen (deep)','ক্যান্টিন, ডাইনিং ও রান্নাঘর (গভীর)','Z-03'],
 '1-4':['Yarn dyeing floor (deep)','ইয়ার্ন ডাইং ফ্লোর (গভীর)','Z-13'],
 '2-0':['Toilets & washrooms — YD / Elastic / Utility (deep)','টয়লেট — ইয়ার্ন ডাইং / ইলাস্টিক / ইউটিলিটি (গভীর)','Z-02'],
 '2-2':['Production Building GF + 1F (deep)','প্রোডাকশন ভবন নিচতলা + ১ম তলা (গভীর)','Z-20'],
 '2-3':['Water points, medical room, child care (deep)','পানির পয়েন্ট, মেডিকেল, শিশু যত্ন (গভীর)','Z-05'],
 '2-4':['ETP area & sludge bed to workshop (deep)','ইটিপি ও স্লাজ বেড (গভীর)','Z-14'],
 '3-0':['Toilets & washrooms — Production Building (deep)','টয়লেট ও ওয়াশরুম — প্রোডাকশন ভবন (গভীর)','Z-01'],
 '3-2':['Production Building 2F + 3F (deep)','প্রোডাকশন ভবন ২য় + ৩য় তলা (গভীর)','Z-21'],
 '3-3':['Central waste yard & segregation (deep)','কেন্দ্রীয় বর্জ্য ইয়ার্ড (গভীর)','Z-11'],
 '3-4':['Fire exits, stairwells & escape routes (deep)','ফায়ার এক্সিট ও সিঁড়ি (গভীর)','Z-17'],
 '4-0':['Toilets & washrooms — YD / Elastic / Utility (deep)','টয়লেট — ইয়ার্ন ডাইং / ইলাস্টিক / ইউটিলিটি (গভীর)','Z-02'],
 '4-2':['Warehouse — RM & FG (deep)','গুদাম — কাঁচামাল ও তৈরি পণ্য (গভীর)','Z-23'],
 '4-3':['Chemical & dyes store + spill station (deep)','কেমিক্যাল স্টোর ও স্পিল স্টেশন (গভীর)','Z-16'],
 '4-4':['Machine underside & under-table (deep)','মেশিনের নিচ ও টেবিলের নিচ (গভীর)','Z-19'],
 '5-0':['Toilets & washrooms — Production Building (deep)','টয়লেট ও ওয়াশরুম — প্রোডাকশন ভবন (গভীর)','Z-01'],
 '5-2':['Elastic production floor (deep)','ইলাস্টিক ফ্লোর (গভীর)','Z-12'],
 '5-3':['Changing, prayer, rest rooms + gate corridor','চেঞ্জিং, নামাজ, বিশ্রাম কক্ষ + গেট করিডোর','Z-27'],
 '5-4':['Utility building — boiler, generator (deep)','ইউটিলিটি ভবন — বয়লার, জেনারেটর (গভীর)','Z-15'],
 '6-0':['Toilets & washrooms — YD / Elastic / Utility (deep)','টয়লেট — ইয়ার্ন ডাইং / ইলাস্টিক / ইউটিলিটি (গভীর)','Z-02'],
 '6-2':['PB + UTB roof, standing-water check','ছাদ — দাঁড়ানো পানি পরীক্ষা','Z-22'],
 '6-3':['Fans, light fittings, dust extraction + admin','ফ্যান, লাইট, ডাস্ট এক্সট্রাকশন + অফিস','Z-18'],
 '6-4':['Yarn dyeing floor (deep)','ইয়ার্ন ডাইং ফ্লোর (গভীর)','Z-13']
};
const FRI_DRY={
 1:['Internal roads & yard — deep scrub','অভ্যন্তরীণ রাস্তা — গভীর পরিষ্কার','Z-25'],
 2:['Warehouse high-level & racking clean','গুদাম উঁচু অংশ ও র‍্যাকিং','Z-23'],
 3:['Parking, perimeter & boundary strip','পার্কিং, চারপাশ ও সীমানা','Z-29'],
 4:['Surface drains — annual de-silt','সারফেস ড্রেন — বার্ষিক পলি অপসারণ','Z-09'],
 5:['Overhead tanks & reservoir — lid and base check','ট্যাংক ও রিজার্ভার — ঢাকনা ও গোড়া','Z-08'],
 6:['Reserve / catch-up + audit-readiness walk','রিজার্ভ / বকেয়া কাজ + অডিট প্রস্তুতি','']
};
const GATES=[
 ['G0','2026-08-07','Charter approved, baseline captured','চার্টার অনুমোদন, বেসলাইন সংগ্রহ'],
 ['G1','2026-09-04','All 29 zones inspected once','সব ২৯টি জোন একবার পরিদর্শিত'],
 ['G2','2026-10-02','Adherence 85%, score 32','মেনে চলা ৮৫%, স্কোর ৩২'],
 ['G3','2026-10-30','Layer 1 at 70% of lines','লেয়ার ১ — ৭০% লাইনে'],
 ['G4','2026-11-30','Mock audit, zero major findings','মক অডিট — কোনো বড় ত্রুটি নয়'],
 ['G5','2026-12-31','Health report vs baseline, 2027 plan','স্বাস্থ্য রিপোর্ট ও ২০২৭ পরিকল্পনা']
];
const CRIT=['1. Floor','2. Waste','3. Sanitary fittings','4. Consumables','5. Surfaces','6. High level','7. Drainage','8. Vector check','9. Order (5S)','10. Layer 1 evidence'];
const CRIT_BN=['১. মেঝে','২. বর্জ্য','৩. স্যানিটারি ফিটিংস','৪. সরবরাহ','৫. পৃষ্ঠতল','৬. উঁচু অংশ','৭. পানি নিষ্কাশন','৮. মশা পরীক্ষা','৯. ৫এস শৃঙ্খলা','১০. লেয়ার ১ প্রমাণ'];
const CRIT_D=[
 'No standing water, no oil, no loose waste, no lint at edges or under equipment',
 'Bins below 3/4 full, lidded, segregated, liner intact, nothing spilled around',
 'Pans, urinals, basins free of stain and odour; water running; flush working; no leak',
 'Soap and water present and stocked, with drying and sanitary disposal where provided',
 'Tables, sills, panels, handrails free of visible dust on a white-cloth wipe',
 'Fans, light fittings, ducts, beams and pipes free of settled dust and cobweb',
 'Channels flowing, traps clear, no stagnant water in or next to the zone',
 'No standing water in any container, tyre, drum, roof pond, plant tray or drain for over 3 days',
 'Everything in its marked place; aisles and fire exits fully clear; nothing on the floor',
 'Workstations in the zone show the 5-minute routine was done at last shift end'];
const CRIT_D_BN=[
 'দাঁড়ানো পানি নেই, তেল নেই, ছড়ানো বর্জ্য নেই, মেশিনের নিচে আঁশ নেই',
 'বিন ৩/৪ এর কম ভরা, ঢাকনা আছে, আলাদা করা, লাইনার ঠিক আছে, চারপাশে কিছু পড়ে নেই',
 'প্যান, ইউরিনাল, বেসিন দাগ ও দুর্গন্ধমুক্ত; পানি আছে; ফ্লাশ কাজ করে; লিক নেই',
 'সাবান ও পানি আছে ও মজুত আছে, হাত শুকানো ও স্যানিটারি নিষ্কাশন যেখানে দেওয়া আছে',
 'টেবিল, জানালার কার্নিশ, প্যানেল, রেলিং — সাদা কাপড়ে মুছলে ধুলো নেই',
 'ফ্যান, লাইট, ডাক্ট, বিম, পাইপ — জমা ধুলো ও মাকড়সার জাল নেই',
 'নালা চলছে, ট্র্যাপ পরিষ্কার, জোনে বা পাশে দাঁড়ানো পানি নেই',
 'কোনো পাত্র, টায়ার, ড্রাম, ছাদের পানি, গাছের ট্রে বা নালায় ৩ দিনের বেশি পানি নেই',
 'সবকিছু চিহ্নিত জায়গায়; পথ ও ফায়ার এক্সিট পুরো ফাঁকা; মেঝেতে কিছু রাখা নেই',
 'জোনের ওয়ার্কস্টেশনে গত শিফট শেষে ৫ মিনিটের রুটিন হয়েছে বোঝা যায়'];

const BLOCKS=[
 ['07:00','10:00','3.00 h',[
  ['A','Internal roads & yard · gate corridor · perimeter litter · drain sweep','অভ্যন্তরীণ রাস্তা ও আঙিনা · গেট করিডোর · চারপাশের আবর্জনা · নালা'],
  ['B','Waste collection round 1 — all floors to central yard · yard set-up','বর্জ্য সংগ্রহ রাউন্ড ১ — সব ফ্লোর থেকে কেন্দ্রীয় ইয়ার্ডে'],
  ['C','Toilet service round 1 — all blocks · child care · medical room','টয়লেট সেবা রাউন্ড ১ — সব ব্লক · শিশু যত্ন · মেডিকেল কক্ষ']]],
 ['10:00','10:30','REST',null],
 ['10:30','13:00','2.50 h',[
  ['A','Waste round 2 · yard segregation and compaction','বর্জ্য রাউন্ড ২ · ইয়ার্ডে পৃথকীকরণ'],
  ['B','Canteen & dining pre-service · kitchen · water points wipe and refill','ক্যান্টিন ও ডাইনিং · রান্নাঘর · পানির পয়েন্ট'],
  ['C','Toilet round 2 · changing, prayer, rest rooms · offices · fire-exit walk','টয়লেট রাউন্ড ২ · চেঞ্জিং, নামাজ, বিশ্রাম · অফিস · ফায়ার এক্সিট']]],
 ['13:00','14:15','LUNCH',null],
 ['14:15','14:45','0.50 h',[
  ['A','Dining hall after-service clean · canteen waste removal','ডাইনিং হল পরিষ্কার · ক্যান্টিন বর্জ্য অপসারণ'],
  ['B','Post-lunch bin round · water-point wipe','দুপুরের পর বিন রাউন্ড · পানির পয়েন্ট মোছা'],
  ['C','Toilet round 3 — peak-use recovery · child care round 2','টয়লেট রাউন্ড ৩ · শিশু যত্ন রাউন্ড ২']]],
 ['14:45','15:50','1.08 h','DEEP'],
 ['15:50','16:00','CLOSE',null]
];

/* ---------- interface strings ---------- */
const T={
 pmTitle:['Deep clean · 14:45','গভীর পরিষ্কার · ১৪:৪৫'],stdTitle:['Standard work · every day','নিয়মিত কাজ · প্রতিদিন'],
 signTitle:['Sign off today','আজকের স্বাক্ষর'],lead:['Team lead','টিম লিড'],ver:['Verifier','ভেরিফায়ার'],
 doneQ:['Work completed?','কাজ সম্পন্ন হয়েছে?'],scoreL:['Inspection score (0–50)','পরিদর্শন স্কোর (০–৫০)'],
 saveDay:['Save today','আজকের কাজ সংরক্ষণ'],inspTitle:['Zone inspection · 50 points','জোন পরিদর্শন · ৫০ পয়েন্ট'],
 zoneL:['Zone','জোন'],dateL:['Date','তারিখ'],verL:['Verifier (not the cleaner)','ভেরিফায়ার (পরিচ্ছন্নতাকর্মী নয়)'],
 critTitle:['Ten criteria','দশটি মানদণ্ড'],rateHint:['Score every criterion to get a rating.','রেটিং পেতে সব স্কোর দিন।'],
 obsL:['Observations · photo reference','পর্যবেক্ষণ · ছবির রেফারেন্স'],saveInsp:['Save inspection','পরিদর্শন সংরক্ষণ'],
 clearInsp:['Clear form','ফর্ম মুছুন'],zonesTitle:['29 zones','২৯টি জোন'],
 zonesNote:['The colour strip is the equipment colour. Red sanitary · Green food · Blue medical and general · Yellow production. Take the bucket that matches the strip.','রঙের পট্টি হলো সরঞ্জামের রঙ। লাল স্যানিটারি · সবুজ খাবার · নীল মেডিকেল ও সাধারণ · হলুদ প্রোডাকশন। পট্টির সাথে মিল রেখে বালতি নিন।'],
 vecTitle:['Standing water · 3-day rule','দাঁড়ানো পানি · ৩ দিনের নিয়ম'],
 vecIntro:['Water standing three days can breed adult mosquitoes. Finding water is not the failure. Leaving it is.','তিন দিন জমে থাকা পানিতে মশা জন্মাতে পারে। পানি খুঁজে পাওয়া ব্যর্থতা নয়। রেখে দেওয়া ব্যর্থতা।'],
 vLoc:['Where','কোথায়'],vType:['Container or surface','পাত্র বা পৃষ্ঠ'],vAct:['Action taken','যে ব্যবস্থা নেওয়া হয়েছে'],
 vClosed:['Closed within 24 hours?','২৪ ঘণ্টার মধ্যে বন্ধ?'],saveVec:['Log this site','এই সাইট লগ করুন'],
 vLogTitle:['Site log','সাইট লগ'],kpiTitle:['This month','এই মাস'],kAdhL:['Adherence','মেনে চলা'],
 kScoreL:['Avg score','গড় স্কোর'],kMissL:['Critical misses','জরুরি জোন বাদ'],kVecL:['Vector closure','মশা সাইট বন্ধ'],
 tgtTitle:['Against target','লক্ষ্যের বিপরীতে'],t1:['Adherence — target 95%','মেনে চলা — লক্ষ্য ৯৫%'],
 t2:['Inspection score — target 40/50','পরিদর্শন স্কোর — লক্ষ্য ৪০/৫০'],t3:['Layer 1 lines — target 90%','লেয়ার ১ লাইন — লক্ষ্য ৯০%'],
 l1L:['Lines completing the 5-minute routine (%)','৫ মিনিটের রুটিন সম্পন্ন করা লাইন (%)'],saveL1:['Update','হালনাগাদ'],
 expTitle:['Records','রেকর্ড'],exportBtn:['Export CSV','সিএসভি এক্সপোর্ট'],syncBtn:['Sync to Google Sheet','গুগল শিটে সিঙ্ক'],
 planTitle:['Six phases · six gates','ছয় ফেজ · ছয় গেট'],rotTitle:['Rotation · this cycle week','রোটেশন · এই চক্র সপ্তাহ'],
 nTod:['Today','আজ'],nIns:['Inspect','পরিদর্শন'],nZon:['Zones','জোন'],nVec:['Water','পানি'],nKpi:['KPI','কেপিআই'],nPln:['Plan','পরিকল্পনা']
};
