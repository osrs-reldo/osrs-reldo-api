import express, { Request, Response } from "express";
import {
  submitBug,
  submitSuggestion,
  submitFeedback,
} from "../service/feedbackService";
const router = express.Router();

router.post("/", function (req: Request, res: Response) {
  submitFeedback(req.body)
    .then((response) => {
      if (response.status !== 201) {
        console.error(response);
      }
      res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/bug", function (req, res) {
  submitBug(req.body)
    .then((response) => {
      if (response.status !== 201) {
        console.error(response);
      }
      res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/suggestion", function (req, res) {
  submitSuggestion(req.body)
    .then((response) => {
      if (response.status !== 201) {
        console.error(response);
      }
      res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
