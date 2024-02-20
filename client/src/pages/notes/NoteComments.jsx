import PropTypes from 'prop-types';
import util from '../../util';
import { useState } from 'react';

const Comment = ({ comment }) => {
  const { content, createdAt } = comment;

  return (
    <li className='comment' data-testid='comment'>
      <p className='content'>{content}</p>
      <p className='detail'>{util.formatDate(createdAt)}</p>
    </li>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired
};

// Ascending: smallest to largest
const DIRECTION = { DESC: -1, ASC: 1 };

const NoteComments = ({ comments }) => {
  const [direction, setDirection] = useState(DIRECTION.ASC);

  const toggleDirection = () => {
    setDirection((direction === DIRECTION.ASC) ? DIRECTION.DESC : DIRECTION.ASC);
  };

  const sortComments = (a, b) => {
    const valueA = a.createdAt;
    const valueB = b.createdAt;

    const comparison = (valueA < valueB) ? -1 : ((valueA > valueB) ? 1 : 0);
    return direction * comparison;
  };

  if (comments.length === 0) {
    return (
      <div>
        No comments
      </div>
    );
  }

  // show comments sort options if there are more than a single comment
  return (
    <div>
      { (comments.length > 1) && (
        <div className='comments-sort-box'>
          <p>Order by:</p>
          <button onClick={toggleDirection}>
            {direction === DIRECTION.ASC ? 'Oldest' : 'Latest'}
          </button>
        </div>
      )}

      <ul className='comments' data-testid='comments'>
        { comments.toSorted(sortComments).map(comment =>
          <Comment key={comment.id} comment={comment} />
        )}
      </ul>
    </div>
  );
};

NoteComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NoteComments;
