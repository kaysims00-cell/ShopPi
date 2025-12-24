import { NextResponse } from "next/server";

let users: any[] = []; // Temporary in-memory database

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });

  const exists = users.find((u) => u.email === email);
  if (exists)
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 400 }
    );

  const newUser = { id: Date.now().toString(), email, password };
  users.push(newUser);

  return NextResponse.json({ message: "Registered successfully" });
}
