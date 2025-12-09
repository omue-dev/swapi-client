import React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
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
  const theme = useTheme();

  return (
    <Box className="topbar">
      <IconButton
        className="ghost-button"
        aria-label="Sidebar umschalten"
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
      </IconButton>
      <Box className="topbar-search">
        <SearchRoundedIcon fontSize="small" />
        <input
          type="text"
          placeholder="Suche Produkt ..."
          aria-label="Schnellsuche"
        />
        <IconButton size="small" className="ghost-button" aria-label="Filtern">
          <TuneRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box className="topbar-actions">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          className="pill-button"
        >
          Neues Projekt
        </Button>
        <IconButton className="ghost-button" aria-label="Inbox">
          <MailOutlineRoundedIcon />
        </IconButton>
        <IconButton className="ghost-button" aria-label="Notifications">
          <NotificationsNoneRoundedIcon />
        </IconButton>
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
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Omue Team
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              lineHeight={1.2}
            >
              team@swapi.dev
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
