const { Note, Comment } = require('../model');
const parser = require('../util/parser');

const noteFinder = async (req, res, next) => {
  const id = parser.parseId(req.params.id);
  const note = await Note.findByPk(id, {
    include: {
      model: Comment,
      attributes: { exclude: ['noteId'] },
    }
  });

  if (!note) {
    return res.status(404).send({ message: 'Note does not exist' });
  }
  
  req.note = note;
  return next();
};

module.exports = noteFinder;
