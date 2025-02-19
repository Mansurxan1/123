import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Search from "../components/Search";
import { FaAngleDown, FaCartPlus } from "react-icons/fa6";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import Product from "../components/Product";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showQuantity, setShowQuantity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/shop-products/detail?product_id=${id}`
      )
      .then((response) => {
        setProduct(response.data.product);
        setLoading(false);
      })
      .catch(() => {
        setError(t("notFound"));
        setLoading(false);
      });
  }, [id, t]);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold mt-10">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold mt-10">{error}</div>
    );
  }

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(product.id)
        ? prev.filter((favId) => favId !== product.id)
        : [...prev, product.id]
    );
  };

  const updateCart = (newQuantity) => {
    if (newQuantity < 1) {
      setShowQuantity(false);
      setSelectedSize(null); // ✅ Radio tozalash
      setQuantity(0);
      return;
    }
    setQuantity(newQuantity);
  };

  const totalPrice = (selectedSize?.price || 0) * quantity;
  const currentLang = i18n.language;

  return (
    <div className="bg-white">
      <Search />
      <div className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border-[1px] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h1 className="text-2xl w-full font-semibold capitalize">
          {product[`name_${currentLang}`]}
        </h1>
      </div>

      <div className="sticky top-0">
        <img
          src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
          alt={product[`name_${currentLang}`]}
          className="w-full h-96 object-cover"
        />
        <button
          className="absolute top-2 right-2 bg-white px-2 py-1 border rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {favorites.includes(product.id) ? (
            <FavoriteIcon className="!text-red-500 text-[25px]" />
          ) : (
            <FavoriteBorderIcon className="text-[25px]" />
          )}
        </button>
      </div>

      <div className="px-4 pt-2 rounded-[30px] z-2 relative -top-5 bg-white relative">
        <div className="">
          <h2 className="text-xl text-center font-bold">{t("description")}</h2>
          <p className="flex items-center gap-5 font-bold font-medium text-base py-1">
            {product.volume} {product.unit}
            <span className="text-lg font-medium">
              {Number(40000).toLocaleString("ru-RU")} {t("UZS")}
            </span>
          </p>
        </div>
        <p className="text-gray-700">{product[`description_${currentLang}`]}</p>
        <h3 className="text-xl text-center font-bold mt-3">
          {t("productSize")}:
        </h3>
        <div className="mt-2 space-y-2">
          {product.tips.map((size) => (
            <label
              key={size.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition hover:bg-blue-200 hover:border-blue-500 ${
                selectedSize?.id === size.id ? "bg-blue-100" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="size"
                  className="w-5 h-5 accent-blue-600"
                  checked={selectedSize?.id === size.id}
                  onChange={() => {
                    setSelectedSize(size);
                    if (!showQuantity) {
                      setShowQuantity(false);
                      setQuantity(0);
                    }
                  }}
                />
                <span className="text-lg font-medium">
                  {size.volume} {size.unit}
                </span>
              </div>
              <span className="text-lg font-medium">
                {size.price.toLocaleString("ru-RU")} {t("UZS")}
              </span>
            </label>
          ))}
        </div>

        {selectedSize && !showQuantity && (
          <button
            onClick={() => {
              setShowQuantity(true);
              setQuantity(1);
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-md"
          >
            <FaCartPlus className="h-5 w-5" /> {t("add_to_cart")}
          </button>
        )}

        {showQuantity && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateCart(quantity - 1)}
                className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500"
              >
                <AiOutlineMinus size={16} />
              </button>
              <span className="text-lg font-medium w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateCart(quantity + 1)}
                className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500"
              >
                <AiOutlinePlus size={16} />
              </button>
            </div>
            <p className="text-lg font-semibold">
              {t("price")}: {totalPrice.toLocaleString()} so‘m
            </p>
          </div>
        )}

        {showQuantity && (
          <div className="flex gap-4">
            <Link
              to={"/cart"}
              className="w-full mt-4 text-center bg-blue-600 text-white p-3 rounded-md"
            >
              {t("addToCart")}
            </Link>
            <Link
              to={"/purchase"}
              className="w-full mt-4 text-center bg-blue-600 text-white p-3 rounded-md"
            >
              {t("purchase")}
            </Link>
          </div>
        )}
      </div>
      <h2 className="text-center font-bold text-xl">{t("allProducts")}</h2>
      <Product />
    </div>
  );
}

export default ProductDetails;
