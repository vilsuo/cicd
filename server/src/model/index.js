const Note = require('./note');
const Comment = require('./comment');

Note.hasMany(Comment, {
  foreignKey: { allowNull: false }, // Comment can not exist without a Note
  onDelete: 'CASCADE', // when deleting a Note, delete also associated Comments
});
Comment.belongsTo(Note);

module.exports = {
  Note,
  Comment,
};
