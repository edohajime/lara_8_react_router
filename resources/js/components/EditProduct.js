import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const EditProduct = () => {
    const [items, setItems] = useState([]);

    const addItem = () => {
        const newItem = <Item key={items.length} index={items.length}/>;
        setItems([...items, newItem]);
        document.getElementById("form-button").style.display = "flex";
        document.getElementById("form-button").style.justifyContent = "flex-end";
    };


    const removeItem = () => {
        if (items.length > 0) {
            const updateItems = [...items];
            updateItems.pop();
            setItems(updateItems);
        } 
        if (items.length === 1) {
            document.getElementById("form-button").style.display = "none";
        }
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">SỬA THÔNG TIN SẢN PHẨM</h1>

            {/* Content Row */}
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <form method="post" action="/add-product" encType="multipart/form-data">
                            <input type="hidden" name="_token" value={csrfToken} />

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Thông tin sản phẩm
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Row>
                                        <Col xs={12}>
                                            <label htmlFor="name">
                                                Tên sản phẩm:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="name"
                                                id="name"
                                            ></input>
                                        </Col>
                                        <Col xs={4}>
                                            <label htmlFor="code">
                                                Mã sản phẩm:
                                            </label>

                                            <input
                                                className="form-input"
                                                type="text"
                                                name="code"
                                                id="code"
                                            ></input>
                                        </Col>

                                        <input
                                            className="form-input d-none"
                                            type="number"
                                            name="total_quantity"
                                            id="total_quantity"
                                            min="0"
                                        ></input>

                                        <Col xs={4}>
                                            <label htmlFor="price">
                                                Giá sản phẩm:
                                            </label>

                                            <input
                                                className="form-input"
                                                type="number"
                                                name="price"
                                                id="price"
                                                min="0"
                                            ></input>
                                        </Col>

                                        <Col xs={4}>
                                            <label htmlFor="sale">
                                                Sale giảm giá (%):
                                            </label>

                                            <input
                                                className="form-input"
                                                type="number"
                                                name="sale"
                                                id="sale"
                                                min="0"
                                                max="100"
                                            ></input>
                                        </Col>
                                        <Col xs={12}>
                                            <label htmlFor="description">
                                                Mô tả:
                                            </label>

                                            <textarea
                                                className="form-input text"
                                                type="text"
                                                name="description"
                                                id="description"
                                            ></textarea>
                                        </Col>

                                        <Col xs={12}>
                                            <label htmlFor="short_description">
                                                Mô tả ngắn:
                                            </label>

                                            <textarea
                                                className="form-input text"
                                                type="text"
                                                name="short_description"
                                                id="short_description"
                                            ></textarea>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Màu sắc & Size
                                    </h6>
                                    <div
                                        id="product-expand1"
                                        onClick={addItem}
                                    >
                                        Thêm
                                    </div>
                                    <div
                                        id="product-expand1"
                                        className="minus-item"
                                        onClick={removeItem}
                                    >
                                        Xóa
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div>{items}</div>
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Ảnh sản phẩm
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <label htmlFor="images">Chọn ảnh:</label>
                                    <input type="file" id="images" name="images[]" accept="image/*, video/mp4" multiple></input>
                                </div>
                            </div>

                            <Row>
                                <Col className="text-end" id="form-button">
                                    <Link className="cancel-button" to="/admin">Hủy</Link>
                                    <button type="submit" className="add-button">Thêm mới</button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const Item = (props) => {
    return (
        <Row>
            <Col xs={3}>
                <label>Màu sắc:</label>

                <input
                    className="form-input"
                    type="text"
                    name={"color" + props.index}
                ></input>
            </Col>

            <Col xs={3}>
                <label>Size:</label>

                <input
                    className="form-input"
                    type="text"
                    name={"size" + props.index}
                ></input>
            </Col>

            <Col xs={3}>
                <label>Số lượng sản phẩm:</label>

                <input
                    className="form-input"
                    type="number"
                    name={"quantity" + props.index}
                    min="0"
                ></input>
            </Col>
        </Row>
    );
};
export default EditProduct;
