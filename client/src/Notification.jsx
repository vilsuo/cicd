
const Notification = ({ message, close }) => {
  return (
    <div className='notification'>
      <p>{message}</p>
      <div className='action'>
        <button type='button' onClick={close}>Ok</button>
      </div>
    </div>
  );
};

export default Notification;
