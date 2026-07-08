import { useEffect, useState } from 'react';

const cardCache = new Map();
const STORAGE_KEY = 'shalimar-card-cache';

function readStoredCards() {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return new Map();
  }

  try {
    const rawValue = window.sessionStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return new Map();
    }

    return new Map(Object.entries(JSON.parse(rawValue)));
  } catch {
    return new Map();
  }
}

function writeStoredCards(cache) {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(cache.entries()))
    );
  } catch {
    return;
  }
}

function getCachedCard(id) {
  const cachedCard = cardCache.get(id);

  if (cachedCard) {
    return cachedCard;
  }

  const storedCards = readStoredCards();
  const storedCard = storedCards.get(String(id)) ?? storedCards.get(id);

  if (storedCard) {
    cardCache.set(String(id), storedCard);
    return storedCard;
  }

  return null;
}

export function resetCardDetailsCache() {
  cardCache.clear();

  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
}

function useCardDetails(id) {
  const [card, setCard] = useState(() => getCachedCard(id));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(() => !getCachedCard(id));

  useEffect(() => {
    const controller = new AbortController();
    const cachedCard = getCachedCard(id);

    if (cachedCard) {
      setCard(cachedCard);
      setError('');
      setLoading(false);
      return () => controller.abort();
    }

    const loadCard = async () => {
      setLoading(true);
      setError('');
      setCard(null);

      try {
        const response = await fetch(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch card');
        }

        const data = await response.json();
        const nextCard = data.data?.[0];

        if (!nextCard) {
          throw new Error('Card not found');
        }

        cardCache.set(id, nextCard);
        writeStoredCards(cardCache);
        setCard(nextCard);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Card details are unavailable right now.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCard();

    return () => controller.abort();
  }, [id]);

  return { card, error, loading };
}

export default useCardDetails;