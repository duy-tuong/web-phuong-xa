export function getHomePageContent() {
  const highlightStats = [
    { value: "137.387", label: "Dân số (người)" },
    { value: "73,33", label: "Diện tích (km²)" },
    { value: "1.734", label: "Doanh nghiệp" },
    { value: "16.912", label: "Hộ kinh doanh" },
  ];

  const quickServices = [
    {
      title: "Hộ tịch",
      desc: "Khai sinh, kết hôn, xác nhận hộ tịch",
      href: "/dich-vu",
      icon: "FileText",
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Đất đai",
      desc: "Tra cứu quy hoạch và thông tin địa chính",
      href: "/dich-vu/tra-cuu",
      icon: "Map",
      color: "text-blue-700 bg-blue-50 border-blue-100",
    },
    {
      title: "Kinh doanh",
      desc: "Đăng ký, cấp đổi và điều chỉnh giấy phép",
      href: "/dich-vu",
      icon: "Store",
      color: "text-amber-700 bg-amber-50 border-amber-100",
    },
    {
      title: "Góp ý",
      desc: "Gửi phản ánh và kiến nghị đến địa phương",
      href: "/lien-he",
      icon: "MessageSquare",
      color: "text-pink-700 bg-pink-50 border-pink-100",
    },
  ];

  const topNews = [
    { title: "Triển khai tiêm vắc xin đợt 3 cho trẻ dưới 5 tuổi", href: "/tin-tuc/1" },
    { title: "Lịch tiếp dân: Thứ 3 và Thứ 5 hằng tuần tại UBND", href: "/tin-tuc/2" },
    { title: "Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2026", href: "/tin-tuc/3" },
  ];

  const tourismCards = [
    {
      title: "Đền thờ & Di tích lịch sử",
      desc: "Tìm hiểu những giá trị văn hóa, lịch sử lâu đời được gìn giữ qua nhiều thế hệ.",
      tag: "Di tích",
      href: "/gioi-thieu",
      className: "md:col-span-2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBvigYo206ZKoWJYA19Rlm85pnGIFysx5ZGT_DxSeucoAUNzDgWNO9SIZYi3Frxrz_8HsVcPqNFfhbT7JQTW1UfWV7F6c7vQYSvXiW4bRyShrXb5-lps_Uaty52wl81e3BhfGOVC9GYNT9JgU6dPr8D98edlGllNGdiY8pxqJ9z9oRd3boibJ2JhuE9PMDPUPJipn4aCSxbuhtQWqtGVJuTpWC1nL6Eo7Xh6QOmXoczJ99AkYg-Ho73IUXuOE2lZO8ESX2lBFjLYrFF",
    },
    {
      title: "Chợ truyền thống",
      desc: "Trải nghiệm nhịp sống sôi động và ẩm thực đặc sắc địa phương.",
      tag: "Mua sắm",
      href: "/thu-vien",
      className: "",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBv5sNqZtteiu-1ZeIzNCrWQCfCfVWpZd2hK3PZxsj1VOvwrEwQ40lFsiGAfiOFHoG3iarSt8c4huFFlihpcTnquGhOfGEV2noofnKbpQ9zb5_39iX-g9tUVJlGyC353jKh71hrQM1FnMlzS7fHbkpSACc1in4kOr7M-AbqgSAWgHrusMQ2gmgVbZXB7rX31r1bXnkL_PSPUMOPAofX0SdQUjD0HLww1aNv2REsRS5JtG5BciuddV9cCbVRyZh1vrMZLxq6bmx0ccO",
    },
    {
      title: "Khu sinh thái",
      desc: "Hòa mình vào thiên nhiên miệt vườn sông nước chân chất.",
      tag: "Thiên nhiên",
      href: "/thu-vien/hinh-anh",
      className: "",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDwYVpbmehJll2ftWcua2h_6JjwUDEs_gtSc9XzV4RpRWP9O5aGqNcFwJT4D186fZbypN-xDgpgij0S1D6BGHkkKYTfCgbUP1aTiewXO7KUpU71Gce1u5wSk5Zo7NPI59by3pdlEKxV-K9siPb7Gwx51cGCJ6yGuT5iml1HBseO_TYzM03dN8lp8iG_EXBO_RaO6LPv0eA1FykryHW093hJmUNqOzznQIk_Ikl_piW8b_-ObEQbhQ9Bet_EO8o6UiGOJ5BVMvI6NDKa",
    },
    {
      title: "Lễ hội Sen Đồng Tháp",
      desc: "Sự kiện văn hóa đặc sắc tôn vinh vẻ đẹp của loài hoa biểu tượng vùng đất sen hồng.",
      tag: "Sự kiện",
      href: "/tin-tuc",
      className: "md:col-span-2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAa57Uo1kzwO8sFatH5iyrm980VTc7JsTDDVNrThk26aLCc0G1HQCNGB_1qmmv_HP_bF_pGMb6STNG6QR0Akky9adKFl86zXWVhtRo9JKXnqkAuv4S7Wv1S0SLYYGuZTCa4WooG9zVKa2hU9cyT_IoxrjiXAFTJyjNqUrbmEWO4UtoRikm4Jjq0_WN7rKRnOzzeR_1k7YmYTjgq3SNrPaA5HPHnT-KP7NghN3gWvMzFhXz5OZ5xVzDP70U81PVOjpVVwl6gM6A56_NY",
    },
  ];

  return { highlightStats, quickServices, topNews, tourismCards };
}

