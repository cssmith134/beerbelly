import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveBrewery, searchBreweries } from '../utils/API';  
import { saveBreweryIds, getSavedBreweryIds } from '../utils/localStorage';
const SearchBreweries = () => {
 
  // create state for holding returned google api data
  const [searchedBreweries, setSearchedBreweries] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved drinkId values
  const [savedBreweryIds, setSavedBreweryIds] = useState(getSavedBreweryIds());

  // set up useEffect hook to save `savedDrinkIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBreweryIds(savedBreweryIds);
  });

  // create method to search for drinks and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchBreweries(searchInput); 
      if (!response.ok) {
        throw new Error('Ops! Something went wrong!');
      }

      const { items } = await response.json();
      const breweryData = items.map((brewery) => ({
        breweryId: brewery.id,
        authors: brewery.volumeInfo.authors || ['No Breweries to display'],
        title: brewery.volumeInfo.title,
        description: brewery.volumeInfo.description,
        image: drink.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBreweries(breweryData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleSaveBrewery = async (breweryId) => {

    const breweryToSave = searchedBrewery.find((brewery) => brewery.breweryId === breweryId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBrewery(breweryToSave, token);
      if (!response.ok) {
        throw new Error('Ops! Something went wrong!');
      }

      // if drink successfully saves to user's account, save drink id to state
      setSavedBreweryIds([...savedBreweryIds, breweryToSave.breweryId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Breweries!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a Brewery'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchDrinks.length
            ? `Viewing ${searchedBreweries.length} results:`
            : 'Search for a Brewery to begin'}
        </h2>
        <CardColumns>
          {searchedBreweries.map((brewery) => {
            return (
              <Card key={brewery.breweryId} border='dark'>
                {brewery.image ? (
                  <Card.Img src={drink.image} alt={`The cover for ${brewery.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{brewery.title}</Card.Title>
                  <p className='small'>Authors: {brewery.authors}</p>
                  <Card.Text>{brewery.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBrewery(brewery.breweryId)}>
                      {savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)
                        ? 'This Brewery has already been saved to your Favorite Breweries!'
                        : 'Save this Brewery to your favorites!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBreweries;

