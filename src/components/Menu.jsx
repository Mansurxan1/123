import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FcHome, FcLike } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { LuPhoneCall, LuShoppingBasket } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import logo from "../assets/images/logo.jpg";
import i18n from "../i18n/i18n";

const Menu = ({ onClose }) => {
  const { t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed top-0 z-[9999] w-full max-w-[450px] bg-white min-h-screen max-h-screen overflow-y-auto p-4 scrollbar-hide"
      >
        <div className="relative flex flex-col items-center mb-6">
          <Link to="/" onClick={onClose}>
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 rounded-full m-2 mt-10 border-[1px] border-blue-950 object-cover"
            />
          </Link>
          <button onClick={onClose} className="absolute -top-2 right-0 p-2">
            <IoCloseCircle className="w-9 h-9" />
          </button>
        </div>

        <nav className="flex flex-col items-start space-y-1 font-semibold">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center text-xl gap-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <FcHome className="text-2xl" />
            <span>{t("home")}</span>
          </Link>
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center text-xl gap-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <FaUser className="text-blue-600 text-2xl" />
            <span>{t("profile")}</span>
          </Link>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center gap-3 p-2 text-xl  hover:bg-gray-100 rounded-lg w-full"
          >
            <FiShoppingCart className="text-blue-600 text-2xl" />
            <span>{t("cart")}</span>
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 text-xl p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <LuShoppingBasket className="text-blue-600 text-2xl" />
            <span>{t("orders")}</span>
          </Link>
          <Link
            to="/likes"
            onClick={onClose}
            className="flex items-center text-xl gap-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <FcLike className="text-2xl" />
            <span>{t("favorites")}</span>
          </Link>
          <Link
            to="/locations"
            onClick={onClose}
            className="flex items-center text-xl gap-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <FaMapLocationDot className="text-blue-500 text-2xl" />
            <span>{t("locations")}</span>
          </Link>
          <a
            href="tel:+998901234567"
            onClick={onClose}
            className="flex items-center gap-3 text-xl p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <LuPhoneCall className="text-blue-600 text-2xl" />
            <span>{t("contact")}</span>
          </a>
        </nav>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => changeLanguage("uz")}
            className={`px-4 py-2 rounded-lg shadow-2xl ${
              i18n.language === "uz" ? "bg-blue-600 text-white" : "border"
            }`}
          >
            UZB
          </button>
          <button
            onClick={() => changeLanguage("ru")}
            className={`px-4 py-2 rounded-lg ${
              i18n.language === "ru" ? "bg-blue-600 text-white" : "border"
            }`}
          >
            РУС
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Menu;
