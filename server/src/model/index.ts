import Note from './note';
import Comment from './comment';

Note.hasMany(Comment, {
  foreignKey: { allowNull: false }, // Comment can not exist without a Note
  onDelete: 'CASCADE', // when deleting a Note, delete also associated Comments
});
Comment.belongsTo(Note);

export {
  Note,
  Comment,
};
