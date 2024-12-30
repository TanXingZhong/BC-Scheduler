export const default_time_zone = "Asia/Singapore";

export const toSGDateTime = (date) => {
  const options = {
    timeZone: default_time_zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const singaporeDateTime = new Date(date).toLocaleString("en-GB", options);
  return singaporeDateTime;
};
export const toSGDate = (date) => {
  const options = {
    timeZone: default_time_zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const singaporeDate = new Date(date).toLocaleString("en-GB", options);
  return singaporeDate;
};
export const toSGTime = (date) => {
  const options = {
    timeZone: default_time_zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const singaporeTime = new Date(date).toLocaleString("en-GB", options);
  return singaporeTime;
};

export const forumToSGDate = (date) => {
  const options = {
    timeZone: default_time_zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Format the date in Singapore Time (SGT)
  const singaporeDate = new Date(date).toLocaleDateString("en-GB", options);

  // Return in yyyy-mm-dd format
  const [day, month, year] = singaporeDate.split("/");
  return `${year}-${month}-${day}`; // Reformat to yyyy-mm-dd
};

export const forumToSGTime = (date) => {
  const options = {
    timeZone: default_time_zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Format the date in Singapore Time (SGT)
  const singaporeTime = new Intl.DateTimeFormat("en-GB", options).format(
    new Date(date)
  );

  // Return the time in HH:mm:ss format
  return singaporeTime;
};

export const toSGTimeShort = (date) => {
  const options = {
    timeZone: default_time_zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const singaporeTime = new Date(date).toLocaleString("en-GB", options);
  return singaporeTime;
};

export const timePrettier = (startTime, endTime) => {
  // Helper function to convert 24-hour time to 12-hour format with am/pm
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Adjust hours for 12-hour format
    return `${hours}.${minutes < 10 ? "0" + minutes : minutes}${period}`;
  };

  // Helper function to calculate the time difference in hours and minutes
  const calculateTimeDifference = (start, end) => {
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60; // Account for end time being on the next day
    }

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const diffHours = Math.floor(diffMinutes / 60);
    const diffRemainingMinutes = diffMinutes % 60;

    return `${diffHours}h ${diffRemainingMinutes}m`;
  };

  // Convert both times to 12-hour format
  const startFormatted = convertTo12HourFormat(startTime);
  const endFormatted = convertTo12HourFormat(endTime);

  // Calculate the time difference
  const timeDifference = calculateTimeDifference(startTime, endTime);

  // Return the formatted result
  return `${startFormatted} - ${endFormatted} - ${timeDifference}`;
};
