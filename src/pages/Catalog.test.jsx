import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Catalog from './Catalog.jsx';

const mockCardsPageOne = [
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
  {
    id: 3,
    name: 'Cyber Dragon',
    type: 'Effect Monster',
    attribute: 'LIGHT',
    atk: 2100,
    card_images: [{ image_url: 'https://images.example.com/cyber-dragon.jpg' }],
  },
];

const mockCardsPageTwo = [
  {
    id: 4,
    name: 'Dark Magician',
    type: 'Normal Monster',
    attribute: 'DARK',
    atk: 2500,
    card_images: [{ image_url: 'https://images.example.com/dark-magician.jpg' }],
  },
];

function LocationSearch() {
  const location = useLocation();

  return <p data-testid="location-search">{location.search}</p>;
}

function renderCatalog(initialPath = '/catalog') {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/catalog"
          element={(
            <>
              <Catalog />
              <LocationSearch />
            </>
          )}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('Catalog', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(async (request) => {
      const requestUrl = String(request);
      const data = requestUrl.includes('offset=60') ? mockCardsPageTwo : mockCardsPageOne;
      const meta = requestUrl.includes('offset=60')
        ? { pages_remaining: 0, next_page: null, total_pages: 2, total_rows: 61 }
        : { pages_remaining: 1, next_page: 2, total_pages: 2, total_rows: 61 };

      return {
        ok: true,
        json: async () => ({ data, meta }),
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('hydrates search, filters, and sort from the URL', async () => {
    renderCatalog('/catalog?search=cyber&type=Effect%20Monster&attribute=LIGHT&sort=atkHigh');

    expect(screen.getByLabelText(/search cards by name/i)).toHaveValue('cyber');
    expect(screen.getByLabelText(/filter cards/i)).toHaveValue('type:Effect Monster');
    expect(await screen.findByText(/cyber dragon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort cards/i)).toHaveValue('atkHigh');
    expect(screen.getByText(/showing cards 1-1 of 3 on page 1 of 1/i)).toBeInTheDocument();
  });

  test('writes catalog state back to the URL when controls change', async () => {
    renderCatalog();

    await screen.findByText(/blue-eyes white dragon/i);

    fireEvent.change(screen.getByLabelText(/search cards by name/i), {
      target: { value: 'ash' },
    });
    fireEvent.change(screen.getByLabelText(/sort cards/i), {
      target: { value: 'az' },
    });
    fireEvent.change(screen.getByLabelText(/filter cards/i), {
      target: { value: 'type:Effect Monster' },
    });

    expect(screen.getByTestId('location-search')).toHaveTextContent('search=ash');
    expect(screen.getByTestId('location-search')).toHaveTextContent('sort=az');
    expect(screen.getByTestId('location-search')).toHaveTextContent('type=Effect+Monster');
  });

  test('derives filter options from fetched cards', async () => {
    renderCatalog();

    await screen.findByText(/blue-eyes white dragon/i);

    expect(screen.getByRole('option', { name: 'Effect Monster' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Normal Monster' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Spell Card' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'FIRE' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'LIGHT' })).toBeInTheDocument();
  });

  test('moves to the next page and persists page in the URL', async () => {
    renderCatalog();

    await screen.findByText(/blue-eyes white dragon/i);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByText(/dark magician/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('page=2');
  });

  test('shows page number controls and reuses cached pages when returning', async () => {
    renderCatalog();

    await screen.findByText(/blue-eyes white dragon/i);

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(await screen.findByText(/dark magician/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '1' }));

    await waitFor(() => {
      expect(screen.getByText(/blue-eyes white dragon/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('shows ellipses for larger page counts and removes active chips', async () => {
    global.fetch.mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        data: mockCardsPageOne,
        meta: { pages_remaining: 4, next_page: 5, total_pages: 8 },
      }),
    }));

    renderCatalog('/catalog?type=Effect%20Monster&attribute=LIGHT&sort=atkHigh&page=4');

    expect(await screen.findByText(/cyber dragon/i)).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /sort: atk high to low x/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /attribute: light x/i }));

    expect(screen.getByTestId('location-search')).not.toHaveTextContent('attribute=LIGHT');
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('page=4');
  });

  test('clears all catalog state from the chip row', async () => {
    renderCatalog('/catalog?search=cyber&type=Effect%20Monster&attribute=LIGHT&sort=atkHigh');

    expect(await screen.findByText(/cyber dragon/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

    expect(screen.getByTestId('location-search')).toHaveTextContent('');
    expect(screen.getByLabelText(/search cards by name/i)).toHaveValue('');
    expect(screen.getByLabelText(/filter cards/i)).toHaveValue('');
    expect(screen.getByLabelText(/sort cards/i)).toHaveValue('');
  });
});