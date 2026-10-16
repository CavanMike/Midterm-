import { usePreferences } from './PreferencesContext.jsx';

function Toolbar() {
  const { theme, toggleTheme } = usePreferences();
  return (
    <div className="row">
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}

function PreferencesPanel() {
  const { fontSize, setFontSize } = usePreferences();
  return (
    <div className="row" role="group" aria-label="Font size">
      {[14, 16, 18].map((size) => (
        <button
          key={size}
          onClick={() => setFontSize(size)}
          aria-pressed={fontSize === size}
          style={fontSize === size ? { background: 'var(--accent)', color: '#fff' } : undefined}
        >
          {size}px
        </button>
      ))}
    </div>
  );
}

function ArticlePreview() {
  const { theme, fontSize } = usePreferences();
  return (
    <article className="box" style={{ fontSize }}>
      <h3 style={{ margin: '0 0 6px' }}>Article preview</h3>
      <p style={{ margin: 0 }}>
        Theme: <strong>{theme}</strong> · Font size: <strong>{fontSize}px</strong>.
        This text reads its preferences straight from context, with no props
        passed through Dashboard.
      </p>
    </article>
  );
}

function Dashboard() {
  const { theme } = usePreferences();
  return (
    <div className={`themed ${theme}`}>
      <h3 style={{ marginTop: 0 }}>Dashboard</h3>
      <Toolbar />
      <PreferencesPanel />
      <ArticlePreview />
    </div>
  );
}

export default function Exam4() {
  return (
    <section>
      <h2>Application Preferences</h2>
      <Dashboard />

      <details>
        <summary>Debugging explanations</summary>
        <ul className="muted">
          <li>
            No provider: <code>useContext</code> returns the default value (<code>null</code>).
            Fix: wrap the tree in <code>&lt;PreferencesProvider&gt;</code>; <code>usePreferences</code>{' '}
            throws a clear error otherwise.
          </li>
          <li>
            Two context objects: a provider only feeds consumers that use the very same object.
            Fix: create it once, export it, and import it everywhere.
          </li>
          <li>
            Why no intermediate props: any descendant reads the nearest provider's value directly,
            so Dashboard and Toolbar no longer relay values they don't use.
          </li>
        </ul>
      </details>
    </section>
  );
}