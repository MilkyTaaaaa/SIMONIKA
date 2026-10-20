import React from "react";
import "./card.css";

function CardLong({ title, image, description, more, button }) {
    return (
        <div className="card">
            <div className="card-content">
                {image && <img src={image} alt="" />}

                <div className="card-content-text">
                    {title && (
                        <h2 className="card-title">{title}</h2>
                    )}

                    {description && (
                        <p className="card-description">
                            {description}
                        </p>
                    )}

                    {more && (
                        <p className="card-more">{more}</p>
                    )}
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

export default CardLong;