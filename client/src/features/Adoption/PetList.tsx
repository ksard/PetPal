// src/Features/Adoption/PetList.tsx

import React, { useState } from 'react';
import { Pet } from '../../types/Types';
import { Card, CardContent, CardMedia, Typography, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button } from '../../components/Buttons/Buttons';
import { addAdoptionRequest, getAllAdoptionRequests } from '../../pages/Adoption/AdoptionService';
import useAuth from '../../hooks/useAuth';
import './PetList.scss';

interface PetListProps {
  pets: Pet[];
  setAdoptionRequests: any;
}

const PetList: React.FC<PetListProps> = (props) => {
  const { pets, setAdoptionRequests } = props;
  const { user } = useAuth();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const onAdoptClick = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPopup(true);
  };

  const onDisagreeClick = () => {
    setSelectedPet(null);
    setShowPopup(false);
  };

  const fetchAdoptionRequests = async () => {
    const requests = await getAllAdoptionRequests();
    setAdoptionRequests(requests);
  };

  const handleAdoptionRequest = async (pet: Pet) => {
    try {
      await addAdoptionRequest(pet, user);
      fetchAdoptionRequests();
      onDisagreeClick();
    } catch (error) {
      console.error('Error making adoption request:', error);
      onDisagreeClick();
    }
  };

  const renderPopup = () => {
    return (
      <Dialog
        open={showPopup}
        keepMounted
        onClose={() => {}}
        aria-describedby="alert-dialog-slide-description"
        className="pet-dialog"
      >
        <DialogTitle className="dialog-title">Adopt this pet?</DialogTitle>
        <DialogContent>
          <div className="dialog-content">
            <div className="left-pane">
              <img src={selectedPet?.imageUrl} alt={selectedPet?.name} className="pet-image" />
            </div>
            <div className="right-pane">
              <DialogContentText id="alert-dialog-slide-description">
                <h2 className="pet-name">{selectedPet?.name}</h2>
                <p className="pet-detail"><strong>Owner:</strong> {selectedPet?.ownerDetails?.name}</p>
                <p className="pet-detail"><strong>Age:</strong> {selectedPet?.age}</p>
                <p className="pet-detail"><strong>Name:</strong> {selectedPet?.name}</p>
                <p className="pet-detail"><strong>Species:</strong> {selectedPet?.species}</p>
                <p className="pet-detail"><strong>Contact:</strong> {selectedPet?.contact}</p>
                <p className="pet-detail"><strong>Description:</strong> {selectedPet?.description}</p>
              </DialogContentText>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button className="btn-primary" onClick={() => handleAdoptionRequest(selectedPet!)}>
            Agree
          </Button>
          <Button className="btn-primary" onClick={() => onDisagreeClick()}>
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderPetCard = (pet: Pet) => {
    const isOwner = user?.email === pet.ownerDetails?.email;

    return (
      <Card className="pet-card" key={pet._id}>
        <CardMedia component="img" height="200" image={pet.imageUrl} alt={pet.name} className="pet-image" />
        <CardContent>
          <Typography variant="h5" component="div">
            {pet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Species: {pet.species}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Age: {pet.age}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pet.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact: {pet.contact}
          </Typography>
          {user && !isOwner && pet.status !== 'approved' && pet.status !== 'pending' && pet.status !== 'rejected' && (
            <Button className="btn-primary margin-5" onClick={() => onAdoptClick(pet)}>
              Adopt
            </Button>
          )}
          {user && pet.status && pet.status !== 'no status' && (
            <Typography variant="body2" color="text.secondary">
              Status: {pet.status}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={3} className="pet-list">
      {pets.map((pet) => renderPetCard(pet))}
      {renderPopup()}
    </Grid>
  );
};

export default PetList;

