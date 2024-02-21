import { render, screen, within } from '@testing-library/react';

import NoteComments from '../../src/pages/notes/NoteComments';
import { COMMENTS } from '../constants';
import util from '../../src/util';
import userEvent from '@testing-library/user-event';

const querySortButton = () => screen.queryByRole('button', { name: /Oldest|Latest/i });

const getComments = () => screen.getAllByTestId('comment');

describe('<NoteComments />', () => {
  test('when comments are empty, no comments are displayed', async () => {
    render(<NoteComments comments={[]} />);

    expect(screen.getByText('No comments'));
    expect(screen.queryByTestId('comments')).not.toBeInTheDocument();
  });

  describe('when there is a single comment', () => {
    const comment = COMMENTS[0];

    beforeEach(() => {
      render(<NoteComments comments={[comment]} />);
    });

    test('it is the only comment displayed', () => {
      const comments = getComments();
      expect(comments).toHaveLength(1);

      // comment can be found
      within(comments[0]).getByText(comment.content);
      within(comments[0]).getByText(util.formatDate(comment.createdAt));
    });

    test('comments sort button is not displayed', () => {
      expect(querySortButton()).not.toBeInTheDocument();
    });
  });

  describe('when there are multiple comments', () => {
    const comments = COMMENTS;
    let user;

    beforeEach(() => {
      user = userEvent.setup();
      render(<NoteComments comments={comments} />);
    });

    test('there are n comments in the comments list', () => {
      const displayedComments = getComments();
      expect(displayedComments).toHaveLength(comments.length);
    });

    test('comments sort button is displayed', () => {
      expect(querySortButton()).toBeInTheDocument();
    });

    test('default sort order is ascending', () => {
      const sortButton = querySortButton();

      // sort button has correct text
      expect(within(sortButton).getByText(/Oldest/i));

      // expect correct sort order...
      const displayedComments = getComments();
      within(displayedComments[0]).getByText(comments[0].content);
      within(displayedComments[1]).getByText(comments[2].content);
      within(displayedComments[2]).getByText(comments[1].content);
    });

    test('can sort descending', async () => {
      await user.click(querySortButton());
      within(querySortButton()).getByText(/Latest/i);

      // expect correct sort order...
      const displayedComments = getComments();
      within(displayedComments[2]).getByText(comments[0].content);
      within(displayedComments[1]).getByText(comments[2].content);
      within(displayedComments[0]).getByText(comments[1].content);
    });
  });
});
