import { CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/hooks/CatalogInterfaces";
import { useNavigate } from "react-router-dom";

interface SubcategoriesProps {
  category: Category;
}

const Subcategories = ({ category }: SubcategoriesProps) => {
  const navigate = useNavigate();

  return (
    <CardContent>
      <CardTitle>Subcategorías</CardTitle>
      <ScrollArea className="md:max-h-20rem max-h-auto">
        <Table>
          <TableCaption>Subcategorías</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12">ID</TableHead>
              <TableHead className="w-1/2">Nombre</TableHead>
              <TableHead className="w-1/10">№ de productos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.subcategories?.map((item, index) => {
              return (
                <TableRow
                  className="cursor-pointer"
                  key={index}
                  onClick={() => navigate(`/catalog/subcategory/${item.id}`)}
                >
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.productsAmount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  );
};
export default Subcategories;
