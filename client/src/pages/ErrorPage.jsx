import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);
  
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={() => navigate('/', { replace: true })}>Home</button>
    </div>
  );
};

export default ErrorPage;
