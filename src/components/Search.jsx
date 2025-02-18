import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";

function Search() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
      once: true,
      offset: 200,
      delay: 300,
    });
  }, []);

  return (
    <section className="w-full mt-[80px] min-w-[200px] max-w-md mx-auto">
      <div className="p-4 pt-0">
        <div
          className="relative"
          data-aos="fade-right"
          data-aos-delay="500"
          data-aos-duration="1200"
        >
          <input
            type="search"
            placeholder={t("search")}
            className="w-full px-4 py-3 pl-12 bg-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
          />
          <CiSearch className="absolute top-[32%] left-5 w-[20px] h-[20px]" />
        </div>
      </div>
    </section>
  );
}

export default Search;
