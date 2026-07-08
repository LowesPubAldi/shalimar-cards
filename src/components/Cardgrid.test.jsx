import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cardgrid from './Cardgrid.jsx';

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
  {
    id: 3,
    name: 'Cyber Dragon',
    type: 'Effect Monster',
    attribute: 'LIGHT',
    atk: 2100,
    card_images: [{ image_url: 'https://images.example.com/cyber-dragon.jpg' }],
  },
];

describe('Cardgrid', () => {
  test('shows loading skeleton cards while loading', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cardgrid loading cards={[]} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/loading cards/i)).toBeInTheDocument();
    expect(screen.getAllByText('', { selector: '.card-skeleton' })).toHaveLength(8);
  });

  test('shows a styled error panel when card loading fails', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cardgrid error="Something went wrong. Please try again." cards={[]} />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /catalog unavailable/i })).toBeInTheDocument();
  });

  test('shows an empty state when no cards match the search', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cardgrid cards={mockCards} search="dark magician" />
      </MemoryRouter>
    );

    expect(screen.getByText(/no cards matched that search/i)).toBeInTheDocument();
  });

  test('sorts cards by attack from high to low', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cardgrid cards={mockCards} search="" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/sort cards/i), {
      target: { value: 'atkHigh' },
    });

    const cardTitles = screen.getAllByRole('heading', { level: 3 });

    expect(cardTitles[0]).toHaveTextContent(/blue-eyes white dragon/i);
    expect(cardTitles[1]).toHaveTextContent(/cyber dragon/i);
    expect(cardTitles[2]).toHaveTextContent(/ash blossom & joyous spring/i);
  });

  test('filters cards by type and attribute props', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cardgrid cards={mockCards} search="" typeFilter="Effect Monster" attributeFilter="LIGHT" />
      </MemoryRouter>
    );

    expect(screen.getByText(/cyber dragon/i)).toBeInTheDocument();
    expect(screen.queryByText(/blue-eyes white dragon/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ash blossom & joyous spring/i)).not.toBeInTheDocument();
  });
});