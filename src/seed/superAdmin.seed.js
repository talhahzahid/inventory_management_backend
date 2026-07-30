import dotenv from "dotenv";
import Company from "../models/company.model.js";
import Role from "../models/roles.model.js";
import User from "../models/users.model.js";
import { ROLES } from "../config/permissions.js";
import { hashPassword } from "../utils/hashPassword.js";

dotenv.config();

const PLATFORM_COMPANY = {
  name: "Platform",
  slug: "platform-system",
  email: "platform@system.local",
  phone: "0000000000",
  address: "System",
  logo: "platform-logo.png",
  status: "active",
};

export const seedSuperAdmin = async () => {
  const superAdminRole = await Role.findOne({
    where: { name: ROLES.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    throw new Error("Super admin role not found. Run role seed first.");
  }

  const [company] = await Company.findOrCreate({
    where: { slug: PLATFORM_COMPANY.slug },
    defaults: PLATFORM_COMPANY,
  });

  const email =
    process.env.SUPER_ADMIN_EMAIL || "superadmin@platform.com";
  const password =
    process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
  const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    if (existingUser.role_id !== superAdminRole.id) {
      await existingUser.update({
        role_id: superAdminRole.id,
        company_id: company.id,
        status: "active",
      });
      console.log(`✔ Updated existing user to super admin: ${email}`);
    } else {
      console.log(`✔ Super admin already exists: ${email}`);
    }
    return;
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    company_id: company.id,
    name,
    email,
    password: hashedPassword,
    role_id: superAdminRole.id,
    status: "active",
  });

  console.log("✔ Super admin created successfully");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
};
