import React from 'react';

import spinner from "assets/loader_4.gif";
import 'components/App.scss';
import {Row, Container,Col} from "react-bootstrap";

import {StoreContext} from "contexts";
import SearchForm from "components/SearchForm";
import Item from "components/Item";
// import Facet from "components/Facet";
import {fetchSearchData} from "misc/data";
// import CurrentFilter from "components/CurrentFilter";
import Paging from "components/Paging";

import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faVideo,
    faImage,
    faSortAmountDown,
    faSortAmountUp,
    faSyncAlt,
    faSearch,
    faKiwiBird,
    faPowerOff,faBan,faTimes,faUserCheck,faUserTag,faCrosshairs,faChevronLeft,faChevronRight,faHashtag,faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane,faFileAlt,faCheckCircle,faThumbsUp,faUserCircle,faAddressCard,faFilePdf,faFileImage,faFileVideo,faFile} from '@fortawesome/free-regular-svg-icons';

library.add(
    faKiwiBird,
    faVideo,
    faImage,
    fab,
    faSearch,
    faPowerOff,
    faCheckCircle,
    faThumbsUp,
    faBan,
    faTimes,
    faUserCheck,
    faUserTag,
    faUserCircle,
    faAddressCard,
    faCrosshairs,
    faChevronLeft,
    faChevronRight,
    faHashtag,
    faEllipsisH,
    faFile,
    faFileAlt,
    faSyncAlt,
    faPaperPlane,
    faSortAmountDown,
    faSortAmountUp,
    faFilePdf,
    faFileImage,
    faFileVideo,
    faFile
);

const errorMsg = 'Oups something get wrong';
const Error= ({e}) => {
    return(
        <>
            <h1>{errorMsg}</h1>
            <p>{e.message}</p>
        </>
    );
}

const App = (props) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        error,
        isLoading,
        searchAnswers,
        searchFacets,
        needToFetch
    } = state;

    React.useEffect(() => {

        // console.log("[APP] needToFetch : ",needToFetch);

        const _fetchData = async () =>
            await fetchSearchData({
                path: "/assets/search",
                state,
                dispatch
            });

        if (needToFetch)
            _fetchData();

    }, [needToFetch])

    if (error) return <Error e={error}/>;

    return (
        <Container className="pT4">
            <Row>
                <Col>
                    <SearchForm/>
                    {/*<CurrentFilter/>*/}
                    <Paging/>
                </Col>
            </Row>
            <Row>
                <Col>
                    {isLoading &&
                    <img className="pT4__spinner" src={spinner}/>
                    }
                    {!isLoading &&
                    <div className={`pT4__result ${isLoading ? "" : "fade-in"}`}>
                        {
                            searchAnswers.map(item =>
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
                {/*<Col xs="4" sm="3" md="4" lg="3">*/}
                    {/*<ul className="pT4__facet">*/}
                    {/*    {searchFacets.map( facet =>*/}
                    {/*        <Facet*/}
                    {/*            key={facet.id}*/}
                    {/*            facet={facet}*/}
                    {/*        />*/}
                    {/*    )*/}
                    {/*    }*/}
                    {/*</ul>*/}
                {/*</Col>*/}
            </Row>
        </Container>
    );
}
export default App;
