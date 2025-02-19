import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import { useTranslation } from "react-i18next";
import Search from "../components/Search";
import { FaAngleDown, FaCartPlus } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const CategoryProducts = () => {
  const { t, i18n } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { products, loading, error, status } = useSelector(
    (state) => state.products
  );

  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    AOS.init();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{t("error_loading_products")}</p>;

  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId)
  );

  const filteredProducts = products.filter(
    (product) => product.category_id === parseInt(categoryId)
  );

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [productId]: !prevFavorites[productId],
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === "uz" ? "uz-UZ" : "en-US", {
      style: "currency",
      currency: "UZS",
    }).format(price);
  };

  return (
    <div className="max-w-[450px] mx-auto">
      <Search />
      <div
        className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4"
        data-aos="fade-down"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border-[1px] z-10 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h2 className="text-2xl w-full mx-auto capitalize font-semibold max-w-[300px]">
          {selectedCategory?.[`name_${i18n.language}`] || t("category")}
        </h2>
      </div>

      <div className="grid grid-cols-2 px-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer mb-2 flex flex-col border rounded-md shadow-lg text-center relative"
              data-aos="fade-up"
              data-aos-duration="1000"
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
                    <FavoriteIcon className="!text-red-500 !text-[20px] mb-[2px]" />
                  ) : (
                    <FavoriteBorderIcon className="!text-[20px] mb-[2px]" />
                  )}
                </span>
              </div>

              <h3 className="text-sm px-2 font-medium capitalize truncate">
                {product[`name_${i18n.language}`]}
              </h3>

              <p className="flex items-center justify-between font-medium text-xs py-1 mx-2">
                {product.volume} {product.unit}
                <span>{formatPrice(product.price)}</span>
              </p>

              <p
                className="text-sm font-bold flex justify-center bg-blue-600 rounded shadow-lg p-1 mx-2 mb-2 text-gray-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
              >
                <FaCartPlus className="text-white text-base" />
              </p>
            </div>
          ))
        ) : (
          <div className="flex justify-center col-span-2 items-center w-full h-80 rounded-lg shadow-lg mt-4">
            <p className="text-gray-500 text-center">
              {t("no_products_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
