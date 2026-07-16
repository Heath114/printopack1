// Product catalogue data. The 20 categories are the client's real list from
// api.printopack.com.sa (categories endpoint); images live in /images/products/
// (fetched from the same API). Display names are lightly cleaned up from the DB
// ("Sugar = السكر" -> "Sugar", "Bags)Pet Foods)" -> "Pet Food Bags"). Descriptions
// and format lists are category-level placeholders the client edits via the admin
// CMS; per-product content is net-new and client-gated.

export const groups = [
  { key: "all", label: "All products" },
  { key: "snacks", label: "Snacks & Nuts" },
  { key: "confectionery", label: "Confectionery" },
  { key: "bakery", label: "Bakery & Breads" },
  { key: "staples", label: "Pantry Staples" },
  { key: "beverage", label: "Bottles & Liquids" },
  { key: "chilled", label: "Frozen & Chilled" },
  { key: "specialty", label: "Specialty" },
];

export const categories = [
  {
    slug: "chips-and-snacks", name: "Chips & Snacks", group: "snacks", img: "/images/products/cat-01.jpg",
    desc: "Metallised laminate bags and films that lock in freshness and crunch from the filling line to the shelf.",
    formats: ["Pillow bags", "Metallised laminates", "Printed roll stock"],
  },
  {
    slug: "chocolates", name: "Chocolates", group: "confectionery", img: "/images/products/cat-02.jpg",
    desc: "High-barrier wrappers and flow-wrap films with a premium print finish for chocolate and wafer lines.",
    formats: ["Flow-wrap film", "Foil laminates", "Printed wrappers"],
  },
  {
    slug: "bakery-products", name: "Bakery Products", group: "bakery", img: "/images/products/cat-03.jpg",
    desc: "Grease-resistant laminates and printed bags for cakes, pastries and biscuits.",
    formats: ["Printed roll stock", "Laminated bags", "Window packs"],
  },
  {
    slug: "candy", name: "Candy", group: "confectionery", img: "/images/products/cat-04.jpg",
    desc: "Twist wraps, flow-wrap and pouches that keep confectionery bright, sealed and shelf-ready.",
    formats: ["Twist wrap", "Flow-wrap film", "Stand-up pouches"],
  },
  {
    slug: "breads", name: "Breads", group: "bakery", img: "/images/products/cat-05.jpg",
    desc: "Printed bread bags and resealable packs engineered for shelf life and daily handling.",
    formats: ["Printed bread bags", "Resealable packs", "Perforated films"],
  },
  {
    slug: "bottle-labels", name: "PET & Glass Bottle Labels", group: "beverage", img: "/images/products/cat-06.jpg",
    desc: "Shrink sleeves and wrap-around labels with tight registration for PET and glass bottles.",
    formats: ["Shrink sleeves", "Wrap-around labels", "Printed film"],
  },
  {
    slug: "lids", name: "Lids", group: "chilled", img: "/images/products/cat-07.jpg",
    desc: "Heat-seal lidding films for cups, trays and dairy formats, plain or printed.",
    formats: ["Die-cut lids", "Lidding roll stock", "Foil lids"],
  },
  {
    slug: "ice-cream", name: "Ice Cream", group: "chilled", img: "/images/products/cat-08.jpg",
    desc: "Cold-resistant printed wrappers, sleeves and lidding for frozen desserts.",
    formats: ["Printed wrappers", "Cone sleeves", "Lidding film"],
  },
  {
    slug: "chilled-foods", name: "Chilled Foods", group: "chilled", img: "/images/products/cat-09.jpg",
    desc: "Barrier films and lidding that carry chilled and fresh products through the cold chain.",
    formats: ["Barrier films", "Lidding film", "Laminated pouches"],
  },
  {
    slug: "nuts", name: "Nuts", group: "snacks", img: "/images/products/cat-10.jpg",
    desc: "High-barrier pouches and laminates that protect flavour, oils and crunch.",
    formats: ["Stand-up pouches", "Metallised laminates", "Pillow bags"],
  },
  {
    slug: "rice", name: "Rice", group: "staples", img: "/images/products/cat-11.jpg",
    desc: "Heavy-duty printed bags and pouches for retail and bulk rice formats.",
    formats: ["Side-gusset bags", "Handle bags", "Heavy-duty laminates"],
  },
  {
    slug: "pasta", name: "Pasta", group: "staples", img: "/images/products/cat-12.jpg",
    desc: "Clear-window laminates and pillow bags that present pasta while protecting it.",
    formats: ["Pillow bags", "Window laminates", "Printed roll stock"],
  },
  {
    slug: "sugar", name: "Sugar", group: "staples", img: "/images/products/cat-13.jpg",
    desc: "Moisture-barrier laminates and bags built for fine, free-flowing products.",
    formats: ["Pillow bags", "Side-gusset bags", "Barrier laminates"],
  },
  {
    slug: "spices", name: "Spices", group: "staples", img: "/images/products/cat-14.jpg",
    desc: "Aroma-tight laminates, sachets and pouches that preserve colour and character.",
    formats: ["Sachets", "Stand-up pouches", "Foil laminates"],
  },
  {
    slug: "custom-bag-sizes", name: "Custom Bag Sizes", group: "specialty", img: "/images/products/cat-15.jpg",
    desc: "Bags produced to your exact dimensions, gusset and closure, whatever the product.",
    formats: ["Made-to-measure bags", "Gusset options", "Custom closures"],
  },
  {
    slug: "coffee-and-tea", name: "Coffee & Tea", group: "staples", img: "/images/products/cat-16.jpg",
    desc: "High-barrier pouches and foil laminates that guard aroma and freshness.",
    formats: ["Stand-up pouches", "Side-gusset bags", "Foil laminates"],
  },
  {
    slug: "hot-fill-liquids", name: "Hot-Fill Liquids", group: "beverage", img: "/images/products/cat-17.jpg",
    desc: "Heat-resistant structures for sauces, juices and liquids filled at temperature.",
    formats: ["Hot-fill pouches", "Laminated roll stock", "Sachets"],
  },
  {
    slug: "jar-and-bottle-sleeves", name: "Jar & Bottle Sleeves", group: "beverage", img: "/images/products/cat-18.jpg",
    desc: "Full-body shrink sleeves that turn jars and bottles into shelf presence.",
    formats: ["Shrink sleeves", "Tamper bands", "Printed sleeves"],
  },
  {
    slug: "pet-food", name: "Pet Food Bags", group: "specialty", img: "/images/products/cat-19.jpg",
    desc: "Tough, high-barrier bags and pouches for dry and wet pet food ranges.",
    formats: ["Side-gusset bags", "Stand-up pouches", "Heavy-duty laminates"],
  },
  {
    slug: "tissues-and-wipes", name: "Soft & Wet Tissues", group: "specialty", img: "/images/products/cat-20.jpg",
    desc: "Soft-pack films and resealable wet-wipe packaging with clean, vivid print.",
    formats: ["Soft-pack films", "Resealable packs", "Printed laminates"],
  },
];

export const groupLabel = (key: string) =>
  groups.find((g) => g.key === key)?.label ?? "Products";
