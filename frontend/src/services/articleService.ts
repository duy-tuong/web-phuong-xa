import type { Article } from "@/types/article";

const sharedBody = {
  bodyLead:
    "Nội dung được cập nhật từ hệ thống thông tin điện tử phường Cao Lãnh, phản ánh các hoạt động điều hành, văn hóa - xã hội và các chương trình phục vụ người dân trên địa bàn.",
  bodyParagraphs: [
    "Bài viết ghi nhận các kết quả triển khai tại cơ sở, đồng thời tổng hợp ý kiến từ các đơn vị liên quan để hoàn thiện kế hoạch hành động trong thời gian tới.",
    "Lãnh đạo địa phương nhấn mạnh yêu cầu phối hợp chặt chẽ giữa các bộ phận chuyên môn, tăng cường truyền thông và bảo đảm tiến độ thực hiện các chỉ tiêu đã đề ra.",
  ],
  sectionTitle: "Mục tiêu triển khai",
  sectionIntro: "Trọng tâm thực hiện trong giai đoạn tiếp theo gồm các nhóm nhiệm vụ sau:",
  sectionBullets: [
    {
      label: "Nâng cao chất lượng phục vụ",
      text: "Chuẩn hóa quy trình, rút ngắn thời gian xử lý và tăng khả năng tiếp cận dịch vụ cho người dân.",
    },
    {
      label: "Đẩy mạnh truyền thông",
      text: "Phổ biến thông tin rộng rãi qua các kênh trực tuyến và hoạt động cộng đồng tại khóm, tổ dân phố.",
    },
    {
      label: "Theo dõi tiến độ",
      text: "Tăng cường kiểm tra định kỳ, kịp thời tháo gỡ vướng mắc để bảo đảm hiệu quả thực thi.",
    },
  ],
  subImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFm0JRe2fQd4evCnKLLptucmVYziq66tEFwbAAfo4Ap6KpVOjeMhtQFrp_vnjasNqkCbX0JHZ8Qog_gr5sWh0Q04Ss6a5riMUH5UyLXuB-CeT16aPb9H63Qv4FUrKhbFJGZ0V_3Embzg6wYkum1vlyWY66p-NUBnVyfdVE7qCoYHwN6jbiY3H9SIGQ3IPxS24nRLjo6TqBvxJyMIVPf3DhnbK6ypjyCVgGkwe_DI6Ky2EsmxMeV3KspqvwliG4SS3DT4Y2ogIGZj_M",
  subCaption: "Các tổ công tác địa phương hướng dẫn người dân tiếp cận dịch vụ số và tiện ích công trực tuyến.",
};

function createArticle(
  meta: Omit<Article, keyof typeof sharedBody | "categoryId" | "authorId" | "status" | "publishedAt">,
): Article {
  const categoryId = meta.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const authorId = meta.author
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    ...meta,
    categoryId,
    authorId,
    status: "published",
    publishedAt: meta.date,
    ...sharedBody,
  };
}

