export type OrderStatus = "pending" | "shipped" | "delivered";

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: OrderStatus;
  date: string;
}

export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem("orders_db") || "[]");
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem("orders_db", JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    saveOrders(orders);
    return true;
  }
  return false;
};
