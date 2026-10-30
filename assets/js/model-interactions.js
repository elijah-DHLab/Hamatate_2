/* Original model interactions, isolated from the portal and its data. */
window.mountModelWorkspace=function(document,openExample){
const program=[
 ['s1','1','חדשות רויטר־פלקור'],['s2','2','סקסאפיל לשעת חירום'],['s3','3','בשבילך עד חצי המלכות'],['b1','','הפסקה'],['s5','4','גוטנמוט ענד קומפני'],['s6','5','נקניקיות ופלאפל'],['s7','6','השלגיה ואביריה'],['b2','','הפסקה'],['s9','7','קו מז׳ינו וקו זיגפריד'],['tender','8','הטנדר נוסע'],['s11','9','פלוגה דום!']
];
const text=[
 ['s1','','חדשות רויטר־פלקור'],['s2','','סקסאפיל / מסכות גז'],['s3','','בשבילך עד חצי המלכות'],['s5','','גוטנמוט ענד קומפני'],['king','','בחזית המלך פיק'],['s6','','נקניקיות ופלאפל'],['s7','','שלגיה ואביריה'],['tender','','הטנדר נוסע'],['s9','','קו מז׳ינו וקו זיגפריד'],['s11','','פלוגה דום!']
];
function unitHTML(x, compare=false){const [k,n,l]=x;let cls='unit';if(k==='b1'||k==='b2')cls+=' break';if(k==='tender')cls+=' tender clickable';if(k==='king')cls+=' king clickable';if(compare&&!['tender','king'].includes(k))cls+='';let micro='';if(k==='tender')micro='<div class="micro"><i class="dot p" title="תכנייה"></i><i class="dot t" title="טקסט"></i><i class="dot a" title="הקלטה מאוחרת"></i></div>';if(k==='king')micro='<div class="micro"><i class="dot none" title="אין תכנייה"></i><i class="dot t" title="טקסט"></i></div>';return `<div class="${cls}" data-unit="${k}">${n?`<span class="n">${n}</span>`:''}<b>${l}</b>${micro}</div>`}
// data-model subviews — V7
function setModelSubview(id){document.querySelectorAll('.model-page-tab').forEach(x=>x.classList.toggle('on',x.dataset.modelView===id));document.querySelectorAll('.model-panel').forEach(x=>x.classList.toggle('on',x.id===id));}
document.querySelectorAll('.model-page-tab').forEach(b=>b.onclick=()=>setModelSubview(b.dataset.modelView));
document.querySelectorAll('[data-open-edition-model]').forEach(b=>b.onclick=()=>{setModelSubview('editionModel');document.getElementById('editionModel').scrollIntoView({behavior:'smooth',block:'start'})});

const modelCases={
 tender:{
  title:'הטנדר נוסע', subtitle:'אותו מוקד מחקרי מופיע בכמה זהויות חומריות ומסדיות שונות.',
  sources:[['תכנייה — רשימת הערב','„8. הטנדר נוסע”'],['תכנייה — עמוד מילות השיר','גוף השיר מודפס במלואו'],['טקסט המחזה','הכותרת נשמרה; גוף השיר חסר'],['שמע / וידאו מאוחרים','חומר מקושר לתולדות השיר, לא עד ישיר ל־1939']],
  records:[['PS10','A228401-P1.3.PS10','מפנה במפורש ל־A228401-S10','direct'],['P1.4','A228401-P1.4','יחידה גרפית: „מילות השיר הטנדר נוסע”','interpretive'],['T16','A228401-T16','מקטע טקסט המקושר ל־S10','direct'],['AV','שתי רשומות „הטנדר”','שדה „קישור למספר S” → S10','direct']],
  claims:[['טענת זיהוי','הרשומות השונות מתייחסות לאותה יחידת מופע משוערת.','גבוהה'],['טענת השתמרות','גוף השיר אינו נשמר בטקסט המחזה, אף שהכותרת כן.','גבוהה'],['טענת מעמד AV','ההקלטות המאוחרות מקושרות ליחידה, אך אינן עד ישיר לאירוע 1939.','גבוהה']],
  s:['A228401-S10','הטנדר נוסע','שם [על פי החוקר]','הערת מהדיר: מילות השיר אינן מופיעות בטקסט אך מופיעות בתכנייה.'],
  scenarios:[['קריאה לפי התכנייה','… → קו מז׳ינו → הטנדר נוסע → פלוגה דום!'],['קריאה לפי הטקסט','… → הטנדר נוסע [כותרת בלבד] → קו מז׳ינו …']],
  explain:'כאן רואים את ההבדל בין <b>זהות חומרית</b> (עמוד/מקטע), <b>זהות מסדית</b> (P, PS, T, AV) ו<b>זהות מחקרית</b> (S10). דף ההצגה מציג שם אחד כדי להיות קריא; מפת הקשרים שומרת את הפירוק שמאפשר לבדוק את הטענה.'
 },
 king:{
  title:'בחזית המלך פיק', subtitle:'יחידה שיש לה זהות טקסטואלית ומחקרית, אך אין לה מקבילה ברשימת התכנייה.',
  sources:[['טקסט המחזה','כותרת + מערכון מלא יחסית'],['תכנייה — רשימת הערב','אין יחידה בשם זה']],
  records:[['T11','A228401-T11','מופיע בטקסט ומקושר ל־S12','direct'],['PS','אין רשומה מקבילה','היעדר ברשימת התכנייה נשמר כהיעדר','muted']],
  claims:[['טענת שיוך','המערכון שייך לקורפוס הטקסטואלי של ההצגה.','גבוהה'],['טענה שלילית שלא נוצרת','אין עדות בתכנייה ≠ הקטע לא בוצע.','—']],
  s:['A228401-S12','בחזית המלך פיק - קלפים','שם [על פי החוקר]','הערת מהדיר: המערכון אינו מופיע בתכנייה, אך מופיע בטקסט.'],
  scenarios:[['קריאה לפי התכנייה','היחידה אינה נכללת ברצף המבוסס על PS'],['קריאה לפי הטקסט','בחזית המלך פיק נכללת כחומר טקסטואלי']],
  explain:'המפה אינה מנסה „למלא” את החור בתכנייה. היא מאפשרת ל־S12 להתקיים עם תמיכה מטקסט בלבד, ובכך מפרידה בין <b>היעדר קישור</b> לבין <b>טענה שהאירוע לא התרחש</b>.'
 }
};
let modelFocus='tender';
function flowCard(title,small,kind=''){return `<div class="flow-card ${kind}"><b>${title}</b><div class="tagline">${small}</div></div>`}
function setModelFocus(k){modelFocus=k;document.querySelectorAll('[data-model-focus]').forEach(b=>b.classList.toggle('on',b.dataset.modelFocus===k));renderIdentityMap();}
function renderIdentityMap(){const d=modelCases[modelFocus];document.getElementById('identityTitle').textContent=d.title;document.getElementById('identitySubtitle').textContent=d.subtitle;
 document.getElementById('identitySources').innerHTML=d.sources.map(x=>flowCard(x[0],x[1],'source')).join('');
 document.getElementById('identityRecords').innerHTML=d.records.map(x=>`<div class="flow-card ${x[3]==='muted'?'muted':''}"><b>${x[0]}</b><small>${x[1]}</small><div class="tagline">${x[2]}</div>${x[3]==='interpretive'?'<div class="confidence">קישור מחקרי — לא שדה S מפורש ברשומת P</div>':''}</div>`).join('');
 document.getElementById('identityClaims').innerHTML=d.claims.map(x=>`<div class="flow-card claim"><b>${x[0]}</b><div class="tagline">${x[1]}</div><div class="confidence"><span>ביטחון:</span> <span>${x[2]}</span></div></div>`).join('');
 document.getElementById('identityS').innerHTML=`<div class="flow-card sfocus"><b>${d.s[1]}</b><small>${d.s[0]}</small><div class="tagline">${d.s[2]}</div><div class="tagline">${d.s[3]}</div></div>`;
 document.getElementById('identityScenarios').innerHTML=d.scenarios.map(x=>`<div class="flow-card scenario"><b>${x[0]}</b><div class="tagline">${x[1]}</div></div>`).join('');
 document.getElementById('identityExplain').innerHTML=d.explain;
 document.getElementById('modelSequence').innerHTML=(modelFocus==='tender'?program:text).map(unitHTML).join('');document.querySelectorAll('#modelSequence [data-unit="tender"],#modelSequence [data-unit="king"]').forEach(e=>e.onclick=()=>setModelFocus(e.dataset.unit));}
document.querySelectorAll('[data-model-focus]').forEach(b=>b.onclick=()=>setModelFocus(b.dataset.modelFocus));
document.getElementById('backToShow').onclick=()=>openExample('stage');


// V10.2 — living knowledge map
const KG={
 zones:[
  {id:'witness',x:18,y:95,w:335,h:520,title:'עדים חומריים ומבנה פנימי',sub:'מה שרד — לפני ההסקה',fill:'#f1f7f9',stroke:'#c8d9de'},
  {id:'inference',x:370,y:95,w:390,h:520,title:'שכבת הראיה והטענה',sub:'בחירה, זיהוי, שיוך, סדר, ביטחון',fill:'#f7f1f7',stroke:'#dccbdf'},
  {id:'reading',x:780,y:95,w:420,h:520,title:'יחידות תיווך וקריאות',sub:'S ותרחישים — לא עד חדש',fill:'#f5f7ef',stroke:'#d5dcc4'},
  {id:'authority',x:165,y:635,w:565,h:105,title:'רשת זהויות חוצה שכבות',sub:'תפקידים ואנשים אינם “סצנות”',fill:'#f8f5ef',stroke:'#ddd3c2'}
 ],
 nodes:[
  {id:'historical',x:855,y:17,w:270,h:58,title:'המופע ההיסטורי שנעלם',sub:'אופק ההסקה — לא רשומה במאגר',kind:'ghost'},
  {id:'A',x:52,y:128,w:130,h:62,title:'הצגה / אוסף',sub:'A228401',kind:'production'},
  {id:'WT',x:40,y:225,w:138,h:66,title:'עד: טקסט',sub:'רצף, גרסאות, מחיקות',kind:'witness'},
  {id:'WP',x:195,y:225,w:138,h:66,title:'עד: תכנייה',sub:'יחידות גרפיות + סדר',kind:'witness'},
  {id:'WO',x:40,y:330,w:138,h:66,title:'עדים נוספים',sub:'מוזיקה · AV · צילום',kind:'witness'},
  {id:'WPR',x:195,y:330,w:138,h:66,title:'עיתונות / אפמרה',sub:'עד חיצוני והקשר',kind:'witness'},
  {id:'TREC',x:40,y:450,w:138,h:66,title:'יחידות בתוך הטקסט',sub:'T · עמוד · R · עריכה',kind:'record'},
  {id:'PREC',x:195,y:450,w:138,h:66,title:'יחידות בתכנייה',sub:'P · PS · מילות שיר',kind:'record'},
  {id:'E1',x:392,y:205,w:150,h:64,title:'ראיה',sub:'פריט/תכונה שנבחרו לטענה',kind:'evidence'},
  {id:'E2',x:570,y:205,w:150,h:64,title:'ראיה נוספת',sub:'יכולה להגיע מעד אחר',kind:'evidence'},
  {id:'CIDENT',x:395,y:330,w:155,h:72,title:'טענת זיהוי / שיוך',sub:'relation + provenance + certainty',kind:'claim'},
  {id:'CORDER',x:572,y:330,w:155,h:72,title:'טענת סדר / גרסה',sub:'יכולה להתחרות בטענה אחרת',kind:'claim'},
  {id:'CALT',x:487,y:450,w:155,h:70,title:'טענה חלופית',sub:'נשמרת גם אם אינה ברירת מחדל',kind:'claimAlt'},
  {id:'S10',x:805,y:230,w:155,h:70,title:'S10 · הטנדר נוסע',sub:'יחידת מופע משוערת',kind:'s'},
  {id:'S12',x:1005,y:230,w:155,h:70,title:'S12 · המלך פיק',sub:'תמיכה טקסטואלית בלבד',kind:'s'},
  {id:'SOTHER',x:905,y:345,w:155,h:70,title:'S9 / S11 / …',sub:'יחידות משוערות נוספות',kind:'s'},
  {id:'SCENP',x:805,y:470,w:168,h:72,title:'תרחיש: לפי התכנייה',sub:'בחירה + גרסה + סדר של S',kind:'scenario'},
  {id:'SCENT',x:995,y:470,w:168,h:72,title:'תרחיש: לפי הטקסט',sub:'קריאה מקבילה, לא “האמת”',kind:'scenario'},
  {id:'ROLE',x:215,y:657,w:145,h:58,title:'תפקיד R',sub:'רפליקה / דמות',kind:'authority'},
  {id:'PERSON',x:390,y:657,w:145,h:58,title:'ישות person',sub:'per013 · authority',kind:'authority'},
  {id:'CREDIT',x:565,y:657,w:145,h:58,title:'יוצר / פרפורמר',sub:'זהות חוזרת בקורפוס',kind:'authority'}
 ],
 edges:[
  {id:'eAwt',a:'A',b:'WT',type:'technical',label:'מכיל עד'}, {id:'eAwp',a:'A',b:'WP',type:'technical',label:'מכיל עד'}, {id:'eAwo',a:'A',b:'WO',type:'technical',label:'מכיל'}, {id:'eAwpr',a:'A',b:'WPR',type:'technical',label:'מכיל/מקשר'},
  {id:'eWtT',a:'WT',b:'TREC',type:'technical',label:'מבנה פנימי'}, {id:'eWpP',a:'WP',b:'PREC',type:'technical',label:'מבנה פנימי'},
  {id:'eTE1',a:'TREC',b:'E1',type:'evidence',label:'משמש ראיה'}, {id:'ePE2',a:'PREC',b:'E2',type:'evidence',label:'משמש ראיה'}, {id:'eOE2',a:'WO',b:'E2',type:'evidence',label:'עשוי לשמש'}, {id:'ePRE1',a:'WPR',b:'E1',type:'evidence',label:'עשוי לחזק'},
  {id:'eE1C',a:'E1',b:'CIDENT',type:'research',label:'תומכת בטענה'}, {id:'eE2C',a:'E2',b:'CIDENT',type:'research',label:'תומכת בטענה'}, {id:'eE1O',a:'E1',b:'CORDER',type:'research',label:'תומכת'}, {id:'eE2O',a:'E2',b:'CORDER',type:'research',label:'תומכת/סותרת'},
  {id:'eCCalt',a:'CORDER',b:'CALT',type:'alternative',label:'חלופה / תחרות'},
  {id:'eCS10',a:'CIDENT',b:'S10',type:'research',label:'טענה על המוקד'}, {id:'eOS10',a:'CORDER',b:'S10',type:'research',label:'גרסה/מיקום'}, {id:'eAltS12',a:'CALT',b:'S12',type:'research',label:'טענה חלופית'},
  {id:'eS10P',a:'S10',b:'SCENP',type:'scenario',label:'נבחר ומסודר'}, {id:'eS10T',a:'S10',b:'SCENT',type:'scenario',label:'נבחר ומסודר'}, {id:'eS12T',a:'S12',b:'SCENT',type:'scenario',label:'נכלל'}, {id:'eSOthP',a:'SOTHER',b:'SCENP',type:'scenario',label:'יחסים סדרתיים'}, {id:'eSOthT',a:'SOTHER',b:'SCENT',type:'scenario',label:'יחסים סדרתיים'},
  {id:'ePghost',a:'SCENP',b:'historical',type:'about',label:'קריאה על'}, {id:'eTghost',a:'SCENT',b:'historical',type:'about',label:'קריאה על'},
  {id:'eTrace1',a:'SCENP',b:'S10',type:'trace',label:'חזרה'}, {id:'eTrace2',a:'S10',b:'CIDENT',type:'trace',label:'חזרה'}, {id:'eTrace3',a:'CIDENT',b:'E1',type:'trace',label:'חזרה'}, {id:'eTrace4',a:'E1',b:'TREC',type:'trace',label:'חזרה'},
  {id:'eTRole',a:'TREC',b:'ROLE',type:'technical',label:'who / R'}, {id:'eRolePerson',a:'ROLE',b:'PERSON',type:'technical',label:'מזהה אדם'}, {id:'ePersonCredit',a:'PERSON',b:'CREDIT',type:'technical',label:'זהות משותפת'}
 ]
};
const KGINFO={
 A:{title:'הצגה / אוסף',what:'מסגרת ארכיונית המאגדת את חומרי התכנית תחת מזהה A.',stored:'גיליון A וה־prefix של מזהי T/P/S/R.',relation:'קשרי containment ושיוך טכניים.',not:'A אינה “המופע שהיה” ואינה קובעת כשלעצמה את סדר היחידות.',example:'A228401 — „כי תצא למלחמה”.'},
 WT:{title:'עד טקסטואלי',what:'מסמך חומרי בעל רצף, גבולות, מחיקות, תוספות וגרסאות פנימיות.',stored:'קובץ המהדורה + T + קידוד TEI.',relation:'מכיל יחידות T, תפקידים וסימני עריכה.',not:'הטקסט אינו סמכות עליונה שממנה נגזרת התכנייה או המוזיקה.',example:'ב„הטנדר נוסע” נשמרה הכותרת אך לא גוף השיר.'},
 WP:{title:'עד: תכנייה',what:'מסמך עצמאי בעל מבנה גרפי ותוכני משלו.',stored:'P ליחידות הגרפיות; PS לפירוק רשימת הסצנות.',relation:'PS מפנה ל־S; יחידת P אחרת יכולה לדרוש זיהוי מחקרי נפרד.',not:'היעדר יחידה ברשימת התכנייה אינו הוכחה שלא בוצעה.',example:'P1.3 מכיל את רשימת הערב; P1.4 מכיל את מילות „הטנדר נוסע”.'},
 WO:{title:'מוזיקה / AV / צילום',what:'עדים מסוג אחר, שאינם נגזרים מן הטקסט.',stored:'רשומות M/AV/תמונות וקבצי המקור.',relation:'יכולים לתמוך בזיהוי S או בהיסטוריה של יצירה.',not:'הקלטה מאוחרת אינה עד ישיר למופע 1939.',example:'הקלטות מאוחרות של „הטנדר נוסע” מקושרות אך מסומנות במעמדן.'},
 WPR:{title:'עיתונות ואפמרה',what:'עדים חיצוניים שיכולים לתאר קבלה, ביצוע או הקשר.',stored:'רפרנסים והערות מחקר, ולעיתים פריטי מקור.',relation:'עשויים לחזק/להחליש טענה אך לא תמיד קיימת להם הפניית S ישירה.',not:'ציטוט עיתונאי אינו “שדה” בתוך הסצנה.',example:'במיפתוח קיימים רפרנסים עיתונאיים לצד מקטעי T.'},
 TREC:{title:'יחידה בתוך עד טקסטואלי',what:'זהות של מקטע כפי שנחתך בתוך העד.',stored:'Txx + xml:id במהדורה/TEI.',relation:'יכול להפנות ל־S, לשאת R, ולהחזיק מידע על העריכה הפנימית.',not:'T אינו S. גבולות טקסטואליים וגבולות היחידה המשוערת אינם חייבים להיות זהים.',example:'T16 הוא שער „הטנדר נוסע” ומקושר ל־S10.'},
 PREC:{title:'יחידה בתוך תכנייה',what:'זהות גרפית או פריט ברשימת הסצנות.',stored:'P1.x ו־PSxx.',relation:'PS→S הוא קישור מפורש; P1.x אחר עשוי להזדקק לטענת זיהוי.',not:'שתי יחידות P באותה תכנייה אינן בהכרח אותה ישות מסדית.',example:'PS10 = „8. הטנדר נוסע”; P1.4 = גוף מילות השיר.'},
 E1:{title:'ראיה',what:'פריט או תכונה מן העד שהמחקר משתמש בהם כדי לבסס טענה מסוימת.',stored:'מומלץ כ־stand-off annotation/record עם pointer למקור.',relation:'ראיה תומכת, סותרת או מגבילה טענה.',not:'ראיה אינה העד כולו, ואינה כבר מסקנה.',example:'עצם הופעת הכותרת „הטנדר נוסע” ב־T16.'},
 E2:{title:'ראיה נוספת',what:'ראיות מאופנויות שונות יכולות להשתתף באותה טענה.',stored:'pointer נפרד לעד ולמיקום.',relation:'ריבוי ראיות מאפשר לבסס טענה בלי לאחד את העדים.',not:'שתי ראיות אינן חייבות להיות שקולות בעוצמתן או בזמן שלהן.',example:'מילות השיר בתכנייה לעומת הקלטה מאוחרת.'},
 CIDENT:{title:'טענת זיהוי / שיוך',what:'החלטה מחקרית שלפיה שתי הופעות או יותר קשורות לאותו מוקד מופעי.',stored:'שכבת claim מוצעת: source/target/relation/confidence/responsibility/provenance.',relation:'יכולה לחבר כמה ראיות ל־S אחד.',not:'אינה foreign key “ניטרלי”; עצם הזיהוי הוא תוכן מחקרי.',example:'T16, PS10 ו־P1.4 מתייחסים ליחידת S10.'},
 CORDER:{title:'טענת סדר / גרסה',what:'טענה על המיקום, הסדר, השייכות לגרסה או היחס הסדרתי בין יחידות.',stored:'claim עם סוג relation מתאים ועם certainty.',relation:'מזינה את בניית התרחיש יותר מאשר את עצם קיום S.',not:'סדר של עד אחד אינו בהכרח סדר המופע בפועל.',example:'בתכנייה „הטנדר” מופיע אחרי קו מז׳ינו; בטקסט מיקומו שונה.'},
 CALT:{title:'טענה חלופית',what:'אפשרות מחקרית שנשמרת גם אם אינה הקריאה המוצגת כברירת מחדל.',stored:'claim נפרד, לא overwrite של הקודם.',relation:'מתחרה או משלימה טענה אחרת.',not:'ריבוי טענות אינו אומר שכל האפשרויות שקולות.',example:'אפשרות לכלול/לא לכלול יחידה לפי בסיס עדויות שונה.'},
 S10:{title:'S — יחידת מופע משוערת',what:'מוקד מחקרי יציב יחסית שמאגד טענות על קטע משוער אחד.',stored:'גיליון S; במודל המורחב — אובייקט מחקרי המקושר לטענות.',relation:'מקבלת תמיכה מכמה טענות ויכולה להשתתף בכמה תרחישים.',not:'S אינה “סצנה שמצאנו”; היא אינה עד ואינה תחליף למקורות.',example:'S10 = „הטנדר נוסע”.'},
 S12:{title:'S עם תמיכה חלקית',what:'S יכולה להתקיים גם כאשר משפחת עד אחת חסרה.',stored:'S + claims שמציינים אילו עדים תומכים ואילו חסרים.',relation:'מונעת הסקה שגויה מהיעדר מסמך להיעדר ביצוע.',not:'אין PS ≠ לא בוצע.',example:'„בחזית המלך פיק” מופיע בטקסט אך לא ברשימת התכנייה.'},
 SOTHER:{title:'יחידות S נוספות',what:'תרחיש עוסק ביחסים בין כמה S, לא ביחידה אחת.',stored:'כמה רשומות S נפרדות.',relation:'נבחרות, מסודרות ומקבלות גרסאות בתוך תרחיש.',not:'S אחת אינה יכולה לייצג לבדה מבנה של מופע שלם.',example:'S9, S10, S11 ברצף התכנייה.'},
 SCENP:{title:'תרחיש / קריאה',what:'אוסף מפורש של טענות על בחירת יחידות, גרסאותיהן והסדר ביניהן.',stored:'שכבה מחקרית מוצעת; לא גיליון קיים באקסל.',relation:'מסדרת כמה S ומצביעה חזרה לטענות שעליהן היא נשענת.',not:'תרחיש אינו טענה אוטומטית שכך התנהל ערב היסטורי מסוים.',example:'קריאה המבוססת על סדר התכנייה.'},
 SCENT:{title:'תרחיש חלופי',what:'קריאה מקבילה יכולה להישען על עד אחר או על סינתזה אחרת.',stored:'scenario נפרד עם provenance.',relation:'נשמר לצד תרחישים אחרים להשוואה.',not:'הממשק לא אמור לתת לאחד מהם סמכות חזותית אוטומטית.',example:'קריאה המבוססת על רצף הטקסט.'},
 historical:{title:'המופע ההיסטורי שנעלם',what:'האובייקט שהמחקר מבקש לדבר עליו אך אינו נגיש ישירות.',stored:'אינו “רשומה סופית” שאליה המערכת מתכנסת.',relation:'תרחישים הם טענות/קריאות עליו, לא העתקים שלו.',not:'אין במודל node שמייצג “האמת הסופית של המופע”.',example:'הממשק שומר כמה קריאות במקום לשחזר ערב אחד באופן סמכותי.'},
 ROLE:{title:'תפקיד R',what:'זהות דרמטית/פרפורמטיבית בתוך יחידה.',stored:'טבלת תפקידים + קוד R במהדורה.',relation:'מקשר רפליקה/יחידה לאדם שגילם את התפקיד.',not:'תפקיד ואדם אינם אותה ישות.',example:'A228401-R3 = זהבה.'},
 PERSON:{title:'ישות אדם',what:'רשומת authority יציבה שחוזרת בין הצגות ותפקידים.',stored:'טבלת ישויות / persons.xml.',relation:'נקשרת לתפקידים, קרדיטים ויצירה.',not:'אדם אינו “שדה טקסט” ואינו תלוי במופע יחיד.',example:'per013 = מרים שינדלר.'},
 CREDIT:{title:'יוצר / פרפורמר',what:'אותה ישות אדם יכולה להשתתף בתפקידים ובקרדיטים רבים.',stored:'קישורי person חוזרים לאורך הקורפוס.',relation:'מאפשר קריאה רוחבית של אנשים לאורך הארכיון.',not:'רשת האנשים חוצה את היררכיית ההצגה.',example:'חיפוש מרים שינדלר לאורך הקורפוס.'}
};
const KGEDGEINFO={
 technical:{title:'קשר תיעודי / מסדי',what:'קשר שמייצג containment, pointer או identity מפורשים במבנה הנתונים.',not:'גם כאשר קיים FK ל־S, המשמעות המחקרית של הקישור עדיין עשויה לדרוש תיעוד.'},
 evidence:{title:'עד → ראיה',what:'בחירה של פרט מן העד כרלוונטי לשאלה מחקרית מסוימת.',not:'העד עצמו אינו “כבר ראיה לכל טענה”.'},
 research:{title:'קשר מחקרי',what:'זיהוי, שיוך, סדר, גרסה או טענה אחרת שהחוקר מנסח.',not:'אין להסתירו כחץ טכני; יש לשמור provenance, אחריות וביטחון.'},
 alternative:{title:'חלופה / תחרות',what:'שתי טענות יכולות להתקיים במקביל כאשר החומר אינו מכריע.',not:'חלופה אינה בהכרח שוות־משקל; כל אחת צריכה להראות את בסיס הראיות שלה.'},
 scenario:{title:'S → תרחיש',what:'התרחיש בוחר יחידות S, גרסאות שלהן והיחסים הסדרתיים ביניהן.',not:'בחירה בתרחיש אינה משנה את S או מוחקת קריאות אחרות.'},
 about:{title:'תרחיש → המופע ההיסטורי',what:'התרחיש הוא קריאה אפשרית על המופע הנעדר.',not:'זה אינו יחס של equality או reconstruction-complete.'},
 trace:{title:'עקיבות לאחור',what:'יכולת לחזור מן התוצר המחקרי אל S, הטענה, הראיה והעד.',not:'זהו תנאי של provenance, לא רק קיצור דרך ניווטי.'}
};
function kgNodeColor(kind){return ({ghost:['#fbf8f4','#baa98c'],production:['#f5f1e9','#b8aa92'],witness:['#eef6f8','#9bbdc8'],record:['#ffffff','#b9c7cc'],evidence:['#f6f1f6','#bda9c1'],claim:['#f2e8f3','#9e7ba4'],claimAlt:['#fbf5fb','#b99cbd'],s:['#edf5ec','#9bb495'],scenario:['#fbf1df','#c6a35f'],authority:['#f7f3ec','#c7b99e']})[kind]||['#fff','#bbb']}
function kgEdgeStyle(type){return ({technical:['#7a8790','', 'url(#arrowTech)'],evidence:['#7e9299','4 4','url(#arrowTech)'],research:['#8a668e','7 5','url(#arrowResearch)'],alternative:['#a887ad','2 5','url(#arrowResearch)'],scenario:['#b08338','', 'url(#arrowScenario)'],about:['#b8a990','4 6','url(#arrowScenario)'],trace:['#4f7567','2 5','url(#arrowTrace)']})[type]||['#888','','url(#arrowTech)']}
function kgById(id){return KG.nodes.find(n=>n.id===id)}
function kgAnchor(a,b){const na=kgById(a),nb=kgById(b);if(!na||!nb)return null;let ax=na.x+na.w/2, ay=na.y+na.h/2, bx=nb.x+nb.w/2, by=nb.y+nb.h/2;const dx=bx-ax,dy=by-ay;if(Math.abs(dx)>Math.abs(dy)){ax+=Math.sign(dx)*na.w/2;bx-=Math.sign(dx)*nb.w/2}else{ay+=Math.sign(dy)*na.h/2;by-=Math.sign(dy)*nb.h/2}return [ax,ay,bx,by]}
function kgPath(e){const p=kgAnchor(e.a,e.b);if(!p)return '';const [x1,y1,x2,y2]=p;const dx=x2-x1,dy=y2-y1;if(Math.abs(dx)>Math.abs(dy)){const c=Math.max(36,Math.abs(dx)*.35);return `M ${x1} ${y1} C ${x1+Math.sign(dx)*c} ${y1}, ${x2-Math.sign(dx)*c} ${y2}, ${x2} ${y2}`}else{const c=Math.max(32,Math.abs(dy)*.35);return `M ${x1} ${y1} C ${x1} ${y1+Math.sign(dy)*c}, ${x2} ${y2-Math.sign(dy)*c}, ${x2} ${y2}`}}
function renderKG(){const ns='http://www.w3.org/2000/svg',Z=document.getElementById('kgZones'),E=document.getElementById('kgEdges'),L=document.getElementById('kgEdgeLabels'),N=document.getElementById('kgNodes');if(!Z)return;Z.innerHTML=E.innerHTML=L.innerHTML=N.innerHTML='';
 KG.zones.forEach(z=>{const g=document.createElementNS(ns,'g');g.innerHTML=`<rect class="kg-zone" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="18" fill="${z.fill}" stroke="${z.stroke}"/><text class="kg-zone-label" x="${z.x+18}" y="${z.y+25}">${z.title}</text><text class="kg-zone-sub" x="${z.x+18}" y="${z.y+43}">${z.sub}</text>`;Z.appendChild(g)});
 KG.edges.forEach(e=>{const [stroke,dash,marker]=kgEdgeStyle(e.type),d=kgPath(e);const g=document.createElementNS(ns,'g');g.setAttribute('class','kg-edge-group');g.dataset.edge=e.id;g.innerHTML=`<path class="kg-edge-visible" d="${d}" stroke="${stroke}" stroke-dasharray="${dash}" marker-end="${marker}"/><path class="kg-edge-hit" d="${d}"/>`;g.addEventListener('click',ev=>{ev.stopPropagation();showKGEdge(e.id)});E.appendChild(g);const a=kgById(e.a),b=kgById(e.b);if(e.label && !['eTrace1','eTrace2','eTrace3','eTrace4'].includes(e.id)){const t=document.createElementNS(ns,'text');t.setAttribute('class','kg-edge-label');t.setAttribute('x',(a.x+a.w/2+b.x+b.w/2)/2);t.setAttribute('y',(a.y+a.h/2+b.y+b.h/2)/2-4);t.textContent=e.label;L.appendChild(t)}});
 KG.nodes.forEach(n=>{const [fill,stroke]=kgNodeColor(n.kind),g=document.createElementNS(ns,'g');g.setAttribute('class','kg-node');g.dataset.node=n.id;g.setAttribute('role','button');g.setAttribute('tabindex','0');g.innerHTML=`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="13" fill="${fill}" stroke="${stroke}"/><text class="title" x="${n.x+n.w/2}" y="${n.y+25}" text-anchor="middle" direction="rtl">${n.title}</text><text class="sub" x="${n.x+n.w/2}" y="${n.y+44}" text-anchor="middle" direction="rtl">${n.sub}</text>`;g.addEventListener('click',()=>showKGNode(n.id));g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();showKGNode(n.id)}});N.appendChild(g)});
}
function clearKG(){document.querySelectorAll('.kg-node,.kg-edge-group').forEach(x=>x.classList.remove('active','dimmed'))}
function focusKG(nodes=[],edges=[]){clearKG();const ns=new Set(nodes),es=new Set(edges);document.querySelectorAll('.kg-node').forEach(x=>{if(ns.size&&!ns.has(x.dataset.node))x.classList.add('dimmed');else if(ns.has(x.dataset.node))x.classList.add('active')});document.querySelectorAll('.kg-edge-group').forEach(x=>{if(es.size&&!es.has(x.dataset.edge))x.classList.add('dimmed');else if(es.has(x.dataset.edge))x.classList.add('active')})}
function showKGNode(id){const d=KGINFO[id],n=kgById(id);if(!d)return;focusKG([id],KG.edges.filter(e=>e.a===id||e.b===id).map(e=>e.id));const el=document.getElementById('kgInspector');el.innerHTML=`<div class="kg-inspector-kicker">רכיב במודל</div><h3>${d.title}</h3><p>${d.what}</p><dl><dt>נשמר ב־</dt><dd>${d.stored}</dd><dt>סוג היחס</dt><dd>${d.relation}</dd></dl><div class="warning"><b>מה אסור להסיק:</b> ${d.not}</div><div class="example"><b>דוגמה:</b> ${d.example}</div>`}
function showKGEdge(id){const e=KG.edges.find(x=>x.id===id);if(!e)return;focusKG([e.a,e.b],[id]);const d=KGEDGEINFO[e.type]||KGEDGEINFO.technical,el=document.getElementById('kgInspector');el.innerHTML=`<div class="kg-inspector-kicker">קשר במודל</div><h3>${d.title}</h3><p>${d.what}</p><dl><dt>מ־</dt><dd>${kgById(e.a).title}</dd><dt>אל</dt><dd>${kgById(e.b).title}</dd><dt>הקשר כאן</dt><dd>${e.label||e.type}</dd></dl><div class="warning"><b>מה אסור להסיק:</b> ${d.not}</div>`}
const KGROUTES={tender:{nodes:['WT','WP','WO','TREC','PREC','E1','E2','CIDENT','CORDER','S10'],edges:['eWtT','eWpP','eTE1','ePE2','eOE2','eE1C','eE2C','eCS10','eOS10'],title:'„הטנדר נוסע”: מכמה עדים ליחידה משוערת',body:'הטקסט, רשימת התכנייה, עמוד מילות השיר והחומר המאוחר אינם מתאחדים לרשומה אחת. הם מספקים ראיות שונות; טענות הזיהוי והמעמד שלהן הן שמאפשרות לאגד אותן סביב S10.'},king:{nodes:['WT','WP','TREC','PREC','E1','CALT','S12'],edges:['eWtT','eWpP','eTE1','eCCalt','eAltS12'],title:'„בחזית המלך פיק”: מודל של חסר שאינו מסקנה שלילית',body:'הטקסט מספק יחידה מלאה יחסית, בעוד שברשימת התכנייה אין מקבילה. המודל משמר את הא־סימטריה: S12 יכולה להישען על עד אחד, בלי להפוך “אין בתכנייה” ל“לא בוצע”.'},scenario:{nodes:['TREC','PREC','E1','E2','CIDENT','CORDER','S10','S12','SOTHER','SCENP','SCENT','historical'],edges:['eTE1','ePE2','eE1C','eE2C','eE1O','eE2O','eCS10','eOS10','eS10P','eS10T','eS12T','eSOthP','eSOthT','ePghost','eTghost','eTrace1','eTrace2','eTrace3','eTrace4'],title:'תרחיש: קריאה מסודרת שנשארת הפיכה',body:'התרחיש בוחר כמה S ומסדר אותן. הוא אינו מוחק תרחיש אחר ואינו מזוהה עם המופע ההיסטורי. מסלול העקיבות מחזיר מן התרחיש עד לפריט בעד.'},person:{nodes:['TREC','ROLE','PERSON','CREDIT'],edges:['eTRole','eRolePerson','ePersonCredit'],title:'זהות חוצת־שכבות: רפליקה → תפקיד → אדם',body:'קוד R בתוך המהדורה הוא עוגן לתפקיד. התפקיד מצביע ל־person authority, וכך אותה אישיות יכולה להופיע בתפקידים, קרדיטים והצגות שונות בלי לשכפל זהות.'}};
function showKGRoute(k){if(k==='reset'){clearKG();document.getElementById('kgInspector').innerHTML='<div class="kg-inspector-kicker">לחצו על רכיב או קשר במפה</div><h3>המפה עצמה היא חלק מן ההסבר</h3><p>כל node וכל edge מתארים טענה אחרת על מבנה הידע. בלחיצה יוצגו: מהו הרכיב, היכן הוא נשמר, מה סוג הקשר, מה הוא מאפשר להסיק — ומה אסור להסיק ממנו.</p><div class="kg-inspector-rule"><b>כלל יסוד:</b> קישור טכני במסד אינו בהכרח קשר אפיסטמי “ודאי”.</div>';return}const r=KGROUTES[k];if(!r)return;focusKG(r.nodes,r.edges);document.getElementById('kgInspector').innerHTML=`<div class="kg-inspector-kicker">מסלול מודגם</div><h3>${r.title}</h3><p>${r.body}</p><div class="example">המסלול מדגיש רק את הקשרים הרלוונטיים; יתר המפה נשארת קיימת כדי להראות שהיחידה משתתפת בו־זמנית ברשת רחבה יותר.</div>`}
document.querySelectorAll('[data-kg-route]').forEach(b=>b.addEventListener('click',()=>showKGRoute(b.dataset.kgRoute)));
renderKG();


