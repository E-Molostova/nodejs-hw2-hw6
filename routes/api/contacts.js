const express = require("express");
const router = express.Router();

const index = require("../../model/index");
const Joi = require("joi");
const { json } = require("express/lib/response");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .pattern(
      new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
      )
    )
    .required(),
  phone: Joi.string()
    .min(10)
    .max(14)
    .pattern(/^\+?[0-9]+$/)
    .required(),
});

router.get("/", async (req, res, next) => {
  const data = await index.listContacts();
  return res.status(200).json(data);
});

router.get("/:contactId", async (req, res, next) => {
  const data = await index.getContactById(req.params.contactId);
  if (data) return res.json(data);
  next();
});

router.post("/", async (req, res, next) => {
  try {
    Joi.attempt(req.body, schema);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const data = await index.addContact(req.body);
  res.json(data);
});

router.delete("/:contactId", async (req, res, next) => {
  const data = await index.removeContact(req.params.contactId);
  if (data) {
    return res.json(data);
  }
  next();
});

router.put("/:contactId", async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing fields" });
  }
  try {
    Joi.attempt(req.body, schema);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const data = await index.updateContact(req.body, req.params.contactId);
  if (data) {
    return res.json(data);
  }
  next();
});

module.exports = router;
