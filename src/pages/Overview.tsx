import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore } from 'react';
import { progressStore } from '../lib/progress';

export function Overview() {
  usePageTitle(`${levelLabel} darslari`);
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);

  return (
    <>
      <p className="eyebrow">Nemis tili</p>
      <h1 className="page-title" tabIndex={-1}>
        <span className="chip-lime">{levelLabel}</span> darajasi
      </h1>
      <p className="lede">Darslikdagi so‘zlarni yodlang: talaffuz, audio va test bilan.</p>

      <ul className="section-gap" style={{ display: 'grid', gap: 12 }} aria-label={`${levelLabel} darslari`}>
        {lessons.map((l) => {
          const valid = new Set(l.entries.map((e) => e.id));
          const learned = (state.lessons[l.slug]?.learned ?? []).filter((id) => valid.has(id)).length;
          return (
            <li key={l.slug}>
              <Link className="card lesson-link" to={`/${l.slug}/vocabulary`}>
                <div className="grow">
                  <h3>{l.title}</h3>
                  <p className="lede" style={{ marginTop: 2 }}>
                    {l.entries.length} ta so‘z · {learned} tasi yodlangan
                  </p>
                </div>
                <ChevronRight aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="quiet">Keyingi darslar tayyor bo‘lgach shu yerda paydo bo‘ladi.</p>
    </>
  );
}
