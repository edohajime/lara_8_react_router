import { Col, Container, Row } from "react-bootstrap";
import {
  BsStarFill,
  BsStarHalf,
  BsChevronRight,
  BsThreeDotsVertical,
  BsStar,
} from "react-icons/bs";
import { MdAddShoppingCart } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import ReviewAddModal from "./ReviewAddModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  let pos = 0;

  const [data, setData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const [filter, setFilter] = useState('all');

  // Xử lý sự kiện chuyển trang
  const handlePages = (e) => {
    let page = parseInt(e.innerHTML);
    setCurrentPage(page);
  }

  const handlePrevPages = () => {
    let page = currentPage;
    if (--page >= 1) {
      setCurrentPage(page);
    }
  }
  
  const handleNextPages = () => {
    let page = currentPage;
    let maxPage = Math.ceil(total / reviewsPerPage);
    if (++page <= maxPage) {
      setCurrentPage(page);
    }
  }


  // Lấy reviews, total reviews
  const getReviews = async (page, filt='all') => {
    let prodId = searchParams.get('product_id');
    let rpp = reviewsPerPage;
    if (filt === 'all') {
      try {
        const res = await axios.get(`http://localhost:8000/list-review?product_id=${prodId}&page=${page}&rpp=${rpp}`);
        setReviews(res.data.reviews);
        setTotal(res.data.total);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await axios.get(`http://localhost:8000/list-review?product_id=${prodId}&page=${page}&rpp=${rpp}&filter=${filt}`);
        setReviews(res.data.reviews);
        setTotal(res.data.total);
      } catch (error) {
        console.error(error);
      }
    }
    
  }

  useEffect(() => {
    console.log(reviews);
  }, [reviews])

  // Lấy Statistic Review
  const getStatisReviews = async () => {
    try {
      const prodId = searchParams.get('product_id');
      const res = await axios.get(`http://localhost:8000/statistic-review?product_id=${prodId}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getReviews(currentPage, filter);
  },[currentPage, filter])

  // Lấy Reviews data
  useEffect(() => {
    getStatisReviews();
  },[])

  // Lấy pageNumbers
  useEffect(() => {
    let arrPages = [];
    for (let i = 1; i <= Math.ceil(total / reviewsPerPage); i++) {
      arrPages.push(i);
    }
    setPageNumbers(arrPages);
  },[reviewsPerPage, total])

  const arrays = [1,2,3,4,5];

  // Xử lý sự kiện filter reviews
  const handleFilter = (filt='all') => {
    // Nếu filter = all thì ko cần phải bắt buộc có trong hàm gọi
    // Set lại page về 1 khi chuyển filter
    getReviews(1, filt);

    // cập nhật lại currentPage, filter
    setCurrentPage(1);
    setFilter(filt);
  }

  const handleSelect = (e, childClass, containerClass) => {
    let container = getParentNode(e, containerClass);
    let attributes = container.querySelectorAll("." + childClass);
    let isAgain = false;
    if (e.classList.contains("active")) {
      isAgain = true;
    }
    attributes.forEach((attribute) => {
      attribute.classList.remove("active");
    });

    if (!isAgain) {
      e.classList.add("active");
    }
  };

  const getParentNode = (e, className) => {
    let slides = e;
    while (!slides.classList.contains(className)) {
      slides = slides.parentNode;
    }
    return slides;
  };

  const ops1 = {
    slider: "listMedia",
    container: "mediaSlide-contain",
    cellSelector: ".mediaSlide-contain .mediaSlide-item",
    prevButton: "mediaSlide-prev",
    nextButton: "mediaSlide-next",
  };

  const handleNext = (e, ops) => {
    // Lấy listMedia, prev, next button, độ rộng của phần tử để chuyển slide
    let slides = getParentNode(e, ops.slider);
    let prev = slides.querySelector("." + ops.prevButton);
    let next = slides.querySelector("." + ops.nextButton);
    let itemWidth = slides.querySelector(ops.cellSelector).offsetWidth;

    // Lấy div.mediaSlide-contain
    slides = slides.querySelector("." + ops.container);

    // Biến cho biết đã gần cuối của listMedia
    let indexPos = slides.offsetWidth - slides.scrollWidth + itemWidth;

    if (pos > slides.offsetWidth - slides.scrollWidth) {
      // khi vị trí hiện tại đã gần cuối thì khi kích vào next sẽ disable nút next
      if (Math.abs(pos - indexPos) < 2) {
        next.classList.add("disable");
      }
      pos -= itemWidth;

      slides.style.transform = "translateX(" + pos + "px)";
      prev.classList.remove("disable");
    }
  };
  const handlePrev = (e, ops) => {
    // Lấy listMedia, prev, next button, độ rộng của phần tử để chuyển slide
    let slides = getParentNode(e, ops.slider);
    let prev = slides.querySelector("." + ops.prevButton);
    let next = slides.querySelector("." + ops.nextButton);
    let itemWidth = slides.querySelector(ops.cellSelector).offsetWidth;

    // Lấy div.mediaSlide-contain
    slides = slides.querySelector("." + ops.container);

    if (pos < 0) {
      // khi vị trí hiện tại đã gần vị trí đầu thì khi kích vào prev sẽ disable nút prev
      if (pos === -itemWidth) {
        prev.classList.add("disable");
      }
      pos += itemWidth;
      slides.style.transform = "translateX(" + pos + "px)";
      next.classList.remove("disable");
    }
  };

  const handleHover = (e, isHover) => {
    if (isHover) {
      if (e.tagName === "IMG") {
        let image = document.querySelector("#media.media .image");
        image.src = e.src;
      } else {
        let video = document.querySelector("#media.media .video");
        video.src = e.src;
      }
    } else {
      let image = document.querySelector("#media.media .image");
      image.src = "/images/productdetail-image.jpg";
    }
  };

  const handleLike = (e) => {
    let like = getParentNode(e, "like");
    if (like.classList.contains("active")) {
      like.classList.remove("active");
    } else {
      like.classList.add("active");
    }
  }

  return (
    <div className="productDetail">
      <Container>
        <div className="breadcumbs">
          <div className="brand">Shopee</div>
          <BsChevronRight />
          <div className="brand">Giày Dép Nam</div>
          <BsChevronRight />
          <div className="brand">Xăng-đan và Dép</div>
          <BsChevronRight />
          <div className="brand">Xăng-đan</div>
          <BsChevronRight />
          <div className="brand leaf ">
            Dép Quai ngang nam nữ bản 2023 trendy - Dép đi chơi thời trang
          </div>
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
                        src="/images/productdetail-image.jpg"
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
                        <div className="mediaSlide-item">
                          <img
                            className="mediaSlide-media"
                            src="/images/productdetail-image.jpg"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                        <div className="mediaSlide-item">
                          <video
                            className="mediaSlide-media"
                            src="/videos/productdetail-video.mp4"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
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
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                        <div className="mediaSlide-item">
                          <img
                            className="mediaSlide-media"
                            src="/images/productdetail-image3.jpg"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                        <div className="mediaSlide-item">
                          <img
                            className="mediaSlide-media"
                            src="/images/productdetail-image4.jpg"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                        <div className="mediaSlide-item">
                          <img
                            className="mediaSlide-media"
                            src="/images/productdetail-image5.jpg"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                        <div className="mediaSlide-item">
                          <img
                            className="mediaSlide-media"
                            src="/images/productdetail-image6.jpg"
                            alt="product"
                            onMouseOver={(e) => handleHover(e.target, true)}
                            onMouseOut={(e) => handleHover(e.target, false)}
                            onClick={(e) =>
                              handleSelect(
                                e.target,
                                "mediaSlide-media",
                                "mediaSlide-contain"
                              )
                            }
                          ></img>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mediaSlide-prev disable"
                      onClick={(e) => {
                        handlePrev(e.target, ops1);
                      }}
                    >
                      <img src="/images/chepvon-left-icon.jpg" alt="left"></img>
                    </div>
                    <div
                      className="mediaSlide-next"
                      onClick={(e) => {
                        handleNext(e.target, ops1);
                      }}
                    >
                      <img
                        src="/images/chepvon-right-icon.jpg"
                        alt="right"
                      ></img>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={7} className="productInfo">
                <h3 className="productName">
                  Dép Quai ngang nam nữ bản 2023 trendy - Dép đi chơi thời trang
                </h3>
                <div className="summary">
                  <div className="d-flex">
                    <div className="d-flex item">
                      <p className="underline rate">{data.avg_star}</p>
                      {
                        arrays.map(
                          (index) => {
                            if (data.avg_star - (index-1) >= 1) {
                              return <BsStarFill key={index} className="rated" />
                            } else if (data.avg_star - (index-1) >= 0) {
                              return <BsStarHalf key={index} className="rated" />
                            } else if (data.avg_star - (index-1) < 0) {
                              return <BsStar key={index} className="rated" />
                            }
                          }
                        )
                      }
                    </div>
                    <div className="item">|</div>
                    <div className="d-flex item">
                      <p className="underline">{data.total}</p>
                      <h4>Đánh giá</h4>
                    </div>
                    <div className="item">|</div>
                    <div className="d-flex item">
                      <p>8,2k</p>
                      <h4>Đã bán</h4>
                    </div>
                  </div>
                  <h4>Tố cáo</h4>
                </div>
                <div className="productPrice">
                  <p className="price">
                    <span>₫170.000</span> ₫85.000
                  </p>
                  <div className="sale">50% GIẢM</div>
                </div>
                <form className="productAttributes">
                  <div className="productAttribute">
                    <div className="attributeName">Màu Sắc:</div>
                    <div className="attributes">
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        Sóc ghi
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        Sóc nâu
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                    </div>
                  </div>
                  <div className="productAttribute">
                    <div className="attributeName">Size:</div>
                    <div className="attributes">
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        39
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        40
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        36
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        38
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                      <div
                        className="attribute"
                        onClick={(e) =>
                          handleSelect(e.target, "attribute", "attributes")
                        }
                      >
                        37
                        <span className="tick"></span>
                        <span className="tick1">✓</span>
                      </div>
                    </div>
                  </div>
                  <div className="productAttribute">
                    <div className="attributeName">Số Lượng:</div>
                    <div className="quantityBox">
                      <div className="quantityButton">-</div>
                      <div className="quantityInput">
                        <input type="number" min="0"></input>
                      </div>
                      <div className="quantityButton">+</div>
                    </div>
                    <p>5188 sản phẩm có sẵn</p>
                  </div>
                  <div className="productBuy">
                    <div className="addCart">
                      <MdAddShoppingCart /> Thêm vào giỏ hàng
                    </div>
                    <button className="addCart buy">Mua ngay</button>
                  </div>
                </form>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="reviews" xs={10}>
            <div className="reviews-header">
              <h3 className="reviews-header-title">ĐÁNH GIÁ SẢN PHẨM</h3>
              <ReviewAddModal />
            </div>
            <div className="reviews-category">
              <Row className="reviews-category-container">
                <Col xs={2}>
                  <h3 className="reviews-stars">
                    <span>{data.avg_star}</span> trên 5
                  </h3>
                  {
                    arrays.map(
                      (index) => {
                        if (data.avg_star - (index-1) >= 1) {
                          return <BsStarFill key={index} className="rated" />
                        } else if (data.avg_star - (index-1) >= 0) {
                          return <BsStarHalf key={index} className="rated" />
                        } else if (data.avg_star - (index-1) < 0) {
                          return <BsStar key={index} className="rated" />
                        }
                      }
                    )
                  }
                </Col>
                <Col xs={10}>
                  <div className="reviews-filters">
                    <div
                      className="filter active"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter();
                        }
                      }
                    >
                      Tất cả
                    </div>
                    <div
                      className="filter"
                      onClick={(e) => 
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('5');
                        }
                      }
                    >
                      5 Sao ({data.five_stars})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) => 
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('4');
                        }
                      }
                    >
                      4 Sao ({data.four_stars})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('3');
                        }
                      }
                    >
                      3 Sao ({data.three_stars})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('2');
                        }
                      }
                    >
                      2 Sao ({data.two_stars})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('1');
                        }
                      }
                    >
                      1 Sao ({data.one_stars})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('has_review');
                        }
                      }
                    >
                      Có Bình luận ({data.count_has_review})
                    </div>
                    <div
                      className="filter"
                      onClick={(e) =>
                        {
                          handleSelect(e.target, "filter", "reviews-filters");
                          handleFilter('has_media');
                        }
                      }
                    >
                      Có hình ảnh / video ({data.count_has_media})
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {/* REVIEW */}
            <div className="review">
              {
                reviews?.map((review) => 
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
                        <h5 className="review-userName">{review.user_name}</h5>
                        <div className="review-stars">
                        {
                          arrays.map((index) => 
                            review.stars >= index ? (
                              <BsStarFill key={index} />
                            ) : (
                              <BsStar key={index} />
                            )
                          )
                        }
                        </div>
                        <p className="review-date">
                          {review.created_at} | Phân loại hàng: {review.classify}
                        </p>
                        <div className="review-describe">
                          {
                            review.review_material? (
                              <span>Chất liệu:</span>
                            ) : (null)
                          }
                          {review.review_material}
                        </div>
                        <div className="review-describe">
                          {
                            review.correct_description? (
                              <span>Đúng với mô tả:</span>
                            ) : (null)
                          }
                          {review.correct_description}
                        </div>
                        <div className="review-describe">
                          {
                            review.review_color? (
                              <span>Màu sắc:</span>
                            ) : (null)
                          }
                          {review.review_color}
                        </div>
                        <div className="review-content">{review.content}</div>
          
                        {/* REVIEW MEDIA */}
                        <div className="review-medias">
                          <div className="review-medias-navibar">
                            {
                              review.medias?.map((media) => {
                                return media.type === 1 ? (
                                  <div className="media-item" key={media.id}>
                                    <img
                                      className="media-src"
                                      src={media.url}
                                      alt="media"
                                      onClick={(e) =>
                                        handleSelect(
                                          e.target,
                                          "media-src",
                                          "review-medias-navibar"
                                        )
                                      }
                                    ></img>
                                  </div>
                                ) : (
                                  <div className="media-item" key={media.id}>
                                    <video
                                      className="media-src"
                                      src={media.url}
                                      onClick={(e) =>
                                        handleSelect(
                                          e.target,
                                          "media-src",
                                          "review-medias-navibar"
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
                                      <g 
                                        opacity=".54"
                                      >
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
                                
                              )
                            }
                          </div>
                        </div>
                        {/* END REVIEW MEDIA */}
          
                        <div className="review-like">
                          <span>
                            {
                              review.has_like? (
                                <BiSolidLike className="like active" onClick={(e) => handleLike(e.target)} />
                              ) : (
                                <BiSolidLike className="like" onClick={(e) => handleLike(e.target)} />
                              )
                            }
                            {
                              review.like === 0 ? "Hữu ích?" : review.like
                            }
                          </span>
                          <div className="report">
                            <BsThreeDotsVertical />
                          </div>
                        </div>
                      </div>
                    </Col>
                    {/* END REVIEW DETAIL */}
                  </Row>
                )
              }
              <div className="review-pagination">
                <div className="button" onClick={handlePrevPages}>{"<"}</div>
                {
                  pageNumbers.map(
                    (page) => {
                      if (page === currentPage) {
                        return <div key={page} className="page now" onClick={(e) => handlePages(e.target)}>{page}</div>
                      } else if (page >= currentPage + 5 || page < currentPage) {
                        return <div key={page} className="page hide">{page}</div>
                      } else {
                        return <div key={page} className="page" onClick={(e) => handlePages(e.target)}>{page}</div>
                      }
                    }
                  )
                }
                <div className="page">...</div>
                <div className="button" onClick={handleNextPages}>{">"}</div>
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
