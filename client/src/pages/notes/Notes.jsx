import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';

import NotesTable from './NotesTable';
import NoteForm from './NoteForm';
import notesService from '../../services/notes';

export const notesLoader = async () => {
  return await notesService.getNotes();
};

const Notes = () => {
  const loadedNotes = useLoaderData();
  const [notes, setNotes] = useState(loadedNotes);

  const appendNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <div className='notes-page'>
      <h2>Notes</h2>
      <NotesTable notes={notes} />

      <h3>Create a Note</h3>
      <NoteForm addNote={appendNote} />
    </div>
  );
};

export default Notes;
