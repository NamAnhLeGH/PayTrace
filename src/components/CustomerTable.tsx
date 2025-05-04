import { Customer } from "../types";

type Props = {
  customers: Customer[];
  onViewInvoices: (customer: Customer) => void;
};

const CustomerTable = ({ customers, onViewInvoices }: Props) => (
  <table className="table table-hover table-striped">
    <thead className="table-dark">
      <tr>
        <th>#</th>
        <th>First</th>
        <th>Last</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Customer ID</th>
        <th>Invoices</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((c, index) => (
        <tr key={c.id}>
          <th scope="row">{index + 1}</th>
          <td>{c.given_name}</td>
          <td>{c.family_name}</td>
          <td>{c.email_address}</td>
          <td>{c.phone_number}</td>
          <td>{c.id}</td>
          <td>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onViewInvoices(c)}
            >
              <i className="bi bi-receipt"></i>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CustomerTable;
