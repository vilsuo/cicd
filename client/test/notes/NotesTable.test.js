import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { NOTES } from '../constants';
import NotesTable from '../../src/pages/notes/NotesTable';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const getRows = () => {
  // eslint-disable-next-line no-unused-vars
  const [_headerRow, ...tableRows] = screen.getAllByRole('row');
  return tableRows;
};

const expectRowToHaveNote = (row, note) => {
  expect(within(row).getByRole('cell', { name: note.content }))
    .toBeInTheDocument();

  expect(within(row).getByRole('cell', { name: note.views }))
    .toBeInTheDocument();

  expect(within(row).getByRole('cell', { name: note.createdAt }))
    .toBeInTheDocument();
};

describe('<NotesTable />', () => {
  const note = NOTES[0];

  test('table does not have any row when there are no notes', async () => {
    render(
      <MemoryRouter>
        <NotesTable notes={[]} />
      </MemoryRouter>
    );

    expect(getRows()).toHaveLength(0);
  });

  test('table has as many rows as there are notes', async () => {
    render(
      <MemoryRouter>
        <NotesTable notes={NOTES} />
      </MemoryRouter>
    );

    expect(getRows()).toHaveLength(NOTES.length);
  });

  test('table displayes a note', async () => {
    render(
      <MemoryRouter>
        <NotesTable notes={[note]} />
      </MemoryRouter>
    );

    const rows = getRows();
    expectRowToHaveNote(rows[0], note);
  });

  test('after clicking a note navigation takes place', async () => {
    // set up before render
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NotesTable notes={[note]} />
      </MemoryRouter>
    );

    expect(mockedUseNavigate).not.toHaveBeenCalled();

    // click the first row
    await user.click(getRows()[0]);

    expect(mockedUseNavigate).toHaveBeenCalledWith(`/notes/${note.id}`);
  });
});
