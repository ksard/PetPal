// src/Features/Adoption/SearchAndFilter.tsx

import React, { useState, useEffect } from 'react';
import { Pet } from '../../types/Types';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import './SearchAndFilter.scss';

interface SearchAndFilterProps {
  pets: Pet[];
  setFilteredPets: React.Dispatch<React.SetStateAction<Pet[]>>;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ pets, setFilteredPets }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('');
  const [ageFilter, setAgeFilter] = useState<string>('');
  const [customSpecies, setCustomSpecies] = useState<string>(''); // New state for custom species

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSpeciesChange = (e: SelectChangeEvent<string>) => {
    setSpeciesFilter(e.target.value as string);
    if (e.target.value !== 'Other') {
      setCustomSpecies(''); // Reset custom species if not "Other"
    }
  };

  const handleAgeChange = (e: SelectChangeEvent<string>) => {
    setAgeFilter(e.target.value as string);
  };

  const handleCustomSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSpecies(e.target.value);
  };

  useEffect(() => {
    filterPets(searchTerm, speciesFilter, ageFilter, customSpecies);
  }, [searchTerm, speciesFilter, ageFilter, customSpecies]);

  const filterPets = (search: string, species: string, age: string, customSpecies: string) => {
    let filtered = pets;

    const defaultSpecies = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'turtle'];

    if (species === 'Other') {
      filtered = filtered.filter(pet => !defaultSpecies.includes(pet.species.toLowerCase()));
      if (customSpecies) {
        filtered = filtered.filter(pet => pet.species.toLowerCase().startsWith(customSpecies.toLowerCase()));
      }
    } else {
      if (species) {
        filtered = filtered.filter(pet => pet.species.toLowerCase() === species.toLowerCase());
      }
    }

    if (search) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.species.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (age) {
      const [minAge, maxAge] = age.split('-').map(Number);
      filtered = filtered.filter(pet => pet.age >= minAge && pet.age <= maxAge);
    }

    setFilteredPets(filtered);
  };

  return (
    <Box className="search-and-filter" padding={2}>
      <FormControl variant="outlined" fullWidth className="MuiFormControl-root">
        <TextField
          label="Search by name or species"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          className="MuiTextField-root"
        />
      </FormControl>
      <FormControl variant="outlined" fullWidth className="MuiFormControl-root">
        <InputLabel>Species</InputLabel>
        <Select
          value={speciesFilter}
          onChange={handleSpeciesChange}
          label="Species"
          className="MuiSelect-root"
        >
          <MenuItem value="">All Species</MenuItem>
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
      {speciesFilter === 'Other' && (
        <FormControl variant="outlined" fullWidth className="MuiFormControl-root">
          <TextField
            label="Specify Species"
            variant="outlined"
            fullWidth
            value={customSpecies}
            onChange={handleCustomSpeciesChange}
            className="MuiTextField-root"
          />
        </FormControl>
      )}
      <FormControl variant="outlined" fullWidth className="MuiFormControl-root">
        <InputLabel>Age</InputLabel>
        <Select
          value={ageFilter}
          onChange={handleAgeChange}
          label="Age"
          className="MuiSelect-root"
        >
          <MenuItem value="">All Ages</MenuItem>
          <MenuItem value="0-1">0-1 year</MenuItem>
          <MenuItem value="1-3">1-3 years</MenuItem>
          <MenuItem value="3-5">3-5 years</MenuItem>
          <MenuItem value="5-10">5-10 years</MenuItem>
          <MenuItem value="10-20">10-20 years</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchAndFilter;
