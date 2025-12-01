import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Attempt to update a client record in a Google Sheet.
 *
 * This function loads the current sheet values, finds the row where the email
 * matches, applies updates to allowed fields and writes the row back. It
 * returns the updated client object if successful. If the sheet or API
 * credentials are not configured or an error occurs, it returns null.
 */
async function updateClientInGoogleSheet(
  email: string,
  updates: Record<string, any>
): Promise<null | any> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;
  // Use provided range or default to clients!A:H to cover all expected columns
  const range = process.env.GOOGLE_SHEET_RANGE || "Clients!A:H";
  if (!sheetId || !apiKey) {
    return null;
  }
  try {
    // Fetch current values from the sheet
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}?key=${apiKey}`;
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      console.error(
        "Failed to fetch sheet data for update:", res.status, res.statusText
      );
      return null;
    }
    const data = await res.json();
    const values: any[][] = data.values;
    if (!Array.isArray(values) || values.length < 2) {
      console.error("Sheet has no data to update");
      return null;
    }
    // Determine header indices
    const headerRow = values[0].map((h: any) => String(h).toLowerCase().trim());
    const emailIndex = headerRow.indexOf("email");
    const passwordIndex = headerRow.indexOf("password");
    const authorizedIndex = headerRow.indexOf("authorized");
    const nameIndex = headerRow.indexOf("name");
    const addressIndex = headerRow.indexOf("billingaddress");
    const phoneIndex = headerRow.indexOf("phonenumber");
    const purchasesIndex = headerRow.indexOf("purchases");
    const paymentsIndex = headerRow.indexOf("payments");
    if (emailIndex === -1) {
      console.error("Sheet missing email column");
      return null;
    }
    // Find row index for the email
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[emailIndex] && String(row[emailIndex]).trim() === email) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      console.error("Client with email", email, "not found in sheet");
      return null;
    }
    const row = values[rowIndex].slice(); // clone row
    // Build client object to return later
    let clientObj: any = {};
    clientObj.email = row[emailIndex];
    // Apply updates to row and client object
    const setCell = (idx: number, value: any) => {
      // Ensure row has enough columns
      while (row.length <= idx) {
        row.push("");
      }
      row[idx] = value;
    };
    const allowedKeys = [
      "name",
      "billingAddress",
      "phoneNumber",
      "purchases",
      "payments",
      "authorized",
    ];
    for (const key of Object.keys(updates)) {
      if (!allowedKeys.includes(key)) continue;
      const value = updates[key];
      switch (key) {
        case "name":
          if (nameIndex !== -1) {
            setCell(nameIndex, value ?? "");
          }
          clientObj.name = value;
          break;
        case "billingAddress":
          if (addressIndex !== -1) {
            setCell(addressIndex, value ?? "");
          }
          clientObj.billingAddress = value;
          break;
        case "phoneNumber":
          if (phoneIndex !== -1) {
            setCell(phoneIndex, value ?? "");
          }
          clientObj.phoneNumber = value;
          break;
        case "purchases":
          if (purchasesIndex !== -1) {
            setCell(purchasesIndex, JSON.stringify(value ?? []));
          }
          clientObj.purchases = value;
          break;
        case "payments":
          if (paymentsIndex !== -1) {
            setCell(paymentsIndex, JSON.stringify(value ?? []));
          }
          clientObj.payments = value;
          break;
        case "authorized":
          if (authorizedIndex !== -1) {
            // Store as string for Google Sheets (TRUE or FALSE)
            const authVal = value ? "TRUE" : "FALSE";
            setCell(authorizedIndex, authVal);
          }
          clientObj.authorized = value;
          break;
      }
    }
    // Build update range (sheet name and row). Range must cover the same number
    // of columns as the original range to avoid shifting other rows.
    const [sheetName, rangeSpecifier] = range.split("!");
    // Determine number of columns from header length
    const numCols = headerRow.length;
    // Convert column index to letter (0 -> A, 1 -> B, ...). We assume less than 26 columns.
    const colLetter = (n: number) => String.fromCharCode("A".charCodeAt(0) + n);
    const startCol = colLetter(0);
    const endCol = colLetter(numCols - 1);
    const targetRange = `${sheetName}!${startCol}${rowIndex + 1}:${endCol}${rowIndex + 1}`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      targetRange
    )}?valueInputOption=USER_ENTERED&key=${apiKey}`;
    // Prepare payload: ensure row has exactly numCols values
    const rowValues = [];
    for (let i = 0; i < numCols; i++) {
      rowValues.push(row[i] ?? "");
    }
    const payload = { values: [rowValues] };
    const updateRes = await fetch(updateUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!updateRes.ok) {
      console.error(
        "Failed to update sheet row:", updateRes.status, updateRes.statusText
      );
      return null;
    }
    // Return the updated client object (without password)
    return clientObj;
  } catch (err) {
    console.error("Error updating Google Sheet:", err);
    return null;
  }
}

/**
 * API route for persisting updates to a client's record in the local JSON file.
 *
 * This endpoint accepts a POST request with a JSON payload containing an
 * `email` identifying the client and an `updates` object whose keys
 * correspond to the properties that should be changed (e.g. name,
 * billingAddress, phoneNumber, purchases, payments, etc.). The server
 * reads the existing `clients.json` file, applies the updates to the
 * matching client, writes the modified array back to disk, and returns
 * the updated client (without the password or authorization flag).
 *
 * Note: This implementation runs in a serverless environment and uses
 * synchronous file I/O for simplicity. In production you would want
 * concurrency controls and possibly a database instead of a JSON file.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, updates } = body || {};
    if (!email || typeof updates !== "object") {
      return NextResponse.json(
        { ok: false, message: "Missing email or updates." },
        { status: 400 }
      );
    }

    // Try updating via Google Sheets if configured. If this returns a client
    // object then the update succeeded. Otherwise fall back to the local JSON file.
    const updatedClientFromSheet = await updateClientInGoogleSheet(email, updates);
    if (updatedClientFromSheet) {
      return NextResponse.json({ ok: true, client: updatedClientFromSheet });
    }
    // Fall back to local JSON storage
    // Resolve the path to the clients.json file relative to the project root.
    const filePath = path.join(process.cwd(), "src", "data", "clients.json");
    let data;
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(fileContent);
      if (!Array.isArray(data)) {
        throw new Error("Invalid clients file format");
      }
    } catch (err) {
      console.error("Failed to read clients file:", err);
      return NextResponse.json(
        { ok: false, message: "Server error reading clients file." },
        { status: 500 }
      );
    }
    // Find the client by email
    const index = data.findIndex((c: any) => c.email === email);
    if (index === -1) {
      return NextResponse.json(
        { ok: false, message: "Client not found." },
        { status: 404 }
      );
    }
    // Apply updates to allowed fields
    const allowedKeys = [
      "name",
      "billingAddress",
      "phoneNumber",
      "purchases",
      "payments",
      "authorized",
    ];
    const client = data[index];
    for (const key of Object.keys(updates)) {
      if (allowedKeys.includes(key)) {
        client[key] = updates[key];
      }
    }
    // Write back to JSON
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("Failed to write clients file:", err);
      return NextResponse.json(
        { ok: false, message: "Server error writing clients file." },
        { status: 500 }
      );
    }
    // Return sanitized client
    const { password: _pw, authorized: _auth, ...clientWithoutSensitive } = client;
    return NextResponse.json({ ok: true, client: clientWithoutSensitive });
  } catch (err) {
    console.error("Unexpected error in update-client API:", err);
    return NextResponse.json(
      { ok: false, message: "Server error." },
      { status: 500 }
    );
  }
}