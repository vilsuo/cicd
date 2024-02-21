import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import axios from 'axios';

import { COMMENTS, NOTES, NOTES_WITH_COMMENTS } from '../constants';
import util from '../../src/util';
import Notes from '../../src/pages/notes/Notes';
import Note from '../../src/pages/notes/Note';

jest.mock('axios');
const mockedAxios = axios;

const noteNoComments = NOTES[0];

const notesRoute = {
  path: '/notes',
  element: <Notes />,
  loader: () => [noteNoComments],
};

const createNoteRoute = (noteWithComments) => ({
  path: `/notes/${noteWithComments.id}`,
  element: <Note />,
  loader: () => noteWithComments,
});

const getCommentTextarea = () => {
  return screen.getByLabelText(/Content/i);
};

const getCommentSubmitButton = () => {
  return screen.getByRole('button', { name: /Post/i });
};

const queryNoteComments = () => {
  return screen.queryAllByRole('listitem');
};

describe('<Note />', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('when note does not have any comments', () => {
    const note = NOTES_WITH_COMMENTS.EMPTY;

    beforeEach(async () => {
      const noteRoute = createNoteRoute(note);

      const router = createMemoryRouter(
        [notesRoute, noteRoute],
        {
          initialEntries: [notesRoute.path, noteRoute.path],
          initialIndex: 1,
        }
      );
  
      await act(async () => {
        render(<RouterProvider router={router} />);
      });
    });

    test('renders note details', async () => {
      const { content, views, createdAt } = note;
  
      expect(screen.getByTestId('note')).toHaveTextContent(content);
      expect(screen.getByTestId('note')).toHaveTextContent(views);
      expect(screen.getByTestId('note')).toHaveTextContent(util.formatDate(createdAt));
    });

    test('comment form is visible', () => {
      getCommentTextarea();
    });

    test('there are no comments', () => {
      screen.getByText(/No Comments/i);
      expect(queryNoteComments()).toHaveLength(0);
    });

    test('can navigate to the Notes page', async () => {
      const notesLink = screen.getByRole('link', { name: /Back/i });
      await user.click(notesLink);
  
      // expect to find the main heading
      expect(screen.getByRole('heading', { name: /^Notes$/i }))
        .toBeInTheDocument();
    });

    describe('after leaving a comment successfully', () => {
      const comment = COMMENTS[0];

      const mockedResponse = {
        data: comment,
        status: 201,
      };

      beforeEach(async () => {
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);

        await user.type(getCommentTextarea(), comment.content);
        await user.click(getCommentSubmitButton());
      });

      test('comment textarea is cleared', () => {
        expect(getCommentTextarea()).toHaveTextContent('');
      });

      test('the comment is rendered', () => {
        expect(queryNoteComments()[0]).toHaveTextContent(comment.content);
      });
    });

    describe('after leaving a comment unsuccessfully', () => {
      const comment = COMMENTS[0];

      const message = 'Something bad happened';
      const mockedResponse = {
        status: 400,
        response: { data: { message } },
      };

      beforeEach(async () => {
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);

        await user.type(getCommentTextarea(), comment.content);
        await user.click(getCommentSubmitButton());
      });

      test('comment textarea is not cleared', () => {
        expect(getCommentTextarea()).toHaveTextContent(comment.content);
      });

      test('the comment is not rendered', () => {
        expect(queryNoteComments()).toHaveLength(0);
      });
      
      test('response error message is displayed', () => {
        screen.getByText(message);
      });
    });
  });
});
