import React from "react";
import { Box } from "@mui/material";
import AdminMenu from "../components/admin/AdminMenu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Box>
      <AdminMenu />
      <Box
        sx={{
          mt: { xs: 11, sm: 12, md: 15 },
          mx: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
