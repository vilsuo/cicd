import { render, screen } from '@testing-library/react';

import Home from './Home';

describe('<Home />', () => {
  test('renders Home component', async () => {
    // Render a React element into the DOM
    render(<Home />);

    expect(screen.getByRole('heading')).toHaveTextContent('Home');
  });
});
