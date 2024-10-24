const db = require('../config/db');
const videoService = require('../services/videoservice');
const { createZoomMeeting, createGoogleMeet } = videoService;

exports.createZoomMeeting = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        const [appointment] = await db.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const meetingDetails = await createZoomMeeting(appointment);
        await db.query('UPDATE appointments SET video_link = ?, video_platform = ? WHERE id = ?', 
                       [meetingDetails.join_url, 'zoom', appointmentId]);

        res.status(201).json({ 
            message: "Zoom meeting created successfully",
            meetingLink: meetingDetails.join_url
        });
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        res.status(500).json({ message: "Error creating Zoom meeting", error: error.message });
    }
};

exports.createGoogleMeet = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        const [appointment] = await db.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const meetingDetails = await createGoogleMeet(appointment);
        await db.query('UPDATE appointments SET video_link = ?, video_platform = ? WHERE id = ?', 
                       [meetingDetails.hangoutLink, 'google_meet', appointmentId]);

        res.status(201).json({ 
            message: "Google Meet created successfully",
            meetingLink: meetingDetails.hangoutLink
        });
    } catch (error) {
        console.error('Error creating Google Meet:', error);
        res.status(500).json({ message: "Error creating Google Meet", error: error.message });
    }
};

exports.createVideoSession = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const session = await videoService.createVideoSession(appointmentId);
        res.json(session);
    } catch (error) {
        console.error('Error creating video session:', error);
        res.status(500).json({ message: 'Error creating video session' });
    }
};

exports.endVideoSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await videoService.endVideoSession(sessionId);
        res.json(result);
    } catch (error) {
        console.error('Error ending video session:', error);
        res.status(500).json({ message: 'Error ending video session' });
    }
};

exports.getVideoSessionInfo = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const info = await videoService.getVideoSessionInfo(sessionId);
        res.json(info);
    } catch (error) {
        console.error('Error getting video session info:', error);
        res.status(500).json({ message: 'Error getting video session info' });
    }
};
