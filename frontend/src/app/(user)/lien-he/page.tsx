//! Công dụng: Hiển thị trang liên hệ với các thông tin liên hệ, form gửi câu hỏi, và phần FAQ.
import { getContactFaqItems } from "@/services/page-content/contact";// gọi hành để lấy dữ liệu FAQ (câu hỏi thường gặp) cho trang liên hệ
import ContactHero from "@/components/contact/ContactHero";// Banner hoặc tiêu đề trang
import ContactInfo from "@/components/contact/ContactInfo";// thông tin liên lạc
import ContactForm from "@/components/contact/ContactForm";// form để người dùng gửi câu hỏi hoặc yêu cầu hỗ trợ đến đơn vị quản lý trang web
import ContactFaq from "@/components/contact/ContactFaq"; // phần FAQ hiển thị các câu hỏi thường gặp và câu trả lời để giúp người dùng nhanh chóng tìm được thông tin mình cần mà không phải liên hệ trực tiếp

export default function LienHePage() {
  const faqItems = getContactFaqItems();

  return (
    <main className="bg-[#f8fafc] pb-16">
      <ContactHero />

      <section className="pt-10 md:pt-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <ContactFaq faqItems={faqItems} />
      </section>
    </main>
  );
}
