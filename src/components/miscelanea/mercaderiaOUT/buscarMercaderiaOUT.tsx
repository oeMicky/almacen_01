import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_COTIZACION, CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import TablaMercaderiasOUT from './tablaMercaderiasOUT';
import MercaderiaOUTSeleccionada from './mercaderiaOUTSeleccionada';
import AsignarPrecioOUT from './asignarPrecioOUT';
import { CTX_ADD_VENTA, CTX_F_B_NC_ND } from '~/components/venta/addVenta';
import { CTX_NEW_EDIT_ORDEN_SERVICIO, CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_NEW_OUT_ALMACEN, CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import KardexsOUT from './kardexsOUT';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from '~/components/ordenProduccion/newEditOrdenProduccion';
import { CTX_ADD_NOTA_VENTA, CTX_NOTA_VENTA } from '~/components/notaVenta/addNotaVenta';
import {
  getBuscarMercaderiaPorAplicacion,
  getBuscarMercaderiaPorAplicacionTODOS,
  getBuscarMercaderiaPorDescripion,
  getBuscarMercaderiaPorDescripionTODOS,
} from '~/apis/mercaderia.api';
import Spinner from '~/components/system/spinner';
import { elIdAuxiliar } from '~/functions/comunes';
import NewEditMercaderiaIN from '../mercaderiaIN/newEditMercaderiaIN';
import NewEditUbigeo from '../mercaderiaIN/newEditUbigeo';
import { verOtrosAlmacenes } from '~/apis/usuario.api';
import InventarioExterno from '../inventarioExterno/inventarioExterno';
import Kardexs from '~/components/kardex/kardexs';
import Kardex from '~/components/kardex/kardex';
// import NewEditUbigeo from '../mercaderiaIN/newEditUbigeo';

export const CTX_BUSCAR_MERCADERIA_OUT = createContextId<any>('buscar_mercaderia_out__');

export default component$((props: { contexto: string; esAlmacen: boolean; esProduccion?: boolean; porcentaje: any }) => {
  //#region DEFINICION CTX_BUSCAR_MERCADERIA_OUT - para eDITAR - para BUSCAR
  const definicion_CTX_BUSCAR_MERCADERIA_OUT = useStore({
    mM: [],
    kK: [],

    mostrarPanelNewEditMercaderiaIN: false,
    grabo_mercaderiaIN: false,

    mostrarPanelNewEditUbigeo: false,
    elIdKardex: '',
    elUBIGEO: '',
    grabo_ubigeo: false,

    mostrarPanelKardexsOUT: false,

    mostrarPanelMercaderiaOUTSeleccionada: false,
    mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS: false,

    mostrarPanelAsignarPrecioOUT: false,
    grabo_PrecioOUT: false,

    mostrarPanelInventarioExterno: false,
    mostrarPanelVerOtrosAlmacenenes: false,
    almacenExterno: [],

    mostrarPanelKARDEX: false,
    mostrarPanelKARDEXS: false,

    // mostrarSpinner: false,
  });
  useContextProvider(CTX_BUSCAR_MERCADERIA_OUT, definicion_CTX_BUSCAR_MERCADERIA_OUT);
  //#endregion DEFINICION CTX_BUSCAR_MERCADERIA_OUT - para eDITAR - para BUSCAR

  //#region CONTEXTOS
  let ctx: any = [];
  let documento: any = [];
  switch (props.contexto) {
    case 'orden_servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      documento = useContext(CTX_O_S).requisiciones;
      break;
    case 'orden_produccion':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
      break;
    case 'new_venta':
      ctx = useContext(CTX_ADD_VENTA);
      documento = useContext(CTX_F_B_NC_ND).itemsVenta;
      break;
    case 'nota_venta':
      ctx = useContext(CTX_ADD_NOTA_VENTA);
      documento = useContext(CTX_NOTA_VENTA).itemsNotaVenta;
      break;
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      break;
    case 'new_edit_cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      documento = useContext(CTX_COTIZACION).repuestosLubri;
      break;
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const hallado = useSignal(true);
  const verAplicacion = useSignal(false);
  const verLineaMarca = useSignal(false);
  const verTODOS = useSignal(false);
  const buscarMercaderiasOUT = useSignal(0);
  const mostrarSpinner = useSignal(false);

  // const buscarMercaderiasOUT_EnAUTOMATICO = useSignal(0);
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: 'valv 20w 50', // 'bls 838', // 'acce 5', //cadena.value,
  });

  useTask$(({ track }) => {
    track(() => ini.value);

    if (ini.value === 0) {
      // console.log(ini.value);
      document.activeElement;
      // const ele =
      // document.getElementById('IN_IN_codigoDescripcion_MICE')?.addEventListener('focus', focusFunt);

      // window.setTimeout(() => ele?.focus(), 0);
      ini.value++;
    }
    // function focusFunt() {
    //   console.log('000000000000000000');
    //   document.getElementById('IN_IN_codigoDescripcion_MICE')?.style.backgroundColor = 'red';
    // }
  });

  //#endregion INICIALIZACION

  //#region BUSCAR MERCADERIAS OUT
  const localizarMercaderiasOUT = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      //document.getElementById('inputBusquedaServicio_MICE')?.focus();
      return;
    }
    buscarMercaderiasOUT.value++;
  });
  //#endregion BUSCAR MERCADERIAS OUT

  //#region REFRESCAR TABLA MERCADERIAS OUT x grabo_PrecioOUT
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT;
    });

    if (definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT) {
      localizarMercaderiasOUT();
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS OUT x grabo_PrecioOUT

  //#region REFRESCAR TABLA MERCADERIAS OUT x grabo_mercaderiaIN
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_mercaderiaIN;
    });

    if (definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_mercaderiaIN) {
      localizarMercaderiasOUT();
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_mercaderiaIN = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS OUT x grabo_mercaderiaIN

  //#region REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_ubigeo;
    });
    if (definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_ubigeo) {
      // parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
      definicion_CTX_BUSCAR_MERCADERIA_OUT.elIdKardex = '';
      definicion_CTX_BUSCAR_MERCADERIA_OUT.elUBIGEO = '';

      // buscarMercaderiasIN.value++;
      localizarMercaderiasOUT();
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_ubigeo = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo

  //#region BUSCAR MERCADERIAS OUT _EnAUTOMATICO
  const localizarMercaderiasOUT_EnAUTOMATICO = $(async () => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      //document.getElementById('inputBusquedaServicio_MICE')?.focus();
      return;
    }
    // buscarMercaderiasOUT_EnAUTOMATICO.value++;
    mostrarSpinner.value = true;
    let lasMercaderiasOUT: any;
    if (parametrosBusqueda.buscarPor === 'Descripción') {
      console.log('lasMercaderiasOUT Descripción');
      if (verTODOS.value) {
        console.log('lasMercaderiasOUT Descripción', verTODOS.value);
        lasMercaderiasOUT = await getBuscarMercaderiaPorDescripionTODOS(parametrosBusqueda);
        lasMercaderiasOUT = lasMercaderiasOUT.data;
      } else {
        console.log('lasMercaderiasOUT Descripción', verTODOS.value);
        lasMercaderiasOUT = await getBuscarMercaderiaPorDescripion(parametrosBusqueda);
        lasMercaderiasOUT = lasMercaderiasOUT.data;
      }
    }
    if (parametrosBusqueda.buscarPor === 'Aplicación') {
      console.log('lasMercaderiasOUT Aplicación');
      if (verTODOS.value) {
        console.log('lasMercaderiasOUT Aplicación', verTODOS.value);
        lasMercaderiasOUT = await getBuscarMercaderiaPorAplicacionTODOS(parametrosBusqueda);
        lasMercaderiasOUT = lasMercaderiasOUT.data;
      } else {
        console.log('lasMercaderiasOUT Aplicación', verTODOS.value);
        lasMercaderiasOUT = await getBuscarMercaderiaPorAplicacion(parametrosBusqueda);
        lasMercaderiasOUT = lasMercaderiasOUT.data;
      }
    }
    // console.log('lasMercaderiasOUT _EnAUTOMATICO', lasMercaderiasOUT);
    // console.log('lasMercaderiasOUT _EnAUTOMATICO SUSCRIBIENTO AL PANEL');
    if (lasMercaderiasOUT.length === 0) {
      hallado.value = false;
      (document.getElementById('IN_IN_codigoDescripcion_MICE') as HTMLInputElement).select();
      // console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨');
    } else {
      hallado.value = true;
      console.log('LOS ITEMS......', documento);

      const coincidentes = documento.filter(
        (ele: any) =>
          ele.idMercaderia === lasMercaderiasOUT[0]._id &&
          ele.idEquivalencia === lasMercaderiasOUT[0].equivalencias[0]._id &&
          ele.idKardex === lasMercaderiasOUT[0].KARDEXS[0]._id
      );
      console.log('LOS ITEMS....coincidentes..', coincidentes);
      if (coincidentes.length !== 0) {
        console.log('🍜🍜🍜');

        ///////////////////////////////////////////////////////////////////////
        /////// new_out_almacen
        if (props.contexto === 'new_out_almacen') {
          // console.log(
          //   'LOS ITEMS....coincidentes.. YA EXISTE => AUMENTAR',
          //   parseFloat(coincidentes[0].cantidadSacada),
          //   coincidentes[0].cantidadSacadaEquivalencia
          // );
          const cantiSaca = coincidentes[0].cantidadSacada.$numberDecimal
            ? parseFloat(coincidentes[0].cantidadSacada.$numberDecimal)
            : parseFloat(coincidentes[0].cantidadSacada);
          const cantiSacaEqui = coincidentes[0].cantidadSacadaEquivalencia.$numberDecimal
            ? parseFloat(coincidentes[0].cantidadSacadaEquivalencia.$numberDecimal)
            : parseFloat(coincidentes[0].cantidadSacadaEquivalencia);

          // coincidentes[0].cantidad = (canti + 1) * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
          // coincidentes[0].cantidadEquivalencia = cantiEqui + 1;

          coincidentes[0].cantidadSacada = (cantiSaca + 1) * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
          coincidentes[0].cantidadSacadaEquivalencia = cantiSacaEqui + 1;

          coincidentes[0].subPEN = (cantiSaca + 1) * parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal);
          coincidentes[0].subEquivalenciaPEN =
            (cantiSacaEqui + 1) *
            parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal) *
            parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
        }
        ///////////////////////////////////////////////////////////////////////
        /////// orden_servicio   new_venta   nota_venta    new_edit_cotizacion
        if (
          props.contexto === 'orden_servicio' ||
          props.contexto === 'new_venta' ||
          props.contexto === 'nota_venta' ||
          props.contexto === 'new_edit_cotizacion'
        ) {
          // console.log('LOS ITEMS....coincidentes.. YA EXISTE => AUMENTAR', parseFloat(coincidentes[0].cantidad), coincidentes[0].cantidadEquivalencia);
          const canti = coincidentes[0].cantidad.$numberDecimal ? parseFloat(coincidentes[0].cantidad.$numberDecimal) : parseFloat(coincidentes[0].cantidad);
          const cantiEqui = coincidentes[0].cantidadEquivalencia.$numberDecimal
            ? parseFloat(coincidentes[0].cantidadEquivalencia.$numberDecimal)
            : parseFloat(coincidentes[0].cantidadEquivalencia);

          coincidentes[0].cantidad = (canti + 1) * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
          coincidentes[0].cantidadEquivalencia = cantiEqui + 1;

          coincidentes[0].cantidadSacada = (canti + 1) * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
          coincidentes[0].cantidadSacadaEquivalencia = cantiEqui + 1;
        }
      } else {
        console.log('🥩🥩🥩');
        ///////////////////////////////////////////////////////////////////////
        /////// new_out_almacen
        if (props.contexto === 'new_out_almacen') {
          console.log('🚍🚍🚍', lasMercaderiasOUT[0]);
          //EXISTE KARDEX?
          if (typeof lasMercaderiasOUT[0].KARDEXS === 'undefined' || lasMercaderiasOUT[0].KARDEXS.length === 0) {
            alert('No se puede agregar este item, no tiene kardexs');
            mostrarSpinner.value = false;
            return;
          }
          //
          documento.push({
            idAuxiliar: parseInt(elIdAuxiliar()),
            idMercaderia: lasMercaderiasOUT[0]._id,
            idEquivalencia: lasMercaderiasOUT[0].equivalencias[0]._id,
            idKardex: lasMercaderiasOUT[0].KARDEXS[0]._id,
            item: 0,
            tipo: 'MERCADERIA',

            codigo: lasMercaderiasOUT[0].codigo ? lasMercaderiasOUT[0].codigo : '_',

            descripcion: lasMercaderiasOUT[0].descripcion,
            descripcionEquivalencia: lasMercaderiasOUT[0].equivalencias[0].descripcionEquivalencia,

            cantidadSacada: 1 * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),
            cantidadSacadaEquivalencia: 1,

            unidad: lasMercaderiasOUT[0].unidad,
            unidadEquivalencia: lasMercaderiasOUT[0].equivalencias[0].unidadEquivalencia,

            costoUnitarioPEN: parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal),
            costoUnitarioEquivalenciaPEN:
              parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal) *
              parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),

            subPEN: 1 * parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal),
            subEquivalenciaPEN:
              1 *
              parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal) *
              parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),

            precioUnitarioUSD: 0,
            ventaUSD: 0,

            tipoEquivalencia: lasMercaderiasOUT[0].equivalencias[0].tipoEquivalencia,
            factor: lasMercaderiasOUT[0].equivalencias[0].factor,
            laEquivalencia: lasMercaderiasOUT[0].equivalencias[0].laEquivalencia,

            exonerado: lasMercaderiasOUT[0].exonerado,
            inafecto: lasMercaderiasOUT[0].inafecto,
            sujetoAPercepcion: lasMercaderiasOUT[0].sujetoAPercepcion,
            percepcion: lasMercaderiasOUT[0].percepcion,
          });
        }
        ///////////////////////////////////////////////////////////////////////
        /////// orden_servicio   new_venta   nota_venta    new_edit_cotizacion
        if (
          props.contexto === 'orden_servicio' ||
          props.contexto === 'new_venta' ||
          props.contexto === 'nota_venta' ||
          props.contexto === 'new_edit_cotizacion'
        ) {
          console.log('🚅🚅🚅');
          let precioEquivalencia;
          // console.log('lasMercaderiasOUT[0].precioUnitarioPEN === null', lasMercaderiasOUT[0].precioUnitarioPEN);
          if (lasMercaderiasOUT[0].precioUnitarioPEN === null || typeof lasMercaderiasOUT[0].precioUnitarioPEN === 'undefined') {
            precioEquivalencia = 0;
          } else {
            precioEquivalencia =
              parseFloat(
                lasMercaderiasOUT[0].precioUnitarioPEN.$numberDecimal
                  ? lasMercaderiasOUT[0].precioUnitarioPEN.$numberDecimal
                  : lasMercaderiasOUT[0].precioUnitarioPEN
              ) * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal);
          }
          //EXISTE KARDEX?
          if (typeof lasMercaderiasOUT[0].KARDEXS === 'undefined' || lasMercaderiasOUT[0].KARDEXS.length === 0) {
            alert('No se puede agregar este item, no tiene kardexs');
            mostrarSpinner.value = false;
            return;
          }

          //INSERTANDO EN EL PANEL
          let tPVU = '';
          if (
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '10' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '11' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '12' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '13' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '14' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '15' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '16' ||
            lasMercaderiasOUT[0].tipoAfectacionDelImpuesto === '17'
          ) {
            tPVU = '01';
          } else {
            tPVU = '02';
          }
          documento.push({
            idAuxiliar: parseInt(elIdAuxiliar()),
            idMercaderia: lasMercaderiasOUT[0]._id,
            idEquivalencia: lasMercaderiasOUT[0].equivalencias[0]._id,
            idKardex: lasMercaderiasOUT[0].KARDEXS[0]._id,
            item: 0,
            tipo: 'MERCADERIA',

            noFacturar: lasMercaderiasOUT[0].noFacturar,

            tipoImpuesto: lasMercaderiasOUT[0].tipoImpuesto,
            tipoAfectacionDelImpuesto: lasMercaderiasOUT[0].tipoAfectacionDelImpuesto,
            porcentaje: parseFloat(props.porcentaje),

            tipoPrecioVentaUnitario: tPVU,

            codigo: lasMercaderiasOUT[0].codigo ? lasMercaderiasOUT[0].codigo : '_',

            descripcion: lasMercaderiasOUT[0].descripcion,
            descripcionEquivalencia: lasMercaderiasOUT[0].equivalencias[0].descripcionEquivalencia,

            cantidad: 1 * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),
            cantidadEquivalencia: 1,

            cantidadSacada: 1 * parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),
            cantidadSacadaEquivalencia: 1,

            unidad: lasMercaderiasOUT[0].unidad,
            unidadEquivalencia: lasMercaderiasOUT[0].equivalencias[0].unidadEquivalencia,

            costoUnitarioPEN: parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal),
            costoUnitarioEquivalenciaPEN:
              parseFloat(lasMercaderiasOUT[0].KARDEXS[0].costoUnitarioMovil.$numberDecimal) *
              parseFloat(lasMercaderiasOUT[0].equivalencias[0].laEquivalencia.$numberDecimal),

            porcentajeUtilidad: lasMercaderiasOUT[0].porcentajeUtilidad,

            //precio = c + IGV
            precioUnitarioPEN: precioEquivalencia,

            //venta = k * precio
            ventaPEN: 1 * precioEquivalencia,

            precioUnitarioUSD: 0,
            ventaUSD: 0,

            tipoEquivalencia: lasMercaderiasOUT[0].equivalencias[0].tipoEquivalencia,
            factor: lasMercaderiasOUT[0].equivalencias[0].factor,
            laEquivalencia: lasMercaderiasOUT[0].equivalencias[0].laEquivalencia,

            exonerado: lasMercaderiasOUT[0].exonerado,
            inafecto: lasMercaderiasOUT[0].inafecto,
            sujetoAPercepcion: lasMercaderiasOUT[0].sujetoAPercepcion,
            percepcion: lasMercaderiasOUT[0].percepcion,

            codigoContableVenta: lasMercaderiasOUT[0].codigoContableVenta,
            descripcionContableVenta: lasMercaderiasOUT[0].descripcionContableVenta,
            tipoContableVenta: lasMercaderiasOUT[0].tipoContableVenta,
          });
        }
      }

      //
      parametrosBusqueda.cadenaABuscar = '';
      // console.log('✅✅✅✅✅✅✅✅');
    }
    mostrarSpinner.value = false;
    // parametrosBusqueda.cadenaABuscar = '';
  });
  //#endregion BUSCAR MERCADERIAS OUT _EnAUTOMATICO

  return (
    <div
      id="modal_BuscarMercaderiaOUT"
      class="container-modal"
      style={
        verLineaMarca.value || verAplicacion.value
          ? hallado.value
            ? {
                width: 'clamp(320px, 100%, 1112px)',
                // width: 'auto',
                border: '1px solid red',
                padding: '2px',
              }
            : {
                width: 'clamp(320px, 100%, 1112px)',
                // width: 'auto',
                border: '1px solid red',
                padding: '2px',
                backgroundColor: '#ff3d3d',
              }
          : hallado.value
          ? {
              width: 'clamp(320px, 100%, 880px)',
              // width: 'auto',
              border: '1px solid red',
              padding: '2px',
            }
          : {
              width: 'clamp(320px, 100%, 880px)',
              // width: 'auto',
              border: '1px solid red',
              padding: '2px',
              backgroundColor: '#ff3d3d',
            }
      }
      // onKeyUp$={(e) => {
      //   console.log('☮💨💨💨💨💨💨', e.key);
      //   if (e.key === 'Escape') {
      //     ctx.mostrarPanelBuscarMercaderiaOUT = false;
      //   }
      // }}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log()
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelBuscarMercaderiaOUT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'red' }}>{parametrosGlobales.sucursal}</h3>
      <h3 style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Buscar bienes / OUT</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '12px' }}>
              <input
                id="in_ADD_AUTOMATICA_MICE"
                type="checkbox"
                // checked
                placeholder="Adición automática"
                onChange$={(e) => {
                  if ((e.target as HTMLInputElement).checked) {
                    parametrosBusqueda.buscarPor = 'Aplicación';
                  } else {
                    parametrosBusqueda.buscarPor = 'Descripción';
                  }
                  document.getElementById('IN_IN_codigoDescripcion_MICE')?.focus();
                }}
              />
              <label for="in_ADD_AUTOMATICA_MICE">Add automática</label>
            </div>
          </div>

          {/* Buscar por */}
          <div class="form-control" style={{ marginBottom: '4px' }}>
            <div class="form-control form-agrupado">
              <input
                id="IN_IN_codigoDescripcion_MICE"
                // tabIndex={0}
                style={{ width: '100%' }}
                type="text"
                placeholder="Ingrese la mercadería a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                onChange$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value.trim();
                  // console.log('ESTOY onChange onChange ', parametrosBusqueda.cadenaABuscar);
                  if (parametrosBusqueda.cadenaABuscar.trim() !== '') {
                    // BUSCAR PRODUCTOS
                    if ((document.getElementById('in_ADD_AUTOMATICA_MICE') as HTMLInputElement).checked) {
                      localizarMercaderiasOUT_EnAUTOMATICO();
                      // buscarMercaderiasOUT_EnAUTOMATICO.value++;
                    } else {
                      buscarMercaderiasOUT.value++;
                    }

                    // const tre = losCODEs.find((ele) => ele === codeBarra.value);
                    // if (typeof tre === 'undefined') {
                    //   console.log('🚨🚨🚨🚨🚨🚨🚨🚨');
                    //   document.getElementById('modal_BuscarMercaderiaOUT')?.style.setProperty('background-color', 'red');
                    //   // document.getElementById('modal_panelPrueba')?.style({'backgroundColor':'red'})
                    //   (e.target as HTMLInputElement).select();
                    // } else {
                    //   console.log('✅✅✅✅✅✅✅✅');
                    //   document.getElementById('modal_BuscarMercaderiaOUT')?.style.setProperty('background-color', 'white');
                    //   parametrosBusqueda.cadenaABuscar = '';
                    // }
                  }
                }}
                onFocus$={(e) => (e.target as HTMLInputElement).select()}
                onKeyUp$={(e) => {
                  // console.log('🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚', e.key);
                  if (e.key === 'Escape') {
                    ctx.mostrarPanelBuscarMercaderiaOUT = false;
                  }
                }}
                // onKeyPressCapture$={(e) => console.log('🚚🚚🚚🚚', e)}
                // onChange$={() => {
                //   navigator.mediaDevices.enumerateDevices().then((devices) =>
                //     devices.forEach((device) => {
                //       console.log('device......', device);
                //     })
                //   );
                //   // parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                // }}
                // onInput$={(e) => {
                //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                //   console.log('🚑🚑🚑🚑', e);
                // }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
                // onKeyPress$={(e) => {
                //   console.log('🚚🚚🚚🚚', e.key);
                //   if (e.key === 'Escape') {
                //     ctx.mostrarPanelBuscarMercaderiaOUT = false;
                //   }
                // }}
              />
              <input
                // id="in_BuscarDetraccion"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de mercadería"
                height={16}
                width={16}
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  localizarMercaderiasOUT();
                }}
              />
              {parametrosGlobales.verOtrosAlmacenes && (
                <input
                  title="Ver otros almacenes"
                  type="image"
                  src={images.arrowUpRight}
                  alt="icono ir a ..."
                  height={16}
                  width={16}
                  onClick$={async () => {
                    const losAlmacenes = await verOtrosAlmacenes({
                      usuario: parametrosGlobales.usuario,
                      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                      idSucursal: parametrosGlobales.idSucursal,
                    });
                    console.log('losAlmacenes.data', losAlmacenes.data.length, losAlmacenes.data);
                    if (losAlmacenes.data.length === 0) {
                      alert('No existe otros almacenes.');
                      return;
                    }
                    if (losAlmacenes.data.length === 1) {
                      //ir directo al panel de busqueda
                      definicion_CTX_BUSCAR_MERCADERIA_OUT.almacenExterno = losAlmacenes.data[0];
                      definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelInventarioExterno = true;
                    } else {
                      //ir al panel de listado de almacenes disponibles
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Buscar por: Aplicacion */}
          {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '12px' }}>
              <input
                id="in_Aplicacion_MICE"
                type="checkbox"
                placeholder="Buscar por aplicación"
                onChange$={(e) => {
                  if ((e.target as HTMLInputElement).checked) {
                    parametrosBusqueda.buscarPor = 'Aplicación';
                  } else {
                    parametrosBusqueda.buscarPor = 'Descripción';
                  }
                }}
                // value={parametrosBusqueda.cadenaABuscar}
                // onInput$={(e) => {
                //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                // }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     localizarMercaderiasOUT();
                //   }
                // }}
              />
              <label for="in_Aplicacion_MICE">Buscar en Aplicación</label>
            </div>
            <div style={{ marginRight: '12px' }}>
              <input
                id="in_VerAplicacion_MICE"
                type="checkbox"
                placeholder="Ver aplicación"
                onChange$={(e) => {
                  verAplicacion.value = (e.target as HTMLInputElement).checked;
                }}
                // value={parametrosBusqueda.cadenaABuscar}
                // onInput$={(e) => {
                //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                // }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     localizarMercaderiasOUT();
                //   }
                // }}
              />
              <label for="in_VerAplicacion_MICE">Ver aplicación</label>
            </div>
            <div style={{ marginRight: '12px' }}>
              <input
                id="in_VerLineaMarca_MICE"
                type="checkbox"
                placeholder="Ver linea y marca"
                onChange$={(e) => {
                  verLineaMarca.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_VerLineaMarca_MICE">Ver linea / marca</label>
            </div>
            <div>
              <input
                id="in_VerTODOS_MICE"
                type="checkbox"
                placeholder="Ver todos los articulos"
                checked={verTODOS.value}
                onChange$={(e) => {
                  verTODOS.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_VerTODOS_MICE">Ver TODOS</label>
            </div>
          </div>
          {/* Leyenda */}
          <div style={{ marginTop: '6px', display: 'flex' }}>
            <label style={{ marginRight: '8px' }}>Leyenda:</label>
            <label style={{ background: '#272727', color: 'white', marginRight: '8px', padding: '0 4px', borderRadius: '4px' }}>Inactivo</label>
            <label style={{ background: '#ff5aff', padding: '0 4px', borderRadius: '4px' }}>No facturable</label>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiasOUT.value > 0 ? (
            <TablaMercaderiasOUT
              buscarMercaderiasOUT={buscarMercaderiasOUT.value}
              parametrosBusqueda={parametrosBusqueda}
              // contexto={props.contexto}
              addAutomatica={(document.getElementById('in_ADD_AUTOMATICA_MICE') as HTMLInputElement).checked}
              esAlmacen={props.esAlmacen}
              esProduccion={props.esProduccion}
              verAplicacion={verAplicacion.value}
              verLineaMarca={verLineaMarca.value}
              verTODOS={verTODOS.value}
              // contexto={'buscar_mercaderia_out'}
              // contextoParaDocumento={props.contexto}
              //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
              //   parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelMercaderiaOUTSeleccionada && (
            <div class="modal">
              <MercaderiaOUTSeleccionada
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                elKardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.kK}
                esAlmacen={props.esAlmacen}
                esProduccion={props.esProduccion}
                contexto={'buscar_mercaderia_out'}
                contextoParaDocumento={props.contexto}
                porcentaje={props.porcentaje}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelAsignarPrecioOUT && (
            <div class="modal">
              <AsignarPrecioOUT mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM} />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelKardexsOUT && (
            <div class="modal">
              <KardexsOUT
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                esAlmacen={props.esAlmacen}
                esProduccion={props.esProduccion}
                contexto={props.contexto}
                porcentaje={props.porcentaje}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelKARDEXS && (
            <div class="modal">
              <Kardexs
                mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                esAlmacen={true}
                // contexto={props.contexto}
                // igv={props.igv}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelKARDEX && (
            <div class="modal">
              <Kardex
                mercaSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                kardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.kK}
                // esAlmacen={props.esAlmacen}
                // esAlmacen={false}
                contexto={'buscar_mercaderia_out'}
                // contextoParaDocumento={props.contexto}
                // igv={props.igv}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelNewEditUbigeo && (
            <div class="modal">
              <NewEditUbigeo
                idKardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.elIdKardex}
                ubigeo={definicion_CTX_BUSCAR_MERCADERIA_OUT.elUBIGEO}
                contexto="buscar_mercaderia_out"
              />
            </div>
          )}
          {/*  EDITAR MERCADERIA IN  */}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelNewEditMercaderiaIN && (
            <div class="modal">
              <NewEditMercaderiaIN mercaSeleccio={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM} contexto={props.contexto} />
            </div>
          )}
          {/*  INVENTARIO EXTERNO  */}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelInventarioExterno && (
            <div class="modal">
              <InventarioExterno
                almacen={definicion_CTX_BUSCAR_MERCADERIA_OUT.almacenExterno}
                buscar={parametrosBusqueda.cadenaABuscar}
                // idMercaderia={definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia}
                // descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                // cuMASigv={definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv}
                // pUtilidad={definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad}
                contexto="buscar_mercaderia_out"
              />
            </div>
          )}
          {/* MOSTRAR SPINNER */}
          {mostrarSpinner.value && (
            <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
