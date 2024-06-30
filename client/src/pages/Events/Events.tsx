import React, { useEffect, useState } from 'react';
import { Box, Container, Divider, Grid, Pagination, Typography, Tabs, Tab, List, ListItemButton, ListItemText, ListItem } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SearchAndFilter from '../../features/Events/SearchAndFilter';
import EventCard from '../../features/Events/EventCard';
import { fetchEvents, fetchUserEvents, searchEvents } from './EventsService';
import './Events.scss'
import YourEvents from '../../features/Events/YourEvents';
import useAuth from '../../hooks/useAuth';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [criteria, setCriteria] = useState(null);
  const [userEvents, setUserEvents] = useState(null);
  const [selectedList, setSelectedList] = useState('attending');

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    fetchAllEventsByPage(value);
  };

  const handleSearch = async (criteria) => {
    const content = await searchEvents(criteria);
    setEvents(content.events);
    setCurrentPage(content.currentPage);
    setTotalPages(content.totalPages);
    setCriteria(criteria);
    handleTabChange({}, 0);
  };

  const fetchAllEventsByPage = async (page: number = 1) => {
    const content = await fetchEvents(page);
    setEvents(content.events);
    setCurrentPage(content.currentPage);
    setTotalPages(content.totalPages);
  };

  const fetchAllUserEvents = async (page: number = 1) => {
    const content = await fetchUserEvents(page);
    setUserEvents(content);
  };

  useEffect(() => {
    if (activeTab === 0) {
      if (criteria?.name || criteria?.city || criteria?.date) {
        handleSearch(criteria);
      }
      else {
        fetchAllEventsByPage();
      }
    }
    else if (activeTab === 1) {
      fetchAllUserEvents();
    }
  }, [activeTab]);

  const groupEventsByDate = (events) => {
    return events.reduce((acc, event) => {
      const date = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };

  const groupedEvents = groupEventsByDate(events);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleListItemClick = (listType) => {
    setSelectedList(listType);
  };

  return (
    <>
      <Container className='custom-container'>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SearchAndFilter onSearch={handleSearch} />
        </Box>
       {user &&
          <div className='your-events'>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="events tabs" sx={{ marginBottom: '15px' }}>
              <Tab label="Events" />
              <Tab label="Your Events" />
            </Tabs>
          </div>
        }
        {activeTab === 0 && (
          <div>
            {Object.keys(groupedEvents).length === 0 ? (
              <Typography variant="h6" gutterBottom>No events available</Typography>
            ) : (
              Object.keys(groupedEvents).map((date) => (
                <div key={date}>
                  <Typography variant="h6" gutterBottom>
                    {date}
                  </Typography>
                  <Divider />
                  <Grid container spacing={3} sx={{ marginTop: 1 }}>
                    {groupedEvents[date].map((event, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <EventCard event={event} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <div className='pagination'>
                <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} />
              </div>
            )}
          </div>
        )}
        {activeTab === 1 && user && (
           <div className='your-events'>
           <List sx={{ width: "12%", backgroundColor: "#f1f1f1", borderRadius: "5%", marginRight: "16px" }}>
             <ListItem disablePadding>
               <ListItemButton selected={selectedList === "attending"} onClick={() => handleListItemClick('attending')}>
                 <ListItemText primary="Attending" />
               </ListItemButton>
             </ListItem>
             <ListItem disablePadding>
               <ListItemButton selected={selectedList === "hosting"} onClick={() => handleListItemClick('hosting')}>
                 <ListItemText primary="Hosting" />
               </ListItemButton>
             </ListItem>
           </List>
           <div>
             <YourEvents section={selectedList} userEvents={userEvents} handleTabChange={handleTabChange} updateUserEvents={setUserEvents}/>
           </div>
         </div>
        )}
      </Container>
      <Outlet />
    </>
  );
};

export default Events;
