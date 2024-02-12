import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const NotesTable = ({ notes }) => {
  const navigate = useNavigate();

  const handleClick = (note) => {
    navigate(`/notes/${note.id}`);
  };

  return (
    <table className='notes-table'>
      <thead>
        <tr>
          <th>Content</th>
          <th>Views</th>
          <th className='date'>Date</th>
        </tr>
      </thead>
      <tbody>
        {notes.map(note => 
          <tr key={note.id} className='note' onClick={() => handleClick(note)}>
            <td className='content'>{note.content}</td>
            <td className='center'>{note.views}</td>
            <td className='date center'>{note.createdAt}</td>
          </tr>  
        )}
      </tbody>
    </table>
  );
};

NotesTable.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string,
      views: PropTypes.number,
      createdAt: PropTypes.string,
    })
  )
};

export default NotesTable;
