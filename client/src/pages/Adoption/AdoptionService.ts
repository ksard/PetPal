// src/pages/AdoptionService.ts
import http from '../../services/Http';
import { AdoptionRequest, Pet } from '../../types/Types';

// Fetch all pets
export const getPets = async (): Promise<Pet[]> => {
    const response = await http.get('/api/pets');
    return response.data;
  };
  
  // Add a new pet
  export const addPet = async (pet: Partial<Pet>): Promise<Pet> => {
    const response = await http.post('/api/pets', pet);
    return response.data;
  };
  
  // Add an adoption request
  export const addAdoptionRequest = async (pet: Pet, user: object): Promise<AdoptionRequest> => {
    const response = await http.post('/api/adoptionRequests', { pet, user, status: 'pending' });
    return response.data;
  };
  
  // Get adoption requests for a specific pet
  export const getAdoptionRequests = async (petId: string): Promise<AdoptionRequest[]> => {
    const response = await http.get(`/api/adoptionRequests/${petId}`);
    return response.data;
  };
  
  // Get all adoption requests
  export const getAllAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
    try {
      const response = await http.get(`/api/adoptionRequests/getAllAdoptionRequests`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Adoption Requests');
    }
  };
  
  // Update the status of an adoption request
  export const updateRequestStatus = async (requestId: string, status: string): Promise<AdoptionRequest> => {
    const response = await http.patch('/api/adoptionRequests', { requestId, status });
    return response.data;
  };