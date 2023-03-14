import { RootRoute, Route, Router } from "@tanstack/router";
import { Outlet, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import CreateSchema from "./routes/createSchema";
import Home from "./routes/index";
import NewComp from "./routes/newComp";
import "./styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import CompList from "./routes/openComp";

const queryClient = new QueryClient()

// basically a layout (kinda)
function Root() {

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
    </QueryClientProvider >
  );
}

const rootRoute = new RootRoute({
  component: Root,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const createSchemaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/createSchema",
  component: CreateSchema,
});

const newCompRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/newComp",
  component: NewComp,
});
const openCompRoute = new Route({
  getParentRoute: () => rootRoute, 
  path: "/changeComp", 
  component: CompList
})

const routeTree = rootRoute.addChildren([indexRoute, createSchemaRoute, newCompRoute, openCompRoute]);
const router = new Router({ routeTree });
// Register your router for maximum type safety
declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
