import { Client } from "pg";
import { QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

// Define a Skill type
interface Skill {
  type: string;
  level: number;
  experience: number;
}

// Define a Boss type
interface Boss {
  name: string;
  killCount: number;
}

// Define a Character type
interface Character {
  id: number;
  character_name: string;
  user_id: number;
  skills?: Skill[];
  bosses?: Boss[];
}

// PostgreSQL Client Setup
const pool = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

// Connect the pool
pool.connect().catch((err) => {
  console.error("Failed to connect to PostgreSQL:", err.message);
  process.exit(1);
});

// Execute Query Helper
const executeQuery = async <T extends QueryResultRow>(
  query: string,
  params: unknown[],
): Promise<T[]> => {
  const result = await pool.query<T>(query, params);
  return result.rows;
};

// Save Character Stats
export const saveCharacterStats = async (
  characterName: string,
  userId: number,
  skills: Skill[],
  bosses: Boss[],
): Promise<number> => {
  try {
    const characterQuery =
      "INSERT INTO characters (character_name, user_id) VALUES ($1, $2) RETURNING id";

    const characterResult = await executeQuery<{ id: number }>(characterQuery, [
      characterName,
      userId,
    ]);

    const characterId = characterResult[0].id;

    // Save skills
    const skillQuery =
      "INSERT INTO skills (character_id, skill_type, level, experience) VALUES ($1, $2, $3, $4)";
    for (const skill of skills) {
      await executeQuery(skillQuery, [
        characterId,
        skill.type,
        skill.level,
        skill.experience,
      ]);
    }

    // Save bosses
    const bossQuery =
      "INSERT INTO bosses (character_id, boss_name, kill_count) VALUES ($1, $2, $3)";
    for (const boss of bosses) {
      await executeQuery(bossQuery, [characterId, boss.name, boss.killCount]);
    }

    return characterId;
  } catch (error) {
    throw new Error(`Error saving character stats: ${String(error)}`);
  }
};

// Get Character Stats
export const getCharacterStats = async (
  characterId: number,
): Promise<Character | null> => {
  try {
    const characterQuery = "SELECT * FROM characters WHERE id = $1";

    const characters = await executeQuery<Character>(characterQuery, [
      characterId,
    ]);

    if (characters.length === 0) return null;

    const skillsQuery = "SELECT * FROM skills WHERE character_id = $1";
    const skills = await executeQuery<Skill>(skillsQuery, [characterId]);

    const bossesQuery = "SELECT * FROM bosses WHERE character_id = $1";
    const bosses = await executeQuery<Boss>(bossesQuery, [characterId]);

    return { ...characters[0], skills, bosses };
  } catch (error) {
    throw new Error(
      `Error retrieving character stats: ${String((error as Error).message)}`,
    );
  }
};

// Update Character Stats
export const updateCharacterStats = async (
  characterId: number,
  skills: Skill[],
  bosses: Boss[],
): Promise<void> => {
  try {
    const skillQuery =
      "UPDATE skills SET level = $1, experience = $2 WHERE character_id = $3 AND skill_type = $4";
    for (const skill of skills) {
      await executeQuery(skillQuery, [
        skill.level,
        skill.experience,
        characterId,
        skill.type,
      ]);
    }

    const bossQuery =
      "UPDATE bosses SET kill_count = $1 WHERE character_id = $2 AND boss_name = $3";
    for (const boss of bosses) {
      await executeQuery(bossQuery, [boss.killCount, characterId, boss.name]);
    }
  } catch (error) {
    throw new Error(
      `Error updating character stats: ${String((error as Error).message)}`,
    );
  }
};

// Get All Character Stats
export const getAllCharacterStats = async (
  userId: number | null,
): Promise<Character[]> => {
  try {
    const query =
      userId !== null
        ? "SELECT * FROM characters WHERE user_id = $1"
        : "SELECT * FROM characters";
    const params = userId !== null ? [userId] : [];
    return await executeQuery<Character>(query, params);
  } catch (error) {
    throw new Error(
      `Error retrieving all character stats: ${String((error as Error).message)}`,
    );
  }
};
