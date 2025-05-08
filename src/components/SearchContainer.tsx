import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Search, ArrowClockwise, Gear } from "react-bootstrap-icons";
import axios from "axios"; // Import axios for making HTTP requests
import CustomerContainer from "./CustomerContainer";

// Settings Component
type SettingsProps = {
  startDate: string | undefined;
  endDate: string | undefined;
  issuedBy: string;
  note: string;
  setStartDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIssuedBy: React.Dispatch<React.SetStateAction<string>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
};

const SettingsContainer = ({
  startDate,
  endDate,
  issuedBy,
  note,
  setStartDate,
  setEndDate,
  setIssuedBy,
  setNote,
}: SettingsProps) => {
  return (
    <div>
      <Form>
        <div className="row mb-3">
          <div className="col">
            <Form.Label htmlFor="startDate">Start Date</Form.Label>
            <Form.Control
              type="date"
              id="startDate"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col">
            <Form.Label htmlFor="endDate">End Date</Form.Label>
            <Form.Control
              type="date"
              id="endDate"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <Form.Label htmlFor="issuedBy">Issued By</Form.Label>
            <Form.Control
              type="text"
              id="issuedBy"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
            />
          </div>
          <div className="col">
            <Form.Label htmlFor="note">Note</Form.Label>
            <Form.Control
              type="text"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

// Main Search Container Component
type Props = {
  optionalFC?: React.ReactNode; // Optional component that can be passed
};

const SearchContainer = ({ optionalFC }: Props) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [issuedBy, setIssuedBy] = useState<string>("Admin");
  const [note, setNote] = useState<string>("Thank you for donating!");
  const [showSettings, setShowSettings] = useState(false); // Toggle for settings visibility
  const [selectedOption, setSelectedOption] = useState("exact"); // Default search type set to "exact"
  const [data, setData] = useState<any[]>([]); // To store fetched data
  const [loading, setLoading] = useState(false); // To handle loading state

  // Handle search type selection
  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
  };

  const clearFilters = () => {
    setFirst("");
    setLast("");
    setEmail("");
    setPhone("");
    setStartDate(undefined);
    setEndDate(undefined);
    setIssuedBy("Admin"); // Reset "Issued By" to default
    setNote("Thank you for donating!"); // Reset "Note" to default
    setSelectedOption("exact"); // Reset search type to "exact"
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      // Build the query string based on filter values
      const queryParams = new URLSearchParams({
        first,
        last,
        email,
        phone,
        startDate: startDate || "",
        endDate: endDate || "",
        searchType: selectedOption, // Include search type in the query
      });

      // Fetch data from your API
      const response = await axios.get(`/api/customers/search?${queryParams}`);
      setData(response.data); // Set the fetched data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSearch = () => {
    // Search filters and fetch data
    fetchData(); // Fetch data with the current filters
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings); // Toggle visibility of settings container
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {optionalFC}

        <div className="d-flex gap-2 d-flex align-items-center">
          <Form>
            <Form.Group controlId="formSearchOptionSelect">
              <Form.Select
                value={selectedOption}
                onChange={handleSearchTypeChange}
                aria-label="Select search type"
              >
                <option value="exact">Exact</option>
                <option value="fuzzy">Fuzzy</option>
              </Form.Select>
            </Form.Group>
          </Form>
          <Button
            variant="secondary"
            type="button"
            size="lg"
            onClick={toggleSettings}
            className="d-flex align-items-center"
          >
            <Gear />
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            size="lg"
            onClick={clearFilters}
            className="d-flex align-items-center"
          >
            <ArrowClockwise />
          </Button>
          <Button
            variant="primary"
            type="button"
            size="lg"
            onClick={handleSearch}
            className="d-flex align-items-center"
          >
            <Search />
          </Button>
        </div>
      </div>

      {/* Render the filter form */}
      <Form>
        <div className="row mb-3">
          <div className="col">
            <Form.Label htmlFor="first">First Name</Form.Label>
            <Form.Control
              type="text"
              id="first"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </div>
          <div className="col">
            <Form.Label htmlFor="last">Last Name</Form.Label>
            <Form.Control
              type="text"
              id="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col">
            <Form.Label htmlFor="phone">Phone Number</Form.Label>
            <Form.Control
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </Form>

      {/* Conditional rendering of settings container */}
      {showSettings && (
        <SettingsContainer
          startDate={startDate}
          endDate={endDate}
          issuedBy={issuedBy}
          note={note}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setIssuedBy={setIssuedBy}
          setNote={setNote}
        />
      )}

      <br />

      {/* Display loading state or data */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.length > 0 ? (
            <div>
              {/* Display each customer in the CustomerContainer */}
              {data.map((customer, index) => (
                <CustomerContainer
                  key={index}
                  customer={customer}
                  settings={{ startDate, endDate, issuedBy, note }} // Pass settings to CustomerContainer
                />
              ))}
            </div>
          ) : (
            <p>No data found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
