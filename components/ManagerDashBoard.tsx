"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import { IoCloseSharp } from "react-icons/io5";
import ManagerReinvite from "./ManagerReinvite";
import TeacherInviteForm from "./TeacherInviteForm";
import { AuthContext } from "@/context/AuthContext";
type org = {
  id: string;
  max_teacher: number;
  max_student: number;
  title: string;
  status: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  organization: org;
  isDefPassUsed: boolean;
};

export default function ManagerDashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [userList, setUserList] = React.useState<User[]>([]);
  const [editId, setEditId] = React.useState<string | null>(null);
  const router = useRouter();
  const { user, loading, setUser } = React.useContext(AuthContext)!;
  const [pageLoading, setPageLoading] = React.useState(true);
  const [reInvite, setReInvite] = React.useState(false);
  const [inviteTeacher, setInviteTeacher] = React.useState(false);

  async function getUserData() {
    try {
      setPageLoading(true);
      const res = await axios.get("/api/manager/getuser");
      setUserList(res.data.data);
    } catch (error) {
    } finally {
      setPageLoading(false);
    }
  }
  React.useEffect(() => {
    getUserData();
  }, []);
  const handleToggle = async (id: string) => {
    setEditId(id);
    try {
      await axios.post(
        "/api/manager/banusers",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setUserList((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isBanned: !user.isBanned } : user,
        ),
      );
    } finally {
      setEditId(null);
    }
  };

  if (!user && loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (pageLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mr: 4,
            }}
          >
            Manager Panel
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Avatar>{user?.name?.charAt(0).toUpperCase()}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: 3,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manager Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setInviteTeacher(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Invite Teacher
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setReInvite(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Re-Invite
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{
                width: "100%",
                overflow: "hidden",
              }}
            >
              <CardContent>
                <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Organization
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user?.organization.title}
                </Typography>
                <Typography>My Email: {user?.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2}>
              <CardContent>
                <PeopleIcon color="success" sx={{ fontSize: 40 }} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Teachers
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user?.organization.max_teacher}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2}>
              <CardContent>
                <SchoolIcon color="warning" sx={{ fontSize: 40 }} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Students
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user?.organization.max_student}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            mt: 5,
          }}
        >
          <Card
            elevation={2}
            sx={{
              width: "100%",
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 5 }}>
                Teachers & Students
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  overflowX: {
                    xs: "auto",
                    sm: "auto",
                    md: "hidden",
                  },
                }}
              >
                <Table
                  stickyHeader
                  sx={{
                    width: {
                      xs: "1100px",
                      sm: "1100px",
                      md: "100%",
                    },
                    tableLayout: "fixed",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 80 }}>
                        <strong>ID</strong>
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell sx={{ width: 130 }}>
                        <strong>Role</strong>
                      </TableCell>
                      <TableCell sx={{ width: 280 }}>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell sx={{ width: 180 }}>
                        <strong>Invitation</strong>
                      </TableCell>
                      <TableCell sx={{ width: 150 }}>
                        <strong>Action</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : userList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No user found
                        </TableCell>
                      </TableRow>
                    ) : (
                      userList &&
                      userList.map((user) => (
                        <TableRow hover key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isDefPassUsed ? "Accepted" : "Not Accepted"}
                          </TableCell>
                          <TableCell>
                            <Button
                              disabled={loading && editId === user.id}
                              onClick={() => handleToggle(user.id)}
                            >
                              {loading && editId === user.id
                                ? "Updating..."
                                : user.isBanned
                                  ? "Unban"
                                  : "Ban"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          {children}
        </Box>
        {inviteTeacher && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
            <IoCloseSharp
              onClick={() => setInviteTeacher(false)}
              className="absolute top-8 right-8 text-4xl cursor-pointer"
            />
            <TeacherInviteForm
              onSuccess={() => {
                setInviteTeacher(false);
                getUserData();
              }}
              onClose={() => setInviteTeacher(false)}
            />
          </div>
        )}
        {reInvite && (
          <div className="fixed inset-0 mt-15 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
            <IoCloseSharp
              onClick={() => setReInvite(false)}
              className="absolute top-8 right-8 text-4xl cursor-pointer"
            />
            <ManagerReinvite
              onSuccess={() => {
                setReInvite(false);
              }}
            />
          </div>
        )}
      </Box>
    </Box>
  );
}
