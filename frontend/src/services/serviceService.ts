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
    title: "Dang ky khai sinh",
    processingTime: "Trong ngay lam viec",
    fee: "Mien phi",
    wordTemplateHref: "/files/forms/khai-sinh.docx",
    requirements: [
      "To khai dang ky khai sinh theo mau",
      "Giay chung sinh ban chinh hoac ban sao hop le",
      "CCCD/CMND cua cha hoac me",
    ],
  }),
  createFallbackProcedure({
    id: 2,
    slug: "ket-hon",
    title: "Dang ky ket hon",
    processingTime: "Ngay trong ngay neu ho so hop le",
    fee: "Mien phi",
    wordTemplateHref: "/files/forms/ket-hon.docx",
    requirements: [
      "To khai dang ky ket hon cua hai ben",
      "CCCD/CMND hoac ho chieu con gia tri",
      "Giay xac nhan tinh trang hon nhan neu thuoc truong hop phai nop",
    ],
  }),
  createFallbackProcedure({
    id: 3,
    slug: "dang-ky-ho-kinh-doanh",
    title: "Cap Giay chung nhan dang ky ho kinh doanh",
    processingTime: "03 ngay lam viec",
    fee: "100.000 VND",
    wordTemplateHref: "/files/forms/dang-ky-ho-kinh-doanh.docx",
    requirements: [
      "Giay de nghi dang ky ho kinh doanh",
      "Ban sao CCCD/CMND cua chu ho kinh doanh",
      "Giay to chung minh quyen su dung dia diem kinh doanh",
    ],
  }),
  createFallbackProcedure({
    id: 4,
    slug: "khai-tu",
    title: "Dang ky khai tu",
    processingTime: "Ngay trong ngay",
    fee: "Mien phi",
    wordTemplateHref: "/files/forms/khai-tu.docx",
    requirements: [
      "To khai dang ky khai tu theo mau",
      "Giay bao tu hoac giay to thay the theo quy dinh",
      "CCCD/CMND cua nguoi di khai tu",
    ],
  }),
  createFallbackProcedure({
    id: 5,
    slug: "xac-nhan-tinh-trang-bat-dong-san",
    title: "Xac nhan tinh trang bat dong san",
    processingTime: "05 ngay lam viec",
    fee: "50.000 VND",
    wordTemplateHref: "/files/forms/xac-nhan-tinh-trang-bat-dong-san.docx",
    requirements: [
      "Don de nghi xac nhan tinh trang bat dong san",
      "Ban sao giay to quyen su dung dat, quyen so huu nha o",
      "CCCD/CMND cua nguoi de nghi",
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
      "Chuan bi day du ho so theo danh muc yeu cau.",
      "Nop ho so tai Bo phan Mot cua hoac qua cong dich vu cong truc tuyen.",
      "Theo doi trang thai xu ly va bo sung giay to khi duoc yeu cau.",
      "Nhan ket qua theo thoi gian hen tu co quan tiep nhan.",
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
    return "Dang cap nhat";
  }

  if (typeof value === "number") {
    return `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;
  }

  return String(value).trim();
}

function buildSteps(title: string, processingTime: string) {
  return [
    `Chuan bi ho so cho thu tuc ${title.toLowerCase()}.`,
    "Nop ho so truc tuyen hoac tai Bo phan Mot cua UBND phuong.",
    `Co quan chuyen mon tiep nhan, tham tra va xu ly ho so trong ${processingTime.toLowerCase()}.`,
    "Nhan ket qua theo phieu hen hoac thong bao tu he thong.",
  ];
}

function adaptProcedure(service: ApiService): ProcedureDetail {
  const requirements = parseRequiredDocuments(service.requiredDocuments);
  const processingTime = service.processingTime?.trim() || "Dang cap nhat";
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
    console.error("Khong the tai danh sach dich vu cong:", error);
    return isDevelopment ? getFallbackProcedures() : [];
  }
}
