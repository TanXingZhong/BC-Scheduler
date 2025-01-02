import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import { useGetAllApplications } from "../../hooks/Home/useGetAllApplications";
import { toSGDate, toSGTimeShort } from "../../../config/convertTimeToSGT";
import { usePutApplication } from "../../hooks/Calendar/usePutApplication";
import CheckIcon from "@mui/icons-material/check";
import CloseIcon from "@mui/icons-material/Close";
export default function ScheduleApproval() {
  const { allApplications, isLoading, error } = useGetAllApplications();
  const {
    approve_reject,
    isLoading: isLoadingPut,
    error: errorEditPut,
  } = usePutApplication();
  const [applications, setApplications] = useState([]);

  const onLoad = async () => {
    try {
      const data = await allApplications();
      setApplications(data);
    } catch (err) {
      console.error("Error loading schedules: ", err);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  const rows = applications;

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "role_name", headerName: "Role", width: 100 },
    { field: "outlet_name", headerName: "Outlet", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      valueFormatter: (params) => toSGDate(params),
    },
    {
      field: "start_time",
      headerName: "Start",
      width: 70,
      valueFormatter: (params) => toSGTimeShort(params),
    },
    {
      field: "end_time",
      headerName: "End",
      width: 70,
      valueFormatter: (params) => toSGTimeShort(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{
              borderRadius: "50%",
            }}
            aria-label="accept"
            onClick={() =>
              handleAccept({ rows: params.row, action: "accepted" })
            }
          >
            <CheckIcon fontSize="small" sx={{ color: "green" }} />
          </IconButton>
          <IconButton
            sx={{
              borderRadius: "50%",
            }}
            aria-label="delete"
            onClick={() =>
              handleReject({ rows: params.row, action: "rejected" })
            }
          >
            <CloseIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleAccept = async (x) => {
    await approve_reject(x.rows.schedule_id, x.rows.user_id, x.action);
    onLoad();
  };

  const handleReject = async (x) => {
    await approve_reject(x.rows.schedule_id, x.rows.user_id, x.action);
    onLoad();
  };

  return (
    <Box style={{ height: 320, margin: "0 auto" }}>
      <DataGrid
        rows={rows}
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
      />
    </Box>
  );
}
