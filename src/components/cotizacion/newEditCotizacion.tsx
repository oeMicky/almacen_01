import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, redondeo2Decimales, ultimoDiaDelPeriodoX } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import { CTX_INDEX_COTIZACION } from '~/routes/(almacen)/cotizacion';
import { IPersona } from '~/interfaces/iPersona';
import { ICotizacion } from '~/interfaces/iCotizacion';
import ElButton from '../system/elButton';
import style from '../tabla/tabla.css?inline';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import BuscarVehiculo from '../miscelanea/vehiculo/buscarVehiculo';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import BuscarServicio from '../miscelanea/servicio/buscarServicio';
import {
  deRepuestosLubriCotizacion,
  deServicioCotizacion,
  getSeriesActivasCotizaciones,
  inUpCotizacion,
} from '~/apis/cotizacion.api';
import BorrarServicio from './borrarServicio';

export const CTX_COTIZACION = createContextId<ICotizacion>('cotizacion');

export const CTX_CLIENTE_COTIZACION = createContextId<IPersona>('cliente');

export const CTX_NEW_EDIT_COTIZACION = createContextId<any>('new_edit_cotizacion');

export default component$((props: { addPeriodo: any; cotizacionSelecci: any; igv: any }) => {
  useStylesScoped$(style);

  //#region DEFINICION CTX_NEW_EDIT_COTIZACION
  const definicion_CTX_NEW_EDIT_COTIZACION = useStore({
    // idSerieCotizacion: '',
    // serieCotizacion: '',

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,

    mostrarPanelBuscarVehiculo: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelDeleteItemServicio: false,
    borrarServicio: [],
    borrarIdServicio: '',
    borrarIdAuxiliarServicio: 0,

    mostrarPanelDeleteItemRepuestoLubri: false,
    borrarRepuestoLubri: [],
    borrarIdRepuestoLubri: '',
    borrarIdAuxiliarRepuestoLubri: 0,
  });
  useContextProvider(CTX_NEW_EDIT_COTIZACION, definicion_CTX_NEW_EDIT_COTIZACION);
  //#endregion DEFINICION CTX_NEW_EDIT_COTIZACION

  //#region DEFINICION CTX_COTIZACION - NEW / EDIT
  const definicion_CTX_COTIZACION = useStore<ICotizacion>(
    {
      _id: props.cotizacionSelecci._id ? props.cotizacionSelecci._id : '',

      idGrupoEmpresarial: props.cotizacionSelecci.idGrupoEmpresarial
        ? props.cotizacionSelecci.idGrupoEmpresarial
        : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.cotizacionSelecci.idEmpresa ? props.cotizacionSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idSucursal: props.cotizacionSelecci.idSucursal ? props.cotizacionSelecci.idSucursal : parametrosGlobales.idSucursal,
      idPeriodo: props.cotizacionSelecci.idPeriodo ? props.cotizacionSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.cotizacionSelecci.periodo ? props.cotizacionSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.cotizacionSelecci.ruc ? props.cotizacionSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.cotizacionSelecci.empresa ? props.cotizacionSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.cotizacionSelecci.direccion ? props.cotizacionSelecci.direccion : parametrosGlobales.Direccion,

      fecha: props.cotizacionSelecci.fecha ? props.cotizacionSelecci.fecha.substring(0, 10) : '',

      idSerieCotizacion: props.cotizacionSelecci.idSerieCotizacion ? props.cotizacionSelecci.idSerieCotizacion : '',
      serie: props.cotizacionSelecci.serie ? props.cotizacionSelecci.serie : '',
      numero: props.cotizacionSelecci.numero ? props.cotizacionSelecci.numero : 0,

      //correlativo: props.cotizacionSelecci.correlativo ? props.cotizacionSelecci.correlativo : 0,

      idCliente: props.cotizacionSelecci.idCliente ? props.cotizacionSelecci.idCliente : '',
      codigoTipoDocumentoIdentidad: props.cotizacionSelecci.codigoTipoDocumentoIdentidad
        ? props.cotizacionSelecci.codigoTipoDocumentoIdentidad
        : '',
      tipoDocumentoIdentidad: props.cotizacionSelecci.tipoDocumentoIdentidad
        ? props.cotizacionSelecci.tipoDocumentoIdentidad
        : '',
      numeroIdentidad: props.cotizacionSelecci.numeroIdentidad ? props.cotizacionSelecci.numeroIdentidad : '',
      razonSocialNombre: props.cotizacionSelecci.razonSocialNombre ? props.cotizacionSelecci.razonSocialNombre : '',
      email: props.cotizacionSelecci.email ? props.cotizacionSelecci.email : '',

      idVehiculo: props.cotizacionSelecci.idVehiculo ? props.cotizacionSelecci.idVehiculo : null, // '',
      placa: props.cotizacionSelecci.placa ? props.cotizacionSelecci.placa : '',
      idVehiculoMarca: props.cotizacionSelecci.idVehiculoMarca ? props.cotizacionSelecci.idVehiculoMarca : null, //'',
      vehiculoMarca: props.cotizacionSelecci.vehiculoMarca ? props.cotizacionSelecci.vehiculoMarca : '',
      idVehiculoModelo: props.cotizacionSelecci.idVehiculoModelo ? props.cotizacionSelecci.idVehiculoModelo : null, //'',
      vehiculoModelo: props.cotizacionSelecci.vehiculoModelo ? props.cotizacionSelecci.vehiculoModelo : '',
      vin: props.cotizacionSelecci.vin ? props.cotizacionSelecci.vin : '',

      // idElIgv: props.cotizacionSelecci.idElIgv ? props.cotizacionSelecci.idElIgv : props.igvPorDefault.idElIgv,
      // elIgv: props.cotizacionSelecci.elIgv ? props.cotizacionSelecci.elIgv : props.igvPorDefault.elIgv,
      igv: props.cotizacionSelecci.igv ? props.cotizacionSelecci.igv : props.igv,

      servicios: props.cotizacionSelecci.servicios ? props.cotizacionSelecci.servicios : [],
      repuestosLubri: props.cotizacionSelecci.repuestosLubri ? props.cotizacionSelecci.repuestosLubri : [],

      montoSubTotalPEN: props.cotizacionSelecci.montoSubTotalPEN ? props.cotizacionSelecci.montoSubTotalPEN : 0,
      montoIGVPEN: props.cotizacionSelecci.montoIGVPEN ? props.cotizacionSelecci.montoIGVPEN : 0,
      montoTotalPEN: props.cotizacionSelecci.montoTotalPEN ? props.cotizacionSelecci.montoTotalPEN : 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_COTIZACION, definicion_CTX_COTIZACION);
  //#endregion DEFINICION CTX_COTIZACION - NEW / EDIT

  //#region DEFINICION CTX_CLIENTE_SELECCIONADO
  const defini_CTX_CLIENTE_COTIZACION = useStore<IPersona>({
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
  useContextProvider(CTX_CLIENTE_COTIZACION, defini_CTX_CLIENTE_COTIZACION);
  //#endregion DEFINICION CTX_CLIENTE_SELECCIONADO

  //#region CONTEXTO
  const ctx_index_cotizacion = useContext(CTX_INDEX_COTIZACION);
  // const ctx_docs_cotizacion = useContext(CTX_DOCS_COTIZACION);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  // const igvPorDefault = useStore({ idElIgv: '', elIgv: '' });
  // const idSerieCotizacion = useSignal('');
  // const serieCotizacion = useSignal('');
  const dataSerie = useSignal([]);

  let sumaTOTAL_SERVI = 0;
  let subTOTAL_SERVI = 0;
  let igvTOTAL_SERVI = 0;

  let sumaTOTAL_REP_LUB = 0;
  let subTOTAL_REP_LUB = 0;
  let igvTOTAL_REP_LUB = 0;

  useTask$(async ({ track }) => {
    track(() => {
      ini.value;
    });
    if (definicion_CTX_COTIZACION.idSerieCotizacion === '') {
      // obtenerSerie();
      const parametros = {
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      };
      //
      const lasSeries = await getSeriesActivasCotizaciones(parametros);
      dataSerie.value = lasSeries.data;
      console.log('dataSerie.value', dataSerie.value);
    }
  });
  //#endregion INICIALIZACION

  //#region BORRAR SERVICIO
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarServicio);

    if (definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarServicio > 0) {
      //borrar en la BD
      if (
        definicion_CTX_COTIZACION._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_COTIZACION.borrarIdServicio !== 'undefined' &&
        definicion_CTX_NEW_EDIT_COTIZACION.borrarIdServicio !== ''
      ) {
        // console.log(
        //   'desvincular SERIE COTIZACION -  en la BD...',
        //   definicion_CTX_NEW_EDIT_SUCURSALES_ADJUNTAS.desvincular_IdSucursal
        // );
        await deServicioCotizacion({
          idCotizacion: definicion_CTX_COTIZACION._id,
          idServicio: definicion_CTX_NEW_EDIT_COTIZACION.borrarIdServicio,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_COTIZACION.servicios.filter(
        (KKK: any) => KKK.idAuxiliar !== definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarServicio
      );
      console.log('newItems', newItems);
      definicion_CTX_COTIZACION.servicios = newItems;

      definicion_CTX_NEW_EDIT_COTIZACION.borrarIdServicio = '';
      definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarServicio = 0;
      definicion_CTX_NEW_EDIT_COTIZACION.borrarServicio = [];
    }
  });
  //#endregion BORRAR SERVICIO

  //#region BORRAR REPUESTO LUBRICANTE
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarRepuestoLubri);

    if (definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarRepuestoLubri > 0) {
      //borrar en la BD
      if (
        definicion_CTX_COTIZACION._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_COTIZACION.borrarIdRepuestoLubri !== 'undefined' &&
        definicion_CTX_NEW_EDIT_COTIZACION.borrarIdRepuestoLubri !== ''
      ) {
        // console.log(
        //   'desvincular SERIE COTIZACION -  en la BD...',
        //   definicion_CTX_NEW_EDIT_SUCURSALES_ADJUNTAS.desvincular_IdSucursal
        // );
        await deRepuestosLubriCotizacion({
          idCotizacion: definicion_CTX_COTIZACION._id,
          idServicio: definicion_CTX_NEW_EDIT_COTIZACION.borrarIdRepuestoLubri,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_COTIZACION.servicios.filter(
        (KKK: any) => KKK.idAuxiliar !== definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarRepuestoLubri
      );
      console.log('newItems', newItems);
      definicion_CTX_COTIZACION.servicios = newItems;

      definicion_CTX_NEW_EDIT_COTIZACION.borrarIdServicio = '';
      definicion_CTX_NEW_EDIT_COTIZACION.borrarIdAuxiliarRepuestoLubri = 0;
      definicion_CTX_NEW_EDIT_COTIZACION.borrarRepuestoLubri = [];
    }
  });
  //#endregion BORRAR REPUESTO LUBRICANTE

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_COTIZACION.selecciono_Persona);
    // console.log(
    //   'evalua a la persona 00',
    //   definicion_CTX_NEW_EDIT_COTIZACION.selecciono_Persona,
    //   definicion_CTX_NEW_EDIT_COTIZACION.rol_Persona
    // );
    if (definicion_CTX_NEW_EDIT_COTIZACION.selecciono_Persona && definicion_CTX_NEW_EDIT_COTIZACION.rol_Persona === 'cliente') {
      // alert('evalua a la persona 01');
      definicion_CTX_COTIZACION.idCliente = defini_CTX_CLIENTE_COTIZACION._id;
      definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_COTIZACION.codigoTipoDocumentoIdentidad;
      definicion_CTX_COTIZACION.tipoDocumentoIdentidad = defini_CTX_CLIENTE_COTIZACION.tipoDocumentoIdentidad;
      definicion_CTX_COTIZACION.numeroIdentidad = defini_CTX_CLIENTE_COTIZACION.numeroIdentidad;
      definicion_CTX_COTIZACION.razonSocialNombre = defini_CTX_CLIENTE_COTIZACION.razonSocialNombre;

      definicion_CTX_NEW_EDIT_COTIZACION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_COTIZACION.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region REGISTRAR COTIZACION
  const registrarCotizacion = $(async () => {
    if (definicion_CTX_COTIZACION.periodo.toString() === '') {
      alert('Ingrese el periodo');
      document.getElementById('in_Periodo')?.focus();
      return;
    }
    if (definicion_CTX_COTIZACION.idSerieCotizacion === '') {
      alert('Ingrese la serie');
      document.getElementById('selectSerieCotizacion')?.focus();
      return;
    }
    if (definicion_CTX_COTIZACION.fecha === '') {
      alert('Ingrese la fecha');
      document.getElementById('in_Fecha')?.focus();
      return;
    }
    // if (definicion_CTX_COTIZACION.numero.toString() === '' || definicion_CTX_COTIZACION.numero.toString() === 'NaN') {
    //   alert('Ingrese el número valido');
    //   document.getElementById('in_Numero')?.focus();
    //   return;
    // }
    // if (!parseInt(definicion_CTX_COTIZACION.numero.toString())) {
    //   alert('No es un número valido, ingrese el número ' + parseInt(definicion_CTX_COTIZACION.numero.toString()));
    //   document.getElementById('in_Numero')?.focus();
    //   return;
    // } else {
    //   console.log('num', parseInt(definicion_CTX_COTIZACION.numero.toString()));
    // }
    if (definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad === '') {
      alert('Identifique al cliente :|');
      document.getElementById('in_NumeroDocumentoIdentidad')?.focus();
      return;
    }
    if (definicion_CTX_COTIZACION.numeroIdentidad === '') {
      alert('Identifique al cliente (N.I.)');
      document.getElementById('img_buscarCliente')?.focus();
      return;
    }
    if (definicion_CTX_COTIZACION.razonSocialNombre === '') {
      alert('Identifique al cliente (R.S./N.)');
      document.getElementById('img_buscarCliente')?.focus();
      return;
    }
    //
    console.log('definicion_CTX_COTIZACION', definicion_CTX_COTIZACION);

    //enviar datos al SERVIDOR
    const coti = await inUpCotizacion({
      idCotizacion: definicion_CTX_COTIZACION._id,
      idGrupoEmpresarial: definicion_CTX_COTIZACION.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_COTIZACION.idEmpresa,
      idSucursal: definicion_CTX_COTIZACION.idSucursal,
      idPeriodo: definicion_CTX_COTIZACION.idPeriodo,
      periodo: definicion_CTX_COTIZACION.periodo,

      ruc: definicion_CTX_COTIZACION.ruc,
      empresa: definicion_CTX_COTIZACION.empresa,
      direccion: definicion_CTX_COTIZACION.direccion,

      fecha: definicion_CTX_COTIZACION.fecha,

      idSerieCotizacion: definicion_CTX_COTIZACION.idSerieCotizacion,
      serie: definicion_CTX_COTIZACION.serie,
      numero: definicion_CTX_COTIZACION.numero,
      //correlativo: definicion_CTX_COTIZACION.correlativo,

      idCliente: definicion_CTX_COTIZACION.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_COTIZACION.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_COTIZACION.numeroIdentidad,
      razonSocialNombre: definicion_CTX_COTIZACION.razonSocialNombre,

      idVehiculo: definicion_CTX_COTIZACION.idVehiculo,
      placa: definicion_CTX_COTIZACION.placa,
      idVehiculoMarca: definicion_CTX_COTIZACION.idVehiculoMarca,
      vehiculoMarca: definicion_CTX_COTIZACION.vehiculoMarca,
      idVehiculoModelo: definicion_CTX_COTIZACION.idVehiculoModelo,
      vehiculoModelo: definicion_CTX_COTIZACION.vehiculoModelo,
      vin: definicion_CTX_COTIZACION.vin,

      igv: definicion_CTX_COTIZACION.igv,

      servicios: definicion_CTX_COTIZACION.servicios,
      repuestosLubri: definicion_CTX_COTIZACION.repuestosLubri,

      montoSubTotalPEN: definicion_CTX_COTIZACION.montoSubTotalPEN,
      montoIGVPEN: definicion_CTX_COTIZACION.montoIGVPEN,
      montoTotalPEN: definicion_CTX_COTIZACION.montoTotalPEN,

      usuario: parametrosGlobales.usuario,
    });

    console.log('la coti', coti);

    if (coti.status === 400) {
      alert('Falla al registrar la cotizción. ' + coti.message);
      return;
    }

    //
    ctx_index_cotizacion.grabo_Cotizacion = true;
    // ctx_index_cotizacion.mostrarPanelNewEditCotizacion = false;
    definicion_CTX_COTIZACION._id = coti.data._id;
    definicion_CTX_COTIZACION.numero = coti.data.numero;
    //definicion_CTX_COTIZACION.correlativo = coti.data.correlativo;
  });
  //#endregion REGISTRAR COTIZACION

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(338px, 86%, 600px)',
        // width: 'auto',
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
          onClick={$(() => {
            ctx_index_cotizacion.mostrarPanelNewEditCotizacion = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('definicion_CTX_COTIZACION', definicion_CTX_COTIZACION);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('cotizacionSelecci', props.cotizacionSelecci);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE COTIZACION */}
          <div>
            {/* PERIODO */}
            <div class="form-control">
              <label>Periodo</label>
              <div class="form-control form-agrupado">
                <input id="in_Periodo" style={{ width: '100%' }} type="text" disabled value={definicion_CTX_COTIZACION.periodo} />
              </div>
            </div>
            {/* Serie  key={ser._id} id={ser._id} value={ser.serie}*/}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                {definicion_CTX_COTIZACION.idSerieCotizacion !== '' ? (
                  <input
                    id="inputSerieCotizacion"
                    style={{ width: '100%' }}
                    type="text"
                    disabled
                    value={
                      definicion_CTX_COTIZACION._id === ''
                        ? definicion_CTX_COTIZACION.serie
                        : definicion_CTX_COTIZACION.serie + ' - ' + cerosALaIzquierda(definicion_CTX_COTIZACION.numero, 8)
                    }
                  />
                ) : (
                  <select
                    id="selectSerieCotizacion"
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];
                      console.log('elOption', elOption.id);
                      definicion_CTX_COTIZACION.idSerieCotizacion = elOption.id;
                      definicion_CTX_COTIZACION.serie = (e.target as HTMLSelectElement).value;
                      // const elementoSerie: any = dataSerie.value.filter(
                      //   (cor: any) => cor.idSerieCotizacion === definicion_CTX_COTIZACION.idSerieCotizacion
                      // );
                      // // console.log('first', elementoSerie[0].correlativo);
                      // definicion_CTX_COTIZACION.numero = elementoSerie[0].correlativo;
                      document.getElementById('in_Fecha')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione una serie --</option>
                    {dataSerie.value.map((ser: any) => {
                      return (
                        <option
                          id={ser.idSerieCotizacion}
                          value={ser.serie}
                          selected={definicion_CTX_COTIZACION.serie === ser.serie}
                        >
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
            {/* fecha */}
            <div class="form-control form-control-check">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Fecha"
                  type="date"
                  style={{ width: '100%' }}
                  min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_COTIZACION.fecha}
                  onChange$={(e) => (definicion_CTX_COTIZACION.fecha = (e.target as HTMLInputElement).value)}
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
                  id="selectTipoDocumentoLiteral_COT"
                  disabled
                  //   value={codigoTipoDocumentoIdentidad}
                  //   onChange={cambioTipoDocumento}
                  style={{ width: '100%' }}
                >
                  <option value={1} selected={definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={6} selected={definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad === '6'}>
                    RUC
                  </option>
                  <option value={4} selected={definicion_CTX_COTIZACION.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
              </div>
              <ImgButton
                id="img_buscarCliente"
                src={images.searchPLUS}
                alt="Icono de buscar cliente"
                height={16}
                width={16}
                title="Buscar datos de cliente"
                onClick={$(() => {
                  definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarPersona = true;
                })}
              />
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_NumeroDocumentoIdentidad"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add número"
                  value={definicion_CTX_COTIZACION.numeroIdentidad}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_NombreCliente"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  value={definicion_CTX_COTIZACION.razonSocialNombre}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* {showSeleccionarPersona.value && ( */}
          {definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="cliente" contexto="cotizacion" rol="cliente" />
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
                  value={
                    definicion_CTX_COTIZACION.igv.$numberDecimal
                      ? definicion_CTX_COTIZACION.igv.$numberDecimal
                      : definicion_CTX_COTIZACION.igv + ' %'
                  }
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
                disabled
                style={{ width: '100%' }}
                type="text"
                value={definicion_CTX_COTIZACION.placa}
                placeholder="Add placa: AAA123, TRU789, XRW695"
              />
              <ImgButton
                id={'imgButtonSearchVehiculo'}
                src={images.searchPLUS}
                alt="Icono de buscar vehículo"
                height={16}
                width={16}
                title="Buscar vehículo"
                onClick={$(() => {
                  definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarVehiculo = true;
                })}
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
                value={definicion_CTX_COTIZACION.vehiculoMarca}
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
                value={definicion_CTX_COTIZACION.vehiculoModelo}
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
                value={definicion_CTX_COTIZACION.vin}
              />
            </div>
          </div>
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarVehiculo && (
          <div class="modal">
            <BuscarVehiculo contexto="cotizacion" />
          </div>
        )}
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
              {definicion_CTX_COTIZACION._id === '' ? (
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
                  title="Add servicio"
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarServicio = true;
                  })}
                />
              )}
            </div>
            {definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarServicio && (
              <div class="modal">
                <BuscarServicio contexto="new_edit_cotizacion" />
              </div>
            )}
            {/* TABLA SERVICIOS  */}
            {definicion_CTX_COTIZACION.servicios.length > 0 ? (
              <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Precio Uni</th>
                    <th>Venta </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_COTIZACION.servicios.map((iTCotiServi: any, index: any) => {
                    const indexItemServi = index + 1;

                    sumaTOTAL_SERVI =
                      sumaTOTAL_SERVI +
                      redondeo2Decimales(
                        iTCotiServi.ventaPEN.$numberDecimal ? iTCotiServi.ventaPEN.$numberDecimal : iTCotiServi.ventaPEN
                      );
                    subTOTAL_SERVI = redondeo2Decimales(
                      (sumaTOTAL_SERVI * 100) / (100 + parseFloat(definicion_CTX_COTIZACION.igv.$numberDecimal))
                    );
                    igvTOTAL_SERVI = redondeo2Decimales(sumaTOTAL_SERVI - subTOTAL_SERVI);
                    console.log(
                      'firstfirstfirst _SERVI:::',
                      definicion_CTX_COTIZACION.igv,
                      subTOTAL_SERVI,
                      igvTOTAL_SERVI,
                      sumaTOTAL_SERVI
                    );

                    return (
                      <tr key={iTCotiServi.idAuxiliar}>
                        <td data-label="Ítem" key={iTCotiServi.idAuxiliar}>{`${cerosALaIzquierda(indexItemServi, 3)}`}</td>
                        <td data-label="Kx"></td>
                        <td data-label="Código">{iTCotiServi.codigo ? iTCotiServi.codigo : '_'}</td>
                        <td data-label="Descripción">{iTCotiServi.descripcionEquivalencia}</td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                          <input
                            style={{ width: '60px', textAlign: 'end' }}
                            value={
                              iTCotiServi.cantidad.$numberDecimal ? iTCotiServi.cantidad.$numberDecimal : iTCotiServi.cantidad
                            }
                            onChange$={(e) => {
                              iTCotiServi.cantidad = parseFloat((e.target as HTMLInputElement).value);

                              iTCotiServi.ventaPEN =
                                (iTCotiServi.cantidad ? iTCotiServi.cantidad : iTCotiServi.cantidad.$numberDecimal) *
                                (iTCotiServi.precioPEN ? iTCotiServi.precioPEN : iTCotiServi.precioPEN.$numberDecimal);
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label="Uni">{iTCotiServi.unidadEquivalencia ? iTCotiServi.unidadEquivalencia : '_'}</td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                          <input
                            style={{ width: '60px', textAlign: 'end' }}
                            value={
                              iTCotiServi.precioPEN.$numberDecimal ? iTCotiServi.precioPEN.$numberDecimal : iTCotiServi.precioPEN
                            }
                            onChange$={(e) => {
                              const precio = parseFloat((e.target as HTMLInputElement).value);
                              console.log('el precio modificado', precio);

                              iTCotiServi.precioPEN = precio;
                              console.log('el precio modificado, cant', iTCotiServi.precioPEN, iTCotiServi.cantidad);
                              iTCotiServi.ventaPEN =
                                (iTCotiServi.cantidad.$numberDecimal
                                  ? iTCotiServi.cantidad.$numberDecimal
                                  : iTCotiServi.cantidad) *
                                (iTCotiServi.precioPEN.$numberDecimal
                                  ? iTCotiServi.precioPEN.$numberDecimal
                                  : iTCotiServi.precioPEN);
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Venta" style={{ textAlign: 'end' }}>
                          {iTCotiServi.ventaPEN.$numberDecimal ? iTCotiServi.ventaPEN.$numberDecimal : iTCotiServi.ventaPEN}
                        </td>
                        <td data-label="Acciones" style={{ textAlign: 'center' }}>
                          <ImgButton
                            src={images.trash}
                            alt="icono de eliminar"
                            height={12}
                            width={12}
                            title="Eliminar ítem"
                            onClick={$(() => {
                              definicion_CTX_NEW_EDIT_COTIZACION.borrarServicio = iTCotiServi;
                              definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelDeleteItemServicio = true;
                            })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL_SERVI.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL_SERVI.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL_SERVI.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.7rem' }}>No existen servicios</i>
            )}
            {definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelDeleteItemServicio && (
              <div class="modal">
                <BorrarServicio />
              </div>
            )}
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
              {definicion_CTX_COTIZACION._id === '' ? (
                <ElButton
                  class="btn"
                  name="Add mercadería"
                  disabled
                  title="Add mercadería"
                  style={{ background: '#aaa', color: '#d3d3d3' }}
                />
              ) : (
                <ElButton
                  class="btn"
                  name="Add mercadería"
                  title="Add mercadería"
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarMercaderiaOUT = true;
                  })}
                />
              )}
            </div>

            {definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelBuscarMercaderiaOUT && (
              <div class="modal">
                <BuscarMercaderiaOUT contexto="new_edit_cotizacion" esAlmacen={false} />
              </div>
            )}
            {/* TABLA REPUESTOS -- LUBRICANTES */}
            {definicion_CTX_COTIZACION.repuestosLubri.length > 0 ? (
              <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Precio Uni</th>
                    <th>Venta </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_COTIZACION.repuestosLubri.map((iTRepuLubri: any, index: any) => {
                    const indexItemRequi = index + 1;

                    sumaTOTAL_REP_LUB =
                      sumaTOTAL_REP_LUB +
                      redondeo2Decimales(
                        iTRepuLubri.ventaPEN.$numberDecimal ? iTRepuLubri.ventaPEN.$numberDecimal : iTRepuLubri.ventaPEN
                      );
                    subTOTAL_REP_LUB = redondeo2Decimales(
                      (sumaTOTAL_REP_LUB * 100) / (100 + parseFloat(definicion_CTX_COTIZACION.igv.$numberDecimal))
                    );
                    igvTOTAL_REP_LUB = redondeo2Decimales(sumaTOTAL_REP_LUB - subTOTAL_REP_LUB);

                    console.log(
                      'BUCLE: sumaTOTAL_REP_LUB - subTOTAL_REP_LUB - igvTOTAL_REP_LUB - definicion_CTX_COTIZACION.igv',
                      sumaTOTAL_REP_LUB,
                      subTOTAL_REP_LUB,
                      igvTOTAL_REP_LUB,
                      definicion_CTX_COTIZACION.igv
                    );

                    return (
                      <tr key={iTRepuLubri.idAuxiliar}>
                        <td data-label="Ítem" key={iTRepuLubri.idAuxiliar}>{`${cerosALaIzquierda(indexItemRequi, 3)}`}</td>
                        <td data-label="Kx">{iTRepuLubri.idKardex.substring(iTRepuLubri.idKardex.length - 6)}</td>

                        <td data-label="Código">{iTRepuLubri.codigo}</td>
                        <td data-label="Descripción">{iTRepuLubri.descripcionEquivalencia}</td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                          <input
                            style={{ width: '60px', textAlign: 'end' }}
                            value={
                              iTRepuLubri.cantidad.$numberDecimal ? iTRepuLubri.cantidad.$numberDecimal : iTRepuLubri.cantidad
                            }
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            onChange$={(e) => {
                              iTRepuLubri.cantidad = parseFloat((e.target as HTMLInputElement).value);
                              console.log('iTRepuLubri.cantidad', iTRepuLubri.cantidad);
                              console.log('iTRepuLubri.precioPEN', iTRepuLubri.precioPEN);
                              iTRepuLubri.ventaPEN =
                                (iTRepuLubri.cantidad ? iTRepuLubri.cantidad : iTRepuLubri.cantidad.$numberDecimal) *
                                (iTRepuLubri.precioPEN.$numberDecimal
                                  ? iTRepuLubri.precioPEN.$numberDecimal
                                  : iTRepuLubri.precioPEN);
                              console.log('iTRepuLubri.ventaPEN', iTRepuLubri.ventaPEN);
                            }}
                          />
                        </td>
                        <td data-label="Uni">{iTRepuLubri.unidadEquivalencia}</td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                          <input
                            style={{ width: '60px', textAlign: 'end' }}
                            value={
                              iTRepuLubri.precioPEN.$numberDecimal ? iTRepuLubri.precioPEN.$numberDecimal : iTRepuLubri.precioPEN
                            }
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            onChange$={(e) => {
                              const precio = parseFloat((e.target as HTMLInputElement).value);
                              console.log('el precio modificado', precio);

                              iTRepuLubri.precioPEN = precio;
                              console.log(
                                'el precio modificado, cant',
                                iTRepuLubri.precioPEN,
                                iTRepuLubri.cantidad ? iTRepuLubri.cantidad : iTRepuLubri.cantidad.$numberDecimal
                              );
                              console.log('cantidad', iTRepuLubri.cantidad);
                              console.log('cantidad.$numberDecimal', iTRepuLubri.cantidad.$numberDecimal);
                              console.log('precioPEN', iTRepuLubri.precioPEN);
                              console.log('precioPEN.$numberDecimal', iTRepuLubri.precioPEN.$numberDecimal);
                              iTRepuLubri.ventaPEN =
                                (iTRepuLubri.cantidad.$numberDecimal
                                  ? iTRepuLubri.cantidad.$numberDecimal
                                  : iTRepuLubri.cantidad) *
                                (iTRepuLubri.precioPEN.$numberDecimal
                                  ? iTRepuLubri.precioPEN.$numberDecimal
                                  : iTRepuLubri.precioPEN);
                            }}
                          />
                        </td>
                        {/* ----------------------------------------------------- */}
                        <td data-label="Venta" style={{ textAlign: 'end' }}>
                          {iTRepuLubri.ventaPEN.$numberDecimal ? iTRepuLubri.ventaPEN.$numberDecimal : iTRepuLubri.ventaPEN}
                        </td>
                        <td data-label="Acciones" style={{ textAlign: 'right' }}>
                          <ImgButton
                            src={images.trash}
                            alt="icono de eliminar"
                            height={12}
                            width={12}
                            title="Eliminar ítem"
                            onClick={$(() => {
                              definicion_CTX_NEW_EDIT_COTIZACION.borrarRepuestoLubri = iTRepuLubri;
                              definicion_CTX_NEW_EDIT_COTIZACION.mostrarPanelDeleteItemRepuestoLubri = true;
                            })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL_REP_LUB.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL_REP_LUB.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL_REP_LUB.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.7rem' }}>No existen mercaderías</i>
            )}
          </div>
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          value={definicion_CTX_COTIZACION.numero === 0 ? 'Aperturar cotización' : `Grabar`}
          class="btn-centro"
          onClick$={() => registrarCotizacion()}
        />
      </div>
    </div>
  );
});
