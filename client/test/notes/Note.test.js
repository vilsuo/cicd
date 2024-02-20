import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { NOTES, NOTES_WITH_COMMENTS } from '../constants';
import util from '../../src/util';
import Notes from '../../src/pages/notes/Notes';
import Note from '../../src/pages/notes/Note';

const noteNoComments = NOTES[0];

const noteWithComments = NOTES_WITH_COMMENTS.SINGLE;

const notesRoute = {
  path: '/notes',
  element: <Notes />,
  loader: () => [noteNoComments],
};

const noteRoute = {
  path: `/notes/${noteWithComments.id}`,
  element: <Note />,
  loader: () => noteWithComments,
};

describe('<Note />', () => {
  let user;

  beforeEach(async () => {
    const routes = [notesRoute, noteRoute];

    const router = createMemoryRouter(routes, {
      initialEntries: [notesRoute.path, noteRoute.path],
      initialIndex: 1,
    });

    user = userEvent.setup();

    await act(async () => {
      render(<RouterProvider router={router} />);
    });
  });

  test('renders note details', async () => {
    const { content, views, createdAt } = noteWithComments;

    expect(screen.getByTestId('note')).toHaveTextContent(content);
    expect(screen.getByTestId('note')).toHaveTextContent(views);
    expect(screen.getByTestId('note')).toHaveTextContent(util.formatDate(createdAt));
  });

  test('renders note comments', async () => {
    const commentContent = noteWithComments.comments[0].content;
    expect(screen.getByTestId('comment')).toHaveTextContent(commentContent);
  });

  test('can navigate to the Notes page', async () => {
    const notesLink = screen.getByRole('link', { name: /Back/i });
    await user.click(notesLink);

    // expect to find the main heading
    expect(screen.getByRole('heading', { name: /^Notes$/i }))
      .toBeInTheDocument();
  });
});
