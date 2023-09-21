import axios from "axios";
import { IoMdAlert } from "react-icons/io";
import { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const AddWarehousejs = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [user, setUser] = useState({});
    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });
    const [show, setShow] = useState(false);

    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/add-warehouse`;
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
            getWarehouses();
            // if (msg.status) {
            //     handleReset();
            // }
        }
    }, [msg]);
    // Lấy danh sách kho
    const getWarehouses = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouses");
        setWarehouses(res.data.warehouses);
    };

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

    // Tải danh sách kho
    useEffect(() => {
        getWarehouses();
    }, []);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    
    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">DANH SÁCH KHO HÀNG HÓA</h1>

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
                                        Thêm kho hàng hóa
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Row className="align-items-center">
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
                                                required
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="type">
                                                Tên kho:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="code">
                                                Địa chỉ kho:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="address"
                                                id="address"
                                                required
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
                                                to="/admin"
                                            >
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
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Danh sách kho hàng hóa
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table
                                            className="table table-bordered"
                                            id="dataTable"
                                            width="100%"
                                            cellSpacing={0}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th className="text-left">
                                                        Tên kho
                                                    </th>
                                                    <th className="text-left">
                                                        Địa chỉ
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th>STT</th>
                                                    <th className="text-left">
                                                        Tên kho hàng
                                                    </th>
                                                    <th className="text-left">
                                                        Địa chỉ
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                {!!warehouses &&
                                                    !!warehouses.length &&
                                                    warehouses.map(
                                                        (warehouse, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouse.name
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouse.address
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Link
                                                                            to={
                                                                                "/admin/warehouses/edit?id=" + warehouse.id
                                                                            }
                                                                            className="btn-action edit"
                                                                        >
                                                                            Chi
                                                                            Tiết
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
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

export default AddWarehousejs;
