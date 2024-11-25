const BASE_URL = "https://oldschool.runescape.wiki/api.php";
const USER_AGENT = "ReldoApp";

enum Action {
  Search = "opensearch",
}

enum Format {
  JSON = "json",
}

function buildURL(
  action: Action,
  format: Format,
  queryParams: Record<string, string>,
): string {
  const stringQuery = Object.keys(queryParams)
    .map((key) => `&${key}=${queryParams[key]}`)
    .join("");
  return `${BASE_URL}?action=${action}&format=${format}${stringQuery}`;
}

/**
 * Plaintext wiki search, returns mapping of result page titles to page urls.
 *
 * Ex: search "abyssal" returns:
 * {
 *  "Abyssal": "https://oldschool.runescape.wiki/w/Abyssal",
 *  "Abyssal whip": "https://oldschool.runescape.wiki/w/Abyssal_whip",
 *  ...etc
 * }
 */
export async function textSearch(
  searchString: string,
): Promise<Record<string, string>> {
  const url = buildURL(Action.Search, Format.JSON, { search: searchString });
  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-agent": USER_AGENT,
    },
  });

  const jsonResult = await result.json();
  const parsedResults: Record<string, string> = {};
  for (let i = 0; i < jsonResult[1].length; i++) {
    parsedResults[jsonResult[1][i]] = jsonResult[3][i];
  }
  return parsedResults;
}
