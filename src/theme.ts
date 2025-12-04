import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1220',
      paper: '#111827',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
    primary: {
      main: '#7dd3fc',
    },
    secondary: {
      main: '#c084fc',
    },
    error: {
      main: '#f87171',
    },
    divider: '#1f2937',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
        },
        input: {
          color: '#e5e7eb',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#1f2937',
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7dd3fc',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7dd3fc',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          color: '#e5e7eb',
          borderColor: '#1f2937',
          backgroundColor: '#0b1220',
        },
        columnHeaders: {
          backgroundColor: '#111827',
          color: '#e5e7eb',
          borderBottom: '1px solid #1f2937',
        },
        cell: {
          borderColor: '#1f2937',
        },
        footerContainer: {
          borderTop: '1px solid #1f2937',
          backgroundColor: '#111827',
          color: '#e5e7eb',
        },
        virtualScrollerContent: {
          backgroundColor: '#0b1220',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
