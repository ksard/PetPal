import React, { useState } from 'react';
import { TextField, Container, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Card, CardContent, CardMedia } from '@mui/material';
import './AdvertisePet.scss';
import useAuth from '../../hooks/useAuth';
import { Button } from '../../components/Buttons/Buttons';
import Toaster, { notifySuccess, notifyError } from '../../components/Toaster/Toaster';
import { addPet } from '../../pages/Adoption/AdoptionService'; 
import { Pet } from '../../types/Types'; 

const AdvertisePet: React.FC = () => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [customSpecies, setCustomSpecies] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const speciesValue = species === 'Other' ? customSpecies : species;
    const ageValue = age === '' ? 0 : age; // Convert age to 0 if it's an empty string
    const newPet: Partial<Pet> = { name, species: speciesValue, age: ageValue, description, contact, imageUrl };

    try {
      const response = await addPet(newPet as Pet); 
      if (response) {
        // Clear the form
        setName('');
        setSpecies('');
        setCustomSpecies('');
        setAge('');
        setDescription('');
        setContact('');
        setImageUrl('');

        // Show success notification
        notifySuccess('Submitted successfully!');
      } else {
        console.error('Failed to advertise pet');
        notifyError('Failed to submit!');
      }
    } catch (error) {
      console.error('Error:', error);
      notifyError('Error occurred!');
    }
  };

  const renderForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Species</InputLabel>
                <Select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as string)}
                  label="Species"
                >
                  <MenuItem value="Dog">Dog</MenuItem>
                  <MenuItem value="Cat">Cat</MenuItem>
                  <MenuItem value="Bird">Bird</MenuItem>
                  <MenuItem value="Rabbit">Rabbit</MenuItem>
                  <MenuItem value="Fish">Fish</MenuItem>
                  <MenuItem value="Hamster">Hamster</MenuItem>
                  <MenuItem value="Turtle">Turtle</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {species === 'Other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specify Species"
                  value={customSpecies}
                  onChange={(e) => setCustomSpecies(e.target.value)}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" className="btn-primary margin-5">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </>
    )
  };

  const renderUserLognError = () => {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Please login to Submit an Ad
        </Typography>
      </>
    );
  };

  const renderPetCard = (pet: Partial<Pet>) => {
    return (
      <>
        <Card className="pet-card">
          <CardMedia
            component="img"
            height="200"
            image={pet.imageUrl}
            alt={pet.name}
            className="pet-image"
          />
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
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <>
      {!user && renderUserLognError()}
      {user && (
        <Container className="advertise-pet">
          <Typography variant="h4" gutterBottom>
            Advertise a Pet
          </Typography>
          <div className="container">
            <div className="left-pane">
              {renderForm()}
            </div>
            <div className="right-pane">
              {(name || species || age || description || contact || imageUrl) &&
                renderPetCard({
                  name,
                  species,
                  age: age as number,
                  description,
                  contact,
                  imageUrl,
                })}
            </div>
          </div>
          <Toaster />
        </Container>
      )}
    </>
  );
};

export default AdvertisePet;
