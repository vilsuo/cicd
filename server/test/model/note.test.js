const { Sequelize } = require('sequelize');
const { Note } = require('../../src/model');
const { NOTE_MIN_CONTENT_LENGTH, NOTE_MAX_CONTENT_LENGTH } = require('../../src/model/constants');

beforeEach(async () => {
  await Note.sync({ force: true });
});

describe('Note', () => {
  const testContent = 'Test content';

  const expectValidationError = async (values) => {
    await expect(async () => await Note.create(values))
      .rejects.toThrow(Sequelize.ValidationError);
  };

  test('created Note has default zero views', async () => {
    const note = await Note.create({ content: testContent });
    expect(note.views).toBe(0);
  });

  describe('validation', () => {

    test('can not create a Note without content', async () => {
      await expectValidationError({});
    });

    test('can not create a Note with empty content', async () => {
      await expectValidationError({ content: '' });
    });

    test('short content', async () => {
      const tooShortContent = '#'.repeat(NOTE_MIN_CONTENT_LENGTH - 1);
      await expectValidationError({ content: tooShortContent });

      const content = '#'.repeat(NOTE_MIN_CONTENT_LENGTH);
      await expect(Note.create({ content })).resolves.not.toThrowError();
    });

    test('long content', async () => {
      const tooLongContent = '#'.repeat(NOTE_MAX_CONTENT_LENGTH + 1);
      await expectValidationError({ content: tooLongContent });

      const content = '#'.repeat(NOTE_MAX_CONTENT_LENGTH);
      await expect(Note.create({ content })).resolves.not.toThrowError();
    });
  });

  describe('hooks', () => {
    test('Note content is trimmed', async () => {
      const content = ' trim this! ';
      const note = await Note.create({ content });
      expect(note.content).toBe(content.trim());
    });

    test('can not create if trimmed content is too short', async () => {
      const tooShortContent = '#'.repeat(NOTE_MIN_CONTENT_LENGTH - 1);
      await expectValidationError({ content: tooShortContent + '  ' });
    });
  });

  describe('instance methods', () => {
    test('viewing increments the Note view count', async () => {
      const note = await Note.create({ content: testContent });

      await note.view();
      expect(note.views).toBe(1);

      await note.view();
      expect(note.views).toBe(2);
    });
  });
});
