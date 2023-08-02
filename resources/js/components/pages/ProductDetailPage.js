import "../../../css/style.css";
import ProductDetail from "../ProductDetail";
import Header from "../Header";
import Footer from "../Footer";

const ProductDetailPage = () => {
    // const params = new URLSearchParams(window.location.pathname);
    return (
        <>
            <Header />

            <ProductDetail />

            <Footer />
        </>
    );
};
export default ProductDetailPage;
