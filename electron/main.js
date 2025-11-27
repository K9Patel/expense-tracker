// electron/main.js
import { app, BrowserWindow, ipcMain,Notification } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(app.getPath("userData"), "expenses.json");
console.log("Data Path:", dataPath);


// Ensure file exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}

// Fetch all expenses
ipcMain.handle("get-expenses", () => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  return data;
});


// Save new expense
ipcMain.on("save-expense", (event, expense) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  data.push(expense);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  event.reply("save-success", "Expense added successfully!");
});

//Delete expense 
ipcMain.on("delete-expense", (event, id) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const updatedData = data.filter((item) => item.id !== id);
  fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
  event.reply("delete-success", "Expense deleted successfully!");
});

// Update expense
ipcMain.on("update-expense", (event, updatedExpense) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const newData = data.map((e) => (e.id === updatedExpense.id ? updatedExpense : e));
  fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
  event.reply("update-success", "Expense updated successfully!");
});

//Notification example (not used currently)
ipcMain.on("notify", () => {
  if (Notification.isSupported()) {
    new Notification({
      title: "Expense Tracker",
      body: "Action completed successfully!",
    }).show();
  } else {
    console.log("Notifications are not supported on this OS");
  }
});

// pdf generation code would go here (not included for brevity)
ipcMain.handle("generate-pdf", async () => {
  const expenses = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  // Title
  page.drawText("Expense Report", { x: 50, y, size: 20, font });
  y -= 30;

  // Date
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 50, y, size: 12 });
  y -= 20;

  // Header
  y -= 10;
  page.drawText("Date | Category | Amount | Note", { x: 50, y, size: 12 });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1 });
  y -= 10;

  // Expenses List
  expenses.forEach((exp) => {
    if (y < 60) {
      y = height - 50;
      page = pdfDoc.addPage();
    }

    page.drawText(
      `${exp.date} | ${exp.category} | Rs.${exp.amount} | ${exp.note || "-"}`,
      { x: 50, y, size: 10 }
    );
    y -= 15;
  });

  // Total amount
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  y -= 30;
  page.drawText(`Total Expense: Rs.${totalAmount}`, { x: 50, y, size: 14, font });

  const pdfBytes = await pdfDoc.save();

  // Save to Desktop
 const desktopPath = path.join(os.homedir(), "Desktop");

// Ensure Desktop directory exists
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
}

const filePath = path.join(desktopPath, "Expense_Report.pdf");
fs.writeFileSync(filePath, pdfBytes);

return filePath;
});


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    backgroundColor: "#f5f5f7",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173"); // Vite React app
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle simple ping test (we'll test React-to-Electron connection)
ipcMain.handle("ping", () => {
  return "pong from Electron 🟢";
});

console.log("Electron Main Process Loaded");
