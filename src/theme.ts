import { createTheme } from "@mui/material/styles";

const primaryGreen = "#0fa968";
const primaryDeep = "#0b6b44";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryGreen,
    },
    secondary: {
      main: "#0f172a",
    },
    background: {
      default: "#f3f6fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#6b7280",
    },
    success: {
      main: primaryGreen,
    },
    info: {
      main: "#2563eb",
    },
    warning: {
      main: "#f59e0b",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Sora", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          boxShadow: "0 15px 45px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          backgroundColor: "var(--data-surface)",
          color: "var(--data-text)",
        },
        columnHeaders: {
          backgroundColor: "var(--data-surface-alt)",
          color: "var(--data-text)",
          borderBottom: "1px solid #e5e7eb",
        },
        cell: {
          borderBottom: "1px solid #e5e7eb",
        },
        footerContainer: {
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "var(--data-surface-alt)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0c111d",
      paper: "#111827",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },
    primary: {
      main: "#2dd29f",
    },
    secondary: {
      main: primaryDeep,
    },
    error: {
      main: "#f87171",
    },
    divider: "#1f2937",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#0f172a",
          color: "#e5e7eb",
        },
        input: {
          color: "#e5e7eb",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#1f2937",
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryGreen,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryGreen,
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          color: "#e5e7eb",
          borderColor: "#1f2937",
          backgroundColor: "#0a0f1c",
        },
        columnHeaders: {
          backgroundColor: "#111827",
          color: "#e5e7eb",
          borderBottom: "1px solid #1f2937",
        },
        cell: {
          borderColor: "#1f2937",
        },
        footerContainer: {
          borderTop: "1px solid #1f2937",
          backgroundColor: "#111827",
          color: "#e5e7eb",
        },
        virtualScrollerContent: {
          backgroundColor: "#0b1220",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
