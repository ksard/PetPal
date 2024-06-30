import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import './FurCareCenters.scss';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreateAppointment from './CreateAppointment';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { createSearchParams, useNavigate } from 'react-router-dom';

export const FurCareCenters = ({ centers, refreshAppointments }) => {
  return (
    <div className='section-cards-container'>
      {centers.map((center, i) => (
        <Cards center={center} refreshAppointments={refreshAppointments} key={i} />
      ))}
    </div>
  );
}

const Cards = ({ center, refreshAppointments }) => {
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    refreshAppointments();
    setIsModalOpen(false);
  };

  const goToLogin = () => {
    navigate({
      pathname: '/login',
      search: createSearchParams({
        state: window.location.href,
      }).toString(),
    });
  }
  
  return (
    <Card sx={{ width: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={center.logo}
          alt="image not found"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {center.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          <div className='section-data'><LocationOnIcon /> <span className='text-align'>{center.address}</span></div>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <div className='section-data'><AccessTimeIcon /> <span className='text-align'>{center.operating_hours}</span></div>
          </Typography>
          <Typography variant="body2" color="text.secondary">
          <div className='section-data'><StarIcon/> <span className='text-align'>{center.ratings}/5</span></div>
          </Typography>
          <Typography variant="body2" color="text.secondary">
          <div className='section-data'><VerifiedIcon /> <span className='text-align'>{center.specialties.join(', ')}</span></div>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
      {user ? (
        <Button size="small" color="primary" onClick={handleOpenModal}>
          Book Appointment
        </Button>
      ) : (
        <Button size="small" color="primary" onClick={goToLogin}>
          Login to book an Appointment
        </Button>
      )}
        <CreateAppointment open={isModalOpen} handleClose={handleCloseModal} serviceCenter={center}/>
      </CardActions>
    </Card>
  );
}
