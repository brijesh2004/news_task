import "../App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import image1 from '../assets/news.jpg';
import { ToggleContext } from "../context/ToggleContext";
import { useContext, useEffect, useState } from "react";

type Props = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  author?: string;
 
};

const Items = ({
  title,
  description,
  url,
  urlToImage,
  publishedAt,
  author,
}: Props) => {
  const { toggle } = useContext(ToggleContext);
  const localDate: string = new Date(publishedAt || "").toLocaleDateString();
  
  const article = { title, description, url, urlToImage, publishedAt, author };

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");
    const isAlreadySaved = savedItems.some((item: Props) => item.url === url);
    setIsSaved(isAlreadySaved);
  }, [url]);

  const handleSave = () => {
    let savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");
    if (isSaved) {
      savedItems = savedItems.filter((item: Props) => item.url !== url);
    } else {
      savedItems.push(article);
    }
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
    setIsSaved(!isSaved);
  };

   // Debugging log to check

  return (
    <Card className={toggle ? "card-dark text-center" : "card-light text-center"}>
      <Card.Header className="cheader">Unknown Source</Card.Header>
      <Card.Img
        className="news-img img-fluid"
        variant="top"
        src={urlToImage ? urlToImage : image1}
        alt="image from"
      />
      <Card.Body>
        <Card.Title className="text-start"><b>{title}</b></Card.Title>
        <Card.Subtitle className="text-start mt-3">Author:<span className="text-success"> {author || "Unknown"}</span></Card.Subtitle>
        <Card.Text className="text-start mt-3">{description || title}</Card.Text>
        <Card.Text className="text-start text-secondary">Published on: {localDate}</Card.Text>
        <a href={url} target="_blank" rel="noreferrer">
          <Button
            className="mt-3"
            variant="outline-dark"
          >
            <b>Read More</b>
          </Button>
        </a>
      </Card.Body>
      <Button className="w-[150px]" onClick={handleSave}>{isSaved ? "Saved" : "Save"}</Button>
    </Card>
  );
};

export default Items;
