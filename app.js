const express = require('express');
const app = express();
const cors = require('cors');
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
    SELECT mentors.name, mentors.availability
    FROM mentors
    `;
    const mentorsAvailability = await db.all(getMentorsAvailabilityQuery);
    response.send(mentorsAvailability);
})