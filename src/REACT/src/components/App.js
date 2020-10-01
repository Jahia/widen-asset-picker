import React from 'react';
// import logo from '../assets/logo.svg';
import spinner from "assets/loader_4.gif";
import 'components/App.scss';

import get from "lodash.get";
import {InputGroup, FormControl, Button, Row, Container,Col} from "react-bootstrap";

import {StoreContext} from "contexts";
import SearchForm from "components/SearchForm";
import Item from "components/Item";
import Facet from "components/Facet";
import {fetchSearchData} from "misc/data";
import CurrentFilter from "components/CurrentFilter";
import Paging from "components/Paging";

import 'bootstrap/dist/css/bootstrap.min.css';

const App = (props) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        context,
        error,
        isLoading,
        searchAnswers,
        searchIframe,
        searchFacets,
        needToFetch
    } = state;

    React.useEffect(() => {

        // console.log("[APP] needToFetch : ",needToFetch);

        const _fetchData = async () =>
            await fetchSearchData({
                path:"/",
                state,
                dispatch
            });

        if(needToFetch)
            _fetchData();

    },[needToFetch])

    if (error) return <Error e={error}/>;

    return (
        <Container className="pT4">
            <Row>
                <Col>
                    <SearchForm/>
                    {/*<CurrentFilter/>*/}
                    {/*<Paging/>*/}
                </Col>
            </Row>
            <Row>
                <Col>
                    {isLoading &&
                    <img className="pT4__spinner" src={spinner}/>
                    }
                    {!isLoading &&
                    <div className={`pT4__result ${isLoading?"":"fade-in"}`}>
                        {
                            searchAnswers.map( item =>
                                <Item
                                    key={item.id}
                                    item={item}
                                    locale={state.locale}
                                />
                            )
                        }
                    </div>
                    // searchIframe &&
                    // <iframe frameBorder="0" src={searchIframe} width="100%" height="700px"></iframe>
                    }
                </Col>
                <Col xs="4" sm="3" md="4" lg="3">
                    {/*<ul className="pT4__facet">*/}
                    {/*    {searchFacets.map( facet =>*/}
                    {/*        <Facet*/}
                    {/*            key={facet.id}*/}
                    {/*            facet={facet}*/}
                    {/*        />*/}
                    {/*    )*/}
                    {/*    }*/}
                    {/*</ul>*/}
                </Col>
            </Row>
        </Container>
    );






















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
    // const [isLoading, setIsLoading] = React.useState(false);
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

  const handleCategory = (e,category) => {
      console.log("handleCategory category : ",category);
      e.preventDefault();
      // const _query = `${query}&assetcategory:${category.id}`;//encodeURI();
      // const params = {...search.params,query:_query}
      const params = {...search.params,assetcategory:category.id};
      setSearch({...search,params});
  }

  return (
      <Container fluid>
          <Row>
              <Col>
                  <ul>
                  {categories.map(category =>
                      <li key={category.id}>
                          <a href="#" onClick={ e => handleCategory(e,category)}>
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
