import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { lektion1 } from '../data/lessons/a1-1-lektion-1';
import { progressStore, STORAGE_KEY } from '../lib/progress';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const TOTAL = lektion1.entries.length;
/** Match a <span> by its full text content (text is split across <strong> elements). */
const span = (re: RegExp) => screen.getByText((_, el) => el?.tagName === 'SPAN' && re.test(el.textContent ?? '') && !el.querySelector('span'));

beforeEach(() => {
  localStorage.clear();
  progressStore.reload();
});

describe('routes', () => {
  it('overview lists Lektion 1 with its real word count', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: /Lektion 1/ })).toHaveAttribute('href', '/a1.1-lektion-1/vocabulary');
    expect(screen.getByText(/48 ta so‘z/)).toBeInTheDocument();
  });
  it('opens vocabulary directly and shows every word', () => {
    renderAt('/a1.1-lektion-1/vocabulary');
    expect(within(screen.getByRole('list', { name: 'So‘zlar ro‘yxati' })).getAllByRole('listitem')).toHaveLength(TOTAL);
    expect(document.title).toContain('So‘zlar');
  });
  it('redirects the bare lesson URL and shows 404 for unknown lessons', () => {
    renderAt('/a1.1-lektion-1');
    expect(screen.getByRole('list', { name: 'So‘zlar ro‘yxati' })).toBeInTheDocument();
    renderAt('/nope/vocabulary');
    expect(screen.getByRole('heading', { name: 'Sahifa topilmadi' })).toBeInTheDocument();
  });
});

describe('vocabulary page', () => {
  it('toggles learned/difficult independently and persists them', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt('/a1.1-lektion-1/vocabulary');
    await user.click(screen.getByRole('button', { name: /^wie: Yodladim deb belgilash/ }));
    await user.click(screen.getByRole('button', { name: /^wie: Qiyin so‘z deb belgilash/ }));
    expect(screen.getByText('1', { selector: 'strong' })).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.lessons['a1.1-lektion-1']).toEqual({ learned: ['a1.1-l1-01'], difficult: ['a1.1-l1-01'] });
    unmount();
    progressStore.reload();
    renderAt('/a1.1-lektion-1/vocabulary');
    expect(screen.getByRole('button', { name: /^wie: Yodlangan/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^wie: Qiyin so‘z, belgini/ })).toHaveAttribute('aria-pressed', 'true');
  });
  it('survives corrupted storage', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    progressStore.reload();
    renderAt('/a1.1-lektion-1/vocabulary');
    expect(span(/^0 \/ 48 so‘z yodlandi$/)).toBeInTheDocument();
  });
  it('searches German (umlaut-insensitive) and Uzbek, with an empty state', async () => {
    const user = userEvent.setup();
    renderAt('/a1.1-lektion-1/vocabulary');
    const box = screen.getByRole('searchbox');
    await user.type(box, 'turkei');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    await user.clear(box);
    await user.type(box, 'salom');
    expect(screen.getByText('Hallo')).toBeInTheDocument();
    await user.clear(box);
    await user.type(box, 'zzzz');
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument();
  });
  it('disables audio gracefully when speech synthesis is missing', () => {
    renderAt('/a1.1-lektion-1/vocabulary');
    expect(screen.getAllByRole('button', { name: 'Bu brauzerda ovoz ishlamaydi' })[0]).toBeDisabled();
  });
});

describe('quiz page', () => {
  it('runs a full round: every word once, real score, no skipping', async () => {
    const user = userEvent.setup();
    renderAt('/a1.1-lektion-1/test');
    await user.click(screen.getByRole('button', { name: 'Boshlash' }));
    const seen = new Set<string>();
    for (let i = 1; i <= TOTAL; i++) {
      expect(span(new RegExp(`^Savol ${i} / ${TOTAL}$`))).toBeInTheDocument();
      const next = screen.getByRole('button', { name: /Davom etish|Natijani ko‘rish/ });
      expect(next).toBeDisabled(); // must answer first
      seen.add(screen.getByRole('heading', { level: 2 }).textContent!);
      const choices = within(screen.getByRole('group', { name: 'Javob variantlari' })).getAllByRole('button');
      expect(choices.length).toBe(4);
      await user.click(choices[0]);
      await user.dblClick(choices[0]); // repeated taps must not double count
      await user.click(next);
    }
    expect(seen.size).toBe(TOTAL);
    expect(screen.getByRole('heading', { name: 'Natija' })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`^\\d+ / ${TOTAL}$`))).toBeInTheDocument();
    const correct = Number(span(/^\d+ to‘g‘ri$/).querySelector('strong')!.textContent);
    const wrong = Number(span(/^\d+ noto‘g‘ri$/).querySelector('strong')!.textContent);
    expect(correct + wrong).toBe(TOTAL);
  });
  it('limits a "difficult only" round to difficult words', async () => {
    const user = userEvent.setup();
    progressStore.addFlag('a1.1-lektion-1', ['a1.1-l1-03', 'a1.1-l1-04'], 'difficult');
    renderAt('/a1.1-lektion-1/test');
    await user.click(screen.getByRole('radio', { name: /Qiyin so‘zlar \(2\)/ }));
    await user.click(screen.getByRole('button', { name: 'Boshlash' }));
    expect(span(/^Savol 1 \/ 2$/)).toBeInTheDocument();
  });
  it('disables an empty scope instead of starting an empty quiz', () => {
    renderAt('/a1.1-lektion-1/test');
    expect(screen.getByRole('radio', { name: /Qiyin so‘zlar \(0\)/ })).toBeDisabled();
  });
});
