import type { ProcedureDetail } from "@/types/service";

type ProcedureSeed = Omit<ProcedureDetail, "requiredDocuments">;

const procedures: ProcedureSeed[] = [
  {
    slug: "khai-sinh",
    title: "Đăng ký khai sinh",
    processingTime: "Trong ngày làm việc",
    fee: "Miễn phí",
    wordTemplateHref: "/files/forms/khai-sinh.docx",
    requirements: [
      "Tờ khai đăng ký khai sinh theo mẫu",
      "Giấy chứng sinh (bản chính hoặc bản sao hợp lệ)",
      "CCCD/CMND của cha hoặc mẹ",
      "Sổ hộ khẩu hoặc giấy tờ chứng minh nơi cư trú",
    ],
    steps: [
      "Chuẩn bị đầy đủ hồ sơ theo danh mục yêu cầu.",
      "Nộp hồ sơ trực tuyến hoặc tại Bộ phận Một cửa UBND phường.",
      "Cán bộ tiếp nhận kiểm tra hồ sơ và gửi phiếu hẹn.",
      "Nhận kết quả đăng ký khai sinh theo lịch hẹn.",
    ],
  },
  {
    slug: "ket-hon",
    title: "Đăng ký kết hôn",
    processingTime: "Ngay trong ngày nếu hồ sơ hợp lệ",
    fee: "Miễn phí (đăng ký trong nước)",
    wordTemplateHref: "/files/forms/ket-hon.docx",
    requirements: [
      "Tờ khai đăng ký kết hôn của hai bên nam, nữ",
      "CCCD/CMND hoặc hộ chiếu còn giá trị của hai bên",
      "Giấy xác nhận tình trạng hôn nhân (nếu thuộc trường hợp phải nộp)",
      "Giấy tờ chứng minh nơi cư trú của hai bên",
    ],
    steps: [
      "Hai bên kê khai thông tin và chuẩn bị hồ sơ đầy đủ.",
      "Nộp hồ sơ, xuất trình giấy tờ tùy thân để đối chiếu.",
      "Cơ quan hộ tịch thẩm tra điều kiện kết hôn theo quy định.",
      "Ký sổ hộ tịch và nhận Giấy chứng nhận kết hôn.",
    ],
  },
  {
    slug: "dang-ky-ho-kinh-doanh",
    title: "Cấp Giấy chứng nhận đăng ký hộ kinh doanh",
    processingTime: "03 ngày làm việc",
    fee: "100.000 VNĐ",
    wordTemplateHref: "/files/forms/dang-ky-ho-kinh-doanh.docx",
    requirements: [
      "Giấy đề nghị đăng ký hộ kinh doanh",
      "Bản sao CCCD/CMND của chủ hộ kinh doanh",
      "Biên bản họp thành viên hộ gia đình (nếu có nhiều thành viên góp vốn)",
      "Hợp đồng thuê địa điểm kinh doanh hoặc giấy tờ chứng minh quyền sử dụng địa điểm",
    ],
    steps: [
      "Điền mẫu đăng ký và chuẩn bị giấy tờ liên quan.",
      "Nộp hồ sơ tại Bộ phận Một cửa hoặc qua cổng dịch vụ công.",
      "Cơ quan chuyên môn kiểm tra tính hợp lệ và phản hồi bổ sung nếu cần.",
      "Nhận Giấy chứng nhận đăng ký hộ kinh doanh khi hồ sơ đạt yêu cầu.",
    ],
  },
  {
    slug: "khai-tu",
    title: "Đăng ký khai tử",
    processingTime: "Ngay trong ngày",
    fee: "Miễn phí",
    wordTemplateHref: "/files/forms/khai-tu.docx",
    requirements: [
      "Tờ khai đăng ký khai tử theo mẫu",
      "Giấy báo tử hoặc giấy tờ thay thế theo quy định",
      "CCCD/CMND của người đi khai tử",
      "Giấy tờ chứng minh nơi cư trú của người đã mất (nếu có)",
    ],
    steps: [
      "Chuẩn bị hồ sơ khai tử đúng thành phần giấy tờ.",
      "Nộp hồ sơ tại Bộ phận Một cửa hoặc qua cổng dịch vụ công.",
      "Cơ quan hộ tịch kiểm tra hồ sơ và cập nhật sổ hộ tịch.",
      "Nhận trích lục khai tử theo thời gian hẹn.",
    ],
  },
  {
    slug: "xac-nhan-tinh-trang-bat-dong-san",
    title: "Xác nhận tình trạng bất động sản",
    processingTime: "05 ngày làm việc",
    fee: "50.000 VNĐ",
    wordTemplateHref: "/files/forms/xac-nhan-tinh-trang-bat-dong-san.docx",
    requirements: [
      "Đơn đề nghị xác nhận tình trạng bất động sản",
      "Bản sao giấy tờ quyền sử dụng đất, quyền sở hữu nhà ở",
      "CCCD/CMND của người đề nghị",
      "Các giấy tờ liên quan đến tình trạng pháp lý của bất động sản (nếu có)",
    ],
    steps: [
      "Nộp hồ sơ đề nghị xác nhận tại UBND phường hoặc trực tuyến.",
      "Cơ quan chuyên môn tiếp nhận, kiểm tra và thẩm tra thông tin.",
      "Trường hợp cần thiết, thực hiện xác minh thực địa hoặc đối chiếu hồ sơ.",
      "Trả kết quả xác nhận tình trạng bất động sản cho người dân theo lịch hẹn.",
    ],
  },
];

const normalizedProcedures: ProcedureDetail[] = procedures.map((procedure) => ({
  ...procedure,
  requiredDocuments: procedure.requirements,
}));

export async function getProcedures(): Promise<ProcedureDetail[]> {
  return normalizedProcedures;
}