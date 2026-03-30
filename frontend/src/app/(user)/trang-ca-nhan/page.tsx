"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileEdit, Loader2, PlusCircle } from "lucide-react";

import ProfileNotifications from "@/components/profile/ProfileNotifications";
import ProfileRecentRecords from "@/components/profile/ProfileRecentRecords";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileUpdateModal from "@/components/profile/ProfileUpdateModal";
import { buildPathWithSearchParams, cloneSearchParams, setOptionalQueryParam } from "@/lib/query-params";
import { clearUserSession, readUserSession, writeUserSession } from "@/lib/user-session";
import { fetchCurrentUser } from "@/services/admin/profile";
import { searchPublicApplications } from "@/services/applicationService";
import type { Application, User } from "@/types";

function buildLookupQuery(user: User) {
  const params = cloneSearchParams("");
  setOptionalQueryParam(params, "email", user.email);
  setOptionalQueryParam(params, "phone", user.phone);
  return buildPathWithSearchParams("", params).replace(/^$/, "");
}

export default function TrangCaNhanPage() {
  const router = useRouter();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const token = window.localStorage.getItem("user_token");
      if (!token) {
        router.replace("/login?redirect=/trang-ca-nhan");
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        writeUserSession({
          username: currentUser.username,
          fullName: currentUser.fullName || currentUser.username,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role?.name,
        });

        if (!currentUser.email && !currentUser.phone) {
          setApplications([]);
          return;
        }

        const nextApplications = await searchPublicApplications({
          email: currentUser.email || undefined,
          phone: currentUser.phone || undefined,
        });

        if (!isMounted) {
          return;
        }

        setApplications(nextApplications);
      } catch {
        clearUserSession();
        router.replace("/login?redirect=/trang-ca-nhan");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const lookupQuery = useMemo(() => (user ? buildLookupQuery(user) : ""), [user]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending" || item.status === "processing").length,
      completed: applications.filter((item) => item.status === "done").length,
    }),
    [applications],
  );

  const handleLogout = () => {
    clearUserSession();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/70">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
          Đang tải thông tin tài khoản...
        </div>
      </div>
    );
  }

  if (!user || !readUserSession()) {
    return null;
  }

  return (
    <>
      <main className="bg-slate-50/70 py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <ProfileSidebar
              user={user}
              applicationCount={applications.length}
              applicationLookupQuery={lookupQuery}
              onLogout={handleLogout}
            />

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
                        onClick={() => router.push("/dich-vu")}
                        className="inline-flex items-center justify-center rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Đến dịch vụ công
                      </button>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-slate-900">Xin chào, {user.fullName || user.username}!</h2>
                    <p className="mt-2 text-slate-600">
                      Thông tin hồ sơ, trạng thái xử lý và các thông báo mới đã được đồng bộ từ hệ thống.
                    </p>
                  </div>
                </div>
              </div>

              <ProfileStats total={stats.total} pending={stats.pending} completed={stats.completed} />
              <ProfileRecentRecords applications={applications} lookupQuery={lookupQuery} />
              <ProfileNotifications applications={applications} />
            </section>
          </div>
        </div>
      </main>

      <ProfileUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        user={user}
        onSaved={(nextUser) => {
          setUser(nextUser);
          writeUserSession({
            username: nextUser.username,
            fullName: nextUser.fullName || nextUser.username,
            email: nextUser.email,
            phone: nextUser.phone,
            role: nextUser.role?.name,
          });
        }}
      />
    </>
  );
}
