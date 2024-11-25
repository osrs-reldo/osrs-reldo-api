import { Router } from "express";
import { loginHandler } from "../service/userService";

const router = Router();

router.post("/", (req, res) => {
  loginHandler(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  });
});

export default router;
