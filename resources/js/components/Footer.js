import { Col, Container, Row } from "react-bootstrap";
import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerSection"></div>
      <Container>
        <Row className="aboutUs">
          <Col>
            <h3>CHĂM SÓC KHÁCH HÀNG</h3>
            <h4>Trung Tâm Trợ Giúp</h4>
            <h4>Shopee Blog</h4>
            <h4>Shopee Mall</h4>
            <h4>Hướng Dẫn Mua Hàng</h4>
            <h4>Hướng Dẫn Bán Hàng</h4>
            <h4>Thanh Toán</h4>
            <h4>Shopee Xu</h4>
            <h4>Vận Chuyển</h4>
            <h4>Trả Hàng & Hoàn Tiền</h4>
            <h4>Chăm Sóc Khách Hàng</h4>
            <h4>Chính Sách Bảo Hành</h4>
          </Col>
          <Col>
            <h3>VỀ SHOPEE</h3>
            <h4>Giới Thiệu Về Shopee Việt Nam</h4>
            <h4>Tuyển Dụng</h4>
            <h4>Điều Khoản Shopee</h4>
            <h4>Chính Sách Bảo Mật</h4>
            <h4>Chính Hãng</h4>
            <h4>Kênh Người Bán</h4>
            <h4>Flash Sales</h4>
            <h4>Chương Trình Tiếp Thị Liên Kết Shopee</h4>
            <h4>Liên Hệ Với Truyền Thông</h4>
          </Col>
          <Col>
            <h3>THANH TOÁN</h3>
            <div className="footerImg-items">
              <div className="footerImg-item">
                <img src="/images/footer-item1.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item2.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item3.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item4.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item5.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item6.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item7.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item8.jpg" alt="footer-item"></img>
              </div>
            </div>

            <h3>ĐƠN VỊ VẬN CHUYỂN</h3>
            <div className="footerImg-items">
              <div className="footerImg-item">
                <img src="/images/footer-item9.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item10.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item11.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item12.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item13.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item14.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item15.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item16.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item17.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item18.jpg" alt="footer-item"></img>
              </div>
              <div className="footerImg-item">
                <img src="/images/footer-item19.jpg" alt="footer-item"></img>
              </div>
            </div>
          </Col>
          <Col className="socials">
            <h3>THEO DÕI CHÚNG TÔI TRÊN</h3>
            <div className="d-flex">
              <BsFacebook />
              <h4>Facebook</h4>
            </div>
            <div className="d-flex">
              <AiFillInstagram />
              <h4>Instagram</h4>
            </div>
            <div className="d-flex">
              <BsLinkedin />
              <h4>LinkedIn</h4>
            </div>
          </Col>
          <Col>
            <h3>TẢI ỨNG DỤNG SHOPEE NGAY THÔI</h3>
            <div className="d-flex download">
              <div className="download-item">
                <img src="/images/footer-qrcode.jpg" alt="QR Code"></img>
              </div>
              <div className="downloadApp">
                <div className="download-item">
                  <img src="/images/app-store.jpg" alt="App Store"></img>
                </div>
                <div className="download-item">
                  <img src="/images/google-play.jpg" alt="Google Play"></img>
                </div>
                <div className="download-item">
                  <img src="/images/app-gallery.jpg" alt="App Gallery"></img>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="national">
          <Col xs={4}>
            <h5>© 2023 Shopee. Tất cả các quyền được bảo lưu.</h5>
          </Col>
          <Col className="national-items">
            <h5>Quốc gia & Khu vực:&nbsp;</h5>
            <h5>Singapore&nbsp;|&nbsp;</h5>
            <h5>Indonesia&nbsp;|&nbsp;</h5>
            <h5>Đài Loan&nbsp;|&nbsp;</h5>
            <h5>Thái Lan&nbsp;|&nbsp;</h5>
            <h5>Malaysia&nbsp;|&nbsp;</h5>
            <h5>Việt Nam&nbsp;|&nbsp;</h5>
            <h5>Philippines&nbsp;|&nbsp;</h5>
            <h5>Brazil&nbsp;|&nbsp;</h5>
            <h5>México&nbsp;|&nbsp;</h5>
            <h5>Colombia&nbsp;|&nbsp;</h5>
            <h5>Chile</h5>
          </Col>
        </Row>
      </Container>
      <div className="footerPolicy">
        <Container>
          <Row>
            <Col className="policy">
              <h3>CHÍNH SÁCH BẢO MẬT</h3>
              <h3>|</h3>
              <h3>QUY CHẾ HOẠT ĐỘNG</h3>
              <h3>|</h3>
              <h3>CHÍNH SÁCH VẬN CHUYỂN</h3>
              <h3>|</h3>
              <h3>CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</h3>
            </Col>
          </Row>
          <Row>
            <Col className="text-center registered" xs={12}>
              <img src="/images/registered.jpg" alt="Registered"></img>
              <img src="/images/registered.jpg" alt="Registered"></img>
              <img src="/images/registered2.jpg" alt="Registered"></img>
            </Col>
            <Col className="text-center companyName" xs={12}>Công ty TNHH Shopee</Col>
          </Row>
          <Row>
            <Col className="text-center companyInfo">
              <p>
                Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu
                Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt
                Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
              </p>
              <p>
                Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại
                liên hệ: 024 73081221 (ext 4678)
              </p>
              <p>
                Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội
                cấp lần đầu ngày 10/02/2015
              </p>
              <p>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default Footer;
