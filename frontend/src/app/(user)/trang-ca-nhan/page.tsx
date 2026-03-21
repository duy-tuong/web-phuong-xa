"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileEdit, Loader2, PlusCircle } from "lucide-react";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileRecentRecords from "@/components/profile/ProfileRecentRecords";
import ProfileNotifications from "@/components/profile/ProfileNotifications";
import ProfileUpdateModal from "@/components/profile/ProfileUpdateModal";

type MockSession = {
  fullName: string;
  identifier: string;
};

const AUTH_STORAGE_KEY = "mock-auth-session";
const AUTH_EVENT_NAME = "mock-auth-change";

function readStoredSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }
}

export default function TrangCaNhanPage() {
  const router = useRouter();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [session, setSession] = useState<MockSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      const nextSession = readStoredSession();
      if (!nextSession) {
        setSession(null);
        setIsCheckingAuth(false);
        window.location.replace("/");
        return;
      }
      setSession(nextSession);
      setIsCheckingAuth(false);
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener(AUTH_EVENT_NAME, syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(AUTH_EVENT_NAME, syncAuthState);
    };
  }, [router]);

  const handleLogout = () => {
    setSession(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatchAuthChange();
    window.location.replace("/");
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/70">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
          Đang kiểm tra trạng thái đăng nhập...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/70">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
          Đang chuyển về trang chủ...
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-slate-50/70 py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <ProfileSidebar session={session} onLogout={handleLogout} />

            <section className="flex-1 space-y-8">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Tài khoản của tôi</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUpdateModal(true)}
                        className="inline-flex items-center justify-center rounded-lg border-2 border-red-700 bg-white px-5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      >
                        <FileEdit className="mr-2 h-5 w-5" />
                        Cập nhật thông tin
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/dich-vu/nop-ho-so")}
                        className="inline-flex items-center justify-center rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Nộp hồ sơ mới
                      </button>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-slate-900">Xin chào, {session.fullName}!</h2>
                    <p className="mt-2 text-slate-600">
                      Chào mừng bạn quay lại Cổng thông tin điện tử Phường Cao Lãnh. Thông tin hồ sơ và thông báo mới đã được tổng hợp bên dưới.
                    </p>
                  </div>
                </div>
              </div>

              <ProfileStats />
              <ProfileRecentRecords />
              <ProfileNotifications />
            </section>
          </div>
        </div>
      </main>

      <ProfileUpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </>
  );
}
