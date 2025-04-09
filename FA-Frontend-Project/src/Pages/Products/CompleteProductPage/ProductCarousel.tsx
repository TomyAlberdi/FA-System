import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";

export const ProductCarousel = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <div className="md:w-1/4 md:h-full w-full aspect-video md:aspect-auto flex justify-center items-center">
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
            <Card
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
              }}
            ></Card>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
