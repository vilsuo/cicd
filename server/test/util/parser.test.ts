import { ParseError } from '../../src/util/error';
import { parseId, parseText } from '../../src/util/parser';

const expectToThrow = (
  fn: (arg0: unknown) => string | number,
  value: unknown,
) => {
  expect(() => fn(value)).toThrow(ParseError);
};

describe('parseId', () => {
  const expectParseIdToThrow = (value: unknown = undefined) => {
    expectToThrow(parseId, value);
  };

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

describe('parseText', () => {
  const expectParseTextToThrow = (value: unknown = undefined) => {
    expectToThrow(parseText, value);
  };

  test('parsing without a value throws', () => { expectParseTextToThrow(); });

  test('calling with with a type other than string', () => {
    expectParseTextToThrow(7);
    expectParseTextToThrow(false);
    expectParseTextToThrow(true);
    expectParseTextToThrow(['1']);
    expectParseTextToThrow({ 1: '1' });
  });

  test('empty string value returns empty string', () => {
    expect(parseText('')).toBe('');
  });

  test('string value returns the string', () => {
    const content = 'Test content';
    expect(parseText(content)).toBe(content);
  });
});

