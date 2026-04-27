import IdxWidget from "@/components/IdxWidget";

export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

// Header is 68px on all non-home pages (scrolled state, 14px padding + 40px logo).
const HEADER_HEIGHT = 68;

export default function SearchPropertiesPage() {
  return (
    <main style={{
      position: "fixed",
      top:      HEADER_HEIGHT,
      left:     0,
      right:    0,
      bottom:   0,
      overflow: "hidden",
      margin:   0,
      padding:  0,
    }}>
      <IdxWidget widgetId="151448" />
    </main>
  );
}
