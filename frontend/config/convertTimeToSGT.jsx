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

export const forumToSGTime = (date) => {
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
