require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { add } = require("date-fns/add");
const { removeScheduleFromUser, checkConflicts } = require("./db");

//To Shift to Config
// Create a MySQL connection pool
const pool = require("../config/db_pool").pool;

async function checkUserExistsInSchedule(schedule_id, id) {
    try {
        const schedule = await getUserByScheduleId(schedule_id);
        
        return schedule.find(user => user.user_id == id);
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
        const schedule = await getScheduleById(schedule_id);
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
    const empty = JSON.stringify({body: []});
    const query = "INSERT INTO schedule (outlet_name, start_time, end_time, vacancy) VALUES (?, ?, ?, ?)";
    try {
        const [rows, fields] = await pool.execute(query, [outlet_name, start_time, end_time, vacancy]);
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

async function getAllSchedulesAndUsers() {
    const query = "SELECT s.schedule_id, s.vacancy, s.start_time, s.end_time, s.outlet_name, u.id, u.name FROM schedule s, confirmed_slots c, users u WHERE s.schedule_id = c.schedule_id AND u.id = c.user_id";
    try {
        const [rows, fields] = await pool.execute(query);
        return rows;
    } catch (err) {
        throw new Error(err);
    }
}

async function getAllShiftsByUser(user_id) {
    const query = "SELECT s.schedule_id, s.vacancy, s.start_time, s.end_time, s.outlet_name, u.id, u.name FROM schedule s, confirmed_slots c, users u WHERE s.schedule_id = c.schedule_id AND u.id = c.user_id AND u.id=?";
    try {
        const [rows, fields] = await pool.execute(query, [user_id]);
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
    const query = "SELECT u.id, u.email  FROM confirmed_slots c, users u WHERE schedule_id = ? AND c.user_id = u.id";
    try {
        const [rows, fields] = await pool.execute(query, [schedule_id]);

        return rows;
    } catch (err) {
        throw new Error(err);
    }
}

async function updateSchedule(schedule_id, outlet_name, start_time, end_time, vacancy, ids, emails) {
    const query = "UPDATE schedule SET outlet_name = ?, start_time = ?, end_time = ?, vacancy = ? WHERE schedule_id = ?";

    try {
        const schedule = await getScheduleById(schedule_id);

        const [rows, fields] = await pool.execute(query, [outlet_name, start_time, end_time, vacancy, schedule_id]);
        return rows;
    } catch (err) {
        throw new Error(err);
    }
}

async function addUserToSchedule(schedule_id, id) {
    try {
        const schedule = await getScheduleById(schedule_id);

        const new_vacancy = schedule[0].vacancy - 1;

        if(new_vacancy < 0) {
            throw new Error("Vacancy is less than 0");
        }

        const userShifts = await getAllShiftsByUser(id);
        console.log(userShifts);
        console.log(schedule[0].start_time);
        console.log(schedule[0].end_time);
        if (await checkConflicts(userShifts, schedule[0].start_time, schedule[0].end_time)) {
            throw new Error("Shifts conflict");
        }

        const query = "UPDATE schedule SET vacancy = ? WHERE schedule_id = ?";
        const [rows, fields] = await pool.execute(query, [new_vacancy, schedule_id]);

        const insertQuery = "INSERT INTO confirmed_slots (schedule_id, user_id) VALUES (?, ?)";
        await pool.execute(insertQuery, [schedule_id, id]);
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
    getAllSchedulesAndUsers
};