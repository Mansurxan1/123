import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FaCartPlus } from "react-icons/fa";

const LikesPage = () => {
  const navigate = useNavigate();
  const likedProducts = useSelector((state) => state.favorites.likedProducts);

  return (
    <div className="max-w-[450px] mt-[80px] mx-auto p-2">
      <h2 className="text-lg font-semibold mb-4">❤️ Yoqtirilgan mahsulotlar</h2>

      {likedProducts.length > 0 ? (
        likedProducts.map((product) => {
          const [selectedTip, setSelectedTip] = useState(product.tips[0]);

          const handleTipChange = (e) => {
            e.stopPropagation();
            const newTip = product.tips.find(
              (tip) => tip.volume === Number(e.target.value)
            );
            setSelectedTip(newTip);
          };

          return (
            <div
              key={product.id}
              className="flex items-center border rounded-lg shadow-md mb-3 p-2 bg-white"
            >
              {/* Rasm bosilganda sahifa o‘tmaydi */}
              <img
                src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                alt={product.name_uz}
                className="w-[80px] h-[80px] object-cover rounded-md"
              />

              <div className="ml-3 flex-1">
                {/* Nomi bosilganda sahifaga o'tadi */}
                <h3
                  className="text-sm font-medium cursor-pointer text-blue-600"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name_uz}
                </h3>

                {/* Narx bosilganda sahifaga o'tadi */}
                <p
                  className="text-sm font-bold cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {selectedTip.price.toLocaleString()} uzs
                </p>

                <select
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md"
                  value={selectedTip.volume}
                  onChange={handleTipChange}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.tips.map((tip, index) => (
                    <option key={index} value={tip.volume}>
                      {tip.volume} {tip.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center h-[70px] justify-between">
                {/* ❤️ Yurak tugmasi bosilganda sahifa o'tib ketmaydi */}
                <button
                  className="text-red-500 text-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FcLike />
                </button>

                {/* 🛒 Savat tugmasi bosilganda sahifa o'tib ketmaydi */}
                <button
                  className="text-blue-600 text-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaCartPlus />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">
          Siz hali mahsulot tanlamadingiz.
        </p>
      )}
    </div>
  );
};

export default LikesPage;
