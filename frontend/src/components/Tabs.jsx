import { useState } from 'react';

export default function Tabs({ tabs, children }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="tabs-header">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={active === i ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tabs-content">{children[active]}</div>
    </div>
  );
}