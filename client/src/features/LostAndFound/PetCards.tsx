import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Modal,
  Drawer,
  Backdrop,
  Fade,
  Tabs,
  Tab,
} from "@mui/material";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import image1 from "../../assets/dayCare/1.jpg";
import ChatFeature from "./Chat";
import io from "socket.io-client";
import useAuth from "../../hooks/useAuth";
import {
  deletePetReport,
  fetchAllFoundPetsData,
  fetchAllLostPetsData,
} from "../../pages/LostAndFound/LostAndFoundServices";
import { createSearchParams, useNavigate } from "react-router-dom";

const socket = io(`${process.env.REACT_APP_SERVER_URL}`);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PetCards() {
  const [pets, setPets] = useState([]);
  const [pet, setPet] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deletePet, setDeletePet] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const [lostPetsResponse, foundPetsResponse] = await Promise.all([
          fetchAllLostPetsData(),
          fetchAllFoundPetsData(),
        ]);

        const combinedPets = [
          ...lostPetsResponse.data,
          ...foundPetsResponse.data,
        ];

        setPets(combinedPets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handlePetData = (pet) => {
    if (!user) {
      navigate({
        pathname: '/login',
        search: createSearchParams({
          state: window.location.href,
        }).toString(),
      });
      return;
    }

    setOpenChat(true);
    setPet(pet);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setPet(null);
  };

  const handleDelete = async () => {
    try {
      await deletePetReport(deletePet._id);
      setPets(pets.filter((p) => p._id !== deletePet._id));
      setOpenDeleteModal(false);
      setDeletePet(null);
      alert("Pet report deleted successfully");
    } catch (error) {
      console.error("Error deleting pet report:", error);
      alert("Failed to delete pet report");
    }
  };

  const handleOpenDeleteModal = (pet) => {
    if (!user) {
      alert("Please login to remove");
      return;
    }
    setDeletePet(pet);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeletePet(null);
  };

  const filteredPets =
    filter === "all" ? pets : pets.filter((pet) => pet.status === filter);

  const handleTabChange = (event, newValue) => {
    setFilter(newValue);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center">
          Lost and Found Pets
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Tabs
            value={filter}
            onChange={handleTabChange}
            aria-label="pet status tabs"
          >
            <Tab label="All Pets" value="all" />
            <Tab label="Lost Pets" value="lost" />
            <Tab label="Found Pets" value="found" />
          </Tabs>
        </Box>
        <Grid container spacing={5} style={{ marginTop: "20px" }}>
          {filteredPets.map((pet, index) => (
            <Grid item xs={12} sm={4} ms={4} key={index}>
              <Card
                sx={{ maxWidth: 345 }}
                style={{
                  padding: "10px",
                  marginBottom: "30px",
                  backgroundColor:
                    pet.status === "lost" ? "#ffebee" : "#e8f5e9",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={pet.imageUrl || image1}
                    alt="Pets"
                    style={{ borderRadius: "5px" }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {pet.petName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Breed: {pet.breed}
                    </Typography>
                    {pet.status !== "found" && (
                      <Typography variant="body2" color="text.secondary">
                        Age: {pet.age}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Description: {pet.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pet.status === "lost" ? "Lost Date: " : "Found Date: "}
                      {new Date(pet.dateLostOrFound).toLocaleDateString()}
                    </Typography>
                    {pet.status !== "found" && (
                      <Typography variant="body2" color="text.secondary">
                        Message: {pet.message}
                      </Typography>
                    )}
                  </CardContent>
                  {user && user.email !== String(pet.contactInfo.email) && (
                    <Button size="small" onClick={() => handlePetData(pet)}>
                      Contact
                    </Button>
                  )}
                  {!user && (
                    <Button size="small" onClick={() => handlePetData(pet)}>
                      {user ? "Contact" : "Please Login to Contact"}
                    </Button>
                  )}
                  {user && user.email === String(pet.contactInfo.email) && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenDeleteModal(pet)}
                    >
                      Remove
                    </Button>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Drawer anchor="right" open={openChat} onClose={handleCloseChat}>
        <Box>
          <ChatFeature
            socket={socket}
            username={user ? user.name : ""}
            room={pet ? pet.id : 1}
          ></ChatFeature>
        </Box>
      </Drawer>

      <Modal
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDeleteModal}>
          <Box sx={style}>
            <Typography
              id="delete-confirmation-modal"
              variant="h6"
              component="h2"
            >
              Confirm Deletion
            </Typography>
            <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this pet report?
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}