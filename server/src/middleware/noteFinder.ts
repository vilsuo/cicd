import { NextFunction, Request, Response } from 'express';
import { Note, Comment } from '../model';
import * as parser from '../util/parser';

const noteFinder = async (req: Request, res: Response, next: NextFunction) => {
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

export default noteFinder;
