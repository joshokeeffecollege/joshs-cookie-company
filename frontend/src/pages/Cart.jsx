import {useCart} from "../components/context/CartContext.jsx";

export default function Cart() {
    const {cartItems, removeFromCart, updateQuantity, clearCart, total} = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Your Cart</h1>
                    <p>Your cart is empty.</p>
                    <a href="/cookies" className="btn btn-warning mt-3">
                        Browse cookies
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="py-5">
            <div className="container-fluid px-5">
                <h1 className="h3 mb-4">Your Cart</h1>

                <div className="table-responsive mb-3">
                    <table className="table align-middle">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th style={{width: "140px"}}>Price</th>
                            <th style={{width: "160px"}}>Quantity</th>
                            <th style={{width: "140px"}}>Subtotal</th>
                            <th style={{width: "80px"}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {item.image_url && (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    marginRight: "12px",
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="fw-semibold">{item.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>€{item.price.toFixed(2)}</td>
                                <td>
                                    <div className="input-group input-group-sm" style={{maxWidth: "150px"}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={item.quantity}
                                            min={1}
                                            onChange={(e) =>
                                                updateQuantity(
                                                    item.id,
                                                    Number(e.target.value) || 1
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    €{(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={clearCart}
                    >
                        Clear cart
                    </button>

                    <div className="text-end">
                        <div className="fs-5 fw-bold">
                            Total: €{total.toFixed(2)}
                        </div>
                        <button
                            type="button"
                            className="btn btn-warning"
                            disabled
                        >
                            Checkout (coming soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
