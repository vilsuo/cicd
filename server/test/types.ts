import { Attributes, Model } from 'sequelize';
import { Response } from 'supertest';

// TYPES

/**
 * Key-value pairs
 */
export type GenericObject = Record<string, unknown>;

/**
 * Api 'error' response body
 */
export type MessageBody = { message: string };

export type ResponseModel<T extends Model> = Omit<Attributes<T>, 'createdAt'> & { createdAt: string };

// Overwrite the supertest response body to be generic
type SuperTestResponse<T> = Omit<Response, 'body'> & { body: T };

export type ApiResponse<T> = SuperTestResponse<T | MessageBody>;


export const expectMessage = (body: unknown, message: string | RegExp) => {
  expect(body).toStrictEqual({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    message: expect.stringMatching(message)
  });
};

/*
export const modelToResponseObject = (model: Note | Comment) => {
  const dataValues = model.dataValues;

  return {
    ...dataValues,

    // Date objects implement the toJSON() method which returns a string (the
    // same as date.toISOString()). Thus, they will be stringified as strings.
    createdAt: dataValues.createdAt.toJSON()
  };
};
*/

export const modelToResponseObject = (dataValues: { createdAt: Date }) => {
  return {
    ...dataValues,

    // Date objects implement the toJSON() method which returns a string (the
    // same as date.toISOString()). Thus, they will be stringified as strings.
    createdAt: dataValues.createdAt.toJSON()
  };
};

// NARROWING
/*
export const isMessageBody: (body: GenericObject) => asserts body is MessageBody = (body) => {
  if (!('message' in body && typeof body.message === 'string')) {
    throw new Error('');
  }
};
*/
