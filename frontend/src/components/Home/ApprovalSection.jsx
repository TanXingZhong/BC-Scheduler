import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import LeaveApproval from "./LeaveApproval";
import ScheduleApproval from "./ScheduleApproval";
import ApplicationList from "./ApplicationList";

export default function ApprovalSection() {
  return (
    <>
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
        paddingTop={"20px"}
      >
        Applications
      </Typography>
      <ApplicationList />
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
      >
        Leave Approval
      </Typography>
      <LeaveApproval />
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
        paddingTop={"20px"}
      >
        Schedule Approval
      </Typography>
      <ScheduleApproval />
    </>
  );
}
