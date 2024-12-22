require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { add } = require("date-fns/add");
const { removeScheduleFromUser, addScheduleToUser } = require("./db");

//To Shift to Config
// Create a MySQL connection pool
const pool = require("../config/db_pool").pool;

async function checkUserExistsInSchedule(schedule_id, id) {
    try {
        const schedule = await getScheduleById(schedule_id);
        const ids = schedule[0].employee_ids.body;
        
        return ids.includes(id);
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
        const ids = schedule[0].employee_ids.body;
        for(let i = 0;i < ids.length; i++) {
            await removeScheduleFromUser(ids[i], schedule_id);
        }
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
    const query = "INSERT INTO schedule (outlet_name, start_time, end_time, vacancy, employee_ids, employee_emails) VALUES (?, ?, ?, ?, ?, ?)";
    try {
        const [rows, fields] = await pool.execute(query, [outlet_name, start_time, end_time, vacancy, empty, empty]);
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
    const query = "SELECT employee_emails, employee_names FROM schedule WHERE schedule_id = ?";
    try {
        const [rows, fields] = await pool.execute(query, [schedule_id]);
        
        const ids = rows[0].employee_ids;
        const emails = rows[0].employee_emails;

        return { ids: ids, emails: emails };
    } catch (err) {
        throw new Error(err);
    }
}

async function updateSchedule(schedule_id, outlet_name, start_time, end_time, vacancy, ids, emails) {
    const query = "UPDATE schedule SET outlet_name = ?, start_time = ?, end_time = ?, vacancy = ?, employee_ids = ?, employee_emails = ? WHERE schedule_id = ?";
    
    const employee_ids = JSON.stringify({body: ids});
    const employee_emails = JSON.stringify({body: emails});

    try {
        const schedule = await getScheduleById(schedule_id);

        // remove schedule from all exsisting users registered to this schedule
        const old_ids = (schedule[0].employee_ids.body);
        for(let i = 0;i < old_ids.length; i++) {
            await removeScheduleFromUser(old_ids[i], schedule_id);
        }
        // add schedule to all new users registered to this schedule
        for(let i = 0;i < ids.length; i++) {
            console.log(ids[i]);
            await addScheduleToUser(ids[i], schedule_id, start_time, end_time);
        }

        const [rows, fields] = await pool.execute(query, [outlet_name, start_time, end_time, vacancy, employee_ids, employee_emails, schedule_id]);
        return rows;
    } catch (err) {
        throw new Error(err);
    }
}

async function addUserToSchedule(schedule_id, id, email) {
    try {
        const schedule = await getScheduleById(schedule_id);
        const ids = schedule[0].employee_ids.body;
        const emails = schedule[0].employee_emails.body;

        ids.push(id);
        emails.push(email);

        const new_ids = JSON.stringify({body: ids});
        const new_emails = JSON.stringify({body: emails});
        const new_vacancy = schedule[0].vacancy - 1;

        if(new_vacancy < 0) {
            throw new Error("Vacancy is less than 0");
        }
        await addScheduleToUser(id, schedule_id, schedule[0].start_time, schedule[0].end_time);

        const query = "UPDATE schedule SET employee_ids = ?, employee_emails = ?, vacancy = ? WHERE schedule_id = ?";
        const [rows, fields] = await pool.execute(query, [new_ids, new_emails, new_vacancy, schedule_id]);
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
    checkUserExistsInSchedule
};