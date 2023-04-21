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
      <h3>
        <u>Kardex</u>
        {/* <u>Almacén: {parametrosGlobales.nombreAlmacen}</u> */}
      </h3>

      {/* BUSCAR POR */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>Buscar </label>

        <input
          id="inputCodigoDescripcion"
          style={{ width: '157px', marginLeft: '5px' }}
          type="text"
          // value={'a'}
          placeholder="Descripción"
        />
        <div style={{ margin: '0 5px' }}>
          {/* <ImgButton
              // style={{ display: 'flex', justifyContent: 'start' }}
              src={icons.searchPLUS.default}
              alt="Icono de buscar de mercadería"
              height={16}
              width={16}
              title="Buscar datos de mercadería"
              onClick={localizar}
            /> */}
        </div>
      </div>
      {/*  tabla  ITEMS MERCADERIAS LOCALIZADOS */}
      <div className="form-control" style={{ margin: '10px 0' }}>
        {/* {mercaderiasLocalizados.length > 0 ? (
            <TablaMercaderiaKardex
              registros={mercaderiasLocalizados}
              kardexs={verListadoKardexs}
              kardex={verKardex}
              editarMercaderia={editarMercaderia}
              // addItemMercaderia={botonAdicionarItemMercaderiaIN}
            />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen registros localizados</i>
          )} */}
        {/* {showAddEditMercaderia && (
            <Modal
              componente={
                <NewEditMercaderia3
                  ancho={'500px'}
                  parametrosGlobales={parametrosGlobales}
                  inicializacion={mercaderiaSeleccionada}
                  editar={true}
                  indexEnTabla={indexEnLaTablaMercaderia}
                  onCerrar={cerrarPanelMercaderia}
                />
                // <NuevaEditMercaderia
                //   inicializacion={inicializarMercaderia}
                //   ancho={'500px'}
                //   onCerrar={() => {
                //     setShowAddMercaderia(false);
                //     // getRegistros();
                //   }}
                // />
              }
            ></Modal>
          )} */}
        {/* {showPanelKardex && (
            <Modal
              componente={
                <VerKardex
                  ancho={'900px'}
                  parametrosGlobales={parametrosGlobales}
                  mercaderiaSeleccionada={mercaderiaSeleccionada}
                  kardexSeleccionado={kardexSeleccionado}
                  // conFechaVencimientoLote={conFechaVencimientoLote}
                  // onAddEdit={(e) => {
                  //   onAddEdit(e);
                  //   setShowPanelIngresoCantidadMercaderia(false);
                  // }}
                  onCerrar={() => {
                    setShowPanelKardex(!showPanelKardex);
                  }}
                />
              }
            ></Modal>
          )} */}
        {/* {showPanelListadoKardexs && (
            <Modal
              componente={
                <ListadoKardexsMercaderia
                  ancho={'700px'}
                  parametrosGlobales={parametrosGlobales}
                  mercaderiaSeleccionada={mercaderiaSeleccionada}
                  // kardex={verKardex}
                  // idMercaderia={mercaderiaSeleccionada._id}
                  // kardexs={kardexsSeleccionados}
                  // unidad={mercaderiaSeleccionada.unidad}
                  onCerrar={() => {
                    setShowPanelListadoKardexs(!showPanelListadoKardexs);
                  }}
                />
              }
            />
          )} */}
      </div>
    </div>
  );
});
