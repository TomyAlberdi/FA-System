import { Navigate, useRoutes } from "react-router-dom"
import Page from "@/app/dashboard/page"
import Home from "@/Pages/Home/Home"
import User from "@/Pages/User/User"

const CustomRouter = () => {
  return useRoutes([
    {
      path: "/",
      element: <Page />,
      children: [
        {
          index: true,
          element: <Home />
        }
      ]
    },
    {
      path: "/user",
      element: <Page />,
      children: [
        {
          index: true,
          element: <User />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to={"/"} />,
    },
  ])
}
export default CustomRouter