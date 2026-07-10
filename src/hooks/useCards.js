import { useEffect, useRef, useState } from 'react';

export const CARDS_PER_PAGE = 60;

function useCards({ page = 1, pageSize = CARDS_PER_PAGE, query = '' } = {}) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const cacheRef = useRef(new Map());
  const normalizedQuery = query.trim();
  const isSearchMode = normalizedQuery.length > 0;

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = isSearchMode
      ? `search:${normalizedQuery.toLowerCase()}`
      : `${page}:${pageSize}`;

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
        const requestUrl = isSearchMode
          ? `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(normalizedQuery)}`
          : `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${pageSize}&offset=${offset}`;
        const response = await fetch(
          requestUrl,
          { signal: controller.signal }
        );

        if (!response.ok) {
          if (isSearchMode && response.status === 400) {
            const emptySearchResult = {
              cards: [],
              hasNextPage: false,
              totalPages: 1,
              totalResults: 0,
            };

            cacheRef.current.set(cacheKey, emptySearchResult);
            setCards([]);
            setHasNextPage(false);
            setTotalPages(1);
            setTotalResults(0);
            return;
          }

          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        const nextCards = data.data ?? [];
        const meta = data.meta ?? {};
        const hasNextFromMeta = typeof meta.pages_remaining === 'number'
          ? meta.pages_remaining > 0
          : meta.next_page != null;
        const nextTotalPages = isSearchMode
          ? 1
          : (typeof meta.total_pages === 'number' ? meta.total_pages : page);
        const nextTotalResults = isSearchMode
          ? nextCards.length
          : (typeof meta.total_rows === 'number' ? meta.total_rows : nextCards.length);
        const nextHasNextPage = isSearchMode
          ? false
          : (hasNextFromMeta || nextCards.length === pageSize);

        cacheRef.current.set(cacheKey, {
          cards: nextCards,
          hasNextPage: nextHasNextPage,
          totalPages: nextTotalPages,
          totalResults: nextTotalResults,
        });

        setCards(nextCards);
        setHasNextPage(nextHasNextPage);
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
  }, [isSearchMode, normalizedQuery, page, pageSize]);

  return { cards, loading, error, hasNextPage, totalPages, totalResults };
}

export default useCards;