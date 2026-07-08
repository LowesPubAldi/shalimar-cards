import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Home.jsx';

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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCards }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('hydrates and updates search from the URL', async () => {
    renderHome('/?search=blue');

    expect(screen.getByLabelText(/search cards by name/i)).toHaveValue('blue');
    expect(await screen.findByRole('heading', { level: 3, name: /blue-eyes white dragon/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /ash blossom & joyous spring/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search cards by name/i), {
      target: { value: 'ash' },
    });

    expect(screen.getByTestId('location-search')).toHaveTextContent('search=ash');
  });
});