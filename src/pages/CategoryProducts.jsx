"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import { useTranslation } from "react-i18next";
import Search from "../components/Search";
import { FaAngleDown, FaCartPlus } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import AOS from "aos";
import "aos/dist/aos.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { Loader } from "lucide-react";

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
  const [cartItems, setCartItems] = useState({});
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    AOS.init();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const fetchCartData = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_CARTS}`);
      const cartData = response.data;

      const cartItemsMap = {};
      if (Array.isArray(cartData)) {
        cartData.forEach((item) => {
          cartItemsMap[item.product_id] = {
            cartId: item.id,
            count: item.count,
            tip: item.tip,
          };
        });
      }
      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const updateCartQuantity = async (productId, newCount) => {
    const cartItem = cartItems[productId];
    if (!cartItem) return;

    try {
      if (newCount < 1) {
        await axios.delete(
          `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartItem.cartId}`
        );
        setCartItems((prev) => {
          const newItems = { ...prev };
          delete newItems[productId];
          return newItems;
        });
      } else {
        await axios.patch(
          `${import.meta.env.VITE_CARTS}?cart_id=${
            cartItem.cartId
          }&count=${newCount}&tip_id=${cartItem.tip.id}`
        );
        setCartItems((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            count: newCount,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      fetchCartData();
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_CARTS}`, {
        product_id: productId,
        count: 1,
      });
      fetchCartData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) return <p>{t("error_loading_products")}</p>;

  const selectedCategory = categories.find(
    (cat) => cat.id === Number.parseInt(categoryId)
  );

  const filteredProducts = products.filter(
    (product) => product.category_id === Number.parseInt(categoryId)
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
          filteredProducts.map((product) => {
            const cartItem = cartItems[product.id];

            return (
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

                <h3 className="text-sm px-2 font-medium capitalize truncate mt-2">
                  {product[`name_${i18n.language}`]}
                </h3>

                <p className="flex items-center justify-between font-medium text-xs py-1 mx-2">
                  <span>
                    {cartItem ? cartItem.tip.volume : product.volume}{" "}
                    {cartItem ? cartItem.tip.unit : product.unit}
                  </span>
                  <span className="font-bold text-blue-600">
                    {formatPrice(cartItem ? cartItem.tip.price : product.price)}
                  </span>
                </p>

                <div
                  className="flex items-center justify-between mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {cartItem ? (
                    <div
                      className="px-2 py-1 rounded-lg flex items-center justify-between w-full bg-white shadow-xl"
                      style={{
                        boxShadow:
                          "4px 4px 8px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <button
                        className="w-7 h-7 rounded-full bg-white text-red-500 hover:text-red-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                        onClick={() =>
                          updateCartQuantity(product.id, cartItem.count - 1)
                        }
                        style={{
                          boxShadow:
                            "inset -2px -2px 6px rgba(255, 255, 255, 0.6), inset 2px 2px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <AiOutlineMinus size={14} />
                      </button>
                      <span className="text-xl font-bold px-4 min-w-[30px] text-gray-800 select-none">
                        {cartItem.count}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full bg-white text-green-500 hover:text-green-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                        onClick={() =>
                          updateCartQuantity(product.id, cartItem.count + 1)
                        }
                        style={{
                          boxShadow:
                            "inset -2px -2px 6px rgba(255, 255, 255, 0.6), inset 2px 2px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <AiOutlinePlus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full py-2 bg-blue-600 text-white rounded-md flex  text-sm items-center justify-center"
                      onClick={() => addToCart(product.id)}
                    >
                      <FaCartPlus className="mr-2" />
                      {t("add_to_cart")}
                    </button>
                  )}
                </div>
              </div>
            );
          })
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
