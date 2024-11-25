import express, { Request, Response, NextFunction } from "express";
import { executeQuery } from "../service/userService";

const asyncHandler =
  <
    P = Record<string, unknown>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = unknown,
  >(
    fn: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction,
    ) => Promise<unknown>,
  ) =>
  (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ): void => {
    fn(req, res, next).catch(next);
  };

const getDisplayNamesRouter = express.Router();

// Define the route to fetch display names
getDisplayNamesRouter.get(
  "/",
  asyncHandler(
    async (
      req: Request<
        Record<string, unknown>,
        unknown,
        unknown,
        { username?: string }
      >,
      res: Response,
    ) => {
      const { username } = req.query;

      // Validate the query parameter
      if (!username) {
        return res.status(400).json({ error: "A valid username is required" });
      }

      try {
        // Execute the query to fetch display names
        const displayNames = await executeQuery(
          `
        SELECT DISTINCT display_name
        FROM tb_plug_data
        WHERE user_id = (SELECT id FROM users WHERE username = $1)
        `,
          [username],
        );

        // Map the results and return them
        return res.json(
          displayNames.map((row: { display_name: string }) => row.display_name),
        );
      } catch (err) {
        console.error("Error fetching display names:", err);
        return res.status(500).json({
          error: "Failed to fetch display names. Please try again later.",
        });
      }
    },
  ),
);

export default getDisplayNamesRouter;
