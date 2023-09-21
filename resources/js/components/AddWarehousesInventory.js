import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ListSKUs } from "./AddWarehouseIOs";

const AddWarehousesInventory = () => {
    const [inventorys, setInventorys] = useState([]);

    // Dữ liệu hiển thị kho
    const [warehouses, setWarehouses] = useState([]);
    const [options, setOptions] = useState([]);

    // Danh sách phiếu kiểm kê kho
    const [warehouseInventories, setWarehouseInventories] = useState([]);

    // State lưu trữ giá trị value của các trường nhập
    const [warehouse, setWarehouse] = useState(0);

    // Người dùng hiện tại
    const [user, setUser] = useState("");

    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });
    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/add-warehouse-inventory`;
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
            getWarehouseInventories();
            if (msg.status) {
                handleReset();
            }
        }
    }, [msg]);

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
        setInventorys([]);
    };

    const handleChange = (e) => {
        setWarehouse(e.target.value);
    };

    // Lấy danh sách phiếu kiểm kê kho
    const getWarehouseInventories = async () => {
        const res = await axios.get(
            "http://localhost:8000/api/warehouseinventories"
        );
        setWarehouseInventories(res.data.warehouseInventories);
    };

    // Lấy danh sách kho
    const getWarehouses = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouses");
        setWarehouses(res.data.warehouses);
    };

    const addInventory = (warehouseParam = "") => {
        const newInventory = (
            <Inventory
                key={inventorys.length}
                index={inventorys.length}
                warehouseParam={warehouseParam}
            />
        );
        setInventorys((prevInventorys) => [...prevInventorys, newInventory]);
        document.getElementById("form-button").style.display = "flex";
        document.getElementById("form-button").style.justifyContent =
            "flex-end";
    };
    const removeInventory = () => {
        if (inventorys.length > 0) {
            const updateInventorys = [...inventorys];
            updateInventorys.pop();
            setInventorys(updateInventorys);
        }
        if (inventorys.length === 1) {
            document.getElementById("form-button").style.display = "none";
        }
    };

    // Xử lý khi warehouse thay đổi
    useEffect(() => {
        updateInventories(warehouse);
    }, [warehouse]);

    /**
     * Cập nhật lại inventory khi warehouse thay đổi (cụ thể là số lượng ước tính)
     * Vì số lượng ước tính này là số lượng của loại hàng trong kho hiện tại chứ không phải tất cả
     * @param {*} warehouseParam
     */
    const updateInventories = async (warehouseParam) => {
        setInventorys([]);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (warehouseInventory.inventories) {
            warehouseInventory.inventories.map((inventory, index) => {
                addInventory(
                    index,
                    inventory.name,
                    inventory.sku,
                    inventory.unit,
                    inventory.quantity,
                    inventory.realQuantity,
                    inventory.price,
                    inventory.quality,
                    warehouseParam
                );
            });
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

    // Tải danh sách kiểm kê kho
    useEffect(() => {
        getWarehouseInventories();
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

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-4 text-gray-800">LỊCH SỬ KIỂM KÊ KHO</h1>

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
                                        Phiếu kiểm kê
                                    </h6>
                                    <div
                                        id="product-expand1"
                                        onClick={() => addInventory(warehouse)}
                                    >
                                        Thêm
                                    </div>
                                    <div
                                        id="product-expand1"
                                        className="minus-item"
                                        onClick={removeInventory}
                                    >
                                        Xóa
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Row>
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
                                            ></input>
                                        </Col>
                                        <Col xs={6}>
                                            <label htmlFor="position">
                                                Chức vụ:
                                            </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="position"
                                                id="position"
                                                min="0"
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
                                                        <th
                                                            rowSpan={2}
                                                            style={{
                                                                width: "157px",
                                                            }}
                                                        >
                                                            Tình trạng
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th>Ước tính</th>
                                                        <th>Thực nhập</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{inventorys}</tbody>
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

                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Lịch sử kiểm kê kho
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive inventories-table">
                                        <table
                                            className="table table-bordered"
                                            id="dataTable"
                                            width="100%"
                                            cellSpacing={0}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Ngày Kiểm Kê</th>
                                                    <th>Người Phụ Trách</th>
                                                    <th>Chức Vụ</th>
                                                    <th>Tiến Độ</th>
                                                    <th>Tình Trạng</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th>Ngày Kiểm Kê</th>
                                                    <th>Người Phụ Trách</th>
                                                    <th>Chức Vụ</th>
                                                    <th>Tiến Độ</th>
                                                    <th>Tình Trạng</th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                {!!warehouseInventories &&
                                                    !!warehouseInventories.length &&
                                                    warehouseInventories.map(
                                                        (
                                                            warehouseInventory,
                                                            index
                                                        ) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {
                                                                            warehouseInventory.created_at
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouseInventory.person_in_charge
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            warehouseInventory.position
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {warehouseInventory.completed ===
                                                                        0 ? (
                                                                            <p
                                                                                style={{
                                                                                    color: "orange",
                                                                                }}
                                                                            >
                                                                                Chưa
                                                                                Hoàn
                                                                                Thành
                                                                            </p>
                                                                        ) : (
                                                                            <p
                                                                                style={{
                                                                                    color: "blue",
                                                                                }}
                                                                            >
                                                                                Đã
                                                                                Hoàn
                                                                                Thành
                                                                            </p>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {warehouseInventory.status ===
                                                                        0 ? (
                                                                            <p
                                                                                style={{
                                                                                    color: "green",
                                                                                }}
                                                                            >
                                                                                Bình
                                                                                Thường
                                                                            </p>
                                                                        ) : (
                                                                            <p
                                                                                style={{
                                                                                    color: "red",
                                                                                }}
                                                                            >
                                                                                Có
                                                                                Thất
                                                                                Thoát
                                                                            </p>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={
                                                                                "/admin/warehouses/inventory/edit?id=" +
                                                                                warehouseInventory.id
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

const Inventory = (props) => {
    const [sku, setSku] = useState("");

    const [warehousePd, setWarehousePd] = useState({
        name_specific: "",
        quantity: 0,
    });

    const handleChange = (e) => {
        let value = e.target.value;
        setSku(value);
        getSkuData(value);
    };

    const getSkuData = async (skuParam) => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/warehouseproduct?sku=${skuParam}&warehouse=${props.warehouseParam}`
            );
            console.log(res);
            if (res.data.status) {
                setWarehousePd(res.data.warehouse_product); // new
            }
        } catch (error) {
            console.error(error);
            setWarehousePd({
                name_specific: "",
                quantity: 0,
            });
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
                <p>
                    {warehousePd.name_specific ? warehousePd.name_specific : ""}
                </p>
                <input
                    className="form-input"
                    type="hidden"
                    name={`name[]`}
                    value={
                        warehousePd.name_specific
                            ? warehousePd.name_specific
                            : ""
                    }
                ></input>
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`sku[]`}
                    value={sku}
                    onChange={handleChange}
                ></input>
            </td>
            <td>
                <input
                    className="form-input"
                    type="text"
                    name={`unit[]`}
                ></input>
            </td>
            <td className="text-center">
                <p>{warehousePd.quantity ? warehousePd.quantity : 0}</p>
                <input
                    className="form-input"
                    type="hidden"
                    name={`quantity[]`}
                    value={warehousePd.quantity ? warehousePd.quantity : 0}
                ></input>
            </td>
            <td></td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`price[]`}
                ></input>
            </td>
            <td>
                <select className="form-input" name={`quality[]`}>
                    <option value="0">Còn tốt 100%</option>
                    <option value="1">Kém chất lượng</option>
                    <option value="2">Mất chất lượng</option>
                </select>
            </td>
        </tr>
    );
};

export default AddWarehousesInventory;

const Option = ({ ...props }) => {
    return <option value={props.value}>{props.label}</option>;
};
