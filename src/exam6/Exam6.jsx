import { useState } from 'react';
import { initialState, issueReducer } from './reducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

export default function Exam6() {
  const [state, dispatch] = usePersistentReducer(issueReducer, initialState, 'issue-tracker-v1');
  const [title, setTitle] = useState('');

  const open = state.issues.filter((i) => !i.done).length;
  const done = state.issues.length - open;

  const visible = state.issues.filter((i) =>
    state.filter === 'all' ? true : state.filter === 'open' ? !i.done : i.done
  );

  const submit = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_ISSUE', payload: { title } });
    setTitle('');
  };

  return (
    <section>
      <h2>Issue Tracker</h2>
      <form className="row" onSubmit={submit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New issue title" />
        <button type="submit">Add</button>
      </form>

      <div className="row">
        {['all', 'open', 'done'].map((f) => (
          <button key={f}
            style={state.filter === f ? { background: '#3b5bdb', color: '#fff' } : undefined}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: f } })}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={() => dispatch({ type: 'CLEAR_DONE' })} disabled={done === 0}>Clear done</button>
      </div>
      <p className="muted">All: {state.issues.length} · Open: {open} · Done: {done}</p>

      <ul className="plain">
        {visible.map((i) => (
          <li key={i.id}>
            <input type="checkbox" checked={i.done} aria-label={`Toggle ${i.title}`}
              onChange={() => dispatch({ type: 'TOGGLE_ISSUE', payload: { id: i.id } })} />
            <span className={i.done ? 'done' : ''}>#{i.id} {i.title}</span>
            <button onClick={() => dispatch({ type: 'DELETE_ISSUE', payload: { id: i.id } })}>Delete</button>
          </li>
        ))}
        {visible.length === 0 && <li className="muted">No issues in this view.</li>}
      </ul>
    </section>
  );
}