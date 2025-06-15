import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge, Calendar, Edit, Eye, Trash2 } from "lucide-react"
import { getStatusColor } from "../libs/getcolor";

interface INewsProps {
    id: number;
    article: {
        id: number;
        title: string;
        category: string;
        author: string;
        date: string;
        status: string;
        views: number;
    }
}

const NewsComponent = ({ article }: INewsProps) => {
    return (
        <TableRow key={article.id} className="hover:bg-gray-50">
            <TableCell>
                <div>
                    <div className="font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.category}</div>
                </div>
            </TableCell>
            <TableCell className="text-gray-600">{article.author}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                </div>
            </TableCell>
            <TableCell>
                <Badge className={getStatusColor(article.status)}>
                    {article.status}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="h-4 w-4" />
                    {article.views.toLocaleString()}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default NewsComponent