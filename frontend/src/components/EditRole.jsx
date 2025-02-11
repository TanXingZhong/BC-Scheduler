import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";

function EditRole({ open, handleClose, handleContinue, roleInfo }) {
  const [formData, setFormData] = useState(roleInfo || {});
  useEffect(() => {
    if (roleInfo) {
      setFormData(roleInfo);
    }
  }, [roleInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      handleContinue(formData);
      handleClose();
    }
  };

  const [errorState, setErrorState] = useState({
    role_name: { error: false, message: "" },
    color: { error: false, message: "" },
  });

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    const role_name = document.getElementById("role_name");
    let isValid = true;

    // Validate Name
    if (!role_name.value || role_name.value.length < 1) {
      setError("role_name", true, "Role name is required.");
      isValid = false;
    } else {
      setError("role_name", false, "");
    }
    return isValid;
  };

  const formFieldList = [
    {
      id: "role_name",
      label: "Role name",
      placeholder: "Jon Snow",
      defaultValue: formData.role_name,
      error: errorState.role_name.error,
      helperText: errorState.role_name.message,
    },
    {
      id: "color",
      label: "Color",
      type: "color",
      defaultValue: formData.color,
      error: errorState.color.error,
      helperText: errorState.color.message,
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
      aria-labelledby="edit-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="user-dialog-title">Edit Role</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {formFieldList.map((field) => (
          <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
            <TextField
              autoComplete={field.id}
              name={field.id}
              id={field.id}
              fullWidth
              type={field.type ? field.type : "text"}
              variant="outlined"
              defaultValue={field.defaultValue}
              placeholder={field.placeholder}
              onChange={(e) =>
                setFormData({ ...formData, [field.id]: e.target.value })
              }
              error={field.error}
              helperText={field.helperText}
              color={field.error ? "error" : "primary"}
            />
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditRole.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default EditRole;
