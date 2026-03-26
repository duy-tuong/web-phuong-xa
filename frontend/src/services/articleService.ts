import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import type { Article, ArticleSectionBullet } from "@/types/article";

type ApiArticlesResponse = {
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  data?: ApiArticleListItem[];
};

type ApiArticleListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  createdAt?: string | null;
  category?: string | null;
  author?: string | null;
};

type ApiArticleDetail = ApiArticleListItem & {
  content?: string | null;
};

type ApiCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const DEFAULT_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA8qzrU7hnhsoDY94oufu7hJNCAl4vQEHEAdyibHV-GaB1BzqhGsucfbpVqjXB04TDYe1N7leVbGGm4IBXTVHh5Mp_KyqB1v4c3VSofSf563Peof9QqvE5CW2VcXCz2NUCpcD5w7r-k1nM4UsBIQp3B5AfhUhLPAxE_-VynmBPYJcVvLgwVJNCxqPhoQNE6Uq307xHjr73-vkeUHu1Bc3ov6ygiC9c00RUdsGPW_aGqtEqCUR8IGPw_TK7-88nKBTk2Qnt3qAoU43w7";
const DEFAULT_SUB_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFm0JRe2fQd4evCnKLLptucmVYziq66tEFwbAAfo4Ap6KpVOjeMhtQFrp_vnjasNqkCbX0JHZ8Qog_gr5sWh0Q04Ss6a5riMUH5UyLXuB-CeT16aPb9H63Qv4FUrKhbFJGZ0V_3Embzg6wYkum1vlyWY66p-NUBnVyfdVE7qCoYHwN6jbiY3H9SIGQ3IPxS24nRLjo6TqBvxJyMIVPf3DhnbK6ypjyCVgGkwe_DI6Ky2EsmxMeV3KspqvwliG4SS3DT4Y2ogIGZj_M";

const defaultSectionBullets: ArticleSectionBullet[] = [
  {
    label: "Nang cao chat luong phuc vu",
    text: "Tiep tuc cai tien quy trinh xu ly va tang kha nang tiep can thong tin cho nguoi dan.",
  },
  {
    label: "Tang cuong phoi hop",
    text: "Dong bo giua cac bo phan chuyen mon de bao dam tien do va chat luong trien khai.",
  },
  {
    label: "Theo doi ket qua",
    text: "Duy tri kiem tra dinh ky va cap nhat phan hoi de hoan thien cach van hanh.",
  },
];

