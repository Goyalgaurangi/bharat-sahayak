import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('renders Smart Bharat landing page without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // This looks for any heading or text to confirm the app renders
  const headingElement = screen.getByRole('heading');
  expect(headingElement).toBeInTheDocument();
});
