import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { toSGDate, toSGTimeShort } from "../../../config/convertTimeToSGT";
import { useGetUserLeaveApplications } from "../../hooks/Home/useGetUserLeaveApplications";
import { useUserInfo } from "../../hooks/useUserInfo";
import { useClearUserLeaveApplication } from "../../hooks/Home/useClearUserLeaveApplication";

export default function LeaveApplicationList() {
  const { userLeaveApplications, isLoading, error } =
    useGetUserLeaveApplications();
  const [user_LeaveApplications, setUser_LeaveApplications] = useState([]);
  const { clearLeaveApplications } = useClearUserLeaveApplication();
  const { user_id } = useUserInfo();

  const onLoad = async () => {
    const data = await userLeaveApplications(user_id);
    if (data) setUser_LeaveApplications(data);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const columns = [
    { field: "type", headerName: "Type", width: 100 },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 100,
      valueFormatter: (params) => toSGDate(params),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 100,
      valueFormatter: (params) => toSGDate(params),
    },
    { field: "duration", headerName: "Duration", width: 100 },
    { field: "amt_used", headerName: "Amount", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      valueFormatter: (params) => {
        if (params === "pending") {
          return "Pending";
        } else if (params == "accepted") {
          return "Accepted";
        } else {
          return "Unknown";
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <div>
            {status === "pending" ? (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() =>
                  handleCancel(
                    params.row.leave_offs_id,
                    user_id,
                    params.row.type,
                    status,
                    params.row.amt_used
                  )
                }
              >
                Cancel
              </Button>
            ) : status === "rejected" ? (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() =>
                  handleCancel(
                    params.row.leave_offs_id,
                    user_id,
                    params.row.type,
                    status,
                    params.row.amt_used
                  )
                }
              >
                Clear
              </Button>
            ) : status === "accepted" ? (
              new Date() < new Date(params.row.start_date) ||
              new Date() > new Date(params.row.end_date) ? (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() =>
                    handleCancel(
                      params.row.leave_offs_id,
                      user_id,
                      params.row.type,
                      status,
                      params.row.amt_used
                    )
                  }
                >
                  Cancel
                </Button>
              ) : (
                <span>No actions</span>
              )
            ) : (
              <span>No actions</span>
            )}
          </div>
        );
      },
    },
  ];

  const handleCancel = async (
    leave_offs_id,
    user_id,
    type,
    status,
    amt_used
  ) => {
    await clearLeaveApplications(
      leave_offs_id,
      user_id,
      type,
      status,
      amt_used
    );
    onLoad();
  };

  return (
    <Box style={{ height: 320, margin: "0 auto" }}>
      <DataGrid
        rows={user_LeaveApplications}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        getRowId={(row) => row.leave_offs_id}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooterSelectedRowCount
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
      />
    </Box>
  );
}
