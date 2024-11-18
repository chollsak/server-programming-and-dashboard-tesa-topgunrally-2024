// IoTDashboard.js
'use client';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Box, Grid, Card } from '@mui/material';
import MachineData from './components/MachineData';
import Sidebar from './components/Sidebar';
import Value from './components/Value';

export default function IoTDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#f16529' }}>
          <Toolbar>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box
                component="img"
                src="https://foodindustry.kmitl.ac.th/sites/default/files/inline-images/2Main%20Logo%20KMITL_Eng%20Orange.png"
                alt="KMITL Logo"
                sx={{ width: 50, height: 'auto' }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <div className="p-8">
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Card className="rounded-md shadow-md">
                <MachineData />
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
