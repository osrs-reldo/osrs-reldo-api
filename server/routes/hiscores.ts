import express from "express";
import hiscores, { Gamemode } from "osrs-json-hiscores";
const router = express.Router();

/* GET hiscores lookup. */
router.get("/:rsn", function (req, res, next) {
  hiscores
    .getStatsByGamemode(
      req.params.rsn,
      (req.query.mode as Gamemode) ?? "seasonal",
    )
    .then((response) => res.send(response))
    .catch((err) => {
      console.error(err);
      res.status(err.response?.status ?? 500).send({
        status: err.response?.status,
        error: err,
      });
    });
});

export default router;
