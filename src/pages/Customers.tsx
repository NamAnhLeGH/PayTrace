import { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import InvoiceModal from "../components/InvoiceModal";
import FilterModal from "../components/FilterModal";
import { Customer, Order } from "../types";
import SearchContainer from "../components/SearchContainer";

const Customers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });

  return (
    <div className="container mt-5 pt-5">
      <SearchContainer
        onSearch={(f) => setFilters(f)}
        optionalFC={<h1>Search</h1>}
      />
      
      <FilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(f) => setFilters(f)}
      />
    </div>
  );
};

export default Customers;
