import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import '../assets/news.css';

interface Props {
  children: React.ReactNode;
}

// Define types
interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  author?: string;
}

interface NewsApiResponse {
  articles: Article[];
}

interface NewsContextType {
  data: Article[];
  fetchData: (category: string) => void;
  error: string;
}

// Create a context for managing news data
const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Create a custom hook to interact with the NewsContext
const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

// Create a NewsProvider component to wrap your app with the NewsContext
const NewsProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");

  const fetchData = (category: string) => {
    if (category === 'Saved') {
      console.log("saved");
      const localData = localStorage.getItem('savedItems');
      console.log(localData);
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        setData([]);
      }
    } else {
      let url = `https://newsapi.org/v2/top-headlines?q=${category}&apiKey=${import.meta.env.VITE_APP_API_KEY}`;
      if (category === 'General') {
        url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${import.meta.env.VITE_APP_API_KEY}`;
      }
      axios
        .get<NewsApiResponse>(url)
        .then((res) => setData(res.data.articles))
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    }
  };

  useEffect(() => {
    // Fetch data for the "General" category when the component mounts
    fetchData('General');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NewsContext.Provider value={{ data, fetchData, error }}>
      {children}
    </NewsContext.Provider>
  );
};

export { NewsProvider, useNews };
