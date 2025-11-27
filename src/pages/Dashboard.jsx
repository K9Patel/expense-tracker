import { useEffect, useState } from "react";
import { ExpenseAPI } from "../utils/ExpenseAPI";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from "recharts";
import ExportPDFButton from "../components/ExportPDFButton";  
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const data = await ExpenseAPI.getAll();
    setExpenses(data);
  }

  // Calculate Summary
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCount = expenses.length;

  // Top category calculation
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Pie Chart Data
  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Bar Chart Data (Month-wise)
  const monthlyTotals = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + e.amount;
    return acc;
  }, {});
  const barData = Object.entries(monthlyTotals).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <div>
      <h2>📊 Dashboard</h2>

      {/* Summary Cards */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>💰 Total Spent <br /> ₹{totalSpent}</div>
        <div style={styles.card}>🧾 Expense Entries <br /> {totalCount}</div>
        <div style={styles.card}>🏆 Top Category <br /> {topCategory}</div>
      </div>

      {/* Pie Chart */}
      <h3>📂 Category-wise Expense</h3>
      <PieChart width={600} height={350}>
        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120}>
          {pieData.map((entry, index) => (
            <Cell key={index} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <ExportPDFButton />
      {/* Bar Chart */}
      <h3>📆 Monthly Expense Trend</h3>
      <BarChart width={600} height={350} data={barData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="amount" />
        <Tooltip />
      </BarChart>
    </div>
  );
}

/* Basic styles for cards */
const styles = {
  cardContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },
  card: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontSize: "18px",
    textAlign: "center",
  },
};
