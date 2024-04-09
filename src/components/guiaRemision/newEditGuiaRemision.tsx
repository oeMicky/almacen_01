import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import type { IGuiaRemision } from '~/interfaces/iGuiaRemision';
import { parametrosGlobales } from '~/routes/login';
import { CTX_INDEX_GUIA_REMISION } from '~/routes/(almacen)/guiaRemision';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import type { IPersona } from '~/interfaces/iPersona';

export const CTX_NEW_EDIT_GUIA_REMISION = createContextId<any>('__new_edit_guia_remision');
export const CTX_GUIA_REMISION = createContextId<any>('__guia_remision');
export const CTX_DESTINATARIO_GR = createContextId<any>('__destinatario');

export default component$((props: { addPeriodo: any; guiaRemisionSeleccionada: any }) => {
  //#region DEFINICION CTX_NEW_EDIT_GUIA_REMISON
  const definicion_CTX_NEW_EDIT_GUIA_REMISION = useStore({
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    mostrarVerAlmacen: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    // mostrarAdjuntarOS: false,
    // mostrarAdjuntarCotizacion: false,

    // mostrarPanelBorrarItemVenta: false,
    // borrar_idAuxilarVenta: 0,
  });
  useContextProvider(CTX_NEW_EDIT_GUIA_REMISION, definicion_CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion DEFINICION CTX_NEW_EDIT_GUIA_REMISON

  //#region DEFINICION CTX_GUIA_REMISION
  const definicion_CTX_GUIA_REMISION = useStore<IGuiaRemision>({
    _id: '',
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idPeriodo: props.addPeriodo.idPeriodo,
    periodo: props.addPeriodo.periodo,

    ruc: parametrosGlobales.RUC,
    empresa: parametrosGlobales.RazonSocial,
    direccion: parametrosGlobales.Direccion,

    codigoTipoComprobantePago: '',
    tipoComprobantePago: '',
    idSerieVenta: '',
    serie: '',
    numero: 0,

    fecha: '',

    idDestinatario: '',
    codigoTipoDocumentoIdentidad: '',
    tipoDocumentoIdentidad: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
  });
  useContextProvider(CTX_GUIA_REMISION, definicion_CTX_GUIA_REMISION);
  //#endregion DEFINICION CTX_GUIA_REMISION

  //#region DEFINICION CTX_DESTINATARIO_GR
  const definicion_CTX_DESTINATARIO_GR = useStore<IPersona>({
    _id: '',
    codigoTipoDocumentoIdentidad: '',
    tipoDocumentoIdentidad: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
    nombre: '',
    paterno: '',
    materno: '',
    activo: true,
  });
  useContextProvider(CTX_DESTINATARIO_GR, definicion_CTX_DESTINATARIO_GR);
  //#endregion DEFINICION CTX_DESTINATARIO_GR

  //#region CONTEXTOS
  const ctx_index_guia_remision = useContext(CTX_INDEX_GUIA_REMISION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const grabo = useSignal(false);

  //#endregion INICIALIZACION

  //#region DESTINATARIO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona &&
      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'destinatario'
    ) {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idDestinatario = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidad = definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidad = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombre = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion DESTINATARIO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 880px)',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid blue',
          width: 'auto',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_guia_remision.grabo_GuiaRemision = grabo.value;
            ctx_index_guia_remision.mostrarPanelGuiaRemision = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('definicion_CTX_F_B_NC_ND', definicion_CTX_F_B_NC_ND);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>
        Guía de remisión - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PERIODO */}
          <div class="form-control">
            <label>Periodo</label>
            <div class="form-control form-agrupado">
              <input
                id="in_Periodo_GR"
                style={{ width: '100%' }}
                type="number"
                disabled
                value={definicion_CTX_GUIA_REMISION.periodo}
              />
            </div>
          </div>
          <br></br>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL DESTINATARIO */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  disabled
                  // value={6}
                  value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];

                    definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidad = elOption.id;
                    definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad === 'DNI'}>
                    DNI
                  </option>
                  <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad === 'RUC'}>
                    RUC
                  </option>
                  <option id="4" value="C.EXT" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidad === 'C.EXT'}>
                    C.EXT
                  </option>
                </select>
                <input
                  // id="in_BuscarDetraccion"
                  type="image"
                  src={images.searchPLUS}
                  title="Buscar datos de identidad"
                  height={16}
                  width={16}
                  // style={{ marginLeft: '2px', marginTop: '2px' }}
                  style={{ margin: '2px' }}
                  onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersona = true)}
                />
              </div>
            </div>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona
                  soloPersonasNaturales={false}
                  seleccionar="destinatario"
                  contexto="new_edit_guiaRemision"
                  rol="destinatario"
                />
              </div>
            )}
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumentoIdentidad"
                  type="number"
                  placeholder="Add número"
                  disabled
                  style={{ width: '100%' }}
                  value={definicion_CTX_GUIA_REMISION.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroIdentidad = (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  type="text"
                  placeholder="Razón social / Nombre"
                  disabled
                  style={{ width: '100%' }}
                  value={definicion_CTX_GUIA_REMISION.razonSocialNombre}
                />
              </div>
            </div>
            <br></br>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE FACTURA */}
          <div>
            {/* Documento */}
            {/* <div class="form-control">
              <label>Documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectDocumentoVenta"
                  onChange$={(e) => {
                    tipoDocumento.value = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value={'01'} selected={tipoDocumento.value === '01'}>
                    FACTURA
                  </option>
                  <option value={'03'} selected={tipoDocumento.value === '03'}>
                    BOLETA
                  </option>
                  <option value={'07'} selected={tipoDocumento.value === '07'}>
                    NOTA DE CRÉDITO
                  </option>
                  <option value={'08'} selected={tipoDocumento.value === '08'}>
                    NOTA DE DÉBITO
                  </option>
                </select>
              </div>
            </div>
            {/* Serie  */}
            {/*  <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                {
                  <select
                    id="selectSerieVenta"
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];

                      definicion_CTX_F_B_NC_ND.idSerieVenta = elOption.id;
                      definicion_CTX_F_B_NC_ND.serie = (e.target as HTMLSelectElement).value;
                      document.getElementById('in_Fecha')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione una serie --</option>
                    {dataSerie.value.map((ser: any) => {
                      return (
                        <option id={ser._id} value={ser.serie} selected={definicion_CTX_F_B_NC_ND.serie === ser.serie}>
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                }
              </div>
            </div>
            {/* fecha    */}
            {/* <div class="form-control">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Fecha_Para_Venta"
                  type="date"
                  // disabled
                  min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_F_B_NC_ND.fecha}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.fecha = (e.target as HTMLInputElement).value;
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <br></br> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            {/* <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <strong style={{ fontSize: '0.9rem', fontWeight: '400', paddingLeft: '4px', paddingRight: '24px' }}>IGV</strong>
                <input type="text" id="inputIGV" disabled value={definicion_CTX_F_B_NC_ND.igv + ' %'} style={{ width: '100%' }} />
              </div>
            </div>
            {/* Tipo Cambio    */}
            {/* <div class="form-control">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '3px' }}>
                <input
                  type="checkbox"
                  id="chbx_TipoCambio_Para_Venta"
                
                  onClick$={(e) => {
                    if (definicion_CTX_F_B_NC_ND.fecha === '') {
                      alert('Ingrese la fecha para esta venta');
                      (e.target as HTMLInputElement).checked = false;
                      document.getElementById('in_Fecha_Para_Venta')?.focus();
                      return;
                    }
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  }}
                />
                <strong
                  style={{ fontSize: '0.9rem', fontWeight: '400', cursor: 'pointer' }}
                  onClick$={() => {
                    if ((document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked === false) {
                      if (definicion_CTX_F_B_NC_ND.fecha === '') {
                        alert('Ingrese la fecha para esta venta');
                        // (e.target as HTMLInputElement).checked = false;
                        (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                        document.getElementById('in_Fecha_Para_Venta')?.focus();
                        return;
                      }
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = true;
                    } else {
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                      // definicion_CTX_F_B_NC_ND.enDolares = false;
                    }
                    obtenerTipoCambio(document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement);
                    // document.getElementById('chbx_TipoCambio_Para_Venta')?.onclick;
                  }}
                >
                  USD
                </strong>
              </div>
              <div class="form-control form-agrupado">
                <input
                  id="inputTipoCambio"
                  type="number"
                  value={definicion_CTX_F_B_NC_ND.tipoCambio}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <br></br> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* VENDEDOR - METODO DE PAGO */}
          <div>
            {/* Método Pago */}
            {/* <div class="form-control">
              <label>Método de pago</label>
              <div class="form-control form-agrupado" style={{ display: 'flex' }}>
                <select
                  id="metodoPago"
                  value={definicion_CTX_F_B_NC_ND.metodoPago}
                  // onChange={changeMetodoPago}
                  onChange$={() => {
                    definicion_CTX_F_B_NC_ND.verCuotasCredito = !definicion_CTX_F_B_NC_ND.verCuotasCredito;
                  }}
                  style={definicion_CTX_F_B_NC_ND.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                >
                  <option value={'CONTADO'}>CONTADO</option>
                  <option value={'CRÉDITO'}>CRÉDITO</option>
                </select>
                {definicion_CTX_F_B_NC_ND.verCuotasCredito && (
                  <button
                    id="addCuota"
                    class="btn"
                    title="Adicionar cuota"
                    onClick$={() => {
                      (cuota.idAuxiliar = parseInt(elIdAuxiliar())),
                        (cuota.fechaCuota = hoy()),
                        (cuota.importeCuotaPEN = 0),
                        (cuotaCredito_esEdit.value = false);
                      definicion_CTX_ADD_VENTA.mostrarPanelCuotasCredito = true;
                      definicion_CTX_ADD_VENTA.grabo_CuotaCredito = false;
                    }}
                  >
                    Add cuota
                  </button>
                )}
              </div>
            </div>
            {!definicion_CTX_F_B_NC_ND.verCuotasCredito && (
              <div>
                <input
                  type="radio"
                  value="Todo en efectivo"
                  id="Todo en efectivo"
                  name="Contado"
                  checked={definicion_CTX_F_B_NC_ND.todoEnEfectivo}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.todoEnEfectivo = (e.target as HTMLInputElement).checked;
                    definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = !definicion_CTX_F_B_NC_ND.todoEnEfectivo;
                  }}
                />
                <label for="Todo en efectivo">Todo en efectivo</label>
                <br></br>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <input
                      type="radio"
                      value="Una parte en efectivo"
                      id="Una parte en efectivo"
                      name="Contado"
                      checked={definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                      onChange$={(e) => {
                        definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
                        definicion_CTX_F_B_NC_ND.todoEnEfectivo = !definicion_CTX_F_B_NC_ND.unaParteEnEfectivo;
                      }}
                    />
                    <label for="Una parte en efectivo">Una parte en efectivo</label>
                  </div>
                  <input
                    type="number"
                    id="inputMontoEnEfectivo"
                    placeholder="Efectivo"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.montoEnEfectivo}
                    onChange$={(e) => (definicion_CTX_F_B_NC_ND.montoEnEfectivo = (e.target as HTMLInputElement).value)}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('select_contado')?.focus();
                      }
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <select
                    id="select_contado"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.otroMedioPago}
                    onChange$={(e) => {
                      definicion_CTX_F_B_NC_ND.otroMedioPago = (e.target as HTMLSelectElement).value;
                      document.getElementById('in_otroMedio')?.focus();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('inputMontoOtroMedioPago')?.focus();
                      }
                    }}
                  >
                    <option value={'TRANSFERENCIA DE FONDOS'}>TRANSFERENCIA DE FONDOS</option>
                    <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                    <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                    <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                  </select>
                  <input
                    type="number"
                    id="inputMontoOtroMedioPago"
                    placeholder="Otro medio"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.montoOtroMedioPago}
                    onChange$={(e) => (definicion_CTX_F_B_NC_ND.montoOtroMedioPago = (e.target as HTMLInputElement).value)}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('btnVerAlmacen')?.focus();
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {definicion_CTX_ADD_VENTA.mostrarPanelCuotasCredito && (
              <div class="modal">
                <NewEditCuotaCreditoVenta
                  ancho={280}
                  esEdit={cuotaCredito_esEdit.value}
                  cuota={cuota}
                  
                />
              </div>
            )}
            {/* TABLA DE CUOTAS DE PAGO venta.verCuotasCredito &&   ctx_PanelVenta.grabo_cuotas_numero &&*/}
            {/* {
              <div class="form-control">
                {definicion_CTX_F_B_NC_ND.cuotasCredito.length > 0 ? (
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter', margin: '5px 0' }}>
                    <thead>
                      <tr>
                        <th>Nro. Cuota</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_F_B_NC_ND.cuotasCredito.map((value: any, index: any) => {
                        const indexItem = index + 1;
                        sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

                       
                        return (
                          <tr key={value.idAuxiliar}>
                            <td data-label="Nro. Cuota" key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                            <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
                            <td data-label="Importe" style={{ textAlign: 'end' }}>
                           
                              {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                            <td data-label="Acciones" style={{ textAlign: 'center' }}>
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={12}
                                width={12}
                                title="Editar ítem"
                             
                              />
                              <ImgButton
                                src={images.trash}
                                alt="icono de eliminar"
                                height={12}
                                width={12}
                                title="Eliminar ítem"
                               
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={2} style={{ textAlign: 'end' }}>
                          Suma Cuotas
                        </th>
                        <th colSpan={1} style={{ textAlign: 'end' }}>
                          {`${sumaCuotas.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                ) : definicion_CTX_F_B_NC_ND.verCuotasCredito ? (
                  <i style={{ fontSize: '0.7rem' }}>No existen cuotas de crédito</i>
                ) : (
                  ''
                )}
              </div>
            }

            <br></br> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div>
            {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#74a6ab' }}>
              <button
                id="btnVerAlmacen"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT = true)}
                style={{ cursor: 'pointer' }}
              >
                Ver almacén
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT && (
                <div class="modal">
                  <BuscarMercaderiaOUT contexto="new_venta" esAlmacen={false} />
                </div>
              )}
              <button
                id="btnAddServicio"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio = true)}
                style={{ cursor: 'pointer' }}
              >
                Add servicio
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio && (
                <div class="modal">
                  <BuscarServicio contexto="new_venta" />
                </div>
              )}
              <button id="btnAdjuntarOS" onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarOS = true)}>
                Adjuntar O.S.
              </button>
              {definicion_CTX_ADD_VENTA.mostrarAdjuntarOS && (
                <div class="modal">
                  <AdjuntarOrdenServicio />
                </div>
              )}
              <button
                id="btnAdjuntarCotizacion"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion = true)}
                style={{ cursor: 'pointer' }}
              >
                Adjuntar cotización
              </button>
              {definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion && (
                <div class="modal">
                  <AdjuntarCotizacion />
                </div>
              )}
            </div>
            <br></br> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* OBSERVACION */}
          <div>
            {/* OBSERVACION */}
            {/* <div class="form-control">
              <label>Observación</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_Observacion"
                  value={definicion_CTX_F_B_NC_ND.observacion}
                  style={{ width: '100%', background: 'yellow' }}
                  placeholder="Observación"
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                  }}
                />
              </div>
            </div>
            <br></br> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div class="form-control">
              {/* {definicion_CTX_F_B_NC_ND.itemsVenta.length > 0 ? (
                <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Uni</th>
                      <th>Precio Uni</th>
                      <th>Venta </th>
                      <th>Exo</th>
                      <th>Ina</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_F_B_NC_ND.itemsVenta.map((iTVen: any, index: number) => {
                      const indexItemVenta = index + 1;
                      let t_bi = 0,
                        t_igv = 0,
                        t_exo = 0,
                        t_ina = 0,
                        t_isc = 0,
                        t_icbp = 0,
                        t_otros = 0;
                      if (definicion_CTX_F_B_NC_ND.enDolares) {
                        if (iTVen.exonerado) {
                          t_exo = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        } else {
                          if (iTVen.inafecto) {
                            t_ina = redondeo2Decimales(
                              iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                            );
                          } else {
                            const vv = redondeo2Decimales(
                              iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                            );
                            t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                            t_igv = redondeo2Decimales(vv - t_bi);
                          }
                        }
                      } else {
                        if (iTVen.exonerado) {
                          t_exo = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        } else {
                          if (iTVen.inafecto) {
                            t_ina = redondeo2Decimales(
                              iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                            );
                          } else {
                            const vv = redondeo2Decimales(
                              iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                            );
                            t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                            t_igv = redondeo2Decimales(vv - t_bi);
                          }
                        }
                        // igvTOTAL = redondeo2Decimales(sumaTOTAL_IGV - subTOTAL);
                      }
                      (t_isc = t_isc + 0), (t_icbp = t_icbp + 0), (t_otros = t_otros + 0);
                      sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_icbp + t_otros;
                      sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                      sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                      sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                      sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                      sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                      sumaTOTAL_ICBP = sumaTOTAL_ICBP + t_icbp;
                      sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;
                      console.log(
                        `valores ${index + 1} : `,
                        sumaTOTAL,
                        sumaTOTAL_BI,
                        sumaTOTAL_IGV,
                        sumaTOTAL_EXO,
                        sumaTOTAL_INAFEC,
                        sumaTOTAL_ISC,
                        sumaTOTAL_ICBP,
                        sumaTOTAL_OTROS
                      );
                      if (index + 1 === definicion_CTX_F_B_NC_ND.itemsVenta.length) {
                        fijarMontos({
                          sumaTOTAL,
                          sumaTOTAL_BI,
                          sumaTOTAL_IGV,
                          sumaTOTAL_EXO,
                          sumaTOTAL_INAFEC,
                          sumaTOTAL_ISC,
                          sumaTOTAL_ICBP,
                          sumaTOTAL_OTROS,
                        });
                      }
                      return (
                        <tr key={iTVen.idAuxiliar}>
                          <td data-label="Ítem" key={iTVen.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(
                            indexItemVenta,
                            3
                          )}`}</td>
                          <td data-label="Código" class="comoCadena">
                            {iTVen.codigo}
                          </td>
                          <td data-label="Descripción" class="comoCadena">
                            {iTVen.descripcionEquivalencia}
                          </td>
                          {/* ----------------------------------------------------- */}
              {/*  <td data-label="Cantidad" class="comoNumero">
                            <input
                              type="number"
                              style={{ width: '60px', textAlign: 'end' }}
                              value={iTVen.cantidad.$numberDecimal ? iTVen.cantidad.$numberDecimal : iTVen.cantidad}
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                iTVen.cantidad = parseFloat((e.target as HTMLInputElement).value);
                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                            />
                          </td>
                          <td data-label="Uni" class="acciones">
                            {iTVen.unidadEquivalencia}
                          </td>
                          {/* ----------------------------------------------------- */}
              {/*  <td data-label="Precio Uni" class="comoNumero">
                            <input
                              type="number"
                              style={{ width: '60px', textAlign: 'end' }}
                              value={
                                definicion_CTX_F_B_NC_ND.enDolares
                                  ? iTVen.precioUSD.$numberDecimal
                                    ? iTVen.precioUSD.$numberDecimal
                                    : iTVen.precioUSD
                                  : iTVen.precioPEN.$numberDecimal
                                  ? iTVen.precioPEN.$numberDecimal
                                  : iTVen.precioPEN
                              }
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                const precio = parseFloat((e.target as HTMLInputElement).value);

                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.precioUSD = precio;
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.precioPEN = precio;

                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                            />
                          </td>
                          {/* ----------------------------------------------------- */}
              {/*   <td data-label="Venta" class="comoNumero">
                            {iTVen.ventaPEN ? iTVen.ventaPEN : iTVen.ventaPEN.$numberDecimal}
                          </td>
                          <td data-label="Exo" class="acciones">
                            {iTVen.exonerado ? 'Si' : '-'}
                          </td>
                          <td data-label="Ina" class="acciones">
                            {iTVen.inafecto ? 'Si' : '-'}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              height={12}
                              width={12}
                              style={{ margin: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                borrarItemVenta.idAuxiliar = iTVen.idAuxiliar;
                                // borrarItemVenta.item = indexItemServi;
                                borrarItemVenta.codigo = iTVen.codigo;
                                borrarItemVenta.descripcion = iTVen.descripcionEquivalencia;
                                definicion_CTX_ADD_VENTA.mostrarPanelBorrarItemVenta = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Base Imponible
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_BI.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>

                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Exoneredo
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_EXO.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Inafecto
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_INAFEC.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        IGV
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_IGV.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>{' '}
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Total
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>{' '}
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen ítems para la venta</i>
              )} */}
              {/* {definicion_CTX_ADD_VENTA.mostrarPanelBorrarItemVenta && (
                <div class="modal">
                  <BorrarItemVenta borrarItemVenta={borrarItemVenta} />
                </div>
              )} */}
            </div>
          }
        </div>
        {/* <input
          type="submit"
          value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          class="btn-centro"
          onClick$={() => grabandoVenta()}
        /> */}
        {/* {pasoProcesoGrabacion.value &&
          (grabo.value ? (
            <label style={{ color: 'green' }}>Registro SATISFACTORIO!!!</label>
          ) : (
            <label style={{ color: 'red' }}>Inconveniente en registro.</label>
          ))} */}
      </div>
    </div>
  );
});
