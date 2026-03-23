type ServiceModalsProps = {
  showTracking: boolean;
  showForms: boolean;
  onCloseTracking: () => void;
  onCloseForms: () => void;
};

export default function ServiceModals({ showTracking, showForms, onCloseTracking, onCloseForms }: ServiceModalsProps) {
  if (!showTracking && !showForms) return null;

  return (
    <>
      <div className={`${showTracking ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-slate-900/60 p-4 pb-20 backdrop-blur-sm transition-all duration-300`}>
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4 px-6">
            <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#1f7a5a]">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </span>
              TRA CỨU HỒ SƠ
            </h2>
            <button type="button" onClick={onCloseTracking} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-900">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Nhập mã hồ sơ (VD: H01.23.456)" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/20" />
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f7a5a] px-8 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#186248] focus:ring-4 focus:ring-[#1f7a5a]/30">
                 Kiểm Tra
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${showForms ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-slate-900/60 p-4 pb-10 backdrop-blur-sm transition-all duration-300`}>
        <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 p-4 px-6 text-slate-800">
            <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <span className="material-symbols-outlined text-[18px]">file_download</span>
              </span>
              HỆ THỐNG BIỂU MẪU
            </h2>
            <button type="button" onClick={onCloseForms} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-900">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 bg-slate-50/50">
            <div className="flex h-40 w-full flex-col items-center justify-center gap-3">
               <span className="material-symbols-outlined animate-spin text-4xl text-[#1f7a5a]">sync</span>
               <p className="font-semibold text-slate-500">Đang tải biểu mẫu từ máy chủ...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
