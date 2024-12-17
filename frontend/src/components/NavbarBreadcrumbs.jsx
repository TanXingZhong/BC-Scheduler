import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation, Link } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const getBreadcrumbs = (pathname) => {
    // Split the path into segments
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize the first letter
        path,
      };
    });
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Home</Typography>
      {/* Map through breadcrumbs and create a clickable link for each */}
      {breadcrumbs.map((breadcrumb, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            color: "text.primary",
            fontWeight: index === breadcrumbs.length - 1 ? 600 : 400, // Bold the last breadcrumb
          }}
        >
          <Link
            to={breadcrumb.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {breadcrumb.label}
          </Link>
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
