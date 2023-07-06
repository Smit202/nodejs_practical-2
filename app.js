const { json } = require('express');
const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res, next) => {
    fs.readFile('schedule.json', (err, data) => {
        if(err) throw err;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const schedule = JSON.parse(data).shop_schedule;
        const date = new Date();
        currentDay = date.getDay();
        currentHours = date.getHours;
        currentMinutes = date.getMinutes();
        const daySchedule = schedule.find(item => item.day === days[currentDay]);
        if(daySchedule) {

            let openTime = daySchedule.open.split(' ');
            openHours = openTime[0].slice(0,2);
            openMinutes = openTime[1];
            openMeridiem = openTime[2];

            let closeTime = daySchedule.close.split(' ');
            closeHours = closeTime[0].slice(0,2);
            closeMinutes = closeTime[1];
            closeMeridiem = closeTime[2];

            if(openMeridiem === 'PM' && openHours !== 12) openHours += 12;
            else if(openMeridiem === 'AM' && openHours === 12) openHours = 0;

            if(currentHours < openHours) return 'closed';
            else if(currentHours === openHours) {
                return currentMinutes < openMinutes ? 'closed' : 'open';
            }
            else if(currentHours === closeHours) {
                return currentMinutes > closeHours ? 'closed' : 'open';
            }
            else return 'closed';
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});