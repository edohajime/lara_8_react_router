import { Col, Container, Row } from "react-bootstrap";
import ReviewAddModal from "./ReviewAddModal";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    BsStarFill,
    BsStarHalf,
    BsChevronRight,
    BsThreeDotsVertical,
    BsStar,
    BsChevronLeft,
} from "react-icons/bs";

import { MdAddShoppingCart } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import {
    handleHover,
    handleLike,
    handleNext,
    handlePrev,
    handleSelect,
    initial2DArray,
} from "../utilities/Utilities";

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState({});
    const [data, setData] = useState({}); // Statistic Reviews
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage, setReviewsPerPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([1]);

    // Mảng 2D dùng để lưu trữ color size và quantity tương ứng
    const [colorSizes, setColorSizes] = useState([]);
    // vị trí chứa giá trị quantity trên mảng 2 chiều colorSizes
    let row = 0,
        col = 0;
    // Tham chiếu đến ô nhập số lượng
    const [quantity, setQuantity] = useState(0);
    const quantityRef = useRef(null);

    const ops1 = {
        slider: "listMedia",
        container: "mediaSlide-contain",
        cellSelector: ".mediaSlide-contain .mediaSlide-item",
        prevButton: "mediaSlide-prev",
        nextButton: "mediaSlide-next",
    };

    const selectOps = {
        containerClass: "mediaSlide-contain",
        childClass: "mediaSlide-media",
    };

    const selectOps1 = {
        containerClass: "attributes",
        childClass: "attribute",
    };

    const selectOps2 = {
        containerClass: "reviews-filters",
        childClass: "filter",
    };

    const selectOps3 = {
        containerClass: "review-medias-navibar",
        childClass: "media-src",
    };

    const handlePages = (e) => {
        let page = parseInt(e.innerHTML);
        setCurrentPage(page);
    };

    const handlePrevPages = () => {
        let page = currentPage;
        if (--page >= 1) {
            setCurrentPage(page);
        }
    };

    const handleNextPages = () => {
        let page = currentPage;
        let maxPage = Math.ceil(total / reviewsPerPage);
        if (++page <= maxPage) {
            setCurrentPage(page);
        }
    };

    const handleAttributes = (e, attr, index, ops) => {
        handleSelect(e, ops);

        // tham chiếu đến color và size đã tích chọn
        let color = document.querySelector(
            ".productAttribute .attribute.color.active"
        );
        let size = document.querySelector(
            ".productAttribute .attribute.size.active"
        );

        // Tham chiếu đến nhãn hiển thị số lượng hàng theo từng color size
        let quantity = document.querySelector(
            ".productAttribute .quantityBox + p"
        );
        if (attr === "color") {
            row = index;
        } else if (attr === "size") {
            col = index;
        }

        // Nếu đã chọn color và size
        if (color && size) {
            quantity.innerHTML = `${colorSizes[row][col]} sản phẩm có sẵn`;
            quantityRef.current.max = colorSizes[row][col];
        } else {
            quantity.innerHTML = "";
        }
    };

    const handleQuantityInput = (action) => {
        let number = quantity;
        if (action === "add" && number < quantityRef.current.max) {
            number += 1;
        }

        if (action === "subtract" && number > quantityRef.current.min) {
            number -= 1;
        }

        setQuantity(number);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Lấy reviews, total reviews
    const getReviews = async (currentPage) => {
        let prodId = searchParams.get("id");
        let page = currentPage;
        let rpp = reviewsPerPage;
        try {
            const res = await axios.get(
                `http://localhost:8000/list-review?product_id=${prodId}&page=${page}&rpp=${rpp}`
            );
            setReviews(res.data.reviews);
            setTotal(res.data.total);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log(reviews);
    }, [reviews]);

    useEffect(() => {
        console.log(product);
    }, [product]);

    // Lấy thông tin sản phẩm

    const getProduct = async () => {
        let prodId = searchParams.get("id");
        try {
            const res = await axios.get(
                `http://localhost:8000/api/products/${prodId}`
            );
            setProduct(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Lấy Statistic Review
    const getStatisReviews = async () => {
        try {
            const prodId = searchParams.get("id");
            const res = await axios.get(
                `http://localhost:8000/statistic-review?product_id=${prodId}`
            );
            setData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getReviews(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        getStatisReviews();
    }, []);
    // Lấy pageNumbers
    useEffect(() => {
        let arrPages = [];
        for (let i = 1; i <= Math.ceil(total / reviewsPerPage); i++) {
            arrPages.push(i);
        }
        setPageNumbers(arrPages);
    }, [reviewsPerPage, total]);

    // Cập nhật colorSizes khi product thay đổi
    useEffect(() => {
        const colorSizeArray = initial2DArray(
            product.total_colors,
            product.total_sizes
        );

        if (product.color_sizes) {
            product.color_sizes.map((colorSize) => {
                colorSizeArray[colorSize.row][colorSize.col] =
                    colorSize.quantity;
            });
            console.log("color size:", colorSizeArray);
        }
        setColorSizes(colorSizeArray);
    }, [product]);
    // 5 stars
    const arrays = [1, 2, 3, 4, 5];

    return (
        <div className="productDetail">
            <Container>
                <div className="breadcumbs">
                    <div className="brand">Clothing Shop</div>
                    <BsChevronRight />
                    <div className="brand">Giày Dép Nam</div>
                    <BsChevronRight />
                    <div className="brand">Xăng-đan và Dép</div>
                    <BsChevronRight />
                    <div className="brand">Xăng-đan</div>
                    <BsChevronRight />
                    <div className="brand leaf ">{product.name}</div>
                </div>
                <Row className="productDetail-info">
                    <Col xs={12}>
                        <Row>
                            <Col xs={5} className="productMedia">
                                <div className="preview">
                                    <div className="thumbnail zoom">
                                        <div id="media" className="media">
                                            <img
                                                className="image"
                                                src={
                                                    product.product_images
                                                        ? product
                                                              .product_images[0]
                                                              .url
                                                        : ""
                                                }
                                                alt="product.jpg"
                                            ></img>
                                            <video
                                                className="video"
                                                src=""
                                                style={{ display: "none" }}
                                                autoPlay
                                            ></video>
                                        </div>
                                    </div>
                                    <div className="listMedia">
                                        <div className="mediaSlide">
                                            <div className="mediaSlide-contain">
                                                {product.product_images?.map(
                                                    (media, index) =>
                                                        index === 0 ? (
                                                            <div
                                                                key={index}
                                                                className="mediaSlide-item"
                                                            >
                                                                <img
                                                                    className="mediaSlide-media active"
                                                                    src={
                                                                        media.url
                                                                    }
                                                                    alt="product"
                                                                    onMouseOver={(
                                                                        e
                                                                    ) =>
                                                                        handleHover(
                                                                            e.target,
                                                                            true
                                                                        )
                                                                    }
                                                                    onMouseOut={(
                                                                        e
                                                                    ) =>
                                                                        handleHover(
                                                                            e.target,
                                                                            false
                                                                        )
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleSelect(
                                                                            e.target,
                                                                            selectOps
                                                                        )
                                                                    }
                                                                ></img>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={index}
                                                                className="mediaSlide-item"
                                                            >
                                                                <img
                                                                    className="mediaSlide-media"
                                                                    src={
                                                                        media.url
                                                                    }
                                                                    alt="product"
                                                                    onMouseOver={(
                                                                        e
                                                                    ) =>
                                                                        handleHover(
                                                                            e.target,
                                                                            true
                                                                        )
                                                                    }
                                                                    onMouseOut={(
                                                                        e
                                                                    ) =>
                                                                        handleHover(
                                                                            e.target,
                                                                            false
                                                                        )
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleSelect(
                                                                            e.target,
                                                                            selectOps
                                                                        )
                                                                    }
                                                                ></img>
                                                            </div>
                                                        )
                                                )}

                                                {/* <div className="mediaSlide-item">
                                                    <video
                                                        className="mediaSlide-media"
                                                        src="/videos/productdetail-video.mp4"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></video>
                                                    <svg
                                                        enableBackground="new 0 0 15 15"
                                                        viewBox="0 0 15 15"
                                                        x="0"
                                                        y="0"
                                                        className="shopee-svg-icon-play "
                                                    >
                                                        <g opacity=".54">
                                                            <g>
                                                                <circle
                                                                    cx="7.5"
                                                                    cy="7.5"
                                                                    fill="#040000"
                                                                    r="7.3"
                                                                ></circle>
                                                                <path
                                                                    d="m7.5.5c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7m0-.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5z"
                                                                    fill="#ffffff"
                                                                ></path>
                                                            </g>
                                                        </g>
                                                        <path
                                                            d="m6.1 5.1c0-.2.1-.3.3-.2l3.3 2.3c.2.1.2.3 0 .4l-3.3 2.4c-.2.1-.3.1-.3-.2z"
                                                            fill="#ffffff"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <div className="mediaSlide-item">
                                                    <img
                                                        className="mediaSlide-media"
                                                        src="/images/productdetail-image2.jpg"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></img>
                                                </div>
                                                <div className="mediaSlide-item">
                                                    <img
                                                        className="mediaSlide-media"
                                                        src="/images/productdetail-image3.jpg"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></img>
                                                </div>
                                                <div className="mediaSlide-item">
                                                    <img
                                                        className="mediaSlide-media"
                                                        src="/images/productdetail-image4.jpg"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></img>
                                                </div>
                                                <div className="mediaSlide-item">
                                                    <img
                                                        className="mediaSlide-media"
                                                        src="/images/productdetail-image5.jpg"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></img>
                                                </div>
                                                <div className="mediaSlide-item">
                                                    <img
                                                        className="mediaSlide-media"
                                                        src="/images/productdetail-image6.jpg"
                                                        alt="product"
                                                        onMouseOver={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                true
                                                            )
                                                        }
                                                        onMouseOut={(e) =>
                                                            handleHover(
                                                                e.target,
                                                                false
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            handleSelect(
                                                                e.target,
                                                                selectOps
                                                            )
                                                        }
                                                    ></img>
                                                </div> */}
                                            </div>
                                        </div>
                                        <BsChevronLeft
                                            className="mediaSlide-prev disable"
                                            onClick={(e) => {
                                                handlePrev(e.target, ops1);
                                            }}
                                        />
                                        <BsChevronRight
                                            className="mediaSlide-next"
                                            onClick={(e) => {
                                                handleNext(e.target, ops1);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col xs={7} className="productInfo">
                                <h3 className="productName">{product.name}</h3>
                                <div className="summary">
                                    <div className="d-flex">
                                        <div className="d-flex item">
                                            <p className="underline rate">
                                                {data.avg_star}
                                            </p>
                                            {arrays.map((index) =>
                                                data.avg_star >= index ? (
                                                    <BsStarFill
                                                        key={index}
                                                        className="rated"
                                                    />
                                                ) : (
                                                    <BsStar
                                                        key={index}
                                                        className="rated"
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="item">|</div>
                                        <div className="d-flex item">
                                            <p className="underline">
                                                {data.total}
                                            </p>
                                            <h4>Đánh giá</h4>
                                        </div>
                                        <div className="item">|</div>
                                        <div className="d-flex item">
                                            <p>{product.sold}</p>
                                            <h4>Đã bán</h4>
                                        </div>
                                    </div>
                                    <h4>Tố cáo</h4>
                                </div>
                                {product.sale !== 0 ? (
                                    <div className="productPrice">
                                        <p className="price">
                                            <span>
                                                ₫
                                                {product.price?.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </span>
                                            ₫
                                            {(
                                                (product.price * product.sale) /
                                                100
                                            ).toLocaleString("vi-VN")}
                                        </p>
                                        <div className="sale">
                                            {product.sale}% GIẢM
                                        </div>
                                    </div>
                                ) : (
                                    <div className="productPrice">
                                        <p className="price">
                                            ₫
                                            {product.price?.toLocaleString(
                                                "vi-VN"
                                            )}
                                        </p>
                                    </div>
                                )}

                                <form className="productAttributes">
                                    <div className="productAttribute">
                                        <div className="attributeName">
                                            Màu Sắc:
                                        </div>
                                        <div className="attributes">
                                            {product.colors?.map(
                                                (color, index) => (
                                                    <div
                                                        key={index}
                                                        className="attribute color"
                                                        onClick={(e) =>
                                                            handleAttributes(
                                                                e.target,
                                                                "color",
                                                                index,
                                                                selectOps1
                                                            )
                                                        }
                                                    >
                                                        {color.color}
                                                        <span className="tick"></span>
                                                        <span className="tick1">
                                                            ✓
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                            {/* <div
                                                className="attribute"
                                                onClick={(e) =>
                                                    handleSelect(
                                                        e.target,
                                                        selectOps1
                                                    )
                                                }
                                            >
                                                Sóc nâu
                                                <span className="tick"></span>
                                                <span className="tick1">✓</span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="productAttribute">
                                        <div className="attributeName">
                                            Size:
                                        </div>
                                        <div className="attributes">
                                            {product.sizes?.map(
                                                (size, index) => (
                                                    <div
                                                        key={index}
                                                        className="attribute size"
                                                        onClick={(e) =>
                                                            handleAttributes(
                                                                e.target,
                                                                "size",
                                                                index,
                                                                selectOps1
                                                            )
                                                        }
                                                    >
                                                        {size.size}
                                                        <span className="tick"></span>
                                                        <span className="tick1">
                                                            ✓
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                            {/* <div
                                                className="attribute"
                                                onClick={(e) =>
                                                    handleSelect(
                                                        e.target,
                                                        selectOps1
                                                    )
                                                }
                                            >
                                                40
                                                <span className="tick"></span>
                                                <span className="tick1">✓</span>
                                            </div>
                                            <div
                                                className="attribute"
                                                onClick={(e) =>
                                                    handleSelect(
                                                        e.target,
                                                        selectOps1
                                                    )
                                                }
                                            >
                                                36
                                                <span className="tick"></span>
                                                <span className="tick1">✓</span>
                                            </div>
                                            <div
                                                className="attribute"
                                                onClick={(e) =>
                                                    handleSelect(
                                                        e.target,
                                                        selectOps1
                                                    )
                                                }
                                            >
                                                38
                                                <span className="tick"></span>
                                                <span className="tick1">✓</span>
                                            </div>
                                            <div
                                                className="attribute"
                                                onClick={(e) =>
                                                    handleSelect(
                                                        e.target,
                                                        selectOps1
                                                    )
                                                }
                                            >
                                                37
                                                <span className="tick"></span>
                                                <span className="tick1">✓</span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="productAttribute">
                                        <div className="attributeName">
                                            Số Lượng:
                                        </div>
                                        <div className="quantityBox">
                                            <div
                                                className="quantityButton"
                                                onClick={() =>
                                                    handleQuantityInput(
                                                        "subtract"
                                                    )
                                                }
                                            >
                                                -
                                            </div>
                                            <div className="quantityInput">
                                                <input
                                                    ref={quantityRef}
                                                    type="number"
                                                    min="0"
                                                    onChange={
                                                        handleQuantityChange
                                                    }
                                                ></input>
                                            </div>
                                            <div
                                                className="quantityButton"
                                                onClick={() =>
                                                    handleQuantityInput("add")
                                                }
                                            >
                                                +
                                            </div>
                                        </div>
                                        <p></p>
                                    </div>
                                    <div className="productBuy">
                                        <div className="addCart">
                                            <MdAddShoppingCart /> Thêm vào giỏ
                                            hàng
                                        </div>
                                        <button className="addCart buy">
                                            Mua ngay
                                        </button>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="reviews" xs={10}>
                        <div className="reviews-header">
                            <h3 className="reviews-header-title">
                                ĐÁNH GIÁ SẢN PHẨM
                            </h3>
                            <ReviewAddModal />
                        </div>
                        <div className="reviews-category">
                            <Row className="reviews-category-container">
                                <Col xs={2}>
                                    <h3 className="reviews-stars">
                                        <span>{data.avg_star}</span> trên 5
                                    </h3>
                                    {arrays.map((index) =>
                                        data.avg_star >= index ? (
                                            <BsStarFill
                                                key={index}
                                                className="rated"
                                            />
                                        ) : (
                                            <BsStar
                                                key={index}
                                                className="rated"
                                            />
                                        )
                                    )}
                                </Col>
                                <Col xs={10}>
                                    <div className="reviews-filters">
                                        <div
                                            className="filter active"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            Tất cả
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            5 Sao ({data.five_stars})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            4 Sao ({data.four_stars})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            3 Sao ({data.three_stars})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            2 Sao ({data.two_stars})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            1 Sao ({data.one_stars})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            Có Bình luận (
                                            {data.count_has_review})
                                        </div>
                                        <div
                                            className="filter"
                                            onClick={(e) =>
                                                handleSelect(
                                                    e.target,
                                                    selectOps2
                                                )
                                            }
                                        >
                                            Có hình ảnh / video (
                                            {data.count_has_media})
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {/* REVIEW */}
                        <div className="review">
                            {reviews?.map((review) => (
                                <Row key={review.id} className="review-item">
                                    <Col xs={1} className="avatar">
                                        <img
                                            className="review-avatar"
                                            src={review.avatar}
                                            alt="review-user"
                                        ></img>
                                    </Col>

                                    {/* REVIEW DETAIL */}
                                    <Col xs={11}>
                                        <div className="review-detail">
                                            <h5 className="review-userName">
                                                {review.user_name}
                                            </h5>
                                            <div className="review-stars">
                                                {arrays.map((index) =>
                                                    review.stars >= index ? (
                                                        <BsStarFill
                                                            key={index}
                                                        />
                                                    ) : (
                                                        <BsStar key={index} />
                                                    )
                                                )}
                                            </div>
                                            <p className="review-date">
                                                {review.created_at} | Phân loại
                                                hàng: {review.classify}
                                            </p>
                                            <div className="review-describe">
                                                {review.review_material ? (
                                                    <span>Chất liệu:</span>
                                                ) : null}
                                                {review.review_material}
                                            </div>
                                            <div className="review-describe">
                                                {review.correct_description ? (
                                                    <span>Đúng với mô tả:</span>
                                                ) : null}
                                                {review.correct_description}
                                            </div>
                                            <div className="review-describe">
                                                {review.review_color ? (
                                                    <span>Màu sắc:</span>
                                                ) : null}
                                                {review.review_color}
                                            </div>
                                            <div className="review-content">
                                                {review.content}
                                            </div>

                                            {/* REVIEW MEDIA */}
                                            <div className="review-medias">
                                                <div className="review-medias-navibar">
                                                    {review.medias?.map(
                                                        (media) => {
                                                            return media.type ===
                                                                1 ? (
                                                                <div
                                                                    className="media-item"
                                                                    key={
                                                                        media.id
                                                                    }
                                                                >
                                                                    <img
                                                                        className="media-src"
                                                                        src={
                                                                            media.url
                                                                        }
                                                                        alt="media"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleSelect(
                                                                                e.target,
                                                                                selectOps3
                                                                            )
                                                                        }
                                                                    ></img>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="media-item"
                                                                    key={
                                                                        media.id
                                                                    }
                                                                >
                                                                    <video
                                                                        className="media-src"
                                                                        src={
                                                                            media.url
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleSelect(
                                                                                e.target,
                                                                                selectOps3
                                                                            )
                                                                        }
                                                                    ></video>
                                                                    <svg
                                                                        enableBackground="new 0 0 15 15"
                                                                        viewBox="0 0 15 15"
                                                                        x="0"
                                                                        y="0"
                                                                        className="shopee-svg-icon-play "
                                                                    >
                                                                        <g opacity=".54">
                                                                            <g>
                                                                                <circle
                                                                                    cx="7.5"
                                                                                    cy="7.5"
                                                                                    fill="#040000"
                                                                                    r="7.3"
                                                                                ></circle>
                                                                                <path
                                                                                    d="m7.5.5c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7m0-.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5z"
                                                                                    fill="#ffffff"
                                                                                ></path>
                                                                            </g>
                                                                        </g>
                                                                        <path
                                                                            d="m6.1 5.1c0-.2.1-.3.3-.2l3.3 2.3c.2.1.2.3 0 .4l-3.3 2.4c-.2.1-.3.1-.3-.2z"
                                                                            fill="#ffffff"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                            {/* END REVIEW MEDIA */}

                                            <div className="review-like">
                                                <span>
                                                    {review.has_like ? (
                                                        <BiSolidLike
                                                            className="like active"
                                                            onClick={(e) =>
                                                                handleLike(
                                                                    e.target
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <BiSolidLike
                                                            className="like"
                                                            onClick={(e) =>
                                                                handleLike(
                                                                    e.target
                                                                )
                                                            }
                                                        />
                                                    )}
                                                    {review.like === 0
                                                        ? "Hữu ích?"
                                                        : review.like}
                                                </span>
                                                <div className="report">
                                                    <BsThreeDotsVertical />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    {/* END REVIEW DETAIL */}
                                </Row>
                            ))}
                            <div className="review-pagination">
                                <div
                                    className="button"
                                    onClick={handlePrevPages}
                                >
                                    {"<"}
                                </div>
                                {pageNumbers.map((page) => {
                                    if (page === currentPage) {
                                        return (
                                            <div
                                                key={page}
                                                className="page now"
                                                onClick={(e) =>
                                                    handlePages(e.target)
                                                }
                                            >
                                                {page}
                                            </div>
                                        );
                                    } else if (
                                        page >= currentPage + 5 ||
                                        page < currentPage
                                    ) {
                                        return (
                                            <div
                                                key={page}
                                                className="page hide"
                                            >
                                                {page}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={page}
                                                className="page"
                                                onClick={(e) =>
                                                    handlePages(e.target)
                                                }
                                            >
                                                {page}
                                            </div>
                                        );
                                    }
                                })}
                                <div className="page">...</div>
                                <div
                                    className="button"
                                    onClick={handleNextPages}
                                >
                                    {">"}
                                </div>
                            </div>
                        </div>
                        {/* END REVIEW */}
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </Container>
        </div>
    );
};
export default ProductDetail;
