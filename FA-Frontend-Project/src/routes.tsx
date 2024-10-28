import { Navigate, useRoutes } from "react-router-dom";
import Page from "@/app/dashboard/page";
import { routesConfig } from "@/hooks/routesConfig";

const CustomRouter = () => {
  return useRoutes([
    {
      path: "/",
      element: <Page />,
      children: routesConfig,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
};
export default CustomRouter;
