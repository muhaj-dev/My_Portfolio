import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import FormModal from '../components/FormModal';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ year: '', sort_order: 0 });
  const [workItems, setWorkItems] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('experiences')
      .select('*, works:experience_works(*)')
      .order('sort_order');
    setExperiences(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ year: '', sort_order: 0 });
    setWorkItems([{ name: '', company: '', desc: '', sort_order: 0 }]);
    setModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditing(exp);
    setForm({ year: exp.year, sort_order: exp.sort_order });
    setWorkItems(
      (exp.works || []).map((w) => ({
        id: w.id,
        name: w.name,
        company: w.company,
        desc: w.desc || '',
        sort_order: w.sort_order,
      }))
    );
    setModalOpen(true);
  };

  const addWorkItem = () => {
    setWorkItems([...workItems, { name: '', company: '', desc: '', sort_order: workItems.length }]);
  };

  const removeWorkItem = (index) => {
    setWorkItems(workItems.filter((_, i) => i !== index));
  };

  const updateWorkItem = (index, field, value) => {
    const updated = [...workItems];
    updated[index] = { ...updated[index], [field]: value };
    setWorkItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);

    let experienceId;

    if (editing) {
      await supabase.from('experiences').update(form).eq('id', editing.id);
      experienceId = editing.id;
      // Delete existing work items and re-insert
      await supabase.from('experience_works').delete().eq('experience_id', editing.id);
    } else {
      const { data } = await supabase.from('experiences').insert([form]).select();
      experienceId = data[0].id;
    }

    // Insert work items
    if (workItems.length > 0) {
      const items = workItems
        .filter((w) => w.name.trim())
        .map((w, i) => ({
          experience_id: experienceId,
          name: w.name,
          company: w.company,
          desc: w.desc,
          sort_order: i,
        }));
      if (items.length > 0) {
        await supabase.from('experience_works').insert(items);
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (exp) => {
    if (!window.confirm(`Delete "${exp.year}" and all its work items?`)) return;
    // experience_works cascade deletes
    await supabase.from('experiences').delete().eq('id', exp.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Experiences</h1>
        <button className="admin-btn admin-btn--primary" onClick={openNew}>Add Experience</button>
      </div>

      {loading ? (
        <div className="admin-table"><div className="admin-table__loading">Loading...</div></div>
      ) : experiences.length === 0 ? (
        <div className="admin-table"><div className="admin-table__empty">No experiences yet.</div></div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Work Items</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id}>
                  <td><strong>{exp.year}</strong></td>
                  <td>
                    {(exp.works || []).map((w) => (
                      <div key={w.id} style={{ marginBottom: '0.25rem' }}>
                        {w.name} — <em>{w.company}</em>
                      </div>
                    ))}
                    {(!exp.works || exp.works.length === 0) && <span style={{ color: '#999' }}>No items</span>}
                  </td>
                  <td>{exp.sort_order}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(exp)}>Edit</button>
                      <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(exp)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'} onSubmit={handleSave} saving={saving}>
        <div className="admin-field">
          <label>Year</label>
          <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2023-2024" required />
        </div>
        <div className="admin-field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>

        <div className="admin-field">
          <label>Work Items</label>
          <div className="admin-nested-list">
            {workItems.map((item, index) => (
              <div key={index} className="admin-nested-list__item">
                <div className="admin-field">
                  <label>Job Title</label>
                  <input value={item.name} onChange={(e) => updateWorkItem(index, 'name', e.target.value)} required />
                </div>
                <div className="admin-field">
                  <label>Company</label>
                  <input value={item.company} onChange={(e) => updateWorkItem(index, 'company', e.target.value)} required />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <input value={item.desc} onChange={(e) => updateWorkItem(index, 'desc', e.target.value)} />
                </div>
                <button type="button" className="admin-nested-list__remove" onClick={() => removeWorkItem(index)}>
                  &times;
                </button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--ghost admin-nested-list__add" onClick={addWorkItem}>
              + Add Work Item
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminExperiences;
