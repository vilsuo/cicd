import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

import { ErrorNotification } from '../../Notification';

const NoteForm = ({ createNote }) => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessage = () => setMessage('');

  const clear = () => {
    setContent('');
    clearMessage();
  };

  const postNote = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createNote({ content });
      clear();
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

NoteForm.propTypes = {
  createNote: PropTypes.func.isRequired,
};

export default NoteForm;
