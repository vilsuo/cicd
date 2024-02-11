const router = require('express').Router();
const { Note } = require('../model');

router.get('/', async (req, res) => {
  const notes = await Note.findAll({});

  return res.send(notes);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const note = await Note.findByPk(id);

  if (!note) {
    return res.status(404).send({ message: 'Note does not exist' });
  }

  return res.send(await note.increment('views'));
});

router.post('/', async (req, res) => {
  const { content } = req.body;
  const note = await Note.create({ content });
  return res.status(201).send(note);
});

module.exports = router;
