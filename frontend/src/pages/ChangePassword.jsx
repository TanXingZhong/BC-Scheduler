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
import { useUserInfo } from "../hooks/useUserInfo";
import { useChangePassword } from "../hooks/useChangePassword";

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

export default function ChangePassword(props) {
  const userInfo = useUserInfo();
  const { changePassword, error, isLoading, success } = useChangePassword();
  const [errorState, setErrorState] = useState({
    oldPassword: { error: false, message: "" },
    newPassword: { error: false, message: "" },
});

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    const oldPassword = document.getElementById("oldPassword");
    const newPassword = document.getElementById("newPassword");

    let isValid = true;

    // Validate Password
    if(!oldPassword.value) {
        setError("oldPassword", true, "Old password is required.");
        isValid = false;
    } else {
        setError("oldPassword", false, "");
    }
    if(!newPassword.value || newPassword.value.length < 6) {
        setError("newPassword", true, "New password must be at least 6 characters long.");
        isValid = false;
    } else {
        setError("newPassword", false, "");
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
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // You can replace this with your actual signup function
    await changePassword(
      userInfo.user_id,
      oldPassword,
      newPassword,
    );
  };

  const formFieldsLeft = [
    {
      id: "oldPassword",
      label: "Old Password",
    },
    {
      id: "newPassword",
      label: "New Password",
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
            Change Password
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
            </Grid>
            {error && validateInputs && <div className="error">{error}</div>}
            {success && validateInputs && (
              <div className="success">{success}</div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              disabled={isLoading}
            >
                Change Password
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
