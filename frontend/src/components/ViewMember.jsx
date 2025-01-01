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

export default function ViewMember({ open, handleClose, data }) {
  const roleName = data ? data.role_name : "Role";

  // Render members list
  const renderMembersList = () => {
    if (data.user_count > 0) {
      return data.user_names
        .split(",")
        .map((user_name, index) => (
          <Typography key={index}>{user_name}</Typography>
        ));
    } else return <Typography>No members available.</Typography>;
  };

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
      maxWidth="sm"
      aria-labelledby="view-member-dialog-title"
    >
      <DialogTitle>{`Members in ${roleName}`}</DialogTitle>
      <DialogContent>{renderMembersList()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
