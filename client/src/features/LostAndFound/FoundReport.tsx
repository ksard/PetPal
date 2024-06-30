import React, { useEffect, useState } from "react";
import "./FoundReport.scss";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { submitFoundPetReport } from "../../pages/LostAndFound/LostAndFoundServices";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const FoundReport: React.FC = () => {
  const { user } = useAuth();
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [dateLostOrFound, setDateLostOrFound] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const speciesOptions = ["Dog", "Cat", "Other"];
  const breedOptions = {
    Dog: ["Labrador", "Beagle", "German Shepherd", "Golden Retriever", "Other"],
    Cat: ["Persian", "Siamese", "Maine Coon", "Bengal", "Other"],
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (species in breedOptions) {
      setAvailableBreeds(breedOptions[species as keyof typeof breedOptions]);
    } else {
      setAvailableBreeds([]);
    }
  }, [species]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalPetName = petName.trim() === "" ? "Unnamed" : petName;
    if (!user) {
      navigate("/login");
      return;
    }
    const contactInfo = {
      name: contactName,
      email: contactEmail,
      address: contactAddress,
      phone: contactPhone,
    };

    const reportData = new FormData();
    reportData.append("petName", finalPetName);
    reportData.append("species", species);
    reportData.append("breed", breed);
    reportData.append("description", description);
    reportData.append("dateLostOrFound", dateLostOrFound);
    reportData.append("contactInfo", JSON.stringify(contactInfo));
    if (selectedFile) {
      reportData.append("file", selectedFile);
    }

    try {
      await submitFoundPetReport(reportData);

      alert("Found pet report submitted successfully!");
      setPetName("");
      setSpecies("");
      setBreed("");
      setDescription("");
      setDateLostOrFound("");
      setContactName("");
      setContactEmail("");
      setContactAddress("");
      setContactPhone("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error reporting found pet:", error);
      alert("Failed to submit found pet report");
    }
  };

  return (
    <Box className="found-report" sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Please fill the form below if you find a lost pet and we will try and
        get it back to the owner.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          About Found Pet
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Pet Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              helperText={petName.trim() === "" ? "Default: Unnamed Pet" : ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Species</InputLabel>
              <Select
                value={species}
                onChange={(e) => setSpecies(e.target.value as string)}
              >
                {speciesOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {species !== "Other" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Breed</InputLabel>
                <Select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value as string)}
                  disabled={species === ""}
                >
                  {availableBreeds.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date Found"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateLostOrFound}
              onChange={(e) => setDateLostOrFound(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Upload Image</InputLabel>
              <TextField
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: "image/*" }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          {user ? "Submit Report" : "Please Login"}
        </Button>
      </form>
    </Box>
  );
};

export default FoundReport;
