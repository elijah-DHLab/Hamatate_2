/* V2.6: reversible, presentation-only UI localization. Source edition and
   tagged proper names remain Hebrew. Works with app's dynamically rendered DOM. */
(function(){
'use strict';
const PAIRS=[
['המטאטא','HaMatate'],['הצגות, חומרים ומהדורות דיגיטליות','Performances, sources & digital editions'],
['ארכיון ההצגות','Performance archive'],['מחקר הקורפוס','Corpus research'],['אודות','About'],
['קריאת ההצגה','Read the play'],['החומרים והעדים','Sources & witnesses'],['מפת ההצגה','Performance map'],
['קריאה מרחוק · רשתות','Distant reading · networks'],['נתונים ובדיקות','Data & quality'],
['המטאטא · ארכיון במהדורה דיגיטלית','HaMatate · digital theatre archive'],
['הצגה, טקסט, מקורות ורשתות ידע. כל קשר מחקרי נשאר פתוח לבדיקה.','Performances, texts, historical sources and knowledge networks. Every scholarly connection remains open to examination.'],
['הארכיון','The archive'],['מפת הידע','Knowledge model'],['מרחבי האתר','Site sections'],['כלי המחקר של ההצגה','Research tools for this play'],
['לוגואים מוסדיים','Institutional logos'],['אל ארכיון המטאטא','Go to HaMatate archive'],['סגירת חלון','Close dialog'],['דילוג לתוכן','Skip to content'],['טוען את המהדורה…','Loading the edition…'],
['הַמַּטְאֲטֵא · ארכיון התיאטרון הסאטירי','HaMatate · archive of satirical theatre'],
['כל הצגה.','Every performance.'],['עולם של עדויות.','A world of historical evidence.'],
['דפדפו בתכניות המטאטא שנרשמו במיפתוח. היכנסו למהדורה, קראו את הטקסט, פתחו את חומרי המקור — ומשם עברו אל השכבות, המפות והקשרים. כרגע מהדורה אחת זמינה לקריאה מלאה; האחרות מוצגות מתוך נתוני הקטלוג, בלי לייצר להן טקסט שאינו קיים באתר.','Explore the catalogued HaMatate performances. Open an edition, read its text, explore historical sources, then move to annotations, maps and networks. One complete edition is currently available; the other performances are shown as catalog records only.'],
['גלו את מפת הקורפוס','Explore the corpus map'],['הצגות בגיליון A','performances in catalog A'],['מהדורה מלאה באתר','complete edition available'],
['הצגות זמינות','Available editions'],['כלל ההצגות','All performances'],['הצגות נוספות','Other performances'],['כל ההצגות','All performances'],['זמין לקריאה','Available to read'],
['חפשו הצגה…','Search performances…'],['חיפוש הצגה','Search performances'],['לפי שנה','By year'],['כל השנים','All years'],['הצגות','Performances'],['מהדורות זמינות','Available editions'],
['מהדורה דיגיטלית מלאה עדיין אינה זמינה להצגה זו באתר.','A complete digital edition of this performance is not yet available.'],
['בחזרה לכל ההצגות','Back to all performances'],['ראו את ההצגה במפת הקורפוס','View in corpus map'],['מה מתועד במיפתוח?','What does the catalog contain?'],
['מקטעי טקסט','Text units'],['יחידות S','S units'],['יחידות תכנייה','Program entries'],['רשומות מוזיקה','Music records'],['רשומות שמע/וידאו','Audio/video records'],['רשומות תפקיד','Role records'],['אנשים מקושרים','Identified people'],
['מלאי חומרים','Materials inventory'],['תפקידים ואנשים במיפתוח','Roles and people in the catalog'],['תאריך בכורה לפי המקור:','Premiere date (source):'],['במאי:','Director:'],
['קודם קוראים. אחר כך חוקרים.','Read first. Then explore.'],['מרחב ההצגה · תכנית נ״א · 1939','Performance workspace · Program LI · 1939'],
['הטקסט הוא נקודת הכניסה; התכנייה, קישורי השמע ושאר החומרים הם עדים עצמאיים. אפשר לעבור מהם אל המפה, אל השוואת הסדרים ואל שכבות המחקר, ולחזור לקריאה.','Begin with the script; the program, sound recordings and other materials are independent witnesses. Explore maps, sequence comparison and scholarly annotations, and return to reading whenever you like.'],
['השוו את סדר הטקסט והתכנייה ↔','Compare script and program order ↔'],['החומרים של ההצגה','Materials for this performance'],
['הבחנה בין קובץ זמין · קישור חיצוני · פריט שנרשם במלאי','Available file · external link · catalogued item'],
['הטקסט','Script'],['התכנייה','Program'],['שמע ווידאו','Audio & video'],['מוזיקה ותווים','Music & notation'],['כרזות','Posters'],['עיתונות','Press'],['תצלומים','Photographs'],
['לקריאה עכשיו','Read now'],['מקור חזותי','Image source'],['חומרים מקושרים','Linked materials'],['ראו את הראיות בטקסט','View evidence in text'],['הקבצים טרם זמינים','Files not yet available'],['הפריטים אינם מוטמעים','Items not embedded'],['בהמשך','Coming later'],['לא סופקו קבצים','No files supplied'],
['לקרוא את ההצגה, ולראות ממה הקריאה בנויה. הטקסט, התכנייה והערות המחקר נשארים נפרדים — הקשרים מאפשרים לעבור ביניהם בלי למחוק את ההבדלים.','Read the play and see how its scholarly edition is structured. Script, program and editorial notes remain distinct witnesses, even as the interface connects them.'],
['סדר הטקסט','Script order'],['לפי התכנייה','Program order'],['השוואת רצפים','Compare sequences'],['קריאה','Reading'],['שכבות העריכה','Editorial layers'],['קוד המהדורה','Edition code'],['חיפוש בטקסט ובהערות…','Search script and notes…'],['חיפוש בטקסט ובהערות','Search script and notes'],
['שכבות ה־XML:','XML layers:'],['הכול','All'],['מפתח הסימנים','Notation key'],['פעולות הזזה','Move operations'],['אפשרויות קריאה ועריכה','Reading and editing options'],
['איזו קריאה זו?','What am I reading?'],['על מפתח הסימנים','About the notation'],['כל התפקידים והשחקנים','Cast and characters'],['ניסוי עריכתי','Editorial experiment'],['הפעלת הזזות תקינות','Apply valid moves'],['הסתרת הטקסט המחוק','Hide deleted text'],['בדיקת פעולות העריכה','Inspect editorial operations'],['מן הקריאה למחקר','From reading to research'],['מפת הכיסוי','Coverage map'],['ממצאים ובדיקות','Findings & quality'],
['מפת הרשתות והזרימה','Network map & flows'],['מפת המונחים ↗','Concept map ↗'],['מפת המונחים','Concept map'],['רשתות התוכן','Content networks'],['שכבות הכתיבה','Writing layers'],['דוברים','Speakers'],['הערות שוליים','Footnotes'],['מונחים בהערות','Terms from notes'],
['מחיקה','Deletion'],['כתב יד','Handwriting'],['הוראות בימוי','Stage directions'],['תיקון','Correction'],['שחזור','Reconstruction'],['מוזיקה','Music'],['כותרת','Heading'],['כתב לטיני','Latin script'],
['המחזה · הרשתות · המילים','Play · networks · words'],['הוסיפו רשתות זו לצד זו, חשפו את המילים שמחברות אותן, וחזרו מכל קשר אל ההערה ואל הטקסט.','Layer networks together, reveal their terms and follow any connection back to an editorial note and the original text.'],
['חזרה לקריאה ←','Back to reading ←'],['מפת הקשרים','Network graph'],['זרימה לאורך המחזה','Flows across the play'],['הטקסט כמשטח','Text as a surface'],['חפיפות','Overlaps'],['מונחים ↔ רשתות','Terms ↔ networks'],['מילים על הגרף','Show terms on graph'],['דיוק התצוגה','Display options'],['מדד','Measure'],['כיסוי פסקאות (%)','Paragraph coverage (%)'],['ראיות ייחודיות','Distinct evidence'],['מילים לכל רשת','Terms per network'],
['קיבוץ כותרות T עם תוכנן','Merge heading-only T units'],['ייצוא הראיות JSON','Export evidence (JSON)'],['שמירת התרשים SVG','Download graph (SVG)'],
['רצף התצוגה','Sequence order'],['השוואת שני הסדרים ↗','Compare both orders ↗'],['כל המחזה','Whole play'],['רשתות ושכבות','Networks and layers'],['רשתות','Networks'],['שכבות','Layers'],['יחידות בבחירה','selected units'],['חזרה לכל היחידות','All units'],
['נוכחות בבחירה','Presence in selection'],['אחוז הפסקאות שיש בהן ראיה לשכבה','% of paragraphs with evidence'],['מספר ראיות ייחודיות בשכבה','Number of distinct evidence hits'],['לא מדד לחשיבות היסטורית','not a measure of historical significance'],['בחרו רשת מן הרשימה.','Choose a network from the list.'],
['מן המפה אל המילים וההערות','From the map to words and notes'],['כל נקודה חוזרת לעד','Every point links to a source'],['כל הבחירה','Entire selection'],['לקריאה הרציפה ↗','Read the full text ↗'],['אל המופע בטקסט ←','Jump to occurrence ←'],['הקודמות','Previous'],['הבאות','Next'],['הקודם','Previous'],['הבא','Next'],['הערות','Notes'],['מופעים','Occurrences'],['פסקה','Paragraph'],['סימון מקור','Source marking'],['שכבת מקור','Source layer'],['חיפוש מילולי','Literal search'],['סיווג מפורש בהערה','Explicit note category'],
['כל כלי המחקר הקיימים','Other research tools'],['חיי כל התגים — משטח, זרימה וחפיפות','Tag trajectories — surface, flow & overlap'],['מפת התוכן הפרטנית','Detailed content map'],['רשת השחקנים והתפקידים','Actors & characters'],['משטח שכבות ה־XML','XML layers as surface'],['כלי הערות, כתיבה וסוגי כתב','Notes, writing and scripts'],['השוואת עדים ותרחישים','Witness comparison and scenarios'],
['כיצד „אזכור…” הופך לגוף ידע?','How do “mentions” become knowledge categories?'],
['אטלס מושגים / תיעוד ההערות','Concept atlas / editorial annotations'],['אותו מונח. כמה גופי ידע.','One term. Multiple knowledge categories.'],
['הקווים מחברים','Lines connect'],['מונח מפורש בהערה','a term explicitly named in a note'],['לסיווגים שהמהדירים הצמידו לו. בניגוד לעץ רגיל, המונח אינו משוכפל כאשר יש לו כמה שיוכים.','to categories assigned by editors. Unlike a tree, a term is shown only once when it has multiple memberships.'],
['מונחים רב־רשתיים','Multi-category terms'],['כל המונחים','All terms'],['ברשתות שנבחרו','In selected networks'],['חיפוש מונח או רשת','Search term or network'],['שם המונח…','Term name…'],['סיווגים מהערות · נושא / סוג אזכור','Editorial categories · topics / mention types'],['מונחים מפורשים','Explicit terms'],
['הופעות, הערות ומעבר לטקסט ↗','Occurrences, notes & text ↗'],['שתי שיטות שונות:','Two different methods:'],
['המונח שנבחר:','Selected term:'],['גודל תרשים','Diagram scale'],['התאמה למסך','Fit to view'],['התאמה','Fit'],['ניתן גם לגלול בתוך המפה','Scroll to explore the diagram'],['הגדלת תרשים','Enlarge diagram'],['הגדלה','Zoom in'],['הקטנה','Zoom out'],['הגדלת המפה','Zoom in on map'],['הקטנת המפה','Zoom out on map'],['איפוס גודל הכיתובים','Reset label size'],['הגדלת הכיתובים','Larger labels'],['הקטנת הכיתובים','Smaller labels'],['מפה','Map'],['טקסט','Text'],
['מקור אחד אינו מסביר את הכול','No single source tells the whole story'],['מפה וחומרים','Map & materials'],['חומרי המקור','Source materials'],['קריאה מרחוק','Distant reading'],['מפת טקסט','Text map'],['משתתפים','Participants'],['שכבת תיוג חדשה','Additional tagging layer'],['קריאות ותרחישים','Readings & scenarios'],
['ממצאים ובירורים','Findings & open questions'],['כל 17 הטאבים','All 17 tables'],['התאמות הזהויות','Identity matching'],['שלמות ההנגשה','Publication completeness'],['קבצים וחבילת שחזור','Files & reproducibility'],['נתונים ובדיקות','Data & quality'],
['מאחורי הארכיון','Behind the archive'],['אודות המטאטא','About HaMatate'],['אודות הפרויקט','About the project'],['שותפים','Partners'],['מפת הידע והשיטה','Knowledge model & method'],['התוכן יתווסף בהמשך.','Content will be added later.'],
['כאן יופיע מידע על התיאטרון, הפרויקט והשותפים. מפת הידע וההסבר על מבנה הנתונים הועברו למרחב זה כדי שיישארו משותפים לכל ההצגות.','Information on the theatre, the research project and its partners will appear here. The knowledge model is shared across all performances.'],
['מבנה המיפתוח','Catalog data structure'],['מהעד לטענה ולתרחיש','From witness to claim and scenario'],['קידוד המהדורה','Edition encoding'],['מפת הידע והקשרים','Knowledge model & links'],
['מפת קורפוס','Corpus map'],['רשת שחקנים','Actor network'],['רשתות תוכן לאורך כל ההצגות','Content networks across performances'],['רשתות תוכן','Content networks'],['מי משתתף ביותר מהצגה אחת?','Who appears in multiple performances?'],['מפת תיעוד','Catalog coverage'],['בחירת אנשים','People selection'],['נקה בחירת אנשים','Clear people selection'],['שחקן/ית','Actor'],['אנשים נבחרו','people selected'],
['לא תויג','Not tagged'],['בחרו כמה רשתות יחד:','Select several networks:'],['בחרו רשת אחת או יותר','Select one or more networks'],['רשומות','records'],['תפקידים','roles'],['הצגות','performances'],['קטעים','units'],['מקורות','sources'],['הערה','note'],['הצגה','performance'],
['ריקון בחירה','Clear selection'],['נקה בחירה','Clear selection'],['בחירת הדגמה','Example selection'],['כל התגים','All tags'],['פרטים נוספים','More details'],['פתחו','Open'],['סגור','Close'],['הצג','Show'],['הסתר','Hide'],['בחירה מרובה','Multi-select'],['כל הרשתות','All networks'],['שחקנים','Actors'],['תפקידים ושחקנים','Characters and actors'],['תנאי החיפוש','Search conditions'],['סדר התכנייה','Program order'],
['עולם התוכן · שלוש רמות קריאה','Content world · three reading scales'],['רשתות חיות בתוך המחזה','Networks evolving through the play'],['עד טקסטואלי, לא משך מופעי','Textual sequence, not stage duration'],['השוואת סדרי הקריאה ↗','Compare reading orders ↗'],['הגדירו רשת חיפוש נוספת','Define another search network'],['הוסף רשת חיפוש','Add search network'],['זו שאילתה זמנית על ה־XML; לא תיוג חדש.','This is a temporary XML query, not an editorial tag.'],
['מבט־על · הטקסט כמצע','Overview · text as surface'],['הרצף כולו, עם שכבות התוכן עליו','The entire sequence with its content layers'],['יחידת מוקד','Focus unit'],['התקדמות במחזה','Progression through the play'],['כיצד משתנה הנוכחות של כל רשת?','How does each network change through the play?'],['מספרים מוחלטים','Absolute counts'],['ל־10 פסקאות','Per 10 paragraphs'],['מושגים ⇆ היחידות שבהן הם מופיעים','Terms ⇆ the units in which they occur'],['מופעים / מושגים','Occurrences / terms'],['רשת נבחרת','Selected network'],['מפגש בין הרשתות','Where networks meet'],['באותה יחידה T','Within the same T unit'],['באותה פסקה','Within the same paragraph'],['אופי הקשר','Relation type'],['בחזרה לראיה','Back to evidence'],['מה מקור הסימונים?','Where do the marks come from?'],['אוצר מילים שמשמש לחיפוש','Search vocabulary'],['קריאה צמודה · בחרו ראיה למיקום המדויק','Close reading · select evidence to jump to its position'],['המחזה במקורו','The original play text'],['למהדורה הרציפה המלאה ↗','Full reading edition ↗'],
['מה תראו על הדף?','What is shown on the page?'],['בחרו שכבות','Choose layers'],['כל מספר שייך למדד אחר; אין להשוות ביניהם ישירות.','Each number belongs to a different measure; do not compare them directly.'],['המחזה כמשטח חי','The play as a living surface'],['מעבר לאורך הטקסט','Navigate the text'],['נגן התקדמות ▶','Play progression ▶'],['עצור תנועה ◼','Stop progression ◼'],['מוקד:','Focus:'],['השכבות של היחידה','Layers of this unit'],['עדות ופרובננס','Witness & provenance'],['הערות','Notes'],['עריכה','Editing'],['כתב','Scripts'],['ישויות','Entities'],['קטגוריה','Category'],['כל ההערות','All notes'],['הצג על המשטח ←','Show on surface ←'],['מקורות המידע','Data sources'],['רצף המשתתפים לאורך המחזה','Actor presence through the play'],['תנועת השחקנים לאורך המחזה','Actor trajectories'],['שותפות ביחידות S','Shared S units'],['מעברים בין דוברים','Speaker transitions'],['על מה מבוססת הרשת?','What is the network based on?'],['רשת דמויות ואנשים','Characters and people network'],['משטח קריאה רב־שכבתי','Multi-layer reading surface'],['רשתות התוכן על גוף המחזה','Content networks on the text'],['מבט־על ← יחידה ← פסקה ← מקור','Overview ← unit ← paragraph ← source'],['לרשתות התוכן','To content networks'],['לשכבות הטקסט','To text layers'],['לרשת השחקנים','To actor network'],['לקריאה רציפה מלאה','Read full text'],['שכבות ה־XML','XML layers'],['חיי השחקנים','Actor trajectories'],['תכנייה מקורית · שכבות אינטראקטיביות','Original program · interactive layers'],['לניתוחים הנוספים ←','More analyses ←'],
['הצגות זמינות לקריאה','Editions available to read'],['הצג את כל ההצגות','Show all performances'],['רק הצגות זמינות','Available editions only'],['כל רשומות ההצגות','All performance records'],['מבט רחב על הקורפוס','Corpus overview'],['מקור אחד אינו מסביר את הכול','No single source tells the whole story'],['הצגת תוצאות','Display results'],['סוגי הקשרים','Relation types'],['קבצי מקור','Source files'],['התנהגות הרשת','Network behavior'],['קריאה צמודה','Close reading'],['דפוסי הופעה','Occurrence patterns'],['כמות הופעות','Number of occurrences'],['כתב ומעברי לשון','Scripts and language switching'],['סיווג הערות המהדורה','Editorial note categories'],['רשתות מושגים · חיפוש','Concept networks · search'],['המחזה כמשטח','Play as surface'],['התפתחות ומעברים','Evolution & transitions'],['מפת קשרים','Network map'],['הגדרה מדויקת:','Operational definition:'],['נושאים','Topics'],['מונחים','Terms'],['הרחב','Expand'],['צמצם','Collapse'],['איפוס','Reset'],['מקור חיצוני','External source'],['פתיחת מקור','Open source'],

['הערה מסווגת','Categorized note'],['ניקוי','Clear'],['רשתות חיפוש מילולי · 5','Literal search networks · 5'],['שחקנים, כתיבה וסוגי כתב','Actors, editorial marks & scripts'],['מפת הרשתות והזרימה ↗','Network map & flows ↗'],['בחירת הרשתות והמילים','Network & term selection'],['רשימת המקורות','Source list'],['מה מסומן כאן?','What is marked here?'],['הקודם ↑','Previous ↑'],['הבא ↓','Next ↓'],['נתוני היחידה','Unit details'],['שער ההצגה','Performance title page'],['חיי כל התגים והרשתות','All tag & network trajectories'],['כל רשת וכל תג משאירים עקבות במחזה','Every network and tag leaves traces across the play'],['בחרו את כל הקבוצה','Select the whole group'],['בחירה לדוגמה','Example selection'],['גופי ידע מהערות','Editorial knowledge categories'],['סיווגי הערות','Note classifications'],['סימוני XML','XML markings'],['סוגי כתב','Writing systems'],['חיי השכבות על הטקסט','Layer trajectories across the text'],['רשת חפיפות ומיקומים','Overlaps & locations network'],['נגן מעבר לאורך הרצף ▶','Animate the sequence ▶'],['כל היחידות','All units'],['נקה יחידות','Clear unit selection'],['המחזה כמשטח רב־שכבתי','Play as a multilayer surface'],['בחרו גם מושגים בודדים מתוך הרשתות (בחירה מרובה)','Choose individual terms as well (multi-select)'],['עריכת הבחירה וקריאה על המשטח ←','Edit selection & explore on the surface ←'],['מפת הכיסוי של 12 יחידות S','Coverage of 12 S units'],['לא נמצאה רשומה','No matching catalog entry'],['מפת המטאטא','HaMatate corpus map'],['מפת תיעוד ההצגות','Performance coverage'],['רשת אנשים והצגות','People & performances'],['רשתות התוכן בקורפוס','Corpus content networks'],['מה מקוטלג בכל הצגה?','What is catalogued for each performance?'],['רשומת המיפתוח','Catalog record'],['המקור ב־XML','XML source'],['סימוני ההחלפה','Swap markers'],['סימון שדורש בדיקה','Flagged for review'],['החומרים והעדים','Materials & witnesses'],['הארכיון לפי תכניות','Archive by programs'],['לחומרים ולמקורות','Materials & sources'],['מקור חזותי','Visual source'],['XML מקושר · 21 יחידות T','Linked XML · 21 T units'],['שני צילומים זמינים לפתיחה','Two scanned pages available'],['לא נמצאה רשומה','No catalog record'],['מונחים בהערות','Editorial terms'],['הצגה אחת זמינה לקריאה','One readable edition'],['דפדוף במקורות','Browse sources'],['הצגה זמינה','Available edition'],['הצגות מתועדות','Catalogued performances'],['קשרי אנשים ותפקידים','People & roles'],['הערות מקושרות','Linked footnotes'],['שכבות פעילות','active layers'],
];

// UI copy for the stage workspace and composite research controls.
PAIRS.push(...[
 ['בחרו רשתות — גם וגם','Select networks · combine freely'],
 ['בחרו רשתות — גם וגם','Choose networks · additive selection'],
 ['גופי ידע · מונחים בהערות','Knowledge categories · terms in notes'],
 ['גופי ידע · סיווגי הערות','Knowledge categories · editorial classifications'],
 ['מיון וחיפוש','Sort and search'],
 ['מופעי כתב לטיני ≠ זיהוי שפה · רשת אנשים ≠ רשת שיח מתויגת','Latin-script occurrences are not language identifications; a people network is not an annotated discourse network.'],
 ['העיצוב משתמש בסריקות התכנייה המקוריות כחומר חזותי נע, ולא באיור שאינו קשור להצגה.','Original program scans are part of the visual design, not unrelated illustration.'],
 ['המחזה אינו רק רצף שורות לקריאה. כאן נפגשות רשתות תוכן, מילות חיפוש, הערות, מחיקות וקולות של דמויות. אפשר להתחיל מרשת כמו „יהדות ומסורת”, לראות כיצד היא מופיעה לאורך כל הרצף ולחזור ממנה לפסקה המקורית. רשת השחקנים נמצאת באותה סביבת עבודה.','The play is more than a sequence of lines. Here content networks, search terms, annotations, deletions and character voices intersect. Select a network such as “יהדות ומסורת” to follow it across the text and return to the original paragraph. The actor network is part of the same research workspace.'],
 ['סימוני ה־XML והרשתות הקטגוריאליות מבוססים על המקור. רשתות מילים הן חיפוש מילולי ניסיוני; קובץ התיוג העצמאי לשפות ולרשתות שיח עדיין ריק.','XML annotations and editorial categories derive from source evidence. Lexical networks are exploratory searches; the separate language and discourse-network annotation file is still empty.'],
 ['מהמכלול אל ההתפתחות, מן היחידה אל המילה. כל חיבור נפתח למיקומו המקורי.','From overview to trajectories, from textual unit to word. Follow each connection back to its source.'],
 ['רשתות החיפוש הן עדשות מחקר המוגדרות על ידי רשימות מילים. ההתאמות עצמן נמצאו בטקסט; השייכות לרשת אינה תיוג תוכני מאומת.','Search networks are research lenses defined by word lists. Matches were found in the text, but membership in a network is not a validated thematic annotation.'],
 ['הקטגוריות נלקחו מן הסיווג המפורש של הערות ה־XML. קשת בין קטגוריות מעידה על הערות המעוגנות באותה פסקה, לא על קשר סמנטי מוכח.','Categories derive from explicit XML footnote classifications. Shared-paragraph links do not demonstrate a validated semantic relationship.'],
 ['הזיהוי מבוסס על טווחי Unicode של כתב. כתב לטיני אינו בהכרח אנגלית, ולהופעת כתב אין בהכרח משמעות של מעבר לשוני. בגיליון תיוגי השפה שסופק אין רשומות.','Script detection uses Unicode ranges. Latin letters do not necessarily mean English, nor does a different script necessarily indicate code-switching. The supplied language-annotation sheet has no entries.'],
 ['עדשות חיפוש, לא תיוגי שיח מאושרים.','Exploratory searches, not validated discourse tags.'],
 ['המטאטא · תכנית נ״א · 1939 / מכונת קריאה','HaMatate · Program LI · 1939 / Reading environment'],
 ['שכבות נשמרו בבחירה משותפת','layers retained in the shared selection'],
 ['בחירת רשתות · הצגה מרובה','Network selection · multiple layers'],
 ['מפה וחומרים','Map and materials'],
 ['המסמכים ההיסטוריים נשארים בשפת המקור.','Historical sources remain in their original language.'],
 ['מעבדת אליהו','Elijah Lab'],['אוניברסיטת חיפה','University of Haifa'],
 ['מדעי הרוח הדיגיטליים','Digital Humanities'],
 ['דובר','Speaker'],['דוברים בתפקיד','Speakers by role'],
 ['תוכן המיפתוח','Catalog contents'],['רשתות השיח','Discourse networks'],
 ['קווים = מופעים באותה יחידת T; העובי = מספר מופעי מילה/הערה.','Lines indicate shared T units; width shows the number of word or note occurrences.'],
 ['אין קישור ישיר מאדם אל מושג, או בין שני מושגים, בלי עדות ברמת פסקה/יחידה. הקשת היא הופעה מתועדת, לא קשר רעיוני שכבר הוכח.','Person-to-concept and concept-to-concept links require paragraph- or unit-level evidence. An edge represents documented co-occurrence, not a demonstrated conceptual link.']
]);
// Supplementary V2.6 fixes: UI-only strings found in live toolbars, editor and research panels.
PAIRS.push(...[
 ['התחילו בקריאת „כי תצא למלחמה” ←','Start reading “כי תצא למלחמה” ←'],
 ['קראו וחקרו את ההצגה ←','Read and explore this performance ←'],
 ['26 רשומות אמיתיות מתוך A — הצגות. לחיצה על הצגה ללא מהדורה פותחת את הרשומה הקטלוגית שלה.','26 performances indexed in catalog A. Selecting a performance without an edition opens its catalog record.'],
 ['סינון לפי שנה','Filter by year'],['עדשות חיפוש, לא תיוגי שיח מאושרים.','Search lenses, not validated discourse annotations.'],
 ['עוד סיווגים מן ההערות · 9','More editorial categories · 9'],
 ['מפת הרשתות, המילים והזרימה ←','Networks, terms and flows ←'],
 ['בחרו כמה רכיבים יחד, והשוו היכן הם מופיעים, מתלכדים ונפרדים לאורך הרצף.','Select multiple layers to compare their appearances, intersections and divergences across the text.'],
 ['משותף באותו…','Shared within…'],['הקטנת המפה','Zoom out of map'],['הגדלת המפה','Zoom in on map'],
 ['הקטנת הכיתובים','Decrease label size'],['שליטת הגדלה בתרשים','Diagram zoom controls'],
 ['מונחים מפורשים','Explicit terms'],['מונחים רב־רשתיים','Multi-category terms'],
 ['לקריאה הרציפה','Return to full reading'],['הצגת שכבות','Show layers'],
 ['הסתרת שכבות','Hide layers'],['כל כלי המחקר','All research tools'],
 ['קיבוץ יחידות כותרת','Group heading units'],['הצגת יחידות כותרת','Show heading units'],
 ['סדר MD','Catalog order'],['שער כללי','Front matter'],['שער ברמת ההצגה','Performance title page'],
 ['עמוד קובץ','File page'],['קודי תפקיד','role identifiers'],['קוד תפקיד','role identifier'],
 ['הקידוד','XML encoding'],['מופע','occurrence'],['מופעים','occurrences'],
 ['רשתות חיפוש','Search networks'],['שכבות ה־XML','XML layers'],['פסקאות','paragraphs'],
 ['שינוי הסדר משנה רק את ארגון התצוגה. המספרים אינם משתנים כי הראיות נשארות מחוברות למקור.','Reordering changes only the display. Evidence counts remain tied to their sources.'],
 ['כל שכבה כקו חיים לאורך המחזה','Each layer as a trajectory across the play'],
 ['כל נקודה היא יחידת T בדידה. הקווים מדגישים רצף קריאה, אינם ערכי זמן או קשר סיבתי.','Each point represents a distinct T unit. Lines indicate sequence, not elapsed time or causation.'],
 ['הנקודות הן ערכים בדידים של יחידות T, ולא מדידות בזמן. השימוש בקו נועד לעזור לעקוב אחרי שינוי לאורך הסדר שנבחר. שינוי סדר הקריאה זמין גם כאן.','Points represent discrete T units, not time measurements. Lines help follow change across the chosen reading order.'],
 ['מפת קשרים רב־ערכית בין מונחים ובין סיווגי ההערות','Many-to-many map of terms and editorial categories'],
 ['הגדלה של מפת המונחים','Zoom controls for the terms map'],
 ['הגדלת תרשים','Diagram zoom'],['התאמה למסך','Fit diagram'],
 ['ניווט להצגה','Open performance'],['הצגות מקוטלגות','Catalogued performances'],
 ['סוגי הקשרים','Connection types'],['רשתות מתויגות','Annotated networks'],
 ['ערכי מקור','Source values'],['מקור','Source'],['גוף ידע','Knowledge category'],
 ['תג','Tag'],['בחירת רכיבים','Select components'],['יחידות','units'],
 ['שתי שיטות שונות:','Two distinct methods:'],
 ['נתוני היחידה','Unit details'],['רשומות MD','MD records'],
 ['שלמות הנתונים','Data completeness'],['ניתוח פערים','Gap analysis'],
 ['פתיחת תיק היחידה','Open unit record'],['טאבים נבדקו','tables inspected'],['קודי T תואמים','valid T codes'],['קודי R תואמים','valid R codes'],['הפניות להערות נפתרות','resolved note references'],
 ['הצגה נוספת','Another performance'],['לא נמצאו ראיות','No evidence found'],
 ['תיעוד המקור','Source documentation'],['התפתחות · רצף משתנה','Trajectories · changing sequence'],
 ['אין מקורות משותפים לפי תחום החפיפה שנבחר','No shared sources at the selected level of overlap'],
 ['מופעים / מושגים','Occurrences / terms'],['יחידות T','T units']
]);

const dictionary=new Map(PAIRS);
const patterns=[
[/^רשתות על פני (.+)$/,'Networks across $1'],
[/^(\d+) שכבות פעילות$/,'$1 active layers'],
[/^בחירת הרשתות והמילים (\d+) שכבות פעילות$/,'Network & term selection · $1 active layers'],
[/^(\d+) קישורים עקביים במיפתוח$/,'$1 consistent catalog links'],
[/^(\d+) פריטים במלאי$/,'$1 catalogued items'],
[/^(\d+) שיוכים מזוהים$/,'$1 identified assignments'],
[/^\d+ רשומות M · \d+ סימונים ב־T\d+$/,'Music catalog records · score markers in the script'],

[/^(\d+) רשתות ושכבות$/,'$1 networks and layers'],[/^(\d+) יחידות בבחירה$/,'$1 selected units'],[/^(\d+) ראיות ייחודיות לאחר הסרת כפילויות.*$/,'$1 unique evidence items after deduplication. Words and notes are different units of counting.'],
[/^(\d+) מונחים בתחום הנבחר$/,'$1 terms in the selected scope'],[/^(\d+) מונחים עם שיוך מפורש לכמה סיווגים$/,'$1 terms explicitly assigned to multiple categories'],[/^(\d+) סיווגים המופיעים בעמוד$/,'$1 categories on this page'],
[/^עמוד (\d+) מתוך (\d+) · (\d+) מונחים$/,'Page $1 of $2 · $3 terms'],[/^הערה (\d+) · נוסח מלא$/,'Note $1 · full text'],[/^(\d+) הצגות$/,'$1 performances'],[/^(\d+) הופעות$/,'$1 occurrences'],[/^(\d+) תפקידים$/,'$1 roles'],
[/^בחרו כמה אנשים ברשימה.*$/,'Choose several people to highlight their catalogued participation across performances.'],
[/^בחירה מצטברת · .*$/,'Additive selection · click a graph element to inspect evidence without clearing other networks.'],
[/^הציר הוא סדר יחידות העד, לא זמן ביצוע\.$/,'The axis follows the witness text, not historical performance time.'],
[/^יחידות ללא שיוך בתכנייה.*$/,'Units with no program match are shown last and marked separately.'],
[/^הקווים מחברים מונח מפורש בהערה לסיווגים.*$/,'Lines connect a term explicitly named in an editorial note to its assigned categories. A term is shown only once even if it belongs to several categories.'],
[/^\d+ מונחים בתחום הנבחר · \d+ מונחים עם שיוך מפורש לכמה סיווגים · \d+ סיווגים המופיעים בעמוד$/,'Terms in scope · multi-category terms · categories on this page'],
[/^המערכת ערוכה להשוואה בין כמה הצגות.*$/,'Designed for cross-performance comparison; currently only one play offers a fully searchable text. Other catalogued performances have no inferred counts.'],
[/^הספירות אינן ערכים השוואתיים.*$/,'Counts are not comparable until further texts are annotated; unprocessed performances are not treated as zero.'],
[/^שורות = אנשים עם per-id.*$/,'Rows represent identified people; columns represent performances. An active cell means an indexed role, not an inferred stage encounter.'],
[/^סדר יחידות T בקובץ המקור.*$/,'The original T-unit order is preserved even if the program lists a different sequence.'],
[/^הטקסט הוא נקודת הכניסה.*$/,'Read the text, explore independent witnesses and move freely between the edition and its research maps.'],
[/^רצף המבוסס על רשומות PS.*$/,'Sequence reconstructed from PS program records; its numbering differs from printed scene numbers.'],
[/^מחיקה נשמרת בטקסט.*$/,'Deletions remain in the text. Bracketed personal names are editorial identifications. Click a footnote number to inspect its annotation.'],
[/^בחירת תצוגה בלבד; המקור אינו משתנה\.$/,'Display setting only; source text is unchanged.'],
[/^MOVE אחד ושני זוגות SWAP.*$/,'One MOVE and two SWAP pairs; the pair on page 56 is blocked by a mismatched closing marker.'],
[/^לא נמצאו רשומות.*$/,'No matching catalog records were found.']
];

patterns.unshift(
 [/^(\d+) (מופעים|הופעות)$/,'$1 occurrences'],
 [/^(\d+) (הערות)$/,'$1 notes'],
 [/^(\d+) (קודי תפקיד)$/,'$1 role IDs'],
 [/^(\d+) (רשומות)$/,'$1 records'],
 [/^(\d+) (יחידות)$/,'$1 units'],
 [/^(\d+) (פסקאות)$/,'$1 paragraphs'],
 [/^עמוד קובץ (\d+)$/,'Source page $1'],
 [/^סדר MD (\d+)$/,'Catalog order $1'],
 [/^שער כללי · (T\d+)$/,'Front matter · $1'],
 [/^(.+) (\d+) מופעים$/,'$1 · $2 occurrences'],
 [/^(.+) · (\d+) הערות$/,'$1 · $2 notes']
);


// Partial text nodes in generated toolbars are often interrupted by <b>counts</b>.
// Translate only these stable UI fragments, never names, quotations or source labels.
const UI_FRAGMENTS=[
 ['מונחים בתחום הנבחר','terms in scope'],
 ['מונחים עם שיוך מפורש לכמה סיווגים','terms with explicit multiple category memberships'],
 ['סיווגים המופיעים בעמוד','categories shown on this page'],
 ['רשומות אמיתיות מתוך A','actual catalog-A records'],
 ['— הצגות. לחיצה על הצגה ללא מהדורה פותחת את הרשומה הקטלוגית שלה.','— performances. Select an unedited performance to open its catalog record.'],
 ['יחידות בבחירה','selected units'],['שכבות פעילות','active layers'],
 ['מופעים ברשת','occurrences in network'],['הופעות מתועדות','documented occurrences'],
 ['תוכניות במיפתוח','program records'],['הערות מסווגות','classified annotations'],
 ['מילה בהערה','term in annotation'],['הגדלת הכיתובים','Larger labels'],
 ['לא נמצאו התאמות','No matching results'],
 ['מקור מן המיפתוח','Catalog evidence']
];
const originals=new WeakMap();const outputs=new WeakMap();
let lang='he',scheduled=false,observer=null;
function eligible(node){
 const p=node.parentElement;
 if(!p||p.closest('script,style,noscript,code,pre,.text-body,.raw-code,.k24-evidence-card blockquote,.k24-original-note,.k24-evidence-card h3,.v21-production-card h3,.k24-term-node,.k24-root-title,.k24-root-count,.k25-category-node,.k25-term-node,.k25-focus span,.v22-margin-note span,.k24-context-snippet,.k24-evidence-card blockquote,[data-k24-term-evidence],.k24-surface-word,.v21-matrix-name,.v21-production-card h3,.v21-theme-grid [data-corpus-theme]'))return false;
 return true;
}
function tr(s){
 if(!s||!/[\u0590-\u05ff]/.test(s))return s;
 const raw=s.trim();
 if(dictionary.has(raw))return dictionary.get(raw);
 for(const [pattern,replacement] of patterns)if(pattern.test(raw))return raw.replace(pattern,replacement);
 // Use phrase replacement only for composed interface text. A one-word source
 // label is never translated by this fallback.
 let out=raw;
 for(const [he,en] of UI_FRAGMENTS)if(out.includes(he))out=out.split(he).join(en);
 return out!==raw?out:s;
}
function replaceText(node){if(!eligible(node))return;const current=node.nodeValue;if(!current||!current.trim())return;
 let src=originals.get(node),last=outputs.get(node);
 if(src===undefined||current!==last&&current!==src){src=current;originals.set(node,src);}
 const pre=src.match(/^\s*/)[0],post=src.match(/\s*$/)[0],translated=lang==='en'?tr(src.trim()):src.trim();const result=pre+translated+post;
 if(current!==result)node.nodeValue=result;outputs.set(node,result);
}
const attrOriginals=new WeakMap();
function updateAttrs(el){
 if(!(el instanceof Element)||el.closest('.text-body,.raw-code,.k25-term-node,.k25-category-node'))return;
 for(const att of ['aria-label','placeholder','title']){
  if(!el.hasAttribute(att))continue;
  const current=el.getAttribute(att);let entry=attrOriginals.get(el)||{};
  if(!entry[att]||current!==entry[att].out&&current!==entry[att].original)entry[att]={original:current,out:current};
  const target=lang==='en'?tr(entry[att].original):entry[att].original;
  if(target!==current)el.setAttribute(att,target);
  entry[att].out=target;attrOriginals.set(el,entry);
 }
}
function localize(root){
 if(!root)return;
 if(root.nodeType===3){replaceText(root);return;}
 if(root.nodeType!==1&&root.nodeType!==9)return;
 const blocked='.text-body,.raw-code,script,style,noscript,svg,.stage-microtext';
 // Reject large source-text subtrees instead of walking millions of text spans.
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{
  acceptNode(node){if(node.nodeType===1&&node.matches(blocked))return NodeFilter.FILTER_REJECT;
   if(node.nodeType===3&&!node.nodeValue.trim())return NodeFilter.FILTER_SKIP;
   return NodeFilter.FILTER_ACCEPT;}
 });
 if(root.nodeType===1)updateAttrs(root);
 let n;while(n=walk.nextNode()){if(n.nodeType===3)replaceText(n);else updateAttrs(n);}
 for(const el of document.querySelectorAll('.k25-axis-label,.k24-band-label,.k24-source-label,.text-body button[data-action="xmlpara"],.text-body button[data-action="page"],.text-body button[data-action="textrecord"]')){
    if(el.firstChild?.nodeType===3 && el.matches('.text-body button')){ const node=el.firstChild;const original=originals.get(node)||node.nodeValue;const raw=original.trim();let translated=lang==='en'?tr(raw):raw; if(lang==='en'&&/^עמוד קובץ (\d+)$/.test(raw))translated=raw.replace(/^עמוד קובץ (\d+)$/,'Source page $1');node.nodeValue=translated;originals.set(node,original);outputs.set(node,translated); }
    else if(el.firstChild)replaceText(el.firstChild);
  }
}

// Each SVG chart zooms as a *whole*, including axes, labels, edges and nodes.
// A dedicated scroll container preserves the layout of complex grid parents.
const auxZoom=new Map();
const AUX_CHARTS='svg.stage-network-svg,svg.ct-streamsvg,svg.ct-netsvg,svg.ct-cross-svg,svg.v2-flow-svg';
function k26ChartScale(svg,tools){
 const key=svg.dataset.k26ZoomKey,z=auxZoom.get(key)||1;
 const w=Number(svg.dataset.k26BaseWidth)||1000;
 const view=svg.viewBox.baseVal,ratio=view?.width&&view?.height?view.height/view.width:0.5;
 svg.style.setProperty('width',Math.round(w*z)+'px','important');
 svg.style.setProperty('min-width',Math.round(w*z)+'px','important');
 svg.style.setProperty('max-width','none','important');
 svg.style.setProperty('height',Math.round(w*z*ratio)+'px','important');
 svg.style.setProperty('max-height','none','important');
 svg.style.setProperty('min-height','0','important');
 svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 if(tools)tools.querySelector('output').textContent=Math.round(z*100)+'%';
}
function decorateAdditionalCharts(){
 for(const svg of document.querySelectorAll(AUX_CHARTS)){
  if(svg.dataset.k26ZoomReady)continue; // decoration is one-time per rendered SVG
  const key=[...svg.classList].find(x=>['stage-network-svg','ct-streamsvg','ct-netsvg','ct-cross-svg','v2-flow-svg'].includes(x));if(!key)continue;
  const baseWidth=svg.getBoundingClientRect().width||svg.viewBox.baseVal.width||1000;
  svg.dataset.k26ZoomReady='1';svg.dataset.k26ZoomKey=key;svg.dataset.k26BaseWidth=String(baseWidth);
  const wrap=document.createElement('div');wrap.className='k26-chart-shell';
  const tools=document.createElement('div');tools.className='k26-other-zoom';
  tools.innerHTML='<b>גודל התרשים כולו</b><button type="button" data-k26-chart="out" aria-label="הקטנת התרשים">−</button><output aria-live="polite">100%</output><button type="button" data-k26-chart="in" aria-label="הגדלת התרשים">+</button><button type="button" data-k26-chart="reset">התאמה</button>';
  const viewport=document.createElement('div');viewport.className='k26-chart-viewport';
  svg.before(wrap);wrap.append(tools,viewport);viewport.append(svg);
  k26ChartScale(svg,tools);
 }
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-k26-chart]');if(!btn)return;
 const shell=btn.closest('.k26-chart-shell'),svg=shell?.querySelector('svg[data-k26-zoom-key]');if(!svg)return;
 event.preventDefault();event.stopImmediatePropagation();
 const key=svg.dataset.k26ZoomKey,z=auxZoom.get(key)||1;
 const next=btn.dataset.k26Chart==='reset'?1:Math.min(3,Math.max(.6,Math.round(z*(btn.dataset.k26Chart==='in'?1.25:.8)*100)/100));
 auxZoom.set(key,next);k26ChartScale(svg,shell.querySelector('.k26-other-zoom'));
},true);
function update(){
 observer?.disconnect();
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='en'?'ltr':'rtl';
 document.body.classList.toggle('k26-english',lang==='en');
 for(const btn of document.querySelectorAll('[data-k26-lang]')){
  btn.setAttribute('aria-pressed',String(btn.dataset.k26Lang===lang));
  btn.classList.toggle('active',btn.dataset.k26Lang===lang);
 }
 document.title=lang==='en'?'HaMatate · performances & knowledge networks':'המטאטא · הצגות ורשתות תוכן';
 decorateAdditionalCharts();
 if(lang==='en'||document.body.dataset.k26WasEnglish==='1')localize(document.body);
 document.body.dataset.k26WasEnglish=lang==='en'?'1':'0';
 observer?.observe(document.body,{subtree:true,childList:true});
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update();});}
function switchTo(value){
 if(value!=='he'&&value!=='en')return;
 lang=value;try{localStorage.setItem('hamatate-ui-language',lang);}catch{}
 update();
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-k26-lang]');if(b){event.preventDefault();event.stopImmediatePropagation();switchTo(b.dataset.k26Lang);}},true);
try{lang=localStorage.getItem('hamatate-ui-language')==='en'?'en':'he';}catch{}
observer=new MutationObserver(muts=>{const nodes=muts.flatMap(m=>[...m.addedNodes]);if(nodes.some(n=>n.nodeType===1&&(lang==='en'||n.matches?.('svg.stage-network-svg,svg.ct-streamsvg,svg.ct-netsvg,svg.ct-cross-svg,svg.v2-flow-svg,.stage-root,.ct-world,.v2-world')||n.querySelector?.('svg.stage-network-svg,svg.ct-streamsvg,svg.ct-netsvg,svg.ct-cross-svg,svg.v2-flow-svg'))))schedule();});
observer.observe(document.body,{subtree:true,childList:true});
window.HAMATATE_I18N={get lang(){return lang},setLanguage:switchTo,translate:tr,refresh:schedule};
schedule();
})();
