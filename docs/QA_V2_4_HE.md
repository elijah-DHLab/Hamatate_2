# בדיקות גרסה 2.4

## תוצאה

- **55 בדיקות דפדפן עברו.**
- **14 בדיקות ספקי טעינה וחישובים עברו.**
- **30 בדיקות שלמות מקורות, עוגנים, תלות בקבצים וסכמת JSON עברו.**
- לא נרשמו שגיאות JavaScript לא־מטופלות בריצת הדפדפן.

## שיטת הבדיקה

הגרסה העצמאית נבנתה מקובצי ההפצה ונטענה באמצעות `Playwright set_content` בדפדפן Chromium. הבדיקות כללו מסך מחשב 1500×1050 ומסך צר 390×844, פעולה עם תנועה מופחתת, בחירה מרובה, קפיצות אל פסקאות, שינויים בתצוגה והורדות SVG/JSON.

אלו בדיקות תוכנה ומשימות, לא מחקר שימושיות עם חוקרים אנושיים. בדיקת פרסום ממשית ב־GitHub Pages ובדיקת API חיצוני חי **לא בוצעו**. סביבת הדפדפן מגבילה ניווט ישיר לקובצי file/לשרת מקומי; לכן אין תיאור של טעינה כזו כבדיקה שעברה. הנתיבים היחסיים, המניפסט ומיקום index/.nojekyll נבדקו בתיקיית ההפצה.

בדיקות ספק ה־API משתמשות בתגובות מבוקרות ובחלוקה לעמודים של אותו נתון אמיתי. הן בודקות את החוזה ואת הטיפול בשגיאות, לא תוצאות מחקר ממקור API חדש.

## תיקוני באגים שנמצאו

1. עטיפת `jump` ישנה איבדה את פרמטר מספר הפסקה. היא שמרה רק את ה־T, ולכן חלק מהקישורים נחתו בראש היחידה. כעת נשמרים שני הפרמטרים ונבדק שהפסקה עצמה נמצאת מתחת לניווט הקבוע ובתחום המסך.
2. סרגל V2 כפול הוחזר על ידי מעטפת render ישנה. כעת הוא מוסר בקריאה ובגרף החדש בלבד; שאר הכלים נשמרים.
3. רשימה של מילים נבחרות נפתחה מחדש/נסגרה בעת רינדור. מצב הפתיחה נשמר והתחלה נקייה נשארת סגורה.
4. מילה ממוקדת שלא נמצאה בין הכותרות הראשונות בגרף עלולה להיעלם. כעת מילים ממוקדות ונבחרות מקבלות קדימות.
5. מיקום תוויות SVG והכיווניות תוקנו לאחר בדיקה חזותית. תוויות הקשר מסומנות במקווקו.
6. החלפת ספק נתונים מנקה את האינדקס הנגזר הקודם; אין שימוש שקט בקטגוריות שהוסרו.

## תוצאות מפורטות

### דפדפן

| בדיקה | תוצאה |
|---|---|
| Embedded provider loaded with exact source hash | PASS |
| Archive default shows only available edition | PASS |
| Institutional branding lives in header not footer | PASS |
| 529 source footnotes and 401 classification assignments | PASS |
| Tradition and consumption exact labels retained | PASS |
| Unknown note 472 remains flagged | PASS |
| Distant reading opens immediately on graph | PASS |
| Three source networks selected; words initially collapsed | PASS |
| No duplicate V2 global dock in graph view | PASS |
| Disclosure arrow opens word list | PASS |
| Deselecting a word retains parent as partial selection | PASS |
| Words and edges appear without clearing other networks | PASS |
| Context nodes visually distinguished from explicit subjects | PASS |
| Coverage uses distinct source paragraphs | PASS |
| Focused word always included even with word limit | PASS |
| Graph zoom | PASS |
| Node drag alters view positions not data | PASS |
| Unit selection accumulates | PASS |
| Other units remain visible as context | PASS |
| Flow view renders multiple networks | PASS |
| Program order changes order, preserves selection | PASS |
| Title grouping excludes T16 and keeps all underlying sources | PASS |
| Text surface includes actual paragraphs | PASS |
| No invented edges when selected categories have no joint note | PASS |
| Overlap view renders actual category co-membership | PASS |
| All source and query networks can coexist | PASS |
| Clear selection gives explained empty state | PASS |
| Reading entry compact and initially collapsed | PASS |
| No slide metaphor in reading controls | PASS |
| Source word marks and note anchor marks on text | PASS |
| Speakers colored and linked to role records | PASS |
| Networks and writing enabled together | PASS |
| Network toggle removes only network highlighting | PASS |
| Evidence opens full original note and location | PASS |
| Jump returns to marked source without losing networks | PASS |
| Jump lands at exact paragraph below sticky navigation | PASS |
| Stale annotation source rejected by UI guard | PASS |
| Wrong quotation range rejected by UI guard | PASS |
| Previous on first navigation lands at last hit | PASS |
| Footnote labels act as links to knowledge bodies | PASS |
| Adding body from note retains existing selections | PASS |
| Footnotes independently hide | PASS |
| Original source/program comparison retained | PASS |
| Original edition code mode retained | PASS |
| Role to historical actor link retained | PASS |
| Original actor graph still reachable | PASS |
| Materials view retained | PASS |
| About placeholders remain unfilled | PASS |
| General knowledge model in About retained | PASS |
| Data checks still reachable | PASS |
| SVG export produces actual diagram file | PASS |
| Evidence export carries source hash | PASS |
| Mobile page no horizontal body overflow | PASS |
| Mobile graph foregrounded before selector | PASS |
| No uncaught JavaScript errors in interaction run | PASS |

