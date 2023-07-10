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
        res.render('index', status);
    });
});

function checkStatus(schedule) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    console.log(date);
    // date.setHours(13);
    // date.setMinutes(20);
    const currentTime = [date.getHours(), date.getMinutes(), date.getDay()];
    let today = currentTime[2];
    let offset = 0;
    let daySchedule = schedule.find(item => item.day === days[today]);
    while (!daySchedule) {
        offset += 24;
        today !== 6 ? today++ : today = 0;
        daySchedule = schedule.find(item => item.day === days[today]);
    }

    console.log(currentTime);

    const closeTime = daySchedule.close.split(' ');
    closeTime[0] = +closeTime[0].slice(0, 2);
    closeTime[1] = +closeTime[1];

    // Converting 12 hour close time format to 24 hour format
    if (closeTime[2] === 'PM' && closeTime[0] !== 12) closeTime[0] += 12;
    if (closeTime[2] === 'AM' && closeTime[0] === 12) openTime[0] = 0;

    const closeDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    closeDate.setHours(closeTime[0]);
    closeDate.setMinutes(closeTime[1]);
    closeDate.setSeconds(0);
    closeDate.setMilliseconds(0);

    const currentTimestamp = date.getTime();
    const closeTimestamp = closeDate.getTime();

    if (currentTimestamp > closeTimestamp) {
        today !== 6 ? today++ : today = 0;
        offset = 24;
        daySchedule = schedule.find(item => item.day === days[today]);
        while (!daySchedule) {
            offset += 24;
            today !== 6 ? today++ : today = 0;
            daySchedule = schedule.find(item => item.day === days[today]);
        }
    }

    // Converting 12 hour open time format to 24 hour format
    const openTime = daySchedule.open.split(' ');
    openTime[0] = +openTime[0].slice(0, 2);
    openTime[1] = +openTime[1];

    if (openTime[2] === 'PM' && openTime[0] !== 12) openTime[0] += 12;
    if (openTime[2] === 'AM' && openTime[0] === 12) openTime[0] = 0;

    const openDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    openDate.setHours(openTime[0]);
    openDate.setMinutes(openTime[1]);
    openDate.setSeconds(0);
    openDate.setMilliseconds(0);

    const openTimestamp = openDate.getTime();
    console.log(openTime);
    console.log(closeTime);
    console.log(currentTimestamp, openTimestamp, closeTimestamp);

    if (currentTimestamp < openTimestamp || currentTimestamp > closeTimestamp) {
        let remainingMilliseconds = openTimestamp - currentTimestamp;
        let remainingSeconds = Math.floor((remainingMilliseconds / 1000) % 60);
        let remainingMinutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
        let remainingHours = Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24);
        let remainingDays = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));

        return {
            status: 'Closed',
            remainingDays,
            remainingHours,
            remainingMinutes,
            remainingSeconds,
        };
    }

    let remainingMilliseconds = closeTimestamp - currentTimestamp;
    let remainingSeconds = Math.floor((remainingMilliseconds / 1000) % 60);
    let remainingMinutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
    let remainingHours = Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24);
    let remainingDays = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));

    return {
        status: 'Open',
        remainingDays,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
    };
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});