import "../../css/products.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductIndex = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/products",
                method: "get",
            });
            setData(res.data.products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

   
    return (
        <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-2 text-gray-800">DANH SÁCH SẢN PHẨM</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                        Sản Phẩm
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
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Code</th>
                                    <th>Giá</th>
                                    <th>Mô tả ngắn</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Code</th>
                                    <th>Giá</th>
                                    <th>Mô tả ngắn</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                            <tbody>
                                {!!data &&
                                    !!data.length &&
                                    data.map((product) => {
                                        return (
                                            <tr key={product.id}>
                                                <td>
                                                    <img
                                                        src=""
                                                        alt="product.png"
                                                        width={80}
                                                    ></img>
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.code}</td>
                                                <td>{product.price}</td>
                                                <td>
                                                    {product.short_description}
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <Link to={"/admin/products/edit/" + product.id} className="btn-action edit">
                                                            Sửa
                                                        </Link>
                                                        <p className="btn-action del">
                                                            Xóa
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductIndex;
