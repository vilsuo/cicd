import { useLoaderData } from 'react-router-dom';
import notesService from '../services/notes';

export const noteLoader = async ({ params }) => {
  const { id } = params;
  return await notesService.getNote(id);
};


const Note = () => {
  const note = useLoaderData();

  const { content, views, createdAt } = note;

  return (
    <div className='note-page'>
      <nav>
        <a href='/notes'>Back</a>
      </nav>

      <div className='note'>
        <p>{content}</p>
        <div className='details'>
          <span className='detail'>{createdAt}</span>
          <span className='detail'>Views: <span>{views}</span></span>
        </div>
      </div>
    </div>
  );
};

export default Note;
