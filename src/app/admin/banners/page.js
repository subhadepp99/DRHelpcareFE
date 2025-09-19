"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Plus, Trash2, Upload, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageUtils";

export default function AdminBannersPage() {
  const { get, post, del, put } = useApi();
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [placement, setPlacement] = useState("home");

  const fetchBanners = async () => {
    try {
      const res = await get("/banners");
      setBanners(res.data?.data?.banners || res.data?.banners || []);
    } catch (e) {
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");
    try {
      setUploading(true);
      const form = new FormData();
      form.append("image", file);
      if (title) form.append("title", title);
      if (linkUrl) form.append("linkUrl", linkUrl);
      form.append("order", String(order || 0));
      form.append("placement", placement || "home");
      await post("/banners", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner uploaded");
      setFile(null);
      setTitle("");
      setLinkUrl("");
      setOrder(0);
      fetchBanners();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await del(`/banners/${id}`);
      toast.success("Banner deleted");
      fetchBanners();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleOrderChange = async (id, newOrder) => {
    try {
      await put(`/banners/${id}`, { order: Number(newOrder) || 0 });
      fetchBanners();
    } catch (e) {
      toast.error("Failed to update order");
    }
  };

  const homeBanners = banners.filter((b) => (b.placement || "home") === "home");
  const pathologyBanners = banners.filter((b) => b.placement === "pathology");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Banners</h1>
      </div>

      {/* Upload Instructions */}
      <div className="mb-6 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
        <h3 className="font-semibold mb-2">Upload Guidelines</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Recommended dimensions: 1600x500 px (Desktop), 800x600 px (Mobile
            safe)
          </li>
          <li>Accepted formats: JPG, JPEG, PNG, WEBP</li>
          <li>Maximum file size: 2MB (8MB hard limit)</li>
          <li>
            Keep important text within the center area for better mobile
            cropping
          </li>
        </ul>
      </div>

      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8 p-4 border rounded-lg bg-white dark:bg-gray-800"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (optional)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Banner title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Placement</label>
          <select
            className="input-field"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
          >
            <option value="home">Home</option>
            <option value="pathology">Pathology</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Link URL (optional)
          </label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="input-field"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Select Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            type="submit"
            disabled={uploading || !file}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {uploading ? "Uploading..." : "Add"}
          </button>
        </div>
      </form>

      {homeBanners.length === 0 && pathologyBanners.length === 0 ? (
        <p className="text-gray-500">No banners uploaded yet.</p>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">
              Home Banners ({homeBanners.length})
            </h2>
            {homeBanners.length === 0 ? (
              <p className="text-gray-500">No home banners.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homeBanners.map((b) => (
                  <div
                    key={b._id}
                    className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                      {getImageUrl(b.imageUrl) && (
                        <img
                          src={getImageUrl(b.imageUrl)}
                          alt={b.title || "Banner"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {b.title || "Untitled"}
                          </div>
                          {b.linkUrl && (
                            <a
                              href={b.linkUrl}
                              className="text-xs text-blue-600"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {b.linkUrl}
                            </a>
                          )}
                          <div className="text-xs text-gray-500 mt-1 break-all">
                            {getImageUrl(b.imageUrl)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={b.order || 0}
                          className="w-20 input-field"
                          onBlur={(e) =>
                            handleOrderChange(b._id, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Pathology Banners ({pathologyBanners.length})
            </h2>
            {pathologyBanners.length === 0 ? (
              <p className="text-gray-500">No pathology banners.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pathologyBanners.map((b) => (
                  <div
                    key={b._id}
                    className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                      {getImageUrl(b.imageUrl) && (
                        <img
                          src={getImageUrl(b.imageUrl)}
                          alt={b.title || "Banner"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {b.title || "Untitled"}
                          </div>
                          {b.linkUrl && (
                            <a
                              href={b.linkUrl}
                              className="text-xs text-blue-600"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {b.linkUrl}
                            </a>
                          )}
                          <div className="text-xs text-gray-500 mt-1 break-all">
                            {getImageUrl(b.imageUrl)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={b.order || 0}
                          className="w-20 input-field"
                          onBlur={(e) =>
                            handleOrderChange(b._id, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
