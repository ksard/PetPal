import http from "../../services/Http";

export const fetchPetServiceCentersData = async () => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/pet-service-centers`);
        const data:any = await response;
        return data.data.serviceCenters;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const getAvailableSlots = async (id, date) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/pet-service-centers/available-slots`, {
            params: {
                petServiceCenterId: id,
                date: date
            }
        });
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error fetching available slots:', error);
    }
}

export const getAllAppointments = async (emailId) => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/pet-service-centers/petcare-appointments`, {
            params: {
                email: emailId
            }
        });
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error fetching available slots:', error);
    }
}

export const bookPetCareAppointment = async (appointmentData) => {
    try {
        const data = await http.post(`${process.env.REACT_APP_SERVER_URL}/api/pet-service-centers/book-appointment`, appointmentData);
        const response = await data;
        return response;
    } catch (error) {
        console.error('Error Booking Appointment', error);
    }
}