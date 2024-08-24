const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());

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


app.post('/schedule-session', async(request, response) => {
    const { studentName, mentorName, areaOfInterest, mentorAvailability, scheduledDuration } = request.body;
    const scheduleSessionQuery = `
    INSERT INTO bookings (student_name, mentor_name, area_of_interest, mentor_availability, scheduled_duration)
    VALUES (?,?,?,?,?);
    `;
    await db.run(scheduleSessionQuery, studentName, mentorName, areaOfInterest, mentorAvailability, scheduledDuration);
    response.send({ message: 'Session Scheduled Successfully' });
})

app.get('/bookings', async(request, response) => {
    const getBookingsQuery = `
    SELECT * FROM bookings
    `;
    const bookings = await db.all(getBookingsQuery);
    response.send(bookings);
})