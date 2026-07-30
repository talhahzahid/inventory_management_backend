import User from './users.model.js';
import Company from './company.model.js';
import Role from './roles.model.js';
import Category from './categories.model.js';
import Supplier from './suppliers.model.js';
import Product from './products.model.js';
import Inventory from './inventory.model.js';
import Sale from './sales.model.js';
import SaleItem from './sale_items.model.js';
import Purchase from './purchases.model.js';
import PurchaseItem from './purchase_items.model.js';

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

// Company <-> Sale
Company.hasMany (Sale, { foreignKey: 'company_id', as: 'sales' });
Sale.belongsTo (Company, { foreignKey: 'company_id', as: 'company' });

// User <-> Sale
User.hasMany (Sale, { foreignKey: 'sold_by', as: 'sales' });
Sale.belongsTo (User, { foreignKey: 'sold_by', as: 'seller' });

// Sale <-> SaleItem
Sale.hasMany (SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo (Sale, { foreignKey: 'sale_id', as: 'sale' });

// Product <-> SaleItem
Product.hasMany (SaleItem, { foreignKey: 'product_id', as: 'saleItems' });
SaleItem.belongsTo (Product, { foreignKey: 'product_id', as: 'product' });

// Company <-> Purchase
Company.hasMany (Purchase, { foreignKey: 'company_id', as: 'purchases' });
Purchase.belongsTo (Company, { foreignKey: 'company_id', as: 'company' });

// Supplier <-> Purchase
Supplier.hasMany (Purchase, { foreignKey: 'supplier_id', as: 'purchases' });
Purchase.belongsTo (Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// User <-> Purchase
User.hasMany (Purchase, { foreignKey: 'purchased_by', as: 'purchases' });
Purchase.belongsTo (User, { foreignKey: 'purchased_by', as: 'buyer' });

// Purchase <-> PurchaseItem
Purchase.hasMany (PurchaseItem, { foreignKey: 'purchase_id', as: 'items' });
PurchaseItem.belongsTo (Purchase, { foreignKey: 'purchase_id', as: 'purchase' });

// Product <-> PurchaseItem
Product.hasMany (PurchaseItem, { foreignKey: 'product_id', as: 'purchaseItems' });
PurchaseItem.belongsTo (Product, { foreignKey: 'product_id', as: 'product' });

export {
  User,
  Company,
  Role,
  Category,
  Supplier,
  Product,
  Inventory,
  Sale,
  SaleItem,
  Purchase,
  PurchaseItem,
};
