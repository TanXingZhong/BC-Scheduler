import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import LogoutButton from "./LogoutButton";
import { useUserInfo } from "../hooks/useUserInfo";
import logo2 from "../img/logo2.png";
const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { name, email } = useUserInfo();
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Vertically centers the items
          justifyContent: "center", // Horizontally centers the items
          fontWeight: "bold",
          fontSize: "1",
        }}
      >
        <h1 style={{ marginRight: "1px" }}>Burnt Cones</h1>
        <img src={logo2} alt="logo" style={{ width: "40px" }} />
      </Box>

      <Divider />
      <MenuContent />
      {/* <CardAlert /> */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {email}
          </Typography>
        </Box>
        <LogoutButton />
      </Stack>
    </Drawer>
  );
}
