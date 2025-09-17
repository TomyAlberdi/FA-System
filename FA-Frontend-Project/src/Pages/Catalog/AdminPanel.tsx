import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddCategory } from "@/Pages/Categories/AddCategory";
import { AddProvider } from "@/Pages/Providers/AddProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

export const AdminPanel = () => {
  const [ProviderOpen, setProviderOpen] = useState(false);
  const [CategoryOpen, setCategoryOpen] = useState(false);

  return (
    <Card className="col-start-1 col-span-8 row-start-11 row-end-16 hidden md:block">
      <CardHeader>
        <CardTitle>Atajos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row space-x-1 h-2/3">
        <Button asChild className="h-full text-lg w-1/3">
          <Link to={`/catalog/products/create`}>
            Añadir Producto
          </Link>
        </Button>
        <Dialog open={ProviderOpen} onOpenChange={setProviderOpen}>
          <DialogTrigger asChild>
            <Button className="h-full text-lg w-1/3">Añadir Proveedor</Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] w-full p-6"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Añadir Proveedor
              </DialogTitle>
            </DialogHeader>
            <AddProvider setOpen={setProviderOpen} />
          </DialogContent>
        </Dialog>
        <Dialog open={CategoryOpen} onOpenChange={setCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="h-full text-lg w-1/3">Añadir Categoría</Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] w-full p-6"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Añadir Categoría
              </DialogTitle>
            </DialogHeader>
            <AddCategory setOpen={setCategoryOpen} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
