import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// layouts
import RootLayout from './layouts/RootLayout';

// pages
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Notes, { notesLoader } from './pages/notes/Notes';
import Note, { noteLoader } from './pages/notes/Note';
import About from './pages/About';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path='/notes' element={<Notes />} loader={notesLoader} />
      <Route path='/notes/:id' element={<Note />} loader={noteLoader} />
      <Route path='/about' element={<About />} />
    </Route>
  )
);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
