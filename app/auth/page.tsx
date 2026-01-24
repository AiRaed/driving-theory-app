import dynamicImport from "next/dynamic";

const AuthClient = dynamicImport(() => import("./AuthClient"), { ssr: false });

export default function Page() {
  return <AuthClient />;
}
