import React, { useState } from 'react';
import { TextField, Grid, Container } from '@mui/material';
import { Button } from '../../components/Buttons/Buttons';

const SearchAndFilter = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    onSearch({ name, city, date });
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
        <Grid item xs={12} sm={2}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            size="small"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={city}
            size="small"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            onClick={handleSearch}
            className='btn-primary'
          >
            Search
          </Button>
        </Grid>
      </Grid>
  );
};

export default SearchAndFilter;
