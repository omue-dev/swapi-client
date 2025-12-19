import React from "react";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const navigation = [
    {
      label: "Dashboard",
      icon: <SpaceDashboardRoundedIcon />,
      to: "/",
    },
    {
      label: "Katalog",
      icon: <StorefrontRoundedIcon />,
      to: "/catalog",
    },
  ];

  const secondary = [
    { label: "Settings", icon: <SettingsRoundedIcon /> },
    { label: "Help", icon: <HelpOutlineRoundedIcon /> },
    { label: "Logout", icon: <LogoutRoundedIcon /> },
  ];

  return (
    <Box
      component="aside"
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
    >
      <Box className="sidebar-brand">
        <Box className="brand-mark">sw</Box>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            swapi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Workflow Studio
          </Typography>
        </Box>
        <Chip label="Beta" size="small" color="success" variant="outlined" />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box className="menu-section">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ letterSpacing: 0.6 }}
        >
          MENU
        </Typography>
        <List>
          {navigation.map((item) => {
            const selected =
              item.to && location.pathname.startsWith(item.to ?? "");

            const content = (
              <>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </>
            );

            return item.to ? (
              <ListItemButton
                key={item.label}
                component={Link}
                to={item.to}
                selected={!!selected}
                className="sidebar-item"
              >
                {content}
              </ListItemButton>
            ) : (
              <ListItemButton
                key={item.label}
                selected={!!selected}
                className="sidebar-item"
              >
                {content}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box className="menu-section">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ letterSpacing: 0.6 }}
        >
          GENERAL
        </Typography>
        <List>
          {secondary.map((item) => (
            <ListItemButton key={item.label} className="sidebar-item">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Navbar;
