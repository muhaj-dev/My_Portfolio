import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (contact) => {
    await supabase
      .from('contacts')
      .update({ is_read: !contact.is_read })
      .eq('id', contact.id);
    fetchData();
  };

  const handleDelete = async (contact) => {
    if (!window.confirm('Delete this message?')) return;
    await supabase.from('contacts').delete().eq('id', contact.id);
    fetchData();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Contact Messages</h1>
      </div>

      {loading ? (
        <div className="admin-table"><div className="admin-table__loading">Loading...</div></div>
      ) : contacts.length === 0 ? (
        <div className="admin-table"><div className="admin-table__empty">No messages yet.</div></div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={`admin-badge admin-badge--${c.is_read ? 'read' : 'unread'}`}>
                      {c.is_read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td>{c.name}</td>
                  <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                  <td>{c.message.length > 80 ? c.message.substring(0, 80) + '...' : c.message}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="admin-btn admin-btn--ghost"
                        onClick={() => toggleRead(c)}
                      >
                        {c.is_read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        className="admin-btn admin-btn--danger"
                        onClick={() => handleDelete(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
