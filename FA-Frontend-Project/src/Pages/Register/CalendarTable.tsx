import {
  TableBody,
  TableCell,
  TableFullHeight,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CalendarTable = ({ year, month }: { year: number; month: number }) => {
  const navigate = useNavigate();

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
          className="text-center hover:bg-muted/50 hover:cursor-pointer text-xl"
          key={day}
          onClick={() => navigate(`/sales/register/${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  return (
    <TableFullHeight className="border h-full">
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
    </TableFullHeight>
  );
};
export default CalendarTable;
