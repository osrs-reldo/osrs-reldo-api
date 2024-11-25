import express, { NextFunction, Request, Response } from "express";
import { fetchTasks } from "../service/fetchTasksService";
import { executeQuery } from "../service/userService";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

const storageRouter = express.Router();

storageRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const tasks = await fetchTasks();
      const difficulties = await executeQuery(
        "SELECT * FROM tb_difficulty",
        [],
      );
      const diaryDifficulties = await executeQuery(
        "SELECT * FROM tb_diary_difficulty",
        [],
      );
      const diaryLocations = await executeQuery(
        "SELECT * FROM tb_diary_locations",
        [],
      );
      const quests = await executeQuery("SELECT * FROM tb_quests", []);
      // const regions = await executeQuery('SELECT * FROM tb_regions', []);
      const trophies = await executeQuery("SELECT * FROM tb_trophies", []);
      const questDifficulty = await executeQuery(
        "SELECT * FROM tb_quest_difficulty",
        [],
      );
      const questLength = await executeQuery(
        "SELECT * FROM tb_quest_length",
        [],
      );
      const questStatus = await executeQuery(
        "SELECT * FROM tb_quest_status",
        [],
      );
      const bosses = await executeQuery("SELECT * FROM tb_bosses", []);
      const stats = await executeQuery("SELECT * FROM tb_stats", []);
      const sourceCombat = await executeQuery(
        "SELECT * FROM tb_source_combat",
        [],
      );
      const sourceLeagueTasks = await executeQuery(
        "SELECT * FROM tb_source_leaguetasks",
        [],
      );
      res.status(200).json({
        tasks,
        difficulties,
        diaryDifficulties,
        diaryLocations,
        quests,
        // regions,
        trophies,
        questDifficulty,
        questLength,
        questStatus,
        bosses,
        stats,
        sourceCombat,
        sourceLeagueTasks,
      });
    } catch (error) {
      console.error("Error in fetching storage data:", error.message);
      res.status(500).json({ error: "Failed to fetch storage data" });
    }
  }),
);
export default storageRouter;
