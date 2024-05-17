import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import type { IGuiaRemision } from '~/interfaces/iGuiaRemision';
import { parametrosGlobales } from '~/routes/login';
import { CTX_INDEX_GUIA_REMISION } from '~/routes/(guiasRemision)/guiaRemision';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import type { IPersona } from '~/interfaces/iPersona';
import { cerosALaIzquierda, ultimoDiaDelPeriodoX } from '~/functions/comunes';
import BuscarMercaderiaIN from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';
import ElButton from '../system/elButton';
import BorrarChofer from './borrarChofer';
import BorrarUnidadTransporte from './borrarUnidadTransporte';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
// import NewEditUnidadTransporte from './newEditUnidadTransporte';
// import NewEditChofer from './newEditChofer';
import BuscarChofer from '../miscelanea/chofer/buscarChofer';
import BuscarUnidadTransporte from '../miscelanea/unidadTransporte/buscarUnidadTransporte';

export const CTX_NEW_EDIT_GUIA_REMISION = createContextId<any>('__new_edit_guia_remision');
export const CTX_GUIA_REMISION = createContextId<IGuiaRemision>('__guia_remision');
export const CTX_DESTINATARIO_GR = createContextId<any>('__destinatario');

export default component$((props: { addPeriodo: any; guiaRemisionSeleccionada: any }) => {
  //#region DEFINICION CTX_NEW_EDIT_GUIA_REMISON
  const definicion_CTX_NEW_EDIT_GUIA_REMISION = useStore({
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    mostrarVerAlmacen: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersonaRemitente: false,
    mostrarPanelBuscarServicio: false,

    mostrarPanelBuscarMercaderiaIN: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelBuscarPersonaDestinatario: false,

    mostrarPanelBuscarPersonaTransportista: false,

    mostrarPanelBuscarChofer: false,
    selecciono_Chofer: false,
    mostrarPanelDeleteChofer: false,
    borrarIdAuxiliarChofer: 0,
    mostrarPanelBuscarPersonaChofer: false,

    mostrarPanelBuscarUnidadTransporte: false,
    selecciono_UnidadTransporte: false,
    mostrarPanelUnidadTransporte: false,
    mostrarPanelDeleteUnidadTransporte: false,

    // mostrarAdjuntarOS: false,
    // mostrarAdjuntarCotizacion: false,

    // mostrarPanelBorrarItemVenta: false,
    // borrar_idAuxilarVenta: 0,
  });
  useContextProvider(CTX_NEW_EDIT_GUIA_REMISION, definicion_CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion DEFINICION CTX_NEW_EDIT_GUIA_REMISON

  //#region DEFINICION CTX_GUIA_REMISION
  const definicion_CTX_GUIA_REMISION = useStore<IGuiaRemision>(
    {
      _id: '',
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
      idPeriodo: props.addPeriodo.idPeriodo,
      periodo: props.addPeriodo.periodo,

      ruc: parametrosGlobales.RUC,
      empresa: parametrosGlobales.RazonSocial,
      direccion: parametrosGlobales.Direccion,

      idModalidadTraslado: '',
      modalidadTraslado: '',
      idMotivoTraslado: '',
      motivoTraslado: '',

      codigoTipoComprobantePago: '',
      tipoComprobantePago: '',
      idSerieVenta: '',
      serie: '',
      numero: 0,

      fecha: '',

      idRemitente: '',
      codigoTipoDocumentoIdentidadRemitente: '',
      tipoDocumentoIdentidadRemitente: 'RUC',
      numeroIdentidadRemitente: '',
      razonSocialNombreRemitente: '',

      idDestinatario: '',
      codigoTipoDocumentoIdentidadDestinatario: '',
      tipoDocumentoIdentidadDestinatario: 'RUC',
      numeroIdentidadDestinatario: '',
      razonSocialNombreDestinatario: '',

      idTransportista: '',
      codigoTipoDocumentoIdentidadTransportista: '',
      tipoDocumentoIdentidadTransportista: 'RUC',
      numeroIdentidadTransportista: '',
      razonSocialNombreTransportista: '',

      numeroBultosPallets: '',
      pesoBrutoTotal: '',

      choferes: [],
      unidadesTransporte: [],

      observacion: '',
    },
    { deep: true }
  );
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

  const elChofSelecionado = useSignal([]);
  const laUniSelecionada = useSignal([]);

  const borrarChofer = useStore({
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });
  const borrarUnidadTransporte = useStore({
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });
  //#endregion INICIALIZACION

  //#region REMITENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona &&
      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'remitente'
    ) {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idRemitente = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadRemitente =
        definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion REMITENTE

  //#region DESTINATARIO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona &&
      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'destinatario'
    ) {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idDestinatario = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadDestinatario =
        definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion DESTINATARIO

  //#region TRANSPORTISTA
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona &&
      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'transportista'
    ) {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idTransportista = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadTransportista =
        definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion TRANSPORTISTA

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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_guia_remision.grabo_GuiaRemision = grabo.value;
            ctx_index_guia_remision.mostrarPanelGuiaRemision = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>
        Guía de remisión - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
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
        <br />
        {/* ----------------------------------------------------- */}
        {/* FECHA */}
        <div class="form-control">
          <label>Fecha</label>
          <div class="form-control form-agrupado">
            <input
              id="in_Fecha_Para_Venta"
              type="date"
              // disabled
              min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
              max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
              value={definicion_CTX_GUIA_REMISION.fecha}
              onChange$={(e) => {
                definicion_CTX_GUIA_REMISION.fecha = (e.target as HTMLInputElement).value;
              }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <br />
        {/* ----------------------------------------------------- */}
        {/* MODALIDA - MOTIVO */}
        <div>
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_ModalidadTraslado"
                // value={6}
                value={definicion_CTX_GUIA_REMISION.modalidadTraslado}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.idModalidadTraslado = elOption.id;
                  definicion_CTX_GUIA_REMISION.modalidadTraslado = (e.target as HTMLSelectElement).value;
                }}
              >
                <option
                  id="01"
                  value="TRANSPORTE PÚBLICO"
                  selected={definicion_CTX_GUIA_REMISION.modalidadTraslado === 'TRANSPORTE PÚBLICO'}
                >
                  TRANSPORTE PÚBLICO
                </option>
                <option
                  id="02"
                  value="TRANSPORTE PRIVADO"
                  selected={definicion_CTX_GUIA_REMISION.modalidadTraslado === 'TRANSPORTE PRIVADO'}
                >
                  TRANSPORTE PRIVADO
                </option>
              </select>
            </div>
          </div>
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_MotivoTraslado"
                // value={6}
                value={definicion_CTX_GUIA_REMISION.motivoTraslado}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.idMotivoTraslado = elOption.id;
                  definicion_CTX_GUIA_REMISION.motivoTraslado = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="01" value="VENTA" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA'}>
                  VENTA
                </option>
                <option id="02" value="COMPRA" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'COMPRA'}>
                  COMPRA
                </option>
                <option
                  id="03"
                  value="VENTA CON ENTREGA A TERCEROS"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA CON ENTREGA A TERCEROS'}
                >
                  VENTA CON ENTREGA A TERCEROS
                </option>
                <option
                  id="04"
                  value="TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA'}
                >
                  TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA
                </option>
                <option id="05" value="CONSIGNACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'CONSIGNACIÓN'}>
                  CONSIGNACIÓN
                </option>
                <option id="06" value="DEVOLUCIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'DEVOLUCIÓN'}>
                  DEVOLUCIÓN
                </option>
                <option
                  id="07"
                  value="RECOJO DE BIENES TRANSFORMADOS"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'RECOJO DE BIENES TRANSFORMADOS'}
                >
                  RECOJO DE BIENES TRANSFORMADOS
                </option>
                <option id="08" value="IMPORTACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'IMPORTACIÓN'}>
                  IMPORTACIÓN
                </option>
                <option id="09" value="EXPORTACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'EXPORTACIÓN'}>
                  EXPORTACIÓN
                </option>
                <option id="13" value="OTROS" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'OTROS'}>
                  OTROS
                </option>
                <option
                  id="14"
                  value="VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR   "
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR   '}
                >
                  VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR
                </option>
                <option
                  id="17"
                  value="TRASLADO DE BIENES PARA TRANSFORMACIÓN"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO DE BIENES PARA TRANSFORMACIÓN'}
                >
                  TRASLADO DE BIENES PARA TRANSFORMACIÓN
                </option>
                <option
                  id="18"
                  value="TRASLADO EMISOR ITINERANTE CP"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO EMISOR ITINERANTE CP'}
                >
                  TRASLADO EMISOR ITINERANTE CP
                </option>
              </select>
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DEL REMITENTE */}
        <div>
          {/* tipo de documento identidad*/}
          <div class="form-control">
            <label>Tipo documento</label>
            <div class="form-control form-agrupado">
              <select
                id="select_TipoDocumentoLiteral_REMITENTE"
                disabled
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadRemitente = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'RUC'}>
                  RUC
                </option>
                <option id="4" value="C.EXT" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'C.EXT'}>
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
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaRemitente = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaRemitente && (
            <div class="modal">
              <BuscarPersona
                soloPersonasNaturales={false}
                seleccionar="remitente"
                contexto="new_edit_guiaRemision"
                rol="remitente"
              />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <label>Número identidad</label>
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_REMITENTE"
                type="number"
                placeholder="Número Identidad Remitente"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <label>Razón social / Nombre</label>
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_REMITENTE"
                type="text"
                placeholder="Razón social / Nombre Remitente"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente}
              />
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DEL DESTINATARIO */}
        <div>
          {/* tipo de documento identidad*/}
          <div class="form-control">
            <label>Tipo documento</label>
            <div class="form-control form-agrupado">
              <select
                id="select_TipoDocumentoLiteral_DESTINATARIO"
                disabled
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadDestinatario = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'RUC'}>
                  RUC
                </option>
                <option
                  id="4"
                  value="C.EXT"
                  selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'C.EXT'}
                >
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
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaDestinatario = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaDestinatario && (
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
                id="input_NumeroDocumentoIdentidad_DESTINATARIO"
                type="number"
                placeholder="Número Identidad Destinatario"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario}
                onChange$={(e) =>
                  (definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario = (e.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <label>Razón social / Nombre</label>
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_DESTINATARIO"
                type="text"
                placeholder="Razón social / Nombre Destinatario"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario}
              />
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DEL TRANSPORTISTA */}
        <div>
          {/* tipo de documento identidad*/}
          <div class="form-control">
            <label>Tipo documento</label>
            <div class="form-control form-agrupado">
              <select
                id="select_TipoDocumentoLiteral_TRANSPORTISTA"
                disabled
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadTransportista = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'RUC'}>
                  RUC
                </option>
                <option
                  id="4"
                  value="C.EXT"
                  selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'C.EXT'}
                >
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
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaTransportista = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaTransportista && (
            <div class="modal">
              <BuscarPersona
                soloPersonasNaturales={false}
                seleccionar="transportista"
                contexto="new_edit_guiaRemision"
                rol="transportista"
              />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <label>Número identidad</label>
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_TRANSPORTISTA"
                type="number"
                placeholder="Número Identidad Transportista"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista}
                onChange$={(e) =>
                  (definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista = (e.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <label>Razón social / Nombre</label>
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_TRANSPORTISTA"
                type="text"
                placeholder="Razón social / Nombre Transportista"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista}
              />
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* CHOFERES */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <ElButton
                id="btn_Add_Chofer"
                class="btn"
                name="Add chofer"
                title="Add chofer"
                onClick={$(() => {
                  elChofSelecionado.value = [];
                  definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarChofer = true;
                })}
              />
            </div>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarChofer && (
              <div class="modal">
                <BuscarChofer contexto="new_edit_guiaRemision" />
                {/* <NewEditChofer choferSeleccionado={elChofSelecionado.value} /> */}
              </div>
            )}
            {/* TABLA CHOFERES   */}
            {definicion_CTX_GUIA_REMISION.choferes.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Tipo</th>
                    <th>Número</th>
                    <th>Nombre</th>
                    <th>Licencia</th>
                    <th>Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_GUIA_REMISION.choferes.map((iTChof: any, index: number) => {
                    const indexItemChof = index + 1;

                    return (
                      <tr key={iTChof.idAuxiliar}>
                        <td data-label="Ítem">{cerosALaIzquierda(indexItemChof, 3)}</td>
                        <td data-label="Tipo">{iTChof.tipoDocumentoIdentidad}</td>
                        <td data-label="Número">{iTChof.numeroIdentidad}</td>
                        <td data-label="Nombre">{iTChof.razonSocialNombre}</td>
                        <td data-label="Licencia">{iTChof.licencia}</td>
                        <td data-label="Acc" class="accionesLeft">
                          <input
                            type="image"
                            src={images.edit}
                            title="Editar ítem"
                            alt="icono de editar"
                            disabled
                            height={14}
                            width={14}
                            style={{ marginRight: '4px' }}
                            // onClick$={() => {
                            //   elChofSelecionado.value = iTChof;
                            //   definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelChofer = true;
                            // }}
                          />
                          <input
                            type="image"
                            src={images.trash}
                            title="Eliminar ítem"
                            alt="icono de eliminar"
                            height={14}
                            width={14}
                            onClick$={() => {
                              borrarChofer.idAuxiliar = iTChof.idAuxiliar;
                              // borrarChofer.codigoTCP = iTChof.codigoTCP;
                              // borrarChofer.descripcionTCP = iTChof.descripcionTCP;
                              // borrarChofer.fecha = iTChof.fecha;
                              // borrarChofer.serie = iTChof.serie;
                              // borrarChofer.numero = iTChof.numero;
                              definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteChofer = true;
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen ningún chofer</i>
            )}
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteChofer && (
              <div class="modal">
                <BorrarChofer borrarChofer={borrarChofer} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* UNIDADES DE TRANSPORTE */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <ElButton
                id="bu_Add_UnidadTransporte"
                class="btn"
                name="Add unidad de transporte"
                title="Add unidad de transporte"
                onClick={$(() => {
                  laUniSelecionada.value = [];
                  definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarUnidadTransporte = true;
                })}
              />
            </div>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarUnidadTransporte && (
              <div class="modal">
                <BuscarUnidadTransporte contexto="new_edit_guiaRemision" />
              </div>
            )}
            {/* TABLA UNIDADES DE TRANSPORTE   */}
            {definicion_CTX_GUIA_REMISION.unidadesTransporte.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Tarj.Circul./Certif.Habilit.</th>
                    <th>Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_GUIA_REMISION.unidadesTransporte.map((iTUnidadTra: any, index: number) => {
                    const indexItemUT = index + 1;

                    return (
                      <tr key={iTUnidadTra.idAuxiliar}>
                        <td data-label="Ítem">{indexItemUT}</td>
                        <td data-label="Placa">{iTUnidadTra.placa}</td>
                        <td data-label="Marca">{iTUnidadTra.vehiculoMarca}</td>
                        <td data-label="Modelo">{iTUnidadTra.vehiculoModelo}</td>
                        <td data-label="Tarj.Circul./Certif.Habilit.">{iTUnidadTra.tarjetaCirculacionCertificadoHabilitacion}</td>
                        <td data-label="Acc" class="accionesLeft">
                          {/* <input
                            type="image"
                            src={images.edit}
                            title="Editar ítem"
                            alt="icono de editar"
                            height={14}
                            width={14}
                            style={{ marginRight: '4px' }}
                            onClick$={() => {
                              laUniSelecionada.value = iTUnidadTra;
                              definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelEditarUnidadTransporte = true;
                            }}
                          /> */}
                          <input
                            type="image"
                            src={images.trash}
                            title="Eliminar ítem"
                            alt="icono de eliminar"
                            height={14}
                            width={14}
                            // onClick$={() => {
                            //   borrarDocumento.idAuxiliar = iTDocAdj.idAuxiliar;
                            //   borrarDocumento.codigoTCP = iTDocAdj.codigoTCP;
                            //   borrarDocumento.descripcionTCP = iTDocAdj.descripcionTCP;
                            //   borrarDocumento.fecha = iTDocAdj.fecha;
                            //   borrarDocumento.serie = iTDocAdj.serie;
                            //   borrarDocumento.numero = iTDocAdj.numero;
                            //   definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteDocumentoIN = true;
                            // }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen ninguna unidad de transporte</i>
            )}
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteUnidadTransporte && (
              <div class="modal">
                <BorrarUnidadTransporte borrarUnidadTransporte={borrarUnidadTransporte} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BULTOS / PALLETS / PESO BRUTO*/}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <input
                id="input_BultosPallets_GR"
                type="number"
                placeholder="Número bultos o pallets"
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroBultosPallets}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroBultosPallets = (e.target as HTMLInputElement).value)}
              />
            </div>
            <div>
              <input
                id="input_PesoBrutoTotal_GR"
                type="number"
                placeholder="Peso bruto total"
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.pesoBrutoTotal}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.pesoBrutoTotal = (e.target as HTMLInputElement).value)}
              />
              <label>KGM</label>
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* OBSERVACION */}
        <div>
          {/* OBSERVACION */}
          <div class="form-control">
            <label>Observación</label>
            <div class="form-control form-agrupado">
              <input
                type="text"
                id="in_Observacion"
                value={definicion_CTX_GUIA_REMISION.observacion}
                style={{ width: '100%', background: 'yellow' }}
                placeholder="Observación"
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BOTONES */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#74a6ab' }}>
            <button
              id="btn_VerAlmacen_IN_GR"
              onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarMercaderiaIN = true)}
              style={{ cursor: 'pointer' }}
            >
              Ingreso Mercadería
            </button>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarMercaderiaIN && (
              <div class="modal">
                <BuscarMercaderiaIN contexto="new_edit_guiaRemision" esAlmacen={false} igv={18} />
              </div>
            )}
            <button
              id="btn_VerAlmacen_OUT_GR"
              onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarMercaderiaOUT = true)}
              style={{ cursor: 'pointer' }}
            >
              Salida Mercadería
            </button>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarMercaderiaOUT && (
              <div class="modal">
                <BuscarMercaderiaOUT contexto="new_edit_guiaRemision" esAlmacen={false} porcentaje={18} />
              </div>
            )}
          </div>
          <br />
        </div>

        {/* ----------------------------------------------------- */}
        {/* ----------------------------------------------------- */}
        {/* ----------------------------------------------------- */}
        {/*  tabla ITEMS - GUIA REMISION */}
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
        <input
          type="submit"
          // value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          class="btn-centro"
          // onClick$={() => grabandoVenta()}
        />
        {/* *************** */}
      </div>
    </div>
  );
});
