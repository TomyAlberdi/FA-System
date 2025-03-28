import { useParams } from "react-router-dom";

const DailyCashRegister = () => {

  const { date } = useParams();

  return (
    <div>{date || "not"}</div>
  )
}
export default DailyCashRegister