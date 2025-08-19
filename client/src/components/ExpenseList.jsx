import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseContext from '../context/ExpenseContext';
import { format } from 'date-fns';

const ExpenseList = () => {
  const { expenses, loading, error, deleteExpense, currentMonth } = useContext(ExpenseContext);
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-4">Loading expenses...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  // Add check to ensure expenses is an array
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="text-center py-4">
        No expenses found for {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Expenses for {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Amount</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="py-2 px-4">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td className="py-2 px-4">{expense.category}</td>
                <td className="py-2 px-4">{expense.description || '-'}</td>
                <td className="py-2 px-4 text-right font-medium">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => navigate(`/edit/${expense._id}`)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;