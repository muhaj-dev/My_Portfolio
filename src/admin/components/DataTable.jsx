import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="admin-table">
        <div className="admin-table__loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-table">
      {data.length === 0 ? (
        <div className="admin-table__empty">No items yet. Add your first one!</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="admin-btn admin-btn--ghost"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn--danger"
                      onClick={() => {
                        if (window.confirm('Delete this item?')) onDelete(item);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
