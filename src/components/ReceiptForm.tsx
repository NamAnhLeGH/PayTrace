type Props = {
  issuedBy: string;
  note: string;
  setIssuedBy: (val: string) => void;
  setNote: (val: string) => void;
};

const ReceiptForm = ({ issuedBy, note, setIssuedBy, setNote }: Props) => (
  <form>
    <div className="mb-3">
      <label htmlFor="issuedBy" className="form-label">
        <strong>Issued By:</strong>
      </label>
      <input
        type="text"
        className="form-control"
        id="issuedBy"
        value={issuedBy}
        onChange={(e) => setIssuedBy(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="note" className="form-label">
        <strong>Note:</strong>
      </label>
      <textarea
        className="form-control"
        id="note"
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a message for the receipt..."
      />
    </div>
  </form>
);

export default ReceiptForm;
