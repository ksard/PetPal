import { Card, CardContent, CardMedia, Typography, Box, Tooltip, CardActions, AvatarGroup, Avatar } from '@mui/material';
import { Button } from '../../components/Buttons/Buttons';
import { attendEvent } from '../../pages/Events/EventsService';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import ViewEvent from './ViewEvent';
import { notifySuccess } from '../../components/Toaster/Toaster';
import { createSearchParams, useNavigate } from 'react-router-dom';

const EventCard = (props) => {
  const { user } = useAuth();
  const [event, setEvent] = useState({
    attendees: [],
    details: "",
    name: "",
    date: new Date(),
    time: "",
    pictures: [],
    hostedBy: {
      email: ""
    }
  })
  const [attending, setAttending] = useState(false);
  const [hosting, setHosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let { event } = props;
    setEvent(event);
  }, [])

  useEffect(() => {
    if (user && event) {
      checkAttending();
      checkHosting();
    }
  }, [event, user])

  const checkHosting = () => {
    if (event?.hostedBy?.email === user?.email) {
      setHosting(true);
    }
  }
  const checkAttending = () => {
    event.attendees?.map((a) => {
      if (a.email === user?.email) {
        setAttending(true);
      }
    });
  }

  const handleAttendClick = async () => {
    if (user) {
      const res = await attendEvent(event);
      if (res) {
        notifySuccess("Attending the event!")
        setEvent(res);
      }
      else {
        notifySuccess("Failed to update status!")
      }
    }
    else
    {
      navigate({
        pathname: '/login',
        search: createSearchParams({
          state: window.location.href,
        }).toString(),
      });  
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <><Box sx={{ mb: 2 }} onClick={handleOpenModal}>
      {event && (
        <Card sx={{ display: 'flex' }}>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={event.pictures?.[0] || "/src/assets/shelter.jpg"}
            alt={event.name} />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent>
              <Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {event.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                {new Date(event.date).toLocaleDateString()} {event.time}
              </Typography>
              <Tooltip title={event.details || "No details available"} placement="top" arrow>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                  sx={{
                    mt: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2, // Adjust the number of lines as needed
                    maxWidth: '400px' // Adjust the width as needed
                  }}
                >
                  {event.details}
                </Typography>
              </Tooltip>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                  {event.attendees.map((attendee, index) => (
                    <Avatar
                      alt={attendee.name}
                      src={attendee.picture}
                      key={index}
                      sx={{ width: 24, height: 24 }}
                    />
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary" component="div">
                  {event.attendees ? event.attendees.length : 0} attendees
                </Typography>
              </div>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end", marginRight: "4%" }}>
              {!attending && !hosting && <Button className='btn-secondary' onClick={handleAttendClick}>Attend</Button>}
              {attending && !hosting && <Button className='btn-secondary' disabled={true}>Attending</Button>}

            </CardActions>
          </Box>
        </Card>
      )}
    </Box><ViewEvent open={isModalOpen} handleClose={handleCloseModal} event={event} attending={attending} hosting={hosting} handleAttendClick={handleAttendClick}></ViewEvent></>
  );
};

export default EventCard;
