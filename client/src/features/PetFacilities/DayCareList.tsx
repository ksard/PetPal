import React, { useState, useEffect } from 'react';
import './DayCareList.scss';
import image1 from '../../assets/dayCare/1.jpg';
import image2 from '../../assets/dayCare/2.jpg';
import image3 from '../../assets/dayCare/3.jpg';
import image4 from '../../assets/dayCare/4.jpg';
import image5 from '../../assets/dayCare/5.jpg';
import image6 from '../../assets/dayCare/6.jpg';
import image7 from '../../assets/dayCare/7.jpg';
import image8 from '../../assets/dayCare/8.jpg';
import image9 from '../../assets/dayCare/9.jpg';
import image10 from '../../assets/dayCare/10.jpg';
import image11 from '../../assets/dayCare/11.jpg';
import image12 from '../../assets/dayCare/12.jpg';
import image13 from '../../assets/dayCare/13.jpg';
import image14 from '../../assets/dayCare/14.jpg';
import image15 from '../../assets/dayCare/15.jpg';
import image16 from '../../assets/dayCare/16.jpg';
import image17 from '../../assets/dayCare/17.jpg';
import image18 from '../../assets/dayCare/18.jpg';
import image19 from '../../assets/dayCare/19.jpg';
import image20 from '../../assets/dayCare/20.jpg';
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
import useAuth from '../../hooks/useAuth';
import { fetchDayCaresData, fetchBookings } from './PetCareFacilties';
import { createSearchParams, useNavigate } from 'react-router-dom';

interface DayCare {
    id: string;
    name: string;
    slots: number;
    bannerUrl: string;
}

interface DayCareListProps {
    onBookNow: (id: number, name: string, date: Dayjs, userEmail: string) => void;
}

const DayCareList: React.FC<DayCareListProps> = ({ onBookNow }) => {
    const [dayCares, setDayCares] = useState<DayCare[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const { user } = useAuth();
    const imageMap: { [key: string]: string } = {
        'image1': image1,
        'image2': image2,
        'image3': image3,
        'image4': image4,
        'image5': image5,
        'image6': image6,
        'image7': image7,
        'image8': image8,
        'image9': image9,
        'image10': image10,
        'image11': image11,
        'image12': image12,
        'image13': image13,
        'image14': image14,
        'image15': image15,
        'image16': image16,
        'image17': image17,
        'image18': image18,
        'image19': image19,
        'image20': image20,
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDayCares = async () => {
            try {
                const response = await fetchDayCaresData();
                const data = response?.data || [];

                const formattedData = data.map((dayCare: any) => ({
                    id: dayCare.id,
                    name: dayCare.name,
                    slots: dayCare.slots,
                    bannerUrl: imageMap[dayCare.image] || image1,
                }));
                setDayCares(formattedData);
            } catch (error) {
                console.error('Error fetching daycares:', error);
            }
        };

        fetchDayCares();
    }, []);

    useEffect(() => {
        const fetchBookingsForDate = async () => {
            try {
                const bookingPromises = dayCares.map(dayCare =>
                    fetchBookings(dayCare.id, selectedDate)
                );

                const results = await Promise.all(bookingPromises);
                const updatedDayCares = dayCares.map(dayCare => {
                    const bookingInfo = results.find(result => result.id === dayCare.id);
                    const availableSlots = dayCare.slots - (bookingInfo ? bookingInfo.bookingCount : 0);
                    return { ...dayCare, slots: availableSlots };
                });

                setDayCares(updatedDayCares);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        if (dayCares.length > 0 && selectedDate) { // Check if dayCares and selectedDate are not null/undefined
            fetchBookingsForDate();
        }
    }, [selectedDate]);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleBookNowClick = (id: string, name: string) => {
        if (user && user.email) {
            onBookNow(parseInt(id), name, selectedDate, user.email);
        } else {
            navigate({
                pathname: '/login',
                search: createSearchParams({
                    state: window.location.href,
                }).toString(),
            });
        }
    };

    return (
        <div className="daycare-list">
            <h2>Day Care Centers</h2>
            <label className="date-picker-label">
                Select Date:
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        disablePast
                    />
                </LocalizationProvider>
            </label>
            <ul>
                {dayCares.map(dayCare => (
                    <li key={dayCare.id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                alt={`${dayCare.name} Banner`}
                                height="140"
                                image={dayCare.bannerUrl}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {dayCare.name}
                                </Typography>
                                Slots available: {dayCare.slots}
                            </CardContent>
                            <CardActions>
                                <span className='button-secondary'>
                                    {dayCare.slots > 0 ? (
                                        <Button className="btn-secondary" onClick={() => handleBookNowClick(dayCare.id, dayCare.name)}>
                                            Book now
                                        </Button>
                                    ) : (
                                        <Button className="btn-secondary" disabled>
                                            Booked
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

export default DayCareList;
