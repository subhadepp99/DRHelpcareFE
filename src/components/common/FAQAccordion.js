"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function FAQAccordion({
  entityType,
  entityId = null,
  className = "",
}) {
  const { get } = useApi();

  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchFaqs() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ entityType });
        if (entityId) params.set("entityId", entityId);
        const { data } = await get(`/faqs/public?${params.toString()}`);
        if (!ignore) setFaqs(data?.data?.faqs || []);
      } catch (e) {
        if (!ignore) setFaqs([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchFaqs();
    return () => {
      ignore = true;
    };
  }, [entityType, entityId, get]);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  // Don't render anything if there are no FAQs and not loading
  if (faqs.length === 0 && !loading) {
    return null;
  }

  return (
    <section className={`mt-8 mb-12 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        FAQs
      </h3>
      {loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading FAQs...
        </p>
      )}

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={faq._id} className="rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-4 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <span className="text-left font-medium text-gray-900 dark:text-white mr-3">
                {faq.question}
              </span>
              <div className="flex items-center gap-2">
                {openIndex === idx ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>
            <div
              className={`${openIndex === idx ? "block" : "hidden"} px-4 pb-4`}
            >
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
