import PropTypes from 'prop-types';

export const Notification = ({ type, title, message, close }) => {
  return (
    <div className={`notification ${type}`}>
      <p>{title}</p>
      <p className='message'>{message}</p>
      <div className='action'>
        <button type='button' onClick={close}>Ok</button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

export const ErrorNotification = ({ message, close }) => {
  return (
    <Notification type='error' title='Error' message={message} close={close} />
  );
};

ErrorNotification.propTypes = {
  message: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};
