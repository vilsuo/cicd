const ParseError = require('../../src/util/error');
const { parseId, parseContent } = require('../../src/util/parser');

const expectToThrow = (fn, value, error) => {
  expect(() => fn(value)).toThrow(error);
};

describe('parseId', () => {
  const expectParseIdToThrow = (value) => expectToThrow(parseId, value, ParseError);

  test('parsing without a value throws', () => { expectParseIdToThrow(); });

  test('calling with with a type other than string or number throws', () => {
    expectParseIdToThrow(false);
    expectParseIdToThrow(true);
    expectParseIdToThrow(['1']);
    expectParseIdToThrow({ 1: '1' });
  });

  describe('string parameters', () => {
    test('empty string throws', () => { expectParseIdToThrow(''); });

    test('characters throw', () => { expectParseIdToThrow('abc'); });

    test('integer throws', () => { expectParseIdToThrow('1.0'); });

    test('negative integer throws', () => { expectParseIdToThrow('-1'); });

    test('zero returns zero', () => {
      expect(parseId('0')).toBe(0);
    });

    test('positive integer returns the integer', () => {
      expect(parseId('42')).toBe(42);
    });
  });

  describe('number parameters', () => {
    test('Nan throws', () => { expectParseIdToThrow(NaN); });

    test('float throws', () => { expectParseIdToThrow(1.01); });

    test('negative integer throws', () => { expectParseIdToThrow(-1); });

    test('zero returns zero', () => {
      expect(parseId(0)).toBe(0);
    });

    test('positive integer returns the integer', () => {
      expect(parseId(42)).toBe(42);
    });

    test('positive number representable as an integer returns the integer', () => {
      expect(parseId(42.0)).toBe(42);
    });
  });
});

describe('parseContent', () => {
  const expectParseContentToThrow = (value) => expectToThrow(parseContent, value, ParseError);

  test('parsing without a value throws', () => { expectParseContentToThrow(); });

  test('calling with with a type other than string', () => {
    expectParseContentToThrow(7);
    expectParseContentToThrow(false);
    expectParseContentToThrow(true);
    expectParseContentToThrow(['1']);
    expectParseContentToThrow({ 1: '1' });
  });

  test('empty string value returns empty string', () => {
    expect(parseContent('')).toBe('');
  });

  test('string value returns the string', () => {
    const content = 'Test content';
    expect(parseContent(content)).toBe(content);
  });
});

