import { Suspense } from "react";
import Script from "next/script";
import FubApp from "./FubApp";

export const metadata = {
  title: "Listing Alerts",
  robots: { index: false, follow: false },
};

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13,
        color: "#9CA3AF",
        background: "#fff",
      }}
    >
      Loading…
    </div>
  );
}

export default function FubListingAlertsPage() {
  return (
    <>
      {/* FUB Embedded Apps SDK — handles height communication with parent frame */}
      <Script
        src="https://eia.followupboss.com/embeddedApps-v1.0.0.js"
        strategy="afterInteractive"
      />
      <Suspense fallback={<Loading />}>
        <FubApp />
      </Suspense>
    </>
  );
}
