import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  Grid2,
} from "@mui/material";

function ResetPasswordForm({ userId, open, handleClose, handleResetPassword }) {
  const [formData, setFormData] = useState({
    id: userId,
    newPassword: "",
    confirmPassword: "",
  });

  const [errorState, setErrorState] = useState({
    newPassword: { error: false, message: "" },
    confirmPassword: { error: false, message: "" },
  });

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    let isValid = true;

    // Validate New Password
    if (!formData.newPassword) {
      setError("newPassword", true, "New password is required.");
      isValid = false;
    } else {
      setError("newPassword", false, "");
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      setError("confirmPassword", true, "Please confirm the new password.");
      isValid = false;
    }

    if (formData.confirmPassword.length < 6) {
      setError(
        "confirmPassword",
        true,
        "Confirmed password must be at least 6 characters long."
      );
      isValid = false;
    } else {
      if (formData.newPassword !== formData.confirmPassword) {
        setError(
          "confirmPassword",
          true,
          "New password and confirm password must match."
        );
        isValid = false;
      } else {
        setError("confirmPassword", false, "");
      }
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      console.log("formData", formData);
      handleResetPassword(formData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose();
      }}
      aria-labelledby="reset-password-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="reset-password-dialog-title">Reset Password</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <FormControl fullWidth>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <TextField
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                error={errorState.newPassword.error}
                helperText={errorState.newPassword.message}
              />
            </FormControl>
          </Grid2>
          <Grid2 xs={12}>
            <FormControl fullWidth>
              <FormLabel htmlFor="confirmPassword">
                Confirm New Password
              </FormLabel>
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errorState.confirmPassword.error}
                helperText={errorState.confirmPassword.message}
              />
            </FormControl>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ResetPasswordForm.propTypes = {
  userId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleResetPassword: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
