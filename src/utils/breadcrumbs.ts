// src/utils/breadcrumbs.ts
interface RouteNames {
  [key: string]: string;
}

export const generateBreadcrumbs = (
  pathname: string,
  routeNames: RouteNames,
) => {
  const pathnames = pathname.split("/").filter((x) => x);
  const breadcrumbs = pathnames.map((_, index) => {
    const url = `/${pathnames.slice(0, index + 1).join("/")}`;
    return {
      key: url,
      name: routeNames[url] ? routeNames[url] : pathnames[index],
    };
  });

  return breadcrumbs;
};
