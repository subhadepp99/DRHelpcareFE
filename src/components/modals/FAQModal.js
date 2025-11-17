"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Save } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function FAQModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
}) {
  const { get, post, put, del } = useApi();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sortOrder: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchFAQs();
    }
  }, [isOpen, entityType, entityId]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ entityType });
      if (entityId) params.set("entityId", entityId);
      const { data } = await get(`/faqs/public?${params.toString()}`);
      setFaqs(data?.data?.faqs || []);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      sortOrder: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        entityType,
        entityId,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        sortOrder: formData.sortOrder,
      };
      const { data } = await post("/faqs", payload);
      const created = data?.data?.faq;
      if (created) {
        setFaqs((prev) => [created, ...prev]);
        toast.success("FAQ added successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to add FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder || 0,
    });
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await put(`/faqs/${editingId}`, {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        sortOrder: formData.sortOrder,
      });
      const updated = data?.data?.faq;
      if (updated) {
        setFaqs((prev) => prev.map((f) => (f._id === editingId ? updated : f)));
        toast.success("FAQ updated successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to update FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    setIsDeleting(true);
    try {
      await del(`/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      toast.success("FAQ deleted successfully");
    } catch (error) {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage FAQs - {entityName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add, edit, or delete frequently asked questions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add/Edit Form */}
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingId
                  ? "Edit FAQ"
                  : isAdding
                  ? "Add New FAQ"
                  : "FAQ Management"}
              </h3>
              {!isAdding && !editingId && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </button>
              )}
            </div>

            {(isAdding || editingId) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    placeholder="Enter the question"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
                    placeholder="Enter the answer"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={editingId ? handleUpdate : handleAdd}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Current FAQs ({faqs.length})
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading FAQs...
                </p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No FAQs available. Click "Add FAQ" to create the first one.
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                          {faq.answer}
                        </p>
                        {faq.sortOrder !== undefined && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Sort Order: {faq.sortOrder}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
