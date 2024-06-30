//Mongo DB query constants

const DBConstants=Object.freeze({
    DATE_KEY:"$date",
    REGEX_KEY:"$regex",
    OPTIONS_KEY:"$options",
    CASE_INSENSITIVE:"i",
    CITY_FIELD:"location.city",
    HOSTEDBY_EMAIL_FIELD:"hostedBy.email",
    ATTENDEES_EMAIL_FIELD:"attendees.email"
});

module.exports = { DBConstants }