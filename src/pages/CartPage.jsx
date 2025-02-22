import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useSwipeable } from "react-swipeable";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const [offset, setOffset] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const thresholdDelete = 0.05;
  const thresholdRemove = 0.1;

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const newOffset = Math.min(
        Math.max(0, eventData.deltaX * -1),
        window.innerWidth * 0.3
      );
      setOffset(newOffset);
    },
    onSwipedLeft: () => {
      if (offset >= window.innerWidth * thresholdRemove) {
        removeItem(item.id);
      } else {
        setOffset(0);
      }
    },
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative w-full max-w-[450px] overflow-hidden"
    >
      <div
        className="relative w-full"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
        }}
      >
        <div className="flex items-center border rounded-lg shadow-md mb-3 p-2 bg-white">
          <img
            src={`${import.meta.env.VITE_API_URL}/${
              item.product_in_cart.photo
            }`}
            alt={item.product_in_cart.name_uz}
            className="w-[80px] h-[80px] object-cover rounded-md"
          />
          <div className="ml-3 flex-1">
            <h3 className="capitalize text-sm font-medium">
              {item.product_in_cart.name_uz}
            </h3>
            <p className="text-sm font-bold">{item.tip.price} uzs</p>
            <span
              className={`text-xs font-semibold rounded-xl px-4 py-1 ${
                isDropdownOpen
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() =>
                item.count > 1 && setIsDropdownOpen(!isDropdownOpen)
              }
            >
              {item.tip.volume} {item.tip.unit}
            </span>
          </div>
          <div className="flex flex-col items-center h-[70px] justify-center">
            <div className="flex items-center">
              <button
                className="bg-white shadow-lg border p-2 rounded-full text-red-600"
                onClick={() =>
                  updateQuantity(item.id, item.count - 1, item.tip.id)
                }
              >
                <AiOutlineMinus />
              </button>
              <span className="mx-2">{item.count}</span>
              <button
                className="bg-white shadow-lg border p-2 rounded-full text-green-600"
                onClick={() =>
                  updateQuantity(item.id, item.count + 1, item.tip.id)
                }
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>
        </div>
      </div>
      {offset >= window.innerWidth * thresholdDelete && (
        <div className="absolute top-1/2 transform -translate-y-1/2 right-4 text-white">
          <FaTrash
            className="text-red-600 text-xl cursor-pointer"
            onClick={() => removeItem(item.id)}
          />
        </div>
      )}
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_CARTS);
      console.log("📥 Serverdan kelgan ma'lumot:", response.data);
      setCartItems(response.data || []);
    } catch (error) {
      console.error(
        "❌ Xatolik: Savatcha ma'lumotlarini olishda xatolik",
        error
      );
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = useCallback(async (cartId, newQuantity, tipId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartId ? { ...item, count: newQuantity } : item
      )
    );

    if (newQuantity <= 0) {
      removeItem(cartId);
      return;
    }

    try {
      await axios.patch(
        `${
          import.meta.env.VITE_CARTS
        }?cart_id=${cartId}&count=${newQuantity}&tip_id=${tipId}`
      );
      console.log("✅ PATCH muvaffaqiyatli bajarildi!");
    } catch (error) {
      console.error("❌ PATCH xatolik:", error);
      // API xatolik bersa, eski son qayta tiklanadi
      fetchCartItems();
    }
  }, []);

  const removeItem = useCallback(
    async (cartId) => {
      const oldCartItems = [...cartItems];
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartId)
      );

      try {
        await axios.delete(
          `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartId}`
        );
        console.log("✅ Mahsulot muvaffaqiyatli o‘chirildi!");
      } catch (error) {
        console.error("❌ DELETE xatolik:", error);
        setCartItems(oldCartItems); // API xatolik bersa, mahsulotni qayta tiklash
      }
    },
    [cartItems]
  );

  return (
    <div className="max-w-[450px] mt-[80px] mx-auto p-2">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">Savatingiz bo'sh</p>
      )}
    </div>
  );
};

export default CartPage;
