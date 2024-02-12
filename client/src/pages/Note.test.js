import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Note from './Note';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const note = {
  id: 3,
  content: 'testing',
  views:3,
  createdAt: '2024-02-11T23:14:44.770Z',
};

const notePath = `/notes/${note.id}`;

const noteRoute = {
  path: notePath,
  element: <Note />,
  loader: () => note,
};

describe('<Note />', () => {
  test('renders Note element', async () => {
    const routes = [noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [notePath],
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const element = screen.getByText(note.content);
    expect(element).toBeDefined();
  });

  /*
  test('can navigate to the Notes page', async () => {

  });
  */
});
