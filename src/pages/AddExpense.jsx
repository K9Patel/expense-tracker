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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    };

    await ExpenseAPI.save(newExpense);
    toast.success("Expense saved successfully!");

    if (window.electronAPI?.notify) {
      window.electronAPI.notify();
    }
    setForm({ amount: "", category: "", date: "", note: "" });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Add New Expense</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Amount (₹)</label>
          <input 
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <select 
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={styles.input}
          >
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
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Date</label>
          <input 
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Note (Optional)</label>
          <input 
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Write a brief note"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>💾 Save Expense</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",   // Not box, just centered
    margin: "0 auto",
    padding: "20px",
    textAlign: "left",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "22px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px", // Spacing between fields
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#0077ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
};
