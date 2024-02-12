import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { NOTES } from '../constants';
import Notes from '../../src/pages/notes/Notes';
import Note from '../../src/pages/notes/Note';

const note = NOTES[0];

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

    expect(screen.getByTestId('note')).toBeInTheDocument();
  });

  test('renders note details', async () => {
    const routes = [noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [noteRoute.path],
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    expect(screen.getByText(note.content)).toBeDefined();

    expect(screen.getByTestId('note')).toHaveTextContent(note.views);
    expect(screen.getByTestId('note')).toHaveTextContent(note.createdAt);
  });

  test('can navigate to the Notes page', async () => {
    const routes = [notesRoute, noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [notesRoute.path, noteRoute.path],
      initialIndex: 1,
    });

    const user = userEvent.setup();

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // navigate to the Notes page
    const notesLink = screen.getByRole('link', { name: /Back/i });
    await user.click(notesLink);

    // expect to find the main heading
    expect(screen.getByRole('heading', { name: /^Notes$/i }))
      .toBeInTheDocument();
  });
});
