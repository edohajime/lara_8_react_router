import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const WarehouseIndex = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [user, setUser] = useState({});
    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });
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

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">DANH SÁCH KHO HÀNG</h1>

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
                                        Thêm kho hàng
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Row className="align-items-center">
                                        <Col xs={12}>
                                            <label
                                                htmlFor="type"
                                                title="Nội dung nằm trong thuộc tính src của thẻ iframe: <iframe src='...url-google-map'></iframe> khi chia sẻ vị trí trên Google Map. Chọn nhúng bản đồ để tạo ra thẻ iframe tương ứng."
                                            >
                                                URL Google Maps:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="location"
                                                id="location"
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
                                        Danh sách kho hàng
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
                                                        Tên kho hàng
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
                                                                                "/admin/warehouses"
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
            </Container>
        </div>
    );
};

export default WarehouseIndex;
