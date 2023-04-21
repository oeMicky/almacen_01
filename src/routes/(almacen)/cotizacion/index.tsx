import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div
      style={{
        width: '1111px', //SIZES.anchoContenedor + 'px',
        height: 'inherit',
        color: 'red', //COLORS.lightGray2,
        margin: '5px auto',
        display: 'inherit',
        justifyContent: 'inherit',
        alignItems: 'inherit',
      }}
    >
      {/*  TITULO  */}
      <h3>
        <u>Cotizaciones</u>
        {/* <u>{parametrosGlobales.nombreAlmacen}</u> */}
      </h3>
      {/*  INTERVALOS DE FECHAS */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>
          Desde: <input id="fechaDesde" type="date" />
        </label>

        <label style={{ marginRight: '5px' }}>
          Hasta: <input id="fechaHasta" type="date" />
        </label>

        {/* <ImgButton
            src={icons.searchPLUS.default}
            alt="Icono de busqueda"
            height={16}
            width={16}
            title="Buscar ventas"
            onClick={buscarCotizacionesEntreFechas}
          /> */}
      </div>
      {/*  BOTONES */}
      <div style={{ marginBottom: '10px' }}>
        {/* <Button className="btn" name="ADD COTIZACION" onClick={mostrarPanelCotizacion} title="Add una cotización" /> */}
        {/* {showAddCotizacion && (
            <Modal
              componente={
                <NewEditCotizacion
                  ancho={'600px'}
                  parametrosGlobales={parametrosGlobales}
                  inicializacion={inicializacionCotizacion}
                  onCerrar={cerrarPanelCotizacion}
                />
              }
            />
          )} */}
      </div>
      {/* TABLA COTIZACIONES */}
      <div style={{ margin: '10px 0' }}>
        {/* {cotizaciones.length ? (
            <TablaCotizaciones registros={cotizaciones} verPDF={generarPDF} onEdit={editarCotizacion} />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen cotizaciones</i>
          )} */}
      </div>
    </div>
  );
});
