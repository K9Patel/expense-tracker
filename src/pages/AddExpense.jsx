import { useState } from "react";
import { ExpenseAPI } from "../utils/ExpenseAPI";
import { toast } from "react-toastify";


export default function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(), // Unique ID
      ...form,
      amount: Number(form.amount),
    };

    await ExpenseAPI.save(newExpense);
toast.success("Expense saved successfully!");

if (window.electronAPI?.notify) {
  window.electronAPI.notify();  // Desktop notification
}


    // Reset form
    setForm({ amount: "", category: "", date: "", note: "" });
  };

  return (
    <div>
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
         <option value="Food & Dining">Food & Dining</option>
          <option value="Travel & Transport">Travel & Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Groceries">Groceries</option>
          <option value="Rent / Housing">Rent / Housing</option>
          <option value="Bills & Utilities">Bills & Utilities</option>
          <option value="Health & Medical">Health & Medical</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Savings / Investment">Savings / Investment</option>
          <option value="Salary / Income">Salary / Income</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
        />

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}
