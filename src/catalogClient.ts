import axios from "axios";
import dotenv from "dotenv";
import { MimiResource } from "./types";

dotenv.config();

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:4000";

const CATALOG_ADMIN_TOKEN = process.env.CATALOG_ADMIN_TOKEN;

if (!CATALOG_ADMIN_TOKEN) {
  console.warn(
    "[mimiseek-scraper] WARNING: CATALOG_ADMIN_TOKEN is not set. " +
      "Запросы к admin API mimiseek-catalog будут падать с 401."
  );
}

/**
 * Отправляет массив ресурсов в mimiseek-catalog admin API.
 * Использует тот же контракт, что и /api/v1/admin/resources:
 * тело = объект или массив объектов.
 */
export async function pushResourcesToCatalog(
  resources: MimiResource[]
): Promise<void> {
  if (!CATALOG_ADMIN_TOKEN) {
    throw new Error("CATALOG_ADMIN_TOKEN is not set in env");
  }

  if (resources.length === 0) {
    console.log("[mimiseek-scraper] Нет ресурсов для отправки в каталог.");
    return;
  }

  console.log(
    `[mimiseek-scraper] Отправляем ${resources.length} ресурсов в mimiseek-catalog...`
  );

  try {
    const resp = await axios.post(
      `${CATALOG_BASE_URL}/api/v1/admin/resources`,
      resources,
      {
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": CATALOG_ADMIN_TOKEN
        },
        // на всякий случай увеличим timeout для больших батчей
        timeout: 60_000
      }
    );

    console.log(
      "[mimiseek-scraper] Ответ от mimiseek-catalog:",
      JSON.stringify(resp.data, null, 2)
    );
  } catch (err: any) {
    console.error("[mimiseek-scraper] Ошибка при отправке в mimiseek-catalog:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Body:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message || err);
    }
    throw err;
  }
}
