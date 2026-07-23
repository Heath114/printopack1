// Product groups data (bilingual). The 20 groups are the client's real category list
// from api.printopack.com.sa; images are the real category images. Arabic names are
// natural fusha. Descriptions and format lists are category-level placeholders the
// client edits via the admin CMS; individual products inside each group are net-new
// and client-provided (the live catalogue is empty).

export type Bi = { en: string; ar: string };

export const filters: { key: string; label: Bi }[] = [
  { key: "all", label: { en: "All products", ar: "كل المنتجات" } },
  { key: "snacks", label: { en: "Snacks & Nuts", ar: "الوجبات الخفيفة والمكسّرات" } },
  { key: "confectionery", label: { en: "Confectionery", ar: "الحلويات" } },
  { key: "bakery", label: { en: "Bakery & Breads", ar: "المخابز والخبز" } },
  { key: "staples", label: { en: "Pantry Staples", ar: "المؤن الأساسية" } },
  { key: "beverage", label: { en: "Bottles & Liquids", ar: "القوارير والسوائل" } },
  { key: "chilled", label: { en: "Frozen & Chilled", ar: "المجمّدة والمبرّدة" } },
  { key: "specialty", label: { en: "Specialty", ar: "منتجات خاصة" } },
];

export const categories = [
  { slug: "chips-and-snacks", group: "snacks", img: "/images/products/cat-01.jpg", name: { en: "Chips & Snacks", ar: "الشيبس والوجبات الخفيفة" }, desc: { en: "Metallised laminate bags and films that lock in freshness and crunch from the filling line to the shelf.", ar: "أكياس وأفلام مُصفّحة معدنياً تحافظ على النضارة والقرمشة من خط التعبئة حتى الرفّ." } },
  { slug: "chocolates", group: "confectionery", img: "/images/products/cat-02.jpg", name: { en: "Chocolates", ar: "الشوكولاتة" }, desc: { en: "High-barrier wrappers and flow-wrap films with a premium print finish for chocolate and wafer lines.", ar: "أغلفة عالية الحاجز وأفلام تغليف انسيابي بطباعة فاخرة لخطوط الشوكولاتة والويفر." } },
  { slug: "bakery-products", group: "bakery", img: "/images/products/cat-03.jpg", name: { en: "Bakery Products", ar: "منتجات المخابز" }, desc: { en: "Grease-resistant laminates and printed bags for cakes, pastries and biscuits.", ar: "أفلام مُصفّحة مقاومة للدهون وأكياس مطبوعة للكيك والمعجنات والبسكويت." } },
  { slug: "candy", group: "confectionery", img: "/images/products/cat-04.jpg", name: { en: "Candy", ar: "الحلوى" }, desc: { en: "Twist wraps, flow-wrap and pouches that keep confectionery bright, sealed and shelf-ready.", ar: "أغلفة لفّ وتغليف انسيابي وأكياس تُبقي الحلوى زاهية ومحكمة الإغلاق وجاهزة للعرض." } },
  { slug: "breads", group: "bakery", img: "/images/products/cat-05.jpg", name: { en: "Breads", ar: "الخبز" }, desc: { en: "Printed bread bags and resealable packs engineered for shelf life and daily handling.", ar: "أكياس خبز مطبوعة وعبوات قابلة لإعادة الإغلاق مصمّمة للعمر التخزيني والتداول اليومي." } },
  { slug: "bottle-labels", group: "beverage", img: "/images/products/cat-06.jpg", name: { en: "PET & Glass Bottle Labels", ar: "ملصقات قوارير PET والزجاج" }, desc: { en: "Shrink sleeves and wrap-around labels with tight registration for PET and glass bottles.", ar: "أكمام انكماش وملصقات لفّ بدقّة تسجيل عالية لقوارير PET والزجاج." } },
  { slug: "lids", group: "chilled", img: "/images/products/cat-07.jpg", name: { en: "Lids", ar: "الأغطية" }, desc: { en: "Heat-seal lidding films for cups, trays and dairy formats, plain or printed.", ar: "أفلام أغطية بالحرارة للأكواب والأطباق ومنتجات الألبان، سادة أو مطبوعة." } },
  { slug: "ice-cream", group: "chilled", img: "/images/products/cat-08.jpg", name: { en: "Ice Cream", ar: "الآيس كريم" }, desc: { en: "Cold-resistant printed wrappers, sleeves and lidding for frozen desserts.", ar: "أغلفة وأكمام وأغطية مطبوعة مقاومة للبرودة للحلويات المجمّدة." } },
  { slug: "chilled-foods", group: "chilled", img: "/images/products/cat-09.jpg", name: { en: "Chilled Foods", ar: "الأطعمة المبرّدة" }, desc: { en: "Barrier films and lidding that carry chilled and fresh products through the cold chain.", ar: "أفلام حاجزة وأغطية تنقل المنتجات المبرّدة والطازجة عبر سلسلة التبريد." } },
  { slug: "nuts", group: "snacks", img: "/images/products/cat-10.jpg", name: { en: "Nuts", ar: "المكسّرات" }, desc: { en: "High-barrier pouches and laminates that protect flavour, oils and crunch.", ar: "أكياس واقفة وأفلام عالية الحاجز تحمي النكهة والزيوت والقرمشة." } },
  { slug: "rice", group: "staples", img: "/images/products/cat-11.jpg", name: { en: "Rice", ar: "الأرز" }, desc: { en: "Heavy-duty printed bags and pouches for retail and bulk rice formats.", ar: "أكياس مطبوعة متينة للأرز بأحجام التجزئة والجملة." } },
  { slug: "pasta", group: "staples", img: "/images/products/cat-12.jpg", name: { en: "Pasta", ar: "المعكرونة" }, desc: { en: "Clear-window laminates and pillow bags that present pasta while protecting it.", ar: "أفلام بنافذة شفافة وأكياس وسادة تعرض المعكرونة وتحميها." } },
  { slug: "sugar", group: "staples", img: "/images/products/cat-13.jpg", name: { en: "Sugar", ar: "السكر" }, desc: { en: "Moisture-barrier laminates and bags built for fine, free-flowing products.", ar: "أفلام وأكياس حاجزة للرطوبة مصمّمة للمنتجات الناعمة السائبة." } },
  { slug: "spices", group: "staples", img: "/images/products/cat-14.jpg", name: { en: "Spices", ar: "البهارات" }, desc: { en: "Aroma-tight laminates, sachets and pouches that preserve colour and character.", ar: "أفلام وأكياس وأظرف محكمة تحفظ النكهة واللون." } },
  { slug: "custom-bag-sizes", group: "specialty", img: "/images/products/cat-15.jpg", name: { en: "Custom Bag Sizes", ar: "أحجام أكياس مخصّصة" }, desc: { en: "Bags produced to your exact dimensions, gusset and closure, whatever the product.", ar: "أكياس تُنتج بأبعادكم وطيّاتكم وإغلاقكم المحدّد، لأي منتج." } },
  { slug: "coffee-and-tea", group: "staples", img: "/images/products/cat-16.jpg", name: { en: "Coffee & Tea", ar: "القهوة والشاي" }, desc: { en: "High-barrier pouches and foil laminates that guard aroma and freshness.", ar: "أكياس واقفة وأفلام رقائقية عالية الحاجز تحمي النكهة والنضارة." } },
  { slug: "hot-fill-liquids", group: "beverage", img: "/images/products/cat-17.jpg", name: { en: "Hot-Fill Liquids", ar: "السوائل المعبّأة ساخنة" }, desc: { en: "Heat-resistant structures for sauces, juices and liquids filled at temperature.", ar: "تراكيب مقاومة للحرارة للصلصات والعصائر والسوائل المعبّأة ساخنة." } },
  { slug: "jar-and-bottle-sleeves", group: "beverage", img: "/images/products/cat-18.jpg", name: { en: "Jar & Bottle Sleeves", ar: "أكمام القوارير والبرطمانات" }, desc: { en: "Full-body shrink sleeves that turn jars and bottles into shelf presence.", ar: "أكمام انكماش تغطي كامل الجسم تمنح القوارير والبرطمانات حضوراً على الرفّ." } },
  { slug: "pet-food", group: "specialty", img: "/images/products/cat-19.jpg", name: { en: "Pet Food Bags", ar: "أكياس أغذية الحيوانات الأليفة" }, desc: { en: "Tough, high-barrier bags and pouches for dry and wet pet food ranges.", ar: "أكياس واقفة متينة عالية الحاجز لأغذية الحيوانات الجافة والرطبة." } },
  { slug: "tissues-and-wipes", group: "specialty", img: "/images/products/cat-20.jpg", name: { en: "Soft & Wet Tissues", ar: "المناديل الناعمة والمبلّلة" }, desc: { en: "Soft-pack films and resealable wet-wipe packaging with clean, vivid print.", ar: "أفلام عبوات ناعمة وتغليف مناديل مبلّلة قابل لإعادة الإغلاق بطباعة زاهية." } },
];
