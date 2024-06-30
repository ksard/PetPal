import http from "../../services/Http";

export const fetchEvents = async (page: number = 1) => {
    try {
        const response = await http.get(`/api/event?page=${page}`);
        if (response?.status === 200 && response?.data?.success) {
            return response.data.content;
        }
        console.error('Error fetching data:', response);

    } catch (error) {
        console.error('Error fetching events:', error);
    }
    return [];
};

export const searchEvents = async (criteria) => {
    try {
        if (criteria) {
            const response = await http.post(`/api/event/search`, criteria);
            if (response?.status === 200 && response?.data?.success) {
                return response.data.content;
            }
            console.error('Error fetching data:', response);
        }

    } catch (error) {
        console.error('Error fetching events:', error);
    }
    return [];
};

export const fetchUserEvents = async (page:number=1) => {
    try {
        const response = await http.get(`/api/event/userevents?page=${page}`);
        if (response?.status === 200 && response?.data?.success) {
            return response.data.content;
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
    return [];
};

export const insertEvent = async (event) => {
    try {
        const response = await http.post(`/api/event`, event);
        if (response?.status === 200 && response?.data?.success) {
            
            return response.data?.event;
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
    return null;
};


export const attendEvent = async (event) => {
    try {
        const response = await http.post(`/api/event/attend`, event);
        if (response?.status === 200 && response?.data?.success) {
            return response.data?.event;
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
    return null;
};