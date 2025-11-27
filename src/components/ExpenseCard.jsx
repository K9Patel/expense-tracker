export default function ExpenseCard({ expense, onDelete, onEdit }) {
  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <span style={styles.date}>{expense.date}</span>
        <span style={styles.category}>{expense.category}</span>
      </div>

      <p style={styles.note}>{expense.note || "No note"}</p>

      <div style={styles.row}>
        <span style={styles.amount}>₹{expense.amount}</span>

        <div>
          <button style={styles.editBtn} onClick={() => onEdit(expense)}>Edit</button>
          <button style={styles.deleteBtn} onClick={() => onDelete(expense.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
    marginBottom: "15px",
    transition: "all 0.2s ease",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  date: { fontSize: "14px", color: "#666" },
  category: { fontSize: "14px", fontWeight: "bold" },
  note: { marginTop: 5, marginBottom: 10, color: "#444" },
  amount: { fontSize: "18px", fontWeight: "bold", color: "#0077ff" },
  editBtn: {
    background: "rgba(0,120,255,0.1)",
    color: "#0077ff",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "rgba(255,0,0,0.1)",
    color: "#ff3333",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
