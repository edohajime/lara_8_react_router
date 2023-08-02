import axios from "axios";
import "../../css/add-review.css";
import { useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FaCamera, FaVideo } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const ReviewAddModal = () => {  
  const [searchParams] = useSearchParams();
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [star, setStar] = useState({
    stars: 5,
    reaction: "Tuyệt vời",
  });

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleButtonClick = (type) => {
    if (type === "image") {
      imageRef.current.click();
    } else if (type === "video"){
      videoRef.current.click();
    }
  }
  const handleFileChange = (e) => {
    const images = Array.from(imageRef.current.files);
    const videos = Array.from(videoRef.current.files);
    const medias = images.concat(videos);
    setSelectedFiles(medias);
    console.log(medias);
  }

  const arrays = [1, 2, 3, 4, 5];

  const handleStars = (index) => {
    let title = "";
    if (index === 1) {
      title = "Tệ";
    } else if (index === 2) {
      title = "Kém";
    } else if (index === 3) {
      title = "Trung bình";
    } else if (index === 4) {
      title = "Tốt";
    } else if (index === 5) {
      title = "Tuyệt vời";
    }

    setStar({
      stars: index,
      reaction: title,
    });
  };

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  return (
    <>
      <div className="reviewAdd-button" onClick={handleShow}>Đánh giá</div>
      <Modal className="reviewAdd-modal" show={show}>
        <Modal.Header>
          <h5>Đánh giá sản phẩm</h5>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form method="post" action="/add-review" encType="multipart/form-data">
              <input type="hidden" name="_token" value={csrfToken} />
              <input type="hidden" name="size_id" value={searchParams.get("sizeId")} />              
              <div className="reviewAdd-body">
                <Row>
                  <Col className="product-thumb" xs={1}>
                    <img
                      src="/images/productdetail-image.jpg"
                      alt="product.jpg"
                    ></img>
                  </Col>
                  <Col xs={11}>
                    <h5 className="review-productName">
                      Dép Quai ngang nam nữ bản 2023 trendy - Dép đi chơi thời
                      trang
                    </h5>
                    <h5 className="review-classify">
                      Phân loại hàng: Sóc ghi, 39
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="product-quality">
                      <span className="product-quality-title">
                        Chất lượng sản phẩm
                      </span>
                      <div className="review-stars">
                        {arrays.map((index) => {
                          return star.stars >= index ? (
                            <BsStarFill key={index} onClick={() => handleStars(index)} />
                          ) : (
                            <BsStar key={index} onClick={() => handleStars(index)} />
                          );
                        })}

                        <span className="review-stars-title">
                          {star.reaction}
                        </span>
                      </div>
                      <input type="hidden" name="stars" value={star.stars}></input>
                    </div>
                  </Col>
                </Row>
                <Row className="review-content">
                  <Col>
                    <div className="review-content-container">
                      <div className="review-label">Đúng với mô tả:</div>
                      <input
                        className="review-input-text"
                        type="text"
                        name="correct_description"
                        placeholder="để lại đánh giá"
                      ></input>
                      <div className="review-label">Màu sắc:</div>
                      <input
                        className="review-input-text"
                        type="text"
                        name="review_color"
                        placeholder="để lại đánh giá"
                      ></input>
                      <div className="review-label">Chất liệu:</div>
                      <input
                        className="review-input-text"
                        type="text"
                        name="review_material"
                        placeholder="để lại đánh giá"
                      ></input>
                      <hr />
                      <textarea
                        className="review-input-textarea"
                        name="content"
                        placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé"
                      ></textarea>
                      <div className="review-input-medias">
                        {
                          selectedFiles.map((file, index) => (
                            file.type.startsWith('image') ? (
                              <div className="medias-item-border" key={index} >
                                <img 
                                  className="medias-item" 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Selected file ${index + 1}`} 
                                />
                              </div>
                            ) : (
                              <div className="medias-item-border" key={index} >
                                <video
                                  className="medias-item" 
                                  src={URL.createObjectURL(file)}
                                ></video>
                              </div>
                            )
                          ))
                        
                        }
                      </div>
                    </div>
                    <div className="review-add-medias">
                      <div className="add-medias-button" onClick={() => handleButtonClick("image")}>
                        <FaCamera /> Thêm Hình ảnh
                      </div>
                      <input 
                        ref={imageRef} 
                        type="file" 
                        multiple 
                        accept="image/*"
                        name="review_images[]"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e)}
                      ></input>
                      <div className="add-medias-button" onClick={() => handleButtonClick("video")}>
                        <FaVideo /> Thêm Video
                      </div>
                      <input 
                        ref={videoRef} 
                        type="file" 
                        multiple 
                        accept="video/mp4"
                        name="review_videos[]"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e)}
                      ></input>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="review-showName">
                      <input
                        type="checkbox"
                        id="showName"
                        name="show_name"
                        value="1"
                      ></input>
                      <div>
                        <label
                          className="review-showName-title"
                          htmlFor="showName"
                        >
                          Hiển thị tên đăng nhập trên đánh giá này
                        </label>
                        <h5 className="review-showName-note">
                          Tên tài khoản sẽ được hiển thị như tuananh16122000
                        </h5>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h5 className="review-service-title">Về Dịch vụ</h5>
                    <div className="service product-quality">
                      <span className="product-quality-title">
                        Dịch vụ của người bán
                      </span>
                      <div className="review-stars">
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <span className="review-stars-title">Tuyệt vời</span>
                      </div>
                    </div>

                    <div className="service product-quality">
                      <span className="product-quality-title">
                        Dịch vụ vận chuyển
                      </span>
                      <div className="review-stars">
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <span className="review-stars-title">Tuyệt vời</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col>
                  <div className="reviewAdd-footer">
                    <div className="review-back" onClick={handleClose}>
                      TRỞ LẠI
                    </div>
                    <button className="review-add-button" type="submit">
                      Hoàn Thành
                    </button>
                  </div>
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ReviewAddModal;
