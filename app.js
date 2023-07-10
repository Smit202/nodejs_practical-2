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
    let date = new Date();
    // console.log(date);
    // console.log(date.getTimezoneOffset());
    // date = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    console.log(date);
    // date.setHours(19);
    // date.setMinutes(49);
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone); 
    currentDay = date.getDay();
    currentHours = date.getHours();
    currentMinutes = date.getMinutes();
    let currentTime = [date.getHours(), date.getMinutes(), date.getDay()];
    const daySchedule = schedule.find(item => item.day === days[currentTime[2]]);

    console.log(currentTime);

    if(daySchedule) {

        let openTime = daySchedule.open.split(' ');
        openTime[0] = +openTime[0].slice(0, 2);
        openTime[1] = +openTime[1];
 
        let closeTime = daySchedule.close.split(' ');
        closeTime[0] = +closeTime[0].slice(0, 2);
        closeTime[1] = +closeTime[1];

        // Converting 12 hour open and close time format to 24 hour format
        if (openTime[2] === 'PM' && openTime[0] !== 12) openTime[0] += 12;
        else if (openTime[2] === 'AM' && openTime[0] === 12) openTime[0] = 0;

        if (closeTime[2] === 'PM' && closeTime[0] !== 12) closeTime[0] += 12;
        else if (closeTime[2] === 'AM' && closeTime[0] === 12) openTime[0] = 0;

        console.log(openTime);
        console.log(closeTime);

        if (currentTime[0] < openTime[0])   {
            
        };
        if (currentTime[0] === openTime[0]) {
            return currentTime[1] < openTime[1] ? 'Closed' : 'Open';
        }
        if (currentTime[0] === closeTime[0]) {
            return currentTime[1] > closeTime[1] ? 'Closed' : 'Open';
        }
        if(currentTime[0] > openTime[0] && currentTime[0] < closeTime[0])   return 'Open';
        return 'Closed';
    }
    
    return 'Closed';
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});