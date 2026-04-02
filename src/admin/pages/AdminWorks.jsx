import React, { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../../lib/supabase';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ImageUpload from '../components/ImageUpload';

const columns = [
  {
    key: 'img_path',
    label: 'Image',
    render: (val) => val ? <img src={getImageUrl(val)} alt="" className="admin-table__img" /> : '—',
  },
  { key: 'title', label: 'Title' },
  {
    key: 'tags',
    label: 'Tags',
    render: (val) => (val || []).join(', '),
  },
  { key: 'sort_order', label: 'Order' },
];

const AdminWorks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', project_link: '', code_link: '', img_path: '', tags: '', sort_order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('works').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', project_link: '', code_link: '', img_path: '', tags: '', sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      project_link: item.project_link || '',
      code_link: item.code_link || '',
      img_path: item.img_path,
      tags: (item.tags || []).join(', '),
      sort_order: item.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editing) {
      await supabase.from('works').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('works').insert([payload]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (item) => {
    if (item.img_path) {
      await supabase.storage.from('portfolio-images').remove([item.img_path]);
    }
    await supabase.from('works').delete().eq('id', item.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Works</h1>
        <button className="admin-btn admin-btn--primary" onClick={openNew}>Add Work</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Work' : 'Add Work'} onSubmit={handleSave} saving={saving}>
        <div className="admin-field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Project Link</label>
          <input value={form.project_link} onChange={(e) => setForm({ ...form, project_link: e.target.value })} placeholder="https://..." />
        </div>
        <div className="admin-field">
          <label>Code Link</label>
          <input value={form.code_link} onChange={(e) => setForm({ ...form, code_link: e.target.value })} placeholder="https://github.com/..." />
        </div>
        <div className="admin-field">
          <label>Tags (comma-separated)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, NextJS, Vite" />
        </div>
        <div className="admin-field">
          <label>Image</label>
          <ImageUpload folder="works" currentPath={form.img_path} onUpload={(path) => setForm({ ...form, img_path: path })} />
        </div>
        <div className="admin-field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminWorks;
