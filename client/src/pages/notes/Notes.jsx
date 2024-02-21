import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';

import NotesTable from './NotesTable';
import NoteForm from './NoteForm';
import notesService from '../../services/notes';

const loader = async () => {
  return await notesService.getNotes();
};

const Notes = () => {
  const loadedNotes = useLoaderData();
  const [notes, setNotes] = useState(loadedNotes);

  const createNote = async (values) => {
    const note = await notesService.postNote(values);
    setNotes([...notes, note]);
  };

  return (
    <div className='notes-page'>
      <h2>Notes</h2>
      <NotesTable notes={notes} />

      <h3>Create a Note</h3>
      <NoteForm createNote={createNote} />
    </div>
  );
};

Notes.loader = loader;

export default Notes;
