import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Edit, FolderOpen, Package, Trash2 } from "lucide-react"
import { getStatusColor } from "../libs/getcolor"

interface ICategory {
    id: number
    name: string
    description: string
    parent: string | null
    productCount: number
    status: string
}

const CategoryComponent = ({ category }: { category: ICategory }) => {
    return (
        <TableRow key={category.id} className="hover:bg-gray-50">
            <TableCell>
                <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{category.name}</span>
                </div>
            </TableCell>
            <TableCell className="text-gray-600">
                {category.description}
            </TableCell>
            <TableCell>
                {category.parent ? (
                    <Badge variant="outline">{category.parent}</Badge>
                ) : (
                    <span className="text-gray-400">Root</span>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{category.productCount}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge className={getStatusColor(category.status)}>
                    {category.status}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
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

export default CategoryComponent