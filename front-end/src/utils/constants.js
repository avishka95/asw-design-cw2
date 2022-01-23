export const MONTHS = {
    "JANUARY": {
        "value": "JANUARY",
        "title": "January"
    },
    "FEBRUARY": {
        "value": "FEBRUARY",
        "title": "February"
    },
    "MARCH": {
        "value": "MARCH",
        "title": "March"
    },
    "APRIL": {
        "value": "APRIL",
        "title": "April"
    },
    "MAY": {
        "value": "MAY",
        "title": "May"
    },
    "JUNE": {
        "value": "JUNE",
        "title": "June"
    },
    "JULY": {
        "value": "JULY",
        "title": "July"
    },
    "AUGUST": {
        "value": "AUGUST",
        "title": "August"
    },
    "SEPTEMBER": {
        "value": "SEPTEMBER",
        "title": "September"
    },
    "OCTOBER": {
        "value": "OCTOBER",
        "title": "October"
    },
    "NOVEMBER": {
        "value": "NOVEMBER",
        "title": "November"
    },
    "DECEMBER": {
        "value": "DECEMBER",
        "title": "December"
    }
};

export const getMonths = () => {
    return Object.values(MONTHS);
};

export const getMonthForConstant = (constant) => {
    var month = MONTHS[constant];
    if (month) {
        return month.title;
    } else {
        return "Not specified";
    }
};

export const getMonthObjForConstant = (constant) => {
    var month = MONTHS[constant];
    if (month) {
        return month;
    } else {
        return {
            "value": "NO_SPECIFIED",
            "title": "Not specified"
        };
    }
};