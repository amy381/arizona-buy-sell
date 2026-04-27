import IdxWidget from "@/components/IdxWidget";

export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

export default function SearchPropertiesPage() {
  return (
    <>
      <style>{`
        /*
         * IDX Broker injects elements with hardcoded px heights via JS.
         * Using vh directly here bypasses the % inheritance chain and
         * overrides any inline style the script sets.
         */
        #idx-widget-151448 {
          display: block !important;
          width:   100% !important;
          height:  calc(100vh - 60px) !important;
          min-height: calc(100vh - 60px) !important;
          max-height: none !important;
        }
        #idx-widget-151448 > * {
          width:   100% !important;
          height:  calc(100vh - 60px) !important;
          min-height: calc(100vh - 60px) !important;
          max-height: none !important;
        }
        /* Override any inline style="height:___" the IDX script sets */
        #idx-widget-151448 [style*="height"],
        #idx-widget-151448 iframe {
          height:  calc(100vh - 60px) !important;
          min-height: calc(100vh - 60px) !important;
          max-height: none !important;
        }
      `}</style>

      <main style={{
        position: "fixed",
        top:      60,
        left:     0,
        right:    0,
        bottom:   0,
        overflow: "auto",
        padding:  0,
        margin:   0,
      }}>
        <IdxWidget widgetId="151448" />
      </main>
    </>
  );
}
