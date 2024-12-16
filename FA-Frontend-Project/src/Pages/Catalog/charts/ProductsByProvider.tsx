import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { Category } from "@/hooks/CatalogInterfaces";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductsByProvider = () => {

  const { BASE_URL } = useCatalogContext();
  const [Loading, setLoading] = useState(true);
  const [ChartData, setChartData] = useState<
    Array<{ category: string; products: number; fill: string }>
  >([]);
  const [TotalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/provider/top5`)
      .then((response) => response.json())
      .then(async (categories: Category[]) => {
        // Transform the category data
        const transformedData = categories.map((category, index) => ({
          category: category.name,
          products: category.productsAmount,
          fill: `hsl(var(--chart-${index + 1}))`,
        }));
        setChartData(transformedData);
        const topTotalProducts = categories.reduce(
          (acc, curr) => acc + curr.productsAmount,
          0
        );
        const response = await fetch(`${BASE_URL}/product/count`);
        const totalProducts = await response.json();
        setTotalProducts(totalProducts);
        setChartData((prev) => {
          const hasOtras = prev.some((item) => item.category === "Otros");
          if (totalProducts > topTotalProducts && !hasOtras) {
            const difference = totalProducts - topTotalProducts;
            return [
              ...prev,
              {
                category: "Otros",
                products: difference,
                fill: `hsl(var(--ring))`,
              },
            ];
          }
          return prev;
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartConfig = useMemo(() => {
    return ChartData.reduce((config: ChartConfig, item, index) => {
      config[item.category] = {
        label: item.category,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return config;
    }, {} as ChartConfig);
  }, [ChartData]);

  if (Loading) {
    return <Skeleton className="col-start-5 row-span-5 col-span-4" />;
  } else if (ChartData.length === 0) {
    return (
      <Card className="col-start-5 row-span-5 col-span-4 border border-input flex flex-col items-center justify-center text-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>No hay proveedores disponibles</CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="col-start-5 flex flex-col row-span-5 col-span-4 border border-input">
        <CardHeader className="items-center pb-0 text-center">
          <CardTitle>Proveedores más populares</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={ChartData}
                dataKey="products"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {TotalProducts}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Productos
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
};