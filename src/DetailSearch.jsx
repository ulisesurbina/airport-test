import './App.css';

const DetailSearch = ({ results, goBack }) => {

  return (
    <section>
      <button className="InputSearchData__back" onClick={goBack}>Regresar</button>
      <div className="CardAirport">
        {results.map((location) => (
          <div key={location.id} className="CardAirport__card">
            <h2>Nombre del aeropuerto: <br /> <span>{location.name}</span></h2> 
            <h3>Código IATA: <span>{location.iataCode}</span></h3>
            <h4>Ciudad: <span>{location.address.cityName}</span></h4>
            <h4>País: <br /> <span>{location.address.countryName}</span></h4>
            <section>
              <h4>Datos de geolocalización:</h4>
              <p>Latitud: <span>{location.geoCode.latitude}</span></p>
              <p>Longitud: <span>{location.geoCode.longitude}</span></p>
              <div className="CardAirport__map">
                <iframe 
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10!2d${location.geoCode.longitude}!3d${location.geoCode.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2smx`}
                  style={{ width:"100%", height:"100%", border: "0" }}
                  loading="lazy">
                </iframe>
              </div>
            </section>
          </div>
        ))}
      </div>
      <button className="InputSearchData__back" onClick={goBack}>Regresar</button>
    </section>
    )
};

export default DetailSearch;