"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-sm">Got questions? We&apos;ve got answers</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-900 pr-4">{faq.question}</span>
              <FiChevronDown
                size={18}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === idx ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
