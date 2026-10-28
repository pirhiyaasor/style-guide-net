# נט המשפט: Design Spec (design.md)

> מסמך העברה לצוות הפיתוח. נכתב מתוך אב־הטיפוס החי:
>
> | מסך | קישור | קובץ |
> |---|---|---|
> | דף הבית: אורח | https://case-view-lawyer-docs-inline.vercel.app/home.html | `home.html` |
> | דף הבית: עו"ד מחובר | https://case-view-lawyer-docs-inline.vercel.app/home.html#as=lawyer | `home.html` |
> | איתור החלטות | https://case-view-lawyer-docs-inline.vercel.app/decisions.html | `decisions.html` |
> | מסך תיק | https://case-view-lawyer-docs-inline.vercel.app/index.html | `index.html` |
>
> **קובץ Figma:** https://www.figma.com/design/KiNz97JVhOrwxV4AjTYWgM. עמודים: Foundations (משתנים, סגנונות טקסט וצללים) · App Shell (Header ×3, Rail Item ×4 מצבים, Fly-out, Rail, מסגרות מורכבות) · Components (Button, Input, Radio, Segment, Tab, Tag, Case Menu Row, Table Row) · Screens (39 צילומי מצב).
>
> כל הערכים במסמך נבדקו מול `styles.css`, מול ה־`<style>` של כל עמוד ומול ה־computed style בדפדפן ברוחב 1440×900 ו־375×812. צילומי המצבים נמצאים בתיקייה [`screenshots/`](screenshots/).

> [!IMPORTANT]
> **המסמך מגדיר עיצוב בלבד, לא תוכן.**
>
> **מה המסמך קובע:** מראה והתנהגות. צבעים, טיפוגרפיה, ריווחים, גדלים, מבנה ופריסה, רכיבים ומצביהם (hover, focus, active, open, disabled), אנימציות, רספונסיביות ונגישות. בנוסף, **מנגנוני התנהגות** כמו "בחירת סוג תיק משנה את השדות בהדר" או "fly-out נפתח שמאלה מהרייל".
>
> **מה המסמך לא קובע:** תוכן. **כל התוכן נלקח מהאתר המקורי (נט המשפט), לא מהמסמך ולא מאב־הטיפוס:**
> - טקסטים, כותרות ותוויות
> - פריטי תפריט: פריטי הרייל ותפריטי המשנה שלהם, תפריט המשתמש
> - אפשרויות ב־select: סוגי תיק, בתי משפט, הליכים וכו'
> - עמודות טבלה, סוגי מסמכים והחלטות וקטגוריות
> - הודעות, קישורים ויעדי ניווט
> - פורמטים של מספרי תיק, נתונים, שמות ומספרים
>
> כל דוגמת תוכן שמופיעה במסמך, בצילומים או ב־Figma (למשל "70137-09-24", "ישראל כהן", "תיק בית משפט / תעבורה / ישן", רשימות התפריטים) **באה מאב־הטיפוס ונועדה להמחשה בלבד**.
>
> **כשאתר המקור מכיל פריט שאין לו מקבילה כאן:** מעצבים אותו לפי הרכיב המתאים במסמך. למשל, פריט רייל נוסף מקבל את מפרט "פריט רייל", ואפשרות נוספת ב־select מקבלת את מפרט ה־select.

---

