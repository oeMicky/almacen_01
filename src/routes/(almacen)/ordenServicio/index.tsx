import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div
      style={{
        width: '1111px', // SIZES.anchoContenedor + 'px',
        height: 'inherit',
        color: '#888', //COLORS.lightGray2,
        margin: '5px auto',
        display: 'inherit',
        justifyContent: 'inherit',
        alignItems: 'inherit',
      }}
    >
      {/*  TITULO  */}
      <h3>
        <u>Ordenes de Servicio</u>
      </h3>
      {/*  INTERVALOS DE FECHAS */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>
          Desde: <input id="fechaDesde" type="date" />
        </label>

        <label>
          Hasta: <input id="fechaHasta" type="date" />
        </label>

        {/* <ImgButton
          src={icons.searchPLUS.default}
          alt="Icono de busqueda"
          height={16}
          width={16}
          title="Buscar ordenes de servicios"
          style={{ marginTop: '3px' }}
          onClick={buscarOrdenesServiciosPorFechas}
        /> */}
      </div>
      {/*  BOTONES */}
      <div style={{ marginBottom: '10px' }}>
        {/* <Button
          className="btn"
          name="ADD ORDEN DE SERVICIO"
          onClick={mostrarPanelOrdenServicio}
          title="Add una orden de servicio"
        /> */}
        {/* {showNewEditOrdenServicio && (
          <Modal
            componente={
              <NewEditOrdenServicio
                ancho={'680px'}
                parametrosGlobales={parametrosGlobales}
                inicializacion={inicializacionOrdenServicio}
                onCerrar={cerrarPanelOrdenServicio}
              />
            }
          />
        )} */}
      </div>
      {/* TABLA ORDENES DE SERVICIO */}
      <div style={{ margin: '10px 0' }}>
        {/* {ordenesServicios.length ? (
          <TablaOrdenesServicio registros={ordenesServicios} verPDF={generarPDF} onEdit={editarOrdenServicio} />
        ) : (
          <i style={{ fontSize: '0.7rem' }}>No existen ordenes de servicio</i>
        )} */}
      </div>
    </div>
  );
});
