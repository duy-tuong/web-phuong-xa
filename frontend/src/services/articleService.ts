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
  isFeatured?: boolean;
  featured?: boolean;
  IsFeatured?: boolean;
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
    label: "Nâng cao chất lượng phục vụ",
    text: "Tiếp tục cải tiến quy trình xử lý và tăng khả năng tiếp cận thông tin cho người dân.",
  },
  {
    label: "Tăng cường phối hợp",
    text: "Đồng bộ giữa các bộ phận chuyên môn để bảo đảm tiến độ và chất lượng triển khai.",
  },
  {
    label: "Theo dõi kết quả",
    text: "Duy trì kiểm tra định kỳ và cập nhật phản hồi để hoàn thiện cách vận hành.",
  },
];

const fallbackArticles: Article[] = [
  createFallbackArticle({
    id: 1,
    slug: "ubnd-phuong-cao-lanh-to-chuc-hoi-nghi",
    title: "Đại hội đại biểu Mặt trận Tổ quốc Việt Nam Phường Cao Lãnh nhiệm kỳ 2024-2029 thành công tốt đẹp",
    category: "Tin tức xã hội",
    date: "15/10/2024",
    author: "Ban Biên tập",
    views: "1,245 lượt xem",
    heroCaption: "Toàn cảnh hội nghị triển khai công tác trọng tâm tại Hội trường UBND Phường Cao Lãnh.",
    tags: ["Mặt trận Tổ quốc", "UBND Phường", "Tin tức xã hội"],
  }),
  createFallbackArticle({
    id: 2,
    slug: "phat-dong-phong-trao-ngay-chu-nhat-xanh-lam-sach-duong-pho",
    title: "Phát động phong trào Ngày Chủ nhật xanh làm sạch đường phố",
    category: "Môi trường",
    date: "12/10/2023",
    author: "Đoàn Thanh niên",
    views: "1,460 lượt xem",
    heroCaption: "Lực lượng đoàn viên ra quân làm sạch các tuyến đường kiểu mẫu trên địa bàn phường.",
    tags: ["Môi trường", "Ngày Chủ nhật xanh", "Đoàn thanh niên"],
  }),
  createFallbackArticle({
    id: 3,
    slug: "trao-tang-100-suat-qua-cho-cac-ho-gia-dinh-co-hoan-canh-kho-khan",
    title: "Trao tặng 100 suất quà cho các hộ gia đình có hoàn cảnh khó khăn",
    category: "An sinh xã hội",
    date: "10/10/2023",
    author: "Ủy ban MTTQ",
    views: "2,012 lượt xem",
    heroCaption: "Chương trình trao quà được tổ chức nhằm hỗ trợ kịp thời các hộ gia đình khó khăn.",
    tags: ["An sinh", "Hỗ trợ hộ nghèo", "Cộng đồng"],
  }),
  createFallbackArticle({
    id: 4,
    slug: "cong-bo-ke-hoach-phat-trien-ha-tang-giao-thong-khu-vuc-trung-tam",
    title: "Công bố kế hoạch phát triển hạ tầng giao thông khu vực trung tâm",
    category: "Kinh tế",
    date: "09/10/2023",
    author: "Ban Kinh tế",
    views: "1,678 lượt xem",
    heroCaption: "Kế hoạch nâng cấp hạ tầng giao thông được công bố để lấy ý kiến cộng đồng dân cư.",
    tags: ["Kinh tế", "Hạ tầng", "Giao thông"],
  }),
  createFallbackArticle({
    id: 5,
    slug: "huong-dan-thu-tuc-cap-doi-can-cuoc-cong-dan-gan-chip-dien-tu",
    title: "Hướng dẫn thủ tục cấp đổi Căn cước công dân gắn chip điện tử tại phường",
    category: "Cải cách hành chính",
    date: "08/10/2023",
    author: "Bộ phận Một cửa",
    views: "2,654 lượt xem",
    heroCaption: "Người dân được hỗ trợ trực tiếp về quy trình, hồ sơ và lịch tiếp nhận thủ tục.",
    tags: ["Thủ tục hành chính", "CCCD", "Một cửa"],
  }),
  createFallbackArticle({
    id: 6,
    slug: "thong-bao-lich-thu-gom-rac-thai-sinh-hoat-tren-dia-ban-cac-khom",
    title: "Thông báo lịch thu gom rác thải sinh hoạt trên địa bàn các khóm",
    category: "Thông báo",
    date: "06/10/2023",
    author: "Ban Đô thị",
    views: "1,904 lượt xem",
    heroCaption: "Lịch thu gom rác được cập nhật theo tuyến để người dân thuận tiện theo dõi và phối hợp.",
    tags: ["Môi trường", "Thu gom rác", "Thông báo"],
  }),
];

