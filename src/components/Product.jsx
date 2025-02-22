import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categoriesSlice";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CategoryButton from "./CategoryButton";

const Product = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);

  const [favorites, setFavorites] = useState({});

  const fetchData = useCallback(() => {
    if (selectedBranch?.id) {
      dispatch(fetchProducts(selectedBranch.id));
      dispatch(fetchCategories(selectedBranch.id));
    }
  }, [selectedBranch, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.shop_id === selectedBranch?.id && product.is_active
    );
  }, [products, selectedBranch]);

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

  const formatPrice = (price) =>
    `${Number(price).toLocaleString("ru-RU")} ${t("UZS")}`;

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
                <div
                  className="cursor-pointer mb-2 flex flex-col border rounded-md shadow-lg text-center relative"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                      alt={product[`name_${i18n.language}`]}
                      className="w-full h-[120px] rounded-t-md object-cover"
                    />

                    <span
                      className="absolute top-1 right-1 bg-white px-1 border rounded-full cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      {favorites[product.id] ? (
                        <FavoriteIcon className="!text-red-500 !text-[20px]" />
                      ) : (
                        <FavoriteBorderIcon className="!text-[20px]" />
                      )}
                    </span>
                  </div>

                  <h3 className="text-sm px-2 font-medium capitalize truncate">
                    {product[`name_${i18n.language}`]}
                  </h3>

                  <p className="flex items-center my-2 justify-between font-medium text-xs py-1 mx-2">
                    {product.volume} {product.unit}
                    <span>{formatPrice(product.price)}</span>
                    <FaCartPlus className="text-blue-600 text-base" />
                  </p>
                  <p className="flex hidden items-center my-2 justify-between font-medium text-xs py-1 mx-2">
                    {product.volume} {product.unit}
                    <span>{formatPrice(product.price)}</span>
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <CategoryButton />
        </div>
      ))}
    </div>
  );
};

export default Product;
