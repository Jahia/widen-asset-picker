import React from 'react';
import logo from 'assets/logo.svg';
import 'components/App.scss';
import axios from 'axios';
import {Form} from "react-bootstrap";

const App = (props) => {

    const [query, setQuery] = React.useState("dog");
    const [data, setData] = React.useState({ });
  const [iframe, setIframe] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      const categories = await axios(
          'https://api.widencollective.com/v2/categories',
          {
            headers:{
              Authorization: 'Bearer virbac/ba4d0a71907a17aff9ebddc1fc91fd3a'
            }
          }
      );
      console.log("categories : ",categories)
      setData(categories.data);
    };

    fetchData();

  },[]);

    React.useEffect(() => {
        const fetchData = async () => {
            const instantSearch = await axios(
                'https://api.widencollective.com/v2/integrations/url',
                {
                    headers: {
                        Authorization: 'Bearer virbac/ba4d0a71907a17aff9ebddc1fc91fd3a'
                    },
                    params: {
                        //hideSearchBar: true,
                        query: query
                    }
                }
            );

            console.log("instantSearch : ", instantSearch.data);
            //const frameURL = URL.createObjectURL(instantSearch.data);
            setIframe(instantSearch.data.url);
        };
        fetchData();
    },[query])

    window.addEventListener('message', event =>{
        console.log("message : ",event.data);
        // const embedCode = event.data.items[0].embed_code;
        // console.log(embedCode);

        // Insert embedCode into user’s html content
        // Close iframe
    })

  const handleChange = (e) =>{
      const value= e.target.value;
      console.log("value : ",value);
      //TODO set query
  }

  return (
    <div className="App">
      <header className="App-header">
          <Form.Control
              name="search"
              id="search_123"
              label="Search"
              onChange={handleChange}
          />
        {iframe &&
        <iframe src={iframe} width="70%" height="700px"></iframe>
        }
      </header>


    </div>
  );
}

export default App;
