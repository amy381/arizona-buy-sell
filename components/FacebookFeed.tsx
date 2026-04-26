"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element | null) => void } };
  }
}

export default function FacebookFeed() {
  useEffect(() => {
    // If SDK already loaded (e.g. navigating back to page), just re-parse
    if (window.FB) {
      window.FB.XFBML.parse();
      return;
    }
    const script = document.createElement("script");
    script.src         = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
    script.async       = true;
    script.defer       = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

  // Spread data-* props via object to satisfy TypeScript's JSX strict checks
  const fbPageProps = {
    "data-href":                   "https://www.facebook.com/amy.casanova.355732",
    "data-tabs":                   "videos",
    "data-width":                  "500",
    "data-height":                 "600",
    "data-small-header":           "true",
    "data-adapt-container-width":  "true",
    "data-hide-cover":             "false",
    "data-show-facepile":          "false",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background:   "#2E3338",
          borderRadius: 14,
          padding:      16,
          width:        "100%",
          maxWidth:     500,
          minHeight:    632, // prevents layout collapse if plugin blocked
        }}
      >
        <div className="fb-page" {...fbPageProps} />
      </div>
    </div>
  );
}
