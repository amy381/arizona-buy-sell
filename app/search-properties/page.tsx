import IdxWidget from "@/components/IdxWidget";

export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

export default function SearchPropertiesPage() {
  return (
    <>
      {/* Force every element the IDX script injects to fill its container */}
      <style>{`
        #idx-widget-151448,
        #idxwidgetsrc-151448,
        [id^="idxwidget"] {
          width: 100% !important;
          height: 100% !important;
        }
        .idx-widget-container iframe,
        .idx-widget-container > div,
        .idx-widget-container > * {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      <main
        style={{
          position:   "relative",
          marginTop:  60,
          marginLeft: "calc(-50vw + 50%)",
          width:      "100vw",
          height:     "calc(100vh - 60px)",
          overflow:   "hidden",
          padding:    0,
        }}
      >
        <div
          className="idx-widget-container"
          style={{ width: "100%", height: "100%", padding: 0, margin: 0 }}
        >
          <IdxWidget widgetId="151448" />
        </div>
      </main>
    </>
  );
}
