import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/joy/Link';

const NotFound = () => {
    return (
    <main>
        <Stack direction="column" height={300} alignItems={"center"} justifyContent={"center"} spacing={4}>
            <Typography 
                variant='h1'
                sx={{
                    color: '#9A5B13',
                    fontSize: "2rem"
                }}>
                Page not found.
            </Typography>
            <Link color='warning' href='/'>{"< Home Page"}</Link>
        </Stack> 
   </main>)
};

export default NotFound;
