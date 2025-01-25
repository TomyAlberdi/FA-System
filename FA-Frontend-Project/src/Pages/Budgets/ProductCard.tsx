import { CardProduct } from "@/hooks/CatalogInterfaces";

export const ProductCard = ({ product }: { product: CardProduct }) => {
  return (
    <article className="w-[19.2%] h-[350px] border border-red-500">
      {product.name}
    </article>
  );
};
