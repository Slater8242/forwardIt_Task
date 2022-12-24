import { useEffect, useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { Button, Grid } from '@mui/material';

// initialize a GraphQL client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://countries.trevorblades.com'
});

// write a GraphQL query that asks for names and codes for all countries
const LIST_COUNTRIES = gql`
  {
    countries {
      name
      code
      phone
      emoji
    }
  }
`;

function App() {
  const [countryName, setCountryName] = useState<string | null>("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>("");
  
  const { data, loading, error } = useQuery(LIST_COUNTRIES, { client });
  
  interface CountryType {
    code?: string;
    name?: string;
    phone?: string;
    emoji?: string;
  }

  useEffect(()=>{
    fetch("https://ipinfo.io/json?token=e000eea0006ac7")
      .then((ip) => ip.json())
      .then((cityIp) => data?.countries.map((country: CountryType) => country.code === cityIp.country ? setCountryName(country.name) : undefined));
  }, [data?.countries])

  const countries: readonly CountryType[] = data?.countries.map((country: CountryType) => country);
  
  useEffect(()=>{
    data?.countries.map((country: CountryType) => country.phone === phoneNumber.replace("+", "") ? setCountryName(country.name) : "");
    phoneNumber.match(/^\+\d$/)
    console.log(phoneNumber);
  }, [phoneNumber, data?.countries])
  
  useEffect(()=>{
    data?.countries.map((country: CountryType) => country.name === countryName ? setPhoneNumber("+"+country.phone) : "");
    '+'.concat(countryName)
    console.log(countryName);
  }, [countryName, data?.countries])

  if (loading || error) {
    return <p>{error ? error.message : 'Loading...'}</p>;
  }
  
  // console.log(phoneNumber.match(/^\+[1-9]\d{10,14}$/));
  // console.log(phoneNumber.replace(/\D/,""));

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignContent="center"
        alignItems="center" 
        height="100vh"
      >
        <Grid item>
          <Autocomplete
            multiple={false}
            id="country-select"
            value={{ name: countryName }}
            sx={{ width: 300 }}
            options={countries}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={(event: any, newValue: CountryType | null) => newValue === null ? setCountryName("") : setCountryName(newValue.name)}
            getOptionLabel={(option: CountryType) => option.name}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt=""
                />
                {option.name} ({option.code}) +{option.phone}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'country', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <TextField
            id="country-input"
            sx={{ width: 300 }}
            label="Your phone number"
            value={phoneNumber}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPhoneNumber(event.target.value.slice(0, 16).replace(/(?!\+)\D/, ""))}
          />
        </Grid>
        <Grid item>
          <Button variant="contained">Next</Button>
        </Grid>
      </Grid>
    </>
  );
}

export default App;