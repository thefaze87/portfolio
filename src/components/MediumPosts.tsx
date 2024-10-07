"use client";

import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import moment from "moment";

const MediumPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@mdf87"
        );
        const data = await response.json();
        setPosts(data.items);
      } catch (error) {
        console.error("Error fetching Medium posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <ul className="list-disc pl-5 space-y-4">
        {posts.map((post) => (
          <li
            className="text-gray-800 hover:text-gray-600 transition duration-200"
            key={post.guid}
          >
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              <h3>{decode(post.title, { level: "all" })}</h3>
              <p>
                <small>{moment(post.pubDate).format("MMMM Do, YYYY")}</small>
              </p>
              {/* <p>{post.description}</p> */}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediumPosts;
