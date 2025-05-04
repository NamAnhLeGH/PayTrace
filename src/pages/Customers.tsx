import { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import InvoiceModal from "../components/InvoiceModal";
import FilterModal from "../components/FilterModal";
import { Customer, Order } from "../types";

const Customers = ({ customers }: { customers: Customer[] }) => {
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

  const filtered = customers.filter(
    (c) =>
      (!filters.first ||
        c.given_name?.toLowerCase().includes(filters.first.toLowerCase())) &&
      (!filters.last ||
        c.family_name?.toLowerCase().includes(filters.last.toLowerCase())) &&
      (!filters.email ||
        c.email_address?.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.phone || c.phone_number?.includes(filters.phone))
  );

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Customers</h2>
        <button className="btn btn-primary" onClick={() => setShowFilter(true)}>
          Filter
        </button>
      </div>
      <CustomerTable
        customers={filtered}
        onViewInvoices={(c) => {
          setSelectedCustomer(c);
          setShowModal(true);
        }}
      />
      <InvoiceModal
        customer={selectedCustomer}
        show={showModal}
        onClose={() => {
          setSelectedCustomer(null);
          setShowModal(false);
        }}
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
