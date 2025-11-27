import { useEffect, useState } from "react";
import { ExpenseAPI } from "../utils/ExpenseAPI";
import ExpenseCard from "../components/ExpenseCard";
import { toast } from "react-toastify";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadExpenses();

    window.electronAPI?.onDeleteSuccess?.(() => loadExpenses());
    window.electronAPI?.onUpdateSuccess?.(() => loadExpenses());
  }, []);

  async function loadExpenses() {
    const data = await ExpenseAPI.getAll();
    setExpenses(data);
  }

  function handleDelete(id) {
    ExpenseAPI.delete(id);
    toast.success("Expense deleted!");

  if (window.electronAPI?.notify) {
    window.electronAPI.notify();
  }

  loadExpenses();
  }

  function handleUpdate(updatedExpense) {
    ExpenseAPI.update(updatedExpense);
     toast.success("Expense updated!");
  if (window.electronAPI?.notify) {
    window.electronAPI.notify();
  }
    setEditing(null); // Close editing form
  }

  // Filter + Search + Sort combined
  const filteredExpenses = expenses
    .filter((e) =>
      category === "All" ? true : e.category === category
    )
    .filter((e) =>
      e.note.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "highToLow") return b.amount - a.amount;
      if (sortOrder === "lowToHigh") return a.amount - b.amount;
      return 0;
    });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h2>📄 Expense List</h2>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option>All</option>
          <option>Food & Dining</option>
          <option>Travel & Transport</option>
          <option>Shopping</option>
          <option>Rent / Housing</option>
          <option>Health & Medical</option>
          <option>Education</option>
          <option>Entertainment</option>
          <option>Savings / Investment</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="none">Sort by Amount</option>
          <option value="highToLow">High → Low</option>
          <option value="lowToHigh">Low → High</option>
        </select>
      </div>

      <p><strong>Total Expense: ₹{totalAmount}</strong></p>

      <div>
  {filteredExpenses.length === 0 ? (
    <p>No expenses found.</p>
  ) : (
    filteredExpenses.map((expense) => (
      <ExpenseCard
        key={expense.id}
        expense={expense}
        onDelete={handleDelete}
        onEdit={setEditing}
      />
    ))
  )}
</div>


      {/* Editing Form */}
      {editing && (
  <div style={styles.editBox}>
    <h3>Edit Expense</h3>

    <input
      type="date"
      value={editing.date}
      onChange={(e) =>
        setEditing({ ...editing, date: e.target.value })
      }
      style={styles.input}
    />

    <select
      value={editing.category}
      onChange={(e) =>
        setEditing({ ...editing, category: e.target.value })
      }
      style={styles.input}
    >
      <option value="">Select Category</option>
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
      type="number"
      value={editing.amount}
      onChange={(e) =>
        setEditing({ ...editing, amount: Number(e.target.value) })
      }
      style={styles.input}
    />

    <input
      type="text"
      value={editing.note}
      onChange={(e) =>
        setEditing({ ...editing, note: e.target.value })
      }
      style={styles.input}
    />

    <button style={styles.saveBtn} onClick={() => handleUpdate(editing)}>
      Save
    </button>
    <button style={styles.cancelBtn} onClick={() => setEditing(null)}>
      Cancel
    </button>
  </div>
)}

    </div>
  );
}
const styles = {
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flex: 1,
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    background: "white",
  },
  editBtn: {
    background: "#0077ff",
    color: "white",
    padding: "6px 10px",
    marginRight: "5px",
    borderRadius: "5px",
    border: "none",
  },
  deleteBtn: {
    background: "#ff4747",
    color: "white",
    padding: "6px 10px",
    borderRadius: "5px",
    border: "none",
  },
  editBox: {
    padding: "20px",
    background: "#fff",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    marginTop: "20px",
    borderRadius: "10px",
  },
  saveBtn: {
    background: "#28a745",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    marginRight: "10px",
  },
  cancelBtn: {
    background: "#555",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
  },
};
