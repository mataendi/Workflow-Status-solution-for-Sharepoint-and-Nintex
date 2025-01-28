
function calculateDayDifference(userStart) {
    const startDate = new Date(userStart);
    const currentDate = new Date();
    const differenceInMs = currentDate - startDate;
    
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    
    return Math.round(differenceInDays);
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}|${hours}:${minutes}:${seconds}`;
}

module.exports ={
    calculateDayDifference,
    formatDate
}