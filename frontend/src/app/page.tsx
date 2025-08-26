'use client';

import { Container, Typography, Box, Paper } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            HR Portal
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
            Human Resources Management System
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" align="center">
              Welcome to the HR Portal. This is a comprehensive system for managing all aspects of human resources.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}