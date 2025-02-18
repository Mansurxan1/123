import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import { useTranslation } from "react-i18next";
import Search from "../components/Search";
import { FaAngleDown } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const CategoryProducts = () => {
  const { t, i18n } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { products, loading, error, status } = useSelector(
    (state) => state.products
  );

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

  // Tanlangan kategoriyani topish
  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId)
  );

  // Mahsulotlarni filter qilish
  const filteredProducts = products.filter(
    (product) => product.category_id === parseInt(categoryId)
  );

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
        <h2 className="text-2xl w-full mx-auto font-semibold max-w-[300px]">
          {selectedCategory?.[`name_${i18n.language}`] || t("category")}
        </h2>
      </div>

      <div className="grid grid-cols-2 px-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer mb-40 flex flex-col items-center text-center bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="relative w-full h-[150px] overflow-hidden rounded-t-xl">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                  alt={product.name_uz}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center mt-2 font-medium capitalize text-gray-800 transition-colors duration-300 group-hover:text-blue-500">
                {product.name_uz}
              </h3>
              <p>{product.price}</p>
            </div>
          ))
        ) : (
          <div className="flex justify-center col-span-2 items-center w-full h-80 rounded-lg shadow-lg mt-4">
            <p className="text-gray-500 text-center ">
              {t("no_products_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
