const exp = require("express");
const commonApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel");
const AdminModel = require("../models/adminModel");
const expressAsyncHandler = require("express-async-handler");

commonApp.get(
  "/get-all",
  expressAsyncHandler(async (req, res) => {
    const AllUsers = await UserAuthor.find();
    res.status(201).send({ message: "success", payload: AllUsers });
  })
);
commonApp.get(
  "/get-admins",
  expressAsyncHandler(async (req, res) => {
    const AllAdmins = await AdminModel.find();
    res.status(201).send({ message: "success", payload: AllAdmins });
  })
);

module.exports = commonApp;
