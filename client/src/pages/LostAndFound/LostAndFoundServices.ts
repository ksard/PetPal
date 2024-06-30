import http from "../../services/Http";

export const fetchAllLostPetsData = async () => {
  try {
    const response = await http.get(
      `${process.env.REACT_APP_SERVER_URL}/api/all-lost-pets`
    );
    const data: any = await response;
    return data;
  } catch (error) {
    console.error("Error fetching pets data: ", error);
  }
};

export const fetchAllFoundPetsData = async () => {
  try {
    const response = await http.get(
      `${process.env.REACT_APP_SERVER_URL}/api/all-found-pets`
    );
    const data: any = await response;
    return data;
  } catch (error) {
    console.error("Error fetching pets data: ", error);
  }
};

export const submitLostPetReport = async (reportData) => {
  try {
    const data = await http.post(
      `${process.env.REACT_APP_SERVER_URL}/api/lost-pet`,
      reportData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const response = await data;
    return response;
  } catch (error) {
    console.error("Error Submitting Lost Report: ", error);
  }
};

export const submitFoundPetReport = async (reportData) => {
  try {
    const data = await http.post(
      `${process.env.REACT_APP_SERVER_URL}/api/found-pet`,
      reportData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const response = await data;
    return response;
  } catch (error) {
    console.error("Error Submitting Found Report: ", error);
  }
};

export const deletePetReport = async (petId) => {
  try {
    const response = await http.delete(
      `${process.env.REACT_APP_SERVER_URL}/api/pet-remove/${petId}`
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error deleting pet report:", error);
  }
};
