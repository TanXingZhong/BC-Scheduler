import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { Switch, FormControlLabel } from "@mui/material";
import MuiCard from "@mui/material/Card";
import AppTheme from "../../shared-theme/AppTheme";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { useSignup } from "../hooks/useSignup";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "800px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function SignUp(props) {
  const { signup, error, isLoading } = useSignup();
  const [errorState, setErrorState] = useState({
    name: { error: false, message: "" },
    nric: { error: false, message: "" },
    email: { error: false, message: "" },
    password: { error: false, message: "" },
    phonenumber: { error: false, message: "" },
    dob: { error: false, message: "" },
    bankName: { error: false, message: "" },
    bankAccountNo: { error: false, message: "" },
    address: { error: false, message: "" },
  });
  // State for switches
  const [firstAid, setFirstAid] = useState(false);
  const [driverLicense, setDriverLicense] = useState(false);
  const [sex, setSex] = useState("Male");

  // Event handlers to update state when switches change
  const handleSwitchChangeFirstAid = (event) => {
    setFirstAid(event.target.checked);
  };

  const handleSwitchChangeDriverLicense = (event) => {
    setDriverLicense(event.target.checked);
  };

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
    const password = document.getElementById("password");
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

    // Validate Password
    if (!password.value || password.value.length < 6) {
      setError(
        "password",
        true,
        "Password must be at least 6 characters long."
      );
      isValid = false;
    } else {
      setError("password", false, "");
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the inputs before submission
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    // If no errors, proceed with form submission
    const name = document.getElementById("name").value;
    const nric = document.getElementById("nric").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const dob = document.getElementById("dob").value;
    const bankName = document.getElementById("bankName").value;
    const bankAccountNo = document.getElementById("bankAccountNo").value;
    const address = document.getElementById("address").value;
    const workplace = document.getElementById("workplace").value;
    const occupation = document.getElementById("occupation").value;
    // You can replace this with your actual signup function
    await signup(
      name,
      nric,
      email,
      password,
      phonenumber,
      sex,
      dob,
      bankName,
      bankAccountNo,
      address,
      workplace,
      occupation,
      driverLicense,
      firstAid
    );
  };

  const formFieldsLeft = [
    {
      id: "name",
      label: "Full name",
      placeholder: "Jon Snow",
      error: errorState.name.error,
      helperText: errorState.name.message,
    },
    {
      id: "nric",
      label: "NRIC",
      placeholder: "T1234568A",
      error: errorState.nric.error,
      helperText: errorState.nric.message,
    },
    {
      id: "email",
      label: "Email",
      placeholder: "jon.snow@example.com",
      error: errorState.email.error,
      helperText: errorState.email.message,
    },
    {
      id: "password",
      label: "Password",
      placeholder: "******",
      error: errorState.password.error,
      helperText: errorState.password.message,
    },
    {
      id: "phonenumber",
      label: "Phone Number",
      placeholder: "12345678",
      error: errorState.phonenumber.error,
      helperText: errorState.phonenumber.message,
    },
    {
      id: "sex",
      label: "Sex",
      type: "select",
      defaultValue: "Male",
      value: sex,
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
      type: "date",
      error: errorState.dob.error,
      helperText: errorState.dob.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "bankName",
      label: "Bank Name",
      placeholder: "Bank Name",
      error: errorState.bankName.error,
      helperText: errorState.bankName.message,
    },
    {
      id: "bankAccountNo",
      label: "Bank Account Number",
      placeholder: "123-456-7890",
      error: errorState.bankAccountNo.error,
      helperText: errorState.bankAccountNo.message,
    },
    {
      id: "address",
      label: "Address",
      placeholder: "Address",
      error: errorState.address.error,
      helperText: errorState.address.message,
    },
    {
      id: "workplace",
      label: "Workplace",
      placeholder: "Workplace",
      defaultValue: "NA",
    },
    {
      id: "occupation",
      label: "Occupation",
      placeholder: "Occupation",
      defaultValue: "NA",
    },
  ];

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Create Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
            }}
          >
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, md: 6 }}>
                {formFieldsLeft.map((field) => (
                  <FormControl
                    key={field.id}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  >
                    <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                    {field.type == "select" ? (
                      <TextField
                        required
                        id={field.id}
                        name={field.id}
                        select
                        value={field.value}
                        onChange={(e) => setSex(e.target.value)}
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
                  <FormControl
                    key={field.id}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  >
                    <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                    <TextField
                      autoComplete={field.id}
                      name={field.id}
                      fullWidth
                      defaultValue={field.defaultValue}
                      options={field.options}
                      type={field.type}
                      id={field.id}
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
                            checked={driverLicense}
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
                            checked={firstAid} // Bind to the state
                            onChange={handleSwitchChangeFirstAid} // Update state on change
                          />
                        }
                        label="First Aid"
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
