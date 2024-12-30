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
  Switch,
  FormControlLabel,
} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { forumToSGDate } from "../../config/convertTimeToSGT";

function UpdateUser({
  open,
  handleClose,
  handleUpdateUserInfo,
  userInfo,
  allRoles,
}) {
  const [formData, setFormData] = useState(userInfo || {});
  const transformDataForRoles = allRoles.map((x) => ({
    value: x.id,
    label: x.role_name,
  }));

  useEffect(() => {
    if (userInfo) {
      setFormData(userInfo);
    }
  }, [userInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      handleUpdateUserInfo(formData);
      handleClose();
    }
  };

  const [errorState, setErrorState] = useState({
    name: { error: false, message: "" },
    nric: { error: false, message: "" },
    email: { error: false, message: "" },
    phonenumber: { error: false, message: "" },
    dob: { error: false, message: "" },
    bankName: { error: false, message: "" },
    bankAccountNo: { error: false, message: "" },
    address: { error: false, message: "" },
  });

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    const name = document.getElementById("name");
    const nric = document.getElementById("nric");
    const email = document.getElementById("email");
    const phonenumber = document.getElementById("phonenumber");
    const dob = document.getElementById("dob");
    const bankName = document.getElementById("bankName");
    const bankAccountNo = document.getElementById("bankAccountNo");
    const address = document.getElementById("address");

    let isValid = true;

    // Validate Name
    if (!name.value || name.value.length < 1) {
      setError("name", true, "Name is required.");
      isValid = false;
    } else {
      setError("name", false, "");
    }

    // Validate NRIC
    if (!nric.value) {
      setError("nric", true, "NRIC is required.");
      isValid = false;
    } else if (nric.value.length !== 9) {
      setError("nric", true, "NRIC length must be 9.");
      isValid = false;
    } else {
      setError("nric", false, "");
    }

    // Validate Phone Number
    if (!phonenumber.value) {
      setError("phonenumber", true, "Phone Number is required.");
      isValid = false;
    } else if (!/^\d+$/.test(phonenumber.value)) {
      // Check if the input is numeric
      setError("phonenumber", true, "Phone Number must be a valid number.");
      isValid = false;
    } else {
      setError("phonenumber", false, "");
    }

    // Validate Date of Birth
    if (!dob.value || dob.value.length < 1) {
      setError("dob", true, "Date of Birth is required.");
      isValid = false;
    } else {
      setError("dob", false, "");
    }

    // Validate Email
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setError("email", true, "Please enter a valid email address.");
      isValid = false;
    } else {
      setError("email", false, "");
    }

    // Validate Bank Name
    if (!bankName.value || bankName.value.length < 1) {
      setError("bankName", true, "Bank Name is required.");
      isValid = false;
    } else {
      setError("bankName", false, "");
    }

    // Validate Bank Account No
    if (!bankAccountNo.value || bankAccountNo.value.length < 1) {
      setError("bankAccountNo", true, "Bank Account No is required.");
      isValid = false;
    } else {
      setError("bankAccountNo", false, "");
    }

    // Validate Address
    if (!address.value || address.value.length < 1) {
      setError("address", true, "Address is required.");
      isValid = false;
    } else {
      setError("address", false, "");
    }
    return isValid;
  };

  const formFieldsLeft = [
    {
      id: "name",
      label: "Full name",
      placeholder: "Jon Snow",
      defaultValue: formData.name,
      error: errorState.name.error,
      helperText: errorState.name.message,
    },
    {
      id: "nric",
      label: "NRIC",
      placeholder: "T1234568A",
      defaultValue: formData.nric,
      error: errorState.nric.error,
      helperText: errorState.nric.message,
    },
    {
      id: "email",
      label: "Email",
      defaultValue: formData.email,
      placeholder: "jon.snow@example.com",
      error: errorState.email.error,
      helperText: errorState.email.message,
    },
    {
      id: "phonenumber",
      label: "Phone Number",
      defaultValue: formData.phonenumber,
      placeholder: "12345678",
      error: errorState.phonenumber.error,
      helperText: errorState.phonenumber.message,
    },
    {
      id: "sex",
      label: "Sex",
      type: "select",
      defaultValue: formData.sex,
      value: formData.sex,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      error: false,
      helperText: "",
    },
    {
      id: "dob",
      label: "Date of Birth",
      defaultValue: forumToSGDate(formData.dob),
      type: "date",
      error: errorState.dob.error,
      helperText: errorState.dob.message,
    },
    {
      id: "joinDate",
      label: "Join Date",
      defaultValue: forumToSGDate(formData.joinDate),
      type: "date",
    },
    {
      id: "role_id",
      label: "Role",
      type: "select",
      defaultValue: formData.role_id,
      value: formData.role_id,
      options: transformDataForRoles,
      error: false,
      helperText: "",
    },
  ];

  const formFieldsRight = [
    {
      id: "bankName",
      label: "Bank Name",
      defaultValue: formData.bankName,
      placeholder: "Bank Name",
      error: errorState.bankName.error,
      helperText: errorState.bankName.message,
    },
    {
      id: "bankAccountNo",
      label: "Bank Account Number",
      defaultValue: formData.bankAccountNo,
      placeholder: "123-456-7890",
      error: errorState.bankAccountNo.error,
      helperText: errorState.bankAccountNo.message,
    },
    {
      id: "address",
      label: "Address",
      defaultValue: formData.address,
      placeholder: "Address",
      error: errorState.address.error,
      helperText: errorState.address.message,
    },
    {
      id: "workplace",
      label: "Workplace",
      defaultValue: formData.workplace,
      placeholder: "Workplace",
    },
    {
      id: "occupation",
      label: "Occupation",
      defaultValue: formData.occupation,
      placeholder: "Occupation",
    },
  ];

  const actionsData = [
    { id: "driverLicense", name: "driverLicense", label: "Driver License" },
    { id: "firstAid", name: "firstAid", label: "First Aid" },
    { id: "admin", name: "admin", label: "Admin" },
    { id: "active", name: "active", label: "Active" },
    // Add more actions here
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
      aria-labelledby="update-user-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="user-dialog-title">User Details</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type == "select" ? (
                  <TextField
                    required
                    id={field.id}
                    name={field.id}
                    select
                    defaultValue={field.defaultValue}
                    value={field.value}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    fullWidth
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    autoComplete={field.id}
                    name={field.id}
                    id={field.id}
                    fullWidth
                    variant="outlined"
                    defaultValue={field.defaultValue}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    error={field.error}
                    helperText={field.helperText}
                    color={field.error ? "error" : "primary"}
                  />
                )}
              </FormControl>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsRight.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                <TextField
                  autoComplete={field.id}
                  name={field.id}
                  fullWidth
                  defaultValue={field.defaultValue}
                  options={field.options}
                  type={field.type}
                  id={field.id}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.id]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  error={field.error}
                  helperText={field.helperText}
                  color={field.error ? "error" : "primary"}
                />
              </FormControl>
            ))}

            <Grid sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel>Actions</FormLabel>
              {actionsData.map((action) => (
                <FormControlLabel
                  key={action.name}
                  control={
                    <Switch
                      name={action.name}
                      id={action.name}
                      checked={formData[action.name] === 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [action.name]: e.target.checked ? 1 : 0,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={action.label}
                  sx={{ marginBottom: 2 }}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
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

UpdateUser.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleUpdateUserInfo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default UpdateUser;
