import React from 'react';
import ExpenseList from '../components/ExpenseList';
import ExpenseSummary from '../components/ExpenseSummary';
import FilterExpenses from '../components/FilterExpenses';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Expenses</h1>
        <Link
          to="/add"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Expense
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FilterExpenses />
          <ExpenseList />
        </div>
        <div className="lg:col-span-1">
          <ExpenseSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;