const TimeOfDay = () => {
    let date = new Date();
    let currentDayState = "Morning";
    if (date.getHours() >= 12 && date.getHours() < 17) {
        currentDayState = "Afternoon";
    } else if (date.getHours() >= 17) {
        currentDayState = "Evening";
    }
    return currentDayState;
}

export {
    TimeOfDay
}