import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const pageCards = [
  {
    id: 14558127,
    name: 'Ash Blossom & Joyous Spring',
    type: 'Effect Monster',
    attribute: 'FIRE',
    atk: 0,
    card_images: [{ image_url: 'https://images.example.com/ash.jpg' }],
  },
  {
    id: 89631139,
    name: 'Blue-Eyes White Dragon',
    type: 'Normal Monster',
    attribute: 'LIGHT',
    atk: 3000,
    card_images: [{ image_url: 'https://images.example.com/blue-eyes.jpg' }],
  },
];

const detailCard = {
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

describe('App flow', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.history.pushState({}, '', '/');
    window.sessionStorage.clear();
  });

  test('searches from home, opens a card, and preserves browse context', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(async (request) => {
      const requestUrl = String(request);

      if (requestUrl.includes('cardinfo.php?id=')) {
        return {
          ok: true,
          json: async () => ({ data: [detailCard] }),
        };
      }

      return {
        ok: true,
        json: async () => ({
          data: pageCards,
          meta: { pages_remaining: 0, next_page: null, total_pages: 1, total_rows: 2 },
        }),
      };
    });

    window.history.pushState({}, '', '/');

    render(<App />);

    const searchInput = screen.getByLabelText(/search cards by name/i);
    await userEvent.type(searchInput, 'ash');

    const ashLink = await screen.findByRole('link', { name: /ash blossom & joyous spring/i });
    expect(window.location.search).toContain('search=ash');

    await userEvent.click(ashLink);

    expect(await screen.findByRole('heading', { name: /ash blossom & joyous spring/i })).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toHaveAttribute('href', '/?search=ash');
  });
});