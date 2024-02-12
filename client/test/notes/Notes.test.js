import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import axios from 'axios';

import { NOTES } from '../constants';
import Note from '../../src/pages/notes/Note';
import Notes from '../../src/pages/notes/Notes';

jest.mock('axios');
const mockedAxios = axios;

const createNoteRoute = (note) => ({
  path: `/notes/${note.id}`,
  element: <Note />,
  loader: () => note,
});

const createNotesRoute = (notes = []) => ({
  path: '/notes',
  element: <Notes />,
  loader: () => notes,
});

// note table
const getNoteTable = () => screen.getByRole('table');

const getNoteTableBodyRows = () => {
  const notesTable = getNoteTable();
  // eslint-disable-next-line no-unused-vars
  const [_headerRow, ...tableRows] = within(notesTable).getAllByRole('row');
  return tableRows;
};

const expectTableRowToHaveNote = (row, note) => {
  expect(within(row).getByRole('cell', { name: note.content }))
    .toBeInTheDocument();

  expect(within(row).getByRole('cell', { name: note.views }))
    .toBeInTheDocument();

  expect(within(row).getByRole('cell', { name: note.createdAt }))
    .toBeInTheDocument();
};

// note form
const getNoteForm = () => screen.getByRole('form');

const getContentArea = () => {
  return screen.getByLabelText(/Content/i);
};

const getPostButton = () => {
  return screen.getByRole('button', /Post/i);
};

describe('<Notes />', () => {
  const [note, newNote] = NOTES;

  test('renders Note table and Note form', async () => {
    const routes = [createNotesRoute()];

    const router = createMemoryRouter(routes, {
      initialEntries: [routes[0].path]
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // header
    expect(screen.getByRole('heading', { name: /^Notes$/i }))
      .toBeInTheDocument();

    // note table
    expect(getNoteTable()).toBeInTheDocument();

    // note form
    expect(getNoteForm())
      .toBeInTheDocument();
  });

  test('when no notes are loaded, the note table is empty', async () => {
    const routes = [createNotesRoute()];

    const router = createMemoryRouter(routes, {
      initialEntries: [routes[0].path]
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    expect(getNoteTableBodyRows()).toHaveLength(0);
  });

  test('when a note is loaded, the note is in the table', async () => {
    const routes = [createNotesRoute([note])];

    const router = createMemoryRouter(routes, {
      initialEntries: [routes[0].path]
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const tableRows = getNoteTableBodyRows();
    expect(tableRows).toHaveLength(1);
    expectTableRowToHaveNote(tableRows[0], note);
  });

  test('can navigate to Note page from a table note', async () => {
    const routes = [createNotesRoute([note]), createNoteRoute(note)];

    const router = createMemoryRouter(routes, {
      initialEntries: [routes[0].path],
      initialIndex: 0,
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // click note table row to navigate to Note page
    const user = userEvent.setup();
    const noteTableRow = getNoteTableBodyRows()[0];
    await user.click(noteTableRow);

    // expect Note page to be rendered
    expect(screen.getByTestId('note')).toBeInTheDocument();
  });

  test('posting a note adds the note to the table', async () => {
    const routes = [createNotesRoute([note])];

    const router = createMemoryRouter(routes, {
      initialEntries: [routes[0].path],
    });

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const mockedResponse = {
      data: newNote,
      status: 201,
    };

    // make the mock return the custom axios response
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);

    // click note table row to navigate to Note page
    const user = userEvent.setup();
    await user.type(getContentArea(), newNote.content);
    await user.click(getPostButton());

    // expect note to be in the table
    const tableRows = getNoteTableBodyRows();
    expect(tableRows).toHaveLength(2);
    expectTableRowToHaveNote(tableRows[1], newNote);
  });
});
