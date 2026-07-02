import { render, screen } from '@testing-library/react';
import App from './App';

test('should render', async () => {
  render(<App />);
  expect(screen.getByText('Add')).toBeInTheDocument();
});
