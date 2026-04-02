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
  { key: 'name', label: 'Name' },
  { key: 'sort_order', label: 'Order' },
];

const AdminBrands = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', img_path: '', sort_order: 0 });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('brands').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', img_path: '', sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, img_path: item.img_path, sort_order: item.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('brands').update(form).eq('id', editing.id);
    } else {
      await supabase.from('brands').insert([form]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (item) => {
    if (item.img_path) {
      await supabase.storage.from('portfolio-images').remove([item.img_path]);
    }
    await supabase.from('brands').delete().eq('id', item.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Brands</h1>
        <button className="admin-btn admin-btn--primary" onClick={openNew}>Add Brand</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Brand' : 'Add Brand'} onSubmit={handleSave} saving={saving}>
        <div className="admin-field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="admin-field">
          <label>Image</label>
          <ImageUpload folder="brands" currentPath={form.img_path} onUpload={(path) => setForm({ ...form, img_path: path })} />
        </div>
        <div className="admin-field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminBrands;
