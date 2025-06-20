import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type Order } from "@/stores/order";

type Props = {
    open: boolean;
    onClose: () => void;
    order: Partial<Order>;
};

const OrderEditModal = ({ open, onClose, order }: Props) => {
    const handleAccept = async () => {
        try {
            // Placeholder: Replace with API call or state update
            // await updateOrderStatus(order.id, "accepted");
            toast.success("Order accepted successfully");
            onClose();
        } catch (err: any) {
            toast.error("Failed to accept order: " + (err.message || err));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Accept Order</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <Input value={order?.firstName || ""} placeholder="First Name" disabled />
                    <Input value={order?.phoneNumber || ""} placeholder="Phone Number" disabled />
                    <Input value={order?.modelName || ""} placeholder="Model Name" disabled />
                </div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAccept}>Accept Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OrderEditModal;
