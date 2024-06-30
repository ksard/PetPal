// src/pages/Adoption/Adoption.tsx
import React, { useEffect, useState } from 'react';
import { Pet, AdoptionRequest } from '../../types/Types';
import { getAllAdoptionRequests, getPets } from './AdoptionService';
import SearchAndFilter from '../../features/Adoption/SearchAndFilter';
import PetList from '../../features/Adoption/PetList';
import AdvertisePet from '../../features/Adoption/AdvertisePet';
import { Tabs, Tab } from '@mui/material';
import './Adoption.scss';
import UserAdoptionRequest from '../../features/Adoption/UserAdoptionRequest';
import useAuth from '../../hooks/useAuth';

const Adoption: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const { user } = useAuth();

  const loadPets = async () => {
    try {
      const petsData = await getPets();
      setPets(petsData);
      setFilteredPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchAdoptionRequests = async () => {
    if (user) {
      const requests = await getAllAdoptionRequests();
      setAdoptionRequests(requests);
    }
  };

  useEffect(() => {
    loadPets();
    fetchAdoptionRequests();
  }, [user]);

  const mapStatusToPets = () => {
    const petStatusMap = new Map();

    adoptionRequests.forEach(request => {
      const petId = request.pet._id;
      const status = request.status;
      petStatusMap.set(petId, status);
    });

    const petsWithStatus = pets.map(pet => {
      const petId = pet._id;
      const status = petStatusMap.get(petId) || 'no status';
      return {
        ...pet,
        status: status
      };
    });

    return petsWithStatus;
  };

  useEffect(() => {
    setPets(mapStatusToPets());
    setFilteredPets(mapStatusToPets());
  }, [adoptionRequests]);

  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderHeader = () => {
    return (
      <>
        <h2>Find your best match here!</h2>
      </>
    );
  };

  const renderAdoptAPetTab = () => {
    return (
      <>
        {selectedTab === 0 && (
          <div className="adopt-section">
            <SearchAndFilter pets={pets} setFilteredPets={setFilteredPets} />
            <PetList pets={filteredPets} setAdoptionRequests={setAdoptionRequests} />
          </div>
        )}
      </>
    );
  };

  const renderAdvertisePetTab = () => {
    return (
      <>
        {selectedTab === 1 && <AdvertisePet />}
      </>
    );
  };

  const renderAdoptionRequestTab = () => {
    return (
      <>
        {selectedTab === 2 && (
          <UserAdoptionRequest
            adoptionRequests={adoptionRequests}
            setAdoptionRequests={setAdoptionRequests}
            user={user}
          />
        )}
      </>
    );
  };

  const renderTabs = () => {
    return (
      <>
        <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered className="tabStyling">
          <Tab label="Adopt a Pet" />
          <Tab label="Advertise a Pet" />
          <Tab label="View Adoption Requests" />
        </Tabs>
      </>
    );
  };

  const renderTabContent = () => {
    return (
      <>
        {renderAdoptAPetTab()}
        {renderAdvertisePetTab()}
        {renderAdoptionRequestTab()}
      </>
    );
  };

  return (
    <>
      <div className="adoption-page">
        {renderHeader()}
        {renderTabs()}
        {renderTabContent()}
      </div>
    </>
  );
};

export default Adoption;


