import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  //   articles = [
  //     {
  //       source: {
  //         id: "wired",
  //         name: "Wired",
  //       },
  //       author: "Joel Khalili",
  //       title: "Bitcoin Investors Are Plotting a Major Coup",
  //       description:
  //         "A group of activist shareholders at the world's largest bitcoin investment trust claim they lost billions as the market tanked. Now they want to take control.",
  //       url: "https://www.wired.com/story/crypto-bitcoin-grayscale-coup/",
  //       urlToImage:
  //         "https://media.wired.com/photos/63e69faddcab861f7a47469f/191:100/w_1280",
  //       publishedAt: "2023-02-14T12:00:00Z",
  //       content:
  //         "Like Valkyrie, Osprey has called on Grayscale to step down as sponsor and put itself forward as a replacement. In an open letter, Osprey CEO Greg King promised to cut the management fee by 75 percent… [+2998 chars]",
  //     }
  //   ];

  const capitalizeFirstChar = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pagesize=${props.pageSize}`;
    let data = await fetch(url);
    setLoading(true);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(60);
    console.log(parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `NewsMonkey - ${capitalizeFirstChar( props.category )}`;
    updateNews();
    // eslint-disable-next-line
  }, [])

  //   const handlePrevClick = async () => {
  //     setPage(page - 1);
  //     updateNews();
  //   };

  //   const handleNextClick = async () => {
  //     setPage(page + 1);
  //     updateNews();
  //   };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pagesize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h1 className="text-center" style={{margin:'60px'}}>
        NewsMonkey - Top {capitalizeFirstChar(props.category)} Headlines
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 30) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 100)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
};

News.defaultProps = {
  country: "in",
  pageSize: 3,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
};

export default News;
