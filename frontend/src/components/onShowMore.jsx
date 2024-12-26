import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

export default function onShowMore({ open, handleClose, selectedDateEvents }) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click or escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose;
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <h2>
          Shifts on{" "}
          {selectedDateEvents.length > 0 &&
            moment(selectedDateEvents[0]?.start).format("MMMM Do YYYY")}
        </h2>
        <ul>
          {selectedDateEvents.map((event, index) => (
            <li key={index}>
              <Typography>{event.title}</Typography>
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
