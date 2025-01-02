import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function CorfirmationToDeleteRole({
  open,
  handleClose,
  handleContinue,
  role_name,
}) {
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
      aria-labelledby="delete-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault(); // Prevent form submission
          handleContinue(role_name); // Pass name to handleContinue when form is submitted
          handleClose(); // Close the dialog
        },
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle>Confirm delete role</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      ></DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CorfirmationToDeleteRole.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleContinue: PropTypes.func.isRequired, // Add handleContinue prop validation
  role_name: PropTypes.string.isRequired, // Add name prop validation
};

export default CorfirmationToDeleteRole;
