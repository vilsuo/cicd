import { useLoaderData } from 'react-router-dom';
import notesService from '../services/notes';

export const noteLoader = async ({ params }) => {
  const { id } = params;
  return await notesService.getNote(id);
};

const Note = () => {
  const note = useLoaderData();

  return (
    <div className='note-page'>
      {note.content}
    </div>
  );
};

export default Note;
