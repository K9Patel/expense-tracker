import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseList from "./pages/ExpenseList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddExpense />} />
          <Route path="expenses" element={<ExpenseList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
