import React, { useState, useEffect } from 'react';
import './CareTakersList.scss';
import image1 from '../../assets/careTaker/1.jpg';
import image2 from '../../assets/careTaker/2.jpg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from '../../components/Buttons/Buttons';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import CustomTextField from './DateFormatField';
import useAuth from '../../hooks/useAuth';
import { fetchCareTakersData, fetchBookingsct } from './PetCareFacilties';
import { createSearchParams, useNavigate } from 'react-router-dom';

interface CareTaker {
    id: number;
    name: string;
    profilePicUrl: string;
}

interface BookingStatus {
    careTakerId: number;
    isBooked: boolean;
}

interface CareTakersListProps {
    onBookNow: (id: number, name: string, date: Dayjs, userEmail: string) => void;
}

const CareTakersList: React.FC<CareTakersListProps> = ({ onBookNow }) => {
    const { user } = useAuth();
    const [careTakers, setCareTakers] = useState<CareTaker[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [bookings, setBookings] = useState<BookingStatus[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCareTakers = async () => {
            try {
                const data = await fetchCareTakersData();

                const formattedData = data.map((careTaker) => ({
                    id: careTaker.id,
                    name: careTaker.name,
                    profilePicUrl: careTaker.gender === 'Male' ? image1 : image2,
                }));
                setCareTakers(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCareTakers();
    }, []);

    useEffect(() => {
        const fetchBookingsForDate = async () => {
            try {
                const bookingPromises = careTakers.map(careTaker =>
                    fetchBookingsct(careTaker.id, selectedDate)
                );

                const results = await Promise.all(bookingPromises);
                setBookings(results);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        if (careTakers.length > 0) {
            fetchBookingsForDate();
        }
    }, [selectedDate, careTakers]);


    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const isBooked = (careTakerId: number) => {
        const booking = bookings.find(booking => booking.careTakerId === careTakerId);
        return booking ? booking.isBooked : false;
    };

    const handleBookNowClick = (careTakerId: number, careTakerName: string) => {
        if (!user) {
            navigate({
                pathname: '/login',
                search: createSearchParams({
                  state: window.location.href,
                }).toString(),
              }); 
              
        }
        else
            onBookNow(careTakerId, careTakerName, selectedDate, user.email);
    };

    return (
        <div className="caretakers-list">
            <h2>Care Takers</h2>
            <label className="date-picker-label">
                Select Date:
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        disablePast
                        slots={{
                            textField: (textFieldProps) => <CustomTextField {...textFieldProps} />
                        }}
                    />
                </LocalizationProvider>
            </label>
            <ul>
                {careTakers.map(careTaker => (
                    <li key={careTaker.id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                alt={`${careTaker.name} Profile`}
                                height="140"
                                image={careTaker.profilePicUrl}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {careTaker.name}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <span className='button-secondary'>
                                    {isBooked(careTaker.id) ? (
                                        <Button className="btn-secondary" disabled>
                                            Booked
                                        </Button>
                                    ) : (
                                        <Button className="btn-secondary" onClick={() => handleBookNowClick(careTaker.id, careTaker.name)}>
                                            Book now
                                        </Button>
                                    )}
                                </span>
                            </CardActions>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CareTakersList;
