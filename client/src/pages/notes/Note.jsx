import { Link, useLoaderData } from 'react-router-dom';
import notesService from '../../services/notes';

import util from '../../util';
import NoteComments from './NoteComments';

const loader = async ({ params }) => {
  const { id } = params;
  return await notesService.getNote(id);
};

const Note = () => {
  const note = useLoaderData();

  const { content, views, createdAt, comments } = note;

  return (
    <div className='note-page'>
      <nav>
        <Link to='/notes'>Back</Link>
      </nav>

      <div className='container'>
        <h2>Note</h2>
        <div className='note' data-testid='note'>
          <p>{content}</p>
          <div className='details'>
            <span className='detail'>{util.formatDate(createdAt)}</span>
            <span className='detail'><span>{views}</span> Views</span>
          </div>
        </div>

        <h3>Comments</h3>
        <NoteComments comments={comments} />
      </div>
    </div>
  );
};

Note.loader = loader;

export default Note;
