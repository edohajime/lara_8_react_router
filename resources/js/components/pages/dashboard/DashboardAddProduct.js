import AdFooter from "../../AdFooter";
import AddProduct from "../../AddProduct";
import ScrollToTop from "../../ScrollToTop";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

const DashboardAddProduct = () => {
    return (
        <div>
            <div id="wrapper">
                <Sidebar />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        {/* Begin Page Content */}
                        <AddProduct />
                        
                    </div>
                    <AdFooter />
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};
export default DashboardAddProduct;
