import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div
      style={{
        width: '1111px', //SIZES.anchoContenedor + 'px',
        height: 'inherit',
        color: '#a4e8b1', // COLORS.lightGray2,
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
      {/* SUB - TITULO: INGRESOS DE MERCADERIAS */}
      <h4 style={{ marginBottom: '5px' }}>
        <img
          //   src={icons.almacenIn_TopBottom}
          width={'20px'}
          style={{ marginRight: '4px ' }}
          // onClick={() => console.log('ingreso')}
        ></img>
        Ingresos de mercaderías
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
          title="Buscar ingresos"
          onClick={cargarIngresosMercaderias}
        /> */}
      </div>
      {/* ADD INGRESO DE MERCADERIAS */}
      <div>
        {/* <Button
          className="btn"
          name="ADD INGRESO"
          style={{ margin: '5px 0' }}
          onClick={botonAddIngresoMercaderias}
          title="Add un ingreso de la mercaderías"
        /> */}
        {/* {showNewEditIngresoMercaderias && (
          <Modal
            componente={
              <NewEditIngresoMercaderias
                ancho={'800px'}
                inicializacion={inicializarIngresoMercaderias}
                // unidsEquivas={unidadesEquivalencias}
                parametrosGlobales={parametrosGlobales}
                // onAddEdit={addUpEquivalencia}
                onCerrar={cerrarPanelIngresoMercaderias}
              />
            }
          ></Modal>
        )} */}
      </div>
      {/*  tabla INGRESOS DE MERCADERIA */}
      <div className="form-control" style={{ margin: '10px 0' }}>
        {/* {ingresosMercaderias.length > 0 ? (
          <TablaIngresosMercaderias
            registros={ingresosMercaderias}
            mostrarDocumentos={verDocumentos}
            mostrarMercaderias={verMercaderias}
            // onDel={botonDeleteIngresosMercaderias}
            // mostrarEdit={botonEditIngresosMercaderias}
          />
        ) : (
          <i style={{ fontSize: '0.7rem' }}>No existen ingresos</i>
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
              <VerMercaderiasIngresadas ancho={'700px'} registros={mercaderias} onCerrar={() => setShowItemsMercaderias(false)} />
            }
          />
        )} */}
      </div>
    </div>
  );
});
