import { useRef, useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// registered = list of accounts already created in this session
function validate({ name, email, password }, registered) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required.';
  } else if (registered.some((u) => u.name.toLowerCase() === name.trim().toLowerCase())) {
    errors.name = 'This name is not available and already registered.';
  }

  if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address (e.g. you@example.com).';
  } else if (registered.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    errors.email = 'This email is not available and already registered.';
  }

  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';

  return errors;
}

export default function Exam3() {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [registered, setRegistered] = useState([]);   // accounts created so far
  const [previousEmail, setPreviousEmail] = useState(null);
  const [success, setSuccess] = useState('');
  const [clicks, setClicks] = useState(0);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const lastEmailRef = useRef(null); // remembered without causing a render

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values, registered);
    setErrors(found);
    setSuccess('');

    // Focus the first invalid field: name, then email, then password
    if (found.name) return nameRef.current.focus();
    if (found.email) return emailRef.current.focus();
    if (found.password) return passwordRef.current.focus();

    const name = values.name.trim();
    const email = values.email.trim();

    setRegistered((list) => [...list, { name, email }]);
    setPreviousEmail(lastEmailRef.current);
    lastEmailRef.current = email;
    setSuccess(`${name} has successfully registered.`);
    setValues({ name: '', email: '', password: '' });
  };

  return (
    <section>
      <h2>Accessible Form Toolkit</h2>

      {success && (
        <div className="success" role="status">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" ref={nameRef} value={values.name} onChange={handleChange}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
          {errors.name && <span id="name-err" className="error" role="alert">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" ref={emailRef} value={values.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
          {errors.email && <span id="email-err" className="error" role="alert">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" ref={passwordRef} value={values.password} onChange={handleChange}
            aria-invalid={!!errors.password} aria-describedby={errors.password ? 'pw-err' : undefined} />
          {errors.password && <span id="pw-err" className="error" role="alert">{errors.password}</span>}
        </div>

        <button type="submit">Register</button>
      </form>

      <p className="muted">Previous submitted email: {previousEmail ?? 'none yet'}</p>
      <p className="muted">Registered accounts: {registered.length}</p>

      <hr />
      <h3>Debugging case: clicks</h3>
      <button onClick={() => setClicks((c) => c + 1)}>Clicked {clicks} times</button>
      <p className="muted">
        A ref (<code>clicks.current++</code>) changes silently: React only re-renders when state
        changes or a parent re-renders, and ref mutation schedules nothing. Data shown on screen
        must live in state.
      </p>
    </section>
  );
}