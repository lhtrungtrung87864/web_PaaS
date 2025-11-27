const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
};

const getCustomers = async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
};

const getCustomer = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  res.json(customer);
};

const updateCustomer = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  await customer.update(req.body);
  res.json(customer);
};

const deleteCustomer = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  await customer.destroy();
  res.json({ message: "Customer deleted" });
};

module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer };
