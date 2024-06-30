import React, { useState, useEffect } from 'react';
import './YourBooking.scss';
import { List, ListItemText, ListItemButton } from '@mui/material';
import { fetchDayCareDetails, fetchCareTakerDetails, getBookingsuser } from './PetCareFacilties';

interface Booking {
    careTakerId?: number;
    dayCareId?: number;
    userEmail: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    typeOfPet: string;
    address: string;
}

interface YourBookingsProps {
    userEmail: string;
}

const YourBookings: React.FC<YourBookingsProps> = ({ userEmail }) => {
    const [selectedTab, setSelectedTab] = useState<'daycare' | 'caretakers'>('daycare');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingDetails, setBookingDetails] = useState<{ [key: number]: string }>({});

    

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getBookingsuser(selectedTab, userEmail);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [selectedTab, userEmail]);


    const fetchBookingDetails = async (booking) => {
        try {
            let detail = '';
            if (selectedTab === 'daycare' && booking.dayCareId) {
                detail = await fetchDayCareDetails(booking.dayCareId);
            } else if (selectedTab === 'caretakers' && booking.careTakerId) {
                detail = await fetchCareTakerDetails(booking.careTakerId);
            }
            setBookingDetails(prevDetails => ({
                ...prevDetails,
                [selectedTab === 'daycare' ? booking.dayCareId! : booking.careTakerId!]: detail
            }));
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    useEffect(() => {
        bookings.forEach(booking => {
            fetchBookingDetails(booking);
        });
    }, [selectedTab, bookings]);

    return (
        <div className="your-bookings">
            <div className="bookings-container">
                <div className="categories">
                    <List component="nav">
                        <ListItemButton onClick={() => setSelectedTab('daycare')} selected={selectedTab === 'daycare'}>
                            <ListItemText primary="Day Cares" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setSelectedTab('caretakers')} selected={selectedTab === 'caretakers'}>
                            <ListItemText primary="Care Takers" />
                        </ListItemButton>
                    </List>
                </div>
                <div className="bookings-list">
                    {bookings.map((booking, index) => (
                        <div key={index} className="booking-item">
                            <p><strong>Name:</strong> {bookingDetails[selectedTab === 'daycare' ? booking.dayCareId! : booking.careTakerId!] || 'Loading...'}</p>
                            <p><strong>First Name:</strong> {booking.firstName}</p>
                            <p><strong>Last Name:</strong> {booking.lastName}</p>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Phone:</strong> {booking.phone}</p>
                            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                            <p><strong>Type of Pet:</strong> {booking.typeOfPet}</p>
                            <p><strong>Address:</strong> {booking.address}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YourBookings;
