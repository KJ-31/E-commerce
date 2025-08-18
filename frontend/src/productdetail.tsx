import { useParams, Link } from "react-router-dom";
import ProductDetailPage from "./products/productpage";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <ProductDetailPage />

      <Link
        to="/"
        className="text-blue-500 underline hover:text-blue-700 mt-4 block"
      >
        ← 홈으로 돌아가기
      </Link>
    </div>
  );
}
