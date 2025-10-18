import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Initialize the Postgres client
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

async function listInvoices() {
  try {
    const data = await sql<{
      amount: number;
      name: string;
    }[]>`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
