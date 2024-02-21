/**
 * Notes page does not include comments
 */
export const NOTES = [
  {
    id: 1,
    content: 'Initial note',
    views: 5,
    createdAt: '2024-02-11T23:14:44.770Z'
  },
  {
    id: 2,
    content: 'Test content',
    views: 57,
    createdAt: '2024-02-11T22:09:40.066Z'
  },
  {
    id: 3,
    content: 'Last one',
    views: 2,
    createdAt: '2024-02-12T22:00:27.385Z'
  },
];

/**
 * Not in any correct order!
 */
export const COMMENTS = [
  {
    id: 1,
    content: 'postman!',
    createdAt: '2024-02-20T14:46:33.007Z'
  },
  {
    id: 2,
    content: 'Lorem Ipsum is simply dummy text of the typesetting industry.',
    createdAt: '2024-02-20T18:24:49.210Z'
  },
  {
    id: 3,
    content: 'Lorem Ipsum has been the standard dummy text ever since the 1500s.',
    createdAt: '2024-02-20T18:24:19.773Z'
  },
];

/**
 * Note page includes comments without comment.noteId
 */
export const NOTES_WITH_COMMENTS = {
  EMPTY: {
    ...NOTES[0],
    comments: [],
  },
  SINGLE: {
    ...NOTES[0],
    comments: [COMMENTS[0]],
  },
  MULTIPLE: {
    ...NOTES[0],
    comments: COMMENTS.toSpliced(0, 1),
  },
};
