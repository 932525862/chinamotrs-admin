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

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const imageUrl = `${UPLOAD_BASE}${partner.logo}`;
    return (
        <Card className="p-4 flex flex-col items-center space-y-4">
            <img
                src={imageUrl}
                alt="Partner Logo"
                className="w-full h-40 object-contain"
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
