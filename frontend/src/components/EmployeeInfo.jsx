import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeUser from "./ChangeUser";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Divider from "@mui/material/Divider";

const EmployeeInfo = ({
  scheduleInfo,
  handleDelete,
  handleChange,
  close,
  allUsersInfo,
  handleChangeMSG,
}) => {
  const [open, setOpen] = useState(false);

  const [assignedUser, setAssignedUser] = useState("");
  const handleClose = () => {
    setAssignedUser("");
    setOpen(false);
    close();
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

          {x.employee != "EMPTY" && (
            <Box>
              <IconButton
                sx={{
                  border: "none",
                  borderRadius: "50%",
                }}
                aria-label="edit"
                onClick={() => handleEdit(x.id)}
              >
                <ManageAccountsIcon fontSize="small" sx={{ color: "blue" }} />
              </IconButton>
              <IconButton
                sx={{
                  border: "none",
                  borderRadius: "50%",
                }}
                aria-label="delete"
                onClick={() => handleDelete(x.id)}
              >
                <DeleteIcon fontSize="small" sx={{ color: "red" }} />
              </IconButton>
            </Box>
          )}
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
          handleChangeMSG={handleChangeMSG}
        />
      )}
      <Divider />
    </Box>
  );
};

export default EmployeeInfo;
