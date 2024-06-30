import React from 'react';
import './Card.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Cards = ({ message }) => {

  const navigate = useNavigate();
  const handleClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={message.bannerUrl}
          alt="image not found"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <span className='card-title'>{message.title}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span className='card-description'>{message.description}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => handleClick(message.route)}>
          Explore
        </Button>
      </CardActions>
    </Card>
  )
}