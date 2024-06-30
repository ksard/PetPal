import { useState } from 'react';
import {
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Modal,
    Box,
    Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const steps = ['Event Info', 'Location Info', 'Event Pictures'];

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const HostEventForm = ({ open, handleClose, handleSubmit }) => {
    const eventInitialState={
        name: '',
        details: '',
        location: {
            street1: '',
            street2: '',
            city: '',
            zipCode: ''
        },
        date: null,
        time: null,
        pictures: []
    };
    const [activeStep, setActiveStep] = useState(0);
    const [eventInfo, setEventInfo] = useState(eventInitialState);

    
    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const validateStep = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return eventInfo.name && eventInfo.details && eventInfo.date && eventInfo.time;
            case 1:
                return eventInfo.location.street1 && eventInfo.location.city && eventInfo.location.zipCode;
            default:
                return true;
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('location')) {
            const locationField = name.split('.')[1];
            setEventInfo((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    [locationField]: value,
                },
            }));
        } else {
            setEventInfo({
                ...eventInfo,
                [name]: value,
            });
        }
    };

    const handleDateChange = (date) => {

        setEventInfo({ ...eventInfo, date });
    };

    const handleTimeChange = (time) => {
        setEventInfo({ ...eventInfo, time });
    };

    const handleFileChange = (e) => {
        setEventInfo((prevState) => ({
            ...prevState,
            pictures: [...e.target.files],
        }));
    };


    const renderEventInfoForm = () => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Event Name"
                    name="name"
                    value={eventInfo.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="details"
                    label="Event Details"
                    name="details"
                    value={eventInfo.details}
                    onChange={handleChange}
                />
                <DatePicker
                    className="date-picker-event"
                    label="Event Date"
                    value={eventInfo.date}

                    onChange={handleDateChange}
                    sx={{ width: "47.5%", margin: "16px 2.5% 8px 0px" }}
                />
                <TimePicker
                    label="Event Time"
                    name="time"
                    value={eventInfo.time}
                    onChange={handleTimeChange}
                    sx={{ width: "47.5%", margin: "16px 0px 8px 2.5%" }}

                />

            </Box>
        </LocalizationProvider>
    );

    const renderLocationInfoForm = () => (
        <Box component="form" noValidate autoComplete="off">
            <TextField
                margin="normal"
                required
                fullWidth
                id="street1"
                label="Street Address 1"
                name="location.street1"
                value={eventInfo.location.street1}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="street2"
                label="Street Address 2"
                name="location.street2"
                value={eventInfo.location.street2}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="location.city"
                value={eventInfo.location.city}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="zipCode"
                label="Zip Code"
                name="location.zipCode"
                value={eventInfo.location.zipCode}
                onChange={handleChange}
            />
        </Box>
    );

    const renderUploadPictures = () => (
        <Box component="form" noValidate autoComplete="off">
            <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
            >
                Upload Pictures
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
            </Button>
            <Grid container spacing={2}>
                {eventInfo.pictures.length > 0 &&
                    Array.from(eventInfo.pictures).map((file, index) => (
                        <Grid item key={index} xs={6} sm={4}>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return renderEventInfoForm();
            case 1:
                return renderLocationInfoForm();
            case 2:
                return renderUploadPictures();
            default:
                return 'Unknown step';
        }
    };

    const hostAnEvent=()=>{
        handleSubmit(eventInfo);
        setEventInfo(eventInitialState);
        setActiveStep(0);
    }

    const closeModal=()=>{
        setEventInfo(eventInitialState);
        setActiveStep(0)
        handleClose();
    }
    return (
        <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Host an event
                </Typography>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography variant="h6" component="div" gutterBottom>
                                All steps completed
                            </Typography>
                            <Button onClick={handleClose}>Close</Button>
                        </div>
                    ) : (
                        <div>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {activeStep === steps.length - 1 ? (
                                    <Button onClick={hostAnEvent}>Finish</Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        disabled={!validateStep(activeStep)}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </div>
                    )}
                </div>
            </Box>
        </Modal>
    );
};

export default HostEventForm;