const fallbackArticles: Article[] = [
  createFallbackArticle({
    id: 1,
    slug: "ubnd-phuong-cao-lanh-to-chuc-hoi-nghi",
    title: "Dai hoi dai bieu Mat tran To quoc Viet Nam Phuong Cao Lanh nhiem ky 2024-2029 thanh cong tot dep",
    category: "Tin tuc xa hoi",
    date: "15/10/2024",
    author: "Ban Bien Tap",
    views: "1,245 luot xem",
    heroCaption: "Toan canh hoi nghi trien khai cong tac trong tam tai Hoi truong UBND Phuong Cao Lanh.",
    tags: ["Mat tran To quoc", "UBND Phuong", "Tin tuc xa hoi"],
  }),
  createFallbackArticle({
    id: 2,
    slug: "phat-dong-phong-trao-ngay-chu-nhat-xanh-lam-sach-duong-pho",
    title: "Phat dong phong trao Ngay Chu nhat xanh lam sach duong pho",
    category: "Moi truong",
    date: "12/10/2023",
    author: "Doan Thanh Nien",
    views: "1,460 luot xem",
    heroCaption: "Luc luong doan vien ra quan lam sach cac tuyen duong kieu mau tren dia ban phuong.",
    tags: ["Moi truong", "Ngay Chu nhat xanh", "Doan thanh nien"],
  }),
  createFallbackArticle({
    id: 3,
    slug: "trao-tang-100-suat-qua-cho-cac-ho-gia-dinh-co-hoan-canh-kho-khan",
    title: "Trao tang 100 suat qua cho cac ho gia dinh co hoan canh kho khan",
    category: "An sinh xa hoi",
    date: "10/10/2023",
    author: "Uy ban MTTQ",
    views: "2,012 luot xem",
    heroCaption: "Chuong trinh trao qua duoc to chuc nham ho tro kip thoi cac ho gia dinh kho khan.",
    tags: ["An sinh", "Ho tro ho ngheo", "Cong dong"],
  }),
  createFallbackArticle({
    id: 4,
    slug: "cong-bo-ke-hoach-phat-trien-ha-tang-giao-thong-khu-vuc-trung-tam",
    title: "Cong bo ke hoach phat trien ha tang giao thong khu vuc trung tam",
    category: "Kinh te",
    date: "09/10/2023",
    author: "Ban Kinh te",
    views: "1,678 luot xem",
    heroCaption: "Ke hoach nang cap ha tang giao thong duoc cong bo de lay y kien cong dong dan cu.",
    tags: ["Kinh te", "Ha tang", "Giao thong"],
  }),
  createFallbackArticle({
    id: 5,
    slug: "huong-dan-thu-tuc-cap-doi-can-cuoc-cong-dan-gan-chip-dien-tu",
    title: "Huong dan thu tuc cap doi Can cuoc cong dan gan chip dien tu tai phuong",
    category: "Cai cach hanh chinh",
    date: "08/10/2023",
    author: "Bo phan Mot cua",
    views: "2,654 luot xem",
    heroCaption: "Nguoi dan duoc ho tro truc tiep ve quy trinh, ho so va lich tiep nhan thu tuc.",
    tags: ["Thu tuc hanh chinh", "CCCD", "Mot cua"],
  }),
  createFallbackArticle({
    id: 6,
    slug: "thong-bao-lich-thu-gom-rac-thai-sinh-hoat-tren-dia-ban-cac-khom",
    title: "Thong bao lich thu gom rac thai sinh hoat tren dia ban cac khom",
    category: "Thong bao",
    date: "06/10/2023",
    author: "Ban Do thi",
    views: "1,904 luot xem",
    heroCaption: "Lich thu gom rac duoc cap nhat theo tuyen de nguoi dan thuan tien theo doi va phoi hop.",
    tags: ["Moi truong", "Thu gom rac", "Thong bao"],
  }),
];

const fallbackCategories = Array.from(
  new Set(["Tat ca", ...fallbackArticles.map((article) => article.category)]),
);

function createFallbackArticle(input: {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  views: string;
  heroCaption: string;
  tags: string[];
}): Article {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    category: input.category,
    categoryId: slugify(input.category),
    date: input.date,
    author: input.author,
    authorId: slugify(input.author),
    status: "published",
    publishedAt: input.date,
    views: input.views,
    heroImage: DEFAULT_HERO_IMAGE,
    heroCaption: input.heroCaption,
    bodyLead:
      "Noi dung duoc cap nhat tu he thong thong tin dien tu phuong, phan anh cac hoat dong dieu hanh va chuong trinh phuc vu nguoi dan.",
    bodyParagraphs: [
      "Bai viet ghi nhan cac ket qua trien khai tai co so, dong thoi tong hop y kien tu cac don vi lien quan de hoan thien ke hoach hanh dong trong thoi gian toi.",
      "Lanh dao dia phuong nhan manh yeu cau phoi hop chat che giua cac bo phan chuyen mon, tang cuong truyen thong va bao dam tien do thuc hien cac chi tieu da de ra.",
    ],
    sectionTitle: "Muc tieu trien khai",
    sectionIntro: "Trong tam thuc hien giai doan tiep theo gom cac nhom nhiem vu sau:",
    sectionBullets: defaultSectionBullets,
    subImage: DEFAULT_SUB_IMAGE,
    subCaption: "Cac to cong tac dia phuong huong dan nguoi dan tiep can dich vu so va tien ich cong truc tuyen.",
    tags: input.tags,
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

function stripHtml(value?: string | null) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) {
    return "Dang cap nhat";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function buildParagraphs(content?: string | null, excerpt?: string | null) {
  const text = stripHtml(content) || stripHtml(excerpt);
  if (!text) {
    return fallbackArticles[0].bodyParagraphs;
  }

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return [text];
  }

  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return paragraphs.slice(0, 4);
}

