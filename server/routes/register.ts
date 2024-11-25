import { Router, Request, Response } from "express";
import { registerUser } from "../service/userService";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { username, password } = req.body;

  registerUser(username, password)
    .then(() => {
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    })
    .catch((error) => {
      console.error("Error in registerUser:", error);
      if (error.code === "ER_DUP_ENTRY") {
        res
          .status(409)
          .json({ success: false, message: "Username already exists" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Error registering user" });
      }
    });
});

export default router;
