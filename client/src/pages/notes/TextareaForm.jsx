import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

import { ErrorNotification } from '../../Notification';

const TextareaForm = ({ create, label, maxLength }) => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessage = () => setMessage('');

  const clear = () => {
    setValue('');
    clearMessage();
  };

  const postValue = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await create(value);
      clear();

    } catch(error) {
      setMessage(error.response.data.message);
    }

    setLoading(false);
  };

  return (
    <div className='textarea-form'>
      <form method='post' onSubmit={postValue} aria-label='form'>
        <label>
          <span>{label}</span>
          <TextareaAutosize
            placeholder='type here...'
            value={value}
            onChange={({ target }) => setValue(target.value)}
            required
          />
        </label>
        <div>
          { maxLength && <span>{value.trim().length}/{maxLength}</span> }
          <button disabled={loading} type='submit'>Post</button>
        </div>
      </form>

      { message && (
        <ErrorNotification message={message} close={clearMessage} />
      )}
    </div>
  );
};

TextareaForm.propTypes = {
  create: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

export default TextareaForm;
