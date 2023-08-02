import AdFooter from "../../AdFooter";
import EditProduct from "../../EditProduct";
import ScrollToTop from "../../ScrollToTop";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

const DashboardEditProduct = () => {
    return (
        <div>
            <div id="wrapper">
                <Sidebar />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        {/* Begin Page Content */}
                        <EditProduct />
                        
                    </div>
                    <AdFooter />
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};
export default DashboardEditProduct;
