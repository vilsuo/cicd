import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import Note from './Note';
import Notes from './Notes';

const note = {
  id: 1,
  content: 'The first note!',
  views: 1,
  createdAt: '2024-02-11T23:14:44.770Z',
};

const notesRoute = {
  path: '/notes',
  element: <Notes />,
  loader: () => [note],
};

const noteRoute = {
  path: `/notes/${note.id}`,
  element: <Note />,
  loader: () => note,
};

describe('<Note />', () => {
  test('renders Note element', async () => {
    const routes = [noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [noteRoute.path],
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const element = screen.getByText(note.content);
    expect(element).toBeDefined();
  });

  test('can navigate to the Notes page', async () => {
    const routes = [notesRoute, noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [notesRoute.path, noteRoute.path],
      initialIndex: 1,
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // navigate to the notes page
    const user = userEvent.setup();
    const notesLink = screen.getByRole('link', { name: /Back/i });
    await user.click(notesLink);

    // expect to find the main heading
    expect(screen.getByRole('heading', { name: /^Notes$/i }))
      .toBeInTheDocument();
  });
});
