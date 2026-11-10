import "server-only";

type QueryBody = {
  success?: boolean;
  errors?: Array<{ message?: string }>;
  result?: Array<{ success?: boolean; error?: string; results?: unknown[] }>;
};

export class D1Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "D1Error";
  }
}

export function isUniqueViolation(error: unknown): boolean {
  return error instanceof D1Error && /UNIQUE constraint failed/i.test(error.message);
}

function configured() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !databaseId || !token) {
    throw new D1Error("Cloudflare D1 is not configured.");
  }
  return { accountId, databaseId, token };
}

export async function d1All<T>(sql: string, params: Array<string | number | null> = []): Promise<T[]> {
  const { accountId, databaseId, token } = configured();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql,
        params: params.map((value) => (value === null ? null : String(value))),
      }),
      cache: "no-store",
    },
  );

  let body: QueryBody;
  try {
    body = (await response.json()) as QueryBody;
  } catch {
    throw new D1Error(`D1 returned an unreadable response (${response.status}).`);
  }

  const message = [
    ...(body.errors?.map((error) => error.message) ?? []),
    ...((body.result ?? []).map((item) => item.error)),
  ]
    .filter(Boolean)
    .join("; ");
  if (!response.ok || body.success === false || body.result?.[0]?.success === false) {
    throw new D1Error(message || `D1 request failed (${response.status}).`);
  }

  return (body.result?.[0]?.results ?? []) as T[];
}

export async function d1One<T>(sql: string, params: Array<string | number | null> = []): Promise<T | null> {
  const rows = await d1All<T>(sql, params);
  return rows[0] ?? null;
}
