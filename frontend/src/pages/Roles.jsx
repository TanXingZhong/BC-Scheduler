import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  Typography,
  Button,
  Box,
  Link,
  FormControl,
} from "@mui/material";
import Search from "../components/Search";
import { useGetRoles } from "../hooks/Roles/useGetRoles";
import CorfirmationToDeleteRole from "../components/CorfirmationToDeleteRole";
import { useDeleteRole } from "../hooks/Roles/useDeleteRole";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ViewMember from "../components/ViewMember";
import EditRole from "../components/EditRole";
import { useEditRole } from "../hooks/Roles/useEditRole";
import CreateRole from "../components/CreateRole";

const Roles = () => {
  const { fetchRoles, isLoading, error } = useGetRoles(); // Use the custom hook
  const {
    editRole,
    isLoading: isLoadingEditRole,
    error: errorEditRole,
  } = useEditRole();
  const {
    deleteRole,
    isLoading: isLoadingDeleteRole,
    error: errorDeleteRole,
  } = useDeleteRole();
  const columns = [
    { field: "role_name", headerName: "ROLES", editable: false, width: 250 },
    {
      field: "user_count",
      headerName: "MEMBERS",
      editable: false,
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally within the Box
            alignItems: "center", // Center vertically within the Box
            width: "100%",
            gap: 1, // Adds space between the number and the icon
          }}
        >
          <span
            onClick={() => handleViewMembers(params.row)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px", // Adds space between the number and the icon
            }}
          >
            <span>{params.row.user_count}</span> {/* User count */}
            <PeopleRoundedIcon
              sx={{
                fontSize: 18, // Adjust icon size
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)", // Slightly enlarge the icon on hover
                },
              }}
            />
          </span>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally within the Box
            alignItems: "center", // Center vertically within the Box
            width: "100%",
          }}
        >
          <Link
            component="button"
            onClick={() => handleClickOpenEditRole(params.row)}
            variant="body2"
            underline="hover"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textAlign: "center", // Center the text inside the link
              display: "flex", // Set Link to use flexbox
              justifyContent: "center", // Center the content of Link
              alignItems: "center", // Center vertically
              padding: 1, // Optional: add padding inside Link for better spacing
            }}
          >
            Edit
          </Link>
          <Link
            component="button"
            onClick={() => handleClickOpenRoleDelete(params.row.role_name)}
            variant="body2"
            underline="hover"
            sx={{
              color: "error.main",
              fontWeight: "bold",
              textAlign: "center", // Center the text inside the link
              display: "flex", // Set Link to use flexbox
              justifyContent: "center", // Center the content of Link
              alignItems: "center", // Center vertically
              padding: 1, // Optional: add padding inside Link for better spacing
            }}
          >
            Delete
          </Link>
        </Box>
      ),
    },
  ];

  const [openRoleDelete, setOpenRoleDelete] = useState(false);
  const [role_name, setRole_name] = useState("");
  const [data, setData] = useState([]);
  const [openViewMember, setOpenViewMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [openEditRole, setOpenEditRole] = useState(false);
  const [roleInfo, setRoleInfo] = useState([]);
  const [openCreateRole, setOpenCreateRole] = useState(false);

  const onLoad = async () => {
    try {
      const val = await fetchRoles();
      setData(val);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  const handleCloseEditRole = () => {
    setOpenEditRole(false);
  };

  const handleCloseRoleDelete = () => {
    setOpenRoleDelete(false);
  };

  const handleCloseViewMember = () => {
    setOpenViewMember(false);
  };

  const handleCloseCreateRole = () => {
    setOpenCreateRole(false);
  };

  const handleClickOpenRoleDelete = (x) => {
    setOpenRoleDelete(true);
    setRole_name(x);
  };

  const handleViewMembers = (x) => {
    setMembers(x);
    setOpenViewMember(true);
  };

  const handleContinueRoleDelete = async (x) => {
    try {
      await deleteRole(x);
    } catch (err) {
      console.error("Error deleting role:", err);
    }
    setOpenRoleDelete(false);
  };

  const [loading, setLoading] = useState(false); // To track if data is loading
  const handleClickOpenEditRole = (x) => {
    setLoading(true);
    setRoleInfo({});
    setTimeout(() => {
      setRoleInfo(x);
      setLoading(false);
    }, 0);
  };

  const handleClickOpenCreateRole = () => {
    setOpenCreateRole(true);
  };

  const handleContinueEditRole = async (x) => {
    try {
      await editRole(x);
      await onLoad();
    } catch (err) {}
  };
  useEffect(() => {
    if (roleInfo && Object.keys(roleInfo).length > 0) {
      setOpenEditRole(true);
    }
  }, [roleInfo]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <CorfirmationToDeleteRole
        open={openRoleDelete}
        handleClose={handleCloseRoleDelete}
        handleContinue={handleContinueRoleDelete}
        role_name={role_name}
      />
      <CreateRole open={openCreateRole} handleClose={handleCloseCreateRole} />
      <ViewMember
        open={openViewMember}
        handleClose={handleCloseViewMember}
        data={members}
      />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Loading role informations...
          </Typography>
          <CircularProgress sx={{ ml: 2 }} />
        </Box>
      ) : roleInfo ? (
        <EditRole
          open={openEditRole}
          handleClose={handleCloseEditRole}
          handleContinue={handleContinueEditRole}
          roleInfo={roleInfo}
        />
      ) : (
        <>
          {openEditRole && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Failed to load role data. Please try again later.
            </Typography>
          )}
        </>
      )}

      <Box
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ flex: 1 }}>
          <Search />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          onClick={() => handleClickOpenCreateRole()}
          sx={{
            ml: 2,
          }}
        >
          Create Roles
        </Button>
      </Box>

      {/* Data Grid */}
      <DataGrid
        rows={data}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
};

export default Roles;
