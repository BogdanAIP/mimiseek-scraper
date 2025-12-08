import fs from "fs";
import path from "path";
import { MimiResource } from "./types";
import { pushResourcesToCatalog } from "./catalogClient";

function loadResourcesFromFile(fileName: string): MimiResource[] {
  const fullPath = path.join(__dirname, "..", "data", fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Файл ${fullPath} не найден. Создай data/${fileName} с массивом MimiResource.`
    );
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`Ожидался массив ресурсов в ${fileName}.`);
  }

  // Минимальная проверка структуры, основная валидация будет на стороне mimiseek-catalog
  return parsed as MimiResource[];
}

async function main() {
  try {
    const resources = loadResourcesFromFile("import.json");
    console.log(
      `[mimiseek-scraper] Загружено из файла ${resources.length} ресурсов.`
    );

    await pushResourcesToCatalog(resources);
    console.log("[mimiseek-scraper] Импорт завершён.");
  } catch (err: any) {
    console.error("[mimiseek-scraper] Ошибка в процессе импорта:", err?.message || err);
    process.exit(1);
  }
}

// Запускаем
main();
