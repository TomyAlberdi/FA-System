import { Navigate, useRoutes } from "react-router-dom"
import Layout from "@/Layouts/Layout"
import Home from "@/Pages/Home/Home"

const CustomRouter = () => {
  return useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
      ]
    },
    {
      path: "*",
      element: <Navigate to={"/"} />,
    },
  ])
}
export default CustomRouter