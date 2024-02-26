import { Request, Response } from 'express';

const unknownEndpoint = (req: Request, res: Response) => {
  return res.status(404).send({ message: 'Unknown endpoint' });
};

export default unknownEndpoint;
