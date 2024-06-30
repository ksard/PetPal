import http from "./Http";

export type User = {
    "email": string,
    "family_name": string,
    "given_name": string,
    "name": string,
    "picture": string
}


export const fetchUserData = async () => {
    try {
        const response = await http.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/userinfo`);
        const data = await response;
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};