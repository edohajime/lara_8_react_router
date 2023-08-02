import { Col, Container, Row } from "react-bootstrap";
import { BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";

const Header = () => {
  return (
    <div className="header">
      <Container>
        <Row className="align-items-baseline">
          <Col xs={6}>
            <p>
              Kênh người bán &nbsp;|&nbsp; Trở thành người bán Shopee
              &nbsp;|&nbsp; Tải ứng dụng &nbsp;|&nbsp; Kết nối &nbsp;
              <BsFacebook />&nbsp;
              <AiFillInstagram />
            </p>
          </Col>
          <Col xs={6} className="text-end">
            <p>
              Thông báo &nbsp; Hỗ trợ &nbsp; Tiếng Việt &nbsp; Đăng ký
              &nbsp;|&nbsp; Đăng nhập
            </p>
          </Col>
          <Col xs={2}>
            <img
              className="logo"
              src="/images/shopee-logo.jpg"
              alt="Shopee Logo"
            ></img>
          </Col>
          <Col xs={8}>
            <div className="searchBar">
              <form>
                <input
                  type="text"
                  name="search"
                  className="searchInput"
                  placeholder="Đăng ký và nhận voucher bạn mới đến 70k!"
                ></input>
                <button className="searchButton">
                  <BiSearch />
                </button>
              </form>
            </div>
            <div className="searchKey">
              <p>Đồ Chơi Người Lớn 18+</p>
              <p>Điện Thoại 1k</p>
              <p>Đồ 1k Free Ship Áo</p>
              <p>Dép</p>
              <p>iPhone 14 Pro Max</p>
              <p>Người Yêu</p>
              <p>Hộp Bút</p>
              <p>Đồ 1k Free Ship</p>
              <p>Tai Nghe</p>
              <p>Áo Phông</p>
            </div>
          </Col>
          <Col xs={2} className="text-center">
            <CgShoppingCart className="fa-shopping" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Header;
