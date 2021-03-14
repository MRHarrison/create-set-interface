import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Crypto Index Fund Creator/i);
  expect(linkElement).toBeInTheDocument();
});