## תוכן עניינים
1. [עקרונות](#1-עקרונות)
2. [Design Tokens](#2-design-tokens)
3. [מסגרת העמוד (App Shell): הדר עליון + סיידבר ימני](#3-מסגרת-העמוד-app-shell)
4. [רכיבים (Components) ומצבים](#4-רכיבים-components-ומצבים)
5. [מסכים](#5-מסכים)
6. [רספונסיביות](#6-רספונסיביות)
7. [נגישות](#7-נגישות)
8. [הנחיות UX משלימות](#8-הנחיות-ux-משלימות)
9. [נספח: CSS Variables להעתקה](#9-נספח-css-variables)
10. [נספח: אינדקס צילומי מסך](#10-נספח-אינדקס-צילומי-מסך)

---

## 1. עקרונות

- **RTL ועברית קודם.** `dir="rtl"`. כל הריווחים נכתבים ב־logical properties (`margin-inline-start`, `inset-inline-start`), לא ב־left/right. המספרים (מספרי תיק ותאריכים) נשארים בכיוון שלהם.
- **בסיס: monday Vibe**, ועליו שכבת מותג של הרשות השופטת: נייבי מוסדי `#0a3b8f` במקום הכחול של Vibe.
- **שתי שכבות טוקנים:** primitives (`--brand-navy`, `--ui-border-color` …), ומעליהן semantic (`--fg-1`, `--bg-2`, `--border-1`, `--h1` …). **בקוד משתמשים רק בשכבה הסמנטית.**
- **שלושה גוונים שאסור לבלבל ביניהם:**
  - `--cvs-hover` `#d6e6fa`: ריחוף בלבד.
  - `--brand-tint` `#e8eff9`: "אתה נמצא כאן", כלומר פריט פעיל או נבחר.
  - `#cadcf5`: שורת טבלה שהמסמך שלה פתוח כרגע.
- **צורות:** מלבנים עם פינות רכות. Pill (`999px`) רק לתגיות, לבאדג'ים ולרדיו.
- **פונט אחד:** Rubik. הוא נושא גם עברית וגם לטינית.

---

## 2. Design Tokens

### 2.1 צבעים: מותג

| Token | ערך | שימוש |
|---|---|---|
| `--brand-navy` | `#0a3b8f` | primary: כפתור ראשי, טקסט מותג, אייקוני הרייל, כותרות |
| `--brand-navy-hover` | `#082e6f` | ריחוף על primary |
| `--brand-navy-deep` | `#062356` | primary במצב לחוץ או פתוח (כפתור התחברות כשהתפריט פתוח) |
| `--brand-azure` | `#2a6fdb` | קישורים, focus ring |
| `--brand-azure-hover` | `#1f5cba` | ריחוף על קישור |
| `--brand-tint` | `#e8eff9` | רקע של פריט פעיל או נבחר, כפתור משני רך |
| `--brand-tint-strong` | `#cfdcf0` | גבול ריחוף על tint, כפתור חיפוש של אורח |
| `--brand-gold` | `#c8a24a` | הדגשת סמל (שמור) |
| `--cvs-hover` | `#d6e6fa` | **ריחוף** על שורות, פריטי תפריט ופריטי רייל |
| `#cadcf5` | (literal) | שורה פעילה: מסמך פתוח בצד |
| `#e3ecf9` | (literal) | שורה "אחרונה שנצפתה" (`.cvs-doclast` / `.dc-rowlast`) |
| `#eff5fd` | (literal) | רקע כותרות טבלה (`th`) |
| `#001E40` | (literal) | טקסט בתוך טבלאות ורשימות (כהה כחלחל) |

### 2.2 צבעים: ניטרליים, טקסט, רקעים, גבולות

| Semantic | Primitive | ערך |
|---|---|---|
| `--fg-1` | `--primary-text-color` | `#323338` |
| `--fg-2` | `--secondary-text-color` | `#676879` |
| `--fg-3` | `--tertiary-text-color` | `#6c6e81` **(עודכן מ־`#9699a6` לעמידה ב־WCAG 1.4.3: 4.58:1 ומעלה על כל הרקעים)** |
| `--fg-disabled` **(חדש)** | – | `#9699a6`: **רק** לטקסט ולאייקונים במצב מושבת או לא זמין. פטור מדרישת ניגודיות |
| `--fg-link` | `--link-color` | `#2a6fdb` |
| `--bg-1` | `--primary-background-color` | `#ffffff` |
| `--bg-2` | `--allgrey-background-color` | `#f6f7fb` |
| `--bg-3` | `--ui-background-color` | `#e7e9ef` |
| רקע אפליקציה (מסכים פנימיים) | – | `#f4f8fc` |
| רקע דף הבית | – | `#fff` עם גרדיאנט תחתון ל־`#e6eef9` |
| `--border-1` | `--ui-border-color` | `#c3c6d4` |
| `--border-2` | `--layout-border-color` | `#d0d4e4` |
| `--border-field` **(חדש)** | – | `#878ca0`: מסגרת של **שדות קלט** בלבד (input, select, underline, פילטרים). 3.04:1 ומעלה על כל הרקעים (WCAG 1.4.11). `--border-1` נשאר לקווים דקורטיביים: כרטיסים, מפרידים וכפתורים |
| קו מפריד של רייל | – | `#e1e6ef` |
| קו מפריד בתוך שורות | – | `#eef1f6` / `#eceef2` |
| `--disabled-background-color` | – | `#ecedf5` (select מושבת: `#f7f9fc`) |
| `--backdrop-color` | – | `rgba(41,47,76,.7)` (מגירת מובייל: `rgba(6,30,64,.32)`) |

### 2.3 צבעים: סמנטיים ותגיות

| מצב | ערך |
|---|---|
| `--positive-color` | `#00854d` |
| `--negative-color` | `#d83a52` (באדג' התראות) |
| `--warning-color` | `#fdab3d` |
| סטטוס תיק "פתוח" | bg `#e8f6ee` / fg `#00734a` |
| סטטוס "סגור" / `cvs-statusdone` | bg `#ffe4d9` / fg `#c2410c` |
| `cvs-statuswait` | bg `#fdeeda` / fg `#854f0b` |
| `cvs-statusprog` | bg `--brand-tint` / fg `--brand-navy` |
| איחור (`cvs-state-late`) | bg `#f7ded6` / fg `#9e2b12`; תאריך מאחר `#b4310f` |
| בקרוב (`cvs-state-soon`) | bg `#e3ecfa` / fg navy |
| תאריך הודעה (דף בית) | bg `#fdeeeb` / fg `#b33d2b` (`--hp-accent-*`) |

**תגיות סוג מסמך** (`.cvs-typetag`, pill, `400 13px`, padding `2px 9px`):

| סוג | רקע | טקסט |
|---|---|---|
| פרוטוקולים | `#e4f1f8` | `#15728c` |
| תצהירים | `#ddf2ec` | `#167859` |
| כתבי טענות | `#eaf2fc` | `#366fac` |
| החלטות בתיק | `#fbf0d6` | `#8d650c` |
| בקשות והוראות | `#ffe9e0` | `#b14a27` |
| סיכומים | `#f3edf8` | `#8654a6` |
| חוות דעת | `#efecfa` | `#655cbd` |

**תגיות סוג החלטה** (`.dc-tag`, pill `400 13px`, padding `2px 10px`): החלטה: tint/navy · פסק דין: `#e8f6ee`/`#00734a` · צו: `#fff1e0`/`#b45309` · פרוטוקול והחלטה: `#f3f0fb`/`#5b3fa0`.

### 2.4 טיפוגרפיה

Font: `"Rubik", "Segoe UI", Roboto, sans-serif`. Mono: `ui-monospace, "SF Mono", Menlo, Consolas`.

| Role token | Weight / Size / Line-height | שימוש |
|---|---|---|
| `--display` | 600 / 40 / 52 | – |
| `--h1` | 600 / 30 / 42 | |
| `--h2` | 600 / 24 / 32 | |
| `--h3` | 600 / 18 / 26 | כותרות כרטיסי שירות |
| `--h4` | 600 / 16 / 22 | |
| `--h5` | 600 / 14 / 20 | |
| `--body-lg` | 400 / 16 / 24 | |
| `--body` | 400 / 14 / 20 | **ברירת מחדל ל־body** |
| `--body-sm` | 400 / 12 / 16 | |
| `--label` | 500 / 13 / 18 | |
| `--button` | 500 / 14 / 20 | |

גדלים שבשימוש בפועל במסכים:

| אלמנט | ערך |
|---|---|
| כותרת דף הבית `.hp-h1` | 700 35px, navy, ממורכז (מובייל 26px) |
| כותרת מסך פנימי `.dc-title` | 700 26px/1.25, `#1a1a1a` |
| כותרת תיק `.cvs-casetitle` | 700 21px/1.3, `#1a1a1a` |
| כותרת כרטיס או פאנל | 500 17px (`--fg-2` או navy) |
| תווית שדה | 500 12px `--fg-2` (בית) / 400 13px `--fg-2` (פנימי) |
| תווית רייל | 400 11px/1.25, navy |
| תא טבלה | 400 15px; כותרת טבלה 500 14px `--fg-2` |
| letter-spacing של כותרות | `--tracking-tight: -0.2px` |

### 2.5 ריווח, רדיוסים, צללים ותנועה

**Spacing scale:** `2 4 8 12 16 20 24 32 40 48 64 80` (`--space-N`).

**Radius:**

| Token | ערך | שימוש |
|---|---|---|
| `--border-radius-small` | 4px | פריטי תפריט, פריטי רייל |
| – | 6px | כפתורים, inputs, select, icon buttons |
| `--border-radius-medium` | 8px | Dropdown / fly-out, כפתורי טבלה |
| – | 12px | כרטיסים במסכים פנימיים |
| – | 14px | תפריט התחברות, חלונית מידע |
| `--border-radius-big` | 16px | – |
| – | 18–20px | כרטיסי דף הבית |
| `--border-radius-pill` | 999px | תגיות, רדיו, מספר תיק |

**Shadows:**

| Token | ערך | שימוש |
|---|---|---|
| `--box-shadow-xs` | `0 4px 6px -4px rgba(0,0,0,.1)` | כפתורים צפים בתוך PDF |
| `--box-shadow-small` | `0 4px 8px rgba(0,0,0,.12)` | |
| `--box-shadow-medium` | `0 6px 20px rgba(0,0,0,.15)` | **כל ה־dropdowns וה־fly-outs** |
| `--box-shadow-large` | `0 15px 50px rgba(0,0,0,.22)` | טבלת מסמכים במצב מורחב |
| `--box-shadow-focus` | `0 0 0 2px #e8eff9, 0 0 0 4px #2a6fdb` | focus ring |
| Header | `0 1px 6px rgba(20,40,80,.07)` | |
| כרטיס פנימי | `0 2px 10px rgba(20,40,80,.07)` | |
| כרטיס דף בית | `0 2px 4px rgba(20,40,80,.04), 0 14px 38px rgba(20,40,80,.08)` | |

**Motion:**

| Token | ערך |
|---|---|
| `--motion-productive-short / medium / long` | 70 / 100 / 150ms |
| `--motion-expressive-short / long` | 250 / 400ms |
| `--motion-timing-enter` | `cubic-bezier(0,0,.35,1)` |
| `--motion-timing-exit` | `cubic-bezier(.4,0,1,1)` |
| `--motion-timing-transition` | `cubic-bezier(.4,0,.2,1)` |
| `--motion-timing-emphasize` | `cubic-bezier(0,0,.2,1.4)` |

ברירת מחדל: כל `input, select, button, summary, a` מקבלים transition של `background-color / border-color / color` במשך `100ms` עם `--motion-timing-transition`. ריחוף על שורות ועל פריטי רייל: `.12s ease`.

---

## 3. מסגרת העמוד (App Shell)

> **מקור האמת למסגרת: עמוד "איתור החלטות"** (`docs-inline/decisions.html` בריפו [HannaHuri/case-view-lawyer](https://github.com/HannaHuri/case-view-lawyer), ענף `main`). אותה מסגרת בדיוק, ב־markup זהה, משמשת גם את מסך התיק (`index.html`). ההבדל היחיד: כפתור "חיפוש" בהדר. כל מסך פנימי חדש צריך לרשת את המסגרת הזו **כמו שהיא**, כולל הלוגו, שדות האיתור בהדר ותפריט המשתמש.
>
> מסגרת מלאה: [`45-frame-decisions.png`](screenshots/45-frame-decisions.png)

המסגרת בנויה מ**רייל אייקונים קבוע בצד ימין** ומ**הדר עליון**. יחד הם יוצרים "מסגרת" לבנה אחת סביב התוכן, בלי קו בפינה שבה הם נפגשים.

```
┌──────────────────────────────────────────────────────────────────────────┬───────┐
│ [▾ עו"ד (יכ)] [🔔3]  │ [נקה][חיפוש][00000]-[00-00][(שדות תיק ישן)][סוג תיק ▾] │ [לוגו]│האזור  │ ← Header 62px
│   אזור משתמש        │             שורת איתור (flex:1)                  │ 260px │ שלי   │   sticky, z 30
├──────────────────────────────────────────────────────────────────────────┤───────│
│                                                                          │איתור  │
│               תוכן העמוד  (bg #f4f8fc, max-width 1840, padding 0 32)     │תיקים  │ ← Rail 68px
│                                                                          │ ...   │   fixed, z 40
└──────────────────────────────────────────────────────────────────────────┴───────┘
```

### 3.1 Layout

| מאפיין | ערך |
|---|---|
| `body` | `display:flex; flex-direction:column; min-height:100vh; padding-right:68px` (מקום לרייל). רקע `#f4f8fc` |
| Header (`#cvsTopHeader`) | `background:#fff; position:sticky; top:0; z-index:30`; צל `0 1px 6px rgba(20,40,80,.07)` |
| Header inner | `max-width:1840px; margin:0 auto; padding:12px 32px; display:flex; align-items:center; gap:0; dir="rtl"`. **גובה קבוע 62px** (`height:62px`, ה־padding האנכי מאופס ב־`styles.css`) כדי שהלוגו לא יזוז בין עמודים |
| תוכן העמוד | `max-width:1840px; margin:0 auto; padding:0 32px 110px` |
| Rail | `position:fixed; top:0; right:0; bottom:0; width:68px; background:#fff; z-index:40; overflow:visible` |
| קו בין הרייל לתוכן | `::before` ברוחב 1px, `#e1e6ef`, לכל גובה הרייל (כולל רצועת ההדר) |
| `--cvs-hdr-h` | JS מודד את גובה ההדר (ResizeObserver) ושם אותו ב־CSS var, כדי שהפריט "האזור שלי" ברייל יתיישר בדיוק עם רצועת ההדר |
| Footer | footer כהה משותף בתחתית (`#siteFooter`), ראו 3.6 |

### 3.2 Header: מבנה בשלוש עמודות (RTL, מימין לשמאל)

| # | עמודה | מפרט |
|---|---|---|
| 1 | **לוגו** | `width:260px; flex-shrink:0; justify-content:flex-start`. רוחב העמודה שווה לרוחב תפריט התיק (260) שמתחתיה, כך שהקצוות הימניים מתיישרים |
| 2 | **שורת איתור** | `flex:1; min-width:0; display:flex; align-items:center; gap:8px; padding-right:6px`. נקודת ההתחלה שלה מתיישרת עם קצה התוכן הראשי |
| 3 | **אזור משתמש** | `display:flex; align-items:center; gap:6px; flex-shrink:0` |

#### 3.2.1 לוגו

| מאפיין | ערך |
|---|---|
| קובץ | `assets/42f818ae-3d00-4df0-9bfa-da8197a00c3c.png` (PNG 178×43, שקוף). כולל את סמל המדינה ואת "הרשות השופטת / מדינת ישראל" |
| תצוגה | `<img id="cvsLogo" style="height:36px">` → 149×36 |
| קישור | `<a href="home.html" title="לדף הבית">` |
| alt | "מדינת ישראל, הרשות השופטת — לדף הבית" |

#### 3.2.2 שורת האיתור: השדות משתנים לפי סוג התיק

> תוכן: רשימת סוגי התיק, השדות הנדרשים לכל סוג ופורמט המספר נלקחים מהאתר המקורי. מה שמחייב כאן הוא **המנגנון והעיצוב**: השדות משתנים במקום, באותה שורה, בלי פריסה נוספת.

**הכלל:** ה־select הראשון ("סוג תיק") קובע אילו שדות מופיעים ובאיזה פורמט מקלידים את מספר התיק. השדות נשארים באותו סדר ובאותו מקום; רק השדות של "תיק ישן" נוספים, ושדה החודש־שנה מצטמצם.

סדר השדות (RTL, מימין לשמאל):
`[סוג תיק ▾]` → *(בתיק ישן בלבד: `[בית משפט ▾]` `[סוג תיק ▾]`)* → `[מספר A]` `-` `[מספר B]` → `[חיפוש]` → `נקה`

| סוג תיק (`#cvsCaseType`) | שדות נוספים | מספר A (`#cvsCaseNumA`) | מספר B (`#cvsCaseNumB`) | צילום |
|---|---|---|---|---|
| **תיק בית משפט** (`court`, ברירת מחדל) | – | **חודש ושנה**: רוחב 56, `maxlength=5`, placeholder `00-00`, title/aria-label "חודש ושנה" | מספר סידורי: רוחב 64, `maxlength=5`, placeholder `00000` | [`40-header-court.png`](screenshots/40-header-court.png) |
| **תיק תעבורה** (`traffic`) | – | זהה ל"תיק בית משפט" (56, `00-00`) | זהה (64, `00000`) | [`41-header-traffic.png`](screenshots/41-header-traffic.png) |
| **תיק ישן** (`old`) | **בית משפט** (select 176px) + **סוג תיק** (select 120px), מופיעים **לפני** המספר (`#cvsOldCaseFields`, `display:flex; gap:8px`) | **שנה בלבד**: רוחב **44**, `maxlength=2`, placeholder `00`, title/aria-label "שנה" | ללא שינוי (64, `00000`) | ריק: [`42-header-old-empty.png`](screenshots/42-header-old-empty.png) · ממולא: [`43-header-old-filled.png`](screenshots/43-header-old-filled.png) |

**התנהגות בהחלפת סוג תיק:**
- כל החלפה **מאפסת את שני שדות המספר**, כי מספר שהוקלד בפורמט אחד חסר משמעות בפורמט השני. האיפוס לא קורה בטעינת העמוד, כדי לא למחוק את מספר התיק הפתוח.
- ה־placeholder מראה את **צורת הערך** (`00-00` / `00`) ולא שם של שדה. זה תואם לטופס "איתור החלטות".
- רוחב שדה A משתנה במקום (56↔44). לא נבנית פריסה שנייה.

**מפרט השדות:**

| שדה | מפרט |
|---|---|
| Select "סוג תיק" | `select.cvs-select` (appearance:none), 150×36, `padding:4px 28px 4px 10px`, `1px solid --border-field`, radius 6, `400 14px Rubik`, צבע `--fg-1`, bg `#fff`. אפשרויות: תיק בית משפט / תיק תעבורה / תיק ישן |
| חץ ה־select | SVG chevron-down 14px, `stroke-width:2`, `--fg-2`, ממוקם `position:absolute; left:8px; top:50%` ועם `pointer-events:none` |
| Select "בית משפט" (תיק ישן) | 176×36, `padding:4px 12px 4px 28px`, צבע `--fg-2` כשמוצג placeholder (option ראשון `disabled selected` "בית משפט"). אפשרות לדוגמה: "בית משפט השלום חדרה" |
| Select "סוג תיק" (תיק ישן) | 120×36, אותו עיצוב; placeholder "סוג תיק"; אפשרות לדוגמה: "אזרחי" |
| Inputs מספר | גובה 36, `padding:4px 6px`, `1px solid --border-field`, radius 6, `400 14px Rubik`, **`text-align:center`**, bg `#fff`; placeholder בצבע `--fg-3` (לא ברירת המחדל של הדפדפן) |
| מפריד | `-` בצבע `--fg-3` |
| כפתור **חיפוש** (`#cvsHeaderSearch`, `.cvs-btn`) | גובה 36, `padding:0 16px`, bg `--brand-tint`, טקסט `--brand-navy` `500 14px`, `1px solid --brand-tint`, radius 6. Hover: bg ו־border `--primary-selected-hover-color` `#b8cdec`. פעולה: מעבר למסך התיק (`index.html`) |
| **נקה** (`#cvsHeaderClear`, `.cvs-headerclear`) | כפתור־קישור: גובה 36, `padding:0 4px`, ללא רקע, `400 14px` navy, `underline`, `text-underline-offset:3px`. Hover: `--brand-navy-hover`. פעולה: מחזיר את סוג התיק ל"תיק בית משפט", מנקה את שני המספרים ואת שדות התיק הישן, ושם focus על המספר הסידורי (B), שמוקלד ראשון [`44-header-cleared.png`](screenshots/44-header-cleared.png) |

**מצבי שדות (גלובלי, `styles.css`):** hover: `border-color: --fg-2` · focus: `outline:none; border-color:#0073ea` · transition `100ms` על רקע, border וצבע.

#### 3.2.3 אזור משתמש

[`46-header-avatar-menu.png`](screenshots/46-header-avatar-menu.png)

| אלמנט | מפרט |
|---|---|
| **פעמון** `.cvs-bellbtn` | 34×34 עיגול, `1px solid --border-1`, bg `#fff`, אייקון bell (Lucide) **20px** navy. Hover: bg `--brand-tint`, border `--brand-tint-strong`. `aria-label="הודעות"` |
| באדג' `.cvs-bellbadge` | 16×16 עיגול, `--negative-color` `#d83a52`, לבן `400 10px/16px`, `top:-8px; left:-3px` |
| **טריגר משתמש** `summary.cvs-avatartrig` | flex, gap 7, `padding:2px 4px 2px 6px`, radius 6 (**לא pill**). Hover `rgba(0,30,64,.05)`, Open `rgba(0,30,64,.06)` |
| ↳ `.cvs-avatarcircle` | 34×34, bg tint, ראשי תיבות "יכ" `600 14px` navy |
| ↳ `.cvs-avatarrole` | "עו"ד", `500 13px` navy. מציג **באיזה כובע** המשתמש פועל |
| ↳ `.cvs-avatarchev` | 14px, `--fg-3`, `stroke-width:2.2`; כשהתפריט פתוח מסתובב 180° (`.15s`) |
| **תפריט** | `position:absolute; top:calc(100% + 6px); left:0`, bg `#fff`, radius 8, `--box-shadow-medium`, padding 8, `min-width:210px`, z 30 |
| ↳ חשבון פעיל | `.cvs-menuitem.cvs-acctactive`: bg `--brand-tint` קבוע, padding `8px 12px`. שורה ראשונה "עו"ד ישראל כהן" `600 15px --fg-1`, שורה שנייה "מ.ר 45213" `400 13px --fg-3`, ו־✓ navy 17px. אין מפריד בין החשבונות: הגוון עושה את ההפרדה |
| ↳ חשבון נוסף | "ת.ז 012345678" `600 15px`, padding `8px 12px`; hover `rgba(103,104,121,.1)` |
| ↳ מפריד | `border-top:1px solid --border-1; margin:4px -8px` |
| ↳ **יציאה** | אייקון log-out 16px + "יציאה" `400 15px`, padding `9px 12px`, gap 8 |
| סגירה | לחיצה בכל מקום מחוץ לתפריט סוגרת אותו, וכך גם כל fly-out פתוח ברייל |

> בדף הבית (`home.html`) ההדר שונה: אין שורת איתור, ולאורח מוצג כפתור "התחברות". ראו 3.5.

### 3.3 Rail (סיידבר ימני עם כפתורי פעולות)

[`45-frame-decisions.png`](screenshots/45-frame-decisions.png) · hover ו־active: [`48-rail-hover-active.png`](screenshots/48-rail-hover-active.png) · fly-out: [`47-rail-flyout-decisions.png`](screenshots/47-rail-flyout-decisions.png)

**מבנה:** `.cvs-thinscroll` (fixed) ובתוכו `.cvs-railInner`: `display:flex; flex-direction:column; align-items:center; gap:4px; padding:20px 3px 4px; min-height:100%`. כשיש "האזור שלי" ה־padding-top מתאפס, כדי שהפריט יישב ברצועת ההדר.

> תוכן: הפריטים, התוויות, האייקונים ותפריטי המשנה שבטבלה הם הדוגמה מאב־הטיפוס. הרשימה בפועל נלקחת מהאתר המקורי, וכל פריט מקבל את מפרט "פריט רייל" ו־"Fly-out" שלמטה.

| # | פריט | אייקון (Lucide, 19px) | סוג | תפריט משנה (fly-out) |
|---|---|---|---|---|
| 0 | **האזור שלי** `.cvs-raildash` | איור `illus-card.svg` 26×26 | `div role="button" tabindex="0"` | – (קישור לאזור האישי) |
| 1 | **איתור תיקים** | search | `details.cvs-railnav` | תיקים לפי מס' תיק מקור · תיקים לתאריך פתיחה · התיקים שלי |
| 2 | **פתיחת תיק** | file-plus | `details` | פתיחת תיק · הגשת תביעה בדיון מהיר בבית הדין לעבודה |
| 3 | **הגשות** | download | `details` | בקשה חדשה · כתב טענות לבקשה קיימת · הגשות אחרות · איתור הגשות לפי אסמכתא |
| 4 | **יומן דיונים** | calendar | `details` | יומן בית משפט · דיונים לשופט ליום דיונים · הדיונים שלי |
| 5 | **איתור החלטות** | file-check | `div.dc-railactive aria-current="page"` (בעמוד הזה) | – |
| 6 | **תשלומים** | credit-card | `details` | תשלום שוברים · תשלום אגרת בקשה מראש |

**פריט רייל** (`summary` / `div`):

| מאפיין | ערך |
|---|---|
| Layout | `display:flex; flex-direction:column; align-items:center; gap:5px; padding:10px 4px; border-radius:4px` (`!important` מ־`styles.css`; גם בפריט הפעיל); `width:100%` (62px) |
| גובה | 58 (תווית בשורה אחת) / 72 (שתי שורות; שבירה מכוונת ב־`<br>`) |
| אייקון | SVG 19×19, `stroke-width:2`, `stroke:currentColor` |
| תווית | `400 11px Rubik`, `line-height:1.25`, ממורכזת |
| צבע | אייקון ותווית **`--brand-navy`** (ה־`--fg-2` ב־inline style נדרס ב־`styles.css` עם `!important`) |

**מצבים:**

| מצב | מראה |
|---|---|
| default | שקוף; navy |
| hover | bg `--cvs-hover` `#d6e6fa`, transition `.12s ease` |
| open (fly-out פתוח) | הרקע של hover נשאר כל עוד `details[open]` |
| **active / current page** (`.dc-railactive`, `aria-current="page"`) | bg `--brand-tint` `#e8eff9`, svg stroke navy, תווית navy **500**, `cursor:default` |
| focus-visible | `outline:2px solid --brand-azure; outline-offset:2px` |

**"האזור שלי"** (`.cvs-raildash`): גובה `calc(var(--cvs-hdr-h) - 8px)` = 54, `margin:4px 2px 2px`, `padding:8px 2px 2px`, radius 8. תווית `400 11px` navy. **אין לו רקע במצב רגיל**, כי האיור הוא שמבליט אותו. הגוון tint שמור לסימון "אתה כאן". Hover `--cvs-hover`.

**Fly-out** (`details > div`):

| מאפיין | ערך |
|---|---|
| מיקום | `position:absolute; top:0; right:calc(100% + 10px)`: נפתח **שמאלה** מהרייל, מיושר לראש הפריט; z 30 |
| מעטפת | `width:230px`, bg `#fff`, radius 8, padding 8, `--box-shadow-medium` |
| פריט | `padding:9px 12px; border-radius:4px; font:400 15px/1.35 Rubik; color:--fg-1`; hover `--cvs-hover` |
| סגירה | לחיצה על אותו פריט, לחיצה בכל מקום מחוץ לתפריט, Esc. רק fly-out אחד פתוח בכל רגע |

### 3.4 Z-index

| שכבה | z |
|---|---|
| Fly-outs בתוך הרייל, תפריטי משנה, svcmenu | 20–30 |
| Header | 30 |
| Backdrop של מגירה במובייל, `#cvsSidebarReopen` | 35 |
| Rail | 40 |
| Dropdowns (התחברות, why, info, עמודות) | 40 |
| טבלת מסמכים מורחבת (`.cvs-docspinned`) | 45 |
| Tooltip (`#cvsProcTip`) | 60 |

### 3.5 הדר בדף הבית (`home.html`): וריאציה

בדף הבית אין שורת איתור בהדר, כי החיפוש נמצא בכרטיס הראשי. אזור המשתמש מוצג לפי מצב ההזדהות. לאורח **לא מוצג רייל** וה־`body` לא מקבל `padding-right`.

#### A. אורח (דף הבית, לא מחובר) [`01-home-guest.png`](screenshots/01-home-guest.png)

| אלמנט | מפרט |
|---|---|
| לוגו | תמונה, גובה 36px (מובייל 32px; ב־≤359px 28px). alt: "מדינת ישראל, הרשות השופטת — לדף הבית". לחיצה מובילה ל־`home.html` |
| קישור "רישום עו"ד חדש" | `.hp-reglink`: 400 13.5px, `--brand-azure`; ריחוף: underline |
| מפריד | 1×18px, `--border-1` |
| קישור "למה להתחבר?" | `.hp-whylink`: כמו קודם. ריחוף או focus פותחים את `.hp-whypanel` (312px, radius 14, shadow-medium, padding 16/18, fade `.15s`) |
| כפתור **התחברות** | `.hp-loginbtn`: גובה 42, padding `0 24px`, radius 6, bg navy, טקסט לבן 500 15px, אייקון כניסה ברווח 8px, צל `0 2px 6px rgba(10,59,143,.16)` |

**מצבי כפתור ההתחברות:**

| מצב | מראה |
|---|---|
| default | bg `--brand-navy` |
| hover | bg `--brand-navy-hover`, צל `0 3px 9px rgba(10,59,143,.2)` |
| open (תפריט פתוח) | bg `--brand-navy-deep` |

**תפריט התחברות** (`#hpLogin`, `<details>`) [`02-home-guest-login-menu.png`](screenshots/02-home-guest-login-menu.png)
- **נפתח בריחוף** (במכשירים עם hover) עם השהיית סגירה קצרה, וגם בלחיצה או במקלדת. נסגר ב־Esc ובלחיצה מחוץ לתפריט. במגע: נגיעה פותחת ונגיעה נוספת סוגרת.
- תיבה: רוחב 316px, `top:100%; left:0`, padding-top 8 (גשר לריחוף), box: `#fff`, radius 14, shadow-medium, padding 8.
- כותרת "בחירת שיטת הזדהות": 500 12px `--fg-3`.
- אופציה `.hp-loginopt`: padding `11px 12px`, radius 8, gap 12. אייקון 38×38 radius 9 bg tint. כותרת 500 15px, תת־כותרת 400 12px `--fg-3`.
  - hover: bg `--brand-tint`, וריבוע האייקון הופך ל־`#fff`.
  - אפשרויות: **כרטיס חכם** ("למורשי גישה ועורכי דין") · **הזדהות ממשלתית** ("כניסה באמצעות קוד ה־SMS").
- פעולות שדורשות הזדהות (`[data-auth]`) פותחות את התפריט הזה וגוללות לראש העמוד, במקום לנווט לעמוד התחברות.

#### B. משתמש מחובר [`06-home-lawyer.png`](screenshots/06-home-lawyer.png)

בצד שמאל, משמאל לימין: **אווטאר + תפקיד ▾**, **פעמון**.

| אלמנט | מפרט |
|---|---|
| פעמון `.cvs-bellbtn` | 34×34 עיגול, `1px solid --border-1`, bg `#fff`, אייקון navy |
| ↳ hover | bg `--brand-tint`, border `--brand-tint-strong` |
| באדג' `.cvs-bellbadge` | 16×16 עיגול, `--negative-color`, לבן 400 10px/16px, ממוקם `top:-8px; left:-3px` |
| טריגר אווטאר `.cvs-avatartrig` | flex gap 7, padding `2px 4px 2px 6px`, radius 6 (**לא pill**) |
| ↳ עיגול `.cvs-avatarcircle` | 34×34, bg tint, ראשי תיבות 600 14px navy |
| ↳ תפקיד `.cvs-avatarrole` | 500 13px navy ("עו"ד") |
| ↳ חץ `.cvs-avatarchev` | 14px `--fg-3`; במצב open מסתובב ב־180° (`.15s`) |
| ↳ hover / open | bg `rgba(0,30,64,.05)` / `.06` |
| צ'יפ ארגון (`#as=org`) `.hp-orgchip` | padding `2px 8px`, radius 6, bg `--brand-tint-strong`; ב־≤640 רק אייקון |

**תפריט אווטאר** [`07-home-lawyer-avatar-menu.png`](screenshots/07-home-lawyer-avatar-menu.png)
- פאנל: רוחב 282, bg `#fff`, radius 8, padding 8, shadow-medium.
- שם המשתמש: 600 16px, padding `8px 12px 6px`.
- שורות `.cvs-menuitem` (החלפת חשבון): גובה 34, padding `8px 12px`, radius 4, gap 8.
  - hover: `rgba(103,104,121,.1)`.
  - **חשבון פעיל** `.cvs-acctactive`: bg `--brand-tint` קבוע ו־✓. הוא לא מגיב לריחוף.
  - חשבונות: `עו"ד, מ.ר 45213` · `ת.ז 012345678` · `ת.ז 012345678, חברת אלפא בע"מ`.
- מפריד, ואחריו **יציאה** (אייקון יציאה, 400 15px).
- החלפת חשבון משנה רק את ה־hash (`#as=lawyer|id|org`). העמוד לא נטען מחדש וכל התפריטים הפתוחים נסגרים.

וריאציות משתמש: [`11-home-id-user.png`](screenshots/11-home-id-user.png) (ת.ז), [`12-home-org-user.png`](screenshots/12-home-org-user.png) (חברה).

### 3.6 Footer

Footer כהה משותף לכל העמודים (`#siteFooter`). כולל קישורים, פרטי קשר ואייקונים. רספונסיבי: ב־≤1180 padding של `56px 40px` ועמודות שנשברות; ב־≤860 padding של `44px 20px` ועמודה אחת. [`01-home-guest.png`](screenshots/01-home-guest.png) (צילום עמוד מלא).

---

### 3.7 אורח ומחובר בעמודים הפנימיים (`site.js`)

כל עמוד פנימי מציג את ההדר לפי מצב ההתחברות, כמו דף הבית:

| מצב | הדר | רייל |
|---|---|---|
| אורח | שורת איתור תיק + כפתור "התחברות" (תפריט: כרטיס חכם / הזדהות ממשלתית) | רגיל, בלי "האזור שלי" |
| מחובר (עו"ד / ת.ז / ת.ז מטעם חברה) | שורת איתור תיק + פעמון + תפריט המשתמש (החלפת חשבון, יציאה) | רגיל, עם "האזור שלי" |

- המצב עובר מדף הבית בכתובת: `?as=lawyer` / `id` / `org` / `guest`. בין העמודים הפנימיים הוא נשמר ב־`sessionStorage`, וקישור חזרה לדף הבית מוסיף `#as=…`.
- `site.js` נטען ב־`<head>` וכותב `data-user` ו־`data-org` על `<html>`. אזור המשתמש בהדר הוא `<div class="nh-user" id="nhUser"></div>` ומיד אחריו `NH.renderUser(...)`, כדי שלא יהבהב מצב שגוי.
- ה־CSS ב־`styles.css` ("Signed-in state"). התחברות, החלפת חשבון ויציאה קורות במקום, בלי לעזוב את העמוד.

---

## 4. רכיבים (Components) ומצבים

### 4.1 כפתורים

| Variant | Class | גודל | Default | Hover | אחר |
|---|---|---|---|---|---|
| **Primary** | `.dc-btn-primary` / `.hp-searchbtn` | h38 (פנימי) / h46 (בית), padding `0 22–28px`, radius 6, 500 14–15px | bg navy, לבן | bg `--brand-navy-hover` (+צל בבית) | – |
| **Primary: אורח** | `body:not([data-user]) .hp-searchbtn` | | bg `--brand-tint-strong`, navy, בלי צל | `#c2d3ec` | הכפתור עובד; זה רק סימון ויזואלי שהתוצאות יהיו חלקיות |
| **Secondary / Outline** | `.dc-btn-ghost` / `.hp-morelink` / `.cvs-dmorebtn` | h38/46, radius 6–8 | bg `#fff`, `1px --border-1`, navy | bg ו־border `--brand-tint` (או border navy) | |
| **Soft** | `.cvs-btn` (חיפוש בהדר) | h36 | bg tint, navy | `#b8cdec` | |
| **Neutral** | `.hp-clearbtn` | h46 radius 11 | bg `--bg-2`, `--fg-2` | bg `#e7ebf3`, `--fg-1` | |
| **Link-button** | `.cvs-headerclear`, `.cvs-dmore`, `.hp-newsmorebtn` | – | navy או azure, 400 13–14px | underline / bg `#f2f6fd` | |
| **Icon** | `.cvs-iconbtn` / `.dc-iconbtn` | 28×28 radius 6, svg 16 | שקוף, `--fg-2/3` | bg `--bg-2` או tint, navy | `-on`: bg `#e8f0fb`, `#001E40` |
| **Icon outlined** | `.cvs-filtertoggle`, `.cvs-expandbtn` | 28–30, radius 8, `1px --border-1` | `#fff`, `--fg-2` | border navy, navy (expand: bg navy, לבן) | `.cvs-toggle-on`: bg tint, navy |
| **Round** | `.cvs-casecollapse`, `.cvs-bellbtn` | 28 / 34, עיגול | `#fff` + border | tint | |
| **Download** | `.cvs-dlhead` | h30 padding `0 12px` radius 8, 500 13px | `#fff` border | tint | `[hidden]` עד שמסומנות שורות |

### 4.2 שדות טופס

| רכיב | מפרט | מצבים |
|---|---|---|
| **Input (בית)** `.hp-input` | h46, radius 11, `1px --border-field`, bg `#fbfcfe`, 400 15px, padding `0 13px`; מספר `.hp-num` ברוחב 74 וממורכז | focus: bg `#fff` + ring `0 0 0 4px rgba(42,111,219,.1)` |
| **Select (בית)** `.hp-select` | כמו ה־input; חץ SVG 14px `#676879` בצד שמאל במרחק 11px | כנ"ל |
| **Select (פנימי)** `.dc-select` | h38, radius 6, `1px --border-field`, padding `4px 11px`, חץ 12px משמאל | hover border `--fg-2`; focus border navy; **disabled**: bg `#f7f9fc`, טקסט `--fg-disabled`, `not-allowed`, בלי שינוי בריחוף |
| **Underline input** `.dc-input` | h38, bg שקוף, רק `border-bottom: 1.5px solid --border-field`, 400 15px; placeholder `--fg-3` | hover `--fg-2`; focus navy |
| **Date** `.dc-input.dc-date` | כמו `.dc-select` | |
| תווית `.dc-label` / `.hp-label` | 400 13px / 500 12px `--fg-2`, gap 6 מהשדה | `.dc-field-off .dc-label` → `--fg-disabled` |
| טקסט עזר `.dc-fieldhint` | 400 12.5px `--fg-3` ("מקלידים את מספר התיק, ואחריו חודש ושנה") | |
| **Checkbox** | native, `accent-color: --brand-navy`, 15×15 | |

### 4.3 Radio pills `.dc-radio`

h38, padding `0 10px`, radius 999, gap 7, 400 14px. Hover: bg `#f1f5fa`. **Checked**: טקסט navy 500. ה־input הוא native עם accent navy. [`14-decisions-empty.png`](screenshots/14-decisions-empty.png)

### 4.4 Segment control `.hp-seg` (דף הבית: החלטות / תיקים)

קונטיינר: padding 3, bg `--bg-2`, radius 9, gap 2. כפתור: padding `8px 30px`, radius 7, 500 15px `--fg-2`. Hover: `--fg-1`. **Selected** (`aria-selected="true"`): bg `#fff`, navy 600, צל `0 1px 3px rgba(20,40,80,.13)`. [`04-home-guest-tab-cases.png`](screenshots/04-home-guest-tab-cases.png)

### 4.5 Tabs `.dc-tab` (איתור החלטות: לפי תיק / לפי פרמטרים)

שורת tabs עם `border-bottom: 1.5px solid --border-1`. Tab: padding `13px 14px 12px`, 500 15px `--fg-2`, radius `8 8 0 0`, `border-bottom 2.5px transparent`.
- Hover (לא פעיל): navy + קו תחתון tint.
- **Active**: navy + קו תחתון navy.

[`15-decisions-params-tab.png`](screenshots/15-decisions-params-tab.png)

### 4.6 Icon toggle group `.cvs-toggle-group`

קונטיינר bg `--bg-2` radius 7 padding 2. כפתור 28×24 radius 5. Active: `#fff` + shadow-xs + navy. Hover: `rgba(255,255,255,.55)`.

### 4.7 Dropdown / Menu (דפוס משותף)

| מאפיין | ערך |
|---|---|
| מעטפת | `#fff`, radius 8 (תפריטים) או 14 (popovers עשירים), shadow-medium, padding 6–8 |
| פריט | padding `9–10px 12px`, radius 4–7, 400 14–15px |
| Hover | `--cvs-hover` או `--brand-tint` (בפריט עם אייקון) |
| נבחר | bg `--brand-tint` + ✓ |
| מימוש | `<details><summary>`, סגירה בלחיצה מחוץ לתפריט וב־Esc |

דוגמאות: תפריט עמודות [`23-index-docs-columns.png`](screenshots/23-index-docs-columns.png), תפריט פילטר [`23b-index-docs-filter-menu.png`](screenshots/23b-index-docs-filter-menu.png), תפריט שירותים [`09-home-lawyer-svc-menu.png`](screenshots/09-home-lawyer-svc-menu.png).

### 4.8 Popover מידע (ⓘ)

- `.hp-info` (בכרטיס החיפוש, `top:20px; left:24px`): כפתור `--fg-3`, ובריחוף navy. Popover ברוחב 292, radius 14, padding `16px 18px`, טקסט 400 13.5px/1.6. נפתח ב־hover/focus; במגע ב־click (`.is-open`). [`03-home-guest-info-panel.png`](screenshots/03-home-guest-info-panel.png)
- `.dc-info` (ליד "תיק ישן"): 24×24 עיגול, hover/expanded: bg `#f1f5fa` navy. Popover ברוחב 300, radius 10, padding `14px 16px`.

### 4.9 כרטיסים

| כרטיס | מפרט |
|---|---|
| כרטיס חיפוש בבית `.hp-card` | radius 20, padding `30px 38px 24px`, צל כרטיס־בית |
| כרטיס שירות `.hp-svc` (יומן דיונים, תשלומים, טפסים) | bg `#eef3fb`, **`border-inline-start: 5px solid navy`**, radius 18, padding `24px 26px`, איור 44px. Hover: `translateY(-2px)`, bg `#e6eef9`, צל `0 12px 26px rgba(20,40,80,.1)`, האיור `scale(1.07)`. קישורים בתוכו: 500 14px azure עם חץ ‹ |
| הודעות ועדכונים `.hp-news` | radius 18, padding `22px 26px 18px`. פריט: padding `11px 13px` radius 11; hover bg `#f2f6fd` וטקסט navy. תאריך: pill 600 11px על `#fdeeeb`/`#b33d2b`. "הצג עוד ▾": מציג את ההודעות הישנות במקום, והחץ מסתובב [`10-home-lawyer-news-more.png`](screenshots/10-home-lawyer-news-more.png) |
| Tile `.hp-tile` (פנקסים ורשימות) | `#fff`, radius 18, padding `22px 12px`, min-h 148, אייקון 46×46 radius 14 tint. Hover: `translateY(-3px)` וצל עמוק יותר, האייקון ל־tint-strong. Open (`details`): border navy + bg tint. Grid: 7 → 4 (≤1080) → 2 (≤860) |
| באנר מומחים `.hp-expert` | gradient `#e8eff9→#f6f9fd`, `1px #dbe5f3`, radius 18. באדג' "פתוח להרשמה" ירוק או "סגור" אפור (`?experts=closed`) [`13-home-experts-closed.png`](screenshots/13-home-experts-closed.png) |
| כרטיס פנימי `.dc-card` / panels | `#fff`, radius 12, `0 2px 10px rgba(20,40,80,.07)`, padding `0 22px` |
| פאנל סקירה בתיק `.cvs-dpanel` | שקוף, `1.5px solid --brand-tint-strong`, radius 10, padding `14px 12px 12px`; כותרת 500 17px navy עם אייקון 17 |

### 4.10 Case strip (רצועת פרטי תיק) `.cvs-casestrip`

[`18-index-case-overview.png`](screenshots/18-index-case-overview.png) · מכווץ: [`25-index-casestrip-collapsed.png`](screenshots/25-index-casestrip-collapsed.png)

- כרטיס: radius 12, padding `12px 18px`, margin `28px 0 16px`.
- **מספר תיק** pill: 600 14px navy על tint, padding `6px 13px`.
- כותרת הצדדים: 700 21px.
- Meta: 400 14px `--fg-2`, עם מפרידים של 1×15px.
- **דיון הבא** `.cvs-hearing`: bg navy, radius 7, תווית 13px `rgba(255,255,255,.75)` וערך 500 14px לבן.
- **סטטוס**: "פתוח" pill ירוק.
- שורת פעילות `.cvs-activityline` (אייקון ✓ וטקסט navy 500 14px): לינק ל"פעילויות לצדדים"; ריחוף מוסיף underline.
- כפתור קיפול עגול 28px (⌃).
  - **Collapsed** (`body.cvs-case-collapsed`): padding `7px 16px`, שורה אחת עם מספר · צדדים · דיון.

### 4.11 תפריט בתוך התיק (סיידבר שני, בצד ימין של התוכן) `#cvsSidebarCol`

רוחב 260, padding `8px 8px 20px 14px`, כרטיס לבן.

| פריט | מפרט |
|---|---|
| שורת ניווט `.cvs-navrow` | padding `10px 16px`, אייקון `--icon-color` ובריחוף navy |
| Hover | `--cvs-hover` |
| **Active** `.cvs-navactive` | bg `--brand-tint`, **`border-right: 3px solid navy`**, radius `4 0 0 4`, אייקון navy |
| תיקייה `.cvs-catfolder` (details) | padding `8px 43px 8px 16px`, 400 15px `#001E40`, חץ שמסתובב 180° כשפתוח |
| קטגוריה `.cvs-doccat` | כמו תיקייה; מונה `(n)` 13px `--fg-3`; פעילה: navy 600; תת־קטגוריה padding-right 58, 14px |
| כפתור קיפול `.cvs-sbtoggle` | 22×40, radius 8, `1px --border-1`, אייקון ›› navy; hover tint |
| מצב מקופל | `body.cvs-sb-collapsed`: הסיידבר ב־width 0 (`.34s`), ומופיע `#cvsSidebarReopen` צמוד לרייל (`right:68px`) עם radius `8 0 0 8` [`24-index-sidebar-collapsed.png`](screenshots/24-index-sidebar-collapsed.png) |

עץ התפריט: פרטים כלליים · מסמכים ▾ (תיק נייר / כתבי טענות ▾ / בקשות והוראות / בקשות לסעד זמני / בקשות אחרי סגירה / תצהירים / חוות דעת ▾ / החלטות בתיק / פסקי דין / פרוטוקולים ▾ / מוצגים / סיכומים / מזכירות ▾) · מועדי דיון · פעילויות לצדדים · גורמים ▾ (צדדים, באי כח, עדים ומומחים, מחזיקים) · דיון מקדמי בין בעלי הדין · תיק כספי ▾ (מצב חשבון, ערבויות ופקדונות) · תיקים קשורים.
פריטים בלי תוכן מציגים **Placeholder panel** [`26-index-placeholder.png`](screenshots/26-index-placeholder.png).

### 4.12 טבלאות (`#cvsDocsTable`, `#dcTable`)

[`20-index-docs-all.png`](screenshots/20-index-docs-all.png) · [`16-decisions-results.png`](screenshots/16-decisions-results.png)

| חלק | מפרט |
|---|---|
| Table | `table-layout:fixed`, `border-collapse:collapse` |
| `th` | sticky top, bg `#eff5fd`, 500 14px `--fg-2`, padding 8 |
| מיון `.th-sort` | חץ 12px navy; במצב idle `#a8b6cb` 80%; hover navy; עמודה ממוינת: navy |
| `td` | 400 15px `#001E40`, padding 8, `border-bottom 1px #eef1f6`, ellipsis |
| שם מסמך שלא נקרא | 600 `#001E40` |
| Row hover | `--cvs-hover`, ושם המסמך navy + underline |
| **Row active** (מסמך פתוח) | `#cadcf5` |
| Row last-viewed | `#e3ecf9` ושם navy 500 |
| שורה לא זמינה `.cvs-docrow-na` | שם `--fg-disabled`, בלי hover ו־`cursor:default` |
| עמודות sticky | checkbox + שם, bg `#fff`, צל `-7px 0 7px -7px rgba(20,40,80,.22)` בזמן גלילה |
| שינוי רוחב עמודה | ידית 9px; hover: קו 2px navy בשקיפות 45% |
| גרירת עמודות | `.cvs-col-dragging` opacity, וצל לסימון מיקום |
| פעולות שורה | אייקונים 28px: "פתיחה בצד" / "פתיחה בחלון" (`scaleX(-1)`) |
| קבצים מצורפים `.cvs-attinline` | 📎 + חץ, 500 12.5px; פתוח: שורות־בת על `#eef4fb` [`23e-index-attachments-open.png`](screenshots/23e-index-attachments-open.png) |
| שורת פילטרים | נפתחת עם `.cvs-filtertoggle` מתחת לכותרות [`22-index-docs-filters.png`](screenshots/22-index-docs-filters.png). `.cvs-filtbtn` / `.cvs-filt` h30 radius 6 `1px --border-field` (underline `.cvs-filttext`: `border-bottom 1.5px --border-field`); פעיל: tint/navy 500. תפריט: 230–320, max-h 320, חיפוש + checkboxes + מונים; טווח תאריכים + "ניקוי הטווח" |
| בחירת שורות | checkbox → מופיע כפתור **"הורדת מסמכים (n)"** `.cvs-dlhead`; ה־checkbox בכותרת עובר למצב indeterminate (−); נספחים נבחרים בנפרד [`23d-index-docs-selected.png`](screenshots/23d-index-docs-selected.png) |
| הגדרת עמודות | ⋮ `.cvs-colscfg` **24×24** (עודכן מ־22 לעמידה ב־WCAG 2.5.8), `top:6px; inset-inline-start:5px` כדי שמרכז האייקון (17px) לא זז, radius 5 → תפריט עם checkboxes, ידית גרירה ו"איפוס" |
| רשימת צפיות | ‹ בעמודה "מי צפה" (`.cvs-reltrig`) פותח את פאנל ה־views: "‹ חזרה לרשימת המסמכים" (`.cvs-viewsback`, hover tint), kicker 13px `--fg-3`, שם המסמך 17px, וטבלת grid (`1px --border-1`, radius 8, כותרת `#eff5fd`, שורות זוגיות `#f8fafd`) עם העמודות מעמד / שם משתמש / משרד / תאריך / אופן צפייה [`23c-index-views-list.png`](screenshots/23c-index-views-list.png) |
| הרחבה (CSS קיים, הכפתור לא מוצג בגרסה הזו) | `.cvs-expandbtn` → הטבלה צפה (`position:fixed`, z 45, shadow-large) ומוצגות עמודות נוספות |
| מצב ריק | `.cvs-docsempty` / `.dc-norows`: ממורכז, 400 14px `--fg-3` |

### 4.13 PDF viewer בצד הטבלה

[`21-index-doc-pdf-open.png`](screenshots/21-index-doc-pdf-open.png) · רחב: [`21b-index-doc-pdf-wide.png`](screenshots/21b-index-doc-pdf-wide.png)

- נפתח בלחיצה על שורה. width `0 → var(--pdf-w,46%)` (max 640–760), opacity, `.34s`. Padding `16px 5px 0 16px`.
- מפצל `.cvs-docssplit`: 9px, קו 2px `--border-1` וידית 9×34 לבנה; hover `--fg-2`. אפשר לגרור.
- כפתורים צפים: **סגירה ✕** ו**הרחבה ⤢** בגודל 26×26 radius 6 על tint, shadow-xs; hover tint-strong. במצב רחב ⤢: bg navy, לבן.
- **Toolbar אנכי** `.cvs-pdftool`: `left:24px`, ממורכז אנכית, bg `rgba(255,255,255,.92)` + blur 4, `1px --border-1`, radius 8, צל `0 4px 16px rgba(0,0,0,.18)`. כולל: rotate · first/prev · page input (28×24) / total · next/last · zoom + / 100% / − · grip לגרירה. כפתורים 32×32; hover `rgba(0,0,0,.05)`.
- בטבלה, כשה־PDF פתוח: padding של התאים מצטמצם ל־3–4px, ו־min-width של הטבלה 592px עם גלילה אופקית.

### 4.14 Search summary strip (אחרי חיפוש)

`.dc-summary` [`16-decisions-results.png`](screenshots/16-decisions-results.png): שורה אחת, padding `14px 22px`, אייקון 🔍 navy, מצב ("לפי תיק") navy 500, ערכים `--fg-2` עם ellipsis, ו"עריכת חיפוש ▾" בצד. Hover: bg tint. כשפותחים אותה הטופס חוזר והכפתור הופך ל"סגירה ▴" [`17-decisions-edit-search.png`](screenshots/17-decisions-edit-search.png).

### 4.15 Empty state

`.dc-empty`: אייקון 34px `--fg-3`, כותרת 500 16px `--fg-2` ("עדיין לא בוצע חיפוש"), משנה 400 14px `--fg-3` ("יש למלא שדה אחד לפחות וללחוץ אתר"), padding-top 110.

### 4.16 תגיות, באדג'ים ו־pills

ראו 2.3. כלל: pill = `border-radius:999px`, 400–600 11–13px, padding `2–4px 8–13px`. תגית מצב "באיחור" / "בעוד 6 ימים": radius **4** (לא pill), 500 11px. צד בפעילות: "נתבע" אפור `#f1f3f6`, "תובע" (אני) navy מלא לבן.

### 4.17 פירורי לחם (Breadcrumbs) `.dc-crumbs`

**כלל: כל עמוד פנימי מקבל פירורי לחם**, מעל כותרת העמוד (`.dc-title`). חריג יחיד: דף הבית (`home.html`), שהוא נקודת ההתחלה של כל שביל.

| נושא | הנחיה |
|---|---|
| מבנה | `<nav class="dc-crumbs" aria-label="פירורי לחם"><ol><li><a href="…/home.html">דף הבית</a></li><li><span aria-current="page">שם העמוד</span></li></ol></nav>` |
| הפריט הראשון | תמיד "דף הבית", קישור לדף הבית החי: `https://case-view-lawyer-docs-inline.vercel.app/home.html` |
| שלבי ביניים | רק אם לשלב יש עמוד אמיתי לחזור אליו (למשל תיק ‹ מסמך). לא מוסיפים שלב שהוא כותרת קבוצה בלבד, כמו "פנקסים, רשימות והנחיות", ולא קישור `href="#"` |
| הפריט האחרון | שם העמוד הנוכחי, זהה ל־`.dc-title`. טקסט רגיל (לא קישור) עם `aria-current="page"` |
| מפריד | `‹` שנוצר ב־CSS (`li + li::before`), כדי שקורא מסך לא יקריא אותו |
| טיפוגרפיה | 400 13px. קישורים `--fg-2`, הפריט הנוכחי `--fg-1`, מפריד `--fg-3` |
| hover / focus | hover: navy עם קו תחתון (offset 3px). focus: `--box-shadow-focus` |
| ריווח | `margin-top: 18px` מתחת להדר, ו־8px עד הכותרת (`.dc-crumbs + .dc-pagehead`) |
| מובייל | נשאר גלוי ונשבר לשורות (`flex-wrap`), בלי לקצר |

ה־CSS נמצא ב־`styles.css`. עמוד שלא טוען את `styles.css` מעתיק את אותם כללים בדיוק.

---

## 5. מסכים

> הסעיף מתאר **פריסה ומבנה** של כל מסך: אזורים, סדר, grid ומצבים. הכותרות, השדות, העמודות, הקישורים והטקסטים שמוזכרים כאן הם דוגמה מאב־הטיפוס. בפועל מתבססים על האתר המקורי.

### 5.1 דף הבית: `home.html`

| מצב | צילום |
|---|---|
| אורח | [`01-home-guest.png`](screenshots/01-home-guest.png) |
| עו"ד מחובר | [`06-home-lawyer.png`](screenshots/06-home-lawyer.png) |

**מבנה** (קונטיינר `max-width:1180px; padding:0 32px`):
1. **Hero / כרטיס חיפוש**: "איתור החלטות ותיקים", segment החלטות|תיקים, שדות (סוג תיק, מספר תיק: חודש־שנה + סידורי), חיפוש, חיפוש מורחב, ⓘ. לאורח גם הערה: "חיפוש ללא התחברות מציג מידע פומבי בלבד. **למידע מלא והזדהות**".
   - "תיק ישן" חושף שדות בית משפט + סוג תיק [`05-home-guest-oldcase.png`](screenshots/05-home-guest-oldcase.png).
   - Enter בשדה = חיפוש. חיפוש בהחלטות מוביל ל־`index.html#decisions`, וחיפוש בתיקים ל־`index.html`.
2. **כרטיסי שירות**: אורח: 2 (יומן דיונים, תשלומים). עו"ד: 3 (+ טפסים), ב־grid של 3.
3. **הודעות ועדכונים** + "הצג עוד".
4. **פנקסים רשימות והנחיות**: 7 tiles (+ "בתי המשפט – נתונים סטטיסטיים" עם תפריט שנפתח למעלה).
5. **באנר מומחים** (פתוח / סגור).
6. **Claims**: 2 כרטיסים לבנים עם חץ.
7. Footer.

### 5.2 איתור החלטות: `decisions.html`

1. Header עם שורת איתור, ורייל עם **"איתור החלטות" פעיל**.
2. כותרת "איתור החלטות" (`.dc-title`).
3. **כרטיס חיפוש**: tabs לפי תיק / לפי פרמטרים.
   - *לפי תיק*: רדיו סוג תיק (בית משפט / תעבורה / ישן + ⓘ), מספר תיק (שני underline inputs), עזרה.
   - *לפי פרמטרים*: grid של 4 עמודות (2 ב־≤1180, 1 ב־≤700): בית משפט, הליך, סוג תיק (disabled עד שנבחר הליך), סוג עניין, שופט, סוג החלטה, תאריכים…
   - Footer: **נקה** (ghost) + **אתר** (primary).
4. **תוצאות**: `height: calc(100vh - 260px)`, min 420. לפני חיפוש מוצג empty state; אחרי חיפוש הכרטיס מתקפל ל־summary strip והטבלה מוצגת (תאריך, שם, סוג, אופי, מספר תיק (לינק navy), שם תיק, שופט, בית משפט, הליך, סוג תיק). לחיצה על שורה פותחת PDF בצד.

### 5.3 מסך תיק: `index.html`

1. Header עם שורת איתור (ממולאת במספר התיק הנוכחי).
2. **Case strip**.
3. **שתי עמודות**: תפריט התיק (260, מימין) + פאנל ראשי (גמיש, `gap:24px`).
4. מצבי הפאנל הראשי (`setMainPanel`):
   - `case`: פרטים כלליים. שורת עובדות (פתיחת התיק · הליך · סכום התביעה · חסיון) + "פרטים נוספים", ו־3 עמודות: **פעילויות לצדדים**, **החלטות אחרונות**, **הגשות אחרונות** (כל אחת עם "כל ה…"). Grid: 3 → 2 (≤1400) → 1 (≤1000).
   - `docs`: טבלת מסמכים בקטגוריה [`19-index-docs-table.png`](screenshots/19-index-docs-table.png).
   - `views`: רשימת צפיות (טבלת grid) עם "חזרה".
   - `placeholder`: למסכים שעוד לא קיימים.
5. `index.html#decisions` פותח ישר את "החלטות בתיק".

### 5.4 זרימות בין מסכים

```
home (חיפוש: תיקים)    ──► index.html
home (חיפוש: החלטות)   ──► index.html#decisions
Rail "איתור החלטות"    ──► decisions.html
decisions → מספר תיק  ──► index.html
case strip "פעילות"    ──► index › פעילויות לצדדים
לוגו                   ──► home.html
פעולה שדורשת הזדהות    ──► פתיחת תפריט ההתחברות (לא ניווט)
```

---

## 6. רספונסיביות

| Breakpoint | שינוי |
|---|---|
| ≤1400 | עמודות הסקירה בתיק: 3 → 2 |
| ≤1180 | Footer נשבר; פרמטרים בהחלטות: 4 → 2 עמודות |
| ≤1080 | Tiles: 7 → 4; כרטיסי שירות של עו"ד: 2 + אחד ברוחב מלא |
| ≤1000 | עמודות הסקירה בתיק: 1 |
| **≤860** | **הרייל הופך למגירה** (ראו למטה); כרטיסים בעמודה אחת; Tiles 2; `.hp-wrap` padding 18; ההדר נשבר לשתי שורות |
| ≤700 | פרמטרים בהחלטות: עמודה אחת |
| ≤640 | קישורי ההדר (רישום / למה) נעלמים ועוברים לתוך תפריט ההתחברות (`.hp-loginextra`); לוגו 32px; תפריט ההתחברות `min(316px, 100vw-32px)` |
| ≤359 | לוגו 28px; כפתור התחברות padding 14 |

**מגירת מובייל** [`32-mobile-drawer.png`](screenshots/32-mobile-drawer.png):
- כפתור ☰ `.hp-burger` 40×40 radius 8 navy בהדר; hover `--cvs-hover`.
- הרייל: רוחב 284 (max 86vw), `translateX(100%)` → 0 ב־`.22s ease`, צל `-8px 0 24px rgba(20,40,80,.14)`. Backdrop `rgba(6,30,64,.32)` (z 35); `body{overflow:hidden}`.
- ראש המגירה: גובה 56, "תפריט" 600 17px, ✕ 40×40, קו תחתון.
- הפריטים הופכים לשורות: אייקון ולידו תווית 400 16px, padding 12, gap 12. Fly-outs נפתחים **בתוך** המגירה (static, indent של 31px).
- "אפליקציה" מוצמד לתחתית עם קו עליון.
- נסגרת בלחיצה על ה־backdrop, על ✕, על פריט שדורש הזדהות, או בשינוי hash.

צילומים: [`30`](screenshots/30-mobile-home-guest.png) · [`31`](screenshots/31-mobile-home-lawyer.png) · [`33`](screenshots/33-mobile-login-menu.png) · [`34`](screenshots/34-mobile-decisions.png) · [`35`](screenshots/35-mobile-index.png).

---

## 7. נגישות

### 7.1 תקנים

| תקן | מעמד | מה הוא דורש מהמערכת |
|---|---|---|
| **ת"י 5568: הנחיות לנגישות תכנים באינטרנט** ([חלק 1, נוסח 2023, gov.il](https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-1-september-2023.pdf)) | **מחייב.** תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, מחייבות שירות ציבורי באינטרנט לעמוד בו | מבוסס על WCAG 2.0 ברמה AA, עם התאמות ישראליות. **חלק 2** עוסק במסמכים דיגיטליים, ורלוונטי ל־PDF שנפתחים במציג. בנוסף נדרשת **הצהרת נגישות** באתר |
| **WCAG 2.2, רמה AA** (W3C) | **יעד העבודה.** מכיל את כל דרישות 2.0 ו־2.1, ולכן עמידה בו מכסה את ת"י 5568 בעודף | קריטריונים חדשים שרלוונטיים למסגרת: 2.4.11 פוקוס לא מוסתר (בגלל ההדר הנעוץ), 2.5.8 גודל מטרה של 24×24 לפחות, 1.4.11 ניגודיות של רכיבים 3:1, 1.4.10 Reflow ב־320px |
| **WAI-ARIA 1.2 + ARIA Authoring Practices (APG)** | **תקן מימוש** לרכיבים מותאמים | התבניות המחייבות לרכיבים שלנו: **Disclosure** (fly-out ברייל, תפריט משתמש, "הצג עוד", קבצים מצורפים), **Tabs** (`.dc-tab`), **Radio Group**, **Grid/Table עם מיון** (`aria-sort`), **Dialog** (חלוניות ⓘ), **Live Region** (הודעות ו־toast) |

> הערה: יש מקורות שמתארים את ת"י 5568 כמבוסס על WCAG 2.1, אבל הנוסח הרשמי שנבדק (2023) מפנה ל־WCAG 2.0. יש לאמת את הגרסה המחייבת מול מכון התקנים או נציבות שוויון זכויות לפני כתיבת הצהרת הנגישות. העבודה לפי WCAG 2.2 AA מכסה את שתי האפשרויות.

### 7.2 פערים מול התקן

| # | פער | מדידה לפני | קריטריון | סטטוס |
|---|---|---|---|---|
| 1 | **מסגרת השדות** חלשה מדי מול הרקע | `--border-1` `#c3c6d4`: 1.7:1; פילטרים `#cfdaea`: 1.41:1; underline `#cbd6e6`: 1.47:1; שדה בדף הבית `#dce4f0`: 1.25:1. הנדרש 3:1 | 1.4.11 | ✅ **תוקן.** טוקן חדש `--border-field` `#878ca0` לכל מסגרות השדות: **3.34:1** על לבן ו־3.04:1 ומעלה על כל הרקעים. `--border-1` לא השתנה ונשאר לקווים דקורטיביים. hover (`--fg-2`) ו־focus (navy) נשארים כהים יותר מהמסגרת הרגילה |
| 2 | **טקסט `--fg-3`** `#9699a6` | 2.84:1 על לבן, 2.66:1 על `#f4f8fc`. הנדרש 4.5:1 | 1.4.3 | ✅ **תוקן.** `--fg-3` = `#6c6e81`: **5.02:1** על לבן ו־4.58:1 ומעלה על כל הרקעים (`#f4f8fc`, `#eff5fd`, `#f6f7fb`). הערך הישן נשמר כ־`--fg-disabled` למצבים מושבתים בלבד, שפטורים מהדרישה |
| 3 | **Placeholder** `#c2c9d4` | 1.67:1. מראה את פורמט המספר, כלומר נושא מידע | 1.4.3 | ✅ **תוקן.** כל ה־placeholders (טפסים ושורת האיתור בהדר) ב־`--fg-3` `#6c6e81`, 5.02:1. ההבדל בינו לבין ערך שהוקלד (`--fg-1`) נשמר |
| 4 | **כפתור עמודות** `.cvs-colscfg` | 22×22 | 2.5.8 | ✅ **תוקן.** 24×24. האייקון (17px) ומרכזו לא זזים: `top:6px; inset-inline-start:5px` |
| 5 | **הדר נעוץ מסתיר פוקוס** | אלמנט שמקבל פוקוס בגלילה יכול להיות מוסתר מתחת להדר | 2.4.11 | ⏸ **לא מטופל, בהחלטה: אין שינוי בהדר.** נשאר פער פתוח בהצהרת הנגישות |
| 6 | **הדר בגובה קבוע ב־200% זום** | `height:62px` עלול לחתוך טקסט בהגדלה | 1.4.4 / 1.4.12 | ⏸ **לא מטופל, בהחלטה: אין שינוי בהדר.** נשאר פער פתוח בהצהרת הנגישות |

> **כלל שימוש על רקעים צבועים:** הערכים החדשים נבדקו על כל הרקעים הניטרליים (לבן, `#fbfcfe`, `#f4f8fc`, `#eff5fd`, `#f6f7fb`). על רקעי התכלת של המצבים, כלומר tint `#e8eff9` (4.34:1), hover `#d6e6fa` (3.96:1) ושורה פעילה `#cadcf5` (3.6:1), `--fg-3` כבר לא עומד ב־4.5:1. שם טקסט שנושא מידע מוצג ב־`--fg-1` / `#001E40`, כמו שכבר מקובל בשורות הטבלה. זה כלל שימוש, לא שינוי צבע. גם `--fg-2` לא עומד על שורה פעילה (3.93:1), ולכן הכלל חל עליו.
>
> **השפעה ויזואלית של התיקונים:** המסגרות של השדות כהות יותר; טקסט משני־שלישוני (מונים, תאריכים, עזרה, placeholder) כהה יותר וקרוב בגוונו ל־`--fg-2`, כך שההיררכיה בין השניים נשענת יותר על גודל ומשקל; כפתור העמודות גדל ב־2px. שאר הצבעים, המידות וההדר לא השתנו.

ערכים נוספים שנמדדו ו**עומדים** בתקן: `--fg-2` על לבן 5.48:1 · navy על tint 8.92:1 · navy על hover 8.14:1 · קישור azure 4.78:1 · באדג' לבן על אדום 4.52:1 · כל צמדי התגיות 4.6–5.8:1 · טבעת פוקוס azure מול tint 4.13:1 (נדרש 3:1).

### 7.3 בדיקה עם NVDA

**סביבה:** NVDA בגרסה העדכנית על Windows, עם **Chrome** ו־**Firefox** (שני הצירופים). קול עברי (eSpeak NG או Microsoft Hebrew). כל מסך נבדק במצב **Browse** ובמצב **Focus**.

**מקשים עיקריים לבדיקה:**
- `Tab` / `Shift+Tab`: מעבר בין רכיבים.
- `H`: קפיצה בין כותרות. `D`: קפיצה בין landmarks.
- `NVDA+F7`: רשימת אלמנטים (קישורים, כותרות, landmarks).
- `NVDA+Space`: מעבר בין מצב Browse למצב Focus.
- `Enter` / `Space` / `Esc`: הפעלה וסגירה.
- `Ctrl+Alt+חצים`: ניווט בטבלה.

**מה NVDA צריך להקריא, לפי רכיב:**

| רכיב | הקראה צפויה | מימוש נדרש |
|---|---|---|
| **Landmarks** | "באנר" (הדר), "ניווט" (רייל), "ראשי" (תוכן), "contentinfo" (פוטר) | `<header>`, `<nav aria-label="ניווט ראשי">`, `<main>`, `<footer>`, או roles מקבילים. **[המלצה]** היום אלה `div` |
| **לוגו** | "קישור, מדינת ישראל, הרשות השופטת — לדף הבית" | **[קיים]** alt בתוך `<a>` |
| **פריט רייל עם fly-out** | "איתור תיקים, כפתור, מכווץ". אחרי פתיחה: "מורחב", והפריטים מוקראים כקישורים | `details/summary` נותן מצב מורחב/מכווץ באופן מובנה. פריטי ה־fly-out צריכים להיות `<a>` ולא `div` **[המלצה]** |
| **פריט רייל פעיל** | "איתור החלטות, דף נוכחי" | **[קיים]** `aria-current="page"` |
| **"האזור שלי"** | "האזור שלי, כפתור" | **[קיים]** `role="button"` + `aria-label` |
| **שדות בהדר** | "סוג תיק, תיבה משולבת, תיק בית משפט" · "חודש ושנה, עריכה" · "מספר התיק, עריכה" | ל־select חסר `aria-label="סוג תיק"` **[המלצה]**. שדות המספר **[קיים]** |
| **החלפת סוג תיק** | הודעה על השדות שנוספו, למשל "נוספו שדות: בית משפט, סוג תיק" | אזור `aria-live="polite"` מוסתר ויזואלית **[המלצה]** |
| **פעמון** | "הודעות, 3 חדשות, כפתור" | `aria-label` דינמי שכולל את המספר, והבאדג' `aria-hidden="true"` **[המלצה]**. היום מוקרא "הודעות 3" |
| **תפריט משתמש** | "עו"ד, יכ, כפתור, מכווץ". בתוך התפריט החשבון הפעיל מוקרא "נבחר" | `aria-current="true"` על החשבון הפעיל **[המלצה]** |
| **טאבים** | "לפי תיק, כרטיסייה, נבחרה, 1 מתוך 2" | `role="tablist"`, `tab` ו־`aria-selected` **[קיים]**; חסרים `tabpanel` + `aria-controls` וניווט בחצים **[המלצה]** |
| **רדיו** | "תיק בית משפט, לחצן אפשרויות, מסומן, 1 מתוך 3" | **[קיים]** `radiogroup` + native radio |
| **טבלה** | שם הטבלה, מספר השורות והעמודות, וכותרת העמודה בכל מעבר תא. בעמודה ממוינת: "ממוין בסדר עולה" | `<caption>` או `aria-label`, `aria-sort` על ה־th הממוין **[המלצה]**, ו־`aria-selected` על שורה פתוחה |
| **מציג PDF** | "מסגרת, <שם המסמך>" ל־iframe יש `title="תצוגת מסמך"` **[קיים]**. מומלץ שם המסמך עצמו **[המלצה]**. כפתורי הסרגל עם `aria-label` ("הקטנה", "עמוד הבא") |
| **מצב טעינה / שגיאה / toast** | "טוען…", ההודעה עצמה ברגע שהיא מופיעה | `aria-busy`, `role="status"`, `role="alert"` (ראו 8.2–8.4) |
| **מגירת מובייל** | "תפריט, דו־שיח". הפוקוס נכנס למגירה, נשאר בתוכה עד הסגירה, וחוזר ל־☰ | `role="dialog" aria-modal="true"` + focus trap **[המלצה]** |

**קריטריון קבלה:** כל משימה מרכזית מבוצעת **רק במקלדת ועם NVDA, בלי עכבר**, ובלי מידע שחסר בהקראה. המשימות: איתור תיק מההדר, מעבר בין סוגי תיק, פתיחת fly-out ובחירת פריט, החלפת חשבון, חיפוש החלטות, מיון וסינון טבלה, ופתיחת מסמך בצד.

### 7.4 יישום קיים באב־הטיפוס

- **Focus:** `--box-shadow-focus` (טבעת 2px tint + 4px azure) או `outline: 2px solid --brand-azure; outline-offset: 2–3px`. אין להסיר outline בלי תחליף.
- **Keyboard:**
  - פריטי רייל שהם `div role="button"` מגיבים ל־Enter ול־Space.
  - Esc סוגר תפריטים.
  - Enter בשדות החיפוש מריץ את החיפוש (בדף הבית; בשורת האיתור בהדר עדיין לא, ראו 8.5).
  - Popovers נפתחים גם ב־`:focus-within`.
- **ARIA:**
  - `aria-current="page"` לפריט רייל פעיל.
  - `aria-selected` ל־segment ול־tabs.
  - `aria-expanded` ל־"הצג עוד", ל־ⓘ, ל־☰ ולקבצים מצורפים.
  - `aria-label` לאייקונים בלבד (למשל "סגירת התפריט").
- **Touch:** `@media (hover:none)`: popovers נפתחים ב־click ולא ב־hover.
- **Motion:** `prefers-reduced-motion: reduce` מבטל את ה־transitions של הטבלה ושל ה־PDF.
- **ניגודיות:** טקסט משני `#676879` על לבן עומד ב־AA (5.48:1). `--fg-3` עודכן ל־`#6c6e81` (4.58:1 ומעלה). `#9699a6` נשאר רק כ־`--fg-disabled` למצבים מושבתים. ראו 7.2.

---

## 8. הנחיות UX משלימות

> **מה הסעיף הזה ומה הוא לא.** הנחיות התנהגות שאב־הטיפוס לא מגדיר במפורש: טעינה, שגיאות, משוב, טפסים, חיפוש וניווט. הן נאספו מעקרונות UX מקובלים.
> - **הן לא משנות שום הגדרת עיצוב קיימת.** כל מצב חדש משתמש רק בטוקנים וברכיבים שכבר מוגדרים בסעיפים 2–4: צבעים, רדיוסים, צללים, טיפוגרפיה ומשך אנימציה. כשהנחיה כאן נראית סותרת לסעיפים 2–7, **הסעיפים הקיימים קובעים**.
> - **ניסוחים** (הודעות שגיאה, טקסטי מצב ריק, toasts) נלקחים מהאתר המקורי, כמו כל התוכן. כאן מוגדרים רק **המבנה, המיקום והתזמון**.
> - שורה שמסומנת **[קיים]** מתעדת התנהגות שכבר יש באב־הטיפוס. שורה שמסומנת **[המלצה]** היא תוספת לפיתוח.

### 8.1 עקרונות על

| עיקרון | יישום במערכת |
|---|---|
| **התמצאות: "איפה אני?"** | בכל רגע יש סימון אחד ויחיד של "אתה כאן": פריט רייל פעיל (`aria-current="page"`), שורת תפריט־תיק פעילה, וכותרת עמוד. **[קיים]** |
| **עקביות** | המסגרת (הדר + רייל) זהה בכל המסכים הפנימיים: מיקום, סדר וגובה 62px. לא מוסיפים ולא מזיזים אלמנטים במסגרת מעמוד לעמוד. **[קיים]** |
| **כל פעולה מקבלת תגובה** | כל לחיצה מקבלת שינוי מצב מיידי (hover, active, open) לפני כל תוצאה מהשרת. **[קיים / המלצה]** |
| **לא רק צבע** | מצב פעיל או נבחר מסומן ביותר מצבע אחד: משקל טקסט 500/600, פס navy של 3px, ✓ או קו תחתון. **[קיים]** ב־Table Row, שבו הסימון הוא צבע בלבד (`#cadcf5`), מוסיפים `aria-selected="true"`. **[המלצה]** |
| **שמירת הקשר** | פעולות שדורשות הזדהות פותחות את תפריט ההתחברות במקום (לא ניווט). מסמך נפתח בצד הטבלה, לא במקומה. **[קיים]** |
| **לא מוחקים קלט של המשתמש** | שגיאה, ניווט "אחורה" או רענון תוצאות לא מוחקים ערכים שהוקלדו. **[המלצה]** החריג המכוון: החלפת "סוג תיק" מאפסת את המספר, כי הפורמט משתנה (3.2.2). **[קיים]** |

### 8.2 מצבי טעינה

| משך צפוי | מה מציגים | עיצוב (מטוקנים קיימים) |
|---|---|---|
| < 100ms | כלום | – |
| 100ms – 1s | אינדיקציה עדינה: הכפתור שהופעל נכנס למצב "בטעינה" | הכפתור שומר על רוחבו, הטקסט מוחלף ב־spinner בגודל האייקון (16px) בצבע הטקסט של אותו variant, `aria-busy="true"`, ולחיצה כפולה חסומה |
| 1 – 10s | **Skeleton** במבנה התוכן הצפוי, למשל שורות טבלה וכרטיסי סקירה | בלוקים בצבע `--bg-3` `#e7e9ef` עם radius של הרכיב המקורי, באותם גבהים (שורת טבלה 44, `--cvs-ovline` 5px לטקסט). Shimmer עדין, שמבוטל ב־`prefers-reduced-motion` |
| > 10s | התקדמות מפורטת ואפשרות ביטול | – |

כללים: **[המלצה]**
- **אין מסך ריק.** המסגרת (הדר + רייל) מוצגת תמיד מיד, וה־skeleton מופיע רק באזור התוכן.
- **אין קפיצות פריסה.** ה־skeleton תופס את אותו גובה כמו התוכן הסופי (למשל `.dc-results` שומר על `min-height:420px`).
- התוכן נכנס ב־fade של `--motion-expressive-short` (250ms). ברשימות: stagger של 30–50ms לכל פריט, עד 10 פריטים.
- אינדיקטור טעינה **אחד** בכל רגע לכל אזור.
- PDF בצד הטבלה: המסגרת נפתחת מיד (האנימציה הקיימת `.34s`), ובתוכה skeleton של עמוד (`.cvs-docspdfpage` עם `.cvs-ovline`) עד שהקובץ נטען. **[הרכיב קיים]**

### 8.3 שגיאות

**היררכיה:** קודם מונעים, אחר כך מזהים, מסבירים, ולבסוף עוזרים להתאושש.

| הקשר | מיקום ותבנית | עיצוב |
|---|---|---|
| **שדה בטופס** (כולל שורת האיתור בהדר) | הודעה **מתחת לשדה**. בדיקה ב־**blur** (כשעוזבים את השדה), לא בכל הקשה, וגם בלחיצה על "חיפוש" או "אתר" | border של השדה `--negative-color` `#d83a52`; טקסט 400 12.5px באותו צבע (הגודל של `.dc-fieldhint`); אייקון info 14px. השדה מקבל `aria-invalid="true"` ו־`aria-describedby` להודעה |
| **שורת האיתור בהדר** | אין מקום להודעה מתחת לשדה בגובה 62, ולכן: border שגיאה על השדה + tooltip מתחתיו (מבנה `#cvsProcTip`: רוחב 230, radius 10, shadow-medium) | הגובה של ההדר **לא משתנה** |
| **טופס עם כמה שגיאות** | פירוט בראש הכרטיס, עם קישור לכל שדה + הודעות ליד השדות | מבנה `.dc-notice` (radius 8, padding `9px 14px`) עם רקע `#f7ded6` וטקסט `#9e2b12`, צמד הצבעים של `cvs-state-late` |
| **תקלת רשת / שרת** | Banner בראש אזור התוכן עם "נסה שוב". המסגרת נשארת פעילה | מבנה `.dc-notice`; כפתור "נסה שוב" בסגנון link-button של `.dc-notice button` |
| **אין תוצאות** | Empty state עם הערכים שחיפשו + הצעה לפעולה (להרחיב טווח, לעבור ל"לפי פרמטרים", לנקות פילטרים) | הרכיב `.dc-empty` **[קיים]**; פעולה בכפתור Secondary |
| **אין הרשאה** | הסבר מה חסר ואיך משיגים | פעולה שדורשת הזדהות פותחת את תפריט ההתחברות **[קיים]** |

כללים: **[המלצה]**
- **ההודעה עונה על שלוש שאלות:** מה קרה, למה (אם זה עוזר), מה עושים עכשיו. לא קודי שגיאה ולא "משהו השתבש". הניסוח מהאתר המקורי.
- **הקלט נשמר תמיד** אחרי שגיאה.
- שגיאה לא נעלמת לבד. היא נשארת עד שמתקנים אותה.
- **לא רק צבע:** כל שגיאה מקבלת גם אייקון וגם טקסט.

### 8.4 משוב ואישורים

| סוג | מתי | מבנה | משך |
|---|---|---|---|
| **מיידי** | כל לחיצה, ריחוף או פתיחה | מצבי hover/active/open שמוגדרים לכל רכיב **[קיים]** | מיידי (`100ms`) |
| **אישור פעולה** | הגשה, תשלום, הורדה שהסתיימה | **Toast: רכיב חדש, לא קיים באב־הטיפוס; דורש אישור עיצוב לפני פיתוח.** הצעה מתוך שפת הרכיבים הקיימת: תיבה בסגנון ה־dropdowns (bg `#fff`, radius 8, `--box-shadow-medium`, padding `12px 16px`), טקסט `400 14px --fg-1`, ואייקון ✓ בצבע `--positive-color`. פעולת "ביטול" בסגנון link-button navy. מיקום: תחתית אזור התוכן, בצד שמאל (הצד הרחוק מהרייל) | 4 שניות, ונשאר כל עוד העכבר מעליו |
| **סטטוס מתמשך** | מסמך "בעיבוד", "באיחור", "בעוד X ימים" | התגיות הקיימות (2.3 / 4.16) **[קיים]** | כל עוד המצב רלוונטי |
| **התראות** | אירועים חדשים | באדג' מספר על הפעמון **[קיים]** (עיגול 16×16). **[המלצה, הרחבה של הרכיב]** מעל 9 הספרות לא נכנסות לעיגול: הבאדג' מתרחב ל־pill באותו גובה 16 ובאותם צבעים, ומעל 99 מוצג "99+" | עד שנקרא |

כללים: **[המלצה]**
- **עדיף "ביטול" אחרי הפעולה על "האם אתה בטוח?" לפניה.** דיאלוג אישור רק לפעולה בלתי הפיכה, כמו הגשה סופית לבית המשפט או תשלום.
- **עוצמת המשוב תואמת לחשיבות הפעולה.** פעולה קטנה (סימון checkbox) לא מקבלת toast.
- Toast מוכרז לקורא מסך: `role="status"` / `aria-live="polite"`. שגיאה: `role="alert"`.

### 8.5 טפסים ושדות

| נושא | הנחיה | סטטוס |
|---|---|---|
| תוויות | לכל שדה יש **תווית קבועה** (`.dc-label` / `.hp-label`) מעל השדה. placeholder לא מחליף תווית | **[קיים]** בטפסים |
| שדות בהדר | אין להם תווית גלויה בגלל המקום, ולכן `aria-label` + `title` חובה (למשל "חודש ושנה", "מספר התיק") | **[קיים]** |
| placeholder | מראה **צורת ערך** (`00-00`, `00000`) ולא הסבר | **[קיים]** |
| רוחב שדה | הרוחב משקף את אורך הערך הצפוי (מספר 64, חודש־שנה 56, שנה 44) | **[קיים]** |
| בחירה מבין מעט אפשרויות (≤5) | **בטפסים שיש בהם מקום** (כמו "לפי תיק" באיתור החלטות): רדיו גלוי (`.dc-radio`). **באזורים צפופים** (שורת האיתור בהדר וכרטיס החיפוש בדף הבית) נשאר ה־select שמוגדר בסעיפים 3.2.2 ו־4.2, גם עם 3 אפשרויות. הכלל הזה לא משנה רכיב קיים | **[קיים]** |
| בחירה מבין רבות (מעל ~15) | select עם חיפוש בתוך הרשימה (המבנה של `.cvs-filtmenu` + `.cvs-filtsearch`) | **[המלצה]** לבית משפט, הליך וסוג עניין |
| שדות תלויים | שדה שתלוי בשדה אחר מוצג disabled עם הסבר, ולא מוסתר (כמו "סוג תיק" עד שבוחרים הליך) | **[קיים]** |
| Enter | Enter בשדה = לחיצה על כפתור הפעולה הראשי | **[קיים]** בדף הבית; **[המלצה]** להוסיף גם לשורת האיתור בהדר |
| מעבר אוטומטי | בשדות מספר תיק באורך קבוע: כשהשדה מתמלא (5 תווים) ה־focus עובר לשדה הבא. מחיקה בשדה ריק מחזירה לשדה הקודם | **[המלצה]** |
| סדר focus | תואם לסדר הוויזואלי ב־RTL: מימין לשמאל, ואז מלמעלה למטה | **[המלצה]** לוודא |
| ברירת מחדל | ערך ברירת מחדל = האפשרות השכיחה ("תיק בית משפט") | **[קיים]** |

### 8.6 חיפוש ותוצאות

| נושא | הנחיה | סטטוס |
|---|---|---|
| שמירת שאילתה | אחרי חיפוש, הערכים נשארים בשדות (ובהדר: מספר התיק הפתוח) כדי לחדד בלי להקליד מחדש | **[קיים]** |
| סיכום חיפוש | אחרי חיפוש הטופס מתקפל לשורת סיכום עם "עריכת חיפוש" | **[קיים]** (`.dc-summary`) |
| מספר תוצאות | "נמצאו N …" ליד כותרת התוצאות | **[קיים]** |
| פילטרים | מציגים רק ערכים שקיימים בתוצאות, עם מונה לכל ערך. פילטר פעיל מסומן (`.cvs-filtbtn-on`), ויש "ניקוי" לכל פילטר ו"ניקוי הכל" | **[קיים]** |
| מיון | העמודה הממוינת וכיוון המיון גלויים תמיד | **[קיים]** |
| אין תוצאות | ראו 8.3: מציגים את מה שחיפשו + הצעה לפעולה | **[המלצה]** |
| בחירה מרובה | כשמסמנים שורות מופיעה פעולה מרוכזת ("הורדת מסמכים (n)"). ה־checkbox בכותרת במצב indeterminate | **[קיים]** |
| שמירה בניווט | חזרה לטבלה (למשל אחרי "חזרה לרשימת המסמכים") שומרת על מיקום הגלילה, המיון והפילטרים | **[המלצה]** |

### 8.7 ניווט

| נושא | הנחיה | סטטוס |
|---|---|---|
| ניווט ראשי | הרייל: 6–7 יעדים לכל היותר. פריט חדש מהאתר המקורי נכנס רק אחרי בדיקה שאין מקום טוב יותר בתפריט משנה | **[המלצה]** |
| ניווט משני | Fly-out, לכל היותר רמה אחת. אין fly-out בתוך fly-out | **[קיים]** |
| ניווט עזר | חשבון, התראות וחיפוש תיק בהדר, נפרדים ויזואלית מהרייל | **[קיים]** |
| ניווט מקומי | תפריט התיק (260) לניווט בתוך תיק. טאבים או segment לתצוגות מקבילות באותו עמוד | **[קיים]** |
| מובייל | המגירה (≤860) **מוצגת רק ב־hamburger** כי אין מקום. בדסקטופ הרייל תמיד גלוי | **[קיים]** |
| תווית מנבאת יעד | תווית פריט מתארת לאן הוא מוביל. התוויות מהאתר המקורי | – |
| מצב פעיל | זהה בכל העמודים: tint + weight 500 ברייל, tint + פס 3px בתפריט התיק | **[קיים]** |
| פירורי לחם | בכל עמוד פנימי, מעל הכותרת, מתחילים ב"דף הבית". ראו 4.17 | **[קיים]** |

### 8.8 אזורי לחיצה (Fitts)

**[המלצה]**
- **במגע** (`@media (pointer: coarse)`): אזור הלחיצה של כל רכיב אינטראקטיבי הוא לפחות **44×44px**. מרחיבים את ה־hit area בלבד (padding שקוף או `::after` עם `inset` שלילי), **בלי לשנות את הגודל הוויזואלי** שמוגדר בסעיף 4. נוגע בעיקר ב־`.cvs-iconbtn` (28), `.cvs-colscfg` (24), `.cvs-casecollapse` (28), באדג' הפעמון והקישור "נקה".
- **כשכפתורים צמודים** (למשל `.dc-rowactions` ו־`.cvs-attacts` עם gap של 2px): מרחיבים את אזור הלחיצה **רק לכיוונים שאין בהם שכן** (למעלה ולמטה), כך שאזורי לחיצה של כפתורים סמוכים לא חופפים. ה־gap הוויזואלי לא משתנה.
- **בדסקטופ** הגדלים והמרווחים הקיימים נשארים כמו שהם.

---

## 9. נספח: CSS Variables

```css
:root {
  /* Brand */
  --brand-navy:#0a3b8f; --brand-navy-hover:#082e6f; --brand-navy-deep:#062356;
  --brand-azure:#2a6fdb; --brand-azure-hover:#1f5cba;
  --brand-tint:#e8eff9; --brand-tint-strong:#cfdcf0; --brand-gold:#c8a24a;
  --cvs-hover:#d6e6fa;
  /* Primary mapping */
  --primary-color:var(--brand-navy); --primary-hover-color:var(--brand-navy-hover);
  --primary-selected-color:var(--brand-tint-strong); --primary-selected-hover-color:#b8cdec;
  --primary-highlighted-color:var(--brand-tint); --link-color:var(--brand-azure);
  /* Text */
  --primary-text-color:#323338; --secondary-text-color:#676879; --tertiary-text-color:#6c6e81; --fg-disabled:#9699a6;
  --disabled-text-color:rgba(50,51,56,.4);
  /* Backgrounds & borders */
  --primary-background-color:#fff; --primary-background-hover-color:rgba(103,104,121,.1);
  --allgrey-background-color:#f6f7fb; --ui-background-color:#e7e9ef;
  --ui-border-color:#c3c6d4; --layout-border-color:#d0d4e4; --icon-color:#676879;
  --disabled-background-color:#ecedf5; --backdrop-color:rgba(41,47,76,.7);
  /* State */
  --positive-color:#00854d; --negative-color:#d83a52; --warning-color:#fdab3d;
  /* Shadows */
  --box-shadow-xs:0 4px 6px -4px rgba(0,0,0,.1);
  --box-shadow-small:0 4px 8px rgba(0,0,0,.12);
  --box-shadow-medium:0 6px 20px rgba(0,0,0,.15);
  --box-shadow-large:0 15px 50px rgba(0,0,0,.22);
  --box-shadow-focus:0 0 0 2px var(--brand-tint), 0 0 0 4px var(--brand-azure);
  /* Type */
  --font-family:"Rubik","Segoe UI",Roboto,sans-serif;
  --font-size-10:12px; --font-size-20:14px; --font-size-30:16px; --font-size-40:18px;
  --font-size-50:24px; --font-size-60:30px; --font-size-70:40px;
  /* Space & shape */
  --space-4:4px; --space-8:8px; --space-12:12px; --space-16:16px; --space-20:20px;
  --space-24:24px; --space-32:32px; --space-40:40px; --space-48:48px;
  --border-radius-small:4px; --border-radius-medium:8px; --border-radius-big:16px; --border-radius-pill:999px;
  /* Motion */
  --motion-productive-medium:100ms; --motion-productive-long:150ms;
  --motion-timing-transition:cubic-bezier(.4,0,.2,1);
  /* Semantic aliases */
  --fg-1:var(--primary-text-color); --fg-2:var(--secondary-text-color); --fg-3:var(--tertiary-text-color);
  --bg-1:#fff; --bg-2:#f6f7fb; --bg-3:#e7e9ef; --bg-app:#f4f8fc;
  --border-1:var(--ui-border-color); --border-2:var(--layout-border-color); --border-field:#878ca0;
  /* Shell */
  --shell-header-h:62px; --shell-rail-w:68px; --shell-flyout-w:230px;
}
```

> הקובץ המלא והמקורי: `styles.css` באב־הטיפוס (`https://case-view-lawyer-docs-inline.vercel.app/styles.css`).

---

## 10. נספח: אינדקס צילומי מסך

| קובץ | מצב |
|---|---|
| `01-home-guest.png` | דף בית, אורח (עמוד מלא) |
| `02-home-guest-login-menu.png` | תפריט התחברות פתוח |
| `03-home-guest-info-panel.png` | חלונית ⓘ |
| `04-home-guest-tab-cases.png` | segment "תיקים" |
| `05-home-guest-oldcase.png` | "תיק ישן" עם שדות נוספים |
| `06-home-lawyer.png` | דף בית, עו"ד (עמוד מלא) |
| `07-home-lawyer-avatar-menu.png` | תפריט אווטאר / החלפת חשבון |
| `08-home-lawyer-rail-flyout.png` | Fly-out ברייל |
| `09-home-lawyer-svc-menu.png` | תפריט "טפסים" |
| `10-home-lawyer-news-more.png` | הודעות, "הצג עוד" פתוח |
| `11-home-id-user.png` / `12-home-org-user.png` | משתמש ת.ז / חברה |
| `13-home-experts-closed.png` | באנר מומחים, הרשמה סגורה |
| `14-decisions-empty.png` | איתור החלטות, empty state |
| `15-decisions-params-tab.png` | טאב פרמטרים |
| `16-decisions-results.png` | תוצאות + summary strip |
| `17-decisions-edit-search.png` | עריכת חיפוש מעל תוצאות |
| `18-index-case-overview.png` | מסך תיק, פרטים כלליים |
| `19-index-docs-table.png` / `20-index-docs-all.png` | טבלת מסמכים |
| `21-index-doc-pdf-open.png` / `21b-index-doc-pdf-wide.png` | PDF בצד / רחב |
| `22-index-docs-filters.png` / `23b-index-docs-filter-menu.png` | שורת פילטרים / תפריט פילטר |
| `23-index-docs-columns.png` | הגדרת עמודות |
| `23c-index-views-list.png` | רשימת צפיות במסמך |
| `23d-index-docs-selected.png` | שורות מסומנות + הורדה |
| `23e-index-attachments-open.png` | קבצים מצורפים פתוחים |
| `24-index-sidebar-collapsed.png` | תפריט התיק מקופל |
| `25-index-casestrip-collapsed.png` | Case strip מכווץ |
| `26-index-placeholder.png` | Placeholder |
| `27-index-avatar-menu.png` | תפריט אווטאר במסך פנימי |
| `28-index-oldcase-header.png` | "תיק ישן" בשורת האיתור בהדר |
| `40-header-court.png` | הדר: תיק בית משפט (ברירת מחדל) |
| `41-header-traffic.png` | הדר: תיק תעבורה |
| `42-header-old-empty.png` / `43-header-old-filled.png` | הדר: תיק ישן, ריק / ממולא |
| `44-header-cleared.png` | הדר אחרי "נקה" |
| `45-frame-decisions.png` | מסגרת מלאה: עמוד איתור החלטות (מקור האמת) |
| `46-header-avatar-menu.png` | תפריט משתמש במסגרת |
| `47-rail-flyout-decisions.png` | Fly-out ברייל |
| `48-rail-hover-active.png` | רייל: hover + פריט פעיל |
| `30–35-mobile-*.png` | מובייל 375px: בית אורח/עו"ד, מגירה, התחברות, החלטות, תיק |
