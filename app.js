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
        console.log(checkStatus(schedule));
        // res.send(checkStatus(schedule));
        res.render('index');
    });
});

function checkStatus(schedule) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = new Date();
    // console.log(date);
    // console.log(date.getTimezoneOffset());
    // date = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    console.log(date);
    date.setHours(7);
    date.setMinutes(30);
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone); 
    currentDay = date.getDay();
    currentHours = date.getHours();
    currentMinutes = date.getMinutes();
    const daySchedule = schedule.find(item => item.day === days[currentDay]);

    console.log(currentHours, currentMinutes, currentDay);

    if(daySchedule) {

        let openTime = daySchedule.open.split(' ');
        let openHours = +openTime[0].slice(0, 2);
        let openMinutes = +openTime[1];
        let openMeridiem = openTime[2];
 
        let closeTime = daySchedule.close.split(' ');
        let closeHours = +closeTime[0].slice(0, 2);
        let closeMinutes = +closeTime[1];
        let closeMeridiem = closeTime[2];

        if (openMeridiem === 'PM' && openHours !== 12) openHours += 12;
        else if (openMeridiem === 'AM' && openHours === 12) openHours = 0;

        if (closeMeridiem === 'PM' && closeHours !== 12) closeHours += 12;
        else if (closeMeridiem === 'AM' && closeHours === 12) openHours = 0;

        console.log(openHours, openMinutes, openMeridiem);
        console.log(closeHours, closeMinutes, closeMeridiem);

        if (currentHours < openHours) return 'closed';
        if (currentHours === openHours) {
            return currentMinutes < openMinutes ? 'closed' : 'open';
        }
        if (currentHours === closeHours) {
            return currentMinutes > closeMinutes ? 'closed' : 'open';
        }
        if(currentHours > openHours && currentHours < closeHours)   return 'open';
        return 'closed';
    }
    
    return 'closed';
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});