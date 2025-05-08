import SearchContainer from "../components/SearchContainer";

const Customers = () => {
  return (
    <div className="container mt-5 pt-5">
      <SearchContainer optionalFC={<h1>Search</h1>} />
    </div>
  );
};

export default Customers;
