import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Nemis tili lug‘ati`;
  }, [title]);
}
