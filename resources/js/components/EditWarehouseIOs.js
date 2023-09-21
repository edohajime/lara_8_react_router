import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import swal from "sweetalert";
import { ListSKUs } from "./AddWarehouseIOs";

const EditWarehouseIOs = () => {
    const [searchParams] = useSearchParams();
    const [packages, setPackages] = useState([]);

    const [warehouseIO, setWarehouseIO] = useState({});

    // Dữ liệu chuẩn bị cho đơn vị kho
    const [warehouses, setWarehouses] = useState([]);
    const [options, setOptions] = useState([]);

    // Danh sách SKU
    const [skus, setSkus] = useState([]);
    // Danh sách tìm kiếm SKU
    const [nameSearchSkus, setNameSearchSkus] = useState([]);

    const [user, setUser] = useState({});

    // State lưu trữ giá trị value của các trường nhập
    const [type, setType] = useState(0);
    const [according, setAccording] = useState("");
    const [number, setNumber] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [decider, setDecider] = useState("");
    const [cause, setCause] = useState("");
    const [requestor, setRequestor] = useState("");
    const [address, setAddress] = useState("");
    const [personInCharge, setPersonInCharge] = useState("");
    const [warehouse, setWarehouse] = useState(0);
    const [completed, setCompleted] = useState(0);

    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });
    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/api/warehouseios/${searchParams.get(
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
    };
    // Xử lý hiện thông báo
    useEffect(() => {
        console.log(msg.messages);
        if (msg.messages !== "") {
            handleAlert(msg.status, msg.messages);
        }
    }, [msg]);

    // Lấy danh sách kho
    const getWarehouses = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouses");
        setWarehouses(res.data.warehouses);
    };

    // Lấy thông tin phiếu nhập/xuất hiện tại
    const getWarehouseIO = async () => {
        const warehouseIOId = searchParams.get("id");
        const res = await axios.get(
            `http://localhost:8000/api/warehouseios/${warehouseIOId}`
        );
        setWarehouseIO(res.data.warehouseIO);
    };

    // Xử lý khi warehouseIO thay đổi
    useEffect(() => {
        // console.log(warehouseIO.type);
        setType(warehouseIO.type);
        if (warehouseIO.type === 0) {
            setAccording(warehouseIO.according);
            setNumber(warehouseIO.number);
            setDay(warehouseIO.day);
            setMonth(warehouseIO.month);
            setYear(warehouseIO.year);
            setDecider(warehouseIO.decider);
        } else {
            setCause(warehouseIO.cause);
            setAddress(warehouseIO.requestor_address);
        }
        setRequestor(warehouseIO.requestor);
        setPersonInCharge(warehouseIO.person_in_charge);
        setWarehouse(warehouseIO.warehouse);
        setCompleted(warehouseIO.completed);

        if (warehouseIO.packages) {
            warehouseIO.packages.map((item, index) => {
                addPackage(
                    index,
                    item.name,
                    item.sku,
                    item.unit,
                    item.quantity,
                    item.realQuantity,
                    item.price
                );
            });
        }
    }, [warehouseIO]);

    // Xử lý sự kiện onChange
    const handleChange = (e) => {
        if (e.target.name === "according") {
            setAccording(e.target.value);
        } else if (e.target.name === "number") {
            setNumber(e.target.value);
        } else if (e.target.name === "day") {
            setDay(e.target.value);
        } else if (e.target.name === "month") {
            setMonth(e.target.value);
        } else if (e.target.name === "year") {
            setYear(e.target.value);
        } else if (e.target.name === "decider") {
            setDecider(e.target.value);
        } else if (e.target.name === "cause") {
            setCause(e.target.value);
        } else if (e.target.name === "requestor") {
            setRequestor(e.target.value);
        } else if (e.target.name === "address") {
            setAddress(e.target.value);
        } else if (e.target.name === "person_in_charge") {
            setPersonInCharge(e.target.value);
        } else if (e.target.name === "warehouse") {
            setWarehouse(e.target.value);
        } else if (e.target.name === "completed") {
            setCompleted(e.target.value);
        }
    };

    const addPackage = (
        index = 0,
        name = "",
        sku = "",
        unit = "",
        quantity = 0,
        realQuantity = 0,
        price = 0
    ) => {
        // console.log(name);
        const newPackage = (
            <Package
                key={index === 0 ? packages.length : index}
                index={index === 0 ? packages.length : index}
                name={name}
                sku={sku}
                unit={unit}
                quantity={quantity}
                realQuantity={realQuantity}
                price={price}
            />
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

    // Lấy dữ liệu phiếu nhập/xuất hiện tại
    useEffect(() => {
        getWarehouseIO();
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
            <h1 className="h3 mb-4 text-gray-800">
                THÔNG TIN PHIẾU XUẤT / NHẬP KHO
            </h1>

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
                                        onClick={() => addPackage()}
                                    >
                                        Thêm
                                    </div>
                                    <div
                                        id="product-expand1"
                                        className="minus-item"
                                        onClick={() => removePackage()}
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
                                            {searchParams.get("id") ? (
                                                <select
                                                    className="form-input"
                                                    name="type"
                                                    id="type"
                                                    value={type}
                                                    onChange={handleChange}
                                                    readOnly
                                                >
                                                    <option value={0}>
                                                        Nhập Kho
                                                    </option>
                                                    <option value={1}>
                                                        Xuất Kho
                                                    </option>
                                                </select>
                                            ) : (
                                                <select
                                                    className="form-input"
                                                    name="type"
                                                    id="type"
                                                    value={type}
                                                >
                                                    <option value={0}>
                                                        Nhập Kho
                                                    </option>
                                                    <option value={1}>
                                                        Xuất Kho
                                                    </option>
                                                </select>
                                            )}
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
                                                value={according}
                                                onChange={handleChange}
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
                                                value={number}
                                                onChange={handleChange}
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
                                                value={day}
                                                onChange={handleChange}
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
                                                value={month}
                                                onChange={handleChange}
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
                                                value={year}
                                                onChange={handleChange}
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
                                                value={decider}
                                                onChange={handleChange}
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
                                                value={cause}
                                                onChange={handleChange}
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="requestor">
                                                Người yêu cầu:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="requestor"
                                                id="requestor"
                                                value={requestor}
                                                onChange={handleChange}
                                            ></input>
                                        </Col>
                                        <Col xs={6} className="export">
                                            <label htmlFor="address">
                                                Địa chỉ (người / đơn vị yêu
                                                cầu):
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="address"
                                                id="address"
                                                value={address}
                                                onChange={handleChange}
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="person_in_charge">
                                                Người phụ trách:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="person_in_charge"
                                                id="person_in_charge"
                                                min="0"
                                                value={personInCharge}
                                                onChange={handleChange}
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="warehouse">
                                                Đơn vị kho:
                                            </label>
                                            <select
                                                className="form-input"
                                                name="warehouse"
                                                id="warehouse"
                                                value={warehouse}
                                                onChange={handleChange}
                                            >
                                                {options}
                                            </select>
                                        </Col>
                                        {searchParams.get("id") ? (
                                            <Col xs={6}>
                                                <label htmlFor="completed">
                                                    Trạng thái:
                                                </label>
                                                <select
                                                    className="form-input"
                                                    name="completed"
                                                    id="completed"
                                                    value={completed}
                                                    onChange={handleChange}
                                                >
                                                    <option value={0}>
                                                        Chưa Hoàn Thành
                                                    </option>
                                                    <option value={1}>
                                                        Đã Hoàn Thành
                                                    </option>
                                                </select>
                                            </Col>
                                        ) : (
                                            ""
                                        )}
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
                                                to="/admin/warehouses/io"
                                            >
                                                Trở Về
                                            </Link>
                                            <button
                                                type="submit"
                                                className="add-button"
                                            >
                                                Cập Nhật
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            <ListSKUs />
                            {/* <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Danh sách SKU
                                    </h6>
                                    <div className="d-flex align-items-center">
                                        <label
                                            className="m-1"
                                            htmlFor="nameSearch"
                                        >
                                            Tìm Kiếm:
                                        </label>
                                        <input
                                            className="nameSearchSKU"
                                            type="text"
                                            id="nameSearch"
                                            onChange={handleSearch}
                                            placeholder="Nhập SKU"
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
                                                <th className="text-left">
                                                    SKU
                                                </th>
                                                <th className="text-left">
                                                    Tên sản phẩm
                                                </th>
                                                <th className="text-left">
                                                    Màu sắc
                                                </th>
                                                <th className="text-left">
                                                    Size
                                                </th>
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
                                                              <td>
                                                                  {sku.prodName}
                                                              </td>
                                                              <td>
                                                                  {sku.color}
                                                              </td>
                                                              <td>
                                                                  {sku.size}
                                                              </td>
                                                          </tr>
                                                      );
                                                  })
                                                : nameSearchSkus.map(
                                                      (sku, index) => {
                                                          return (
                                                              <tr key={index}>
                                                                  <td className="text-center">
                                                                      {index +
                                                                          1}
                                                                  </td>
                                                                  <td>
                                                                      {sku.sku}
                                                                  </td>
                                                                  <td>
                                                                      {
                                                                          sku.prodName
                                                                      }
                                                                  </td>
                                                                  <td>
                                                                      {
                                                                          sku.color
                                                                      }
                                                                  </td>
                                                                  <td>
                                                                      {sku.size}
                                                                  </td>
                                                              </tr>
                                                          );
                                                      }
                                                  )}
                                        </tbody>
                                    </table>
                                </div>
                            </div> */}
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const Package = (props) => {
    const [nameSpecific, setNameSpecific] = useState("");
    const [sku, setSku] = useState(props.sku);
    const [unit, setUnit] = useState(props.unit);
    const [quantity, setQuantity] = useState(props.quantity);
    const [realQuantity, setRealQuantity] = useState(props.realQuantity);
    const [price, setPrice] = useState(props.price);

    const handleChange = (e) => {
        if (e.target.name === "sku[]") {
            setSku(e.target.value);
            // Lấy dữ liệu mã hàng hóa
            getSkuData(e.target.value);
        } else if (e.target.name === "unit[]") {
            setUnit(e.target.value);
        } else if (e.target.name === "quantity[]") {
            setQuantity(Number(e.target.value));
        } else if (e.target.name === "real_quantity[]") {
            setRealQuantity(Number(e.target.value));
        } else if (e.target.name === "price[]") {
            setPrice(Number(e.target.value));
        }
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

    useEffect(() => {
        getSkuData(sku);
    }, []);

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
                    value={unit}
                    onChange={handleChange}
                ></input>
                {/* 1 đôi */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`quantity[]`}
                    value={quantity}
                    onChange={handleChange}
                ></input>
                {/* 300 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`real_quantity[]`}
                    value={realQuantity}
                    onChange={handleChange}
                ></input>
                {/* 300 */}
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`price[]`}
                    value={price}
                    onChange={handleChange}
                ></input>
                {/* 1700000 */}
            </td>
        </tr>
    );
};

export default EditWarehouseIOs;

const Option = ({ ...props }) => {
    return <option value={props.value}>{props.label}</option>;
};
