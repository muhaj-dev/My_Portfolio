import React, { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../../lib/supabase';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ImageUpload from '../components/ImageUpload';

const columns = [
  {
    key: 'icon_path',
    label: 'Icon',
    render: (val) => val ? <img src={getImageUrl(val)} alt="" className="admin-table__img" /> : '—',
  },
  { key: 'name', label: 'Name' },
  {
    key: 'bg_color',
    label: 'Color',
    render: (val) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: 20, height: 20, borderRadius: 4, background: val, display: 'inline-block', border: '1px solid #ddd' }} />
        {val}
      </span>
    ),
  },
  { key: 'sort_order', label: 'Order' },
];

const AdminSkills = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', bg_color: '#edf2f8', icon_path: '', sort_order: 0 });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', bg_color: '#edf2f8', icon_path: '', sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, bg_color: item.bg_color, icon_path: item.icon_path, sort_order: item.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('skills').update(form).eq('id', editing.id);
    } else {
      await supabase.from('skills').insert([form]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (item) => {
    if (item.icon_path) {
      await supabase.storage.from('portfolio-images').remove([item.icon_path]);
    }
    await supabase.from('skills').delete().eq('id', item.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Skills</h1>
        <button className="admin-btn admin-btn--primary" onClick={openNew}>Add Skill</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'} onSubmit={handleSave} saving={saving}>
        <div className="admin-field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Background Color</label>
          <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Icon</label>
          <ImageUpload folder="skills" currentPath={form.icon_path} onUpload={(path) => setForm({ ...form, icon_path: path })} />
        </div>
        <div className="admin-field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminSkills;
