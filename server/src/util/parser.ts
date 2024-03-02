import { ParseError } from './error';

const parseDefined = (value: unknown, name: string) => {
  if (value === undefined) {
    throw new ParseError(`Parameter ${name} is undefined`);
  }
  return value;
};

const parseString = (value: unknown, name: string) => {
  if (typeof value !== 'string') {
    throw new ParseError(`Parameter ${name} is not a string`);
  }
  return value;
};

export const parseId = (value: unknown, name = 'id') => {
  parseDefined(value, name);
  
  if (typeof value === 'number' || typeof value === 'string') {
    const regex = /^\d+$/;
    // numbers are coerced to strings
    if (regex.test(value.toString())) return Number(value);
  }

  throw new ParseError(`Parameter ${name} must be a non-negative integer`);
};

/**
 * Check if the value is a string, throw otherwise
 * 
 * @param value 
 * @param name 
 * @returns parameter value, if it is a string
 */
export const parseText = (value: unknown, name = 'content') => {
  return parseString(parseDefined(value, name), name);
};
