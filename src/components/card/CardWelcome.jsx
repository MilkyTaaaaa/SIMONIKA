import "./../DashboardLayout.css";

function CardWelcome({
    title,
    description,
    time,
    timezone = "WIB",
    date,
}) {
    return (
        <div className="card-welcome">
            <div className="card-welcome-text">
                {title && <h1>{title}</h1>}

                {description && <p>{description}</p>}
            </div>

            {(time || date) && (
                <div className="card-welcome-time">
                    {time && (
                        <h1>
                            {time} {timezone && <span>{timezone}</span>}
                        </h1>
                    )}

                    {date && <p>{date}</p>}
                </div>
            )}
        </div>
    );
}

export default CardWelcome;