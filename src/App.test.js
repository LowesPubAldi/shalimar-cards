import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app navigation and featured content', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { name: /shalimar cards/i })).toHaveLength(2);
  expect(screen.getByRole('link', { name: /catalog/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /featured card/i })).toBeInTheDocument();
});
