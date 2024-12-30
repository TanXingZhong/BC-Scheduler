import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeUser from "./ChangeUser";

const EmployeeInfo = ({
  scheduleInfo,
  handleDelete,
  handleChange,
  allUsersInfo,
}) => {
  const [open, setOpen] = useState(false);

  const [assignedUser, setAssignedUser] = useState("");
  const handleClose = () => {
    setAssignedUser("");
    setOpen(false);
  };
  const handleEdit = (x) => {
    setAssignedUser(x);
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6">Coworkers:</Typography>
      {scheduleInfo.array.map((x, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{x.employee + " (" + (x.role || "") + ")"}</Typography>

          <Box>
            <IconButton aria-label="edit" onClick={() => handleEdit(x.id)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDelete(x.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      {open && (
        <ChangeUser
          open={open}
          handleClose={handleClose}
          handleChange={handleChange}
          scheduleInfo={scheduleInfo}
          allUsersInfo={allUsersInfo}
          assignedUser={assignedUser}
        />
      )}
    </Box>
  );
};

export default EmployeeInfo;
