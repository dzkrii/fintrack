# Fintrack - Project Brief

## Overview

**Fintrack** is a personal finance tracking web application designed for a single user to manage their finances across multiple wallets/accounts.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Language**: TypeScript

## Specifications

### 1. User Scope

- **Single User**: Designed for personal use.
- **Authentication**: Simple login mechanism.

### 2. Core Features

- **Multi-Wallet**: Support for various accounts (Cash, Bank Transfer, E-Wallet, etc.).
- **Transactions**:
  - Income
  - Expense
  - **Transfer**: Ability to move funds between wallets (not counted as expense).
- **Categories**:
  - Single level depth.
  - Dynamic (User can Add/Delete).
  - Types: Income & Expense.
- **Currency**: IDR (Rupiah) only.
- **Budgeting**: _Out of scope for MVP_.

## Database Configuration

- **Container**: `fintrack-postgres`
- **Port Mapping**: `5433:5432` (Host:Container)
- **Connection URL**: `postgresql://fatahul:***@localhost:5433/fintrack`
- **Schema Key Models**:
  - `User`: Auth & Profile.
  - `Wallet`: Account balances.
  - `Category`: Transaction classification.
  - `Transaction`: Financial records (Type: INCOME, EXPENSE, TRANSFER).
