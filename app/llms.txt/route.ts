import { otherFrameworks, programs } from '@/lib/data';
import { ACTIVITIES, GENDER, LIVING, REGISTRATION, REGIONS } from '@/lib/labels';
import { SITE_URL } from '@/lib/site';

export function GET() {
  const lines: string[] = [
    '# שנה הבאה – כל שנות השירות במקום אחד',
    '',
    '> מאגר עצמאי של שנות שירות (ש"ש) בישראל: שנת התנדבות לפני הגיוס לצה"ל. כל פרט נבדק מול אתר הארגון או מקור ממשלתי, ומה שלא אומת מסומן "לא ידוע". האתר לא כולל מכינות קדם-צבאיות ושירות לאומי.',
    '',
    `- [כל שנות השירות](${SITE_URL}/programs)`,
    `- [מה זה שנת שירות](${SITE_URL}/about)`,
    '',
    '## שנות שירות שנבדקו',
    '',
  ];
  for (const p of programs) {
    const where = p.locations.length ? p.locations.join(', ') : p.regions.map((r) => REGIONS[r]).join(', ') || 'לא ידוע';
    lines.push(
      `### ${p.org.name} – ${p.name}`,
      `${SITE_URL}/programs/${p.id}`,
      p.tagline,
      `- תחומים: ${p.activities.map((a) => ACTIVITIES[a].label).join(', ')}`,
      `- איפה: ${where}`,
      `- מגורים: ${LIVING[p.living]}`,
      `- הרכב הקבוצות: ${GENDER[p.gender]}`,
      `- הרשמה: ${REGISTRATION[p.registration.status].label}${p.registration.deadline ? ` (עד ${p.registration.deadline})` : ''}`,
      `- אתר: ${p.program_url ?? p.org.website ?? 'לא ידוע'}`,
      `- נבדק: ${p.verified_at}`,
      '',
    );
  }
  if (otherFrameworks.length) {
    lines.push('## ארגונים נוספים ברשימה הרשמית (טרם נבדקו לעומק)', '');
    for (const o of otherFrameworks) lines.push(`- ${o.name}${o.url ? `: ${o.url}` : ''}`);
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
