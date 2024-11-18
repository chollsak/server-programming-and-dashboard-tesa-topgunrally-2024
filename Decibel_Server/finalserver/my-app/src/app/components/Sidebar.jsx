// components/Sidebar.jsx
'use client';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Insights as InsightsIcon, Sensors as SensorsIcon, FilePresent as FilePresentIcon } from '@mui/icons-material'; // Correct icons
import Link from 'next/link';

export default function Sidebar({ open, toggleSidebar }) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={toggleSidebar}
      sx={{
        width: 240,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#ffffff' },
      }}
    >
      <List>
        <ListItem>
          <Typography variant="h6" className="font-bold text-center">
            DECIBEL
          </Typography>
        </ListItem>
        {[
          { text: 'Insights', icon: <InsightsIcon />, href: '/' },
          { text: 'Sensors', icon: <SensorsIcon />, href: '/predictResult' },
          { text: 'Files', icon: <FilePresentIcon />, href: '/Downloader' } // Use FilePresentIcon as the file icon
        ].map((item) => (
          <Link key={item.text} href={item.href} passHref>
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
