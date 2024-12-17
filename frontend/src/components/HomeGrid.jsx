import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "./CustomizedDataGrid";

export default function MainGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <CustomizedDataGrid />
    </Box>
  );
}
