import AdFooter from "../../AdFooter";
import ProductIndex from "../../ProductIndex";
import ScrollToTop from "../../ScrollToTop";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

const DashboardProductIndex = () => {
    return (
        <div>
            <div id="wrapper">
                <Sidebar />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        {/* Begin Page Content */}
                        <ProductIndex />
                        
                    </div>
                    <AdFooter />
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
}
export default DashboardProductIndex;