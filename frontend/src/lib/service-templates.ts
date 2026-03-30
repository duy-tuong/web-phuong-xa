import { normalizeKeyword } from "@/lib/normalize";
import type { MediaFile } from "@/types";
import type { ProcedureDetail } from "@/types/service";

export type DownloadableTemplate = {
  id: string;
  title: string;
  field: string;
  href: string;
};

export function inferServiceField(title: string) {
  const normalized = normalizeKeyword(title);

  if (normalized.includes("khai sinh") || normalized.includes("khai tu") || normalized.includes("ket hon")) {
    return "Hộ tịch";
  }

  if (normalized.includes("tam tru") || normalized.includes("tam vang") || normalized.includes("cu tru")) {
    return "Cư trú";
  }

  if (normalized.includes("kinh doanh") || normalized.includes("doanh nghiep")) {
    return "Kinh doanh";
  }

  if (normalized.includes("dat") || normalized.includes("nha") || normalized.includes("bat dong san")) {
    return "Đất đai";
  }

  if (normalized.includes("xay dung") || normalized.includes("cong trinh")) {
    return "Xây dựng";
  }

  if (normalized.includes("ngheo") || normalized.includes("an sinh") || normalized.includes("bao tro")) {
    return "An sinh";
  }

  return "Hành chính công";
}

function formatTemplateTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Biểu mẫu";
}

function getTemplateUrlKey(value: string) {
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const url = new URL(value);
      return `${url.pathname}${url.search}`;
    }
  } catch {
    // Keep the original value when URL parsing fails.
  }

  return value;
}

export function buildDownloadableTemplates(procedures: ProcedureDetail[], documents: MediaFile[]): DownloadableTemplate[] {
  const templatesFromProcedures = procedures
    .filter((procedure) => procedure.wordTemplateHref && procedure.wordTemplateHref !== "#")
    .map((procedure) => ({
      id: `procedure-${procedure.slug}`,
      title: procedure.title,
      field: inferServiceField(procedure.title),
      href: procedure.wordTemplateHref,
    }));

  const procedureFieldByUrl = new Map<string, string>(
    templatesFromProcedures.map((item) => [getTemplateUrlKey(item.href), item.field]),
  );

  const templatesFromDocuments = documents.map((file) => {
    const href = file.url || file.filePath;
    const title = formatTemplateTitle(file.fileName);
    const urlKey = getTemplateUrlKey(href);

    return {
      id: `media-${file.id}`,
      title,
      field: procedureFieldByUrl.get(urlKey) || inferServiceField(title),
      href,
    };
  });

  const merged = [...templatesFromDocuments, ...templatesFromProcedures];
  const seen = new Set<string>();

  return merged.filter((template) => {
    const key = getTemplateUrlKey(template.href);

    if (!key || key === "#" || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
