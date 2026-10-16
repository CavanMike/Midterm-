import test from 'node:test';
import assert from 'node:assert/strict';
import { issueReducer } from './reducer.js';

test('ADD_ISSUE adds an open issue and increments nextId', () => {
  const start = { issues: [], filter: 'all', nextId: 1 };
  const next = issueReducer(start, { type: 'ADD_ISSUE', payload: { title: 'Fix bug' } });
  assert.deepEqual(next.issues, [{ id: 1, title: 'Fix bug', done: false }]);
  assert.equal(next.nextId, 2);
  assert.deepEqual(start.issues, []);
});

test('TOGGLE_ISSUE flips done without mutating', () => {
  const issue = { id: 1, title: 'A', done: false };
  const start = { issues: [issue], filter: 'all', nextId: 2 };
  const next = issueReducer(start, { type: 'TOGGLE_ISSUE', payload: { id: 1 } });
  assert.equal(next.issues[0].done, true);
  assert.equal(issue.done, false);
  assert.notEqual(next.issues[0], issue);
});

test('CLEAR_DONE removes only completed issues; unknown action keeps state', () => {
  const start = {
    issues: [{ id: 1, title: 'A', done: true }, { id: 2, title: 'B', done: false }],
    filter: 'all',
    nextId: 3,
  };
  const next = issueReducer(start, { type: 'CLEAR_DONE' });
  assert.deepEqual(next.issues, [{ id: 2, title: 'B', done: false }]);
  assert.equal(issueReducer(start, { type: 'NOPE' }), start);
});