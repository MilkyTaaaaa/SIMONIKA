import react from "react";
import "./card.css";

function CardTwo({ title, image, description, more, button, children }) {
    return (
        <div className="card-two">
            <div className="card-two-header">
                <div className="card-two-tittle">
                    <h2 className="">{title}</h2>
                <p className="">{description}</p>
                </div>
                {button && (
                    <div className="card-button">
                        <button>{button}</button>
                    </div>
                )}
            </div>
            <div className="card-two-content">
                {children}
            </div>
        </div>
    );
}

export default CardTwo;