import dayjs from "dayjs";
import http from "../../services/Http";

export const fetchDayCaresData = async () => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/dayCares`);
        
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchBookings = async (dayCareId, selectedDate) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/dcbookings/${selectedDate.format('YYYY-MM-DD')}/${dayCareId}`);
        const bookingCount = response.data.bookingCount;
        return { id: dayCareId, bookingCount };
    } catch (error) {
        console.error(`Error fetching bookings for daycareId ${dayCareId}:`, error);
        return { id: dayCareId, bookingCount: 0 };
    }
};

export const fetchCareTakersData = async () => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/caretakers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export const fetchBookingsct = async (careTakerId, selectedDate) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/bookings/${selectedDate.format('YYYY-MM-DD')}/${careTakerId}`);
        const data = response.data;
        return { careTakerId, isBooked: data.isBooked };
    } catch (error) {
        console.error(`Error fetching bookings for careTakerId ${careTakerId}:`, error);
        return { careTakerId, isBooked: false };
    }
};

export const fetchDayCareDetails = async (dayCareId) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/dayCareByID/${dayCareId}`);
        return response.data.daycare.name;
    } catch (error) {
        console.error(`Error fetching daycare details for ID ${dayCareId}:`, error);
        return '';
    }
};

export const fetchCareTakerDetails = async (careTakerId) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/careTakerByID/${careTakerId}`);
        return response.data.caretaker.name;
    } catch (error) {
        console.error(`Error fetching caretaker details for ID ${careTakerId}:`, error);
        return '';
    }
};

export const getBookingsuser = async (selectedTab, userEmail) => {
    let url = '';
    if (selectedTab === 'daycare') {
        url = `${process.env.REACT_APP_SERVER_URL}/api/dcbookingsuseremail/${userEmail}`;
    } else {
        url = `${process.env.REACT_APP_SERVER_URL}/api/bookingsuseremail/${userEmail}`;
    }

    return http.get(url);
};

export const confirmDaycareBooking = async ({ dayCareId, userEmail, formData }) => {
    try {
        await http.post(`${process.env.REACT_APP_SERVER_URL}/api/adddaycarebookings`, {
            dayCareId,
            userEmail,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date: formData.bdate ? dayjs(formData.bdate).format('YYYY-MM-DD') : '',
            typeOfPet: formData.petType,
            address: formData.address,
        });
    } catch (error) {
        throw error;
    }
};

export const confirmCaretakerBooking = async ({ careTakerId, userEmail, formData }) => {
    try {
        await http.post(`${process.env.REACT_APP_SERVER_URL}/api/addcaretakersbookings`, {
            careTakerId,
            userEmail,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date: formData.bdate ? dayjs(formData.bdate).format('YYYY-MM-DD') : '',
            typeOfPet: formData.petType,
            address: formData.address
        });
    } catch (error) {
        throw error;
    }
};
