import React, { useEffect, useState } from "react";
import "./LostReport.scss";
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
import useAuth from "../../hooks/useAuth";
import { submitLostPetReport } from "../../pages/LostAndFound/LostAndFoundServices";
import { useNavigate } from "react-router-dom";

const LostReport: React.FC = () => {
  const { user } = useAuth();
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
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

  // To handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    reportData.append("petName", petName);
    reportData.append("species", species);
    reportData.append("breed", breed);
    reportData.append("age", age.toString());
    reportData.append("description", description);
    reportData.append("message", message);
    reportData.append("dateLostOrFound", dateLostOrFound);
    reportData.append("contactInfo", JSON.stringify(contactInfo));
    if (selectedFile) {
      reportData.append("file", selectedFile);
    }

    try {
      await submitLostPetReport(reportData);

      alert("Lost pet report submitted successfully");
      // Clear form
      setPetName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setDescription("");
      setMessage("");
      setDateLostOrFound("");
      setContactName("");
      setContactEmail("");
      setContactAddress("");
      setContactPhone("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error reporting lost pet:", error);
      alert("Failed to submit lost pet report");
    }
  };

  return (
    <Box className="lost-report" sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help Us Find Your Lost Pet
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          About lost Pet
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pet Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              helperText={petName.trim() === "" ? "Default: Unnamed Pet" : ""}
            />
          </Grid>
          <Grid item xs={12}>
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
            <Grid item xs={12}>
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
              label="Age"
              type="number"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : parseInt(e.target.value))
              }
            />
          </Grid>
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
              label="Any Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Last location"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date lost"
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

export default LostReport;
