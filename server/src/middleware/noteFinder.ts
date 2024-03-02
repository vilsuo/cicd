import { NextFunction, Request, Response } from 'express';
import * as noteService from '../service/noteService';

const noteFinder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const noteDto = await noteService.findNoteWithComments(id);

  if (!noteDto) {
    return res.status(404).send({ message: 'Note does not exist' });
  }
  
  req.note = noteDto;
  return next();
};

export default noteFinder;
