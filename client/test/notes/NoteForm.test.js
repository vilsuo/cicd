import { render, screen, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NOTES_WITH_COMMENTS } from '../constants';
import NoteForm from '../../src/pages/notes/NoteForm';

const createNoteMock = jest.fn();

const getContentArea = () => {
  return screen.getByLabelText(/Content/i);
};

const getPostButton = () => {
  return screen.getByRole('button', /Post/i);
};

describe('<NoteForm />', () => {
  const note = NOTES_WITH_COMMENTS.EMPTY;
  const { content } = note;

  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(<NoteForm createNote={createNoteMock} />);
  });

  test('textarea is empty', async () => {
    expect(getContentArea()).toHaveTextContent('');
  });

  test('typing into textarea increments character count', async () => {
    await user.type(getContentArea(), content);

    const element = screen.getByText(new RegExp(`${content.length}/1000`));
    expect(element).toBeInTheDocument();
  });

  describe('submitting the form', () => {
    describe('successfully', () => {
      beforeEach(async () => {
        createNoteMock.mockResolvedValueOnce(note);
        
        // type into form and submit
        await user.type(getContentArea(), content);
        await user.click(getPostButton());
      });

      test('adds the created note', async () => {
        expect(createNoteMock).toHaveBeenCalledWith({ content });

        expect(createNoteMock.mock.results[0].value).resolves.toBe(note);
      });

      test('clears text area', () => {
        expect(getContentArea()).toHaveTextContent('');
      });
    });

    describe('unsuccessfully', () => {
      const message = 'Something bad happened';
      const mockedResponse = {
        status: 400,
        response: { data: { message } },
      };

      beforeEach(async () => {
        // make the mock return an error response
        createNoteMock.mockRejectedValueOnce(mockedResponse);
        
        // type into form and submit
        await user.type(getContentArea(), content);
        await user.click(getPostButton());
      });

      test('an error response is returned', async () => {
        expect(createNoteMock).toHaveBeenCalledWith({ content });
        expect(createNoteMock.mock.results[0].value).rejects.toBe(mockedResponse);
      });

      test('text area is not cleared', () => {
        expect(getContentArea()).toHaveTextContent(content);
      });

      test('error notification is displayed', async () => {
        expect(screen.queryByText(message)).toBeInTheDocument();
      });
    });
  });
});
