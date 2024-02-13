import { render, screen, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { NOTES } from '../constants';
import NoteForm from '../../src/pages/notes/NoteForm';

jest.mock('axios');
const mockedAxios = axios;

const addNoteMock = jest.fn();

const getContentArea = () => {
  return screen.getByLabelText(/Content/i);
};

const getPostButton = () => {
  return screen.getByRole('button', /Post/i);
};

describe('<NoteForm />', () => {
  const note = NOTES[0];
  const { content } = note;

  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(<NoteForm addNote={addNoteMock} />);
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
      const mockedResponse = {
        data: note,
        status: 201,
      };

      beforeEach(async () => {
        // make the mock return the custom axios response
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        
        // type into form and submit
        await user.type(getContentArea(), content);
        await user.click(getPostButton());
      });

      test('adds the created note', async () => {
        expect(addNoteMock).toHaveBeenCalledWith(mockedResponse.data);
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
        // make the mock thrown an error
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        
        // type into form and submit
        await user.type(getContentArea(), content);
        await user.click(getPostButton());
      });

      test('a note is not added', async () => {
        expect(addNoteMock).not.toHaveBeenCalled();
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
