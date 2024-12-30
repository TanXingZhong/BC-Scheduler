import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { timePrettier, toSGDate } from "../../config/convertTimeToSGT";
import { useAssignEmployee } from "../hooks/Calendar/useAssignEmployee";
import { useDeleteSchedule } from "../hooks/Calendar/useDeleteSchedule";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import EditSchedule from "./EditSchedule";
import EmployeeInfo from "./EmployeeInfo";

function AllocateSchedule({
  open,
  handleClose,
  scheduleInfo,
  allUsersInfo,
  refresh,
  handleChangeUser,
  handleRemoveUser,
}) {
  const { assignEmployee, isLoading, error } = useAssignEmployee();
  const {
    deleteSchedule,
    isLoading: isLoadingDelete,
    error: errorDelete,
  } = useDeleteSchedule();
  const [formData, setFormData] = useState(scheduleInfo || {});
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
    if (!formData.employee_id) {
      setError("employee_id", true, "Employee is required.");
      isValid = false;
    } else {
      setError("employee_id", false, "");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const sche_Id = scheduleInfo.schedule_id;
    const employee_id = formData.employee_id;
    await assignEmployee(sche_Id, employee_id);
    await refresh();
    handleClose();
  };
  const formFieldsLeft = [
    {
      id: "employee_id",
      label: "Employee",
      type: "select",
      value: formData.employee_id || "",
      options: transformDataForUserInfo,
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
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
      id: "date",
      label: "Date",
      defaultValue: toSGDate(scheduleInfo.start),
      isEditable: false,
    },
    {
      id: "time",
      label: "Time",
      defaultValue: timePrettier(
        scheduleInfo.start_time,
        scheduleInfo.end_time
      ),
      isEditable: false,
    },
  ];

  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => {
    setOpenEdit(false);
    handleClose();
  };
  const handleEdit = (x) => {
    setOpenEdit(true); // Open the edit modal
  };

  const handleDelete = async () => {
    await deleteSchedule(scheduleInfo.schedule_id);
    await refresh();
  };

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
      <DialogTitle
        id="create-role-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Assign Employee
        <div>
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <EmployeeInfo
          scheduleInfo={scheduleInfo}
          handleDelete={handleRemoveUser}
          handleChange={handleChangeUser}
          allUsersInfo={allUsersInfo}
        />
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type == "select" ? (
                  <TextField
                    id={field.id}
                    name={field.id}
                    select
                    defaultValue={field.defaultValue}
                    value={field.value}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
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
                    slotProps={{
                      input: {
                        readOnly: !field.isEditable,
                      },
                    }}
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
          Assign
        </Button>
      </DialogActions>

      {openEdit && (
        <EditSchedule
          open={openEdit}
          handleClose={handleCloseEdit}
          scheduleInfo={formData}
          refresh={refresh}
        />
      )}
    </Dialog>
  );
}

AllocateSchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AllocateSchedule;
