import React, { useContext } from 'react';
import ExpenseContext from '../context/ExpenseContext';

const FilterExpenses = () => {
  const { currentMonth, changeMonth } = useContext(ExpenseContext);

  const handleMonthChange = (e) => {
    changeMonth(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Month
      </label>
      <input
        type="month"
        id="month"
        value={currentMonth}
        onChange={handleMonthChange}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FilterExpenses;