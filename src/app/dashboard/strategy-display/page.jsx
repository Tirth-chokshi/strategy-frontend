
"use client"
import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const StrategiesPage = () => {
  const [strategies, setStrategies] = useState([
    { id: 1, name: 'Strategy 1', status: 'Active' },
    { id: 2, name: 'Strategy 2', status: 'Inactive' },
  ]);

  const [newStrategy, setNewStrategy] = useState({ name: '', status: '' });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setStrategies(strategies.map(strategy => 
        strategy.id === editingId ? { ...strategy, ...newStrategy } : strategy
      ));
      setEditingId(null);
    } else {
      setStrategies([...strategies, { ...newStrategy, id: Date.now() }]);
    }
    setNewStrategy({ name: '', status: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (strategy) => {
    setNewStrategy({ name: strategy.name, status: strategy.status });
    setEditingId(strategy.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Strategies</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
            Add Strategy
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Strategy Name</label>
                <input
                  type="text"
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newStrategy.status}
                  onChange={(e) => setNewStrategy({ ...newStrategy, status: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingId !== null ? 'Update' : 'Add'} Strategy
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setNewStrategy({ name: '', status: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Strategy Name</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy.id} className="hover:bg-gray-50">
                  <td className="border p-3">{strategy.name}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      strategy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {strategy.status}
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(strategy)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(strategy.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;