// V10.2 — essential edition structure inspector
const ED_LAYERS={
 source:{title:'העד החומרי',text:'הסריקה, הדף והסדר הפיזי הם נקודת המוצא. שכבה זו שומרת מה קיים בפועל — כולל כתיבה ביד, מחיקות, סימני הזזה ומיקום על הדף.',limit:'אין להסיק מן המיקום הפיזי לבדו שזה היה הסדר המופעי או הסדר שהעורך התכוון אליו.'},
 transcription:{title:'המהדורה הדיפלומטית',text:'התמלול מייצג את העד, לא מחליף אותו. הוא משמר הבדלים בין טקסט מודפס, כתב־יד, מחיקה, הוראת בימוי, כותרת, תווים וגבולות של יחידות.',limit:'המהדורה אינה “טקסט נקי” ואינה S. היא עדיין ייצוג של עד מסוים.'},
 semantic:{title:'עוגנים ופעולות',text:'כאן הקידוד מקבל זהויות יציבות: T ליחידות טקסט, R לתפקידים, person לישויות; ובמקביל MOVE/TARGET, SWAP ו־ANA מתעדים פעולות עריכה, גרסאות וסטטוסים.',limit:'לא כל קוד הוא אותו סוג של דבר: חלקו identifier וחלקו paradata על פעולת עריכה.'},
 graph:{title:'רשת הידע',text:'העוגנים מאפשרים לקשר את העד אל טבלאות T, תפקידים וישויות, ומשם אל S ואל טענות מחקריות. כאן המהדורה נעשית חלק מרשת חוצת־מסמכים.',limit:'קישור אל S אינו הופך את S לחלק מן העד. כאשר הקישור הוא פרשני, הוא צריך להיות מיוצג כטענה עם provenance וביטחון.'},
 ui:{title:'קריאת המשתמש',text:'הממשק מציג כמה קריאות מאותו בסיס: נוסח נוח, מהדורה מקושרת וקוד המהדורה. הוא יכול להסתיר מורכבות לצורך קריאה, אך לא למחוק אותה מן המודל.',limit:'HTML אינו מקור נתונים עצמאי; הוא תצוגה של הזהויות והקשרים שנשמרו בשכבות שמתחתיו.'}
};
function wireEditionEssential(){
 const box=document.getElementById('editionEssentialInspector'); if(!box)return;
 document.querySelectorAll('[data-ed-layer]').forEach(b=>b.onclick=()=>{
   document.querySelectorAll('[data-ed-layer]').forEach(x=>x.classList.toggle('on',x===b));
   const d=ED_LAYERS[b.dataset.edLayer];
   box.innerHTML=`<b>${d.title}</b><span>${d.text}</span><span style="color:#8a668e"><b>מה לא להסיק:</b> <span>${d.limit}</span></span>`;
 });
}
wireEditionEssential();

