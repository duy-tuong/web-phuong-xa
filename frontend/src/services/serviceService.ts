import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import type { ProcedureDetail } from "@/types/service";

type ApiService = {
  id: number;
  name: string;
  description?: string | null;
  requiredDocuments?: string | null;
  processingTime?: string | null;
  fee?: number | string | null;
  templateFile?: string | null;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const fallbackProcedures: ProcedureDetail[] = [
  createFallbackProcedure({
    id: 1,
    slug: "khai-sinh",
    title: "Đăng ký khai sinh",
    processingTime: "Trong ngày làm việc",
    fee: "Miễn phí",
    wordTemplateHref: "/files/forms/khai-sinh.docx",
    requirements: [
      "Tờ khai đăng ký khai sinh theo mẫu",
      "Giấy chứng sinh bản chính hoặc bản sao hợp lệ",
      "CCCD/CMND của cha hoặc mẹ",
    ],
  }),
  createFallbackProcedure({
    id: 2,
    slug: "ket-hon",
    title: "Đăng ký kết hôn",
    processingTime: "Ngay trong ngày nếu hồ sơ hợp lệ",
    fee: "Miễn phí",
    wordTemplateHref: "/files/forms/ket-hon.docx",
    requirements: [
      "Tờ khai đăng ký kết hôn của hai bên",
      "CCCD/CMND hoặc hộ chiếu còn giá trị",
      "Giấy xác nhận tình trạng hôn nhân nếu thuộc trường hợp phải nộp",
    ],
  }),
  createFallbackProcedure({
    id: 3,
    slug: "dang-ky-ho-kinh-doanh",
    title: "Cấp giấy chứng nhận đăng ký hộ kinh doanh",
    processingTime: "03 ngày làm việc",
    fee: "100.000 VND",
    wordTemplateHref: "/files/forms/dang-ky-ho-kinh-doanh.docx",
    requirements: [
      "Giấy đề nghị đăng ký hộ kinh doanh",
      "Bản sao CCCD/CMND của chủ hộ kinh doanh",
      "Giấy tờ chứng minh quyền sử dụng địa điểm kinh doanh",
    ],
  }),
  createFallbackProcedure({
    id: 4,
    slug: "khai-tu",
    title: "Đăng ký khai tử",
    processingTime: "Ngay trong ngày",
    fee: "Miễn phí",
    wordTemplateHref: "/files/forms/khai-tu.docx",
    requirements: [
      "Tờ khai đăng ký khai tử theo mẫu",
      "Giấy báo tử hoặc giấy tờ thay thế theo quy định",
      "CCCD/CMND của người đi khai tử",
    ],
  }),
  createFallbackProcedure({
    id: 5,
    slug: "xac-nhan-tinh-trang-bat-dong-san",
    title: "Xác nhận tình trạng bất động sản",
    processingTime: "05 ngày làm việc",
    fee: "50.000 VND",
    wordTemplateHref: "/files/forms/xac-nhan-tinh-trang-bat-dong-san.docx",
    requirements: [
      "Đơn đề nghị xác nhận tình trạng bất động sản",
      "Bản sao giấy tờ quyền sử dụng đất, quyền sở hữu nhà ở",
      "CCCD/CMND của người đề nghị",
    ],
  }),
];

function createFallbackProcedure(input: {
  id: number;
  slug: string;
  title: string;
  processingTime: string;
  fee: string;
  wordTemplateHref: string;
  requirements: string[];
}): ProcedureDetail {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    requiredDocuments: input.requirements,
    processingTime: input.processingTime,
    fee: input.fee,
    wordTemplateHref: input.wordTemplateHref,
    requirements: input.requirements,
    steps: [
      "Chuẩn bị đầy đủ hồ sơ theo danh mục yêu cầu.",
      "Nộp hồ sơ tại Bộ phận Một cửa hoặc qua cổng dịch vụ công trực tuyến.",
      "Theo dõi trạng thái xử lý và bổ sung giấy tờ khi được yêu cầu.",
      "Nhận kết quả theo thời gian hẹn từ cơ quan tiếp nhận.",
    ],
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
    .split(/\r?\n|;|,|•|-/)
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
    requiredDocuments: requirements,
    processingTime,
    fee: formatFee(service.fee),
    wordTemplateHref: resolveApiAssetUrl(service.templateFile) || "#",
    requirements,
    steps: buildSteps(title, processingTime),
  };
}

function getFallbackProcedures() {
  return fallbackProcedures.map((procedure) => ({ ...procedure }));
}

export async function getProcedures(): Promise<ProcedureDetail[]> {
  try {
    const response = await api.get<ApiService[]>("/services");
    const rows = Array.isArray(response.data) ? response.data.map(adaptProcedure) : [];

    if (rows.length > 0) {
      return rows;
    }

    return isDevelopment ? getFallbackProcedures() : [];
  } catch (error) {
    console.error("Không thể tải danh sách dịch vụ công:", error);
    return isDevelopment ? getFallbackProcedures() : [];
  }
}
