import Customer from "../models/customer.model.js";

const addCustomer = async (newCustomer) => {
  let customer;
  try {
    customer = new Customer(newCustomer);
  } catch (e) {
    throw new Error("Invalid customer");
  }
  return await customer.save();
};

const getCustomers = async () => {
  const allCustomers = await Customer.find({});
  if (allCustomers.length === 0) {
    throw new Error("No customer found");
  } else {
    return allCustomers;
  }
};

const updateCustomer = async (updatedCustomer, id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new Error("Customer not found");
  else return Customer.findByIdAndUpdate(id, updatedCustomer, { new: true });
};

const deleteCustomer = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new Error("Customer not found");
  else return Customer.findByIdAndDelete(id);
};

export { addCustomer, getCustomers, updateCustomer, deleteCustomer };
