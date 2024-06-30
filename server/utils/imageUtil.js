const { storage } = require("../config/database")

const uploadImageToStorage = async (files, imageType) => {
    try {
        const bucket = storage.bucket("event_photos");
        let folder = null;
        if (imageType === process.env.EVENTS_FOLDER.toString()) {
            folder = process.env.EVENTS_FOLDER
        }
        else if (imageType === process.env.LOSTANDFOUND_FOLDER) {
            folder = process.env.LOSTANDFOUND_FOLDER
        }
        if (!folder) {
            return null;
        }
        const promises = files.map(async (file) => {
            const blob = bucket.file(`${folder}/${file.originalname}`);
            await blob.save(file.buffer, { resumable: false });
            return blob.publicUrl();
        });

        const uploadedUrls = await Promise.all(promises);
        return uploadedUrls;
    } catch (err) {
        console.error(err)
        return null;
    }
};

module.exports = { uploadImageToStorage };
