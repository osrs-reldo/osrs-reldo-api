import { CreateTaskResult, createTask } from "../client/heightClient";

type FormData = {
  description: string;
  reproSteps?: string;
  device?: string;
  client?: string;
  debugInfo?: string;
};

export async function submitBug(formData: FormData): Promise<CreateTaskResult> {
  const { description, reproSteps, device, debugInfo, client } = formData;
  return await createTask(
    `Bug Report: ${description.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_BUGS ?? "",
    [
      description,
      "# Reproduction steps:",
      reproSteps ?? "None",
      "# System info:",
      device ?? "Unknown",
      "# Client:",
      client ?? "N/A",
      "# Localstorage dump:",
      debugInfo ?? "N/A",
    ].join("\n"),
  );
}

export async function submitSuggestion(
  formData: FormData,
): Promise<CreateTaskResult> {
  const suggestionContent = formData.description;
  return await createTask(
    `Suggestion: ${suggestionContent.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_SUGGESTIONS ?? "",
    suggestionContent,
  );
}

export async function submitFeedback(
  formData: FormData,
): Promise<CreateTaskResult> {
  const feedbackContent = formData.description;
  return await createTask(
    `Feedback: ${feedbackContent.substring(0, 30)}`,
    process.env.HEIGHT_LIST_ID_FEEDBACK ?? "",
    feedbackContent,
  );
}
