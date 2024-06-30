import { IconButton } from "@mui/material";
import EventCard from "./EventCard";
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import HostEventForm from "./HostEventForm";
import { useState } from "react";
import dayjs from "dayjs";
import { insertEvent } from "../../pages/Events/EventsService";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";

const YourEvents = (props) => {
    const { section, userEvents, handleTabChange, updateUserEvents } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleSubmit = async (eventInfo) => {
        const formData = new FormData();

        formData.append('name', eventInfo.name);
        formData.append('details', eventInfo.details);
        formData.append('location[street1]', eventInfo.location.street1);
        formData.append('location[street2]', eventInfo.location.street2);
        formData.append('location[city]', eventInfo.location.city);
        formData.append('location[zipCode]', eventInfo.location.zipCode);
        let dateFormatted = dayjs(eventInfo.date.$d).format("YYYY-MM-DD")

        formData.append('date', dateFormatted);
        formData.append('time', new Date(eventInfo.time).toLocaleTimeString());

        eventInfo.pictures.forEach((file) => {
            formData.append('file', file);
        });
        let res = await insertEvent(formData);
        if (res) {
            userEvents.hostedEvents.push(res)
            updateUserEvents(userEvents)
            notifySuccess("Event creation successful!")
            handleCloseModal();
        }
        else {
            notifyError("Event creation failed!")
        }
    };

    if (section === "attending") {
        return (
            <>
                {userEvents && userEvents.attendedEvents?.length > 0 ? (
                    <div>
                        {userEvents.attendedEvents.map((event, index) => (
                            <EventCard key={index} event={event}></EventCard>
                        ))}
                    </div>
                ) : (
                    <div>
                        You have not registered for any events.{" "}
                        <a href="#" onClick={()=>handleTabChange({}, 0) }>
                            Explore new events
                        </a>
                    </div>
                )}
            </>
        );
    } else if (section === "hosting") {
        return (
            <div>
                <IconButton
                    aria-label="host"
                    size="small"
                    color="primary"
                    className="host-btn"
                    onClick={handleOpenModal}
                    sx={{ marginBottom: "10px", paddingLeft: "0px" }}
                >
                    <EventRoundedIcon fontSize="inherit" sx={{ marginRight: "3px" }} /> Host an event
                </IconButton>
                {userEvents && userEvents.hostedEvents?.length > 0 ? (
                    <div>
                        {userEvents.hostedEvents.map((event, index) => (
                            <EventCard key={index} event={event}></EventCard>
                        ))}
                    </div>
                ) : (
                    <div>
                        You are not hosting any event.
                    </div>
                )}
                <HostEventForm open={isModalOpen} handleClose={handleCloseModal} handleSubmit={handleSubmit} />
            </div>
        );
    }

    return null;
};

export default YourEvents;
