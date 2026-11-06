export type AccessPolicy =
  | Readonly<{ kind: "public" | "authenticated" | "superadmin" }>
  | Readonly<{ kind: "permissions"; permissions: readonly string[] }>;

export const ACCESS_POLICIES = "template:access-policies";

function declare(policy: AccessPolicy): MethodDecorator {
  return (_target, _key, descriptor) => {
    const handler = descriptor.value;
    if (typeof handler !== "function") throw new Error("Invalid policy target");
    const current: AccessPolicy[] = Reflect.getOwnMetadata(ACCESS_POLICIES, handler) ?? [];
    Reflect.defineMetadata(ACCESS_POLICIES, [...current, policy], handler);
  };
}

export const Public = (): MethodDecorator => declare({ kind: "public" });
export const Authenticated = (): MethodDecorator => declare({ kind: "authenticated" });
export const SuperadminOnly = (): MethodDecorator => declare({ kind: "superadmin" });
export const RequirePermissions = (...permissions: string[]): MethodDecorator =>
  declare({ kind: "permissions", permissions });
