"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { readUserSession, USER_TOKEN_KEY } from "@/lib/user-session";
import { submitCommentByArticleSlug } from "@/services/commentService";
import type { Comment } from "@/types/comment";

export interface CommentBoxProps {
  articleSlug: string;
  comments: Comment[];
}

export default function CommentBox({ articleSlug, comments }: CommentBoxProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const currentSession = useMemo(() => readUserSession(), []);
  const hasUserToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem(USER_TOKEN_KEY));
  const canSubmit = Boolean(currentSession && hasUserToken);

  const handleSubmitComment = async () => {
    const trimmed = content.trim();
    if (!canSubmit || !currentSession) {
      setSubmitError("Vui lòng đăng nhập để gửi bình luận.");
      return;
    }

    if (trimmed.length < 5) {
      setSubmitError("Nội dung bình luận cần từ 5 ký tự trở lên.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      await submitCommentByArticleSlug({
        slug: articleSlug,
        userName: currentSession.fullName || currentSession.username,
        content: trimmed,
      });

      setContent("");
      setSubmitSuccess("Gửi bình luận thành công. Bình luận của bạn đang chờ duyệt.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể gửi bình luận";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-2">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
        <span className="material-symbols-outlined text-[#1f7a5a]">forum</span>
        Bình luận ({comments.length})
      </h3>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
            <span className="material-symbols-outlined text-slate-500">person</span>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <textarea
              disabled={!canSubmit || isSubmitting}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setSubmitError("");
                setSubmitSuccess("");
              }}
              className="min-h-[100px] w-full resize-y rounded-lg border-slate-300 bg-slate-50 text-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a] disabled:opacity-80"
              placeholder={canSubmit ? "Nhập bình luận của bạn..." : "Đăng nhập để gửi bình luận cho bài viết này..."}
            />
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs text-slate-500">
                {canSubmit
                  ? "Bình luận sau khi gửi sẽ ở trạng thái chờ duyệt."
                  : "Bạn cần đăng nhập để gửi bình luận."}
              </span>
              {canSubmit ? (
                <button
                  type="button"
                  onClick={() => void handleSubmitComment()}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#1f7a5a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#196448] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              ) : (
                <Link href="/login" className="w-full rounded-lg bg-[#1f7a5a] px-5 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#196448] sm:w-auto">
                  Đăng nhập
                </Link>
              )}
            </div>
            {submitError ? <p className="text-sm font-medium text-red-600">{submitError}</p> : null}
            {submitSuccess ? <p className="text-sm font-medium text-emerald-700">{submitSuccess}</p> : null}
          </div>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="mb-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Chưa có bình luận nào được duyệt cho bài viết này.
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={`${comment.name}-${comment.timeAgo}`} className="flex gap-4">
            <Image src={comment.avatar} alt={comment.name} width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" unoptimized />
            <div className="flex-1">
              <div className="rounded-2xl rounded-tl-none bg-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{comment.name}</h4>
                  <span className="text-xs text-slate-500">{comment.timeAgo}</span>
                </div>
                <p className="text-sm text-slate-700">{comment.content}</p>
              </div>
              <div className="ml-2 mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                <span>Thích ({comment.likes})</span>
                <Link href="/login" className="transition-colors hover:text-[#1f7a5a]">Đăng nhập để phản hồi</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
