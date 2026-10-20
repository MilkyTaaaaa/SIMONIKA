import React from "react";
import "./card.css";

function CardLittle({ title, image, description, more, button }) {
    return (
        <div className="card-little">
            <div className="card-content">
                <div className="card-header-little">
                    <p className="card-title">{title}</p>
                    <img src={image} alt="" />
                </div>
                <div className="card-desc-little">
                    <h2 className="card-description">{description}</h2>
                    <p className="card-more">{more}</p>
                </div>
            </div>

            {button && (
                <div className="card-button">
                    <button>{button}</button>
                </div>
            )}
        </div>
    );
}

export default CardLittle;