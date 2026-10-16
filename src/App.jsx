import { useState } from 'react';
import { PreferencesProvider } from './exam4/PreferencesContext.jsx';
import Exam1 from './exam1/Exam1.jsx';
import Exam2 from './exam2/Exam2.jsx';
import Exam3 from './exam3/Exam3.jsx';
import Exam4 from './exam4/Exam4.jsx';
import Exam5 from './exam5/Exam5.jsx';
import Exam6 from './exam6/Exam6.jsx';

const EXAMS = [
  { id: 1, label: '1 · useState',            Component: Exam1 },
  { id: 2, label: '2 · useEffect',           Component: Exam2 },
  { id: 3, label: '3 · useRef',              Component: Exam3 },
  { id: 4, label: '4 · useContext',          Component: Exam4 },
  { id: 5, label: '5 · useMemo/useCallback', Component: Exam5 },
  { id: 6, label: '6 · useReducer',          Component: Exam6 },
];

export default function App() {
  const [active, setActive] = useState(1);
  const { Component } = EXAMS.find((e) => e.id === active);

  return (
    <PreferencesProvider>
      <div className="shell">
        <h1>React Hooks Practical Exam</h1>

        <nav className="tabs" aria-label="Exam selector">
          {EXAMS.map((e) => (
            <button
              key={e.id}
              className={e.id === active ? 'tab active' : 'tab'}
              onClick={() => setActive(e.id)}
            >
              {e.label}
            </button>
          ))}
        </nav>

        <main className="panel">
          <Component />
        </main>
      </div>
    </PreferencesProvider>
  );
}