import React from "react";
import { Avatar, Box, IconButton } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";

interface TopbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Topbar: React.FC<TopbarProps> = ({
  isDarkMode,
  toggleDarkMode,
  toggleSidebar,
  isSidebarCollapsed,
}) => {
  return (
    <Box className="topbar">
      <IconButton
        className="ghost-button"
        aria-label="Sidebar umschalten"
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
      </IconButton>
      <Box className="topbar-actions">
        <IconButton
          onClick={toggleDarkMode}
          className="ghost-button"
          aria-label="Theme wechseln"
        >
          {isDarkMode ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
        <Box className="user-chip">
          <Avatar
            alt="Totok Michael"
            src="https://ui-avatars.com/api/?name=O+M&background=0b6b44&color=fff"
            sx={{ width: 44, height: 44 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
