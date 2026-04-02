import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const tables = [
  { name: 'abouts', label: 'About Items' },
  { name: 'works', label: 'Works' },
  { name: 'skills', label: 'Skills' },
  { name: 'experiences', label: 'Experiences' },
  { name: 'testimonials', label: 'Testimonials' },
  { name: 'brands', label: 'Brands' },
  { name: 'contacts', label: 'Contact Messages' },
];

const DashboardPage = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    tables.forEach(async ({ name }) => {
      const { count } = await supabase
        .from(name)
        .select('*', { count: 'exact', head: true });
      setCounts((prev) => ({ ...prev, [name]: count ?? 0 }));
    });
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="admin-dashboard__grid">
        {tables.map(({ name, label }) => (
          <div key={name} className="admin-dashboard__card">
            <h3>{label}</h3>
            <div className="count">{counts[name] ?? '...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
