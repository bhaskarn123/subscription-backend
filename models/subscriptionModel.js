const db = require("../config/db");

// ================= GET ALL (ONLY USER'S DATA) =================
const getAllSubscriptions = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM subscriptions WHERE user_id = ?",
        [userId]
    );
    return rows;
};


// ================= GET BY ID (ONLY IF BELONGS TO USER) =================
const getSubscriptionById = async (id, userId) => {
    const [rows] = await db.query(
        "SELECT * FROM subscriptions WHERE subscription_id = ? AND user_id = ?",
        [id, userId]
    );
    return rows[0];
};


// ================= CREATE (ATTACH USER_ID AUTOMATICALLY) =================
const createSubscription = async (data, userId) => {
    const { plan_name, start_date, end_date, monthly_cost, status } = data;

    const query = `
        INSERT INTO subscriptions
        (user_id, plan_name, start_date, end_date, monthly_cost, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        userId,
        plan_name,
        start_date,
        end_date,
        monthly_cost,
        status
    ]);

    return result;
};


// ================= UPDATE (ONLY IF BELONGS TO USER) =================
const updateSubscription = async (id, data, userId) => {
    const { plan_name, start_date, end_date, monthly_cost, status } = data;

    const query = `
        UPDATE subscriptions
        SET plan_name = ?, start_date = ?, end_date = ?, monthly_cost = ?, status = ?
        WHERE subscription_id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [
        plan_name,
        start_date,
        end_date,
        monthly_cost,
        status,
        id,
        userId
    ]);

    return result;
};


// ================= DELETE (ONLY IF BELONGS TO USER) =================
const deleteSubscription = async (id, userId) => {
    const [result] = await db.query(
        "DELETE FROM subscriptions WHERE subscription_id = ? AND user_id = ?",
        [id, userId]
    );

    return result;
};


module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription
};