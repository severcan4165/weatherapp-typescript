import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./Home.css";
import { weatherDataType } from "./type";

const apiKey = process.env.REACT_APP_apiKey;

const Home = () => {
  const [query, setQuery] = useState<string>("");
  const [cards, setCards] = useState<weatherDataType[] | undefined>([]);
  const [weatherData, setWeatherData] = useState<weatherDataType | undefined>();

  // const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weatherData.icon}.svg`;
  // const icon1 = "http://openweathermap.org/img/wn/${weatherData.icon}.png";

  const getWeather = async (city: string) => {
    try {
      const data = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const {
        main: { temp },
        name,
        weather: [{ description }],
        weather: [{ icon }],
      } = data.data;
      setWeatherData({
        temp: temp,
        description: description,
        name: name,
        icon: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${icon}.svg`,
      });

      setQuery("");
      
    } catch (error) {
      console.log(error);
    }
  };
  const updateCards = (info: weatherDataType) => {
    if (cards && cards.length < 5 && info.name !== "") {
      const temp = [...cards];
      temp.unshift(info);
      setCards(temp);
    }
    else if(cards && cards.length == 5){
      const temp = [...cards];
      temp.pop();
      temp.unshift(info)
      setCards(temp);
    }
    else{
      return;
    }
  };

  useEffect(() => {
   
    weatherData && updateCards(weatherData)
    
  }, [weatherData]);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      getWeather(query);
    }
  };
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    getWeather(query);
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="ms-auto p-5">
          <Col md={9} className="g-3">
            <InputGroup className="w-100">
              <Form.Control
                placeholder="Enter a City Name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                size="lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEnter}
              />
            </InputGroup>
          </Col>
          <Col md={3} className="g-3">
            <Button
              className="btnn"
              size="lg"
              onClick={handleSearch}
              variant="danger"
            >
              Search
            </Button>
          </Col>
        </Row>

        <Row className="ms-auto justify-content-center p-5">
          {
            cards?.map((item, index) => {
              console.log(cards);
              return (
                <Col className="g-3" sm={6} md={4} lg={3} key={index}>
                  <Card style={{ width: "100%" }}>
                    <Card.Img variant="top" src={item.icon} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <Card.Text>{Math.round(item.temp)}°C</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default Home;
