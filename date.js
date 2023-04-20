function date(apiDate) {
    let currentDate = new Date(apiDate);
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = String(currentDate.getUTCFullYear()).slice(2)
    let hours = currentDate.getHours()
    let minutes = currentDate.getMinutes()
    if (currentDate.getDate() < 10) {
        date = '0' + date;
    }
    if (currentDate.getMonth() < 10) {
        month = '0' + month;
    }
    if (currentDate.getHours() < 10) {
        hours = '0' + hours;
    }
    if (currentDate.getMinutes() < 10) {
        minutes = '0' + minutes;
    }
    return date + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
}
export default date;