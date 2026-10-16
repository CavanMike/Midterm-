import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const CATEGORIES = ['Books', 'Games', 'Home', 'Sports', 'Tech'];

const PRODUCTS = Array.from({ length: 600 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: ((i * 37) % 500) + 5,
}));

const ProductList = memo(function ProductList({ products, selectedId, onSelect }) {
  console.log('ProductList rendered');
  return (
    <ul className="plain" style={{ maxHeight: 320, overflow: 'auto' }}>
      {products.map((p) => (
        <li key={p.id} className={p.id === selectedId ? 'selected' : ''}>
          <button onClick={() => onSelect(p.id)}>{p.id === selectedId ? 'Selected' : 'Select'}</button>
          <span>{p.name}</span>
          <span className="muted">{p.category} · ${p.price}</span>
        </li>
      ))}
    </ul>
  );
});

export default function Exam5() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  // 'asc' | 'desc'  = price low→high / high→low
  // 'name-asc' | 'name-desc' = A→Z / Z→A
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedId, setSelectedId] = useState(null);
  const [counter, setCounter] = useState(0); // unrelated state

  const visible = useMemo(() => {
    console.log('filter + sort ran');
    const q = query.trim().toLowerCase();

    const sorters = {
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      'name-asc': (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }),
      'name-desc': (a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }),
    };

    return PRODUCTS
      .filter((p) => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(q))
      .sort(sorters[sortOrder]);
  }, [query, category, sortOrder]); // complete: every value used inside

  const handleSelect = useCallback((id) => {
    setSelectedId((cur) => (cur === id ? null : id));
  }, []);

  useEffect(() => {
    if (selectedId !== null) console.log('analytics: product selected', selectedId);
  }, [selectedId]);

  return (
    <section>
      <h2>Product Explorer</h2>
      <div className="row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Price: low to high</option>
          <option value="desc">Price: high to low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <div className="row">
        <button
          onClick={() => setSortOrder('name-asc')}
          style={sortOrder === 'name-asc' ? { background: 'var(--accent)', color: '#fff' } : undefined}
        >
          A → Z
        </button>
        <button
          onClick={() => setSortOrder('name-desc')}
          style={sortOrder === 'name-desc' ? { background: 'var(--accent)', color: '#fff' } : undefined}
        >
          Z → A
        </button>
      </div>

      <div className="row">
        <button onClick={() => setCounter((c) => c + 1)}>Unrelated counter: {counter}</button>
        <span className="muted">{visible.length} products · open the console to watch renders</span>
      </div>

      <ProductList products={visible} selectedId={selectedId} onSelect={handleSelect} />
    </section>
  );
}