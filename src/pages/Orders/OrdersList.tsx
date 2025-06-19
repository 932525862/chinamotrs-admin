import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/button";
import OrderEditModal from "./OrderEditModal";
import Pagination from "@/components/pagination/pagination";

const OrderList = () => {
    const { orders, updateOrder, fetchOrders, page, totalPages, setPage } = useOrderStore();
    const [editId, setEditId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const handleEdit = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            useOrderStore.setState({ selectedOrder: order });
            setEditId(orderId);
            setModalOpen(true);
        }
    };

    const handleSubmit = async (id: string) => {
        if (!id) return;
        await updateOrder(id, { status: "CALLED" });
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Orders</h2>

            <div className="overflow-auto rounded-md border">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr className="text-xs font-semibold uppercase text-gray-600">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Model</th>
                            <th className="px-4 py-2">Created</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-2">{order.firstName}</td>
                                <td className="px-4 py-2">+998{order.phoneNumber}</td>
                                <td className="px-4 py-2">{order.modelName}</td>
                                <td className="px-4 py-2">
                                    {new Date(order.createdAt).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    {order?.status === "NOT_CALLED" ? (
                                        <Button size="sm" onClick={() => { handleEdit(order.id); handleSubmit(order?.id) }}>
                                            Accept
                                        </Button>
                                    ) : (
                                        <Button size="sm" onClick={() => handleEdit(order?.id)} disabled>Accepted</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {editId && (
                <OrderEditModal
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditId(null);
                    }}
                    order={orders.find((o) => o.id === editId) || {}}
                />
            )}
        </div>
    );
};

export default OrderList;
