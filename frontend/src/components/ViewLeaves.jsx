import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { useGetLeavesFromDate } from "../hooks/useGetLeavesFromDate";

export default function ViewLeaves({ open, handleClose, data, date }) {
  const { getLeavesFromDate, error } = useGetLeavesFromDate();
  const people = data ? data : "";
  const leaveDate = date ? date : "";
  const [leavesInfo, setLeavesInfo] = useState([]);

  const onLoad = async () => {
    const data = await getLeavesFromDate(leaveDate);
    setLeavesInfo(data);
  };

  useEffect(() => {
    onLoad();
  }, []);

  // Replace newline characters with <br> tags for proper HTML rendering
  const formattedPeople = people.replace(/\n/g, "<br/>");

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click or escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose();
      }}
      maxWidth="sm"
      aria-labelledby="view-leave-dialog-title"
    >
      <DialogTitle>On Leave/Off ({leaveDate})</DialogTitle>
      <DialogContent>
        {leavesInfo.map((leave, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: "4px", // Optional: Rounded corners
              mb: 1, // Margin between boxes
              padding: "2px", // Minimal padding
              marginBottom: "10px",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Optional: Subtle shadow
            }}
          >
            <Typography variant="body1">
              <strong>
                {leave.user_name} ({leave.role})
              </strong>
            </Typography>
            <Typography variant="body1">
              {leave.leave_type}: {leave.duration} | {leave.status}
            </Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
