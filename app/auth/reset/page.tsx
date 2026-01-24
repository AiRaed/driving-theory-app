import dynamicImport from "next/dynamic";

const ResetClient = dynamicImport(() => import("./ResetClient"), { ssr: false });

export default function Page() {
  return <ResetClient />;
}
