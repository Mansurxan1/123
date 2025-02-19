import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Product from "../components/Product";
import { BiCategory } from "react-icons/bi";

const Home = () => {
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      navigate("/category-all");
      setIsRotating(false);
    }, 2000);
  };

  return (
    <>
      <Search />
      <Banner />
      <Categories />
      <Product />

      <button
        onClick={handleClick}
        className={`fixed z-[9999] bottom-28 right-2 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transition-transform ${
          isVisible ? "opacity-100 animate-bounce" : "opacity-0"
        }`}
        style={{
          transition: "opacity 0.5s ease-in-out",
          animation: isVisible ? "shake 2s infinite" : "none",
        }}
      >
        <BiCategory
          className={`text-white text-lg ${
            isRotating ? "rotate-animation" : ""
          }`}
        />
      </button>

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-5px); }
            50% { transform: translateY(5px); }
            75% { transform: translateY(-5px); }
          }

          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .rotate-animation {
            animation: rotate 2s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default Home;
