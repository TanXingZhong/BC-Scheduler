import React from "react";
import { Box, Typography } from "@mui/material";

const EmployeeInfoNoEdit = ({ scheduleInfo }) => {
  return (
    <Box>
      <Typography variant="h6">Coworkers:</Typography>
      {scheduleInfo.array.map((x, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{x.employee + " (" + (x.role || "") + ")"}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default EmployeeInfoNoEdit;
