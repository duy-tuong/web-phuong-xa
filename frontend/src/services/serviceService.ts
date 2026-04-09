import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import { slugify } from "@/services/shared/slugify";
import type { ProcedureDetail } from "@/types/service";

type ApiService = {
  id: number;
  name: string;
  category?: string | null;
  field?: string | null;
  description?: string | null;
  requiredDocuments?: string | null;
  processingTime?: string | null;
  fee?: number | string | null;
  templateFile?: string | null;
};

function parseRequiredDocuments(value?: string | null) {
  if (!value) {
    return [] as string[];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [] as string[];
  }

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      // Fall through to delimiter parsing.
    }
  }

  return trimmed
    .split(/\r?\n|;|,|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatFee(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "Đang cập nhật";
  }

  if (typeof value === "number") {
    return `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;
  }

  return String(value).trim();
}

function buildSteps(title: string, processingTime: string) {
  return [
    `Chuẩn bị hồ sơ cho thủ tục ${title.toLowerCase()}.`,
    "Nộp hồ sơ trực tuyến hoặc tại Bộ phận Một cửa của UBND phường.",
    `Cơ quan chuyên môn tiếp nhận, thẩm tra và xử lý hồ sơ trong ${processingTime.toLowerCase()}.`,
    "Nhận kết quả theo phiếu hẹn hoặc thông báo từ hệ thống.",
  ];
}

function adaptProcedure(service: ApiService): ProcedureDetail {
  const requirements = parseRequiredDocuments(service.requiredDocuments);
  const processingTime = service.processingTime?.trim() || "Đang cập nhật";
  const title = service.name.trim();

  return {
    id: service.id,
    slug: slugify(title),
    title,
    field: service.category?.trim() || service.field?.trim() || undefined,
    requiredDocuments: requirements,
    processingTime,
    fee: formatFee(service.fee),
    wordTemplateHref: resolveApiAssetUrl(service.templateFile) || "#",
    requirements,
    steps: buildSteps(title, processingTime),
  };
}

export async function getProcedures(category?: string): Promise<ProcedureDetail[]> {
  try {
    const response = await api.get<ApiService[]>("/services", {
      params: category ? { category } : undefined,
    });
    return Array.isArray(response.data) ? response.data.map(adaptProcedure) : [];
  } catch (error) {
    console.error("Không thể tải danh sách dịch vụ công:", error);
    return [];
  }
}

export async function getServiceCategories(): Promise<string[]> {
  try {
    const response = await api.get<string[]>("/services/categories");
    return Array.isArray(response.data) ? response.data.filter(Boolean) : [];
  } catch (error) {
    console.error("Không thể tải danh sách lĩnh vực dịch vụ:", error);
    return [];
  }
}
