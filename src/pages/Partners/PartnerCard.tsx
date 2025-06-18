import type { Partner } from "@/stores/partner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    partner: Partner;
    onEdit: (partner: Partner) => void;
    onDelete: (partner: Partner) => void;
};

const PartnerCard = ({ partner, onEdit, onDelete }: Props) => {
    return (
        <Card className="p-4 flex flex-col items-center space-y-4">
            <img
                src={partner.logo}
                alt="Partner Logo"
                className="w-24 h-24 object-contain"
            />
            <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => onEdit(partner)}>
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => onDelete(partner)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};

export default PartnerCard;
