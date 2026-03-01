const subscriptionModel = require("../models/subscriptionModel");
const { validationResult } = require("express-validator");
const HTTP = require("../config/httpStatus"); // import constants

// GET ALL
const getAll = async (req, res) => {
  try {
    const data = await subscriptionModel.getAllSubscriptions(req.user.id);
    res.status(HTTP.OK).json({ success: true, message: "Subscriptions fetched successfully", data });
    // console.log(data);
  } catch (error) {
    console.error("GET ALL ERROR:", error.message);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
  }
};

// GET BY ID
const getById = async (req, res) => {
  try {
    const data = await subscriptionModel.getSubscriptionById(req.params.id, req.user.id);
    if (!data) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: "Subscription not found" });
    }
    res.status(HTTP.OK).json({ success: true, message: "Subscription fetched successfully", data });
  } catch (error) {
    console.error("GET BY ID ERROR:", error.message);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
  }
};

// CREATE
const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "Validation failed", data: errors.array() });
  }

  try {
    const result = await subscriptionModel.createSubscription(req.body, req.user.id);
    res.status(HTTP.CREATED).json({ success: true, message: "Subscription created successfully", data: { subscription_id: result.insertId } });
  } catch (error) {
    console.error("CREATE ERROR:", error.message);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
  }
};

// UPDATE
const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "Validation failed", data: errors.array() });
  }

  try {
    const result = await subscriptionModel.updateSubscription(req.params.id, req.body, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: "Subscription not found" });
    }
    res.status(HTTP.OK).json({ success: true, message: "Subscription updated successfully" });
  } catch (error) {
    console.error("UPDATE ERROR:", error.message);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
  }
};

// DELETE
const remove = async (req, res) => {
  try {
    const result = await subscriptionModel.deleteSubscription(req.params.id, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: "Subscription not found" });
    }
    res.status(HTTP.OK).json({ success: true, message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};