import React, { useState, useContext, useEffect, useMemo } from 'react';
import ExpenseContext from '../context/ExpenseContext';
import { useNavigate, useParams } from 'react-router-dom';

const ExpenseForm = ({ expense, onCancel }) => {
  const { expenses, addExpense, updateExpense, loading } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine the expense to edit (from route param if present)
  const editingExpense = useMemo(() => {
    if (expense) return expense;
    if (id) return expenses.find((e) => e._id === id);
    return null;
  }, [expense, id, expenses]);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    description: ''
  });

  // Populate form when editingExpense is available
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: new Date(editingExpense.date).toISOString().slice(0, 10),
        description: editingExpense.description || ''
      });
    }
  }, [editingExpense]);

  const { amount, category, date, description } = formData;

  const categories = [
    'Food',
    'Transportation',
    'Housing',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Education',
    'Other'
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (id || editingExpense) {
        const targetId = id || editingExpense._id;
        await updateExpense(targetId, formData);
      } else {
        await addExpense(formData);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {id || editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      {id && !editingExpense && loading && (
        <div className="mb-4 text-gray-500">Loading expense...</div>
      )}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {expense ? 'Update' : 'Add'} Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;