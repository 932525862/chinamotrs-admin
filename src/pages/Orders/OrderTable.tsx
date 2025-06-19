/* import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Order } from "@/stores/order";

type Props = {
    order: Order;
    onEdit: () => void;
};

const OrderCard = ({ order, onEdit }: Props) => {
    return (
        <Card>
            <CardContent className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{order.firstName}</h3>
                <p>📱 {order.phoneNumber}</p>
                <p>📦 {order.modelName}</p>
                <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt || "").toLocaleString()}
                </p>
                <Button size="sm" className="mt-2" onClick={onEdit}>
                    Edit
                </Button>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
 */


import { Button } from "@/components/ui/button";
import type { Order } from "@/stores/order";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
    orders: Order[];
    onEdit: (order: Order) => void;
};

const OrderTable = ({ orders, onEdit }: Props) => {
    return (
        <ScrollArea className="w-full rounded-lg border">
            <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-gray-100">
                    <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Model</th>
                        <th className="px-4 py-3">Created At</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id || order.createdAt}>
                            <td className="px-4 py-3">{order.firstName}</td>
                            <td className="px-4 py-3">+{order.phoneNumber}</td>
                            <td className="px-4 py-3">{order.modelName}</td>
                            <td className="px-4 py-3">
                                {new Intl.DateTimeFormat("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                }).format(new Date(order.createdAt || ""))}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <Button size="sm" onClick={() => onEdit(order)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center text-gray-500 py-6">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </ScrollArea>
    );
};

export default OrderTable;
