import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

// Map für benutzerfreundliche Namen
const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Home",
  "/catalog": "Shop",
  "/orders": "Bestellungen",
  "/product": "Artikel", // Allgemeiner Name für die Produktseite
  // Weitere Pfade und deren benutzerfreundliche Namen hinzufügen
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = [
    <Link
      component={RouterLink}
      to="/"
      key="home"
      underline="hover"
      color="inherit"
    >
      Home
    </Link>,
  ];

  pathSnippets.forEach((_, index) => {
    const isLast = index === pathSnippets.length - 1;
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    // Überprüfen, ob es ein dynamischer Pfad wie /product/:id ist
    let breadcrumbName = breadcrumbNameMap[`/${pathSnippets[index]}`];

    // Dynamische Routen behandeln, z.B. /product/:id
    if (!breadcrumbName && url.includes("/product/")) {
      breadcrumbName = "Artikel Details"; // Anzeigename für Produkte, nicht die ID anzeigen
    }

    breadcrumbItems.push(
      isLast ? (
        <Typography color="textPrimary" key={url}>
          {breadcrumbName || url} {/* Anzeigename oder URL anzeigen */}
        </Typography>
      ) : (
        <Link
          component={RouterLink}
          to={url}
          key={url}
          underline="hover"
          color="inherit"
        >
          {breadcrumbName || url} {/* Anzeigename oder URL anzeigen */}
        </Link>
      ),
    );
  });

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
    >
      {breadcrumbItems}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
