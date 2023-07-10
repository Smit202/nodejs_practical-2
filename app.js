const express = require('express');
const fs = require('fs');


const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(express.static(__dirname));

app.get('/', (req, res, next) => {
    fs.readFile('schedule.json', (err, data) => {
        if(err) throw err;
        const schedule  = JSON.parse(data).shop_schedule;
        const status = checkStatus(schedule);
        console.log(status);
        // res.send(checkStatus(schedule));
        res.render('index', {status,});
    });
});

function checkStatus(schedule) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    console.log(date);
    // date.setHours(19);
    // date.setMinutes(0);
    const currentTime = [date.getHours(), date.getMinutes(), date.getDay()];
    const daySchedule = schedule.find(item => item.day === days[currentTime[2]]);

    console.log(currentTime);

    if(daySchedule) {

        const openTime = daySchedule.open.split(' ');
        openTime[0] = +openTime[0].slice(0, 2);
        openTime[1] = +openTime[1];
 
        const closeTime = daySchedule.close.split(' ');
        closeTime[0] = +closeTime[0].slice(0, 2);
        closeTime[1] = +closeTime[1];

        // Converting 12 hour open and close time format to 24 hour format
        if (openTime[2] === 'PM' && openTime[0] !== 12) openTime[0] += 12;
        if (openTime[2] === 'AM' && openTime[0] === 12) openTime[0] = 0;
        if (closeTime[2] === 'PM' && closeTime[0] !== 12) closeTime[0] += 12;
        if (closeTime[2] === 'AM' && closeTime[0] === 12) openTime[0] = 0;

        console.log(openTime);
        console.log(closeTime);

        const openDate = new Date(date.getTime());
        openDate.setHours(openTime[0]);
        openDate.setMinutes(openTime[1]);

        const closeDate = new Date(date.getTime());
        closeDate.setHours(closeTime[0]);
        closeDate.setMinutes(closeTime[1]);

        const currentTimestamp = date.getTime();
        const openTimestamp = openDate.getTime();
        const closeTimestamp = closeDate.getTime();

        console.log(currentTimestamp, openTimestamp, closeTimestamp);

        if(currentTimestamp < openTimestamp || currentTimestamp > closeTimestamp) return 'Closed';
        return 'Open';
    }
    
    return 'Closed';
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});