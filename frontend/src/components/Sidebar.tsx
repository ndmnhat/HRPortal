'use client';

import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import { HomeIcon, BriefcaseIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { authApi } from '@/services/apiClient';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

const drawerWidth = 240;

export default function Sidebar({ userName = 'User', userEmail = 'user@example.com' }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authApi.authControllerLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon className="h-4 w-4" />, path: '/dashboard' },
    { text: 'Projects', icon: <BriefcaseIcon className="h-4 w-4" />, path: '/dashboard' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#4a4a4a',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff' }}>
          Domain Checker
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, pt: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <UserCircleIcon className="h-12 w-12" />
        <Box>
          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
            {userName}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            Log out
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: '#fff', boxShadow: '0px -1px 1px #fff', mx: 2 }} />

      <List sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              dense={true}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  fontWeight: pathname === item.path ? 500 : 400 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}