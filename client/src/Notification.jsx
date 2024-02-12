
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

export const ErrorNotification = ({ message, close }) => {
  return (
    <Notification type='error' title='Error' message={message} close={close} />
  );
};
