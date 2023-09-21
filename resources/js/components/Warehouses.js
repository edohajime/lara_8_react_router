import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Warehouses = () => {
    const [type, setType] = useState(0);
    const [packages, setPackages] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [options, setOptions] = useState([]);
    // const [data, setData] = useState([
    //     {
    //         type: "Nhập",
    //         requestor: "Nguyễn Xuân Thịnh",
    //         status: "Đã Hoàn Thành",
    //         warehouse: "Kho Sóc Sơn, Hà Nội",
    //         staff: "Trần Mạnh Hưng",
    //         date: "07-27-2023",
    //     },
    //     {
    //         type: "Nhập",
    //         requestor: "Nguyễn Xuân Thịnh",
    //         status: "Chưa Hoàn Thành",
    //         warehouse: "Kho Sóc Sơn, Hà Nội",
    //         staff: "Trần Mạnh Hưng",
    //         date: "08-29-2023",
    //     },
    // ]);
    const [warehouseIOs, setWarehouseIOs] = useState([]);

    const [user, setUser] = useState("");

    // Lấy danh sách phiếu nhập/xuất kho
    const getWarehouseIOs = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouse-ios");
        setWarehouseIOs(res.data.warehouseIOs);
    };

    // Lấy danh sách kho
    const getWarehouses = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouses");
        setWarehouses(res.data.warehouses);
    };

    // Xử lý sự kiện chuyển loại phiếu
    const handleChange = (e) => {
        setType(Number(e.target.value));
    };

    const addPackage = () => {
        const newPackage = (
            <Package key={packages.length} index={packages.length} />
        );
        setPackages((prevPackages) => [...prevPackages, newPackage]);
        document.getElementById("form-button").style.display = "flex";
        document.getElementById("form-button").style.justifyContent =
            "flex-end";
    };
    const removePackage = () => {
        if (packages.length > 0) {
            const updatePackages = [...packages];
            updatePackages.pop();
            setPackages(updatePackages);
        }
        if (packages.length === 1) {
            document.getElementById("form-button").style.display = "none";
        }
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

    useEffect(() => {
        getWarehouseIOs();
    }, []);

    // Đổ dữ liệu kho vào select options
    useEffect(() => {
        let opsItems = [];
        warehouses.forEach((warehouse, index) => {
            opsItems = [
                ...opsItems,
                <Option
                    key={index}
                    label={warehouse.name}
                    value={warehouse.value}
                />,
            ];
        });
        setOptions(opsItems);
    }, [warehouses]);

    // Xử lý sau sự kiện changeType
    useEffect(() => {
        const inputImports = document.querySelectorAll("div.import");
        const inputExports = document.querySelectorAll("div.export");

        console.log(typeof type);
        //0 = Nhập
        inputImports.forEach((inputImport) => {
            if (type === 0) {
                inputImport.querySelector("input").disabled = false;
                inputImport.classList.remove("d-none");
            } else {
                inputImport.querySelector("input").disabled = true;
                inputImport.classList.add("d-none");
            }
        });
        inputExports.forEach((inputExport) => {
            if (type === 0) {
                inputExport.querySelector("input").disabled = true;
                inputExport.classList.add("d-none");
            } else {
                inputExport.querySelector("input").disabled = false;
                inputExport.classList.remove("d-none");
            }
        });
    }, [type]);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">XUẤT / NHẬP KHO SẢN PHẨM</h1>

            {/* Content Row */}
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <form
                            method="post"
                            action="/add-warehouse-io"
                            encType="multipart/form-data"
                        >
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
                                        Phiếu xuất / nhập kho
                                    </h6>
                                    <div
                                        id="product-expand1"
                                        onClick={addPackage}
                                    >
                                        Thêm
                                    </div>
                                    <div
                                        id="product-expand1"
                                        className="minus-item"
                                        onClick={removePackage}
                                    >
                                        Xóa
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Row>
                                        <Col xs={12}>
                                            <label htmlFor="type">
                                                Loại phiếu:
                                            </label>
                                            <select
                                                className="form-input"
                                                name="type"
                                                id="type"
                                                onChange={handleChange}
                                            >
                                                <option value={0}>
                                                    Nhập Kho
                                                </option>
                                                <option value={1}>
                                                    Xuất Kho
                                                </option>
                                            </select>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="according">
                                                Theo:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="according"
                                                id="according"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="number">Số:</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="number"
                                                id="number"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="day">Ngày:</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="day"
                                                id="day"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="month">
                                                Tháng:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="month"
                                                id="month"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="year">Năm:</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="year"
                                                id="year"
                                            ></input>
                                        </Col>
                                        <Col
                                            xs={2}
                                            className="gap-2 import"
                                            style={{ display: "flex" }}
                                        >
                                            <label htmlFor="decider">
                                                Của:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="decider"
                                                id="decider"
                                            ></input>
                                        </Col>
                                        <Col xs={12} className="export d-none">
                                            <label htmlFor="cause">
                                                Lý do:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="cause"
                                                id="cause"
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="code">
                                                Người yêu cầu:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="requestor"
                                                id="requestor"
                                            ></input>
                                        </Col>
                                        <Col xs={6} className="export">
                                            <label htmlFor="code">
                                                Địa chỉ (người / đơn vị yêu
                                                cầu):
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="address"
                                                id="address"
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="price">
                                                Người phụ trách:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="person_in_charge"
                                                id="person_in_charge"
                                                min="0"
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="price">
                                                Đơn vị kho:
                                            </label>
                                            <select
                                                className="form-input"
                                                name="warehouse"
                                                id="warehouse"
                                            >
                                                {options}
                                            </select>
                                        </Col>
                                        <Col xs={12}>
                                            <table
                                                className="table table-bordered mt-3"
                                                id="dataTable"
                                                width="100%"
                                                cellSpacing={0}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th rowSpan={2}>STT</th>
                                                        <th
                                                            rowSpan={2}
                                                            style={{
                                                                minWidth:
                                                                    "22vw",
                                                            }}
                                                        >
                                                            Tên, nhãn hiệu
                                                        </th>
                                                        <th rowSpan={2}>
                                                            Mã số
                                                        </th>
                                                        <th rowSpan={2}>
                                                            Đơn vị tính
                                                        </th>
                                                        <th colSpan={2}>
                                                            Số lượng
                                                        </th>
                                                        <th rowSpan={2}>
                                                            Đơn giá
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th>Ước tính</th>
                                                        <th>Thực nhập</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{packages}</tbody>
                                            </table>
                                        </Col>

                                        <Col
                                            xs={12}
                                            className="text-end mt-3"
                                            id="form-button"
                                            style={{
                                                display: "none",
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
                                        Lịch sử xuất / nhập kho hàng
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {/* <Row>
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
                                    </Row> */}
                                    <div className="table-responsive">
                                        <table
                                            className="table table-bordered"
                                            id="dataTable"
                                            width="100%"
                                            cellSpacing={0}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Thời Gian</th>
                                                    <th>Nhập / Xuất</th>
                                                    <th>Người Yêu Cầu</th>
                                                    <th>Người Phụ Trách</th>
                                                    <th>Kho</th>
                                                    <th>Trạng thái</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th>Thời Gian</th>
                                                    <th>Nhập / Xuất</th>
                                                    <th>Người Yêu Cầu</th>
                                                    <th>Người Phụ Trách</th>
                                                    <th>Kho</th>
                                                    <th>Trạng thái</th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                {!!warehouseIOs &&
                                                    !!warehouseIOs.length &&
                                                    warehouseIOs.map(
                                                        (
                                                            warehouseIO,
                                                            index
                                                        ) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {
                                                                            warehouseIO.created_at
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {warehouseIO.type ===
                                                                        0
                                                                            ? "Nhập Kho"
                                                                            : "Xuất Kho"}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouseIO.requestor
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouseIO.person_in_charge
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouseIO.warehouse
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {warehouseIO.completed ===
                                                                        0
                                                                            ? "Chưa Hoàn Thành"
                                                                            : "Đã Hoàn Thành"}
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={
                                                                                "/admin/warehouses/io?id=" +
                                                                                warehouseIO.id
                                                                            }
                                                                            className="btn-action edit"
                                                                        >
                                                                            Chi Tiết
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

const Package = (props) => {
    return (
        <tr>
            <td
                style={{
                    paddingTop: "1.6rem",
                }}
            >
                {props.index + 1}
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`name[]`}
                ></input>
                {/* Dép lông con sóc siêu cute xả khokho85k-85k sập giá, Sóc ghi, 39 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`sku[]`}
                ></input>
                {/* SDJDSI152023SG39 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`unit[]`}
                ></input>
                {/* 1 đôi */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`quantity[]`}
                ></input>
                {/* 300 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`real_quantity[]`}
                ></input>
                {/* 300 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`price[]`}
                ></input>
                {/* 1700000 */}
            </td>
        </tr>
    );
};

export default Warehouses;

const Option = ({ ...props }) => {
    return <option value={props.value}>{props.label}</option>;
};
