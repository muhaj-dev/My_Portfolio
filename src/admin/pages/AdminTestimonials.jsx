import React, { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../../lib/supabase';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ImageUpload from '../components/ImageUpload';

const columns = [
  {
    key: 'img_path',
    label: 'Photo',
    render: (val) => val ? <img src={getImageUrl(val)} alt="" className="admin-table__img" /> : '—',
  },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  {
    key: 'feedback',
    label: 'Feedback',
    render: (val) => val?.length > 60 ? val.substring(0, 60) + '...' : val,
  },
  { key: 'sort_order', label: 'Order' },
];

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', feedback: '', img_path: '', sort_order: 0 });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', company: '', feedback: '', img_path: '', sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      company: item.company,
      feedback: item.feedback,
      img_path: item.img_path,
      sort_order: item.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('testimonials').update(form).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert([form]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (item) => {
    if (item.img_path) {
      await supabase.storage.from('portfolio-images').remove([item.img_path]);
    }
    await supabase.from('testimonials').delete().eq('id', item.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Testimonials</h1>
        <button className="admin-btn admin-btn--primary" onClick={openNew}>Add Testimonial</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onSubmit={handleSave} saving={saving}>
        <div className="admin-field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Company</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Feedback</label>
          <textarea value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Photo</label>
          <ImageUpload folder="testimonials" currentPath={form.img_path} onUpload={(path) => setForm({ ...form, img_path: path })} />
        </div>
        <div className="admin-field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminTestimonials;
