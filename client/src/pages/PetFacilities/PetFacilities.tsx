import React, { useState } from 'react';
import DayCareList from '../../features/PetFacilities/DayCareList';
import CareTakersList from '../../features/PetFacilities/CareTakersList';
import BookingFormDC from '../../features/PetFacilities/BookingFormDC';
import BookingForm from '../../features/PetFacilities/BookingForm';
import YourBookings from '../../features/PetFacilities/YourBooking';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Dayjs } from 'dayjs';
import './PetFacilities.scss';
import useAuth from '../../hooks/useAuth';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
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

const PetFacilities: React.FC = () => {
    const [value, setValue] = useState(0);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [bookingName, setBookingName] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const { user } = useAuth();

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleBookNow = (id: number, name: string, date: Dayjs, email: string, bookingType: 'daycare' | 'caretaker') => {
        setBookingId(id);
        setBookingName(name);
        setSelectedDate(date);
        setUserEmail(email);
    };

    const handleOkClick = () => {
        setBookingId(null);
        setBookingName(null);
        setSelectedDate(null);
    };

    if (bookingId && selectedDate && userEmail) {
        if (value === 0) {
            // Render daycare booking form
            return <BookingFormDC bookingId={bookingId} bookingName={bookingName} onOkClick={handleOkClick} selectedDate={selectedDate} userEmail={userEmail} />;
        } else if (value === 1) {
            // Render caretaker booking form
            return <BookingForm bookingId={bookingId} bookingName={bookingName} onOkClick={handleOkClick} selectedDate={selectedDate} userEmail={userEmail} />;
        }
    }

    return (
        <div className="pet-facilities">
            <h1>Pet Facilities</h1>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Day Care" {...a11yProps(0)} />
                    <Tab label="Care Takers" {...a11yProps(1)} />
                    {user && <Tab label="Your Bookings" {...a11yProps(2)} />}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DayCareList onBookNow={(id, name, date, email) => handleBookNow(id, name, date, email, 'daycare')} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CareTakersList onBookNow={(id, name, date, email) => handleBookNow(id, name, date, email, 'caretaker')} />
            </TabPanel>
            {user && (
                <TabPanel value={value} index={2}>
                    <YourBookings userEmail={user.email} />
                </TabPanel>
            )}
        </div>
    );
};

export default PetFacilities;
