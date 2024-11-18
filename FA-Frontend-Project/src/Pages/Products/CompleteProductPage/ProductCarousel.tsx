import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";

export const ProductCarousel = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <div className="row-start-1 row-end-7 col-start-1 col-end-5 productGridItem flex justify-center items-center">
      <Carousel className="imageCarousel w-full h-full flex justify-center items-center">
        <CarouselContent className="w-full h-full">
          {Product?.images && Product?.images.length > 0 ? (
            Product.images.map((image: string, i: number) => {
              return (
                <CarouselItem key={i} className="w-full h-full">
                  <Card
                    className="w-full h-full bg-contain bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  ></Card>
                </CarouselItem>
              );
            })
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
