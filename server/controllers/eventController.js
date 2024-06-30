const Event = require("../models/eventsModel")
const { uploadImageToStorage } = require("../utils/imageUtil");
const { DBConstants } = require("../utils/constants")


const getAllEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const datesPerPage = 10;
        const skipDates = (page - 1) * datesPerPage;
        const allDates = await Event.aggregate([
            { $group: { _id: DBConstants.DATE_KEY } }
        ]);

        const totalPages = Math.ceil(allDates.length / datesPerPage);
        const latestDates = await Event.aggregate([
            { $group: { _id: DBConstants.DATE_KEY } },
            { $sort: { _id: -1 } },
            { $skip: skipDates },
            { $limit: datesPerPage }
        ]);

        const dateArray = latestDates.map(item => item._id);

        const events = await Event.find({ date: { $in: dateArray } }).sort({ date: -1 });
        res.status(200).json({
            content: {
                events: events, totalPages: totalPages, currentPage: page
            }, success: true, message: `Events fetched for page ${page}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const filterEvents = async (req, res) => {
    try {
        const { name, city, date, page = 1, limit = 10 } = req.body;
        const query = {};

        if (name) query.name = { $regex: `^${name}`, $options: 'i' };
        if (city) query[DBConstants.CITY_FIELD] = { $regex: `^${city}$`, $options: 'i' };
        if (date) query.date = new Date(date);

        const count = await Event.countDocuments(query);
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;

        const events = await Event.find(query).skip(skip).limit(limit);

        return res.status(200).json({
            content: {
                events: events,
                totalPages: totalPages,
                currentPage: page
            },
            success: true,
            message: "Events fetched",
        });
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const fetchUserEvents = async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalHostedCount = await Event.countDocuments({ [DBConstants.HOSTEDBY_EMAIL_FIELD]: userEmail });
        const totalAttendedCount = await Event.countDocuments({
            [DBConstants.ATTENDEES_EMAIL_FIELD]: userEmail,
            [DBConstants.HOSTEDBY_EMAIL_FIELD]: { $ne: userEmail }
        });

        const hostedEvents = await Event.find({ [DBConstants.HOSTEDBY_EMAIL_FIELD]: userEmail })
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        const attendedEvents = await Event.find({
            [DBConstants.ATTENDEES_EMAIL_FIELD]: userEmail,
            [DBConstants.HOSTEDBY_EMAIL_FIELD]: { $ne: userEmail }
        })
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            content: {
                currentPage: page,
                totalHostedPages: Math.ceil(totalHostedCount / limit),
                totalAttendedPages: Math.ceil(totalAttendedCount / limit),
                hostedEvents,
                attendedEvents
            },
            success: true,
            message: "User events fetched",
        });
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const insertEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const files = req.files;
        let resMessage = null;
        const uploadedUrls = await uploadImageToStorage(files, process.env.EVENTS_FOLDER);
        if (files?.length > 0 && !uploadedUrls) {
            resMessage = "Failed to upload images &"
        }
        eventData.pictures = uploadedUrls;
        eventData.hostedBy = req.session.user;
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(200).json({ success: true, message: resMessage + 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error inserting event:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const attendEvent = async (req, res) => {
    try {
        let eventData = req.body;
        const user = req.session.user;
        if (!eventData?.attendees?.some(a => a.email === user.email)) {
             eventData = await Event.findOneAndUpdate({ hostedBy: eventData.hostedBy, name: eventData.name, date: eventData.date, time: eventData.time }, { $push: { attendees: { name: user.name, email: user.email, picture: user.picture } } }, { new: true })
        }
        res.status(200).json({ success: true, message: 'Added to attendees', event: eventData });
    } catch (error) {
        console.error('Error adding to attendees', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = { getAllEvents, filterEvents, insertEvent, fetchUserEvents, attendEvent };