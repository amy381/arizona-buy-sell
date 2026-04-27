export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

export default function SearchPropertiesPage() {
  return (
    <main style={{
      position: "fixed",
      top:      60,
      left:     0,
      right:    0,
      bottom:   0,
      overflow: "hidden",
      padding:  0,
      margin:   0,
    }}>
      <iframe
        src="https://arizonabuyandsell.idxbroker.com/idx/widgetpreview.php?widgetid=151448&prime=true"
        title="Search Properties — IDX Map"
        style={{
          display: "block",
          width:   "100%",
          height:  "100%",
          border:  "none",
        }}
      />
    </main>
  );
}
