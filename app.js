const express = require('express');
const app = express();
// const cors = require('cors');
// app.use(cors());

app.use(express.json());

const {open} = require('sqlite');
const sqlite3 = require('sqlite3');

const path = require('path') 
const dbPath = path.join(__dirname, 'careerCarve.db');

let db = null;
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(5000, () => {
            console.log('Server Connected');
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer()

//get Mentors Data 
app.get('/mentors', async(request, response) => {
    const getMentorsQuery = `
    SELECT * FROM mentors
    `;
    const mentors = await db.all(getMentorsQuery);
    response.send(mentors);
});

app.get('/mentors-availability', async(request, response) => {
    const getMentorsAvailabilityQuery = `
    SELECT mentors.id, mentors.name, mentors.availability, mentors.areas_of_expertise
    FROM mentors
    `;
    const mentorsAvailability = await db.all(getMentorsAvailabilityQuery);
    response.send(mentorsAvailability);
})

// app.post('/schedule-session', async(request, response) => {
//     const { studentName, mentorName, areaOfInterest, mentorAvailability, scheduledDuration } = request.body;
//     const scheduleSessionQuery = `
//     INSERT INTO bookings (student_name, mentor_name, area_of_interest, mentor_availability, scheduled_duration)
//     VALUES ('${studentName}', '${mentorName}', '${areaOfInterest}', '${mentorAvailability}', '${scheduledDuration}');
//     `;
//     await db.run(scheduleSessionQuery);
//     response.send({ message: 'Session Scheduled Successfully' });
// });

app.post('/schedule-session', async (request, response) => {
    try {
        const { studentName, mentorName, areaOfInterest, mentorAvailability, scheduledDuration } = request.body;

        // Check if body properties exist
        if (!studentName || !mentorName || !areaOfInterest || !mentorAvailability || !scheduledDuration) {
            return response.status(400).send({ message: 'Missing required fields' });
        }

        // Example SQL query to insert data (use parameterized queries to avoid SQL injection)
        const scheduleSessionQuery = `
            INSERT INTO bookings (student_name, mentor_name, area_of_interest, mentor_availability, scheduled_duration)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(scheduleSessionQuery, [studentName, mentorName, areaOfInterest, mentorAvailability, scheduledDuration], function (err) {
            if (err) {
                console.error('Error inserting data:', err);
                return response.status(500).send({ message: 'Failed to schedule session' });
            }
            response.send({ message: 'Session Scheduled Successfully', id: this.lastID });
        });
    } catch (error) {
        console.error('Server error:', error);
        response.status(500).send({ message: 'Server error' });
    }
});
