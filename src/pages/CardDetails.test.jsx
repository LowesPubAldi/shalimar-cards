import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CardDetails from './CardDetails.jsx';
import { resetCardDetailsCache } from '../hooks/useCardDetails.js';

const ashBlossomCard = {
  id: 14558127,
  name: 'Ash Blossom & Joyous Spring',
  type: 'Tuner Effect Monster',
  race: 'Zombie',
  level: 3,
  archetype: null,
  attribute: 'FIRE',
  atk: 0,
  def: 1800,
  desc: 'When a card or effect is activated...',
  card_sets: [{ set_name: 'Maximum Gold' }],
  card_images: [{ image_url: 'https://images.example.com/ash.jpg' }],
};

function renderCardDetails(initialPath = '/card/14558127', state) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: initialPath, state }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/card/:id" element={<CardDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CardDetails', () => {
  afterEach(() => {
    resetCardDetailsCache();
    jest.restoreAllMocks();
  });

  test('renders fetched card details', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: [ashBlossomCard] }),
    });

    renderCardDetails();

    expect(screen.getByLabelText(/loading card details/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    expect(screen.getByText(/maximum gold/i)).toBeInTheDocument();
  });

  test('renders an error message when the request fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network failure'));

    renderCardDetails('/card/999');

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /card unavailable/i })).toBeInTheDocument();
    expect(screen.getByText(/card details are unavailable right now/i)).toBeInTheDocument();
  });

  test('preserves the originating catalog route in the back link', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: [ashBlossomCard] }),
    });

    renderCardDetails('/card/14558127', {
      from: '/catalog?search=ash&page=2',
      fromLabel: 'Catalog',
    });

    expect(await screen.findByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to catalog/i })).toHaveAttribute('href', '/catalog?search=ash&page=2');
  });

  test('reuses cached card data for the same id', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: [ashBlossomCard] }),
    });

    const firstRender = renderCardDetails('/card/14558127');
    expect(await screen.findByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    firstRender.unmount();

    renderCardDetails('/card/14558127');

    expect(screen.getByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('hydrates the cache from session storage', async () => {
    window.sessionStorage.setItem(
      'shalimar-card-cache',
      JSON.stringify({ '14558127': ashBlossomCard })
    );

    const fetchSpy = jest.spyOn(global, 'fetch');

    renderCardDetails('/card/14558127');

    expect(screen.getByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});