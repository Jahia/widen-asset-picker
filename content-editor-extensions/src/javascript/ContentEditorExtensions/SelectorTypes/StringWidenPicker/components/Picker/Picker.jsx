import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import {StoreContext} from '../../contexts';
import {fetchSearchData} from '../../misc/data';
import SearchForm from './SearchForm';
import Paging from './Paging';
import spinner from '../../assets/loader_4.gif';
import Item from './Item';

const errorMsg = 'Oups something get wrong';
const Error = ({e}) => {
    return (
        <>
            <h1>{errorMsg}</h1>
            <p>{e.message}</p>
        </>
    );
};




const Picker = props => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        error,
        isLoading,
        searchAnswers,
        needToFetch
    } = state;

    React.useEffect(() => {
        // Console.log("[APP] needToFetch : ",needToFetch);

        const _fetchData = async () =>
            await fetchSearchData({
                path: '/assets/search',
                state,
                dispatch
            });

        if (needToFetch) {
            _fetchData();
        }
    }, [needToFetch]);

    if (error) {
        return <Error e={error}/>;
    }

    return (
        <Container className="pT4">
            <Row>
                <Col>

                    <Paging/>    <SearchForm/>
                    {/* <CurrentFilter/> */}
                </Col>
            </Row>
            <Row>
                <Col>
                    {isLoading &&
                    <img className="pT4__spinner" src={spinner}/>}
                    {!isLoading &&
                    <div className={`pT4__result ${isLoading ? '' : 'fade-in'}`}>
                        {
                            searchAnswers.map(item => (
                                <Item
                                    key={item.id}
                                    item={item}
                                    locale={state.locale}
                                />
                              )
                            )
                        }
                    </div>
                        // SearchIframe &&
                        // <iframe frameBorder="0" src={searchIframe} width="100%" height="700px"></iframe>
                    }
                </Col>
                <Col xs="4" sm="3" md="4" lg="3">
                    {/* <ul className="pT4__facet"> */}
                    {/*    {searchFacets.map( facet => */}
                    {/*        <Facet */}
                    {/*            key={facet.id} */}
                    {/*            facet={facet} */}
                    {/*        /> */}
                    {/*    ) */}
                    {/*    } */}
                    {/* </ul> */}
                </Col>
            </Row>
        </Container>
    );
};

export default Picker;
