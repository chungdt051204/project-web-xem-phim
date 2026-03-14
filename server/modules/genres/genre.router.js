const express = require("express");
const router = express.Router();
const genreController = require("./genre.controller");
const prefix = "";
router.get(`${prefix}/genre`, genreController.getGenre);
router.post(`${prefix}/genre`, genreController.postGenre);
router.delete(`${prefix}/genre`, genreController.deleteGenre);
router.put(`${prefix}/genre`, genreController.putGenre);
module.exports = router;
