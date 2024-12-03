import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routesConfig } from "@/hooks/routesConfig";
import { Link, matchPath, useLocation, useParams } from "react-router-dom";

export const BreadcrumbsHeader = () => {

  const location = useLocation();
  const params = useParams();

  // Helper to match the current route and build breadcrumbs segments
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    let accumulatedPath = "";
    const breadcrumbs: { label: string; to: string}[] = [];

    pathSegments.forEach((segment) => {
      accumulatedPath += `/${segment}`;
      const matchedRoute = routesConfig.find((route) =>
        matchPath(route.path ?? "", accumulatedPath)
      );
      if (matchedRoute) {
        // Dynamic segment handling
        let label = matchedRoute.handle || segment;
        if (matchedRoute.path?.includes(":id")) {
          const paramId = params.id || params[segment];
          label += ` ${paramId}`;
        }

        breadcrumbs.push({
          label,
          to: accumulatedPath,
        })
      }
    })

    return breadcrumbs;
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.to}>
            <BreadcrumbLink asChild>
              <Link to={crumb.to}>
                {crumb.label}
              </Link>
            </BreadcrumbLink>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator /> }
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}