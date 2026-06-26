"use client";

import axios from "axios";
import React, { useState } from "react";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
type Props = {
  onSuccess?: () => void;
  onClose: () => void;
};

export default function ReInviteForm({
  onSuccess,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/admin/reinvite",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
  setSuccess(res.data.message);
  setEmail("");

  if (onSuccess) {
    onSuccess();
  }

  onClose(); // Popup close
}
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Something went wrong."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{display:"flex",
      justifyContent:"center",
      alignItems:"center",
      minHeight:"100vh",
      }}
    >
      <Paper
         elevation={8}
  sx={{
    position: "relative",
    width: "100%",
    maxWidth: 450,
    p: 4,
    borderRadius: 3,
  }}
>
        <IconButton
  onClick={onClose}
  sx={{
    position: "absolute",
    top: 10,
    right: 10,
  }}
>
  <CloseIcon />
</IconButton>
        <Typography
          variant="h5"
          sx={{fontWeight:700,textAlign:"center",mb:3}}
        >
          Re-Invite Manager
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Manager Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="warning"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Re-Invitation"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}