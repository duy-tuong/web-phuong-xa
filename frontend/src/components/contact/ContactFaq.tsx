"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function ContactFaq({ faqItems }: { faqItems: FaqItem[] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 mt-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Câu hỏi thường gặp</h2>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div key={item.question} className="overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex((prev) => (prev === index ? null : index))}
                  className="flex w-full items-center justify-between bg-white px-4 py-3 text-left font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <span>{item.question}</span>
                  <span
                    className={`material-symbols-outlined align-middle text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
