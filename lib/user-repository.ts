import { getDatabasePool, hasDatabaseUrl } from "@/lib/db";
import { createNgoProfile, createRestaurantProfile, createUser, listUsers, updateUserVerification } from "@/lib/store";
import { User, UserRole, VerificationStatus } from "@/lib/types";

interface UserInput {
  name: string;
  email: string;
  phone: string;
  area: string;
  role: UserRole;
}

export async function listAppUsers() {
  if (!hasDatabaseUrl()) {
    return listUsers();
  }

  await ensureSchema();
  const pool = getDatabasePool();
  const result = await pool.query(
    `select id, name, email, phone, area, role, verification_status as "verificationStatus"
     from replate_users
     order by created_at desc`
  );

  const dbUsers = result.rows as User[];
  const hasAdmin = dbUsers.some((user) => user.role === "admin");
  return hasAdmin ? dbUsers : [...dbUsers, ...listUsers("admin")];
}

export async function createAppUser(input: UserInput) {
  if (!hasDatabaseUrl()) {
    const user = createUser(input);
    if (input.role === "restaurant") {
      createRestaurantProfile({
        userId: user.id,
        businessName: `${user.name}'s Kitchen`,
        address: `${input.area}, Nagpur`,
        hours: "11:00-22:00",
        fssaiOptional: ""
      });
    }

    if (input.role === "ngo") {
      createNgoProfile({
        userId: user.id,
        ngoName: user.name,
        serviceArea: input.area,
        verificationNotes: "Submitted via MVP signup"
      });
    }

    return user;
  }

  await ensureSchema();
  const pool = getDatabasePool();
  const result = await pool.query(
    `insert into replate_users (name, email, phone, area, role, verification_status)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (email)
     do update set name = excluded.name, phone = excluded.phone, area = excluded.area, role = excluded.role
     returning id, name, email, phone, area, role, verification_status as "verificationStatus"`,
    [input.name, input.email.toLowerCase(), input.phone, input.area, input.role, input.role === "consumer" ? "verified" : "pending"]
  );

  return result.rows[0] as User;
}

export async function loginAppUser(email: string, role: UserRole) {
  if (!hasDatabaseUrl()) {
    return listUsers().find((user) => user.email.toLowerCase() === email.toLowerCase() && user.role === role) ?? null;
  }

  await ensureSchema();
  const pool = getDatabasePool();
  const result = await pool.query(
    `select id, name, email, phone, area, role, verification_status as "verificationStatus"
     from replate_users
     where lower(email) = lower($1) and role = $2
     limit 1`,
    [email, role]
  );

  if (result.rows[0]) {
    return result.rows[0] as User;
  }

  if (role === "admin") {
    return listUsers("admin")[0] ?? null;
  }

  return null;
}

export async function setUserVerification(userId: string, verificationStatus: VerificationStatus) {
  if (!hasDatabaseUrl()) {
    return updateUserVerification(userId, verificationStatus);
  }

  await ensureSchema();
  const pool = getDatabasePool();
  const result = await pool.query(
    `update replate_users
     set verification_status = $2
     where id = $1
     returning id, name, email, phone, area, role, verification_status as "verificationStatus"`,
    [userId, verificationStatus]
  );

  if (!result.rows[0]) {
    throw new Error("User not found");
  }

  return result.rows[0] as User;
}

async function ensureSchema() {
  const pool = getDatabasePool();
  await pool.query(`create extension if not exists pgcrypto;`);
  await pool.query(`
    create table if not exists replate_users (
      id text primary key default ('usr-' || replace(gen_random_uuid()::text, '-', '')),
      name text not null,
      email text not null unique,
      phone text not null,
      area text not null,
      role text not null,
      verification_status text not null default 'pending',
      created_at timestamptz not null default now()
    );
  `);
}
