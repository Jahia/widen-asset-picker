import React from 'react';
// import logo from '../assets/logo.svg';
import spinner from "assets/loader_4.gif";
import 'components/App.scss';
import axios from 'axios';

import {InputGroup, FormControl, Button, Row, Container,Col} from "react-bootstrap";
import get from "lodash.get";

import 'bootstrap/dist/css/bootstrap.min.css';

const widen=axios.create({
    baseURL:"https://api.widencollective.com/v2",
    headers:{
        Authorization: 'Bearer virbac/ba4d0a71907a17aff9ebddc1fc91fd3a'
    },
    responseType:"json",
    // withCredentials: true,//important to send the cookie
    timeout:2500
});


const App = (props) => {

    const [query, setQuery] = React.useState();
    const [categories, setCategories] = React.useState([]);
  const [iframe, setIframe] = React.useState();
    const [search, setSearch] = React.useState({
        url:"/integrations/url",
        params: {
            hideSearchBar: true,
            query: query
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
        const categories = await widen.get("/categories");
        console.log("categories : ",categories)
        setCategories(get(categories,"data.items",[]));
    };

    fetchData();

  },[]);

    React.useEffect(() => {
        if(search.params.query){
            const fetchData = async () => {
                setIframe(false);
                setIsError(false);
                setIsLoading(true);
                try {
                    const instantSearch = await widen.get(search.url,{params:search.params});
                    console.log("instantSearch : ", instantSearch.data);
                    //const frameURL = URL.createObjectURL(instantSearch.data);
                    setIframe(instantSearch.data.url);
                } catch (error) {
                    setIsError(true);
                }
                setIsLoading(false);
            };
            fetchData();
        }
    },[search])

    window.addEventListener('message', event =>{
        //TODO verifier si j'ai un event.data.items[0].embed_code sinon laisser passer
        // console.log("message : ",event.data);
        // const embedCode = event.data.items[0].embed_code;
        // console.log(embedCode);

        // Insert embedCode into user’s html content
        // Close iframe
    })

  const handleChange = (e) =>{
      const value= e.target.value;
      console.log("value : ",value);
      setQuery(value);
  }
  const handleSearch = () =>{
      console.log("handleSearch query : ",query);
        const params = {...search.params,query}
      setSearch({...search,params});
  }

  const handleCategory = (e,path) => {
      console.log("handleCategory path : ",path);
      e.preventDefault();
      const _query = `${query}&cat:(${path})`;//encodeURI();
      const params = {...search.params,query:_query}
      setSearch({...search,params});
  }

  return (
      <Container fluid>
          <Row>
              <Col>
                  <ul>
                  {categories.map(category =>
                      <li key={category.id}>
                          <a href="#" onClick={ e => handleCategory(e,category.path)}>
                              {category.name}
                          </a>
                      </li>
                    )}
                  </ul>
              </Col>
              <Col xs={10}>
                  {isError && <div>Something went wrong ...</div>}

                  <InputGroup className="mb-3">
                      <FormControl
                          placeholder="Search text"
                          onChange={handleChange}
                      />
                      <InputGroup.Append>
                          <Button
                              variant="outline-secondary"
                              onClick={handleSearch}>
                              Search
                          </Button>
                      </InputGroup.Append>
                  </InputGroup>
                  {isLoading &&
                    <img src={spinner}/>
                  }
                  {/*<img src={spinner}/>*/}
                  {iframe &&
                      <iframe frameBorder="0" src={iframe} width="100%" height="700px"></iframe>
                  }
              </Col>
          </Row>
      </Container>


  );
}

          // <div className="App">
          //     <header className="App-header">

          //     </header>
          // </div>

export default App;
