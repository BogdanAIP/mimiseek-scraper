export type ResourceType =
  | "bot"
  | "miniapp"
  | "channel"
  | "group"
  | "site"
  | "service"
  | "agent"
  | "file";

/**
 * Модель ресурса, совместимая с mimiseek-catalog admin API.
 * Должна совпадать по полям с тем, что ожидает /api/v1/admin/resources.
 */
export interface MimiResource {
  id: string;
  title: string;
  type: ResourceType;
  deeplink: string;
  shortDescription?: string;
  longDescription?: string;
  functions: string[];  // slugs: search, publish, integrate, ...
  topics: string[];     // slugs: technology, ai_ml, music, ...
  language: string;     // slugs: ru, en, ...
  compat: string;       // L0 / L1 / L2
  audience?: string;    // all, 13+, 16+, 18+
  formats?: string[];   // text, video, audio, ...
  tags: string[];
  isPromoted?: boolean;
  weight?: number;
}

/**
 * Сырой ресурс, как его отдаёт внешний источник.
 * Для каждого источника будет свой маппинг Raw -> MimiResource.
 */
export interface RawResource {
  sourceId: string;     // внутренний id внутри источника
  name: string;
  url: string;
  description?: string;
  tags?: string[];
  meta?: Record<string, unknown>;
}
