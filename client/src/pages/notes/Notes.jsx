import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';

import NotesTable from './NotesTable';
import notesService from '../../services/notes';
import TextareaForm from './TextareaForm';

const loader = async () => {
  return await notesService.getNotes();
};

const Notes = () => {
  const loadedNotes = useLoaderData();
  const [notes, setNotes] = useState(loadedNotes);

  const createNote = async (content) => {
    const note = await notesService.postNote({ content });
    setNotes([...notes, note]);
  };

  return (
    <div className='notes-page'>
      <h2>Notes</h2>
      <NotesTable notes={notes} />

      <h3>Create a Note</h3>
      <TextareaForm create={createNote} label='Content' maxLength={1000} />
    </div>
  );
};

Notes.loader = loader;

export default Notes;
