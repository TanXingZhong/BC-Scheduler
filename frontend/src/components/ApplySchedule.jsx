import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { toSGDate, timePrettier } from "../../config/convertTimeToSGT";
import { useApplyShift } from "../hooks/Calendar/useApplyShift";
import EmployeeInfoNoEdit from "./EmployeeInfoNoEdit";
import CloseIcon from "@mui/icons-material/Close";

function ApplySchedule({ open, handleClose, scheduleInfo, userInfo }) {
  const { applyShift, isLoading, error, success } = useApplyShift();
  const [openApplySB, setOpenApplySB] = useState(false);

  const handleCloseApplySB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenApplySB(false);
  };

  const actionApply = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseApplySB}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    const sche_Id = scheduleInfo.schedule_id;
    const employee_id = userInfo.user_id;
    await applyShift(sche_Id, employee_id);
    setOpenApplySB(true);
  };
  const formFieldsLeft = [
    {
      id: "employee_id",
      label: "Employee",
      defaultValue: userInfo.name,
      isEditable: false,
    },
    {
      id: "outlet_name",
      label: "Outlet",
      defaultValue: scheduleInfo.outlet_name,
      isEditable: false,
    },
  ];
  const formFieldsRight = [
    {
      id: "start_date",
      label: "Date",
      defaultValue: toSGDate(scheduleInfo.start),
      isEditable: false,
    },
    {
      id: "end_date",
      label: "Time",
      defaultValue: timePrettier(
        scheduleInfo.start_time,
        scheduleInfo.end_time
      ),
      isEditable: false,
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
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="create-role-dialog-title">Apply Schedule</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <EmployeeInfoNoEdit scheduleInfo={scheduleInfo} />
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
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
                  slotProps={{
                    input: {
                      readOnly: !field.isEditable,
                    },
                  }}
                />
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
                  placeholder={field.placeholder}
                  error={field.error}
                  helperText={field.helperText}
                  color={field.error ? "error" : "primary"}
                  slotProps={{
                    input: {
                      readOnly: !field.isEditable,
                    },
                  }}
                />
              </FormControl>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Apply
        </Button>
      </DialogActions>
      <Snackbar
        open={openApplySB}
        autoHideDuration={6000}
        onClose={handleCloseApplySB}
        message={success ? success : error}
        action={actionApply}
      />
    </Dialog>
  );
}

ApplySchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ApplySchedule;
