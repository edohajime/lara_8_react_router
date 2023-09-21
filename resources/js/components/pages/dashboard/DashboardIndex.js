import AdFooter from "../../AdFooter";
import Index from "../../Index";
import ScrollToTop from "../../ScrollToTop";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

const DashboardIndex = () => {
    return (
        <div>
            <div id="wrapper">
                <Sidebar />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content" className="w-100">
                        <Topbar />

                        {/* Begin Page Content */}
                        <Index />
                        
                    </div>
                    <AdFooter />
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};
export default DashboardIndex;
