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
import { forumToSGTime } from "../../config/convertTimeToSGT";

function UpdateUser({ open, handleClose, handleUpdateUserInfo, userInfo }) {
  const [formData, setFormData] = useState(userInfo || {});
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

  const handleSwitchChangeFirstAid = (event) => {
    setFormData({
      ...formData,
      firstAid: event.target.checked,
    });
  };

  const handleSwitchChangeDriverLicense = (event) => {
    setFormData({
      ...formData,
      driverLicense: event.target.checked,
    });
  };

  const handleSwitchChangeActive = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked,
    });
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
      defaultValue: forumToSGTime(formData.dob),
      type: "date",
      error: errorState.dob.error,
      helperText: errorState.dob.message,
    },
    {
      id: "joinDate",
      label: "Join Date",
      defaultValue: forumToSGTime(formData.joinDate),
      type: "date",
    },
    {
      id: "roles",
      label: "Role",
      type: "select",
      defaultValue: formData.roles,
      value: formData.roles,
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Part_Timer", label: "Part_Timer" },
        { value: "Full_Timer", label: "Full_Timer" },
      ],
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
      defaultValue: "NA",
    },
    {
      id: "occupation",
      label: "Occupation",
      defaultValue: formData.occupation,
      placeholder: "Occupation",
      defaultValue: "NA",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="user-dialog-title"
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
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <FormLabel>Actions</FormLabel>
              <Grid container spacing={2} alignItems="center">
                <Grid ize={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="driverLicense"
                        id="driverLicense"
                        checked={formData.driverLicense == 1 ? true : false}
                        onChange={handleSwitchChangeDriverLicense}
                      />
                    }
                    label="Driver License"
                  />
                </Grid>
                {/* First Aid */}
                <Grid ize={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="firstAid"
                        id="firstAid"
                        checked={formData.firstAid == 1 ? true : false} // Bind to the state
                        onChange={handleSwitchChangeFirstAid} // Update state on change
                      />
                    }
                    label="First Aid"
                  />
                </Grid>
              </Grid>
            </FormControl>
            <Grid ize={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    id="active"
                    checked={formData.active == 1 ? true : false} // Bind to the state
                    onChange={handleSwitchChangeActive} // Update state on change
                  />
                }
                label="Active"
              />
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
  // userInfo: PropTypes.shape({
  //   name: PropTypes.string.isRequired,
  //   nric: PropTypes.string.isRequired,
  //   email: PropTypes.string.isRequired,
  //   phonenumber: PropTypes.string.isRequired,
  //   sex: PropTypes.oneOf(["Male", "Female"]).isRequired,
  //   dob: PropTypes.instanceOf(Date).isRequired,
  //   bankName: PropTypes.string.isRequired,
  //   bankAccountNo: PropTypes.string.isRequired,
  //   address: PropTypes.string.isRequired,
  //   workplace: PropTypes.string.isRequired,
  //   occupation: PropTypes.string.isRequired,
  //   driverLicense: PropTypes.string.isRequired,
  //   firstAid: PropTypes.bool.isRequired,
  //   joinDate: PropTypes.instanceOf(Date).isRequired,
  //   roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  //   active: PropTypes.bool.isRequired,
  // }).isRequired,
};

export default UpdateUser;
