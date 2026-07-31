/**
 * 런타임 입력 검증 유틸리티
 * projects/awards 페이로드의 필드 유효성 검사
 */

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_CONTENT_LENGTH = 100_000;
const MAX_URL_LENGTH = 2048;
const MAX_ORGANIZATION_LENGTH = 200;
const MAX_STACK_NAME_LENGTH = 100;
const MAX_ARRAY_LENGTH = 50;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: string): boolean {
  if (value.length > MAX_URL_LENGTH) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

function isOptionalUrl(value: unknown, field: string, errors: ValidationError[]): void {
  if (value === undefined || value === null || value === "") return;
  if (typeof value !== "string") {
    errors.push({ field, message: `${field} must be a string` });
    return;
  }
  if (!isValidUrl(value)) {
    errors.push({
      field,
      message: `${field} must be a valid HTTP/HTTPS URL (max ${MAX_URL_LENGTH} chars)`,
    });
  }
}

function isOptionalString(
  value: unknown,
  field: string,
  maxLength: number,
  errors: ValidationError[],
): void {
  if (value === undefined || value === null) return;
  if (typeof value !== "string") {
    errors.push({ field, message: `${field} must be a string` });
    return;
  }
  if (value.length > maxLength) {
    errors.push({ field, message: `${field} must be at most ${maxLength} characters` });
  }
}

// --- Project Validation ---

export interface ProjectCreateInput {
  title: string;
  description: string;
  content?: string | null;
  thumbnailUrl?: string | null;
  githubUrl?: string | null;
  deployUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  techStack?: string[];
  relatedPostIds?: string[];
}

export function validateProjectCreate(body: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;

  // 필수 필드
  if (!isNonEmptyString(data.title)) {
    errors.push({ field: "title", message: "title is required" });
  } else if (data.title.length > MAX_TITLE_LENGTH) {
    errors.push({
      field: "title",
      message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
    });
  }

  if (!isNonEmptyString(data.description)) {
    errors.push({ field: "description", message: "description is required" });
  } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push({
      field: "description",
      message: `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
    });
  }

  if (!data.startDate) {
    errors.push({ field: "startDate", message: "startDate is required" });
  } else if (!isValidDateString(data.startDate)) {
    errors.push({ field: "startDate", message: "startDate must be a valid date string" });
  }

  // 선택 필드
  isOptionalString(data.content, "content", MAX_CONTENT_LENGTH, errors);
  isOptionalUrl(data.thumbnailUrl, "thumbnailUrl", errors);
  isOptionalUrl(data.githubUrl, "githubUrl", errors);
  isOptionalUrl(data.deployUrl, "deployUrl", errors);

  if (data.endDate !== undefined && data.endDate !== null) {
    if (!isValidDateString(data.endDate)) {
      errors.push({ field: "endDate", message: "endDate must be a valid date string" });
    }
  }

  if (data.techStack !== undefined) {
    if (!Array.isArray(data.techStack)) {
      errors.push({ field: "techStack", message: "techStack must be an array" });
    } else if (data.techStack.length > MAX_ARRAY_LENGTH) {
      errors.push({
        field: "techStack",
        message: `techStack must have at most ${MAX_ARRAY_LENGTH} items`,
      });
    } else {
      for (const item of data.techStack) {
        if (typeof item !== "string" || item.length > MAX_STACK_NAME_LENGTH) {
          errors.push({
            field: "techStack",
            message: `Each tech stack item must be a string of at most ${MAX_STACK_NAME_LENGTH} characters`,
          });
          break;
        }
      }
    }
  }

  if (data.relatedPostIds !== undefined) {
    if (!Array.isArray(data.relatedPostIds)) {
      errors.push({
        field: "relatedPostIds",
        message: "relatedPostIds must be an array",
      });
    } else if (data.relatedPostIds.length > MAX_ARRAY_LENGTH) {
      errors.push({
        field: "relatedPostIds",
        message: `relatedPostIds must have at most ${MAX_ARRAY_LENGTH} items`,
      });
    } else {
      for (const item of data.relatedPostIds) {
        if (typeof item !== "string") {
          errors.push({
            field: "relatedPostIds",
            message: "Each relatedPostId must be a string",
          });
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateProjectUpdate(body: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;

  // 업데이트 시 모든 필드 선택 사항이나, 제공되면 유효해야 함
  if (data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.push({ field: "title", message: "title must be a non-empty string" });
    } else if (data.title.length > MAX_TITLE_LENGTH) {
      errors.push({
        field: "title",
        message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
      });
    }
  }

  if (data.description !== undefined) {
    if (!isNonEmptyString(data.description)) {
      errors.push({
        field: "description",
        message: "description must be a non-empty string",
      });
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: "description",
        message: `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
      });
    }
  }

  isOptionalString(data.content, "content", MAX_CONTENT_LENGTH, errors);
  isOptionalUrl(data.thumbnailUrl, "thumbnailUrl", errors);
  isOptionalUrl(data.githubUrl, "githubUrl", errors);
  isOptionalUrl(data.deployUrl, "deployUrl", errors);

  if (data.startDate !== undefined) {
    if (!isValidDateString(data.startDate)) {
      errors.push({
        field: "startDate",
        message: "startDate must be a valid date string",
      });
    }
  }

  if (data.endDate !== undefined && data.endDate !== null) {
    if (!isValidDateString(data.endDate)) {
      errors.push({ field: "endDate", message: "endDate must be a valid date string" });
    }
  }

  if (data.techStack !== undefined) {
    if (!Array.isArray(data.techStack)) {
      errors.push({ field: "techStack", message: "techStack must be an array" });
    } else if (data.techStack.length > MAX_ARRAY_LENGTH) {
      errors.push({
        field: "techStack",
        message: `techStack must have at most ${MAX_ARRAY_LENGTH} items`,
      });
    } else {
      for (const item of data.techStack) {
        if (typeof item !== "string" || item.length > MAX_STACK_NAME_LENGTH) {
          errors.push({
            field: "techStack",
            message: `Each tech stack item must be a string of at most ${MAX_STACK_NAME_LENGTH} characters`,
          });
          break;
        }
      }
    }
  }

  if (data.relatedPostIds !== undefined) {
    if (!Array.isArray(data.relatedPostIds)) {
      errors.push({
        field: "relatedPostIds",
        message: "relatedPostIds must be an array",
      });
    } else if (data.relatedPostIds.length > MAX_ARRAY_LENGTH) {
      errors.push({
        field: "relatedPostIds",
        message: `relatedPostIds must have at most ${MAX_ARRAY_LENGTH} items`,
      });
    } else {
      for (const item of data.relatedPostIds) {
        if (typeof item !== "string") {
          errors.push({
            field: "relatedPostIds",
            message: "Each relatedPostId must be a string",
          });
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// --- Award Validation ---

export interface AwardCreateInput {
  title: string;
  description?: string | null;
  organization: string;
  date: string;
  imageUrl?: string | null;
  projectId?: string | null;
}

export function validateAwardCreate(body: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;

  if (!isNonEmptyString(data.title)) {
    errors.push({ field: "title", message: "title is required" });
  } else if (data.title.length > MAX_TITLE_LENGTH) {
    errors.push({
      field: "title",
      message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
    });
  }

  if (!isNonEmptyString(data.organization)) {
    errors.push({ field: "organization", message: "organization is required" });
  } else if (data.organization.length > MAX_ORGANIZATION_LENGTH) {
    errors.push({
      field: "organization",
      message: `organization must be at most ${MAX_ORGANIZATION_LENGTH} characters`,
    });
  }

  if (!data.date) {
    errors.push({ field: "date", message: "date is required" });
  } else if (!isValidDateString(data.date)) {
    errors.push({ field: "date", message: "date must be a valid date string" });
  }

  isOptionalString(data.description, "description", MAX_DESCRIPTION_LENGTH, errors);
  isOptionalUrl(data.imageUrl, "imageUrl", errors);

  if (data.projectId !== undefined && data.projectId !== null) {
    if (typeof data.projectId !== "string") {
      errors.push({ field: "projectId", message: "projectId must be a string" });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateAwardUpdate(body: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;

  if (data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.push({ field: "title", message: "title must be a non-empty string" });
    } else if (data.title.length > MAX_TITLE_LENGTH) {
      errors.push({
        field: "title",
        message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
      });
    }
  }

  if (data.organization !== undefined) {
    if (!isNonEmptyString(data.organization)) {
      errors.push({
        field: "organization",
        message: "organization must be a non-empty string",
      });
    } else if (data.organization.length > MAX_ORGANIZATION_LENGTH) {
      errors.push({
        field: "organization",
        message: `organization must be at most ${MAX_ORGANIZATION_LENGTH} characters`,
      });
    }
  }

  if (data.date !== undefined) {
    if (!isValidDateString(data.date)) {
      errors.push({ field: "date", message: "date must be a valid date string" });
    }
  }

  isOptionalString(data.description, "description", MAX_DESCRIPTION_LENGTH, errors);
  isOptionalUrl(data.imageUrl, "imageUrl", errors);

  if (data.projectId !== undefined && data.projectId !== null) {
    if (typeof data.projectId !== "string") {
      errors.push({ field: "projectId", message: "projectId must be a string" });
    }
  }

  return { valid: errors.length === 0, errors };
}

// --- Post Validation ---

export interface PostMutationInput {
  title: string;
  summary?: string | null;
  thumbnailUrl?: string | null;
  date: string;
  categories: string[];
  content?: string | null;
  projectIds?: string[];
}

function validateStringArray(
  value: unknown,
  field: string,
  itemMaxLength: number,
  errors: ValidationError[],
): void {
  if (!Array.isArray(value)) {
    errors.push({ field, message: `${field} must be an array` });
    return;
  }
  if (value.length > MAX_ARRAY_LENGTH) {
    errors.push({
      field,
      message: `${field} must have at most ${MAX_ARRAY_LENGTH} items`,
    });
    return;
  }
  if (
    value.some(
      (item) =>
        typeof item !== "string" ||
        item.trim().length === 0 ||
        item.length > itemMaxLength,
    )
  ) {
    errors.push({
      field,
      message: `Each ${field} item must be a non-empty string of at most ${itemMaxLength} characters`,
    });
  }
}

function validatePost(body: unknown, partial: boolean): ValidationResult {
  const errors: ValidationError[] = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;
  if (!partial || data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.push({ field: "title", message: "title is required" });
    } else if (data.title.length > MAX_TITLE_LENGTH) {
      errors.push({
        field: "title",
        message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
      });
    }
  }
  if (!partial || data.date !== undefined) {
    if (!isValidDateString(data.date)) {
      errors.push({ field: "date", message: "date must be a valid date string" });
    }
  }
  if (!partial || data.categories !== undefined) {
    validateStringArray(data.categories, "categories", MAX_STACK_NAME_LENGTH, errors);
  }
  if (data.projectIds !== undefined) {
    validateStringArray(data.projectIds, "projectIds", MAX_TITLE_LENGTH, errors);
  }
  isOptionalString(data.summary, "summary", MAX_DESCRIPTION_LENGTH, errors);
  isOptionalString(data.content, "content", MAX_CONTENT_LENGTH, errors);
  isOptionalUrl(data.thumbnailUrl, "thumbnailUrl", errors);

  return { valid: errors.length === 0, errors };
}

export function validatePostCreate(body: unknown): ValidationResult {
  return validatePost(body, false);
}

export function validatePostUpdate(body: unknown): ValidationResult {
  return validatePost(body, true);
}

// --- Stack Validation ---

export interface StackMutationInput {
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  category?: string | null;
}

function validateStack(body: unknown, partial: boolean): ValidationResult {
  const errors: ValidationError[] = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be an object" }],
    };
  }

  const data = body as Record<string, unknown>;
  if (!partial || data.name !== undefined) {
    if (!isNonEmptyString(data.name)) {
      errors.push({ field: "name", message: "name is required" });
    } else if (data.name.length > MAX_STACK_NAME_LENGTH) {
      errors.push({
        field: "name",
        message: `name must be at most ${MAX_STACK_NAME_LENGTH} characters`,
      });
    }
  }
  isOptionalUrl(data.imageUrl, "imageUrl", errors);
  isOptionalString(data.description, "description", MAX_DESCRIPTION_LENGTH, errors);
  isOptionalString(data.category, "category", MAX_STACK_NAME_LENGTH, errors);

  return { valid: errors.length === 0, errors };
}

export function validateStackCreate(body: unknown): ValidationResult {
  return validateStack(body, false);
}

export function validateStackUpdate(body: unknown): ValidationResult {
  return validateStack(body, true);
}
