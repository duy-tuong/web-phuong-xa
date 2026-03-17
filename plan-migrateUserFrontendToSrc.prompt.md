## Ke hoach: Chuyen Frontend User sang src

Trang thai hien tai: cau truc App Router da duoc dua vao frontend/src/app. Giai doan tiep theo tap trung hoan thien giao dien User va bo sung noi dung theo thiet ke.

**Cac buoc**

1. Hoan thien User layout/page: bo sung component hoa va noi dung theo ban thiet ke trong frontend/src/app/(user).
2. Hoan thien route bat buoc User: cap nhat giao dien chi tiet cho gioi-thieu, tin-tuc/[id], dich-vu/[id], dich-vu/nop-ho-so, dich-vu/tra-cuu, thu-vien/hinh-anh, thu-vien/video, lien-he.
3. Bo sung services/lib/types that su dung trong src de ket noi API va type an toan.
4. Toi uu responsive va QA: kiem tra desktop/mobile, loading/error, dieu huong route.

**File lien quan**

- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/tsconfig.json - dam bao alias va include ho tro cau truc src
- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/next.config.ts - kiem tra tuong thich app dir trong src
- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/src/app/layout.tsx - app shell hien tai
- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/src/app/(user)/layout.tsx - layout user hien tai
- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/src/app/(user)/page.tsx - trang chu user hien tai
- d:/CNTT23A-CS/LT F_N/web-phuong-xa/frontend/src/app/(admin)/login/page.tsx - route admin hien tai

**Xac minh**

1. Chay lint/build/dev trong frontend va xac nhan khong con loi import sau migration.
2. Truy cap thu cong cac route da migrate va cac route skeleton moi, dam bao HTTP 200 va layout boc dung.
3. Kiem tra it nhat mot dynamic route trong tin-tuc/[id] va dich-vu/[id], bao gom loading/error boundary.
4. Xac nhan static assets va global styles van tai dung sau khi doi vi tri.

**Quyet dinh**

- Da chon: migrate tu frontend/app sang frontend/src/app.
- Pham vi: migration cau truc thu muc + dap ung skeleton route bat buoc.
- Ngoai pham vi giai doan nay: hoan thien UI nghiep vu day du va tich hop backend chi tiet.

**Luu y Git (bat buoc)**

- Chi lam viec va luu commit tren dung nhanh frontend-user-minh-hieu.
- Khong push len nhanh main.

**Can nhac them**

1. Sau khi migration xong, quyet dinh giu hay xoa frontend/app cu. Khuyen nghi: xoa sau khi verify de tranh route trung lap.
2. Neu frontend/(user)/chinhgiaodien chua HTML tham chieu thiet ke, quyet dinh giu lam tai lieu tham khao hay chuyen thanh React components o giai doan sau.
