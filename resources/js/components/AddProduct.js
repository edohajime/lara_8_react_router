import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const AddProduct = () => {
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const imageRef = useRef(null);
    
    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });

    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/add-product`;
        const formData = new FormData(e.target);
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };

        axios
            .post(url, formData, config)
            .then((res) => {
                setMsg(res.data);
            })
            .catch((error) => {
                console.log("Error network", error);
            });
    };
    // Hiện thông báo
    const handleAlert = (status, msg) => {
        swal({
            title: msg,
            icon: status ? "success" : "warning",
        });
    };
    
    // Xử lý hiện thông báo
    useEffect(() => {
        console.log(msg.messages);
        if (msg.messages !== "") {
            handleAlert(msg.status, msg.messages);
            if (msg.status) {
                handleReset();
            }
        }
    }, [msg]);
    
    // Reset các trường nhập
    const handleReset = () => {
        // reset select option warehouse
        let inputs = document.querySelectorAll("input");
        let selects = document.querySelectorAll("select");
        inputs.forEach((input) => {
            if (input.type === "text") {
                input.value = "";
            } else if (input.type === "number") {
                input.value = 0;
            }
        });
        selects.forEach((select) => {
            select[0].selected = true;
        });
        setColors([]);
        setSizes([]);
        setSelectedFiles([]);
    };


    const addColor = (color = "") => {
        setColors((prevColors) => [
            ...prevColors,
            <Color key={prevColors.length} index={prevColors.length} color={color} />,
          ]);

        let sizeButtons = document.querySelectorAll("div.size");
        for (const sizeButton of sizeButtons) {
            sizeButton.style.display = "block";
        }
    };
    const removeColor = () => {
        if (colors.length > 0) {
            const updateColors = [...colors];
            updateColors.pop();
            setColors(updateColors);
        }
        if (colors.length === 1) {
            let sizeButtons = document.querySelectorAll("div.size");
            for (const sizeButton of sizeButtons) {
                sizeButton.style.display = "none";
            }
        }
    };
    const addSize = () => {
        const newSize = <Size key={sizes.length} index={sizes.length} />;
        setSizes([...sizes, newSize]);
        document.getElementById("form-button").style.display = "flex";
        document.getElementById("form-button").style.justifyContent =
            "flex-end";
    };
    const removeSize = () => {
        if (sizes.length > 0) {
            const updateSizes = [...sizes];
            updateSizes.pop();
            setSizes(updateSizes);
        }
        if (sizes.length === 1) {
            document.getElementById("form-button").style.display = "none";
        }
    };

    const handleFileChange = (e) => {
        const images = Array.from(imageRef.current.files);
        setSelectedFiles(images);
        console.log(images);
    };

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">THÊM MỚI</h1>

            {/* Content Row */}
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <form
                            // method="post"
                            // action="/add-product"
                            // encType="multipart/form-data"
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

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

                                        {/* <input
                                            className="form-input d-none"
                                            type="number"
                                            name="total_quantity"
                                            id="total_quantity"
                                            min="0"
                                        ></input> */}

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

                            <div className="d-flex">
                                <div
                                    className="card shadow mb-4"
                                    style={{ width: "48%", marginRight: "4%" }}
                                >
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">
                                            Màu sắc
                                        </h6>
                                        <div
                                            id="product-expand1"
                                            onClick={addColor}
                                        >
                                            Thêm
                                        </div>
                                        <div
                                            id="product-expand1"
                                            className="minus-item"
                                            onClick={removeColor}
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div>{colors}</div>
                                    </div>
                                </div>

                                <div
                                    className="card shadow mb-4"
                                    style={{ width: "48%" }}
                                >
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">
                                            Size
                                        </h6>
                                        <div
                                            id="product-expand1"
                                            className="size"
                                            style={{display: "none"}}
                                            onClick={addSize}
                                        >
                                            Thêm
                                        </div>
                                        <div
                                            id="product-expand1"
                                            className="size minus-item"
                                            style={{display: "none"}}
                                            onClick={removeSize}
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div>{sizes}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Ảnh sản phẩm
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <label htmlFor="images" className="product_images-label">Chọn ảnh</label>
                                    <input
                                        ref={imageRef}
                                        type="file"
                                        id="images"
                                        name="images[]"
                                        accept="image/*, video/mp4"
                                        style={{display: "none"}}
                                        onChange={(e) => handleFileChange(e)}
                                        multiple
                                    ></input>
                                    <div className="review-input-medias">
                                        {selectedFiles.map((file, index) =>
                                            file.type.startsWith("image") ? (
                                                <div
                                                    className="medias-item-border"
                                                    key={index}
                                                >
                                                    <img
                                                        className="medias-item"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt={`Selected file ${
                                                            index + 1
                                                        }`}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="medias-item-border"
                                                    key={index}
                                                >
                                                    <video
                                                        className="medias-item"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                    ></video>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Row>
                                <Col className="text-end" id="form-button">
                                    <Link className="cancel-button" to="/admin">
                                        Hủy
                                    </Link>
                                    <button
                                        type="submit"
                                        className="add-button"
                                    >
                                        Thêm mới
                                    </button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const Color = (props) => {
    return (
        <Row>
            <Col xs={6}>
                <label htmlFor={`color${props.index}`}>
                    Màu {props.index + 1}:
                </label>
            </Col>
            <Col xs={6}>
                <input
                    className="form-input"
                    type="text"
                    name={`color${props.index}`}
                    id={`color${props.index}`}
                ></input>
            </Col>
        </Row>
    );
};

const Size = (props) => {
    return (
        <Row>
            <Col xs={6}>
                <label htmlFor={`size${props.index}`}>
                    Size {props.index + 1}:
                </label>
            </Col>
            <Col xs={6}>
                <input
                    className="form-input"
                    type="text"
                    name={`size${props.index}`}
                    id={`size${props.index}`}
                ></input>
            </Col>
        </Row>
    );
};

export default AddProduct;
