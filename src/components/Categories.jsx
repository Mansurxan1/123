import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categoriesSlice";

const Categories = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { error, status } = useSelector((state) => state.categories);
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);

  const [localCategories, setLocalCategories] = useState(
    JSON.parse(localStorage.getItem("categories")) || []
  );

  const prevCategoriesRef = useRef(localCategories);

  const fetchData = useCallback(async () => {
    if (!selectedBranch?.id) return;

    try {
      const result = await dispatch(fetchCategories(selectedBranch.id));

      if (fetchCategories.fulfilled.match(result)) {
        const newCategories = result.payload;
        const prevCategories = prevCategoriesRef.current;

        if (JSON.stringify(newCategories) !== JSON.stringify(prevCategories)) {
          console.log(
            "API ma'lumotlari o'zgardi. localStorage va UI yangilanmoqda..."
          );
          localStorage.setItem("categories", JSON.stringify(newCategories));
          setLocalCategories(newCategories);
          prevCategoriesRef.current = newCategories;
        } else {
          console.log(
            "API ma'lumotlari o'zgarmadi. Hech narsa o'zgartirilmaydi."
          );
        }
      }
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }
  }, [selectedBranch, dispatch]);

  useEffect(() => {
    if (!localCategories.length) {
      fetchData();
    }
  }, [fetchData, localCategories.length]);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredCategories = localCategories.filter(
    (cat) => cat.shop_id === selectedBranch?.id && cat.is_active
  );

  return (
    <div className="max-w-[450px] mx-auto p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{t("category")}</h2>
        <Link to="/category-all" className="text-sm text-gray-600 border-b-2">
          {t("all_categories")}
        </Link>
      </div>

      {filteredCategories.length > 0 ? (
        <Swiper
          slidesPerView={4.2}
          spaceBetween={8}
          freeMode={true}
          modules={[FreeMode]}
          breakpoints={{
            320: { slidesPerView: 2.8, spaceBetween: 6 },
            350: { slidesPerView: 3.2, spaceBetween: 6 },
            400: { slidesPerView: 3.7, spaceBetween: 6 },
            440: { slidesPerView: 4.2, spaceBetween: 8 },
          }}
        >
          {filteredCategories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div
                className="w-[100px] cursor-pointer flex flex-col items-center text-center"
                onClick={() => navigate(`/category/${cat.id}`)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/${cat.photo}`}
                  alt={cat[`name_${i18n.language}`]}
                  className="w-full h-[80px] rounded-md border object-cover shadow-md"
                />
                <p className="text-xs mt-1 font-medium capitalize">
                  {cat[`name_${i18n.language}`]}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center">{t("no_categories_found")}</div>
      )}
    </div>
  );
};

export default Categories;
