import User from './users.model.js';
import Company from './company.model.js';
import Role from './roles.model.js';
import Category from './categories.model.js';
import Supplier from './suppliers.model.js';
import Product from './products.model.js';
import Inventory from './inventory.model.js';

// Company <-> User
Company.hasMany (User, {
  foreignKey: 'company_id',
  as: 'users',
});

User.belongsTo (Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Role <-> User
Role.hasMany (User, {
  foreignKey: 'role_id',
  as: 'users',
});

User.belongsTo (Role, {
  foreignKey: 'role_id',
  as: 'role',
});

// Company <-> Category
Company.hasMany (Category, {
  foreignKey: 'company_id',
  as: 'categories',
});

Category.belongsTo (Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Company <-> Supplier
Company.hasMany (Supplier, {
  foreignKey: 'company_id',
  as: 'suppliers',
});

Supplier.belongsTo (Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Company <-> Product
Company.hasMany (Product, {
  foreignKey: 'company_id',
  as: 'products',
});

Product.belongsTo (Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Category <-> Product
Category.hasMany (Product, {
  foreignKey: 'category_id',
  as: 'products',
});

Product.belongsTo (Category, {
  foreignKey: 'category_id',
  as: 'category',
});

// Supplier <-> Product
Supplier.hasMany (Product, {
  foreignKey: 'supplier_id',
  as: 'products',
});

Product.belongsTo (Supplier, {
  foreignKey: 'supplier_id',
  as: 'supplier',
});

// Company <-> Inventory
Company.hasMany (Inventory, {
  foreignKey: 'company_id',
  as: 'inventory',
});

Inventory.belongsTo (Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Product <-> Inventory
Product.hasOne (Inventory, {
  foreignKey: 'product_id',
  as: 'inventory',
});

Inventory.belongsTo (Product, {
  foreignKey: 'product_id',
  as: 'product',
});

export {User, Company, Role, Category, Supplier, Product, Inventory};
