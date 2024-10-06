import React, { useEffect, useState } from "react";
import axios from "axios";

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const getPostData = () => {
      axios
        .get("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@markfasel")
        .then((res) => {
          setPosts(res.data.items);
        })
        .catch((error) => {
          console.error("Error fetching blog posts:", error);
        });
    };
    useEffect(() => {
      getPostData();
    }, []);
    return (
      <div>
        {/* Your rendering logic goes here */}
        test
      </div>
    );
  };
  export default Blog;