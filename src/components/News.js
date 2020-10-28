import React from "react";
import ArticleCard from "../components/ArticleCard";

function News({ newsData }) {
  if (newsData) {
    return (
      <div>
        <p className="News_Headlines">Recent Headlines</p>
        {newsData.map((article, i) => (
          <ArticleCard key={i} articleData={article} /> // unique key for each article component
        ))}
      </div>
    );
  } else return <></>;
}

export default News;
