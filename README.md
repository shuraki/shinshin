# שנה הבאה – כל שנות השירות במקום אחד

אתר עצמאי שמרכז מידע על שנות שירות (ש"ש) בישראל: חיפוש, סינון, השוואה ועזרה בבחירה. כל פרט מגיע עם קישור למקור.

## הרצה

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # בדיקות חיפוש ותקינות נתונים
npm run build
```

## איפה הנתונים

- `src/data/programs.json` – שנות השירות שנבדקו (כולל מקורות ותאריך בדיקה).
- `src/data/other-frameworks.json` – ארגונים מהרשימה הרשמית שעוד לא נבדקו לעומק.
- `src/data/facts.json` – עובדות כלליות על שנת שירות, כל אחת עם מקור ממשלתי.
- `docs/research/` – תוצאות המחקר הגולמיות (מה נבדק, באיזה עמוד, ומה חסר). `programs.json` נבנה מהן:
  `node docs/research/build-data.js src/data/programs.json`

כללים: מה שלא מופיע במקור רשמי נשאר `unknown` / `null`. אופי דתי, שבת והפרדה מגדרית נכתבים רק אם הארגון עצמו כותב אותם.

## הגדרות

- `NEXT_PUBLIC_SITE_URL` – כתובת האתר (ברירת מחדל: `https://shinshin-gray.vercel.app`). משמשת ל-canonical, sitemap ותצוגה מקדימה בשיתוף.
- דיווחי טעויות נפתחים כ-Issue ב-GitHub (`src/lib/site.ts`).
- תמונת השיתוף: `app/opengraph-image.jpg` (המקור ב-`docs/og-image.html`).
