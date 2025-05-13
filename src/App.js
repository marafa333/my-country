import axios from "axios";
import React, { useState } from "react";


function App() {
  const [country, setCountry] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
// Block List
    const BLACKLISTED_COUNTRIES = [
    "israel",
    "il",
    "state of israel",
    "isrā'īl",
    "إسرائيل",
    "دولة إسرائيل",
    "ישראל",
    "מדינת ישראל",
  ];

    const fetchPalestine = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://restcountries.com/v3.1/name/palestine"
      );
      setData(response.data[0]);
    } catch (error) {
      setError("Country not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountry = async (e) => {
    e.preventDefault();
    const trimCountry = country.trim().toLowerCase();
    if (!trimCountry) return;
    
const isBlocked = BLACKLISTED_COUNTRIES.includes(trimCountry);
    
      if (isBlocked) {
     await fetchPalestine();
      setCountry("");
      return;
  }

    setLoading(true);
    setData(null);
    setError(null);

    try {
      const resp = await axios.get(`https://restcountries.com/v3.1/name/${trimCountry}`)
      setData(resp.data[0]);
    } catch (error) {
      setError("Country not found. Please try again.")
    } finally {
      setLoading(false);
      setCountry("");
    }
  }

  return (
    <>
      <div className="container mt-4">
        {/* Title */}
        <h1 className="text-center text-light">Know Your Country</h1>
        {/* Form */}
        <form className="input-group w-75 m-auto mb-4" onSubmit={fetchCountry}>
          {/* Country Input */}
          <input type="text"
            onChange={(e) => {
              setCountry(e.target.value);
              e.target.setCustomValidity("");
            }}
            onInvalid={(e) => e.target.setCustomValidity("Please enter a country name")}
            value={country} className="form-control" placeholder="Enter country name in English" required />
          {/* Search Button */}
          <button className="btn btn-warning">Search</button>
        </form>
        {/* End Form */}
        {loading && (
          <div className="text-center my-3">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-2">Searching...</p>
          </div>
        )}
        {error && <div className="alert alert-danger w-75 m-auto">{error}</div>}
        {data && !loading && (
          <div className="card mt-4 w-50 m-auto text-center shadow">
            <div className="card-body">
              <h2 className="card-title">{data.name.common}</h2>
              <img src={data.flags.png} alt={data.flags.alt} className="w-50"></img>
              <p><strong>Capital: </strong>{data.capital?.[0]}</p>
              <p><strong>Population: </strong>{data.population.toLocaleString()}</p>
              <p><strong>Time Zone: </strong>{data.timezones?.[0]}</p>
              <p><strong>currency: </strong>{Object.values(data.currencies || {})[0]?.symbol} / {Object.values(data.currencies || {})[0]?.name}</p>
            </div>

          </div>
        )
        }
      </div>
    </>
  );
}

export default App;
