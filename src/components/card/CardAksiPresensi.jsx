import "./card.css";

function CardAksiPresensi({title, more, button}){
    return(
        <div className="card-aksi-presensi">
            <div className="card-aksipresensi-header">
                <h2>{title}</h2>
                <p>{more}</p>
            </div>
            {button && (
                    <div className="card-button2">
                        <button>{button}</button>
                    </div>
                )}
        </div>
    );
}
export default CardAksiPresensi;
