import { render, screen, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextareaForm from '../../src/pages/notes/TextareaForm';

// props to component
const createMock = jest.fn();
const label = 'Test value';
const maxLength = 200;

const getTextarea = () => {
  return screen.getByLabelText(label);
};

const getPostButton = () => {
  return screen.getByRole('button', /Post/i);
};

describe('<TextareaForm />', () => {
  const data = { value: 'test input value', other: 'server given value' };
  const { value } = data;

  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(<TextareaForm create={createMock} label={label} maxLength={200} />);
  });

  test('textarea is empty', async () => {
    expect(getTextarea()).toHaveTextContent('');
  });

  test(
    'typing into textarea increments character count when prop maxLength is given',
    async () => {
      await user.type(getTextarea(), value);

      const element = screen.getByText(new RegExp(`${value.length}/${maxLength}`));
      expect(element).toBeInTheDocument();
    }
  );

  describe('submitting the form', () => {
    describe('successfully', () => {
      beforeEach(async () => {
        createMock.mockResolvedValueOnce(data);
        
        // type into form and submit
        await user.type(getTextarea(), value);
        await user.click(getPostButton());
      });

      test('adds the created note', async () => {
        expect(createMock).toHaveBeenCalledWith(value);

        expect(createMock.mock.results[0].value).resolves.toBe(data);
      });

      test('clears text area', () => {
        expect(getTextarea()).toHaveTextContent('');
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
        createMock.mockRejectedValueOnce(mockedResponse);
        
        // type into form and submit
        await user.type(getTextarea(), value);
        await user.click(getPostButton());
      });

      test('an error response is returned', async () => {
        expect(createMock).toHaveBeenCalledWith(value);
        expect(createMock.mock.results[0].value).rejects.toBe(mockedResponse);
      });

      test('text area is not cleared', () => {
        expect(getTextarea()).toHaveTextContent(value);
      });

      test('error notification is displayed', async () => {
        expect(screen.queryByText(message)).toBeInTheDocument();
      });
    });
  });
});
