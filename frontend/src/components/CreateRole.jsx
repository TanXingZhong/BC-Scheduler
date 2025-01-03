import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { useCreateRole } from "../hooks/Roles/useCreateRole";
import CloseIcon from "@mui/icons-material/Close";

function CreateRole({ open, handleClose, handleRefresh }) {
  const [errorState, setErrorState] = useState({
    role_name: { error: false, message: "" },
    color: { error: false, message: "" },
  });
  const { createRole, isLoading, error, success } = useCreateRole();
  const [openCreateSB, setOpenCreateSB] = useState(false);

  const handleCloseCreateSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCreateSB(false);
  };

  const actionCreate = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseCreateSB}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    const role_name = document.getElementById("role_name");
    let isValid = true;
    if (!role_name.value || role_name.value.trim().length < 1) {
      setError("role_name", true, "Role name is required.");
      isValid = false;
    } else {
      setError("role_name", false, "");
    }

    if (!color.value || color.value.trim().length < 1) {
      setError("color", true, "Color is required.");
      isValid = false;
    } else {
      setError("color", false, "");
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
    const role_name = document.getElementById("role_name").value.trim();
    const color = document.getElementById("color").value.trim();
    await createRole(role_name, color);
    setOpenCreateSB(true);
    handleRefresh();
  };

  const formField = [
    {
      id: "role_name",
      label: "Role name",
      placeholder: "Jon Snow",
      error: errorState.role_name.error,
      helperText: errorState.role_name.message,
    },
    {
      id: "color",
      label: "Color",
      type: "color",
      error: errorState.color.error,
      helperText: errorState.color.message,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
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
          <FormControl key={field.id} fullWidth>
            <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
            <TextField
              autoComplete={field.id}
              name={field.id}
              id={field.id}
              fullWidth
              type={field.type ? field.type : "text"}
              variant="outlined"
              placeholder={field.placeholder}
              error={field.error}
              helperText={field.helperText}
              color={field.error ? "error" : "primary"}
            />
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={isLoading}>
          Create
        </Button>
      </DialogActions>
      <Snackbar
        open={openCreateSB}
        autoHideDuration={6000}
        onClose={handleCloseCreateSB}
        message={success ? success : error}
        action={actionCreate}
      />
    </Dialog>
  );
}

CreateRole.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateRole;
