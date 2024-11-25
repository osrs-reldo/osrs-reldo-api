import fetch from "node-fetch";

export type CreateTaskResult =
  | {
      status: 201;
      message: string;
    }
  | {
      status: number;
      error: string;
    };

export async function createTask(
  title: string,
  listId: string,
  content: string,
): Promise<CreateTaskResult> {
  try {
    const res = await fetch(`${process.env.HEIGHT_API_ENDPOINT ?? ""}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `api-key ${process.env.HEIGHT_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        name: title,
        listIds: [listId],
        description: `${content} \n\n(submitted ${new Date().toISOString()})`,
      }),
    });
    const json: { id: string } = await res.json();
    return {
      status: 201,
      message: `Task ID ${json.id ?? "UNKNOWN_ID"} successfully created!`,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      error: err,
    };
  }
}
