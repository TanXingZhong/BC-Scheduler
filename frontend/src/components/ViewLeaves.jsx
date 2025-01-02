import * as React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export default function ViewLeaves({ open, handleClose, data, date }) {
  const people = data ? data : "";
  const leaveDate = date ? date : "";

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
        <Typography
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{ __html: formattedPeople }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
