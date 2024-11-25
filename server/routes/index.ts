import express from "express";
const router = express.Router();

/* GET home page. TODO make this display swagger UI */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Reldo API" });
});

export default router;
