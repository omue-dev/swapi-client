import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";

const Home: React.FC = () => {
  const statCards = [
    {
      title: "Produkte gesamt",
      value: "24",
      helper: "↑ 12 vs. Vormonat",
      accent: true,
    },
    {
      title: "Archiviert",
      value: "10",
      helper: "↑ 3 vs. Vormonat",
    },
    {
      title: "Aktiv in Bearbeitung",
      value: "12",
      helper: "↑ 5 vs. Vormonat",
    },
    {
      title: "Pending",
      value: "2",
      helper: "In Abstimmung",
    },
  ];

  const activity = [
    { day: "S", value: 42 },
    { day: "M", value: 68 },
    { day: "T", value: 82 },
    { day: "W", value: 74 },
    { day: "T", value: 52 },
    { day: "F", value: 63 },
    { day: "S", value: 38 },
  ];

  const tasks = [
    { title: "API Endpunkte entwickeln", due: "Nov 26, 2024", state: "active" },
    {
      title: "Onboarding Flow",
      due: "Nov 29, 2024",
      state: "warning",
    },
    { title: "Dashboard aufbauen", due: "Nov 30, 2024", state: "success" },
    { title: "Page Load optimieren", due: "Dec 5, 2024", state: "active" },
    { title: "Cross-Browser Tests", due: "Dec 6, 2024", state: "info" },
  ];

  const team = [
    { name: "Alexandra Defi", role: "Github Repo", status: "Completed" },
    { name: "Eden Adenike", role: "Auth System", status: "In Progress" },
    { name: "Isaac Oluwatesin", role: "Filter & Daten", status: "Completed" },
    { name: "David Oshodi", role: "Responsive Layout", status: "Pending" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Control Center</p>
          <h1>Dashboard</h1>
          <p className="muted">
            Plane, priorisiere und erledige deine Aufgaben mit Klarheit und
            Tempo.
          </p>
        </div>
        <div className="header-actions">
          <button className="pill primary">
            <AddRoundedIcon fontSize="small" />
            Projekt anlegen
          </button>
          <button className="pill ghost">
            <CloudUploadRoundedIcon fontSize="small" />
            Daten importieren
          </button>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`panel stat-card ${card.accent ? "accent" : ""}`}
          >
            <div className="stat-top">
              <Typography variant="body2" className="muted">
                {card.title}
              </Typography>
              <MoreHorizRoundedIcon className="muted" />
            </div>
            <Typography variant="h4" fontWeight={800}>
              {card.value}
            </Typography>
            <Chip
              label={card.helper}
              size="small"
              color={card.accent ? "success" : "default"}
              className="soft-chip"
            />
          </div>
        ))}
      </div>

      <div className="grid-3">
        <div className="panel analytics-card">
          <div className="panel-head">
            <Typography variant="subtitle1" fontWeight={700}>
              Projekt Analytics
            </Typography>
            <Chip label="Live" color="success" size="small" />
          </div>
          <div className="activity-bars">
            {activity.map((item, index) => (
              <div className="bar" key={`${item.day}-${index}`}>
                <div
                  className="bar-fill"
                  style={{ height: `${item.value}%` }}
                />
                <span className="muted">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel reminder-card">
          <div>
            <p className="eyebrow">Reminder</p>
            <Typography variant="h6" fontWeight={800}>
              Meeting mit Arc Company
            </Typography>
            <p className="muted">Heute · 14:00 - 15:00</p>
          </div>
          <button className="pill primary wide">
            <PlayArrowRoundedIcon fontSize="small" />
            Meeting starten
          </button>
        </div>

        <div className="panel task-card">
          <div className="panel-head">
            <Typography variant="subtitle1" fontWeight={700}>
              Projektliste
            </Typography>
            <Chip label="+ Neu" size="small" color="success" />
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.title} className="task-item">
                <div>
                  <Typography fontWeight={700}>{task.title}</Typography>
                  <span className="muted">Due: {task.due}</span>
                </div>
                <Chip
                  label={task.state}
                  size="small"
                  className={`status-${task.state}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="panel team-card">
          <div className="panel-head">
            <Typography variant="subtitle1" fontWeight={700}>
              Team Collaboration
            </Typography>
            <button className="pill ghost">
              <AddRoundedIcon fontSize="small" />
              Mitglied hinzufügen
            </button>
          </div>
          <div className="team-list">
            {team.map((member) => (
              <div key={member.name} className="team-row">
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0c8b55&color=fff`}
                  alt={member.name}
                />
                <div>
                  <Typography fontWeight={700}>{member.name}</Typography>
                  <span className="muted">{member.role}</span>
                </div>
                <Chip label={member.status} size="small" className="soft-chip" />
              </div>
            ))}
          </div>
        </div>

        <div className="panel progress-card">
          <div className="panel-head">
            <Typography variant="subtitle1" fontWeight={700}>
              Projektfortschritt
            </Typography>
            <MoreHorizRoundedIcon className="muted" />
          </div>
          <div className="progress-visual">
            <div className="donut">
              <div className="donut-inner">
                <Typography variant="h4" fontWeight={800}>
                  41%
                </Typography>
                <span className="muted">abgeschlossen</span>
              </div>
            </div>
            <div className="legend">
              <span className="dot green" />
              <span>Completed</span>
              <span className="dot dark" />
              <span>In Progress</span>
              <span className="dot muted-dot" />
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="panel time-card">
          <div className="panel-head">
            <Typography variant="subtitle1" fontWeight={700}>
              Time Tracker
            </Typography>
            <MoreHorizRoundedIcon className="muted" />
          </div>
          <div className="time-display">
            <div className="time-pill">
              <AccessTimeRoundedIcon />
              01:24:08
            </div>
            <div className="time-actions">
              <button className="pill primary">
                <PlayArrowRoundedIcon fontSize="small" />
                Start
              </button>
              <button className="pill danger">
                <PauseRoundedIcon fontSize="small" />
                Stop
              </button>
            </div>
          </div>
          <Divider sx={{ my: 2 }} />
          <div className="time-meta">
            <div>
              <span className="muted">Aktuelles Ticket</span>
              <Typography fontWeight={700}>Projekt Copywriting</Typography>
            </div>
            <div>
              <span className="muted">Status</span>
              <Chip
                size="small"
                label="Läuft"
                icon={<FiberManualRecordRoundedIcon fontSize="small" />}
                className="soft-chip"
              />
            </div>
          </div>
          <LinearProgress
            variant="determinate"
            value={68}
            sx={{ mt: 2, height: 8, borderRadius: 999 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
