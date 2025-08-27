// Temporary scaffold to enable tests; replace with actual implementation.
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  type?: string;
  scope?: string;
  subject?: string;
}

export const CONVENTIONAL_TYPES = ["feat","fix","docs","style","refactor","perf","test","build","ci","chore","revert"];

export function parseCommitMessage(msg: string): { type?: string; scope?: string; subject?: string } {
  const m = msg.match(/^(\w+)(\([\w\-./]+\))?!?:\s+(.+)$/);
  if (!m) return {};
  const type = m[1];
  const scope = m[2]?.slice(1, -1);
  const subject = m[3];
  return { type, scope, subject };
}

export function validateCommitMessage(msg: string): ValidationResult {
  const trimmed = (msg ?? "").trim();
  if (!trimmed) return { valid: false, errors: ["empty message"] };
  const { type, scope, subject } = parseCommitMessage(trimmed);
  const errors: string[] = [];
  if (!type) errors.push("missing type");
  if (type && !CONVENTIONAL_TYPES.includes(type)) errors.push(`invalid type: ${type}`);
  if (!subject) errors.push("missing subject");
  return { valid: errors.length === 0, errors, type, scope, subject };
}

export async function runCommitChecks(message: string): Promise<ValidationResult> {
  return validateCommitMessage(message);
}