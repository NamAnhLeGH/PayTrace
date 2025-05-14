export type Customer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
};

export type Order = {
  id: string;
  location_id: string;
  customer_id?: string;
  line_items?: {
    name: string;
    quantity: string;
    base_price_money: {
      amount: number;
      currency: string;
    };
  }[];
  total_money?: {
    amount: number;
    currency: string;
  };
  created_at?: string;
  updated_at?: string;
  state?: string;
};

export type Settings = {
  startDate?: string;
  endDate?: string;
  issuedBy: string;
  note: string;
  selectedEmailOption: string;
  customEmail?: string;
};