### ספקי טעינה וחישובים

| בדיקה | תוצאה |
|---|---|
| normalized payload validates | PASS |
| wrong production rejected | PASS |
| duplicate observations rejected | PASS |
| dangling category rejected | PASS |
| embedded provider unchanged source hash | PASS |
| static provider keeps repository subdirectory | PASS |
| static provider caches without changing payload | PASS |
| API pagination assembles 401 observations | PASS |
| API mixed source revisions rejected | PASS |
| API cross-origin pagination rejected | PASS |
| API repeating pagination rejected | PASS |
| HTTP errors visible no silent fallback | PASS |
| coverage deduplicates repeated notes in same paragraph | PASS |
| note co-membership distinct from paragraph proximity | PASS |

### נתונים וקבצים

| בדיקה | תוצאה |
|---|---|
| Immutable source: productions/A228401/data/edition.json | PASS |
| Immutable source: productions/A228401/sources/ki_tetze_23_9_26.xml | PASS |
| Immutable source: productions/A228401/data/content_networks.json | PASS |
| Immutable source: corpus/data/corpus_index.json | PASS |
| Local dependency: assets/css/site.css | PASS |
| Local dependency: assets/css/stage.css | PASS |
| Local dependency: assets/css/content.css | PASS |
| Local dependency: assets/css/v2.css | PASS |
| Local dependency: assets/css/v21.css | PASS |
| Local dependency: assets/css/v22.css | PASS |
| Local dependency: assets/css/knowledge.css | PASS |
| Local dependency: productions/A228401/data/data-runtime.js | PASS |
| Local dependency: productions/A228401/data/content-runtime.js | PASS |
| Local dependency: assets/js/content.js | PASS |
| Local dependency: assets/js/stage.js | PASS |
| Local dependency: assets/js/app.js | PASS |
| Local dependency: assets/js/v2.js | PASS |
| Local dependency: corpus/data/corpus-runtime.js | PASS |
| Local dependency: assets/js/v21.js | PASS |
| Local dependency: assets/js/v22.js | PASS |
| Local dependency: productions/A228401/data/knowledge-runtime.js | PASS |
| Local dependency: assets/js/knowledge-core.js | PASS |
| Local dependency: assets/js/knowledge-ui.js | PASS |
| GitHub root index + nojekyll | PASS |
| All note texts preserved | PASS |
| Every source range or footnote anchor resolves | PASS |
| 401 assignments to 367 distinct notes | PASS |
| 12 exact labels not forced into old eight | PASS |
| 529 XML footnotes independently verified | PASS |
| Knowledge payload validates against included JSON Schema (2020-12) | PASS |

## מגבלות שנותרו

- הטקסט והאקסל המקוריים לא נערכו. סימונים לא חד־משמעיים נשארים לבירור.
- „הקשר ההפניה” אינו טווח תיוג מאומת ואינו מושג מאושר; אין לצבוע אותו כממצא סמנטי מדויק.
- כללי החיפוש המילולי אינם מסווגי שפה או הבנה סמנטית.
- לא אומתה תקינות חזותית בכל גודל מסך ובכל דפדפן.
- הלוגואים המוסדיים עדיין מבוססים על כתובות חיצוניות מן ההפצה הקודמת; בעת חסימתן מוצג כיתוב חלופי. לא הומצאו לוגואים חדשים.
- ספק API לחלק החדש אינו הופך את מנוע הטקסט הוותיק לגנרי לכל A; הרחבה זו דורשת פיתוח נוסף כפי שמתועד בחוזה.

ההפצה כוללת תיעוד נוכחי בלבד, ללא תוצאות בדיקה או תמונות מגרסאות קודמות.
