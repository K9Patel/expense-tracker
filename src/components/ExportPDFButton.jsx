import { toast } from "react-toastify";

export default function ExportPDFButton() {
  const handleExport = async () => {
    if (window.electronAPI?.generatePDF) {
      const filePath = await window.electronAPI.generatePDF();
      toast.success(`📄 PDF saved to Desktop: ${filePath}`);
    } else {
      toast.error("PDF export works only in Electron desktop app");
    }
  };

  return (
    <button onClick={handleExport} style={styles.button}>
      📄 Export Expense Report (PDF)
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 18px",
    background: "#007bff",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
  },
};
