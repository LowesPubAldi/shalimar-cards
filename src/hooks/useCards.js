import { useEffect, useRef, useState } from 'react';

export const CARDS_PER_PAGE = 40;

function useCards({ page = 1, pageSize = CARDS_PER_PAGE } = {}) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = `${page}:${pageSize}`;

    const loadCards = async () => {
      const cachedPage = cacheRef.current.get(cacheKey);

      if (cachedPage) {
        setCards(cachedPage.cards);
        setHasNextPage(cachedPage.hasNextPage);
        setTotalPages(cachedPage.totalPages);
        setTotalResults(cachedPage.totalResults);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const offset = (page - 1) * pageSize;
        const response = await fetch(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${pageSize}&offset=${offset}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        const nextCards = data.data ?? [];
        const meta = data.meta ?? {};
        const hasNextFromMeta = typeof meta.pages_remaining === 'number'
          ? meta.pages_remaining > 0
          : meta.next_page != null;
        const nextTotalPages = typeof meta.total_pages === 'number' ? meta.total_pages : page;
        const nextTotalResults = typeof meta.total_rows === 'number' ? meta.total_rows : nextCards.length;

        cacheRef.current.set(cacheKey, {
          cards: nextCards,
          hasNextPage: hasNextFromMeta || nextCards.length === pageSize,
          totalPages: nextTotalPages,
          totalResults: nextTotalResults,
        });

        setCards(nextCards);
        setHasNextPage(hasNextFromMeta || nextCards.length === pageSize);
        setTotalPages(nextTotalPages);
        setTotalResults(nextTotalResults);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setCards([]);
          setHasNextPage(false);
          setTotalPages(1);
          setTotalResults(0);
          setError('Something went wrong. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCards();

    return () => controller.abort();
  }, [page, pageSize]);

  return { cards, loading, error, hasNextPage, totalPages, totalResults };
}

export default useCards;