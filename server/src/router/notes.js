const express = require('express');

const router = require('express').Router();
const noteFinder = require('../middleware/noteFinder');
const parser = require('../util/parser');
const { Note, Comment } = require('../model');

router.get('/', async (req, res) => {
  const notes = await Note.findAll({});

  return res.send(notes);
});

router.post('/', async (req, res) => {
  const content = parser.parseText(req.body.content);
  const note = await Note.create({ content });

  return res.status(201).send({
    ...note.toJSON(),
    comments: []
  });
});

const singleRouter = express.Router();

singleRouter.get('/', async (req, res) => {
  const { note } = req;
  return res.send(await note.increment('views'));
});

const commentsRouter = express.Router();

commentsRouter.post('/', async (req, res) => {
  const { note } = req;
  const content = parser.parseText(req.body.content);

  const comment = await Comment.create({
    content,
    noteId: note.id,
  });

  return res.status(201).send(comment);
});

singleRouter.use('/comments', commentsRouter);

router.use('/:id', noteFinder, singleRouter);

module.exports = router;
