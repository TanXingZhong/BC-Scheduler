import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
function ChangeUser({
  open,
  handleClose,
  handleChange,
  scheduleInfo,
  allUsersInfo,
  assignedUser,
}) {
  const [formData, setFormData] = useState(assignedUser);

  const transformDataForUserInfo = allUsersInfo.map((x) => {
    return {
      value: x.id,
      label: `${x.name} (${x.role_name})`,
    };
  });
  const [errorState, setErrorState] = useState({
    employee_id: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    let isValid = true;
    if (!formData) {
      setError("employee_id", true, "Employee is required.");
      isValid = false;
    } else {
      setError("employee_id", false, "");
    }

    return isValid;
  };

  const handleClick = async () => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    await handleChange(assignedUser, formData);
    await handleClose();
  };
  const formFieldsLeft = [
    {
      id: "employee_id",
      label: "Employee",
      type: "select",
      value: formData || "",
      options: transformDataForUserInfo,
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
    },
  ];

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
      aria-labelledby="create-role-dialog-title"
    >
      <DialogTitle
        id="change-emplyee-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Re-Assign Employee
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {formFieldsLeft.map((field) => (
            <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
              <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
              <TextField
                id={field.id}
                name={field.id}
                select
                defaultValue={field.defaultValue}
                value={field.value}
                onChange={(e) => setFormData(e.target.value)}
                fullWidth
                error={field.error}
                helperText={field.helperText}
                color={field.error ? "error" : "primary"}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClick}>
          Re-Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ChangeUser.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangeUser;
