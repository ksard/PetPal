// src/types/Types.tsx

export interface User {
  _id: string; 
  name: string;
  email: string;
}

export interface Pet {
    _id?: string; 
    id?: number;  
    name: string;
    species: string;
    age: number;
    description: string;
    contact: string;
    imageUrl: string;
    ownerDetails: User;
    status: string;
    previouslyRequested?: boolean;
  }
  
  export interface PetFormValues {
    name: string;
    species: string;
    age: string; // keeping age as string for form input, will convert to number as needed
    description: string;
    contact: string;
  }

  export interface AdoptionRequest {
    _id: string;
    pet: Pet;
    user: {
      name: string;
    };
    status: string;
    requestDate: Date;
  }