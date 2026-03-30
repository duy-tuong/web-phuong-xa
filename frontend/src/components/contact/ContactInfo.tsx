// Hiển thị thông tin liên hệ của phường/xã như địa chỉ, 
// số điện thoại, email, bản đồ, giờ làm việc...
export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Thông tin liên hệ</h2>
        <ul className="space-y-5">
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined align-middle text-[#1f7a5a]">location_on</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Địa chỉ UBND Phường</p>
              <p className="font-semibold text-slate-900">Số 03, Đường 30/4, Phường Cao Lãnh, Thành phố Cao Lãnh, Tỉnh Đồng Tháp</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined align-middle text-[#1f7a5a]">call</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Hotline</p>
              <p className="font-semibold text-slate-900">0277 3851 234</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined align-middle text-[#1f7a5a]">email</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="font-semibold text-slate-900">phuongcaolanh@dongthap.gov.vn</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined align-middle text-[#1f7a5a]">schedule</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Giờ làm việc</p>
              <p className="font-semibold text-slate-900">Đức 2 - Thứ 6: 07:30 – 11:30 | 13:30 – 17:00</p>
              <p className="mt-0.5 text-sm text-slate-500">Tiếp dân: Sáng Thứ Năm hàng tuần</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <iframe
          title="Bản đồ UBND Phường Cao Lãnh, Thành phố Cao Lãnh"
          src="https://www.google.com/maps?q=03+%C4%91%C6%B0%E1%BB%9Dng+30%2F4%2C+Ph%C6%B0%E1%BB%9Dng+Cao+L%C3%A3nh%2C+Th%C3%A0nh+ph%E1%BB%91+Cao+L%C3%A3nh%2C+%C4%90%E1%BB%93ng+Th%C3%A1p&output=embed"
          className="h-[340px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href="https://www.google.com/maps/search/?api=1&query=03+%C4%91%C6%B0%E1%BB%9Dng+30%2F4%2C+Ph%C6%B0%E1%BB%9Dng+Cao+L%C3%A3nh%2C+Th%C3%A0nh+ph%E1%BB%91+Cao+L%C3%A3nh%2C+%C4%90%E1%BB%93ng+Th%C3%A1p"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-4 rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#155a42]"
        >
          Chỉ đường
        </a>
      </div>
    </div>
  );
}
