import { Avatar, AvatarGroup, Box, ImageList, ImageListItem, Modal, Typography, Tooltip } from '@mui/material';
import { Button } from '../../components/Buttons/Buttons';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ViewEvent = (props) => {
    const { event, open, handleClose, attending, hosting, handleAttendClick } = props;

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    // Calculate the number of columns based on the number of images
    const numCols = event?.pictures?.length >= 3 ? 3 : event?.pictures?.length;

    // Concatenate the address fields
    const fullAddress = [event?.location?.street1, event?.location?.street2, event?.location?.city, event?.location?.zipcode].filter(Boolean).join(', ');

    // Determine if the location text is too long
    const isLocationLong = fullAddress.length > 40; // Adjust the length as needed

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
                    {event.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{width:"50%"}}>
                        {new Date(event.date).toLocaleDateString()} {event.time}
                    </Typography>
                    <Tooltip title={fullAddress} disableHoverListener={!isLocationLong}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" sx={{ marginLeft: '8px' }} />
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                component="div"
                                sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }} // Adjust maxWidth as needed
                            >
                                {fullAddress}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Box>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Avatar
                        alt={event.hostedBy.name}
                        src={event.hostedBy.picture}
                        sx={{ width: 26, height: 26 }}
                    />
                    <Typography component="div" variant="body2" sx={{ fontWeight: 'normal' }}>
                        Hosted By
                    </Typography>
                    <Typography component="div" variant="body2" sx={{ fontWeight: 'bold' }}>
                        {event.hostedBy.name}
                    </Typography>
                </div>

                <ImageList sx={{ width: '100%', height: 'auto' }} cols={numCols} rowHeight={164}>
                    {event.pictures.map((item, index) => (
                        <ImageListItem key={index} cols={1}>
                            <img
                                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                                alt={event.name}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Typography component="div" variant="body2" sx={{ fontWeight: 'normal', marginTop: 2 }}>
                    {event.details}
                </Typography>
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    {!attending && !hosting && (
                        <Button className="btn-secondary" onClick={handleAttendClick}>
                            Attend
                        </Button>
                    )}
                    {attending && !hosting && (
                        <Button className="btn-secondary" disabled={true}>
                            Attending
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default ViewEvent;
