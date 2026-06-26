"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GridViewIcon from "@mui/icons-material/GridView";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

const drawerWidth = 280;

type Props = {
  children: React.ReactNode;
};

export default function TeacherDashboard({
  children,
}: Props) {
  const router = useRouter();
  const {user}=useContext(AuthContext)!

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function handleLogout() {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      href: "/teacher/dashboard",
    },
    {
      title: "Invite Student",
      icon: <PeopleIcon />,
      href: "/teacher/invite-student",
    },
    {
      title: "Re-invite",
      icon: <AssessmentIcon />,
      href: "/teacher/reinvite",
    },
    {
      title: "Create Quiz",
      icon: <QuizIcon />,
      href: "/teacher/create-quiz",
    },
    {
      title: "All Quizzes",
      icon: <GridViewIcon />,
      href: "/teacher/all-quizzes",
    },
    {
      title: "Upload CSV",
      icon: <UploadFileIcon />,
      href: "/teacher/upload-csv",
    },
    {
      title: "Results",
      icon: <AssessmentIcon />,
      href: "/teacher/results",
    },
  ]

  const drawer = (
  <Box>

    <Toolbar
      sx={{
        justifyContent: "center",
        py: 2,
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          mr: 2,
        }}
      />

      <Box>
        <Typography sx={{fontWeight:600}}>
          Teacher
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
        >
          Quiz Portal
        </Typography>
      </Box>
    </Toolbar>
<Typography sx={{fontWeight:600,textAlign:"center"}}>
          {user?.email}
        </Typography>
    <Divider />

    <List>
      {navItems.map((item) => (
        <ListItem key={item.title} disablePadding>

          <Link
            href={item.href}
            style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItemButton>

              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
              />

            </ListItemButton>

          </Link>

        </ListItem>
      ))}
    </List>

    <Divider sx={{ mt: 2 }} />

    <Box sx={{p:2}}>
      <Button
        fullWidth
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>

  </Box>
);

return (
  <Box sx={{ display: "flex" }}>
    <CssBaseline />

    {/* AppBar */}

    <AppBar
      position="fixed"
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        ml: {
          sm: `${drawerWidth}px`,
        },
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar>

        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: {
              sm: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
          }}
        >
          Teacher Panel
        </Typography>

      </Toolbar>
    </AppBar>

    {/* Sidebar */}

    <Box
      component="nav"
      sx={{
        width: {
          sm: drawerWidth,
        },
        flexShrink: {
          sm: 0,
        },
      }}
    >

      {/* Mobile */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop */}

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

    </Box>

    {/* Main */}

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Toolbar />

      {children}

    </Box>
  </Box>
);
}