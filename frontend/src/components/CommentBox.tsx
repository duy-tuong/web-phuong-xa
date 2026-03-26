"use client";

import Link from "next/link";
import Image from "next/image";

import type { Comment } from "@/types/comment";

export interface CommentBoxProps {
  comments: Comment[];
}

export default function CommentBox({ comments }: CommentBoxProps) {
  return (
    <section className="mt-2">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
        <span className="material-symbols-outlined text-[#1f7a5a]">forum</span>
        Binh luan ({comments.length})
      </h3>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
            <span className="material-symbols-outlined text-slate-500">person</span>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <textarea
              disabled
              className="min-h-[100px] w-full resize-y rounded-lg border-slate-300 bg-slate-50 text-sm opacity-80 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
              placeholder="Dang nhap de gui binh luan cho bai viet nay..."
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500">Backend hien moi co duyet binh luan, frontend se mo form gui sau khi bo sung API phu hop.</span>
              <Link href="/login" className="rounded-lg bg-[#1f7a5a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#196448]">
                Dang nhap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="mb-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Chua co binh luan nao duoc duyet cho bai viet nay.
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
                <span>Thich ({comment.likes})</span>
                <Link href="/login" className="transition-colors hover:text-[#1f7a5a]">Dang nhap de phan hoi</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
