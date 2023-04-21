import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div
      style={{
        width: '1111px', // SIZES.anchoContenedor + 'px',
        height: 'inherit',
        color: 'red', // COLORS.lightGray2,
        margin: '5px auto',
        display: 'inherit',
        justifyContent: 'inherit',
        alignItems: 'inherit',
      }}
    >
      {/*  TITULO {parametrosGlobales.nombreAlmacen} */}
      <h3 style={{ marginBottom: '5px' }}>
        <u>Almacén: </u>
      </h3>
      {/* EGRESOS DE MERCADERIAS */}
      <h4 style={{ marginBottom: '5px' }}>
        <img
          //   src={icons.almacenOut_TopBottom}
          width={'20px'}
          style={{ marginRight: '4px ' }}
          // onClick={() => console.log('ingreso')}
        ></img>
        Egreso de mercaderías
      </h4>
      {/* DESDE - HASTA   */}
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Desde: <input id="fechaDesde" type="date" />
        </label>
        <label>
          Hasta: <input id="fechaHasta" type="date" />
        </label>
        {/* <ImgButton
            src={icons.searchPLUS.default}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el formulario"
            onClick={cargarEgresosMercaderias}
          /> */}
      </div>
      {/* ADD EGRESO DE MERCADERIAS */}
      <div>
        {/* <Button
            className="btn"
            name="ADD EGRESO"
            style={{ margin: '5px 0' }}
            onClick={botonAddEgresoMercaderias}
            title="Add un ingreso de la mercaderías"
          /> */}
        {/* {showNewEditIngresoMercaderias && (
            <Modal
              componente={
                <NewEditEgresoMercaderias
                  ancho={'800px'}
                  inicializacion={inicializarIngresoMercaderias}
                  // unidsEquivas={unidadesEquivalencias}
                  parametrosGlobales={parametrosGlobales}
                  // onAddEdit={addUpEquivalencia}
                  onCerrar={() => {
                    setShowNewEditIngresoMercaderias(false);
                    // getRegistros();
                  }}
                />
              }
            ></Modal>
          )} */}
      </div>
      {/*  TABLA EGRESOS */}
      <div className="form-control" style={{ margin: '10px 0' }}>
        {/* {egresosMercaderias.length > 0 ? (
            <TablaEgresosMercaderias
              registros={egresosMercaderias}
              mostrarDocumentos={verDocumentos}
              mostrarMercaderias={verMercaderias}
              // onDel={botonDeleteIngresosMercaderias}
              // mostrarEdit={botonEditIngresosMercaderias}
            />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen egresos</i>
          )} */}
        {/* {showDocumentosAdjuntos && (
            <Modal
              componente={
                <VerDocumentosAdjuntos ancho={'500px'} registros={documentos} onCerrar={() => setShowDocumentosAdjuntos(false)} />
              }
            />
          )} */}
        {/* {showItemsMercaderias && (
            <Modal
              componente={
                <VerMercaderiasEgresadas
                  ancho={'700px'}
                  registros={mercaderias}
                  onCerrar={() => setShowItemsMercaderias(false)}
                />
              }
            />
          )} */}
      </div>
    </div>
  );
});
