import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const CalendarTable = ({ year, month }: { year: number; month: number }) => {
  const [days, setDays] = useState<JSX.Element[]>([]);

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const adjustedDaysOfWeek = [...daysOfWeek.slice(1), daysOfWeek[0]];

  useEffect(() => {
    const newDaysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const tempDays = [];
    let row = [];

    for (let i = 0; i < adjustedIndex; i++) {
      row.push(<TableCell key={`empty-${i}`}></TableCell>);
    }

    for (let day = 1; day <= newDaysInMonth; day++) {
      row.push(
        <TableCell
              className="text-center hover:bg-muted/50 hover:cursor-pointer"
          key={day}
        >
          {day}
        </TableCell>
      );
      if ((day + adjustedIndex) % 7 === 0 || day === newDaysInMonth) {
        tempDays.push(
          <TableRow className="hover:bg-null" key={`row-${day}`}>
            {row}
          </TableRow>
        );
        row = [];
      }
    }

    setDays(tempDays);
  }, [year, month]);

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          {adjustedDaysOfWeek.map((day) => (
            <TableHead key={day} className="text-center w-[14.28%]">
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{days}</TableBody>
    </Table>
  );
};
export default CalendarTable;
