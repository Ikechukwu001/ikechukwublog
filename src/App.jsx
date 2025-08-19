import { useEffect, useState } from "react";
import { client } from "./sanityClient";
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

export default function App() {
  const [posts, setPosts] = useState([]);

  // Initialize Google Analytics
    useEffect(() => {
    ReactGA.initialize("G-KK1XK4L8W4"); 
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    client.fetch(`*[_type == "post"]{
      _id,
      title,
      "imageUrl": image.asset->url,
      slug,
      publishedAt
    } | order(publishedAt desc)`)
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#1e1e1e] text-gray-200 min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#121212] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
            IkechukwuGist
          </Link>
          <ul className="hidden sm:flex space-x-6 text-gray-300">
            <li className="hover:text-indigo-400 transition">Home</li>
            <li className="hover:text-indigo-400 transition">About</li>
            <li className="hover:text-indigo-400 transition">Contact</li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-r from-[#2b2b2b] to-[#1e1e1e] py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-3 text-white">Welcome to My Blog</h2>
        <p className="text-lg text-gray-400">Thoughts, ideas, and experiences — one post at a time.</p>
      </header>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <div
            key={post._id}
            className="bg-[#2b2b2b] rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              <Link
                to={`/post/${post.slug?.current}`}
                className="text-indigo-400 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] py-6 mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MyBlog. All rights reserved.
      </footer>
    </div>
  );
}
