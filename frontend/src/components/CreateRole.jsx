import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { useCreateRole } from "../hooks/Roles/useCreateRole";

function CreateRole({ open, handleClose }) {
  const [errorState, setErrorState] = useState({
    role_name: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };
  const { createRole, isLoading, error } = useCreateRole();

  const validateInputs = () => {
    const role_name = document.getElementById("role_name");
    let isValid = true;
    if (!role_name.value || role_name.value.length < 1) {
      setError("role_name", true, "Role name is required.");
      isValid = false;
    } else {
      setError("role_name", false, "");
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
    const role_name = document.getElementById("role_name").value;
    await createRole(role_name);
    handleClose();
  };
  const formField = [
    {
      id: "role_name",
      label: "Role name",
      placeholder: "Jon Snow",
      error: errorState.role_name.error,
      helperText: errorState.role_name.message,
    },
  ];
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="create-role-dialog-title">Create Role</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {formField.map((field) => (
          <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
            <TextField
              autoComplete={field.id}
              name={field.id}
              id={field.id}
              fullWidth
              variant="outlined"
              placeholder={field.placeholder}
              value={field.value}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateRole.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateRole;
