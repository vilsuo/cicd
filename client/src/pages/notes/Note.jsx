import { Link, useLoaderData } from 'react-router-dom';
import notesService from '../../services/notes';

const loader = async ({ params }) => {
  const { id } = params;
  return await notesService.getNote(id);
};

const Note = () => {
  const note = useLoaderData();

  const { content, views, createdAt } = note;

  return (
    <div className='note-page'>
      <nav>
        <Link to='/notes'>Back</Link>
      </nav>

      <div className='note' data-testid='note'>
        <p>{content}</p>
        <div className='details'>
          <span className='detail'>{createdAt}</span>
          <span className='detail'><span>{views}</span> Views</span>
        </div>
      </div>
    </div>
  );
};

Note.loader = loader;

export default Note;
