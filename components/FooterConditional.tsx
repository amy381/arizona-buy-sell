"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const NO_FOOTER = new Set(["/search-properties"]);

export default function FooterConditional() {
  const pathname = usePathname();
  if (NO_FOOTER.has(pathname)) return null;
  return <Footer />;
}
