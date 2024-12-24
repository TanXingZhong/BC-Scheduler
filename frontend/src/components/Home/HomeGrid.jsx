import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ApprovalSection from "./ApprovalSection";
import Schedule from "./Schedule";

export default function HomeGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Hi XXXXX,
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography
            component="h2"
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "600" }}
            marginLeft={"8px"}
          >
            Upcoming Shifts
          </Typography>
          <Schedule />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ApprovalSection />
        </Grid>
      </Grid>
    </Box>
  );
}
