import { Button } from "@/components/ui/button";
import type { Banner } from "@/stores/banner";

type Props = {
    banner: Banner;
    onEdit: () => void;
    onDelete: () => void;
};

const BannersCard = ({ banner, onEdit, onDelete }: Props) => {
    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const imageUrl = `${UPLOAD_BASE}${banner.image_url}`;

    return (
        <div className="border rounded-2xl p-4 space-y-2 shadow-sm bg-white">
            <img
                src={imageUrl}
                alt="banner"
                className="w-full h-40 object-cover rounded-xl"
            />
            <p className="font-medium">UZ: {banner.title.uz}</p>
            <p className="text-sm text-muted-foreground">RU: {banner.title.ru}</p>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onEdit}>Edit</Button>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
            </div>
        </div>
    );
};

export default BannersCard;