const articles: Article[] = [
  createArticle({
    slug: "ubnd-phuong-cao-lanh-to-chuc-hoi-nghi",
    title: "Đại hội đại biểu Mặt trận Tổ quốc Việt Nam Phường Cao Lãnh nhiệm kỳ 2024-2029 thành công tốt đẹp",
    category: "Tin tức xã hội",
    date: "15 tháng 10 năm 2024",
    author: "Ban Biên Tập",
    views: "1,245 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8qzrU7hnhsoDY94oufu7hJNCAl4vQEHEAdyibHV-GaB1BzqhGsucfbpVqjXB04TDYe1N7leVbGGm4IBXTVHh5Mp_KyqB1v4c3VSofSf563Peof9QqvE5CW2VcXCz2NUCpcD5w7r-k1nM4UsBIQp3B5AfhUhLPAxE_-VynmBPYJcVvLgwVJNCxqPhoQNE6Uq307xHjr73-vkeUHu1Bc3ov6ygiC9c00RUdsGPW_aGqtEqCUR8IGPw_TK7-88nKBTk2Qnt3qAoU43w7",
    heroCaption:
      "Toàn cảnh hội nghị triển khai công tác trọng tâm tại Hội trường UBND Phường Cao Lãnh.",
    tags: ["Mặt trận Tổ quốc", "UBND Phường", "Tin tức xã hội"],
  }),
  createArticle({
    slug: "khai-mac-giai-bong-da-thanh-nien-truyen-thong-phuong-cao-lanh-2023",
    title: "Khai mạc giải bóng đá thanh niên truyền thống Phường Cao Lãnh năm 2023",
    category: "Thể thao",
    date: "05 tháng 10 năm 2023",
    author: "Ban Văn hóa",
    views: "1,820 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1o1DoqGMylMMf0Ngwe-jcAFIkTLboQv1VxF1gCJpJUEF7PMdNsg7UfzSS_ZG1GsR0hkxivL0uS-gQiOo3FacTAizHkGmA30fLlUC3BZcNIiu_983nFz5NRGRPAHpnmVPMEFBQ9SsdPZAn-vkq0IcQxDCmsyXh-P2GtMD9rfHz4Pe-EpnbMHePsBCxJ_kagNA6H-yHJ7XR2oBWBDbK640LYA1YweVDIGvYp2O762NwEr7wg83d1lMSn9V67GhTKyCMhJWgH-mmReB",
    heroCaption: "Giải đấu thu hút đông đảo đoàn viên, thanh niên và người dân tham gia cổ vũ.",
    tags: ["Thể thao", "Thanh niên", "Phong trào địa phương"],
  }),
  createArticle({
    slug: "thong-bao-tam-ngung-cung-cap-dien-mot-so-khu-vuc-de-bao-tri-tram-bien-ap",
    title: "Thông báo tạm ngừng cung cấp điện một số khu vực để bảo trì trạm biến áp",
    category: "Thông báo",
    date: "04 tháng 10 năm 2023",
    author: "Văn phòng UBND",
    views: "3,105 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlmRiEKiavvJdLovK2a3sEHtRGVDZSMET9zrNOglbL4jzJSnQcuk5Omj-u7vThe7FGa_B2rxvPTXr8IdH8-AojKiSwjFMdUnHy00mRTWbJ1_eDbo5k1RbWDCX8829h1mLV4h_GlXBCZY_ChbhMF-0S8knpudO8mVhWPi_Uyva_CPRppnEEJWHWLdSnUm934eJayUwaR16uZE1Gnqfr1iLhHGktLuR5rMlQdmyF2YPjdzewboqe9mpOgJvUjUcGhSwKoxCHOZWbHuwe",
    heroCaption: "Thông tin lịch bảo trì và thời gian dự kiến khôi phục điện được công khai đến người dân.",
    tags: ["Thông báo", "Hạ tầng điện", "Dân sinh"],
  }),
  createArticle({
    slug: "phat-dong-phong-trao-ngay-chu-nhat-xanh-lam-sach-duong-pho",
    title: "Phát động phong trào 'Ngày Chủ nhật xanh' làm sạch đường phố",
    category: "Môi trường",
    date: "12 tháng 10 năm 2023",
    author: "Đoàn Thanh niên",
    views: "1,460 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZIbRDx40vlTqVCTAPgQr11ikTD7JspJtc8CqjwkB0HxleLoitn6224b8--bg9W-pUwsKpOifDJxqhJbdIEmlEaytklGFirIbbE05QrggWMQ0hTSxao1wDEzv8J93fPiwwDEc0Pp_corC8jV4iKoac2491BGeHKeR25piRa8JCz9fCxuieP4PaBrPVzoihecQYMR7TL_7-3afnQXeXkhAQL062GNBI2vOE6WyRMMZ3Pb2JqWLFN1BpXuMPdHCoYut8VYoM3VXt2JIM",
    heroCaption: "Lực lượng đoàn viên ra quân làm sạch các tuyến đường kiểu mẫu trên địa bàn phường.",
    tags: ["Môi trường", "Ngày Chủ nhật xanh", "Đoàn thanh niên"],
  }),
  createArticle({
    slug: "trao-tang-100-suat-qua-cho-cac-ho-gia-dinh-co-hoan-canh-kho-khan",
    title: "Trao tặng 100 suất quà cho các hộ gia đình có hoàn cảnh khó khăn",
    category: "An sinh xã hội",
    date: "10 tháng 10 năm 2023",
    author: "Ủy ban MTTQ",
    views: "2,012 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC5vEnXdVTgK7V6fG3D_8wot7mvmJRIEPYe3huprgnHAMvhqeGKw6JaW0V6mZzMnk1ztUKXVgPBcL_dpJjVwLI1J8uUjcEWk2lE_I6Vy9rna24a78QHp-ouerrX7Z2M9T0HvqrW0mmkzT1Fg3Ci8nuCpF14HeHPOoRtFEPAPkMVDjPO0-QNOIpQpzB4hcGFku4BAbQKWjSu-tnZKMjgfVToDSgyg6fCVHLpNTu8dOrtMp2KnQrQPdSLQR9RzNjHcoPy3luNEUAxeDf",
    heroCaption: "Chương trình trao quà được tổ chức nhằm hỗ trợ kịp thời các hộ gia đình khó khăn.",
    tags: ["An sinh", "Hỗ trợ hộ nghèo", "Cộng đồng"],
  }),
  createArticle({
    slug: "cong-bo-ke-hoach-phat-trien-ha-tang-giao-thong-khu-vuc-trung-tam",
    title: "Công bố kế hoạch phát triển hạ tầng giao thông khu vực trung tâm",
    category: "Kinh tế",
    date: "09 tháng 10 năm 2023",
    author: "Ban Kinh tế",
    views: "1,678 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoZ-nHOhvIG7mEAvqb4v-itWDDqJ9z-Q3hdlNZMTYfGP5jY6gIW8lL-Gbpvkz2BknnOWClT3JxrCTN_UazkdEH-zPXtoZWQI3b1Sw7MNhnBRbLpjAjfBbZGEnilefIumiYRk7htgiXvWarsd_fJGCsJql98ToZ2TMhiqCoIFfi9OvDO8xErzearwZe_XuTUBuaTxmDPtCAWacAJqQIItRdwrPFzLej33lHCYDv8Mg5bE3LXuFIyetAl1hFqR5dwskncnQng7yp9eUC",
    heroCaption: "Kế hoạch nâng cấp hạ tầng giao thông được công bố để lấy ý kiến cộng đồng dân cư.",
    tags: ["Kinh tế", "Hạ tầng", "Giao thông"],
  }),
  createArticle({
    slug: "huong-dan-thu-tuc-cap-doi-can-cuoc-cong-dan-gan-chip-dien-tu",
    title: "Hướng dẫn thủ tục cấp đổi Căn cước công dân gắn chip điện tử tại phường",
    category: "Cải cách hành chính",
    date: "08 tháng 10 năm 2023",
    author: "Bộ phận Một cửa",
    views: "2,654 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqKaKp60rtRluFTNDr5UZnW3eY3x9-CaYolNhLZCrjNN8v4vKXl7O8T2VlTqMNRGwePzaJgrJJ59y2joleZ5LljIKFG9ULFzzBs99R1b0yTG5vdJ_Jh3O4KSr24jGqthbJsNnUqV2e9l_IphS7vo9GvMnHEi8_9FpVqDfPaXaF6t0wmu5ZD40CP1LkKG_wSNSp6uB9ye79ToDCr1dB6_uy0VBHYN6_IewLbFwOHMFDVPpiExCBTRPQU2lPY2vj2673xhzjOtqkU5XR",
    heroCaption: "Người dân được hỗ trợ trực tiếp về quy trình, hồ sơ và lịch tiếp nhận thủ tục.",
    tags: ["Thủ tục hành chính", "CCCD", "Một cửa"],
  }),
  createArticle({
    slug: "lich-tiep-cong-dan-cua-chu-tich-ubnd-phuong-thang-10-2023",
    title: "Lịch tiếp công dân của Chủ tịch UBND Phường tháng 10/2023",
    category: "Thông báo",
    date: "07 tháng 10 năm 2023",
    author: "Văn phòng UBND",
    views: "1,130 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD50a17i01b0npsVJYg3lPx7WZaWQHp_-r9rBnCYLzt5KO9PEF9s7cWbnk9jTyNI8j2eYNtxzbFtXx28JwxjE0sWDvNMQjiSkcXK0B2LEXuCFaIP2UFNe1HN7B3nIdxm1rn1WJw00c8LnmVfWtMJUlTHsasVP1rLMTaKA1pftczDcZKzCd448vHQH0JEnk-On7MKG-3vB1612ckfNEdDtJV6NoWmjdCRc_1SBPpWy4DuW3MdJfQJU-QtCupIYWjIz3H5LHT28PcMZgF",
    heroCaption: "Thông báo lịch tiếp công dân định kỳ để người dân chủ động sắp xếp thời gian liên hệ.",
    tags: ["Tiếp công dân", "Lịch làm việc", "Thông báo"],
  }),
  createArticle({
    slug: "thong-bao-lich-thu-gom-rac-thai-sinh-hoat-tren-dia-ban-cac-khom",
    title: "Thông báo lịch thu gom rác thải sinh hoạt trên địa bàn các khóm",
    category: "Thông báo",
    date: "06 tháng 10 năm 2023",
    author: "Ban Đô thị",
    views: "1,904 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpEhKO0x2MpN1gpITIILwhAH_AjhZrG9O-4Zj9J9SwqE4gMj57JJB5mh9m20VvLuEfhUGFTS5kcgYphqG374xdzsB8bsAZXi5kVMwwn2fTYOqMxZaE2yryTR_H-lqxGSErOI42RowuRCJ-Am8w5KdXhnSI9xcGbz7N5lCE3AdCOSl6VJNopefMR-CfRVE26EPlaZvpZjc8hPW2Pq0gHcJyPlSHtwqnd09bN_dm9vXSm23Scz7LPP6lVNGmq9tCAkXb2WWxF5XRrO_G",
    heroCaption: "Lịch thu gom rác được cập nhật theo tuyến để người dân thuận tiện theo dõi và phối hợp.",
    tags: ["Môi trường", "Thu gom rác", "Thông báo"],
  }),
  createArticle({
    slug: "soi-noi-giai-bong-da-thanh-nien-truyen-thong-nam-2023",
    title: "Sôi nổi giải bóng đá thanh niên truyền thống năm 2023",
    category: "Thể thao",
    date: "05 tháng 10 năm 2023",
    author: "Ban Văn hóa",
    views: "1,511 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1o1DoqGMylMMf0Ngwe-jcAFIkTLboQv1VxF1gCJpJUEF7PMdNsg7UfzSS_ZG1GsR0hkxivL0uS-gQiOo3FacTAizHkGmA30fLlUC3BZcNIiu_983nFz5NRGRPAHpnmVPMEFBQ9SsdPZAn-vkq0IcQxDCmsyXh-P2GtMD9rfHz4Pe-EpnbMHePsBCxJ_kagNA6H-yHJ7XR2oBWBDbK640LYA1YweVDIGvYp2O762NwEr7wg83d1lMSn9V67GhTKyCMhJWgH-mmReB",
    heroCaption: "Không khí thi đấu sôi động góp phần thúc đẩy phong trào thể dục thể thao địa phương.",
    tags: ["Thể thao", "Giải bóng đá", "Thanh niên"],
  }),
  createArticle({
    slug: "hoi-thi-nau-an-chao-mung-ngay-phu-nu-viet-nam-20-10",
    title: "Hội thi nấu ăn chào mừng Ngày Phụ nữ Việt Nam 20/10",
    category: "Văn hóa",
    date: "02 tháng 10 năm 2023",
    author: "Hội Liên hiệp Phụ nữ",
    views: "1,298 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuUEF_j9MBfzvUWlEDsmRO7gZ4rQ1oZJgYKIjkHakv9jEkJGv8JA079xZwNEL3dPB9eZnWYuUhw2HE--6v9uBR78pQ1N9qInd47zN85QWENCVRGFzoiG2FLEIhDh4pY2uHECDhl-aoKF7D3Js5Y6dvE-kdUh1COyKgnzZcc2M2ZiaMHNbKd-ZI3_d7HJ0lMvLeBq-vfiz_OHFIhuZGhEAPKuUZrIiIMDnNq9YqGCZ4ZuquNw9oStnYyKRRww5-vpHQNXQfM7m-Bd-a",
    heroCaption: "Hội thi tạo sân chơi gắn kết, tôn vinh giá trị gia đình và văn hóa ẩm thực địa phương.",
    tags: ["Văn hóa", "Phụ nữ", "Hoạt động cộng đồng"],
  }),
  createArticle({
    slug: "soi-noi-hoi-thi-nau-an-chao-mung-ngay-phu-nu-viet-nam-20-10",
    title: "Sôi nổi Hội thi nấu ăn chào mừng Ngày Phụ nữ Việt Nam 20/10",
    category: "Văn hóa",
    date: "02 tháng 10 năm 2023",
    author: "Hội Liên hiệp Phụ nữ",
    views: "1,356 lượt xem",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuUEF_j9MBfzvUWlEDsmRO7gZ4rQ1oZJgYKIjkHakv9jEkJGv8JA079xZwNEL3dPB9eZnWYuUhw2HE--6v9uBR78pQ1N9qInd47zN85QWENCVRGFzoiG2FLEIhDh4pY2uHECDhl-aoKF7D3Js5Y6dvE-kdUh1COyKgnzZcc2M2ZiaMHNbKd-ZI3_d7HJ0lMvLeBq-vfiz_OHFIhuZGhEAPKuUZrIiIMDnNq9YqGCZ4ZuquNw9oStnYyKRRww5-vpHQNXQfM7m-Bd-a",
    heroCaption: "Không khí hội thi sôi nổi với nhiều phần trình bày ẩm thực sáng tạo của các đội tham gia.",
    tags: ["Văn hóa", "Hội thi nấu ăn", "Phụ nữ Việt Nam"],
  }),
];

const categories: string[] = ["Tất cả", "Tin tức xã hội", "Văn hóa", "Thông báo", "Môi trường", "Thể thao"];

export async function getArticles(): Promise<Article[]> {
  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = articles.find((item) => item.slug === slug);
  return article ?? null;
}

export async function getCategories(): Promise<string[]> {
  return categories;
}