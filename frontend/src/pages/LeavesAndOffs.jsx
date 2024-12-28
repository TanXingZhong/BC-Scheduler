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
import { styled } from "@mui/material/styles";
import AppTheme from "../../shared-theme/AppTheme";
import Grid from "@mui/material/Grid2";
import { useLeaveOffApps } from "../hooks/useLeaveOffApps";
import { useUserInfo } from "../hooks/useUserInfo";

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

const LeavesAndOffsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function leaveApplication(props) {
  const { leaveOffApply, error, isLoading } = useLeaveOffApps();
  const [errorState, setErrorState] = useState({
    startDate: { error: false, message: "" },
    endDate: { error: false, message: "" },
  });
  const { user_id, leaves } = useUserInfo();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [type, setType] = useState("Leave");
  const [length, setLength] = useState("Full Day");

  const getLengthOptions = () => {
    if (startDate && endDate && startDate !== endDate) {
      return [{ value: "Full Day", label: "Full Day" }];
    }
    return [
      { value: "Full Day", label: "Full Day" },
      { value: "Half Day (Morning)", label: "Half Day (Morning)" },
      { value: "Half Day (Noon)", label: "Half Day (Noon)" },
    ];
  };

  const handleDateChange = (field, value) => {
    if (field === "startDate") {
      setStartDate(value);
    } else if (field === "endDate") {
      setEndDate(value);
    }
  
    // Automatically set length to "Full Day" if start and end dates are different
    if (field === "startDate" || field === "endDate") {
      const updatedStartDate = field === "startDate" ? value : startDate;
      const updatedEndDate = field === "endDate" ? value : endDate;
  
      if (updatedStartDate && updatedEndDate && updatedStartDate !== updatedEndDate) {
        setLength("Full Day");
      }
    }
  };

  // Event handlers to update state when switches change

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {

    let isValid = true;

    if (!endDate == null || endDate.length < 1) {
      setError("endDate", true, "End Date is required.");
      isValid = false;
    } else {
      setError("endDate", false, "");
    }

    if (!startDate == null || startDate.length < 1) {
      setError("startDate", true, "Start Date is required.");
      isValid = false;
    } else {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const check = endDateObj < startDateObj;
  
      if (check) {
        setError("startDate", true, "Start Date has to be before End Date.");
        isValid = false;
      } else {
        setError("startDate", false, "");
      }
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

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Type:", type);
    console.log("Length:", length);
    console.log("UserID:", user_id);
    console.log("leaves", leaves)


    await leaveOffApply(
      user_id,
      type,
      startDate,
      endDate,
      length
    );
  };

  const formFieldsLeft = [
    {
      id: "Type",
      label: "Type",
      type: "select",
      defaultValue: "Leave",
      value: type,
      options: [
        { value: "Leave", label: "Leave" },
        { value: "Off", label: "Offs" },
      ],
    },
    {
      id: "startDate",
      label: "Start Date",
      type: "date",
      error: errorState.startDate.error,
      helperText: errorState.startDate.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "Length",
      label: "Full Day/Half Day",
      type: "select",
      defaultValue: "Full Day",
      value: length,
      options: getLengthOptions(),
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
      error: errorState.endDate.error,
      helperText: errorState.endDate.message,
    },
  ];

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LeavesAndOffsContainer direction="column" justifyContent="space-between">
        <Card>
          <Typography>Leave Balance: { leaves }</Typography>
          <Typography>Offs Balance: TBA</Typography>
        </Card>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Leaves/Offs Application
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
                        onChange={(e) => setType(e.target.value)}
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
                        autoComplete="startDate"
                        name="startDate"
                        id="startDate"
                        fullWidth
                        variant="outlined"
                        type="date"
                        value={startDate} // Bind the value to state
                        onChange={(e) => handleDateChange("startDate", e.target.value)} // Update state on change
                        error={errorState.startDate.error}
                        helperText={errorState.startDate.message}
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
                    {field.type == "select" ? (
                      <TextField
                        required
                        id={field.id}
                        name={field.id}
                        select
                        value={field.value}
                        onChange={(e) => setLength(e.target.value)}
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
                        autoComplete="endDate"
                        name="endDate"
                        id="endDate"
                        fullWidth
                        variant="outlined"
                        type="date"
                        value={endDate} // Bind the value to state
                        onChange={(e) => handleDateChange("endDate", e.target.value)} // Update state on change
                        error={errorState.endDate.error}
                        helperText={errorState.endDate.message}
                      />
                    )}
                  </FormControl>
                ))}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Apply
            </Button>
          </Box>
        </Card>
      </LeavesAndOffsContainer>
    </AppTheme>
  );
}
