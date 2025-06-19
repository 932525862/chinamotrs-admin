import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type Order } from "@/stores/order";

type Props = {
    open: boolean;
    onClose: () => void;
    order: Partial<Order>;
};

const OrderEditModal = ({ open, onClose, order }: Props) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Accept Order</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        value={order?.firstName}
                        placeholder="First Name"
                        disabled
                    />
                    <Input
                        value={order?.phoneNumber}
                        placeholder="Phone Number"
                        disabled
                    />
                    <Input
                        value={order?.modelName}
                        placeholder="Model Name"
                        disabled
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderEditModal;
