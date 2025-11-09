"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

export default function BlogPage() {
  const router = useRouter();
  const { get } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const stripHtml = (html) => {
    if (typeof html !== "string") return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim();
  };

  const generateSlug = (title, fallback) => {
    if (typeof title === "string" && title.trim().length > 0) {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    return fallback;
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await get("/blogs?limit=100&isPublished=true");
      const fetchedBlogs = response.data?.blogs || [];

      const cleanedBlogs = fetchedBlogs
        .filter((post) => post?.isPublished)
        .map((post) => ({
          ...post,
          slug: generateSlug(post.title, post.slug || post._id),
          author:
            post.author ||
            [post.createdBy?.firstName, post.createdBy?.lastName]
              .filter(Boolean)
              .join(" ") ||
            "Admin",
          category: post.category || "General",
          readTime: post.readTime || "5 min read",
          excerpt: (() => {
            const rawText = post.excerpt || stripHtml(post.content || "");
            if (!rawText) return "Read the latest update from our team.";
            return rawText.length > 220
              ? `${rawText.slice(0, 217)}…`
              : rawText;
          })(),
          imageUrl: post.imageUrl || "/images/blog-default.jpg",
        }));

      setBlogPosts(cleanedBlogs);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const postsToDisplay = blogPosts;

  const filteredPosts = postsToDisplay.filter((post) => {
    const searchTarget = searchQuery.toLowerCase();
    const title = post.title?.toLowerCase() || "";
    const excerpt = post.excerpt?.toLowerCase() || "";
    const category = post.category?.toLowerCase() || "";

    return (
      title.includes(searchTarget) ||
      excerpt.includes(searchTarget) ||
      category.includes(searchTarget)
    );
  });

  const categories = [
    "All",
    ...Array.from(new Set(postsToDisplay.map((post) => post.category))).filter(
      Boolean
    ),
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const displayedPosts =
    selectedCategory === "All"
      ? filteredPosts
      : filteredPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <MetaTags
        title={pageMetadata.blog.title}
        description={pageMetadata.blog.description}
        keywords={pageMetadata.blog.keywords}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        {/* Blog Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              DrHelp Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your trusted source for healthcare insights, medical tips, and
              wellness advice
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner w-8 h-8"></div>
            </div>
          ) : displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post, index) => {
                const slug = post.slug || post._id;
                const fallbackDate =
                  post.publishedDate ||
                  post.createdAt ||
                  post.updatedAt ||
                  post.date;
                const formattedDate = fallbackDate
                  ? new Date(fallbackDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "";

                return (
                  <motion.article
                    key={post._id || post.slug || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      slug ? "hover:-translate-y-2 cursor-pointer" : ""
                    }`}
                    onClick={() => slug && router.push(`/blog/${slug}`)}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                      {post.imageUrl && post.imageUrl !== "/images/blog-default.jpg" ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title || "Blog image"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">📰</span>
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full mb-3">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          {formattedDate && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                          {post.readTime && <span>{post.readTime}</span>}
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {post.author}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchQuery
                  ? "No articles found matching your search."
                  : "No blog posts are published yet. Please check back soon."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}

