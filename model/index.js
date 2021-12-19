const fs = require("fs/promises");

const path = require("path");
const res = require("express/lib/response");
const { nanoid } = require("nanoid");

const pathName = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(pathName);
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(pathName, "utf-8");
    const parsedData = JSON.parse(data);
    return (response = parsedData.find(
      (item) => Number(item.id) === Number(contactId)
    ));
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(pathName, "utf-8");
    const parsedData = JSON.parse(data);
    const filteredData = parsedData.filter(
      (item) => item.id.toString() !== contactId.toString()
    );
    if (filteredData.length !== parsedData.length) {
      fs.writeFile(pathName, JSON.stringify(filteredData));
      return { message: "contact deleted" };
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  const newContact = {
    id: nanoid(),
    name: name,
    email: email,
    phone: phone,
  };
  const data = await fs.readFile(pathName, "utf-8");
  const parsedData = JSON.parse(data);
  parsedData.push(newContact);
  fs.writeFile(pathName, JSON.stringify(parsedData));
  return newContact;
};

const updateContact = async (body, contactId) => {
  const data = await fs.readFile(pathName, "utf-8");
  const parsedData = JSON.parse(data);
  const contactToUpdate = parsedData.find(
    (item) => item.id.toString() === contactId.toString()
  );
  if (!contactToUpdate) return;
  const newContact = {
    id: contactToUpdate.id,
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  parsedData.splice(parsedData.indexOf(contactToUpdate), 1, newContact);
  fs.writeFile(pathName, JSON.stringify(parsedData));
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
