import { resolveApiAssetUrl } from "@/lib/api-base-url";
import { formatDateVi } from "@/lib/date-format";
import { stripHtml } from "@/lib/html-utils";
import { slugify } from "@/lib/normalize";
import type {
  ApiArticleDetail,
  ApiArticleListItem,
} from "@/services/articles/types";
import type {
  Article,
  ArticleSectionBullet,
} from "@/types/article";

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

const fallbackArticleDefaults = {
  bodyLead:
    "Nội dung được cập nhật từ hệ thống thông tin điện tử phường, phản ánh các hoạt động điều hành và chương trình phục vụ người dân.",
  bodyParagraphs: [
    "Bài viết ghi nhận các kết quả triển khai tại cơ sở, đồng thời tổng hợp ý kiến từ các đơn vị liên quan để hoàn thiện kế hoạch hành động trong thời gian tới.",
    "Lãnh đạo địa phương nhấn mạnh yêu cầu phối hợp chặt chẽ giữa các bộ phận chuyên môn, tăng cường truyền thông và bảo đảm tiến độ thực hiện các chỉ tiêu đã đề ra.",
  ],
};

function buildParagraphs(content?: string | null, excerpt?: string | null) {
  const text = stripHtml(content) || stripHtml(excerpt);
  if (!text) {
    return [...fallbackArticleDefaults.bodyParagraphs];
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
  return lead || fallbackArticleDefaults.bodyLead;
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

export function adaptArticle(source: ApiArticleListItem | ApiArticleDetail): Article {
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
    date: formatDateVi(source.createdAt),
    author,
    authorId: slugify(author),
    status: "published",
    publishedAt: formatDateVi(source.createdAt),
    views: "Đang cập nhật",
    heroImage: featuredImage || undefined,
    heroCaption: source.excerpt?.trim() || "Nội dung hình ảnh đang được cập nhật từ hệ thống.",
    bodyLead: lead,
    bodyParagraphs: paragraphs,
    sectionTitle: "Mục tiêu triển khai",
    sectionIntro: "Các nội dung trọng tâm đang được địa phương tiếp tục triển khai và hoàn thiện:",
    sectionBullets: [...defaultSectionBullets],
    subImage: featuredImage || undefined,
    subCaption: "Thông tin, hình ảnh và tiến độ thực hiện đang được cập nhật từ hệ thống dữ liệu công.",
    tags: buildTags(category, source.title),
  };
}