export function getAboutPageContent() {
  const timelineItems = [
    {
      year: "197x",
      title: "Trước sáp nhập",
      shortText: "Các đơn vị hành chính gồm Phường 1, 3, 4, 6, Phường Hòa Thuận và các xã lân cận hoạt động riêng lẻ trong lòng Thành phố Cao Lãnh.",
      fullText:
        "Các đơn vị gồm: Phường 1, Phường 3, Phường 4, Phường 6, Phường Hòa Thuận, Xã Hòa An, Xã Tịnh Thới, Xã Tân Thuận Tây và Xã Tân Thuận Đông cùng tồn tại phục vụ hơn 137.000 dân trong khu vực lõi của thành phố.",
    },
    {
      year: "2005",
      title: "Đô thị hóa",
      shortText: "Đẩy mạnh nâng cấp hạ tầng và mở rộng các trục giao thông chính.",
      fullText:
        "Nhiều tuyến đường, công trình công cộng và các khu dân cư được chỉnh trang, tạo nền tảng cho phát triển kinh tế - xã hội theo hướng đô thị văn minh.",
    },
    {
      year: "01/07/2025",
      title: "Thành lập Phường Cao Lãnh",
      shortText: "Chính thức sáp nhập 9 đơn vị hành chính thành Phường Cao Lãnh duy nhất, trực thuộc Thành phố Cao Lãnh.",
      fullText:
        "Phường Cao Lãnh chính thức hoạt động từ ngày 01/07/2025, với trụ sở UBND đặt tại số 03 đường 30/4, TP Cao Lãnh. Đơn vị tập trung chức năng quản lý toàn bộ diện tích 73,33 km² và 137.387 dân, với mật độ 1.874 ng/km².",
    },
  ];

  const natureCards = [
    {
      icon: "wb_sunny",
      title: "Khí hậu",
      text: "Khí hậu nhiệt đới gió mùa, ôn hòa quanh năm, phù hợp phát triển nông nghiệp và dịch vụ đô thị.",
      image: "https://thoitiet24h.vn/storage/photos/1/19.02.2025/khi-hau-nhiet-doi-gio-mua/khi-hau-nhiet-doi-gio-mua%20(5).jpg"
    },
    {
      icon: "water",
      title: "Sông ngòi",
      text: "Mạng lưới kênh rạch dày đặc, gần sông Tiền, thuận lợi cho giao thương và cảnh quan sinh thái.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/S%C3%B4ng_Ti%E1%BB%81n.jpg"
    },
    {
      icon: "eco",
      title: "Sinh thái",
      text: "Không gian xanh đa dạng với hồ sen, công viên và tuyến đường cây xanh trong khu dân cư.",
      image: "https://travelguide.org.vn/upload/images/tbl_news_1556935349.JPG"
    },
  ];

  const statsCards = [
    {
      icon: "groups",
      title: "Dân số",
      value: "137.387",
      hint: "Người (2025)",
    },
    {
      icon: "map",
      title: "Diện tích",
      value: "73,33",
      hint: "km² — mật độ 1.874 ng/km²",
    },
    {
      icon: "storefront",
      title: "Doanh nghiệp",
      value: "1.734",
      hint: "& 16.912 hộ kinh doanh (2024)",
    },
    {
      icon: "local_hospital",
      title: "Y tế",
      value: "4",
      hint: "Bệnh viện + 1 Trung tâm y tế + 100+ nhà thuốc",
    },
  ];

  const infrastructureCards = [
    {
      title: "Giáo dục",
      text: "Hệ thống trường học các cấp được đầu tư theo hướng chuẩn hóa và hiện đại.",
      image: "https://cdn.giaoducthoidai.vn/images/9d9cbe37b83b282b398df9f3e22b52040068a7c471300dad9f274488151f7249cf73f2d975e8fd997c11cc880ba480c4/anh-1-4.jpg",
    },
    {
      title: "Y tế",
      text: "Trạm y tế phường nâng cao chất lượng khám, tư vấn và chăm sóc sức khỏe ban đầu.",
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2025-11/z7190490219976_99e46b5a856210d278d8d1bcac447981.jpg",
    },
    {
      title: "Giao thông",
      text: "Các tuyến đường nội ô được nâng cấp đồng bộ, kết nối thuận tiện với khu vực trung tâm.",
      image: "https://cdn2.baodongthap.vn/image/news/2025/20251013/fckimage/images2046784-anh-1.jpg",
    },
    {
      title: "Tiện ích đô thị",
      text: "Nhiều không gian công cộng, chiếu sáng và hạ tầng số phục vụ người dân.",
      image: "https://cdn2.baodongthap.vn/image/news/2025/20250815/fckimage/images2033329-xay-dung-do-thi-thanh-noi-dang-song-anh-2.jpg",
    },
  ];

  return { timelineItems, natureCards, statsCards, infrastructureCards };
}

export function getContactFaqItems() {
  return [
    {
      question: "Thủ tục hành chính làm ở đâu?",
      answer:
        "Bạn có thể thực hiện thủ tục hành chính trực tiếp tại Bộ phận Một cửa của UBND phường hoặc nộp trực tuyến qua cổng dịch vụ công đối với các thủ tục hỗ trợ online.",
    },
    {
      question: "Lịch tiếp công dân của lãnh đạo như thế nào?",
      answer:
        "Lãnh đạo UBND phường tiếp công dân định kỳ vào sáng thứ Năm hàng tuần. Trường hợp đột xuất, bạn có thể liên hệ trước qua hotline để được hướng dẫn lịch cụ thể.",
    },
    {
      question: "Thời gian xử lý phản ánh, kiến nghị là bao lâu?",
      answer:
        "Thời gian phản hồi thông thường từ 3 đến 5 ngày làm việc tùy theo nội dung. Các phản ánh khẩn cấp sẽ được chuyển xử lý ưu tiên.",
    },
  ];
}