const fallbackCategories = Array.from(
  new Set(["Tất cả", ...fallbackArticles.map((article) => article.category)]),
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
    isFeatured: false,
    hasRealImage: true,
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
      "Nội dung được cập nhật từ hệ thống thông tin điện tử phường, phản ánh các hoạt động điều hành và chương trình phục vụ người dân.",
    bodyParagraphs: [
      "Bài viết ghi nhận các kết quả triển khai tại cơ sở, đồng thời tổng hợp ý kiến từ các đơn vị liên quan để hoàn thiện kế hoạch hành động trong thời gian tới.",
      "Lãnh đạo địa phương nhấn mạnh yêu cầu phối hợp chặt chẽ giữa các bộ phận chuyên môn, tăng cường truyền thông và bảo đảm tiến độ thực hiện các chỉ tiêu đã đề ra.",
    ],
    sectionTitle: "Mục tiêu triển khai",
    sectionIntro: "Trọng tâm thực hiện giai đoạn tiếp theo gồm các nhóm nhiệm vụ sau:",
    sectionBullets: defaultSectionBullets,
    subImage: DEFAULT_SUB_IMAGE,
    subCaption: "Các tổ công tác địa phương hướng dẫn người dân tiếp cận dịch vụ số và tiện ích công trực tuyến.",
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
    return "Đang cập nhật";
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

function resolveFeaturedFlag(source: ApiArticleListItem | ApiArticleDetail) {
  return source.isFeatured === true || source.IsFeatured === true || source.featured === true;
}

function adaptArticle(source: ApiArticleListItem | ApiArticleDetail): Article {
  const paragraphs = buildParagraphs("content" in source ? source.content : undefined, source.excerpt);
  const lead = buildLead("content" in source ? source.content : undefined, source.excerpt);
  const category = source.category?.trim() || "Chưa phân loại";
  const author = source.author?.trim() || "Ban biên tập";
  const featuredImage = resolveApiAssetUrl(source.featuredImage);

  return {
    id: source.id,
    isFeatured: resolveFeaturedFlag(source),
    hasRealImage: Boolean(featuredImage),
    slug: source.slug,
    title: source.title,
    category,
    categoryId: slugify(category),
    date: formatDate(source.createdAt),
    author,
    authorId: slugify(author),
    status: "published",
    publishedAt: formatDate(source.createdAt),
    views: "Đang cập nhật",
    heroImage: featuredImage || undefined,
    heroCaption: source.excerpt?.trim() || "Nội dung hình ảnh đang được cập nhật từ hệ thống.",
    bodyLead: lead,
    bodyParagraphs: paragraphs,
    sectionTitle: "Mục tiêu triển khai",
    sectionIntro: "Các nội dung trọng tâm đang được địa phương tiếp tục triển khai và hoàn thiện:",
    sectionBullets: defaultSectionBullets,
    subImage: featuredImage || undefined,
    subCaption: "Thông tin, hình ảnh và tiến độ thực hiện đang được cập nhật từ hệ thống dữ liệu công.",
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
    console.error("Không thể tải danh sách bài viết:", error);
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
      console.error(`Không thể tải chi tiết bài viết slug=${slug}:`, detailError);
      return article;
    }
  } catch (error) {
    console.error(`Không thể tải bài viết slug=${slug}:`, error);
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
      return ["Tất cả", ...categories];
    }

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : isDevelopment ? fallbackCategories : ["Tất cả"];
  } catch (error) {
    console.error("Không thể tải danh mục bài viết:", error);

    if (isDevelopment) {
      return fallbackCategories;
    }

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : ["Tất cả"];
  }
}
