require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { add } = require("date-fns/add");
const { removeScheduleFromUser, addScheduleToUser } = require("./db");

//To Shift to Config
// Create a MySQL connection pool
const pool = require("../config/db_pool").pool;

async function checkUserExistsInSchedule(schedule_id, email) {
  try {
    const schedule = await getScheduleById(schedule_id);
    const emails_json = schedule[0].employee_emails;
    const emails = JSON.parse(emails_json);

    return emails.body.includes(email);
  } catch (err) {
    throw new Error(err);
  }
}

async function checkScheduleIdExists(schedule_id) {
  const query = "SELECT * FROM schedule WHERE schedule_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [schedule_id]);
    return rows.length > 0;
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteScheduleId(schedule_id) {
  const query = "DELETE FROM schedule WHERE schedule_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [schedule_id]);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function checkVacantSchedule(schedule_id) {
  const query = "SELECT vacancy FROM schedule WHERE schedule_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [schedule_id]);
    return rows[0].vacancy > 0;
  } catch (err) {
    throw new Error(err);
  }
}

async function addSchedule(outlet_name, start_time, end_time, vacancy) {
  const empty = JSON.stringify({ body: [] });
  const query =
    "INSERT INTO schedule (outlet_name, start_time, end_time, vacancy, employee_emails, employee_names) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    const [rows, fields] = await pool.execute(query, [
      outlet_name,
      start_time,
      end_time,
      vacancy,
      empty,
      empty,
    ]);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllSchedules() {
  const query = "SELECT * FROM schedule";
  try {
    const [rows, fields] = await pool.execute(query);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function getScheduleById(schedule_id) {
  const query = "SELECT * FROM schedule WHERE schedule_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [schedule_id]);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function getUserByScheduleId(schedule_id) {
  const query =
    "SELECT employee_emails, employee_names FROM schedule WHERE schedule_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [schedule_id]);
    const emails_json = rows[0].employee_emails;
    const names_json = rows[0].employee_names;
    const emails = JSON.parse(emails_json);
    const names = JSON.parse(names_json);

    return { emails: emails.body, names: names.body };
  } catch (err) {
    throw new Error(err);
  }
}

async function updateSchedule(
  schedule_id,
  outlet_name,
  start_time,
  end_time,
  vacancy,
  emails,
  names
) {
  const query =
    "UPDATE schedule SET outlet_name = ?, start_time = ?, end_time = ?, vacancy = ?, employee_emails = ?, employee_names = ? WHERE schedule_id = ?";

  const employee_emails = JSON.stringify({ body: emails });
  const employee_names = JSON.stringify({ body: names });

  try {
    const schedule = await getScheduleById(schedule_id);

    console.log(schedule[0].employee_emails.body);

    const old_emails = schedule[0].employee_emails.body;
    // remove schedule from all exsisting users registered to this schedule
    for (let i = 0; i < old_emails.length; i++) {
      await removeScheduleFromUser(old_emails[i], schedule_id);
    }
    console.log("ASD");
    console.log(emails);
    console.log("removed");
    // add schedule to all new users registered to this schedule

    for (let i = 0; i < emails.length; i++) {
      await addScheduleToUser(emails[i], schedule_id, start_time, end_time);
    }

    const [rows, fields] = await pool.execute(query, [
      outlet_name,
      start_time,
      end_time,
      vacancy,
      employee_emails,
      employee_names,
      schedule_id,
    ]);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function addUserToSchedule(schedule_id, email, name) {
  try {
    const schedule = await getScheduleById(schedule_id);
    const emails_json = schedule[0].employee_emails;
    const names_json = schedule[0].employee_names;
    const emails = JSON.parse(emails_json);
    const names = JSON.parse(names_json);

    emails.body.push(email);
    names.body.push(name);

    const emails_string = JSON.stringify(emails);
    const names_string = JSON.stringify(names);
    const vacancy = schedule[0].vacancy - 1;

    if (vacancy < 0) {
      throw new Error("Vacancy is less than 0");
    }

    const query =
      "UPDATE schedule SET employee_emails = ?, employee_names = ?, vacancy = ? WHERE schedule_id = ?";
    const [rows, fields] = await pool.execute(query, [
      emails_string,
      names_string,
      vacancy,
      schedule_id,
    ]);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  addUserToSchedule,
  updateSchedule,
  getUserByScheduleId,
  getScheduleById,
  getAllSchedules,
  addSchedule,
  checkVacantSchedule,
  deleteScheduleId,
  checkScheduleIdExists,
  checkUserExistsInSchedule,
};
