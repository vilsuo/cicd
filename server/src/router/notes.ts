import express, { RequestHandler } from 'express';

import noteFinder from '../middleware/noteFinder';
import * as noteService from '../service/noteService';
import * as parser from '../util/parser';
import { Note, Comment } from '../model';

const router = express.Router();

router.get('/', (async (_req, res) => {
  const notes = await Note.findAll();
  return res.send(notes);
}) as RequestHandler);

router.post('/', (async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const note = await noteService.createNote(req.body);
  return res.status(201).send(note);
}) as RequestHandler);

const singleRouter = express.Router();

singleRouter.get('/', (async (req, res) => {
  const { note } = req;
  return res.send(await note?.view());
}) as RequestHandler);

const commentsRouter = express.Router();

commentsRouter.post('/', (async (req, res) => {
  const { note } = req;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const content = parser.parseText(req.body.content);

  const comment = await Comment.create({
    content,
    noteId: note?.id,
  });

  return res.status(201).send(comment);
}) as RequestHandler);

singleRouter.use('/comments', commentsRouter);

router.use('/:id', noteFinder as RequestHandler, singleRouter);

export default router;
