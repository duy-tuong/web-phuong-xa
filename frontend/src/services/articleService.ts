//* API service để tương tác với backend liên quan đến bài viết, bao gồm các hàm như getArticles, getArticleBySlug, getCategories
import api from "@/services/api";
import { adaptArticle } from "@/services/articles/mappers";
import type {
  ApiArticleDetail,
  ApiArticlesResponse,
  ApiCategory,
} from "@/services/articles/types";
import type { Article } from "@/types/article";

async function requestArticlesFromApi() { //* gọi API lấy danh sách bài viết từ backend, Article
  const response = await api.get<ApiArticlesResponse>("/articles", {
    params: {
      page: 1,
      pageSize: 50,
    },
  });

  const rows = Array.isArray(response.data?.data) ? response.data.data : [];
  return rows.map(adaptArticle);
}

export async function getArticles(): Promise<Article[]> { //! trang chủ lấy dự liệu 
  //!  bọc try/catch, lỗi thì trả [] để UI không crash.
  try {
    return await requestArticlesFromApi();
  } catch (error) {
    console.error("Không thể tải danh sách bài viết:", error);
    return [];
  }
}
//* Hàm getArticleBySlug để lấy chi tiết một bài viết dựa trên slug, nếu có id thì gọi API lấy chi tiết
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
  //! Đầu tiên gọi API lấy danh sách bài viết để tìm ra bài viết có slug tương ứng, nếu không tìm thấy thì trả về null
    const articles = await requestArticlesFromApi();
    const article = articles.find((item) => item.slug === slug);

    if (!article) {
      return null; //! Nếu tìm thấy bài viết nhưng không có id (dữ liệu không đầy đủ), thì trả về bài viết đó mà không gọi API chi tiết, tránh lỗi crash UI.
    }

    if (!article.id) {
      return article;
    }

    try {
    //! Truyền cái ID vừa dò được vào đường dẫn API.
      const detailResponse = await api.get<ApiArticleDetail>(`/articles/${article.id}`);
      //! gọi API lấy chi tiết bài viết nếu thành công thì trả về dữ liệu đã được adapt để UI dùng, nếu lỗi thì log và trả về dữ liệu cũ dò được từ list, tránh crash UI.
      return adaptArticle(detailResponse.data);
    } catch (detailError) {
      console.error(`Không thể tải chi tiết bài viết slug=${slug}:`, detailError);
     //!Nếu gọi API chi tiết bị lỗi thì không báo lỗi trắng trang. Nó sẽ tự động trả về luôn dữ liệu tóm tắt (article)
      return article;
    }
  } catch (error) {
    console.error(`Không thể tải bài viết slug=${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await api.get<ApiCategory[]>("/categories"); //* gọi API lấy danh sách các danh mục bài viết từ backend, 
     //! Làm sạch dữ liệu. Dùng trim() cắt khoảng trắng thừa và bỏ các danh mục bị rỗng/lỗi để UI không bị vỡ.
    const categories = Array.isArray(response.data)
      ? response.data
          .map((category) => category.name?.trim())
          .filter((name): name is string => Boolean(name))
      : [];
//! Tối ưu UX. Luôn chủ động nhét thêm chữ "Tất cả" lên đầu mảng để UI vẽ ra nút bấm cho người dùng.
    if (categories.length > 0) {
      return ["Tất cả", ...categories];
    }
//! nếu backend trả về lỗi thì lấy danh sách bài viết tự động suy ra danh mục Dùng Set() để lọc trùng
    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : ["Tất cả"];
  } catch (error) {
    console.error("Không thể tải danh mục bài viết:", error);
//! API lấy danh mục của Backend có bị "chết", thanh bộ lọc danh mục trên trang tin tức vẫn hoạt động bình thường
    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : ["Tất cả"];
  }
}
