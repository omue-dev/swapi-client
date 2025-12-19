import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import Breadcrumbs from "./components/Breadcrumbs";
import "./styles/App.scss";
import { lightTheme, darkTheme } from "./theme";
import Topbar from "./components/Topbar";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const theme = createTheme(isDarkMode ? darkTheme : lightTheme);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Box className={`app-shell ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <Navbar
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isCollapsed={isSidebarCollapsed}
          />
          <Box className="main-area">
            <Topbar
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              toggleSidebar={toggleSidebar}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <Box className="content-area">
              <Breadcrumbs />
              <Box className="content-div">
                <AppRoutes />
              </Box>
              <Box component="footer" className="footer">
                swapi ©{new Date().getFullYear()} Created by cocapi
              </Box>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
