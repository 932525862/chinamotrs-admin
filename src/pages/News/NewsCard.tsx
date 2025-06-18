import { Button } from "@/components/ui/button";
import type { NewsItem } from "@/stores/news";

type Props = {
    news: NewsItem;
    onEdit: () => void;
    onDelete: () => void;
};

const NewsCard = ({ news, onEdit, onDelete }: Props) => {
    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const imageUrl = `${UPLOAD_BASE}${news.image_url}`;

    return (
        <div className="border rounded-2xl p-4 space-y-2 shadow-sm bg-white">
            <img
                src={imageUrl}
                alt="news"
                className="w-full h-40 object-cover rounded-xl"
            />
            <p className="font-medium">UZ: {news.text.uz}</p>
            <p className="text-sm text-muted-foreground">RU: {news.text.ru}</p>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onEdit}>Edit</Button>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
            </div>
        </div>
    );
};

export default NewsCard;
