import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import "../../index.css";
import { useGetPendingLeavesAndOffs } from "../../hooks/Home/useGetPendingLeavesAndOffs";
import { toSGDate } from "../../../config/convertTimeToSGT";
import { useActionLeaveOffs } from "../../hooks/Home/useActionLeaveOffs";
import CheckIcon from "@mui/icons-material/check";
import CloseIcon from "@mui/icons-material/Close";

export default function LeaveApproval() {
  const { getPendingLeavesAndOffs, isLoading, error } =
    useGetPendingLeavesAndOffs();
  const [user_LeaveOffApplications, setUserLeaveOffApplications] = useState([]);
  const {
    approve_reject,
    isLoading: isLoadingPut,
    error: errorEditPut,
  } = useActionLeaveOffs();

  const onLoad = async () => {
    const data = await getPendingLeavesAndOffs();
    if (data) setUserLeaveOffApplications(data);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const items = user_LeaveOffApplications.map((application) => ({
    ...application,
    start_date: toSGDate(application.start_date),
    end_date: toSGDate(application.end_date),
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 100,
    },
    { field: "type", headerName: "Type", width: 100 },
    { field: "start_date", headerName: "Start Date", width: 100 },
    { field: "end_date", headerName: "End Date", width: 100 },
    { field: "duration", headerName: "Duration", width: 100 },
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
    await approve_reject(
      x.rows.leave_offs_id,
      x.rows.user_id,
      x.rows.type,
      x.rows.amt_used,
      x.action
    );
    onLoad();
  };

  const handleReject = async (x) => {
    await approve_reject(
      x.rows.leave_offs_id,
      x.rows.user_id,
      x.rows.type,
      x.rows.amt_used,
      x.action
    );
    onLoad();
  };

  const handlePageSizeChange = (newPageSize) => {
    if (newPageSize !== 4) {
      // Reset to 4 rows per page
      this.setState({ pageSize: 4 });
    }
  };

  return (
    <div style={{ height: 320, width: "100%", margin: "0 auto" }}>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.leave_offs_id}
        pageSize={4}
        rowsPerPageOptions={[4]}
        pagination
        disableSelectionOnClick
        hideFooterSelectedRowCount
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
