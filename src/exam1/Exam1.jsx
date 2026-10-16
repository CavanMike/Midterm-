import { useState } from 'react';

export default function Exam1() {
  // 1. Two state values with valid starting values
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(5);

  // 2. Status is DERIVED from state (no separate status state)
  const reached = count >= target;
  let status = 'In progress';
  if (count === 0) status = 'Not started';
  else if (reached) status = 'Target reached';

  // 3. Controls (count stays between 0 and target)
  const increment = () => setCount((c) => Math.min(c + 1, target));
  const decrement = () => setCount((c) => Math.max(c - 1, 0));
  const reset = () => setCount(0);

  // 4. Plus two: two queued functional updates (the debugging fix)
  const addTwo = () => {
    setCount((c) => Math.min(c + 1, target));
    setCount((c) => Math.min(c + 1, target));
  };

  const changeTarget = (e) => {
    const n = Number(e.target.value);
    setTarget(Number.isNaN(n) || n < 1 ? 1 : n);
  };

  return (
    <section>
      <h2>Smart Task Counter</h2>

      <div className="big">{count} / {target}</div>
      <p className="status">Status: {status}</p>

      <div className="row">
        {/* 5. Disabled once the target is reached */}
        <button onClick={increment} disabled={reached}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={addTwo} disabled={reached}>+2</button>
        <button onClick={reset}>Reset</button>
      </div>

      <label className="row">
        Target:
        <input type="number" min="1" value={target} onChange={changeTarget} />
      </label>
    </section>
  );
}