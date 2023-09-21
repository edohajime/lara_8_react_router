import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { ListSKUs } from "./AddWarehouseIOs";

const EditWarehousesInventory = () => {
    const [searchParams] = useSearchParams();
    const [inventorys, setInventorys] = useState([]);

    // Dữ liệu hiển thị kho
    const [warehouses, setWarehouses] = useState([]);
    const [options, setOptions] = useState([]);

    // Danh sách phiếu kiểm kê kho
    const [warehouseInventory, setWarehouseInventory] = useState({});

    // Người dùng hiện tại
    const [user, setUser] = useState("");

    // State lưu trữ giá trị value của các trường nhập
    const [personInCharge, setPersonInCharge] = useState("");
    const [position, setPosition] = useState("");
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

        const url = `http://localhost:8000/api/warehouseinventories/${searchParams.get(
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

    const handleChange = (e) => {
        if (e.target.name === "person_in_charge") {
            setPersonInCharge(e.target.value);
        } else if (e.target.name === "position") {
            setPosition(e.target.value);
        } else if (e.target.name === "warehouse") {
            setWarehouse(e.target.value);
        } else if (e.target.name === "completed") {
            setCompleted(e.target.value);
        }
    };

    const getWarehouseInventory = async () => {
        const res = await axios.get(
            `http://localhost:8000/api/warehouseinventories/${searchParams.get(
                "id"
            )}`
        );

        setWarehouseInventory(res.data.warehouseInventory);
    };

    // Lấy danh sách kho
    const getWarehouses = async () => {
        const res = await axios.get("http://localhost:8000/api/warehouses");
        setWarehouses(res.data.warehouses);
    };

    /**
     * Thêm hàng inventory
     * @param {*} index
     * @param {*} name
     * @param {*} sku
     * @param {*} unit
     * @param {*} quantity
     * @param {*} realQuantity
     * @param {*} price
     * @param {*} quality
     * @param {*} warehouseParam - Dùng để lấy quantity cho loại hàng tương ứng
     */
    const addInventory = (
        index = 0,
        name = "",
        sku = "",
        unit = "",
        quantity = 0,
        realQuantity = 0,
        price = 0,
        quality = 0,
        warehouseParam = ""
    ) => {
        const newInventory = (
            <Inventory
                key={index === 0 ? inventorys.length : index}
                index={index === 0 ? inventorys.length : index}
                name={name}
                sku={sku}
                unit={unit}
                quantity={quantity}
                realQuantity={realQuantity}
                price={price}
                quality={quality}
                warehouseParam={warehouseParam}
            />
        );
        setInventorys((prevInventorys) => [...prevInventorys, newInventory]);
        document.getElementById("form-button").style.display = "flex";
        document.getElementById("form-button").style.justifyContent =
            "flex-end";
    };

    /**
     * Xóa hàng inventory
     */
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

    // Xử lý khi warehouseInventory thay đổi
    useEffect(() => {
        setPersonInCharge(warehouseInventory.person_in_charge);
        setPosition(warehouseInventory.position);
        setWarehouse(warehouseInventory.warehouse);
        setCompleted(warehouseInventory.completed);
    }, [warehouseInventory]);

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

    // Lấy dữ liệu của phiếu kiểm kê kho
    useEffect(() => {
        getWarehouseInventory();
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
            <h1 className="h3 mb-4 text-gray-800">
                THÔNG TIN PHIẾU KIỂM KÊ KHO
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
                                        Phiếu kiểm kê
                                    </h6>
                                    <div
                                        id="product-expand1"
                                        onClick={() =>
                                            addInventory(
                                                0,
                                                "",
                                                "",
                                                "",
                                                0,
                                                0,
                                                0,
                                                0,
                                                warehouse
                                            )
                                        }
                                    >
                                        Thêm
                                    </div>
                                    <div
                                        id="product-expand1"
                                        className="minus-item"
                                        onClick={() => removeInventory()}
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
                                                value={personInCharge}
                                                onChange={handleChange}
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
                                                value={position}
                                                onChange={handleChange}
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
                                                to="/admin/warehouses/inventory"
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
                            <ListSKUs />
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const Inventory = (props) => {
    const [sku, setSku] = useState(props.sku);
    const [unit, setUnit] = useState(props.unit);
    const [realQuantity, setRealQuantity] = useState(props.realQuantity);
    const [price, setPrice] = useState(props.price);
    const [quality, setQuality] = useState(props.quality);

    const [warehousePd, setWarehousePd] = useState({
        name_specific: "",
        quantity: 0,
    });

    useEffect(() => {
        console.log(props.index);
    }, []);

    const handleChange = (e) => {
        if (e.target.name === "sku[]") {
            setSku(e.target.value);
            getSkuData(e.target.value); // new
        } else if (e.target.name === "unit[]") {
            setUnit(e.target.value);
        } else if (e.target.name === "real_quantity[]") {
            setRealQuantity(Number(e.target.value));
        } else if (e.target.name === "price[]") {
            setPrice(Number(e.target.value));
        } else if (e.target.name === "quality[]") {
            setQuality(e.target.value);
        }
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
                    textAlign: "center",
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
                    value={unit}
                    onChange={handleChange}
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
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`real_quantity[]`}
                    value={realQuantity}
                    onChange={handleChange}
                ></input>
            </td>
            <td>
                <input
                    className="form-input"
                    type="number"
                    name={`price[]`}
                    value={price}
                    onChange={handleChange}
                ></input>
            </td>
            <td>
                <select
                    className="form-input"
                    name={`quality[]`}
                    value={quality}
                    onChange={handleChange}
                >
                    <option value="0">Còn tốt 100%</option>
                    <option value="1">Kém chất lượng</option>
                    <option value="2">Mất chất lượng</option>
                </select>
            </td>
        </tr>
    );
};

export default EditWarehousesInventory;

const Option = ({ ...props }) => {
    return <option value={props.value}>{props.label}</option>;
};
