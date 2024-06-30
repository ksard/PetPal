import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import './BookingFormDC.scss';
import { Button } from '../../components/Buttons/Buttons';
import { Dayjs } from 'dayjs';
import { confirmDaycareBooking } from './PetCareFacilties';

interface BookingFormDCProps {
    bookingId: number;
    bookingName: string;
    onOkClick: () => void;
    selectedDate: Dayjs;
    userEmail: string;
}

const BookingFormDC: React.FC<BookingFormDCProps> = ({ bookingId, bookingName, onOkClick, selectedDate, userEmail }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bdate: selectedDate,
        email: '',
        phone: '',
        petType: '',
        address: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            bdate: selectedDate,
            email: userEmail || ''
        }));
    }, [selectedDate, userEmail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dayCareId = bookingId;
        try {
            await confirmDaycareBooking({
                dayCareId,
                userEmail,
                formData,
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    if (isSubmitted) {
        return (
            <div className="booking-form-dc booking-confirmed">
                <h2>Booking Confirmed</h2>
                <p>Thank you for your booking. Here are the details:</p>
                <ul>
                    <li><strong>First Name:</strong> {formData.firstName}</li>
                    <li><strong>Last Name:</strong> {formData.lastName}</li>
                    <li><strong>Booking Date:</strong> {formData.bdate?.format('DD-MM-YYYY')}</li>
                    <li><strong>Email:</strong> {formData.email}</li>
                    <li><strong>Phone:</strong> {formData.phone}</li>
                    <li><strong>Pet Type:</strong> {formData.petType}</li>
                    <li><strong>Address:</strong> {formData.address}</li>
                </ul>
                <div className="form-group button-group">
                    <Button className="btn-secondary" onClick={onOkClick}>
                        OK
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-form-dc">
            <h2>Booking Form for DayCare: {bookingName}</h2>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className="form-fields">
                    <div >
                        <TextField
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Booking Date"
                            id="bdate"
                            name="bdate"
                            value={formData.bdate.format('DD-MM-YYYY')}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                readOnly: true,
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        />
                    </div>
                    <div>
                        <TextField
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Phone"
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Pet Type"
                            id="petType"
                            name="petType"
                            value={formData.petType}
                            onChange={handleChange}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Address"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            sx={{ m: 1, width: '52ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            multiline
                            rows={4}
                            required
                        />
                    </div>
                </Box>
                <div className="form-group button-group">
                    <Button className="btn-secondary" type="submit">
                        Confirm
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BookingFormDC;
