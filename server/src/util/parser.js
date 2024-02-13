const ParseError = require('./error');

const parseDefined = (value, name) => {
  if (value === undefined) {
    throw new ParseError(`Parameter ${name} is undefined`);
  }
  return value;
};

const parseString = (value, name) => {
  if (typeof value !== 'string') {
    throw new ParseError(`Parameter ${name} is not a string`);
  }
  return value;
};

const parseId = (value, name = 'id') => {
  parseDefined(value, name);
  
  if (typeof value === 'number' || typeof value === 'string') {
    const regex = /^\d+$/;
    // numbers are coerced to strings
    if (regex.test(value)) return Number(value);
  }

  throw new ParseError(`Parameter ${name} must be a non-negative integer`);
};

const parseContent = (value, name = 'content') => {
  return parseString(parseDefined(value, name), name);
};

module.exports = {
  parseId,
  parseContent,
};
