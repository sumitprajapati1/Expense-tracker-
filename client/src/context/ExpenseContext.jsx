import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// import BASE_URL from "../api";
const BASE_URL = "http://localhost:5000/api"

const ExpenseContext = createContext();
import AuthContext from './AuthContext';

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [summary, setSummary] = useState([]);

  // Auth state to gate fetching
  const { user, loading: authLoading } = useContext(AuthContext);

  // Fetch expenses
  const fetchExpenses = async (month = currentMonth) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/expenses?month=${month}`, {
        headers: { 'x-auth-token': token },
      });
      setExpenses(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Error fetching expenses");
      setLoading(false);
    }
  };

  // Add expense
  const addExpense = async (expense) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/expenses`, expense, {
        headers: { 'x-auth-token': token },
      });
      setExpenses([...expenses, res.data]);
      // refresh summary after add
      fetchSummary();
    } catch (err) {
      setError(err.response?.data?.msg || "Error adding expense");
    }
  };

  // Update expense
  const updateExpense = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${BASE_URL}/expenses/${id}`, updates, {
        headers: { 'x-auth-token': token },
      });
      setExpenses(expenses.map((exp) => (exp._id === id ? res.data : exp)));
      // refresh summary after update
      fetchSummary();
    } catch (err) {
      setError(err.response?.data?.msg || "Error updating expense");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/expenses/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setExpenses(expenses.filter((exp) => exp._id !== id));
      // refresh summary after delete
      fetchSummary();
    } catch (err) {
      setError(err.response?.data?.msg || "Error deleting expense");
    }
  };

  // Fetch summary
  const fetchSummary = async (month = currentMonth) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/expenses/summary?month=${month}`, {
        headers: { 'x-auth-token': token },
      });
      setSummary(res.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Error fetching summary");
    }
  };

  // Export
  const exportExpenses = async (month = currentMonth) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/expenses/export?month=${month}`, {
        headers: { 'x-auth-token': token },
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `expenses-${month}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.msg || "Error exporting expenses");
    }
  };

  useEffect(() => {
    // Wait until auth finishes; fetch if logged in, otherwise stop loading
    if (!authLoading) {
      if (user) {
        fetchExpenses();
        fetchSummary();
      } else {
        setExpenses([]);
        setSummary([]);
        setLoading(false);
      }
    }
    // eslint-disable-next-line
  }, [currentMonth, authLoading, user]);

  const changeMonth = (month) => setCurrentMonth(month);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        currentMonth,
        setCurrentMonth,
        changeMonth,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchSummary,
        summary,
        exportExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
