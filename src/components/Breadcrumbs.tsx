import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(i => i);

  const breadcrumbNameMap: { [key: string]: string } = {
    "/": "Home",
    "/product": "Product Detail"
  };

  const breadcrumbItems = [
    <Link
      component={RouterLink}
      to="/"
      key="home"
      underline="hover"
      color="inherit"
    >
      Home
    </Link>
  ];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    breadcrumbItems.push(
      index === pathSnippets.length - 1 ? (
        <Typography color="textPrimary" key={url}>
          {breadcrumbNameMap[url]}
        </Typography>
      ) : (
        <Link
          component={RouterLink}
          to={url}
          key={url}
          underline="hover"
          color="inherit"
        >
          {breadcrumbNameMap[url]}
        </Link>
      )
    );
  });

  return (
    <Box p={2}>
      <MUIBreadcrumbs aria-label="breadcrumb">
        {breadcrumbItems}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
