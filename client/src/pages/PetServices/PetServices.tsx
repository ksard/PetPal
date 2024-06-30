import './PetServices.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { FurCareCenters } from '../../features/PetServices/FurCareCenters';
import { PetGroomingCenters } from '../../features/PetServices/PetGroomingCenters';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import { fetchPetServiceCentersData, getAllAppointments } from './PetCareServices';
import useAuth from '../../hooks/useAuth';
import { YourAppointments } from '../../features/PetServices/YourAppointments';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PetServices = () => {
  const { user } = useAuth();
  const [petServiceCenters, setPetServiceCenters] = useState([]);
  const [petCareAppointments, setPetCareAppointments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPetServiceCentersData();
        setPetServiceCenters(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAllAppointments = async () => {
        try {
          const data = await getAllAppointments(user.email);
          const currentDate = new Date().setHours(0, 0, 0, 0); // Get current date with time set to midnight
          const filteredAppointments = data.filter(appointment => {
            const appointmentDate = new Date(appointment.date).setHours(0, 0, 0, 0);
            return appointmentDate >= currentDate;
          });
          setPetCareAppointments(filteredAppointments);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchAllAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (user) {
      try {
        const data = await getAllAppointments(user.email);
        const currentDate = new Date().setHours(0, 0, 0, 0); // Get current date with time set to midnight
        const filteredAppointments = data.filter(appointment => {
          const appointmentDate = new Date(appointment.date).setHours(0, 0, 0, 0);
          return appointmentDate >= currentDate;
        });
        setPetCareAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getCentersByType = (type: string) => {
    return petServiceCenters.filter(center => center.type === type);
  };

  return (
    <>
      <Box sx={{ width: '100%' }} className="box">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs variant="fullWidth" value={value} onChange={handleChange} centered>
            <Tab label="Furcare Centres" {...a11yProps(0)} />
            <Tab label="Pet Grooming Centers" {...a11yProps(1)} />
            {user &&
              <Tab label="Your Appointments" {...a11yProps(2)} />
            }
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {petServiceCenters.length > 0 ? (
            <FurCareCenters centers={getCentersByType('veterinarian')} refreshAppointments={fetchAppointments}/>
          ) : (
            <p>Loading...</p>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {petServiceCenters.length > 0 ? (
            <PetGroomingCenters centers={getCentersByType('grooming')} refreshAppointments={fetchAppointments}/>
          ) : (
            <p>Loading...</p>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {petCareAppointments.length > 0 ? (
            <YourAppointments appointments={petCareAppointments}/>
          ) : (
            <p className='no-appointments'>You do not have any appointments yet</p>
          )}
        </CustomTabPanel>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default PetServices;
