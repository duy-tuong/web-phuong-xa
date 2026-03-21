export default function ContactFormSection() {
  return (
    <div className="h-fit rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Góp ý &amp; Liên hệ</h2>
      <p className="mb-8 text-sm text-slate-600">
        Vui lòng điền thông tin bên dưới để gửi phản ánh, kiến nghị hoặc góp ý cho Ủy ban Nhân dân phường.
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="fullname" className="mb-2 block text-sm font-semibold text-slate-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullname"
            type="text"
            required
            placeholder="Nhập họ và tên của bạn"
            className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 shadow-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="Ví dụ: 0901234567"
              className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 shadow-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 shadow-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
            Chuyên mục góp ý <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            required
            defaultValue=""
            className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 shadow-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
          >
            <option value="" disabled>
              Chọn chuyên mục
            </option>
            <option value="hanh-chinh">Thủ tục hành chính</option>
            <option value="an-ninh">An ninh trật tự</option>
            <option value="moi-truong">Vệ sinh môi trường</option>
            <option value="khac">Khác</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
            Nội dung chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            placeholder="Mô tả chi tiết nội dung bạn muốn gửi..."
            className="w-full resize-none rounded-lg border-slate-300 bg-slate-50 text-slate-900 shadow-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
          />
        </div>

        <div className="pt-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#059669] px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-[#047857]"
          >
            <span className="material-symbols-outlined">send</span>
            Gửi Phản Hồi
          </button>
        </div>
      </form>
    </div>
  );
}
