import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const AddWarehouseIOs = () => {
    const [type, setType] = useState(0);
    const [packages, setPackages] = useState([]);

    // Dữ liệu hiển thị kho
    const [warehouses, setWarehouses] = useState([]);
    const [options, setOptions] = useState([]);

    // Danh sách phiếu nhập xuất kho
    const [warehouseIOs, setWarehouseIOs] = useState([]);

    // Người dùng hiện tại
    const [user, setUser] = useState("");

    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });

    // State xử lý reload lại danh sách WarehouseIOs
    const [reload, setReload] = useState(0);

    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/add-warehouse-io`;
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
                // Tải lại danh sách warehouseIOs
                setReload((prevReload) => prevReload + 1);

                handleReset();
            }
        }
    }, [msg]);

    useEffect(() => {
        console.log("reload: ", reload);
    }, [reload]);

    const handleReset = () => {
        setType(0);
        // reset select option warehouse
        document.querySelector('select[name="warehouse"]')[0].selected = true;
        let inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
            if (input.type === "text") {
                input.value = "";
            } else if (input.type === "number") {
                input.value = 0;
            }
        });
        setPackages([]);
    };

    // // Lấy danh sách phiếu nhập/xuất kho
    // const getWarehouseIOs = async () => {
    //     const res = await axios.get("http://localhost:8000/api/warehouseios");
    //     setWarehouseIOs(res.data.warehouseIOs);
    // };

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
                                            xs={4}
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
                                            xs={4}
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
                                            xs={4}
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
                                            xs={4}
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
                                            xs={4}
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
                                            xs={4}
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

                            <ListSKUs />
                            <ListWarehouseIOs reload={reload} />
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export const ListSKUs = () => {
    // Danh sách SKU
    const [skus, setSkus] = useState([]);
    // Danh sách tìm kiếm SKU
    const [nameSearchSkus, setNameSearchSkus] = useState([]);

    const handleSearch = (e) => {
        const nameSearch = e.target.value;

        let results = [];
        skus.forEach((sku) => {
            if (
                sku.sku.search(nameSearch) !== -1 ||
                sku.prodName.search(nameSearch) !== -1 ||
                sku.color.search(nameSearch) !== -1 ||
                sku.size.search(nameSearch) !== -1
            ) {
                results = [...results, sku];
            }
        });
        setNameSearchSkus(results);
        console.log(results);
    };

    // Lấy danh sách SKU
    const getSKUs = async () => {
        const res = await axios.get("http://localhost:8000/api/skus");
        setSkus(res.data.skus);
    };

    // Tải danh sách SKUs
    useEffect(() => {
        getSKUs();
    }, []);

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    Danh sách mã hàng hóa
                </h6>
                <div className="d-flex align-items-center">
                    <label className="m-1" htmlFor="nameSearch">
                        Tìm Kiếm:
                    </label>
                    <input
                        className="nameSearchSKU"
                        type="text"
                        id="nameSearch"
                        onChange={handleSearch}
                        placeholder="Nhập từ khóa..."
                    ></input>
                </div>
            </div>
            <div className="card-body">
                <table
                    className="table table-bordered mt-3"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th className="text-left">SKU</th>
                            <th className="text-left">Tên sản phẩm</th>
                            <th className="text-left">Màu sắc</th>
                            <th className="text-left">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nameSearchSkus.length === 0
                            ? !!skus &&
                              !!skus.length &&
                              skus.map((sku, index) => {
                                  return (
                                      <tr key={index}>
                                          <td className="text-center">
                                              {index + 1}
                                          </td>
                                          <td>{sku.sku}</td>
                                          <td>{sku.prodName}</td>
                                          <td>{sku.color}</td>
                                          <td>{sku.size}</td>
                                      </tr>
                                  );
                              })
                            : nameSearchSkus.map((sku, index) => {
                                  return (
                                      <tr key={index}>
                                          <td className="text-center">
                                              {index + 1}
                                          </td>
                                          <td>{sku.sku}</td>
                                          <td>{sku.prodName}</td>
                                          <td>{sku.color}</td>
                                          <td>{sku.size}</td>
                                      </tr>
                                  );
                              })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ListWarehouseIOs = ({ ...props }) => {
    // Danh sách phiếu nhập xuất kho
    const [warehouseIOs, setWarehouseIOs] = useState([]);

    // Lấy danh sách phiếu nhập/xuất kho
    const getWarehouseIOs = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouseios");
        setWarehouseIOs(res.data.warehouseIOs);
    };

    useEffect(() => {
        getWarehouseIOs();
    }, [props.reload]);

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    Lịch sử xuất / nhập kho hàng
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
                                <th className="text-left">Thời Gian</th>
                                <th className="text-left">Nhập / Xuất</th>
                                <th className="text-left">Người Yêu Cầu</th>
                                <th className="text-left">Người Phụ Trách</th>
                                <th className="text-left">Kho</th>
                                <th>Trạng thái</th>
                                <th style={{minWidth: '90px'}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!warehouseIOs &&
                                !!warehouseIOs.length &&
                                warehouseIOs.map((warehouseIO, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{warehouseIO.created_at}</td>
                                            <td>
                                                {warehouseIO.type === 0
                                                    ? "Nhập Kho"
                                                    : "Xuất Kho"}
                                            </td>
                                            <td>{warehouseIO.requestor}</td>
                                            <td>
                                                {warehouseIO.person_in_charge}
                                            </td>
                                            <td>{warehouseIO.warehouse}</td>
                                            <td>
                                                {warehouseIO.completed === 0
                                                    ? "Chưa Hoàn Thành"
                                                    : "Đã Hoàn Thành"}
                                            </td>
                                            <td>
                                                <Link
                                                    to={
                                                        "/admin/warehouses/io/edit?id=" +
                                                        warehouseIO.id
                                                    }
                                                    className="btn-action edit"
                                                >
                                                    Chi Tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Package = (props) => {
    const [sku, setSku] = useState("");
    const [nameSpecific, setNameSpecific] = useState("");

    const handleChange = (e) => {
        let value = e.target.value;
        setSku(value);
        getSkuData(value);
    };

    const getSkuData = async (skuParam) => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/products/colorsizes/${skuParam}`
            );
            console.log(res);
            if (res.data.status) {
                let name_specific = res.data.color_size.name_specific;
                setNameSpecific(name_specific ? name_specific : "");
            }
        } catch (error) {
            console.error(error);
            setNameSpecific("");
        }
    };

    return (
        <tr className="packages">
            <td
                style={{
                    paddingTop: "1.6rem",
                }}
            >
                {props.index + 1}
            </td>
            <td>
                <p>{nameSpecific}</p>
                <input
                    className="form-input"
                    type="hidden"
                    name={`name[]`}
                    value={nameSpecific}
                ></input>
                {/* Dép lông con sóc siêu cute xả khokho85k-85k sập giá, Sóc ghi, 39 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`sku[]`}
                    value={sku}
                    onChange={handleChange}
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
            <td></td>
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

export default AddWarehouseIOs;

export const Option = ({ ...props }) => {
    return <option value={props.value}>{props.label}</option>;
};
