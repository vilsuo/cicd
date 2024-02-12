import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { ErrorNotification } from '../../Notification';
import notesService from '../../services/notes';

export const NoteForm = ({ addNote }) => {
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
      <form method='post' onSubmit={postNote} aria-label='form'>
        <label>
          <span>Content</span>
          <TextareaAutosize
            placeholder='type here...'
            value={content}
            onChange={({ target }) => setContent(target.value)}
            required
          />
        </label>
        <div>
          <span>{content.trim().length}/1000</span>
          <button disabled={loading} type='submit'>Post</button>
        </div>
      </form>

      { message && (
        <ErrorNotification message={message} close={clearMessage} />
      )}
    </div>
  );
};

export default NoteForm;
