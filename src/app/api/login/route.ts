import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Fetch a list of clients from a Google Sheet.
 *
 * If the environment contains a valid `GOOGLE_SHEET_ID` and `GOOGLE_API_KEY` then
 * this helper will fetch data from the specified sheet and parse it into an
 * array of client records. The expected sheet format is:
 *
 *   | email | password | authorized | name | billingAddress | phoneNumber | purchases | payments |
 *
 * The first row must contain these headers exactly (case‑insensitive). The
 * `purchases` and `payments` cells should each contain a JSON string
 * representing an array of objects. For example, a purchases cell might be:
 *
 *   `[{"id":"compra-1","date":"2025-01-01","item":"Producto","amount":9.99,"status":"completado"}]`
 *
 * If the sheet cannot be fetched or parsed then an empty array is returned and
 * the caller should fall back to reading the local JSON file. No errors are
 * thrown from this helper – errors are logged to the console instead.
 */
async function fetchClientsFromGoogleSheet(): Promise<any[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;
  // Allow overriding the range (tab and columns) via env. Defaults to `Clients!A:H`.
  // The sheet should include headers: email, password, authorized, name,
  // billingAddress, phoneNumber, purchases, payments.
  const range = process.env.GOOGLE_SHEET_RANGE || "Clients!A:H";

  if (!sheetId || !apiKey) {
    return [];
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to fetch Google Sheet data: ${response.status} ${response.statusText}`
      );
      return [];
    }
    const data = await response.json();
    const values: any[][] = data.values;
    if (!Array.isArray(values) || values.length < 2) {
      // At least header + one row expected
      return [];
    }
    const headerRow = values[0].map((h) => String(h).toLowerCase().trim());
    const emailIndex = headerRow.indexOf("email");
    const passwordIndex = headerRow.indexOf("password");
    const purchasesIndex = headerRow.indexOf("purchases");
    const paymentsIndex = headerRow.indexOf("payments");
    const nameIndex = headerRow.indexOf("name");
    const addressIndex = headerRow.indexOf("billingaddress");
    const phoneIndex = headerRow.indexOf("phonenumber");
    const authorizedIndex = headerRow.indexOf("authorized");
    if (emailIndex === -1 || passwordIndex === -1) {
      console.error(
        "Google Sheet does not contain required headers 'email' and 'password'"
      );
      return [];
    }
    const clients: any[] = [];
    for (const row of values.slice(1)) {
      const email = row[emailIndex]?.trim();
      const password = row[passwordIndex]?.trim();
      if (!email || !password) continue;
      let purchases: any[] = [];
      let payments: any[] = [];
      // Determine whether this client is allowed to access the portal. We interpret
      // the `authorized` column as a boolean where any truthy string ("true",
      // "yes", "1") enables access. If the column is missing, default to
      // authorized. If the value is unrecognised it will be treated as false.
      let authorized = true;
      // Additional profile fields. These may be undefined if the sheet
      // doesn't include them.
      let name: string | undefined;
      let billingAddress: string | undefined;
      let phoneNumber: string | undefined;
      try {
        const rawPurchases = row[purchasesIndex];
        if (rawPurchases) {
          purchases = JSON.parse(rawPurchases);
        }
      } catch (e) {
        console.error("Failed to parse purchases JSON from sheet", e);
      }
      try {
        const rawPayments = row[paymentsIndex];
        if (rawPayments) {
          payments = JSON.parse(rawPayments);
        }
      } catch (e) {
        console.error("Failed to parse payments JSON from sheet", e);
      }
      // Parse the authorization flag
      if (authorizedIndex !== -1 && row[authorizedIndex] != null) {
        const rawAuth = String(row[authorizedIndex]).toLowerCase().trim();
        authorized = ["true", "yes", "1"].includes(rawAuth);
      }
      // Parse optional profile fields if present
      if (nameIndex !== -1) name = row[nameIndex];
      if (addressIndex !== -1) billingAddress = row[addressIndex];
      if (phoneIndex !== -1) phoneNumber = row[phoneIndex];
      clients.push({
        email,
        password,
        purchases,
        payments,
        authorized,
        name,
        billingAddress,
        phoneNumber,
      });
    }
    return clients;
  } catch (err) {
    console.error("Error fetching clients from Google Sheet:", err);
    return [];
  }
}

/**
 * Simple login API route.
 *
 * This endpoint accepts a POST request containing an email address and a
 * password. It reads the list of permitted clients from a JSON file under
 * `src/data/clients.json` and looks for a record with a matching email and
 * password. If a match is found the route returns the client's data
 * (including their purchases and payments). Otherwise a 401 response is
 * returned.
 *
 * Note: In a production application you should never store plaintext
 * passwords or ship them to the client. Use a secure authentication
 * provider or at least hash your passwords. This implementation is meant
 * as a placeholder to demonstrate how the portal could work.
 */

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Missing email or password" },
      { status: 400 }
    );
  }

  // Optionally fetch client records from a Google Sheet. If no sheet is
  // configured or the fetch fails, fall back to the local JSON file.
  let clients: any[] = [];
  try {
    clients = await fetchClientsFromGoogleSheet();
  } catch (e) {
    // Errors are logged inside fetchClientsFromGoogleSheet
  }
  if (clients.length === 0) {
    // Resolve the path to the clients JSON file relative to the project root.
    const filePath = path.join(process.cwd(), "src", "data", "clients.json");
    try {
      const file = fs.readFileSync(filePath, "utf8");
      clients = JSON.parse(file);
    } catch (err) {
      console.error("Failed to read clients file:", err);
      return NextResponse.json(
        { ok: false, message: "Server error" },
        { status: 500 }
      );
    }
  }

  const client = clients.find(
    (c) => c.email === email && c.password === password
  );

  // If no matching user or password, deny.
  if (!client) {
    return NextResponse.json(
      { ok: false, message: "Credenciales inválidas" },
      { status: 401 }
    );
  }
  // Check if the client is authorized. If the "authorized" field is strictly
  // false then this account has been disabled. Missing or true values are
  // treated as authorized.
  if (client.authorized === false) {
    return NextResponse.json(
      { ok: false, message: "Acceso no autorizado" },
      { status: 403 }
    );
  }

  // Remove the password and authorization flag before returning the client object
  const { password: _pw, authorized: _auth, ...clientWithoutSensitive } = client;

  return NextResponse.json({
    ok: true,
    client: clientWithoutSensitive,
  });
}