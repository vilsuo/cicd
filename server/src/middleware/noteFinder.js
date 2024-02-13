const { Note } = require('../model');
const parser = require('../util/parser');

const noteFinder = async (req, res, next) => {
  const id = parser.parseId(Number(req.params.id));
  const note = await Note.findByPk(id);

  if (!note) {
    return res.status(404).send({ message: 'Note does not exist' });
  }
  
  req.note = note;
  return next();
};

module.exports = noteFinder;
