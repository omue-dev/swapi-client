import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import Breadcrumbs from "./components/Breadcrumbs";
import "./styles/App.css";
import { lightTheme, darkTheme } from "./theme";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme(isDarkMode ? darkTheme : lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="layout" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box component="header" className="header">
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </Box>
          <Box component="main" className="content" sx={{ flexGrow: 1 }}>
            <Container maxWidth="xl">
              <Breadcrumbs />
              <Box className="content-div">
                <AppRoutes />
              </Box>
            </Container>
          </Box>
          <Box component="footer" className="footer" sx={{ py: 3, textAlign: 'center' }}>
            swapi ©{new Date().getFullYear()} Created by cocapi
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
