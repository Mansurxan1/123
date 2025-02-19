import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const branchId = searchParams.get("branch_id"); // Filial ID olamiz
  const [results, setResults] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (query && branchId) {
      fetch(
        `${API_URL}/shop-products/search?search=${query}&branch_id=${branchId}`
      )
        .then((res) => res.json())
        .then((data) => setResults(data.products || []))
        .catch((err) => console.error("API error:", err));
    }
  }, [query, branchId, API_URL]);

  return (
    <div className="container mx-auto mt-40 p-4">
      <h2 className="text-xl font-bold mb-4">Qidiruv natijalari: "{query}"</h2>
      {results.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((product) => (
            <li key={product.id} className="border p-4 rounded-lg shadow">
              <img
                src={`${API_URL}/${product.photo}`}
                alt={product.name_uz}
                className="w-20 h-20 mb-2"
              />
              <h3 className="font-semibold">{product.name_uz}</h3>
              <p>{product.price} so‘m</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Natijalar topilmadi.</p>
      )}
    </div>
  );
}

export default SearchResults;
