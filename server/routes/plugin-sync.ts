import express, { NextFunction, Request, Response } from "express";
import { executeQuery } from "../service/userService";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

const pluginSyncRouter = express.Router();

pluginSyncRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Incoming payload:", JSON.stringify(req.body, null, 2));

    try {
      const { username, token, data } = req.body;

      // Validate token and username
      if (!username || !token || !data) {
        res
          .status(400)
          .json({ error: "Missing required fields in request body" });
        return;
      }

      let parsedData;
      try {
        // Parse the JSON string in the data field
        parsedData = JSON.parse(data);
      } catch (err) {
        console.error("Failed to parse data JSON:", err.message);
        res.status(400).json({ error: "Invalid JSON format in data field" });
        return;
      }

      console.log("Parsed data:", parsedData);

      const { displayName, timestamp } = parsedData;

      // Validate required fields
      if (!displayName || !timestamp) {
        res
          .status(400)
          .json({ error: "Missing required fields in parsed data" });
        return;
      }

      // Fetch user ID for the given username
      const userResult = await executeQuery(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );
      if (userResult.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userId = userResult[0].id;

      // Insert the JSON data into the `tb_plug_data` table
      await executeQuery(
        `
          INSERT INTO tb_plug_data (user_id, display_name, timestamp, data)
          VALUES ($1, $2, $3, $4::JSONB)
        `,
        [userId, displayName, new Date(timestamp), JSON.stringify(parsedData)],
      );

      res.status(200).json({ message: "Plugin data synced successfully" });
    } catch (error) {
      console.error("Error syncing plugin data:", error.message);
      res.status(500).json({ error: "Failed to sync plugin data" });
    }
  }),
);

pluginSyncRouter.get(
  "/importData",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { username, displayName } = req.query;
      // Validate query parameters
      if (!username || !displayName) {
        res
          .status(400)
          .json({ error: "Missing username or displayName in request" });
        return;
      }
      // Fetch the user ID for the username
      const userResult = await executeQuery(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );
      if (userResult.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userId = userResult[0].id;
      // Retrieve the stored JSON data for this display name
      const dataResult = await executeQuery(
        "SELECT data FROM tb_plug_data WHERE user_id = $1 AND display_name = $2",
        [userId, displayName],
      );
      if (dataResult.length === 0) {
        res
          .status(404)
          .json({ error: "No data found for the specified displayName" });
        return;
      }
      res.status(200).json({
        message: "Data retrieved successfully",
        data: dataResult[0].data,
      });
    } catch (error) {
      console.error("Error retrieving data:", error.message);
      res.status(500).json({ error: "Failed to retrieve data" });
    }
  }),
);

export default pluginSyncRouter;
