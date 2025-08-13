import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "./sanityClient";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          body,
          publishedAt,
          "imageUrl": image.asset->url
        }`,
        { slug }
      )
      .then((data) => setPost(data))
      .catch(console.error);
  }, [slug]);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1e1e1e] text-gray-300">
        Loading...
      </div>
    );
  }

  // Extract first paragraph for description
  const firstParagraph =
    post.body?.find((block) => block._type === "block")?.children
      ?.map((child) => child.text)
      .join(" ") || "";

  return (
    <div className="bg-[#1e1e1e] text-gray-200 min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.title} | MyBlog</title>
        <meta name="description" content={firstParagraph} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={firstParagraph} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={firstParagraph} />
        <meta name="twitter:image" content={post.imageUrl} />
      </Helmet>

      {/* Navbar */}
      <nav className="bg-[#121212] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
            MyBlog
          </Link>
          <ul className="hidden sm:flex space-x-6 text-gray-300">
            <li className="hover:text-indigo-400 transition">Home</li>
            <li className="hover:text-indigo-400 transition">About</li>
            <li className="hover:text-indigo-400 transition">Contact</li>
          </ul>
        </div>
      </nav>

      {/* Post Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {post.imageUrl && (
          <motion.img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
        <motion.h1
          className="text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {post.title}
        </motion.h1>
        <p className="text-gray-400 text-sm mb-6">
          Published on {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        <motion.div
          className="prose prose-invert max-w-none text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {post.body?.map((block, index) => {
            if (block._type === "block") {
              return (
                <p key={index} className="mb-4">
                  {block.children.map((child) => child.text).join("")}
                </p>
              );
            }
            return null;
          })}
        </motion.div>

        {/* Back Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Link
            to="/"
            className="inline-block mt-10 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#808080] py-6 mt-12 text-center text-white text-sm">
        © {new Date().getFullYear()} MyBlog. All rights reserved.
      </footer>
    </div>
  );
}
