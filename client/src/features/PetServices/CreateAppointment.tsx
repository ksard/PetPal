import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Modal,
  Box,
  Grid,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { getAvailableSlots, bookPetCareAppointment } from '../../pages/PetServices/PetCareServices';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './CreateAppointment.scss';
import { notifySuccess, notifyError } from '../../components/Toaster/Toaster';
import useAuth from '../../hooks/useAuth';
const steps = ['Owner Info', 'Pet Info', 'Book a Slot', 'Confirm Booking'];

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

const CreateAppointment = ({ open, handleClose, serviceCenter }) => {
  const { user } = useAuth();
  const center = serviceCenter;
  const [activeStep, setActiveStep] = useState(0);
  const [ownerInfo, setOwnerInfo] = useState({
    fName: '',
    lName: '',
    phoneNumber: '',
    email: '',
  });
  const [petInfo, setPetInfo] = useState({
    petName: '',
    species: '',
    breed: '',
    weight: '',
    medicalHistory: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  useEffect(() => {
    if (user) {
      setOwnerInfo((prevInfo) => ({
        ...prevInfo,
        email: user.email,
      }));
    }
  }, [user]);


  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!open) {
      resetBookingForm();
    }
  }, [open]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await getAvailableSlots(serviceCenter._id, selectedDate.toISOString().split('T')[0])
      setAvailableSlots(response);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
  };

  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return ownerInfo.fName && ownerInfo.lName && ownerInfo.phoneNumber && ownerInfo.email;
      case 1:
        return petInfo.petName && petInfo.species && petInfo.weight;
      case 2:
        return selectedDate && selectedSlot;
      default:
        return true;
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetBookingForm = () => {
    setActiveStep(0);
    setOwnerInfo({
      fName: '',
      lName: '',
      phoneNumber: '',
      email: user? user.email : '',
    });
    setPetInfo({
      petName: '',
      species: '',
      breed: '',
      weight: '',
      medicalHistory: '',
    });
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
  };
  const handleBookingSubmit = async () => {
    const bookingDetails = {
      centerId: center._id,
      centerName: center.name,
      centerAddress: center.address,
      centerType: center.type,
      date: selectedDate.toISOString().split('T')[0],
      slot: selectedSlot,
      ownerInfo,
      petInfo,
    }
    
    try {
      const response = await bookPetCareAppointment(bookingDetails)
      if(response.data == 'Booking confirmed') {
        notifySuccess(response.data);
        handleClose();
      }
      else {
        notifyError(response.data);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const renderOwnerInfoForm = () => (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        margin="normal"
        required
        fullWidth
        id="fName"
        label="First Name"
        name="fName"
        value={ownerInfo.fName}
        onChange={(e) => setOwnerInfo({ ...ownerInfo, fName: e.target.value })}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lName"
        label="Last Name"
        name="lName"
        value={ownerInfo.lName}
        onChange={(e) => setOwnerInfo({ ...ownerInfo, lName: e.target.value })}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="phoneNumber"
        label="Phone Number"
        name="phoneNumber"
        value={ownerInfo.phoneNumber}
        onChange={(e) =>
          setOwnerInfo({ ...ownerInfo, phoneNumber: e.target.value })
        }
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        value={ownerInfo.email}
        disabled={true}
        onChange={(e) => setOwnerInfo({ ...ownerInfo, email: e.target.value })}
      />
    </Box>
  );

  const renderPetInfoForm = () => (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        margin="normal"
        required
        fullWidth
        id="petName"
        label="Pet Name"
        name="petName"
        value={petInfo.petName}
        onChange={(e) => setPetInfo({ ...petInfo, petName: e.target.value })}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="species"
        label="Species"
        name="species"
        value={petInfo.species}
        onChange={(e) => setPetInfo({ ...petInfo, species: e.target.value })}
      />
      <TextField
        margin="normal"
        fullWidth
        id="breed"
        label="Breed (Optional)"
        name="breed"
        value={petInfo.breed}
        onChange={(e) => setPetInfo({ ...petInfo, breed: e.target.value })}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="weight"
        label="Weight"
        name="weight"
        value={petInfo.weight}
        onChange={(e) => setPetInfo({ ...petInfo, weight: e.target.value })}
      />
      <TextField
        margin="normal"
        fullWidth
        id="medicalHistory"
        label="Medical History (Optional)"
        name="medicalHistory"
        value={petInfo.medicalHistory}
        onChange={(e) =>
          setPetInfo({ ...petInfo, medicalHistory: e.target.value })
        }
      />
    </Box>
  );

  const renderBookSlotForm = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" noValidate autoComplete="off">
        <DatePicker
          className='date-picker'
          label="Appointment Date"
          value={selectedDate}
          onChange={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null); // Reset selected slot when date changes
            }}
        />
        {selectedDate && (
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              Available Slots
            </Typography>
            <Grid container spacing={2}>
              {availableSlots.map((slot) => (
                <Grid item key={slot}>
                  <Button
                      variant={selectedSlot === slot ? 'contained' : 'outlined'}
                      onClick={() => setSelectedSlot(slot)}
                    >
                    {slot}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </Box>
    </LocalizationProvider>
  );

  const renderConfirmationBlock = () => (
    <Box component="div">
      <Typography variant="h6" component="div" gutterBottom>
        Confirmation
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Pet Owner:</strong> {`${ownerInfo.fName} ${ownerInfo.lName}, ${ownerInfo.email}, ${ownerInfo.phoneNumber}`}
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Pet Info:</strong> {`${petInfo.petName}, ${petInfo.species} (${petInfo.breed}), ${petInfo.weight}kg`}
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Medical History:</strong> {petInfo.medicalHistory || 'No medical history'}
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Center:</strong> {`Center Name, Location`} {/* Replace with actual center details if available */}
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Booking Date:</strong> {selectedDate?.format('YYYY-MM-DD')}
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        <strong>Selected Slot:</strong> {selectedSlot}
      </Typography>
    </Box>
  );

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return renderOwnerInfoForm();
      case 1:
        return renderPetInfoForm();
      case 2:
        return renderBookSlotForm();
      case 3:
        return renderConfirmationBlock();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Book an Appointment
        </Typography>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
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
                  <Button onClick={handleBookingSubmit}>Confirm Booking</Button>
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

export default CreateAppointment;
