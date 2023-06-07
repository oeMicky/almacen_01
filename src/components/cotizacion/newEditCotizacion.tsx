import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import ElButton from '../system/elButton';
import { hoy } from '~/functions/comunes';
import SeleccionarPersona from '../miscelanea/persona/seleccionarPersona';
import { parametrosGlobales } from '~/routes/login';
import { CTX_DOCS_COTIZACION } from '~/routes/(almacen)/cotizacion';

// export default component$((props: { contexto: any }) => {
export default component$(() => {
  //#region CONTEXTO
  const ctx_docs_cotizacion = useContext(CTX_DOCS_COTIZACION); // useContext(CTX_VENTA);
  //#endregion CONTEXTO

  console.log('ctx', ctx_docs_cotizacion.mostrarAdjuntarCotizacion);

  //#region INICIALIZACION
  const showSeleccionarPersona = useSignal(false);
  //#endregion INICIALIZACION
  return (
    <div
      class="container-modal"
      style={{
        width: 'auto',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          // onClick={onCerrar}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* GENERALES DE COTIZACION */}
          <div>
            {/* Numero de documento*/}
            <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumento"
                  style={{ width: '100%' }}
                  type="text"
                  disabled
                  // value={correlativo}
                />
              </div>
            </div>
            {/* fecha */}
            <div class="form-control form-control-check">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputFecha"
                  type="date"
                  disabled
                  //   value={fecha}
                  value={hoy()}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  //   value={codigoTipoDocumentoIdentidad}
                  //   onChange={cambioTipoDocumento}
                  style={{ width: '100%' }}
                >
                  <option value={1}>DNI</option>
                  <option value={6}>RUC</option>
                  <option value={4}>C.EXT</option>
                </select>
              </div>
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumentoIdentidad"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add número"
                  //   value={numeroIdentidad}
                  //   onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  //   onClick={buscarCliente}
                  onClick={$(() => {
                    showSeleccionarPersona.value = true;
                  })}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  //   value={razonSocialNombreCliente}
                  //   onChange={(e) => setRazonSocialNombreCliente(e.target.value)}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {showSeleccionarPersona.value && (
            <div class="modal">
              <SeleccionarPersona
                // ancho={'520px'}
                parametrosGlobales={parametrosGlobales}
                soloPersonasNaturales={false}
                seleccionar={'cliente'}
                contexto={'COTIZACION'}
                // onCerrar={cerrarPanelSeleccionarPersonaCliente}
              />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input
                  type={'text'}
                  id={'inputIGV'}
                  style={{ width: '100%' }}
                  disabled
                  //   defaultValue={igv ? igv : igv.$numberDecimal}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
        </div>
        {/* GENERALES DEL VEHICULO */}
        <div>
          {/* Placa */}
          <div class="form-control">
            <label>Placa</label>
            <div class="form-control form-agrupado">
              <input
                id="inputPlaca"
                style={{ width: '100%' }}
                type="text"
                // onKeyDown={(e) => (placaValida = validar_inputPlaca(e))}
                // placeholder="Add placa: AAA123, TRU789, XRW695"
                // value={placa}
                // onChange={(e) => {
                //   if (placaValida) {
                //     setPlaca(e.target.value.trim().toUpperCase());
                //   }
                // }}
                // onPaste={(event) => {
                //   event.preventDefault();
                //   event.stopPropagation();
                // }}
              />
              <ImgButton
                id={'imgButtonSearchVehiculo'}
                src={images.searchPLUS}
                alt="Icono de buscar placa"
                height={16}
                width={16}
                title="Buscar placa"
                // onClick={buscarPlaca}
              />
            </div>
          </div>
          {/* Marca */}
          <div class="form-control">
            <label>Marca</label>
            <div class="form-control form-agrupado">
              <input
                id="inputMarca"
                style={{ width: '100%' }}
                type="email"
                placeholder="Marca"
                disabled
                // value={vehiculoMarca}
              />
            </div>
          </div>
          {/* Modelo */}
          <div class="form-control">
            <label>Modelo</label>
            <div class="form-control form-agrupado">
              <input
                id="inputModelo"
                style={{ width: '100%' }}
                type="email"
                placeholder="Modelo"
                disabled
                // value={vehiculoModelo}
              />
            </div>
          </div>
          {/* VIN */}
          <div class="form-control">
            <label>VIN</label>
            <div class="form-control form-agrupado">
              <input
                id="inputVIN"
                style={{ width: '100%' }}
                type="email"
                placeholder="VIN"
                disabled
                // value={vin}
              />
            </div>
          </div>
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* {showPanelRegistrarVehiculo && (
          <Modal
            componente={
              <NewEditVehiculo
                ancho={'370px'}
                inPlaca={placa}
                parametrosGlobales={parametrosGlobales}
                onCerrar={cerrarPanelRegistrarVehiculo}
              />
            }
          />
        )} */}
        {/* ----------------------------------------------------- */}
        {/* BOTON SERVICIO */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '5px 0',
            }}
          >
            <div style={{ marginBottom: '5px' }}>
              {/* {typeof correlativo === 'undefined' ? (
                <ElButton
                  class="btn"
                  name="Add servicio"
                  disabled
                  title="Add servicio"
                  style={{ background: '#aaa', color: '#d3d3d3' }}
                />
              ) : (
                <ElButton
                  class="btn"
                  name="Add servicio"
                  onClick={(e) => {
                    console.log('servicio');
                    addServicio();
                  }}
                  title="Add servicio"
                />
              )} */}
            </div>
            {/* {showPanelSeleccionarServicio && (
              <Modal
                componente={
                  <SeleccionarServicio
                    ancho={'500px'}
                    seleccionar={'servicio'}
                    parametrosGlobales={parametrosGlobales}
                    onAddServicioAOrdenServicio={upCotizacion_Servicio}
                    onCerrar={cerrarPanelNewEditServicio}
                  />
                }
              />
            )} */}
            {/* TABLA SERVICIOS  */}
            {/* {servicios.length ? (
              <TablaServicios
                registros={servicios}
                onDel={botonDeleteItemTablaServicios}
                actualizarServicio={upServicio}
                fijarMontosTotales={fijarMontosServicios}
              />
            ) : (
              <i style={{ fontSize: '0.7rem' }}>No existen servicios</i>
            )}
            {showPanelDeleteItemTablaServicios && (
              <Modal componente={<PanelMensajeSiNo ancho={'500px'} onCerrar={cerrarPanelDeleteItemTablaServicios} />} />
            )} */}
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* BOTON REPUESTOS */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '5px 0',
            }}
          >
            <div style={{ marginBottom: '5px' }}>
              {/* {typeof correlativo === 'undefined' ? (
                <ElButton
                  class="btn"
                  name="Add repuesto"
                  disabled
                  title="Add repuesto"
                  style={{ background: '#aaa', color: '#d3d3d3' }}
                />
              ) : (
                <ElButton
                  class="btn"
                  name="Add repuesto"
                  onClick={(e) => {
                    console.log('repuesto');
                    addRepuesto();
                  }}
                  title="Add repuesto"
                />
              )} */}
            </div>
            {/* {showPanelSeleccionarRepuesto && (
              <Modal
                componente={
                  <BusquedaMercaderiaOUT
                    ancho={'740px'}
                    // inicializacion={inicializarItemVenta}
                    parametrosGlobales={parametrosGlobales}
                    onAddItemVenta={upCotizacion_Repuesto}
                    ifCerrarPanelEquivalencia={ifCerrarPanelEquivalencia}
                    onCerrar={() => {
                      setShowPanelSeleccionarRepuesto(false);
                    }}
                  />
                }
              ></Modal>
            )} */}
            {/* TABLA REPUESTOS  */}
            {/* {repuestos.length ? (
              <TablaRequisiciones
                registros={repuestos}
                actualizarRequisicion={upRepuesto}
                fijarMontosTotales={fijarMontosRepuestos}
              />
            ) : (
              <i style={{ fontSize: '0.7rem' }}>No existen repuestos</i>
            )} */}
          </div>
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          //   value={correlativo === '' ? 'Registrar' : 'Grabar'}
          value="Grabar"
          class="btn-centro"
          //   onClick={(e) => onSubmit(e)}
        />
      </div>
    </div>
  );
});
