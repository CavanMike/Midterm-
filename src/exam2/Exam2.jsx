import { useEffect, useState } from 'react';

const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' },
];

function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return <p>Session timer: <strong>{seconds}s</strong></p>;
}

export default function Exam2() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const [searching, setSearching] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    setSearching(true);
    const id = setTimeout(() => {
      const q = query.trim().toLowerCase();
      setResults(
        USERS.filter(
          (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
        )
      );
      setSearching(false);
    }, 400);
    return () => clearTimeout(id); // cancels the previous search
  }, [query]);

  useEffect(() => {
    document.title = `${results.length} result${results.length === 1 ? '' : 's'}`;
  }, [results.length]);

  return (
    <section>
      <h2>Live Search and Timer</h2>
      <div className="row">
        <label>
          Search:{' '}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or role" />
        </label>
        <span className="muted">{searching ? 'Searching…' : `${results.length} result(s)`}</span>
      </div>

      <ul className="plain">
        {results.map((u) => (
          <li key={u.id}><strong>{u.name}</strong> <span className="muted">{u.role}</span></li>
        ))}
        {!searching && results.length === 0 && <li className="muted">No users found.</li>}
      </ul>

      <hr />
      <button onClick={() => setShowTimer((v) => !v)}>
        {showTimer ? 'Unmount timer' : 'Mount timer'}
      </button>
      {showTimer && <SessionTimer />}
    </section>
  );
}