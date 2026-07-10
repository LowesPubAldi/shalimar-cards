import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Home.jsx';

const originalInnerWidth = window.innerWidth;

const mockCards = [
  {
    id: 1,
    name: 'Blue-Eyes White Dragon',
    type: 'Normal Monster',
    attribute: 'LIGHT',
    atk: 3000,
    card_images: [{ image_url: 'https://images.example.com/blue-eyes.jpg' }],
  },
  {
    id: 2,
    name: 'Ash Blossom & Joyous Spring',
    type: 'Effect Monster',
    attribute: 'FIRE',
    atk: 0,
    card_images: [{ image_url: 'https://images.example.com/ash.jpg' }],
  },
];

function LocationSearch() {
  const location = useLocation();

  return <p data-testid="location-search">{location.search}</p>;
}

function renderHome(initialPath = '/') {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <Home />
              <LocationSearch />
            </>
          )}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('Home', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(async (request) => {
      const requestUrl = String(request);
      const lowerUrl = requestUrl.toLowerCase();

      if (lowerUrl.includes('fname=blue')) {
        return {
          ok: true,
          json: async () => ({ data: [mockCards[0]] }),
        };
      }

      if (lowerUrl.includes('fname=ash')) {
        return {
          ok: true,
          json: async () => ({ data: [mockCards[1]] }),
        };
      }

      if (lowerUrl.includes('fname=a')) {
        return {
          ok: true,
          json: async () => ({ data: mockCards }),
        };
      }

      return {
        ok: true,
        json: async () => ({ data: mockCards }),
      };
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    jest.restoreAllMocks();
  });

  test('hydrates and updates search from the URL', async () => {
    renderHome('/?search=blue');

    expect(screen.getByLabelText(/search cards by name/i)).toHaveValue('blue');
    expect(await screen.findByRole('heading', { level: 3, name: /blue-eyes white dragon/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /ash blossom & joyous spring/i })).not.toBeInTheDocument();
    expect(String(global.fetch.mock.calls[0][0])).toContain('fname=blue');

    fireEvent.change(screen.getByLabelText(/search cards by name/i), {
      target: { value: 'ash' },
    });

    expect(screen.getByTestId('location-search')).toHaveTextContent('search=ash');
    expect(await screen.findByRole('heading', { level: 3, name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /blue-eyes white dragon/i })).not.toBeInTheDocument();
  });

  test('filters cards from the sort panel controls', async () => {
    renderHome();

    expect(await screen.findByRole('heading', { level: 3, name: /blue-eyes white dragon/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /ash blossom & joyous spring/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/type filter/i), {
      target: { value: 'Normal Monster' },
    });

    expect(screen.getByRole('heading', { level: 3, name: /blue-eyes white dragon/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /ash blossom & joyous spring/i })).not.toBeInTheDocument();
  });

  test('requests 30 cards on tablet width', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 768,
    });

    renderHome();

    await screen.findByRole('heading', { level: 3, name: /blue-eyes white dragon/i });

    expect(String(global.fetch.mock.calls[0][0])).toContain('num=30');
  });

  test('requests API search results for single-letter input', async () => {
    renderHome();

    await screen.findByRole('heading', { level: 3, name: /blue-eyes white dragon/i });

    fireEvent.change(screen.getByLabelText(/search cards by name/i), {
      target: { value: 'a' },
    });

    await waitFor(() => {
      const requestedUrls = global.fetch.mock.calls.map((call) => String(call[0]).toLowerCase());
      expect(requestedUrls.some((url) => url.includes('fname=a'))).toBe(true);
    });
  });
});