function buildLead(content?: string | null, excerpt?: string | null) {
  const lead = stripHtml(excerpt) || buildParagraphs(content, excerpt)[0];
  return lead || fallbackArticles[0].bodyLead;
}

function buildTags(category?: string | null, title?: string | null) {
  const normalizedTitle = stripHtml(title);
  const tags = [category, normalizedTitle.split(" ").slice(0, 3).join(" ")]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  return Array.from(new Set(tags)).slice(0, 3);
}

function adaptArticle(source: ApiArticleListItem | ApiArticleDetail): Article {
  const paragraphs = buildParagraphs("content" in source ? source.content : undefined, source.excerpt);
  const lead = buildLead("content" in source ? source.content : undefined, source.excerpt);
  const category = source.category?.trim() || "Chua phan loai";
  const author = source.author?.trim() || "Ban bien tap";
  const featuredImage = resolveApiAssetUrl(source.featuredImage);

  return {
    id: source.id,
    slug: source.slug,
    title: source.title,
    category,
    categoryId: slugify(category),
    date: formatDate(source.createdAt),
    author,
    authorId: slugify(author),
    status: "published",
    publishedAt: formatDate(source.createdAt),
    views: "Dang cap nhat",
    heroImage: featuredImage || DEFAULT_HERO_IMAGE,
    heroCaption: source.excerpt?.trim() || "Noi dung hinh anh dang duoc cap nhat tu he thong.",
    bodyLead: lead,
    bodyParagraphs: paragraphs,
    sectionTitle: "Muc tieu trien khai",
    sectionIntro: "Cac noi dung trong tam dang duoc dia phuong tiep tuc trien khai va hoan thien:",
    sectionBullets: defaultSectionBullets,
    subImage: featuredImage || DEFAULT_SUB_IMAGE,
    subCaption: "Thong tin, hinh anh va tien do thuc hien dang duoc cap nhat tu he thong du lieu cong.",
    tags: buildTags(category, source.title),
  };
}

async function requestArticlesFromApi() {
  const response = await api.get<ApiArticlesResponse>("/articles", {
    params: {
      page: 1,
      pageSize: 50,
    },
  });

  const rows = Array.isArray(response.data?.data) ? response.data.data : [];
  return rows.map(adaptArticle);
}

function getFallbackArticles() {
  return fallbackArticles.map((article) => ({ ...article }));
}

export async function getArticles(): Promise<Article[]> {
  try {
    const articles = await requestArticlesFromApi();
    if (articles.length > 0) {
      return articles;
    }

    return isDevelopment ? getFallbackArticles() : [];
  } catch (error) {
    console.error("Khong the tai danh sach bai viet:", error);
    return isDevelopment ? getFallbackArticles() : [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await requestArticlesFromApi();
    const article = articles.find((item) => item.slug === slug);

    if (!article) {
      return isDevelopment ? getFallbackArticles().find((item) => item.slug === slug) ?? null : null;
    }

    if (!article.id) {
      return article;
    }

    try {
      const detailResponse = await api.get<ApiArticleDetail>(`/articles/${article.id}`);
      return adaptArticle(detailResponse.data);
    } catch (detailError) {
      console.error(`Khong the tai chi tiet bai viet slug=${slug}:`, detailError);
      return article;
    }
  } catch (error) {
    console.error(`Khong the tai bai viet slug=${slug}:`, error);
    return isDevelopment ? getFallbackArticles().find((item) => item.slug === slug) ?? null : null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await api.get<ApiCategory[]>("/categories");
    const categories = Array.isArray(response.data)
      ? response.data
          .map((category) => category.name?.trim())
          .filter((name): name is string => Boolean(name))
      : [];

    if (categories.length > 0) {
      return ["Tat ca", ...categories];
    }

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tat ca", ...derived] : isDevelopment ? fallbackCategories : ["Tat ca"];
  } catch (error) {
    console.error("Khong the tai danh muc bai viet:", error);

    if (isDevelopment) {
      return fallbackCategories;
    }

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tat ca", ...derived] : ["Tat ca"];
  }
}
