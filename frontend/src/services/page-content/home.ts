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
