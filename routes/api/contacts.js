const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { Contact } = require("../../model");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string()
    .min(10)
    .max(14)
    .pattern(/^\+?[0-9]+$/)
    .required(),
});

router.get("/", async (req, res, next) => {
  try {
    const data = await Contact.find();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("Cast to OdjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findOneAndRemove(contactId);
    if (!deleteContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
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
  const data = await Contact.findByIdAndUpdate(req.body, req.params.contactId);
  if (data) {
    return res.json(data);
  }
  next();
});

router.patch("/:id/favorite", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate({
      contactId,
      ...req.body,
    });
    if (!updateContact) {
      error.status = 400;
      throw error;
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
