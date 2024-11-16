import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";

export const ProductCarousel = ({ Product }: { Product: CompleteProduct | null }) => {
  return (
    <Carousel className="imageCarousel row-start-1 row-end-7 col-start-1 col-end-5 productGridItem">
      <CarouselContent>
        {Product?.images && Product?.images.length > 0 ? (
          Product.images.map((image: string, i: number) => {
            return (
              <Card key={i} className="p-2">
                <CardContent className="flex aspect-square items-center justify-center">
                  <img src={image} alt={`Imagen ${i} del producto.`} />
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
