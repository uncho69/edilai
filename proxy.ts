import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/** Route impresa che richiedono login Clerk */
const isProtectedImpresa = createRouteMatcher([
  "/impresa/dashboard(.*)",
  "/impresa/in-revisione",
  "/impresa/registrati/completa-profilo",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedImpresa(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
