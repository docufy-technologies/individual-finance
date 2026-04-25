/**
 * Type declaration for next-auth v5 beta
 *
 * Forces TypeScript to recognize the default export as callable.
 * This resolves issues with the beta package's type declarations.
 */

declare module "next-auth" {
  const NextAuth: (
    config: Parameters<typeof import("next-auth")["default"]>[0],
  ) => ReturnType<typeof import("next-auth")["default"]>;
  export default NextAuth;
}
