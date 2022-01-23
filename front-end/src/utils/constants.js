export const MONTHS = {
    "JANUARY": {
        "value": "JANUARY",
        "title": "January"
    },
    "FEBRUARY": {
        "value": "FEBRUARY",
        "title": "February"
    }
};

export const getMonths = () => {
    return Object.values(MONTHS);
};

export const getMonthForConstant = (constant) => {
    var month = MONTHS[constant];
    if(month){
        return month.title;
    } else {
        return "Not specified";
    }
};