export const default_time_zone = "Asia/Singapore";

export const dateToDBDate = (inputDate) => {
  const date = new Date(inputDate);
  const singaporeDate = new Date(
    date.toLocaleString("en-US", { timeZone: default_time_zone })
  );

  return `${singaporeDate.getFullYear()}/${String(
    singaporeDate.getMonth() + 1
  ).padStart(2, "0")}/${String(singaporeDate.getDate()).padStart(2, "0")}`;
};

export function joinDateToDBDate(inputDate) {
  const date = new Date(inputDate);
  const singaporeDate = new Date(
    date.toLocaleString("en-US", { timeZone: default_time_zone })
  );

  // Format as YYYY-MM-DD HH:MM:SS
  const year = singaporeDate.getFullYear();
  const month = String(singaporeDate.getMonth() + 1).padStart(2, "0");
  const day = String(singaporeDate.getDate()).padStart(2, "0");
  const hours = String(singaporeDate.getHours()).padStart(2, "0");
  const minutes = String(singaporeDate.getMinutes()).padStart(2, "0");
  const seconds = String(singaporeDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
