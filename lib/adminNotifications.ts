import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "admin_notifications.json");

type Store = {
  newOrders: number;
};

function readStore(): Store {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { newOrders: 0 };
  }
}

function writeStore(data: Store) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function incrementAdminOrders() {
  const store = readStore();
  store.newOrders += 1;
  writeStore(store);
}

export function clearAdminOrders() {
  writeStore({ newOrders: 0 });
}

export function getAdminOrdersCount(): number {
  return readStore().newOrders;
}