// V10.2 — live graph of the actual indexing workbook
const SG={
 zones:[
  {x:20,y:15,w:1000,h:120,title:'רמת ההצגה והמלאי',sub:'זהות ההצגה ומה ידוע שנמצא בתיק',fill:'#f8f4ec',stroke:'#d8cdbb'},
  {x:20,y:150,w:1000,h:355,title:'עדים ורשומות',sub:'גיליונות שמתארים סוגי חומר שונים; אין כאן מקור-על יחיד',fill:'#f5f9fa',stroke:'#cad9de'},
  {x:20,y:520,w:1000,h:245,title:'קישור מחקרי וזהויות',sub:'S, תפקידים ואנשים — והיכן המאמר דורש להוסיף טענה/תרחיש מפורשים',fill:'#f8f7f3',stroke:'#ddd5c8'}],
 nodes:[
  {id:'A',x:425,y:45,w:190,h:62,title:'A — הצגות',sub:'A228401 · כותר · בכורה',kind:'root'},
  {id:'INV',x:700,y:45,w:205,h:62,title:'תכולת תיקים',sub:'מלאי: מחזה / תוכניה / כרזה / עיתונות',kind:'inventory'},
  {id:'T',x:60,y:195,w:180,h:66,title:'T — תכולת מחזה',sub:'T-id · כותרת · S-link',kind:'witness'},
  {id:'PAGE',x:65,y:330,w:170,h:58,title:'מספרי עמודים',sub:'T-id → עמודים / T קודם',kind:'aux'},
  {id:'P',x:285,y:195,w:180,h:66,title:'P — תכולת תוכניה',sub:'P-id · יחידה גרפית · הערה',kind:'witness'},
  {id:'PS',x:290,y:330,w:180,h:66,title:'PS — סצנות תוכניה',sub:'P…PS-id · S-link · סדר',kind:'witness'},
  {id:'M',x:520,y:195,w:170,h:66,title:'M — מוזיקה',sub:'M · T · S · מקור',kind:'witness'},
  {id:'AV',x:735,y:195,w:170,h:66,title:'אודיו / וידאו',sub:'A-id · שם קטע · S-link',kind:'witness'},
  {id:'PHOTO',x:740,y:330,w:170,h:66,title:'תמונות',sub:'A-id · S-link (כאשר ידוע)',kind:'witness'},
  {id:'PRESS',x:520,y:330,w:170,h:66,title:'עיתונות',sub:'שם מחזה · מקור · תאריך',kind:'weak'},
  {id:'S',x:390,y:555,w:220,h:70,title:'S — מבנה סצנות',sub:'יחידת תיווך מחקרית',kind:'s'},
  {id:'ROLE',x:95,y:650,w:210,h:65,title:'תפקידים מקושרים',sub:'S-id · R-id · person-id',kind:'identity'},
  {id:'PERSON',x:95,y:735,w:210,h:55,title:'ישויות',sub:'per-id · Wikidata · VIAF',kind:'identity'},
  {id:'CLAIM',x:665,y:550,w:220,h:72,title:'טענה מחקרית',sub:'שכבה נדרשת: relation + provenance + confidence',kind:'research'},
  {id:'SCEN',x:665,y:665,w:220,h:66,title:'תרחיש',sub:'בחירת S · גרסה · סדר',kind:'research'}
 ],
 edges:[
  {id:'a_inv',a:'A',b:'INV',type:'explicit',label:'ID הצגה'},
  {id:'a_t',a:'A',b:'T',type:'derived',label:'prefix / שם מחזה'},
  {id:'a_p',a:'A',b:'P',type:'explicit',label:'P.ID'},
  {id:'a_av',a:'A',b:'AV',type:'explicit',label:'מספר הצגה'},
  {id:'a_photo',a:'A',b:'PHOTO',type:'explicit',label:'מספר הצגה'},
  {id:'a_press',a:'A',b:'PRESS',type:'partial',label:'שם מחזה — לא ID יציב'},
  {id:'page_t',a:'PAGE',b:'T',type:'explicit',label:'מספר מקטע טקסט'},
  {id:'t_s',a:'T',b:'S',type:'explicit',label:'קישור למספר -S'},
  {id:'p_ps',a:'P',b:'PS',type:'derived',label:'PS-id כולל P-id'},
  {id:'ps_s',a:'PS',b:'S',type:'explicit',label:'הפניה לטבלת S'},
  {id:'p_s',a:'P',b:'S',type:'partial',label:'„קישור ליחידה אומנותית” — לא עקבי'},
  {id:'m_t',a:'M',b:'T',type:'explicit',label:'T-מספר מקטע'},
  {id:'m_s',a:'M',b:'S',type:'explicit',label:'S'},
  {id:'av_s',a:'AV',b:'S',type:'explicit',label:'קישור למספר S'},
  {id:'photo_s',a:'PHOTO',b:'S',type:'explicit',label:'קישור למספר S — אופציונלי'},
  {id:'role_s',a:'ROLE',b:'S',type:'explicit',label:'קוד סצינה'},
  {id:'role_person',a:'ROLE',b:'PERSON',type:'explicit',label:'קוד שחקנ.ית'},
  {id:'p_claim',a:'P',b:'CLAIM',type:'research',label:'כאשר שיוך ל-S דורש זיהוי'},
  {id:'claim_s',a:'CLAIM',b:'S',type:'research',label:'טענה על זיהוי / שיוך / סדר'},
  {id:'s_scen',a:'S',b:'SCEN',type:'research',label:'בחירה + סדר + גרסה'}
 ]
};
const SGINFO={
 A:{title:'A — הצגות',stored:'גיליון „A - הצגות”',what:'רשומת ההצגה מספקת זהות ברמת התכנית/ההצגה: ID, כותר, תאריך בכורה, במאי ועוד.',limit:'A אינה מכילה את מבנה המופע ואינה קובעת אילו יחידות בוצעו.'},
 INV:{title:'תכולת תיקים',stored:'גיליון „תכולת תיקים”',what:'רמת inventory: אילו סוגי חומרים וכמה פריטים/עמודים נשמרו עבור הצגה.',limit:'עצם קיומו של חומר בתיק אינו מקשר אותו ל-S מסוים.'},
 T:{title:'T — תכולת מחזה',stored:'גיליון „T - תכולת מחזה”',what:'מקטעי הטקסט מקבלים T-id. יש שדה מפורש „קישור למספר -S”, לצד מידע על ז׳אנר, דמויות, תימות ועוד.',limit:'T הוא יחידה בתוך עד טקסטואלי; הוא אינו S ואינו בהכרח יחידה שבוצעה כפי שהיא.'},
 PAGE:{title:'מספרי עמודים',stored:'גיליון „מספרי עמודים”',what:'ממפה T אל עמודים בחומר הדיגיטלי/חומר החוקר ויכול לשמר רצף באמצעות „T קודם”.',limit:'עמוד הוא מיקום חומרי, לא טענה על סדר מופעי.'},
 P:{title:'P — תכולת תוכניה',stored:'גיליון „P - תכולת תוכניה”',what:'כל יחידה גרפית בתכנייה מקבלת P-id: שער, פרסומת, רשימת סצנות, שיר מודפס וכדומה.',limit:'P אינו בהכרח יחידת מופע. במקרה P1.4 „מילות הטנדר נוסע”, הקישור ל-S10 אינו מאוכלס כשדה מפורש.'},
 PS:{title:'PS — תכולת סצנות תוכניה',stored:'גיליון „PS - תכולת סצנות תוכניה”',what:'מפרק את יחידת רשימת הסצנות שבתכנייה לרשומות סצנה. קיים שדה מפורש „הפניה לטבלת S”.',limit:'PS הוא קריאה של מבנה התכנייה; הוא אינו הוכחה שסדר זה התקיים בכל ערב.'},
 M:{title:'M — מוזיקה',stored:'גיליון „M-מוזיקה”',what:'הגיליון כולל מזהה M ושדות מפורשים ל-T ול-S. הוא מאפשר לקשור פריט מוזיקלי לטקסט וליחידת S כאשר יש בסיס לכך.',limit:'אין כרגע רשומת M ל„הטנדר נוסע” ב„כי תצא למלחמה”; לכן אין לצייר קשר מוזיקלי קונקרטי במקרה זה.'},
 AV:{title:'אודיו ווידאו',stored:'גיליון „אודיו ווידאו”',what:'כולל „מספר הצגה” ו„קישור למספר S”. במקרה „הטנדר נוסע” יש רשומות מאוחרות המקושרות ל-S10.',limit:'הקלטה מאוחרת היא עד לגלגול/ביצוע מאוחר, לא תיעוד ישיר של ערב 1939.'},
 PHOTO:{title:'תמונות',stored:'גיליון „תכולת תיק - תמונה”',what:'יכול לקשר תמונה ל-A ול-S כאשר זיהוי הסצנה ידוע. בחלק מן הרשומות S חסר.',limit:'דיוקן או צילום ללא S אינו צריך לקבל שיוך מלאכותי.'},
 PRESS:{title:'עיתונות',stored:'גיליון „תכולת תיק - עיתונות”',what:'רשומות עיתונות נשמרות עם שם מחזה, תאריך, מקור וקישורים. במבנה הנוכחי אין שדה S נורמטיבי.',limit:'שם מחזה הוא שיוך ברמת ההצגה; קישור ביקורת ליחידה מסוימת דורש טענה מחקרית נוספת.'},
 S:{title:'S — מבנה סצנות',stored:'גיליון „S - מבנה סצנות”',what:'S היא היחידה שבה המחקר מרכז זיהויים בין עדים סביב מוקד מופעי משוער. השדה „שם [על פי החוקר]” כבר מסמן את מעמדה המחקרי.',limit:'S אינה פריט ארכיוני ואינה „הסצנה כפי שהייתה”.'},
 ROLE:{title:'תפקידים מקושרים בהצגה',stored:'גיליון בעל אותו שם',what:'כל רשומה מחזיקה קוד סצינה (S), מזהה תפקיד R, דמות, שם שחקנ.ית וקוד שחקנ.ית.',limit:'תפקיד ואדם הם זהויות שונות; אותו אדם יכול לגלם תפקידים רבים.'},
 PERSON:{title:'ישויות / אנשים',stored:'גיליון „ישויות”',what:'Authority layer לאנשים עם per-id ומזהים חיצוניים כגון Wikidata/VIAF כאשר קיימים.',limit:'person-id מזהה אדם, לא תפקיד ולא הופעה מסוימת.'},
 CLAIM:{title:'טענה מחקרית',stored:'אינה כיום גיליון עצמאי באקסל',what:'השכבה שהמאמר דורש כדי שקישור פרשני ישמור source, target, relation, confidence, responsibility ואלטרנטיבה.',limit:'אין להציג אותה כאילו כבר קיימת במיפתוח הנוכחי.'},
 SCEN:{title:'תרחיש',stored:'שכבה מחקרית מוצעת',what:'אוסף מפורש של בחירת יחידות S, גרסאותיהן והיחסים הסדרתיים ביניהן.',limit:'תרחיש אינו שחזור אוטומטי של ערב היסטורי מסוים.'}
};
const SGEDGE={
 explicit:{title:'קישור מפורש בשדה',what:'בשתי הטבלאות קיים ערך מזהה שנועד לקשר רשומה לרשומה אחרת. עדיין יש להבחין בין תקינות מסדית לבין משמעות היסטורית.',limit:'foreign key אינו הופך את שתי הרשומות לאותה ישות.'},
 derived:{title:'קשר שנגזר ממבנה המזהה',what:'הקשר ניתן לשחזור מן ID או מן convention של המיפתוח, אך אינו בהכרח נשמר בשדה נפרד בכל רשומה.',limit:'קשר נגזר צריך להיות מתועד ככלל מערכת, ולא להיראות כאילו הוא שדה שקיים בפועל.'},
 partial:{title:'קשר חלקי / לא עקבי',what:'יש שדה או שיוך לשוני, אך הוא אינו מאוכלס או מנורמל בעקביות בכל הקורפוס.',limit:'אין לבנות עליו join אוטומטי ללא בדיקה או normalization.'},
 research:{title:'קשר מחקרי',what:'הקשר מבטא זיהוי, שיוך, בחירת גרסה או סדר. לפי המאמר, הקשר עצמו הוא מידע שצריך provenance ורמת ודאות.',limit:'אסור להסתיר טענה מחקרית בתוך חץ שנראה כמו FK ניטרלי.'}
};
function sgNode(id){return SG.nodes.find(n=>n.id===id)}
function sgColors(k){return ({root:['#f7f2e9','#b7a789'],inventory:['#fbf7ee','#caba9f'],witness:['#eef6f8','#9dbbc5'],aux:['#f8faf9','#becbc7'],weak:['#faf7f2','#c7b9a7'],s:['#edf5ec','#96ad91'],identity:['#f2f5f4','#a8b9b4'],research:['#f4edf5','#a986ae']})[k]||['#fff','#bbb']}
function sgStyle(t){return ({explicit:['#657b84','', 'url(#sgArrow)'],derived:['#9a7c55','7 5','url(#sgArrowDerived)'],partial:['#a66e56','2 5','url(#sgArrowDerived)'],research:['#8b668f','7 5','url(#sgArrowResearch)']})[t]||['#777','','url(#sgArrow)']}
function sgAnchor(a,b){const A=sgNode(a),B=sgNode(b);let ax=A.x+A.w/2,ay=A.y+A.h/2,bx=B.x+B.w/2,by=B.y+B.h/2,dx=bx-ax,dy=by-ay;if(Math.abs(dx)>Math.abs(dy)){ax+=Math.sign(dx)*A.w/2;bx-=Math.sign(dx)*B.w/2}else{ay+=Math.sign(dy)*A.h/2;by-=Math.sign(dy)*B.h/2}return [ax,ay,bx,by]}
function sgPath(e){const [x1,y1,x2,y2]=sgAnchor(e.a,e.b),dx=x2-x1,dy=y2-y1;if(Math.abs(dx)>Math.abs(dy)){const c=Math.max(30,Math.abs(dx)*.3);return `M ${x1} ${y1} C ${x1+Math.sign(dx)*c} ${y1}, ${x2-Math.sign(dx)*c} ${y2}, ${x2} ${y2}`}const c=Math.max(30,Math.abs(dy)*.3);return `M ${x1} ${y1} C ${x1} ${y1+Math.sign(dy)*c}, ${x2} ${y2-Math.sign(dy)*c}, ${x2} ${y2}`}
function renderSG(){const ns='http://www.w3.org/2000/svg',z=document.getElementById('sgZones'),eg=document.getElementById('sgEdges'),lg=document.getElementById('sgLabels'),ng=document.getElementById('sgNodes');if(!z)return;[z,eg,lg,ng].forEach(x=>x.innerHTML='');SG.zones.forEach(q=>{const g=document.createElementNS(ns,'g');g.innerHTML=`<rect class="sg-zone" x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="18" fill="${q.fill}" stroke="${q.stroke}"/><text class="sg-zone-label" x="${q.x+18}" y="${q.y+24}">${q.title}</text><text class="sg-zone-sub" x="${q.x+18}" y="${q.y+42}">${q.sub}</text>`;z.appendChild(g)});SG.edges.forEach(e=>{const [stroke,dash,marker]=sgStyle(e.type),d=sgPath(e),g=document.createElementNS(ns,'g');g.setAttribute('class','sg-edge-group');g.dataset.edge=e.id;g.innerHTML=`<path class="sg-edge-visible" d="${d}" stroke="${stroke}" stroke-dasharray="${dash}" marker-end="${marker}"/><path class="sg-edge-hit" d="${d}"/>`;g.addEventListener('click',ev=>{ev.stopPropagation();showSGEdge(e.id)});eg.appendChild(g);const A=sgNode(e.a),B=sgNode(e.b),t=document.createElementNS(ns,'text');t.setAttribute('class','sg-edge-label');t.setAttribute('x',(A.x+A.w/2+B.x+B.w/2)/2);t.setAttribute('y',(A.y+A.h/2+B.y+B.h/2)/2-5);t.textContent=e.label;lg.appendChild(t)});SG.nodes.forEach(n=>{const [fill,stroke]=sgColors(n.kind),g=document.createElementNS(ns,'g');g.setAttribute('class','sg-node');g.dataset.node=n.id;g.setAttribute('tabindex','0');g.innerHTML=`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="13" fill="${fill}" stroke="${stroke}"/><text class="title" x="${n.x+n.w/2}" y="${n.y+25}" text-anchor="middle" direction="rtl">${n.title}</text><text class="sub" x="${n.x+n.w/2}" y="${n.y+45}" text-anchor="middle" direction="rtl">${n.sub}</text>`;g.addEventListener('click',()=>showSGNode(n.id));g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();showSGNode(n.id)}});ng.appendChild(g)})}
function focusSG(nodes=[],edges=[]){const ns=new Set(nodes),es=new Set(edges);document.querySelectorAll('.sg-node').forEach(x=>{x.classList.toggle('active',ns.has(x.dataset.node));x.classList.toggle('dimmed',ns.size&&!ns.has(x.dataset.node))});document.querySelectorAll('.sg-edge-group').forEach(x=>{x.classList.toggle('active',es.has(x.dataset.edge));x.classList.toggle('dimmed',es.size&&!es.has(x.dataset.edge))})}
function showSGNode(id){const d=SGINFO[id];focusSG([id],SG.edges.filter(e=>e.a===id||e.b===id).map(e=>e.id));document.getElementById('sheetGraphInspector').innerHTML=`<div class="kg-inspector-kicker">טבלה / שכבה</div><h3>${d.title}</h3><p>${d.what}</p><dl><dt>נשמר ב־</dt><dd>${d.stored}</dd></dl><div class="sg-warning"><b>מה לא להסיק:</b> ${d.limit}</div>`}
function showSGEdge(id){const e=SG.edges.find(x=>x.id===id),d=SGEDGE[e.type];focusSG([e.a,e.b],[id]);document.getElementById('sheetGraphInspector').innerHTML=`<div class="kg-inspector-kicker">קשר בין טבלאות</div><h3>${d.title}</h3><p>${d.what}</p><dl><dt>מ־</dt><dd>${sgNode(e.a).title}</dd><dt>אל</dt><dd>${sgNode(e.b).title}</dd><dt>בפועל</dt><dd>${e.label}</dd></dl><div class="sg-warning"><b>מה לא להסיק:</b> ${d.limit}</div>`}
const SGROUTES={
 all:{nodes:[],edges:[],title:'מה באמת מקושר למה?',body:'הגרף מבדיל בין שדות מפורשים, convention של מזהים, קישורים חלקיים וטענות מחקריות.'},
 tender:{nodes:['A','T','P','PS','AV','S','CLAIM'],edges:['a_t','a_p','a_av','t_s','p_ps','ps_s','av_s','p_claim','claim_s'],title:'„הטנדר נוסע”',body:'T16 → S10, PS10 → S10 ו-AV → S10 הם קישורים מפורשים. P1.4 (מילות השיר) אינו מקושר בשדה מפורש ל-S10 ולכן זקוק לטענת זיהוי.'},
 person:{nodes:['T','S','ROLE','PERSON'],edges:['t_s','role_s','role_person'],title:'תפקיד → אדם',body:'T מתקשר ל-S; קוד R במהדורה נפתח לרשומת התפקיד, המחזיקה S-id ו-person-id. כך נשמר ההבדל בין יחידת טקסט, תפקיד ואדם.'},
 media:{nodes:['M','AV','PHOTO','S','T'],edges:['m_t','m_s','av_s','photo_s'],title:'חומר נוסף → S',body:'מוזיקה, AV ותמונות יכולים להתחבר ל-S. אבל הקישור קיים רק כאשר השדה מאוכלס; אין להניח שכל פריט חומרי כבר זוהה עם יחידת מופע.'},
 uncertain:{nodes:['P','PS','PRESS','CLAIM','S'],edges:['p_ps','p_s','a_press','p_claim','claim_s'],title:'קשרים שאינם FK פשוט',body:'PS נגזר מיחידת P גם דרך מבנה המזהה; P→S אינו מאוכלס בעקביות; עיתונות קשורה ברמת שם המחזה; וזיהויים פרשניים צריכים לעבור דרך טענה מפורשת.'}
};
function routeSG(k){document.querySelectorAll('[data-sg-route]').forEach(b=>b.classList.toggle('on',b.dataset.sgRoute===k));const r=SGROUTES[k];focusSG(r.nodes,r.edges);document.getElementById('sheetGraphInspector').innerHTML=`<div class="kg-inspector-kicker">מסלול מודגם</div><h3>${r.title}</h3><p>${r.body}</p>${k==='all'?'<div class="sg-rule"><b>לחצו עכשיו על node או edge</b> כדי לראות את השדה ואת מגבלת ההסקה שלו.</div>':''}`}
document.querySelectorAll('[data-sg-route]').forEach(b=>b.addEventListener('click',()=>routeSG(b.dataset.sgRoute)));renderSG();

renderIdentityMap();
};
