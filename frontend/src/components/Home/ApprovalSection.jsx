import Typography from "@mui/material/Typography";
import LeaveApproval from "./LeaveApproval";
import ScheduleApproval from "./ScheduleApproval";
import ApplicationList from "./ApplicationList";
import LeaveApplicationList from "./LeaveApplicationList";
import { useUserInfo } from "../../hooks/useUserInfo";

export default function ApprovalSection() {
  const { admin } = useUserInfo();
  return (
    <>
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
      >
        Your Leave Application
      </Typography>
      <LeaveApplicationList />
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "600" }}
        paddingTop={"20px"}
      >
        Your Shift Applications
      </Typography>
      <ApplicationList />
      {admin ? (
        <Box>
          <Typography
            component="h2"
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "600" }}
            paddingTop={"20px"}
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
        </Box>
      ) : null}
    </>
  );
}
