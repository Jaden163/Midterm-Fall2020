import React from "react";

function ArticleCard({ articleData }) {
  if (articleData.description) {
    var filtered_description = articleData.description.replace(
      "Summary List Placement",
      ""
    );
    filtered_description = filtered_description
      .replace(/<ul>/g, "")
      .replace(/<li>/g, "")
      .replace(/<\/li>/g, "")
      .replace(/<\/ul>/g, "");
  }

  return (
    <div className="ArticleCard">
      <div className="ArticleCardImage">
        <img src={articleData.urlToImage} alt="Article image"></img>
      </div>
      <div className="ArticleText">
        <p className="ArticleText_Title">{articleData.title}</p>
        <p className="ArticleText_Author">
          By {articleData.author} at {articleData.source.name}
        </p>
        <p className="ArticleText_Desc">{filtered_description}</p>
        <a href={articleData.url}> Read More </a>
      </div>
    </div>
  );
}

export default ArticleCard;
