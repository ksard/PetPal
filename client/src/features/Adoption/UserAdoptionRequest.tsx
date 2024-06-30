// src/pages/Adoption/UserAdoptionRequest.tsx
import React, { useEffect, useState } from 'react';
import { getAllAdoptionRequests, updateRequestStatus } from '../../pages/Adoption/AdoptionService';
import { Card, CardContent, Typography } from '@mui/material';
import '../../pages/Adoption/Adoption.scss';
import { Button } from '../../components/Buttons/Buttons';
import { AdoptionRequest } from '../../types/Types';
import "./UserAdoptionRequest.scss";

interface UserAdoptionRequestsProps {
  adoptionRequests: AdoptionRequest[];
  setAdoptionRequests: React.Dispatch<React.SetStateAction<AdoptionRequest[]>>;
  user: any;
}

const UserAdoptionRequest: React.FC<UserAdoptionRequestsProps> = ({ adoptionRequests, setAdoptionRequests, user }) => {
  const [currentUserAdoptionRequest, setCurrentUserAdoptionRequest] = useState<AdoptionRequest[]>([]);

  const fetchAdoptionRequests = async () => {
    if (user) {
      try {
        const requests = await getAllAdoptionRequests();
        setAdoptionRequests(requests);
        updateCurrentUserAdoptionRequests(requests);
      } catch (error) {
        console.error('Error fetching adoption requests:', error);
      }
    }
  };

  useEffect(() => {
    fetchAdoptionRequests();
  }, [user]);

  const updateCurrentUserAdoptionRequests = (allRequests) => {
    const requests = allRequests.filter(item => item?.pet?.ownerDetails?.email === user?.email);
    setCurrentUserAdoptionRequest(requests);
  };

  useEffect(() => {
    updateCurrentUserAdoptionRequests(adoptionRequests);
  }, [adoptionRequests]);

  const handleRequestStatusUpdate = async (requestId: string, status: string) => {
    try {
      const updatedRequest = await updateRequestStatus(requestId, status);
      setAdoptionRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
      updateCurrentUserAdoptionRequests(adoptionRequests);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const renderUserLoginError = () => {
    return (
      <Typography variant="h4" gutterBottom>
        Please login to View Adoption Requests
      </Typography>
    );
  };

  const renderPetCard = (pet) => {
    if (!pet) return null;
    return (
      <Card className="pet-card" sx={{ display: "flex", justifyContent: "center" }}>
        <div className='userCard'>
          <div className="profile-icon">
            <img src={pet.imageUrl} alt={pet.name} className="profile-img" />
          </div>
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
        </div>
      </Card>
    );
  };

  const renderUserCard = (request) => {
    const { user } = request;
    if (!user) return null;
    return (
      <Card className="pet-card" sx={{ display: "flex", justifyContent: "center" }}>
        <div className='userCard'>
          <div className="profile-icon">
            <img src={user.picture} alt={user.name} className="profile-img" />
          </div>
          <CardContent>
            <Typography variant="h5" component="div">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {request.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(request.requestDate).toLocaleDateString()}
            </Typography>
          </CardContent>
        </div>
      </Card>
    );
  };

  const renderRequests = () => {
    return (
      <div className="adoption-requests">
        {currentUserAdoptionRequest.length > 0 ? (
          currentUserAdoptionRequest.map(request => (
            <div key={request._id} className="adoption-request">
              <div className='detailsCard'>
                {renderPetCard(request?.pet)}
                {renderUserCard(request)}
              </div>
              <div className='approvalButtons'>
                <Button
                  className='btn-primary'
                  onClick={() => handleRequestStatusUpdate(request._id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  className='btn-primary'
                  onClick={() => handleRequestStatusUpdate(request._id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No adoption requests found.</p>
        )}
      </div>
    );
  };

  const renderAdoptionRequestTab = () => {
    return (
      <>
        {user ? renderRequests() : renderUserLoginError()}
      </>
    );
  };

  return (
    <>
      {renderAdoptionRequestTab()}
    </>
  );
};

export default UserAdoptionRequest;


