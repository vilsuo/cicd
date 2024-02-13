const router = require('express').Router();
const noteFinder = require('../middleware/noteFinder');
const parser = require('../util/parser');
const { Note } = require('../model');

router.get('/', async (req, res) => {
  const notes = await Note.findAll({});

  return res.send(notes);
});

router.get('/:id', noteFinder, async (req, res) => {
  const note = req.note;
  return res.send(await note.increment('views'));
});

router.post('/', async (req, res) => {
  const content = parser.parseContent(req.body.content);
  const note = await Note.create({ content });
  return res.status(201).send(note);
});

module.exports = router;
