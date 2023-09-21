import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const SKUProduct = () => {
    const [searchParams] = useSearchParams();
    // generate SKU
    const [skus, setSkus] = useState([]);
    const [data, setData] = useState([]);

    // Lưu trữ nội dung thông báo hiện lên
    const [msg, setMsg] = useState({
        status: false,
        messages: "",
    });

    // Xử lý sự kiện submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/api/products/${searchParams.get(
            "id"
        )}/colorsizes`;
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

    // Lấy dữ liệu SKU
    const getData = async () => {
        const res = await axios.get(
            `http://localhost:8000/api/products/${searchParams.get(
                "id"
            )}/colorsizes`
        );
        setData(res.data.color_sizes);
    };

    // Tải dữ liệu SKU
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container-fluid">
            <h1 className="h3 my-4 text-gray-800">MÃ HÀNG HÓA SẢN PHẨM</h1>
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <form onSubmit={handleSubmit}>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Mã hàng hóa
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <table
                                        className="table table-bordered mt-3"
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
                                            {!!data &&
                                                !!data.length &&
                                                data.map((item, index) => (
                                                    <SKU
                                                        key={index}
                                                        index={index}
                                                        sku={item.sku}
                                                        prodName={
                                                            item.prod_name
                                                        }
                                                        prodId={item.prod_id}
                                                        color={item.color}
                                                        colorId={item.color_id}
                                                        size={item.size}
                                                        sizeId={item.size_id}
                                                    />
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Row>
                                <Col
                                    className="d-flex justify-content-end"
                                    id="form-button"
                                >
                                    <Link className="cancel-button" to="/admin/products">
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
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export const SKU = (props) => {
    const [sku, setSku] = useState(props.sku);

    const handleChange = (e) => {
        setSku(e.target.value);
    };

    return (
        <tr className="sku-row">
            <td
                style={{
                    paddingTop: "1.6rem",
                    textAlign: "center",
                }}
            >
                {props.index + 1}
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
                <p>{props.prodName ? props.prodName : ""}</p>
                <input
                    className="form-input ignore"
                    type="hidden"
                    name={`product_id[]`}
                    value={props.prodId}
                ></input>
            </td>
            <td>
                <p>{props.color ? props.color : ""}</p>
                <input
                    className="form-input ignore"
                    type="hidden"
                    name={`color_id[]`}
                    value={props.colorId}
                ></input>
            </td>
            <td>
                <p>{props.size ? props.size : ""}</p>
                <input
                    className="form-input ignore"
                    type="hidden"
                    name={`size_id[]`}
                    value={props.sizeId}
                ></input>
            </td>
        </tr>
    );
};

export default SKUProduct;
