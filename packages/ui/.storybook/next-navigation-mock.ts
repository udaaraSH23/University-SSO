const searchParams = new URLSearchParams("?to=/student");

export const useSearchParams = () => searchParams;
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});
export const usePathname = () => "/";
export const redirect = (url: string) => {
  console.log("Redirect to:", url);
};
export const notFound = () => {
  console.log("Not Found");
};
