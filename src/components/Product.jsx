import React, { useEffect, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categoriesSlice";

const Product = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);

  // 🔹 API'dan mahsulotlarni olish
  const fetchData = useCallback(() => {
    if (selectedBranch?.id) {
      dispatch(fetchProducts(selectedBranch.id));
      dispatch(fetchCategories(selectedBranch.id));
    }
  }, [selectedBranch, dispatch]);

  // 🔹 Sahifa yuklanganda ma'lumotlarni olish
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Har 10 soniyada ma'lumotlarni yangilash
  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // 🔹 Tanlangan filial mahsulotlarini filter qilish (faqat active mahsulotlar)
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.shop_id === selectedBranch?.id && product.is_active
    );
  }, [products, selectedBranch]);

  // 🔹 Mahsulotlarni kategoriyalar bo'yicha guruhlash
  const groupedByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = categories.find((cat) => cat.id === product.category_id);
      const categoryName = category
        ? category[`name_${i18n.language}`]
        : t("unknown");

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          products: [],
        };
      }

      acc[categoryName].products.push(product);
      return acc;
    }, {});
  }, [filteredProducts, categories, i18n.language, t]);

  // 🔹 Narxlarni formatlash
  const formatPrice = (price) =>
    `${Number.parseInt(price).toLocaleString()} ${t("UZS")}`;

  return (
    <div className="max-w-[450px] mx-auto p-2">
      {Object.values(groupedByCategory).map(({ name, products }) => (
        <div key={name} className="mb-8">
          <h2 className="text-lg font-semibold capitalize mb-2">{name}</h2>

          <Swiper
            slidesPerView={4.2}
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            breakpoints={{
              320: { slidesPerView: 1.9, spaceBetween: 6 },
              350: { slidesPerView: 2.2, spaceBetween: 6 },
              400: { slidesPerView: 2.3, spaceBetween: 6 },
              440: { slidesPerView: 2.5, spaceBetween: 8 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="cursor-pointer mr-3 flex flex-col items-center text-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                    alt={product[`name_${i18n.language}`]}
                    className="w-full h-[120px] rounded-md border object-cover shadow-md"
                  />
                  <p className="text-xs mt-1 font-medium capitalize">
                    {product[`name_${i18n.language}`]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default Product;
