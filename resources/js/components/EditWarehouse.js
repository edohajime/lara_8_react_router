import axios from "axios";
import { IoMdAlert } from "react-icons/io";
import { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const EditWarehouse = () => {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState({});
    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });
    const [warehouse, setWarehouse] = useState({
        name: "",
        location: "",
        address: "",
    });
    const [show, setShow] = useState(false);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "address") {
            setAddress(e.target.value);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/api/warehouses/${searchParams.get(
            "id"
        )}`;
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
        getWarehouse();
    };

    const getWarehouse = async () => {
        const res = await axios.get(
            `http://localhost:8000/api/warehouses/${searchParams.get("id")}`
        );

        setWarehouse(res.data);
    };

    // Lấy dữ liệu kho hàng
    useEffect(() => {
        getWarehouse();
    }, []);

    // Load các trường nhập
    useEffect(() => {
        // Không load trường định vị
        setName(warehouse.name);
        setAddress(warehouse.address);
    }, [warehouse]);

    // Xử lý hiện thông báo
    useEffect(() => {
        console.log(msg.messages);
        if (msg.messages !== "") {
            handleAlert(msg.status, msg.messages);
            // getWarehouses();
        }
    }, [msg]);

    // Lấy thông tin ID user staff hiện tại
    useEffect(() => {
        axios
            .get("http://localhost:8000/data")
            .then((response) => {
                setUser(response.data.user);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            });
    }, []);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">THÔNG TIN KHO HÀNG HÓA</h1>

            {/* Content Row */}
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <input
                                type="hidden"
                                name="staff_id"
                                value={user.id}
                            />

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Thông tin kho hàng hóa
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Row className="align-items-center">
                                        <Col xs={6} className="mt-2">
                                            <iframe
                                                src={warehouse.location}
                                                width="100%"
                                                height="300"
                                                style={{
                                                    border: "0",
                                                    boxShadow:
                                                        "0 0.15rem 1.75rem 0 rgba(58, 59, 69, .15)",
                                                }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="name">
                                                Tên kho:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={name}
                                                onChange={handleChange}
                                                required
                                            ></input>
                                            <label htmlFor="address">
                                                Địa chỉ kho:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="address"
                                                id="address"
                                                value={address}
                                                onChange={handleChange}
                                                required
                                            ></input>
                                        </Col>
                                        <Col xs={12}>
                                            <label htmlFor="location">
                                                Định vị trên bản đồ:
                                                <div
                                                    className="d-flex align-items-center"
                                                    style={{cursor: "pointer"}}
                                                    onClick={handleShow}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: ".9rem",
                                                            margin: "0 3px 0 0",
                                                            color: "#3b61d1",
                                                        }}
                                                    >
                                                        Hướng dẫn lấy thông tin
                                                        vị trí!
                                                    </p>
                                                    <IoMdAlert
                                                        className="add-info-icon"
                                                        style={{
                                                            color: "#3b61d1",
                                                            fontSize: "1.3rem",
                                                        }}
                                                        title="Hướng dẫn lấy thông tin vị trí"
                                                    />
                                                </div>
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="location"
                                                id="location"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={12}
                                            className="text-end mt-3"
                                            id="form-button"
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Link
                                                className="cancel-button"
                                                to="/admin/warehouses/"
                                            >
                                                Trở về
                                            </Link>
                                            <button
                                                type="submit"
                                                className="add-button"
                                            >
                                                Cập nhật
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
                <Modal className="add-info" show={show} onHide={handleClose}>
                    <Modal.Header>
                        <h5>Hướng dẫn lấy định vị trên bản đồ</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>
                            Để lấy thông tin định vị của kho trên bản đồ, thực
                            hiện theo các bước sau đây:
                        </h5>
                        <p>
                            <b>Bước 1:</b> Vào trang web của Google Maps, chọn
                            địa điểm muốn lưu vị trí và chọn "Chia sẻ"
                        </p>
                        <img
                            src="/storage/webs/googlemap1.png"
                            alt="googlemap"
                        />
                        <p>
                            <b>Bước 2:</b> Chọn vào nhúng bản đồ để tạo ra thẻ
                            iframe tương ứng.
                        </p>
                        <img
                            src="/storage/webs/googlemap2.png"
                            alt="googlemap"
                        />
                        <p>
                            <b>Bước 3:</b> Chọn "Sao chép HTML" để lấy thông tin
                            vị trí sau đó dán vào trường nhập
                        </p>
                        <img
                            src="/storage/webs/googlemap3.png"
                            alt="googlemap"
                        />
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default EditWarehouse;
