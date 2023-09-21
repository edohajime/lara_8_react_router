import { Col, Container, Row } from "react-bootstrap";
import { BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";

const Header = () => {
  return (
    <div className="header">
      <Container>
        <Row className="align-items-center">
          <Col xs={6}>
            <p>
              Kết nối &nbsp;
              <BsFacebook />
              &nbsp;
              <AiFillInstagram />
            </p>
          </Col>
          <Col xs={6} className="text-end">
            <p>Đăng ký &nbsp;|&nbsp; Đăng nhập</p>
          </Col>
          <Col xs={3} className="header-logo">
            <h5 className="logo">Clothing Shop</h5>
          </Col>
          <Col xs={7}>
            <div className="searchBar">
              <form>
                <input
                  type="text"
                  name="search"
                  className="searchInput"
                  placeholder="Tìm kiếm thời trang, phụ kiện ..."
                ></input>
                <button className="searchButton">
                  <BiSearch />
                </button>
              </form>
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
