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
import { useSalesContext } from "@/Context/UseSalesContext";
import { BudgetReport } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  pendiente: {
    label: "PENDIENTE",
    color: "hsl(var(--muted-foreground))",
  },
  pago: {
    label: "PAGO",
    color: "hsl(var(--chart-2))",
  },
  enviado: {
    label: "ENVIADO",
    color: "hsl(var(--chart-3))",
  },
  entregado: {
    label: "ENTREGADO",
    color: "hsl(var(--chart-5))",
  },
  cancelado: {
    label: "CANCELADO",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export const BudgetsByMonth = () => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const [Loading, setLoading] = useState(true);
  const [ChartData, setChartData] = useState<Array<BudgetReport>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        fetch(`${BASE_URL}/budget/report`, {
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
      <Card className="row-start-1 row-end-11 col-start-1 col-span-8 flex items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>No hay información disponible</CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="row-start-1 row-end-11 col-start-1 col-span-8">
        <CardHeader>
          <CardTitle>Cantidad de presupuestos por mes</CardTitle>
          <CardDescription>Presupuestos actualizados por tipo.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={ChartData}
              width={800}
              height={400}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
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
                dataKey="pendiente"
                stackId="a"
                fill="hsl(var(--muted-foreground))"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="pago"
                stackId="a"
                fill="hsl(var(--chart-2))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="enviado"
                stackId="a"
                fill="hsl(var(--chart-3))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="entregado"
                stackId="a"
                fill="hsl(var(--chart-5))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="cancelado"
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
