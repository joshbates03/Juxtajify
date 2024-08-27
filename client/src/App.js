import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function App() {
  const [inputText, setInputText] = useState('');
  const [slugText, setSlugText] = useState('');
  const [receivedText, setReceivedText] = useState('');

  const handleClick = async () => {
    if (inputText === '') {
      return;
    }
    sendURL(inputText, slugText);


  };


  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  };

  const sendURL = async (url, slug) => {

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (!isValidURL(url)) {
      setReceivedText('Invalid URL');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, slug }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setReceivedText(responseData);
        setSlugText('')
        setInputText('')

      } else {
        setReceivedText('Alias unavailable');
        setSlugText('')

      }
    } catch (error) {
      console.error('Error storing in the database.', error);
      setReceivedText('Error storing the URL');
    }
  };


  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #9C27B0, #2196F3)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow={3}
          bgcolor="white"
          p={4}
          borderRadius={6}

        >
          <Typography variant="h4" component="h1" mb={4} fontWeight="bold" color={'black'}>
            JuxtaJify
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              type="text"
              placeholder="https://example.com"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              mb={2}
              sx={{
                borderRadius: '16px',
                marginRight: '10px',

              }}
            />
            <TextField
              type="text"
              placeholder="/alias"
              value={slugText}
              onChange={(e) => setSlugText(e.target.value)}
              mb={2}
              sx={{ borderRadius: '16px', width: '150px', marginRight: '10px' }}
            />


            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                borderRadius: '16px',
                height: '55px'
              }}
            >
              JuxtaJify
            </Button>
          </Box>
          <a href={receivedText === 'Alias unavailable' ? null : receivedText} target="_blank" rel="noopener noreferrer">
            <Typography
              sx={{
                marginTop: 4,
                fontWeight: 'light',
                color: receivedText === 'Alias unavailable' ? 'red' : 'green',
              }}
            >
              {receivedText}
            </Typography>
          </a>

        </Box>
      </Container>
    </div>
  );
}

export default App;
