import { executeQuery } from "./userService"; // Reuse the shared `executeQuery`

interface Task {
  id: number;
  label: string;
  description: string;
  skillRequirements: string[]; // Replace with the correct data type
  category: string;
  subcategory: string;
  prerequisites: string[]; // Replace with the correct data type
}

// Fetch tasks from the database
export const fetchTasks = async (): Promise<Task[]> => {
  const query = "SELECT * FROM public.tb_source_leaguetasks"; // Replace with your actual table
  try {
    const tasks = await executeQuery<Task>(query, []);
    return tasks;
  } catch (error) {
    console.error("Error in fetchTasksService:", (error as Error).message);
    throw new Error("Failed to fetch tasks");
  }
};
