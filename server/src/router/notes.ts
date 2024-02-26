import express from 'express';

import noteFinder from '../middleware/noteFinder';
import * as parser from '../util/parser';
import { Note, Comment } from '../model';

const router = express.Router();

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

    //@ts-ignore
    noteId: note.id,
  });

  return res.status(201).send(comment);
});

singleRouter.use('/comments', commentsRouter);

router.use('/:id', noteFinder, singleRouter);

export default router;
