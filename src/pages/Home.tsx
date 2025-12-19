import React from "react";
import { Typography } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import useFetchInitialProducts from "../hooks/useFetchInitialProducts";

const Home: React.FC = () => {
  const { totalProducts, loading, error } = useFetchInitialProducts();
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Control Center</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="stat-grid w-50">
        <div className={`panel stat-card accent`}>
          <div className="stat-top">
            <Typography variant="body2" className="muted">
              Zu bearbeiten:
            </Typography>
            <MoreHorizRoundedIcon className="muted" />
          </div>
          <Typography variant="h4" fontWeight={800}>
            {error
              ? "Fehler"
              : loading
                ? "…"
                : `${totalProducts ?? 0} Produkte`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Home;
