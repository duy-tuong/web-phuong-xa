type ServiceModalsProps = {
  showTracking: boolean;
  showForms: boolean;
  onCloseTracking: () => void;
  onCloseForms: () => void;
};

export default function ServiceModals({ showTracking, showForms, onCloseTracking, onCloseForms }: ServiceModalsProps) {
  return (
    <>
      <div className={`${showTracking ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
        <div className="w-full max-w-2xl overflow-hidden rounded-[12px] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined text-[#1f7a5a]">search</span>
              Tra cứu trạng thái hồ sơ
            </h2>
            <button type="button" onClick={onCloseTracking} className="text-slate-400 transition-colors hover:text-slate-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="ma-ho-so">
                  Mã hồ sơ <span className="text-red-500">*</span>
                </label>
                <input
                  id="ma-ho-so"
                  type="text"
                  placeholder="VD: H01.23.456"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="so-dien-thoai">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="so-dien-thoai"
                  type="text"
                  placeholder="Nhập số điện thoại đã đăng ký"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
                />
              </div>
            </div>

            <div className="mb-8 flex justify-end">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                Tra cứu
              </button>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="mb-6 text-sm font-bold text-slate-900">Trạng thái hồ sơ: H01.23.456</h3>
              <div className="relative flex justify-between">
                <div className="absolute left-0 top-1/2 z-0 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200" />
                <div className="absolute left-0 top-1/2 z-0 h-1 w-1/2 -translate-y-1/2 rounded-full bg-[#1f7a5a]" />

                <div className="relative z-10 flex w-1/4 flex-col items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f7a5a] text-white shadow-md">
                    <span className="material-symbols-outlined text-[16px]">done</span>
                  </div>
                  <span className="text-center text-xs font-bold text-[#1f7a5a]">Đã tiếp nhận</span>
                  <span className="text-[10px] text-slate-500">23/10/2023</span>
                </div>

                <div className="relative z-10 flex w-1/4 flex-col items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#1f7a5a]/20 bg-[#1f7a5a] bg-clip-padding text-white shadow-md">
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                  </div>
                  <span className="text-center text-xs font-bold text-[#1f7a5a]">Đang xử lý</span>
                </div>

                <div className="relative z-10 flex w-1/4 flex-col items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
                  </div>
                  <span className="text-center text-xs font-medium text-slate-500">Chờ trả kết quả</span>
                </div>

                <div className="relative z-10 flex w-1/4 flex-col items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  </div>
                  <span className="text-center text-xs font-medium text-slate-500">Hoàn tất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${showForms ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
        <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[12px] bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined text-[#1f7a5a]">file_download</span>
              Tải biểu mẫu hành chính
            </h2>
            <button type="button" onClick={onCloseForms} className="text-slate-400 transition-colors hover:text-slate-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
              <button type="button" className="whitespace-nowrap rounded-full bg-[#1f7a5a] px-4 py-1.5 text-sm font-medium text-white">
                Tất cả
              </button>
              <button type="button" className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200">
                Hộ tịch
              </button>
              <button type="button" className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200">
                Đất đai
              </button>
              <button type="button" className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200">
                Xây dựng
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-[#1f7a5a]/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded bg-[#1f7a5a]/10 px-2 py-0.5 text-xs font-semibold text-[#1f7a5a]">Hộ tịch</span>
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">Tờ khai đăng ký khai sinh</h4>
                    <p className="line-clamp-1 text-sm text-slate-600">
                      Biểu mẫu dùng cho thủ tục đăng ký khai sinh mới, cấp lại, hoặc cải chính.
                    </p>
                  </div>
                  <button type="button" className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[#1f7a5a] transition-colors hover:bg-[#1f7a5a]/10">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Tải về
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-[#1f7a5a]/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded bg-[#1f7a5a]/10 px-2 py-0.5 text-xs font-semibold text-[#1f7a5a]">Đất đai</span>
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">Đơn đề nghị xác nhận tình trạng bất động sản</h4>
                    <p className="line-clamp-1 text-sm text-slate-600">Mẫu số 01/XN-BĐS áp dụng cho các giao dịch liên quan đến nhà đất.</p>
                  </div>
                  <button type="button" className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[#1f7a5a] transition-colors hover:bg-[#1f7a5a]/10">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Tải về
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-[#1f7a5a]/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded bg-[#1f7a5a]/10 px-2 py-0.5 text-xs font-semibold text-[#1f7a5a]">Xây dựng</span>
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">Đơn xin cấp phép xây dựng nhà ở riêng lẻ</h4>
                    <p className="line-clamp-1 text-sm text-slate-600">Kèm theo hướng dẫn chi tiết các bản vẽ cần thiết.</p>
                  </div>
                  <button type="button" className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[#1f7a5a] transition-colors hover:bg-[#1f7a5a]/10">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Tải về
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
