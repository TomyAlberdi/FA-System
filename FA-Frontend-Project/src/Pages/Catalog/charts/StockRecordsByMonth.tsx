import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { StockReport } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  out: {
    label: "Salidas",
    color: "hsl(var(--destructive))",
  },
  in: {
    label: "Ingresos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const StockRecordsByMonth = () => {
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const [Loading, setLoading] = useState(true);
  const [ChartData, setChartData] = useState<Array<StockReport>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        fetch(`${BASE_URL}/stock/reportStock`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setChartData(data.reverse()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Loading) {
    return (
      <Skeleton className="row-start-1 row-end-11 col-start-1 col-span-8" />
    );
  } else if (ChartData.length === 0) {
    return (
      <Card className="row-start-1 row-end-11 col-start-1 col-span-8flex items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>No hay información disponible</CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="row-start-1 row-end-11 col-start-1 col-span-8">
        <CardHeader>
          <CardTitle>Movimientos de stock por mes</CardTitle>
          <CardDescription>
            Ingresos y salidas de todos los productos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={ChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="in"
                stackId="a"
                fill="hsl(var(--chart-2))"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="out"
                stackId="a"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
};
