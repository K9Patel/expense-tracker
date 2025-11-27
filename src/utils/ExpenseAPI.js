const isElectron = !!window.electronAPI;

export const ExpenseAPI = {
  async getAll() {
    if (isElectron) {
      return await window.electronAPI.getExpenses();
    } else {
      const data = localStorage.getItem("expenses") || "[]";
      return JSON.parse(data);
    }
  },

  async save(expense) {
    if (isElectron) {
      window.electronAPI.saveExpense(expense);
    } else {
      const list = await this.getAll();
      list.push(expense);
      localStorage.setItem("expenses", JSON.stringify(list));
      alert("Expense saved (Browser LocalStorage)");
    }
  },
  async delete(id) {
  if (isElectron) {
    window.electronAPI.deleteExpense(id);
  } else {
    let expenses = await this.getAll();
    expenses = expenses.filter((e) => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
},
async update(updatedExpense) {
  if (isElectron) {
    window.electronAPI.updateExpense(updatedExpense);
  } else {
    let expenses = await this.getAll();
    expenses = expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
},

};
