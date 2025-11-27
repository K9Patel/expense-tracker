// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => ipcRenderer.invoke("ping"), // async IPC call

  // Getting data
  getExpenses: () => ipcRenderer.invoke("get-expenses"),

  // Saving data
  saveExpense: (data) => ipcRenderer.send("save-expense", data),

    // Listen for save success response
  onSaveSuccess: (callback) => ipcRenderer.on("save-success", (event, msg) => callback(msg)),

  //delete expense
  deleteExpense: (id) => ipcRenderer.send("delete-expense", id),
onDeleteSuccess: (callback) => ipcRenderer.on("delete-success", (event, msg) => callback(msg)),

//update expense
updateExpense: (data) => ipcRenderer.send("update-expense", data),
onUpdateSuccess: (callback) => ipcRenderer.on("update-success", (event, msg) => callback(msg)),

// Notification example 
notify: () => ipcRenderer.send("notify"),

// PDF Generation (not implemented in UI yet)
generatePDF: (data) => ipcRenderer.invoke("generate-pdf", data),


});
