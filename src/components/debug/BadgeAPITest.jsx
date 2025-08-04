import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Alert, Card, CardContent, Grid, Box } from '@mui/material';
import badgeService from '../api/badgeService';
import { baseApiUrl } from '../api/axios';

/**
 * Test component to verify the new Badge API functionality
 */
export default function BadgeAPITest() {
  const [badges, setBadges] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const testGetMyBadges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await badgeService.getMyBadges();
      
      if (result.success) {
        setBadges(result.badges);
        setUserInfo(result.data);
        setSuccess(true);
        console.log('API Response:', result.data);
      } else {
        setError(`API Error: ${result.error}`);
      }
    } catch (error) {
      setError(`Network Error: ${error.message}`);
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto test when component mounts
    testGetMyBadges();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Badge API Test - /api/Badge/get-my-badges
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testGetMyBadges}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? 'Testing...' : 'Test API'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          API call successful! Retrieved {badges.length} badges.
        </Alert>
      )}

      {userInfo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography><strong>User ID:</strong> {userInfo.userId}</Typography>
            <Typography><strong>Username:</strong> {userInfo.username}</Typography>
            <Typography><strong>Full Name:</strong> {userInfo.fullName}</Typography>
            <Typography><strong>Score:</strong> {userInfo.score}</Typography>
            {userInfo.avatarUrl && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={`${baseApiUrl}${userInfo.avatarUrl}`} 
                  alt="Avatar" 
                  style={{ width: 60, height: 60, borderRadius: '50%' }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {badges.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Badges ({badges.length})
            </Typography>
            <Grid container spacing={2}>
              {badges.map((badge, index) => (
                <Grid item xs={12} sm={6} md={4} key={badge.badgeId || index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box textAlign="center">
                        {badge.iconUrl && (
                          <img 
                            src={`${baseApiUrl}${badge.iconUrl}`}
                            alt={badge.name}
                            style={{ 
                              width: 80, 
                              height: 80, 
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {badge.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Badge ID: {badge.badgeId}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {badges.length === 0 && success && (
        <Alert severity="info">
          No badges found for this user.
        </Alert>
      )}

      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          API Endpoint Information
        </Typography>
        <Typography variant="body2" component="pre">
{`Endpoint: GET /api/Badge/get-my-badges
Headers: Authorization: Bearer <token>

Expected Response:
{
  "userId": number,
  "username": string,
  "fullName": string,
  "avatarUrl": string,
  "score": number,
  "badges": [
    {
      "badgeId": number,
      "name": string,
      "iconUrl": string
    }
  ]
}`}
        </Typography>
      </Box>
    </Container>
  );
}
