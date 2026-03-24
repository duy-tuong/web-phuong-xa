"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết...",
}: EditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }, { size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }],
        [{ align: [] }, { indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "list",
      "indent",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
    ],
    []
  );

  const safeValue = value ?? "";

  return (
    <div className="admin-rich-editor editor-wrapper rounded-lg border border-[hsl(36,16%,84%)] bg-white/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <ReactQuill
        theme="snow"
        value={safeValue}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="min-h-[300px]"
      />
      <p className="mt-2 px-1 text-[11px] text-stone-500">
        Hỗ trợ định dạng văn bản, căn lề, cấp tiêu đề, chèn liên kết và ảnh bằng URL.
      </p>
    </div>
  );
}
