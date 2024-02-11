import { useLoaderData, useNavigate } from 'react-router-dom';
import notesService from '../services/notes';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Notification from '../Notification';

export const notesLoader = async () => {
  return await notesService.getNotes();
};

const NotesTable = ({ notes }) => {
  const navigate = useNavigate();

  const handleClick = (note) => {
    navigate(`/notes/${note.id}`);
  };

  return (
    <table className='notes-table'>
      <thead>
        <tr>
          <th>Content</th>
          <th>Views</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {notes.map(note => 
          <tr key={note.id} className='note' onClick={() => handleClick(note)}>
            <td className='content'>{note.content}</td>
            <td className='center'>{note.views}</td>
            <td className='date center'>{note.createdAt}</td>
          </tr>  
        )}
      </tbody>
    </table>
  );
};

const NoteForm = ({ addNote }) => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessage = () => setMessage('');

  const postNote = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const note = await notesService.postNote({ content });
      addNote(note);
      setContent('');
      clearMessage();
    } catch(error) {
      setMessage(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className='note-form'>
      <form method='post' onSubmit={postNote}>
        <TextareaAutosize
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
        <button disabled={loading} type='submit'>
          Post
        </button>
      </form>

      { message && (
        <Notification message={message} close={clearMessage} />
      )}
    </div>
  );
};

const Notes = () => {
  const loadedNotes = useLoaderData();
  const [notes, setNotes] = useState(loadedNotes);

  const appendNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <div className='notes-page'>
      <NotesTable notes={notes} />
      <NoteForm addNote={appendNote} />
    </div>
  );
};

export default Notes;
