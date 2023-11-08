import QueryProvider from "@/app/_components/query-provider";

const Layout = ({ children }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Layout;
