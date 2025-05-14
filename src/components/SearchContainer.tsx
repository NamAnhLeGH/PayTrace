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
  selectedEmailOption: string;
  customEmail: string;
  setStartDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIssuedBy: React.Dispatch<React.SetStateAction<string>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setSelectedEmailOption: React.Dispatch<React.SetStateAction<string>>;
  setCustomEmail: React.Dispatch<React.SetStateAction<string>>;
};

const SettingsContainer = ({
  startDate,
  endDate,
  issuedBy,
  note,
  selectedEmailOption,
  customEmail,
  setStartDate,
  setEndDate,
  setIssuedBy,
  setNote,
  setSelectedEmailOption,
  setCustomEmail,
}: SettingsProps) => {
  const handleEmailTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmailOption(e.target.value);
  };

  return (
    <div className="mt-3">
      <Form>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="startDate">Start Date</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="date"
                  id="startDate"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="endDate">End Date</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="date"
                  id="endDate"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="row mb-3">
              <div className="col-md-3">
                <Form.Label htmlFor="issuedBy">Issued By</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="text"
                  id="issuedBy"
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <Form.Group controlId="formEmailOptionSelect">
                  <Form.Select
                    value={selectedEmailOption}
                    onChange={handleEmailTypeChange}
                    aria-label="Select email type"
                  >
                    <option value="customer">To customer</option>
                    <option value="custom">To custom email</option>
                    <option value="cc">To both</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="text"
                  id="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  disabled={selectedEmailOption === "customer"} // Disable if "To customer" is selected
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="note">Note</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  as="textarea" // Use this to render a <textarea> element
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
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
  const [selectedSearchOption, setSelectedSearchOption] = useState("exact"); // Default search type set to "exact"
  const [selectedEmailOption, setSelectedEmailOption] = useState("customer"); // Default search type set to "exact"
  const [customEmail, setCustomEmail] = useState("");
  const [data, setData] = useState<any[]>([]); // To store fetched data
  const [loading, setLoading] = useState(false); // To handle loading state

  // Handle search type selection
  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSearchOption(event.target.value);
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
    setSelectedSearchOption("exact"); // Reset search type to "exact"
    setSelectedEmailOption("customer");
    setCustomEmail("");
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
        searchType: selectedSearchOption, // Include search type in the query
      });

      // Fetch data from your API
      const response = await axios.get(`/api/customers/search?${queryParams}`);
      setData(response.data); // Set the fetched data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
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
                value={selectedSearchOption}
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
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="first">First Name</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="text"
                  id="first"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="last">Last Name</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="text"
                  id="last"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="email">Email</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-3">
                <Form.Label htmlFor="phone">Phone Num</Form.Label>
              </div>
              <div className="col-md-9">
                <Form.Control
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
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
          selectedEmailOption={selectedEmailOption}
          customEmail={customEmail}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setIssuedBy={setIssuedBy}
          setNote={setNote}
          setSelectedEmailOption={setSelectedEmailOption}
          setCustomEmail={setCustomEmail}
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
                  settings={{
                    startDate,
                    endDate,
                    issuedBy,
                    note,
                    selectedEmailOption,
                    customEmail,
                  }} // Pass settings to CustomerContainer
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
