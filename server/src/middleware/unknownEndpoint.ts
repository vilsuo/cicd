import { Request, Response } from 'express';

const unknownEndpoint = (_req: Request, res: Response) => {
  return res.status(404).send({ message: 'Unknown endpoint' });
};

export default unknownEndpoint;
