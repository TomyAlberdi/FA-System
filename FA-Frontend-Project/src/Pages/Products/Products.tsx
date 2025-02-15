import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  CardProduct,
  FilterData,
  PaginationInfo,
} from "@/hooks/CatalogInterfaces";
import { ProductFilters } from "@/Pages/Products/ProductFilters";
import { ProductPagination } from "@/Pages/Products/ProductPagination";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";

export const Products = () => {
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const [CurrentPage, setCurrentPage] = useState(0);
  const [PaginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    first: false,
    last: false,
  });
  const [Products, setProducts] = useState<Array<CardProduct>>([]);
  const [Loading, setLoading] = useState(true);
  const [Filter, setFilter] = useState<Array<FilterData | null>>([]);

  const getFilteredURL = () => {
    let filterURL = `${BASE_URL}/product/search?`;
    Filter.forEach((filter) => {
      filterURL = `${filterURL}&${filter?.type}=${filter?.value}`;
    });
    return filterURL;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let filterURL = getFilteredURL();
      filterURL += `&page=${CurrentPage}&size=15`;
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        const response = await fetch(filterURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          console.error("Error fetching products: ", response.status);
          return;
        }
        const result = await response.json();
        setProducts(result.content);
        setPaginationInfo({
          pageNumber: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          first: result.first,
          last: result.last,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentPage, BASE_URL, Filter]);

  return (
    <div className="Products grid grid-cols-8 gap-4">
      <ProductFilters Filter={Filter} setFilter={setFilter} Loading={Loading} />
      <ProductPagination
        Products={Products}
        CurrentPage={CurrentPage}
        setCurrentPage={setCurrentPage}
        PaginationInfo={PaginationInfo}
        Loading={Loading}
        Filter={Filter}
        setFilter={setFilter}
      />
    </div>
  );
};
