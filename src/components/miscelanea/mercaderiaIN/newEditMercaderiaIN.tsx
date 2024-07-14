import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IMercaderiaIN } from '~/interfaces/iMercaderia';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
// import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ElButton from '~/components/system/elButton';
import NewEditEquivalenciaIN from './newEditEquivalenciaIN';
import ElSelect from '~/components/system/elSelect';
import NewEditLineaTipoIN from './newEditLineaTipoIN';
// import NewEditUnidadIN from './newEditUnidadIN';
import { getLineasTipos } from '~/apis/lineaTipo.api';
import { parametrosGlobales } from '~/routes/login';
import style from '../../tabla/tabla.css?inline';
import { inUpMercaderia } from '~/apis/mercaderia.api';
import NewEditMarcaIN from './newEditMarcaIN';
import { CTX_INDEX_KARDEX } from '~/routes/(inventario)/kardex';
import BuscarUnidadSUNAT from './buscarUnidadSUNAT';
import { CTX_REGISTRO_PRODUCTOS_TERMINADOS } from '../ordenProduccionTerminado/registroProductosTerminados';

export const CTX_NEW_EDIT_MERCADERIA_IN = createContextId<any>('new_edit_mercaderia_IN');

export const CTX_MERCADERIA_IN = createContextId<IMercaderiaIN>('mercaderia_IN');

export default component$((props: { mercaSeleccio: any; contexto: string; conLote?: boolean; conFechaProduccion?: boolean; conFechaVencimiento?: boolean }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_EDIT_MERCADERIA_IN
  const definicion_CTX_NEW_EDIT_MERCADERIA_IN = useStore({
    mostrarPanelNewEditLineaTipoIN: false,
    grabo_lineaTipo: false,

    mostrarPanelNewEditMarcaIN: false,
    grabo_marca: false,

    mostrarPanelNewEditUnidadIN: false,
    grabo_unidad: false,

    mostrarPanelNewEditEquivalenciaIN: false,
    lasUE: [],
    laLineaTipo: [], //aux

    idLT: '',
    mostrarPanelBuscarUnidadSUNAT: false,
    laUNInewedit: { _id: '', unidad: '', descripcion: '' },
    grabo_unidadSUNAT: false,

    mostrarPanelBuscarUnidadEquivalenciaSUNAT: false,
    laUNIEQUInewedit: { _id: '', unidadEquivalencia: '', descripcion: '' },
    grabo_unidadEquivalenciaSUNAT: false,
    actualizarLasUE: false,
  });
  useContextProvider(CTX_NEW_EDIT_MERCADERIA_IN, definicion_CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion DEFINICION CTX_NEW_EDIT_MERCADERIA_IN

  //#region DEFINICION MERCADERIA
  const definicion_CTX_MERCADERIA_IN = useStore<IMercaderiaIN>({
    _id: props.mercaSeleccio._id ? props.mercaSeleccio._id : '',

    activo: typeof props.mercaSeleccio.activo === 'undefined' ? true : props.mercaSeleccio.activo,
    codigo: props.mercaSeleccio.codigo ? props.mercaSeleccio.codigo : '',
    descripcion: props.mercaSeleccio.descripcion ? props.mercaSeleccio.descripcion : '',
    aplicacion: props.mercaSeleccio.aplicacion ? props.mercaSeleccio.aplicacion : '',
    UNSPSC: props.mercaSeleccio.UNSPSC ? props.mercaSeleccio.UNSPSC : '',
    conLote: typeof props.mercaSeleccio.conLote === 'undefined' ? (typeof props.conLote === 'undefined' ? false : props.conLote) : props.mercaSeleccio.conLote,
    conFechaProduccion:
      typeof props.mercaSeleccio.conFechaProduccion === 'undefined'
        ? typeof props.conFechaProduccion === 'undefined'
          ? false
          : props.conFechaProduccion
        : props.mercaSeleccio.conFechaProduccion,
    conFechaVencimiento:
      typeof props.mercaSeleccio.conFechaVencimiento === 'undefined'
        ? typeof props.conFechaVencimiento === 'undefined'
          ? false
          : props.conFechaVencimiento
        : props.mercaSeleccio.conFechaVencimiento,

    idKardex: '',
    lote: '',
    fechaVencimiento: '',

    idLineaTipo: props.mercaSeleccio.idLineaTipo ? props.mercaSeleccio.idLineaTipo : '',
    lineaTipo: props.mercaSeleccio.lineaTipo ? props.mercaSeleccio.lineaTipo : '',
    idMarca: props.mercaSeleccio.idMarca ? props.mercaSeleccio.idMarca : '',
    marca: props.mercaSeleccio.marca ? props.mercaSeleccio.marca : '',
    idUnidad: props.mercaSeleccio.idUnidad ? props.mercaSeleccio.idUnidad : '',
    unidad: props.mercaSeleccio.unidad ? props.mercaSeleccio.unidad : '',

    tipoImpuesto: props.mercaSeleccio.tipoImpuesto ? props.mercaSeleccio.tipoImpuesto : 'IGV',
    tipoAfectacionDelImpuesto: props.mercaSeleccio.tipoAfectacionDelImpuesto ? props.mercaSeleccio.tipoAfectacionDelImpuesto : '10',
    porcentaje: props.mercaSeleccio.porcentaje ? props.mercaSeleccio.porcentaje : '18',

    kardex: props.mercaSeleccio.kardex ? props.mercaSeleccio.kardex : '',
    KARDEXS: props.mercaSeleccio.kardexs ? props.mercaSeleccio.kardexs : '',

    inafecto: typeof props.mercaSeleccio.inafecto === 'undefined' ? false : props.mercaSeleccio.inafecto,
    exonerado: typeof props.mercaSeleccio.exonerado === 'undefined' ? false : props.mercaSeleccio.exonerado,
    sujetoAPercepcion: typeof props.mercaSeleccio.sujetoAPercepcion === 'undefined' ? false : props.mercaSeleccio.sujetoAPercepcion,
    percepcion: props.mercaSeleccio.percepcion ? props.mercaSeleccio.percepcion : 2,

    equivalencias: props.mercaSeleccio.equivalencias ? props.mercaSeleccio.equivalencias : [],

    totalCantidadSaldo: props.mercaSeleccio.totalCantidadSaldo ? props.mercaSeleccio.totalCantidadSaldo : '',
    promedioCostoUnitarioMovil: props.mercaSeleccio.promedioCostoUnitarioMovil ? props.mercaSeleccio.promedioCostoUnitarioMovil : '',

    costoDeInicioPEN: props.mercaSeleccio.costoDeInicioPEN ? props.mercaSeleccio.costoDeInicioPEN : 0,
    costoPEN: props.mercaSeleccio.costoPEN ? props.mercaSeleccio.costoPEN : 0,

    precioPEN: props.mercaSeleccio.precioPEN ? props.mercaSeleccio.precioPEN : 0,
  });
  useContextProvider(CTX_MERCADERIA_IN, definicion_CTX_MERCADERIA_IN);
  //#endregion DEFINICION MERCADERIA

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'new_in_almacen':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'index_kardexs':
      ctx = useContext(CTX_INDEX_KARDEX);
      break;
    case 'registro_productos_terminados':
      ctx = useContext(CTX_REGISTRO_PRODUCTOS_TERMINADOS);
      break;
  }

  //const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
  //#endregion CONTEXTOS

  //#region INICIALIZANDO
  const ini = useSignal(0);
  // const buscarLineasTipos = useSignal(0);
  const lasLineasTipos = useSignal([]);
  const lasUnidades = useSignal<any>([]);
  const lasUnidadesEquivalencias = useSignal<any>([]);
  const lasMarcas = useSignal([]);

  const insertarEquivalencia = useSignal(false);
  const laEquivalencia = useSignal([]);

  const lTSelecionado = useStore({ id: '', lt: '' });
  const marSelecionado = useStore({ id: '', mar: '' });
  const uniSelecionado = useStore({ id: '', uni: '' });

  //#endregion INICIALIZANDO

  //#region OBTENER MARCAS DE MERCADERIAS
  const obtenerMarcas = $((idLineaTipo: string) => {
    console.log('entro a obtenerMarcas - idLineaTipo', idLineaTipo);
    const auxLineaTipo: any = lasLineasTipos.value.filter(({ _id }) => _id === idLineaTipo);
    const mars = auxLineaTipo[0].marcas;
    //  auxLineaTipo[0].unidades;
    console.log('first - auxLineaTipo', auxLineaTipo[0]);
    console.log('first - unis', mars.sort());
    //ORDENANDO UNIDADES
    const marsOrde: any = mars.sort((a: any, b: any) => {
      const marA = a.marca.toUpperCase(); // ignore upper and lowercase
      const marB = b.marca.toUpperCase(); // ignore upper and lowercase
      if (marA < marB) {
        return -1;
      }
      if (marA > marB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    console.log('first - marsOrde', marsOrde);
    lasMarcas.value = marsOrde;
  });
  //#endregion OBTENER MARCAS DE MERCADERIAS

  //#region OBTENER UNIDADES DE MERCADERIAS
  const obtenerUnidades = $((idLineaTipo: string) => {
    console.log('entro a obtenerUnidades - idLineaTipo', idLineaTipo);
    const auxLineaTipo: any = lasLineasTipos.value.filter(({ _id }) => _id === idLineaTipo);
    const unis = auxLineaTipo[0].unidades;
    console.log('first - auxLineaTipo', auxLineaTipo[0]);
    console.log('first - unis', unis.sort());
    //ORDENANDO UNIDADES
    const unisOrde: any = unis.sort((a: any, b: any) => {
      const uniA = a.unidad.toUpperCase(); // ignore upper and lowercase
      const uniB = b.unidad.toUpperCase(); // ignore upper and lowercase
      if (uniA < uniB) {
        return -1;
      }
      if (uniA > uniB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    console.log('first - unisOrde', unisOrde);
    lasUnidades.value = unisOrde;

    const unisEqui = auxLineaTipo[0].unidadesEquivalencias;
    //ORDENANDO UNIDADES EQUIVALENCIAS
    const unisEquiOrde: any = unisEqui.sort((a: any, b: any) => {
      const uniA = a.unidadEquivalencia.toUpperCase(); // ignore upper and lowercase
      const uniB = b.unidadEquivalencia.toUpperCase(); // ignore upper and lowercase
      if (uniA < uniB) {
        return -1;
      }
      if (uniA > uniB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    console.log('first - unisEquiOrde', unisEquiOrde);
    lasUnidadesEquivalencias.value = unisEquiOrde;
    definicion_CTX_NEW_EDIT_MERCADERIA_IN.lasUE = unisEquiOrde;
  });
  //#endregion OBTENER UNIDADES DE MERCADERIAS

  //#region OBTENER LINEAS / TIPOS DE MERCADERIAS
  const obtenerLineasTipos = $(async () => {
    // console.log('enotro a obtenerLineasTipos');
    const listaLineasTipos = await getLineasTipos({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    console.log('listaLineasTipos.data', listaLineasTipos.data);

    lasLineasTipos.value = listaLineasTipos.data;
    if (definicion_CTX_MERCADERIA_IN.idLineaTipo !== '') {
      obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
      obtenerMarcas(definicion_CTX_MERCADERIA_IN.idLineaTipo);
    }
  });

  //#endregion OBTENER LINEAS / TIPOS DE MERCADERIAS

  //#region ACTUALIZAR LINEA / TIPO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_lineaTipo);
    if (definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_lineaTipo) {
      obtenerLineasTipos();
      definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_lineaTipo = false;
    }
  });
  //#endregion ACTUALIZAR LINEA / TIPO

  //#region ACTUALIZAR MARCA
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_marca);
    if (definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_marca) {
      //ORDENAR MARCAS
      const uno: any = definicion_CTX_NEW_EDIT_MERCADERIA_IN.laLineaTipo;
      console.log('uno marca', uno);
      // const dos: any = uno.marcas;
      const dos: any = uno.marcas;
      console.log('dos marca', dos);
      //ORDENANDO MARCAS EQUIVALENCIAS
      const marsOrde: any = dos.sort((a: any, b: any) => {
        const marA = a.marca.toUpperCase(); // ignore upper and lowercase
        const marB = b.marca.toUpperCase(); // ignore upper and lowercase
        if (marA < marB) {
          return -1;
        }
        if (marA > marB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      console.log('first - marsOrde', marsOrde);
      lasMarcas.value = marsOrde;

      definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_marca = false;
    }
  });
  //#endregion ACTUALIZAR MARCA

  //#region ACTUALIZAR UNIDAD
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidad);
    if (definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidad) {
      //ORDENAR UNIDADES
      const uno: any = definicion_CTX_NEW_EDIT_MERCADERIA_IN.laLineaTipo;
      console.log('uno unidad', uno);
      const dos: any = uno.unidades;
      //ORDENANDO UNIDADES EQUIVALENCIAS
      const unisOrde: any = dos.sort((a: any, b: any) => {
        const uniA = a.unidad.toUpperCase(); // ignore upper and lowercase
        const uniB = b.unidad.toUpperCase(); // ignore upper and lowercase
        if (uniA < uniB) {
          return -1;
        }
        if (uniA > uniB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      console.log('first - unisOrde', unisOrde);
      lasUnidades.value = unisOrde;

      definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidad = false;
    }
  });
  //#endregion ACTUALIZAR UNIDAD

  //#region ACTUALIZAR UNIDAD SUNAT
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadSUNAT);
    console.log('definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit', definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit);
    if (definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadSUNAT) {
      console.log('first');
      const LINE: any = lasLineasTipos.value.filter((LT: any) => LT._id === definicion_CTX_NEW_EDIT_MERCADERIA_IN.idLT);
      console.log('second LINE', LINE, definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit.unidad);
      const laUNIDAD = LINE[0].unidades.filter((lasUNIS: any) => lasUNIS.unidad === definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit.unidad);
      console.log('tree laUNIDAD', laUNIDAD);
      if (laUNIDAD.length === 0) {
        LINE[0].unidades.push(definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit);
        LINE[0].unidades.sort((a: any, b: any) => {
          const uniA = a.unidad.toUpperCase(); // ignore upper and lowercase
          const uniB = b.unidad.toUpperCase(); // ignore upper and lowercase
          if (uniA < uniB) {
            return -1;
          }
          if (uniA > uniB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        console.log('ford LINE[0]', LINE[0]);
      }
      if (laUNIDAD.length === 1) {
        laUNIDAD[0]._id = definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit._id;
        laUNIDAD[0].unidad = definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit.unidad;
        laUNIDAD[0].descripcion = definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit.descripcion;
      }

      definicion_CTX_NEW_EDIT_MERCADERIA_IN.idLT = '';
      definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNInewedit = { _id: '', unidad: '', descripcion: '' };

      definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadSUNAT = false;
    }
  });
  //#endregion ACTUALIZAR UNIDAD SUNAT

  //#region ACTUALIZAR UNIDAD EQUIVALENCIA SUNAT
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadEquivalenciaSUNAT);

    console.log('definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit', definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit);
    if (definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadEquivalenciaSUNAT) {
      console.log('firstEQ');
      const LINE: any = lasLineasTipos.value.filter((LT: any) => LT._id === definicion_CTX_NEW_EDIT_MERCADERIA_IN.idLT);
      console.log('secondEQ LINE', LINE, definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit.unidadEquivalencia);
      const laUNIDADEQUI = LINE[0].unidadesEquivalencias.filter(
        (lasUNIS: any) => lasUNIS.unidadEquivalencia === definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit.unidadEquivalencia
      );
      if (laUNIDADEQUI.length === 0) {
        LINE[0].unidadesEquivalencias.push(definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit);
        LINE[0].unidadesEquivalencias.sort((a: any, b: any) => {
          const uniA = a.unidadEquivalencia.toUpperCase(); // ignore upper and lowercase
          const uniB = b.unidadEquivalencia.toUpperCase(); // ignore upper and lowercase
          if (uniA < uniB) {
            return -1;
          }
          if (uniA > uniB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        definicion_CTX_NEW_EDIT_MERCADERIA_IN.lasUE = LINE[0].unidadesEquivalencias;
        definicion_CTX_NEW_EDIT_MERCADERIA_IN.actualizarLasUE = true;
        console.log('treeEQ definicion_CTX_NEW_EDIT_MERCADERIA_IN.lasUE', definicion_CTX_NEW_EDIT_MERCADERIA_IN.lasUE);
        console.log('fordEQ LINE[0]', LINE[0]);
      }
      // console.log('treeEQ laUNIDADEQUI', laUNIDADEQUI);
      definicion_CTX_NEW_EDIT_MERCADERIA_IN.idLT = '';
      definicion_CTX_NEW_EDIT_MERCADERIA_IN.laUNIEQUInewedit = { _id: '', unidadEquivalencia: '', descripcion: '' };
      definicion_CTX_NEW_EDIT_MERCADERIA_IN.grabo_unidadEquivalenciaSUNAT = false;
    }
  });
  //#endregion ACTUALIZAR UNIDAD EQUIVALENCIA SUNAT

  useTask$(({ track }) => {
    track(() => ini.value);
    console.log('entro a useTask');
    obtenerLineasTipos();
    // if (definicion_CTX_MERCADERIA_IN.idLineaTipo !== '') {
    //   obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
    // }
  });

  //#region REGISTRAR MERCADERIA
  const registrarMercaderia = $(async () => {
    // if (definicion_CTX_MERCADERIA_IN.codigo === '') {
    //   alert('Ingrese el código');
    //   document.getElementById('se_codigo_MERCADERIA_IN')?.focus();
    //   return;
    // }
    if (definicion_CTX_MERCADERIA_IN.descripcion === '') {
      alert('Ingrese la descripción');
      document.getElementById('se_descripcion_MERCADERIA_IN')?.focus();
      return;
    }
    if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
      alert('Ingrese la linea / tipo');
      document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
      return;
    }
    if (definicion_CTX_MERCADERIA_IN.idMarca === '') {
      alert('Ingrese la marca');
      document.getElementById('se_marca_MERCADERIA_IN')?.focus();
      return;
    }
    if (definicion_CTX_MERCADERIA_IN.idUnidad === '') {
      alert('Ingrese la descripción');
      document.getElementById('se_unidad_MERCADERIA_IN')?.focus();
      return;
    }
    if (definicion_CTX_MERCADERIA_IN.equivalencias.length < 1) {
      alert('Ingrese al menos una equivalencia');
      document.getElementById('btn_add_equivalencia_MERCADERIA_IN')?.focus();
      return;
    }

    ctx.mostrarSpinner = true;
    const merca = await inUpMercaderia({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idAlmacenOrigen: parametrosGlobales.idAlmacen,
      idMercaderia: definicion_CTX_MERCADERIA_IN._id,

      activo: definicion_CTX_MERCADERIA_IN.activo,
      codigo: definicion_CTX_MERCADERIA_IN.codigo,
      descripcion: definicion_CTX_MERCADERIA_IN.descripcion,
      aplicacion: definicion_CTX_MERCADERIA_IN.aplicacion,

      UNSPSC: definicion_CTX_MERCADERIA_IN.UNSPSC,

      conLote: definicion_CTX_MERCADERIA_IN.conLote,
      conFechaProduccion: definicion_CTX_MERCADERIA_IN.conFechaProduccion,
      conFechaVencimiento: definicion_CTX_MERCADERIA_IN.conFechaVencimiento,

      idLineaTipo: definicion_CTX_MERCADERIA_IN.idLineaTipo,
      lineaTipo: definicion_CTX_MERCADERIA_IN.lineaTipo,
      idMarca: definicion_CTX_MERCADERIA_IN.idMarca,
      marca: definicion_CTX_MERCADERIA_IN.marca,
      idUnidad: definicion_CTX_MERCADERIA_IN.idUnidad,
      unidad: definicion_CTX_MERCADERIA_IN.unidad,
      // kardex: props.mercaSeleccio.kardex ? props.mercaSeleccio.kardex : '',
      // kardexs: props.mercaSeleccio.kardexs ? props.mercaSeleccio.kardexs : '',
      tipoImpuesto: definicion_CTX_MERCADERIA_IN.tipoImpuesto,
      tipoAfectacionDelImpuesto: definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto,

      inafecto: definicion_CTX_MERCADERIA_IN.inafecto,
      exonerado: definicion_CTX_MERCADERIA_IN.exonerado,
      sujetoAPercepcion: definicion_CTX_MERCADERIA_IN.sujetoAPercepcion,
      percepcion: definicion_CTX_MERCADERIA_IN.percepcion,

      equivalencias: definicion_CTX_MERCADERIA_IN.equivalencias,

      costoDeInicioPEN: definicion_CTX_MERCADERIA_IN.costoDeInicioPEN,
      // totalCantidadSaldo: props.mercaSeleccio.totalCantidadSaldo ? props.mercaSeleccio.totalCantidadSaldo : '',
      // costoPEN: props.mercaSeleccio.costoPEN ? props.mercaSeleccio.costoPEN : 0,
      // precioPEN: props.mercaSeleccio.precioPEN ? props.mercaSeleccio.precioPEN : 0,
    });

    console.log('merca', merca);

    ctx.abuscar = merca.data.descripcion;
    ctx.grabo_mercaderiaIN = true;
    ctx.mostrarPanelNewEditMercaderiaIN = false;
  });
  //#endregion REGISTRAR MERCADERIA

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 496px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver props.mercaSeleccio"
          onClick={$(() => {
            console.log('props.mercaSeleccio', props.mercaSeleccio);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver props.mercaSeleccio.conLote"
          onClick={$(() => {
            console.log('props.mercaSeleccio.conLote', props.mercaSeleccio.conLote);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver definicion_CTX_MERCADERIA_IN"
          onClick={$(() => {
            console.log('definicion_CTX_MERCADERIA_IN', definicion_CTX_MERCADERIA_IN);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver lasLineasTipos.value"
          onClick={$(() => {
            console.log('lasLineasTipos.value', lasLineasTipos.value);
          })}
        />{' '}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewEditMercaderiaIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Registro de mercadería</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        <div>
          {/* Código */}
          <div class="form-control">
            <input
              id="se_codigo_MERCADERIA_IN"
              style={{ width: '100%' }}
              disabled
              maxLength={13}
              type="text"
              placeholder="Código"
              value={definicion_CTX_MERCADERIA_IN.codigo}
              onChange$={(e) => {
                definicion_CTX_MERCADERIA_IN.codigo = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('se_descripcion_MERCADERIA_IN')?.focus();
                }
                // if (e.key === 'Escape') {
                //   document.getElementById('tipoDocumentoIdentidad')?.focus();
                // }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
          </div>
          {/* Descripción */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="se_descripcion_MERCADERIA_IN"
                style={{ width: '100%' }}
                type="text"
                placeholder="Descripción"
                value={definicion_CTX_MERCADERIA_IN.descripcion}
                onChange$={(e) => {
                  definicion_CTX_MERCADERIA_IN.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('se_aplicacion_MERCADERIA_IN')?.focus();
                  }
                  // if (e.key === 'Escape') {
                  //   document.getElementById('tipoDocumentoIdentidad')?.focus();
                  // }
                }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
              />
            </div>
          </div>
          {/* Aplicación */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="se_aplicacion_MERCADERIA_IN"
                style={{ width: '100%' }}
                type="text"
                placeholder="Aplicación  (para que se usa o en donde se usa)"
                value={definicion_CTX_MERCADERIA_IN.aplicacion}
                onChange$={(e) => {
                  definicion_CTX_MERCADERIA_IN.aplicacion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('se_UNSPSC_MERCADERIA_IN')?.focus();
                  }
                  // if (e.key === 'Escape') {
                  //   document.getElementById('tipoDocumentoIdentidad')?.focus();
                  // }
                }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
              />
            </div>
          </div>
          {/* UNSPSC */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="se_UNSPSC_MERCADERIA_IN"
                style={{ width: '100%' }}
                type="text"
                placeholder="UNSPSC"
                value={definicion_CTX_MERCADERIA_IN.UNSPSC}
                onChange$={(e) => {
                  definicion_CTX_MERCADERIA_IN.UNSPSC = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                  }
                  // if (e.key === 'Escape') {
                  //   document.getElementById('tipoDocumentoIdentidad')?.focus();
                  // }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
            </div>
          </div>
          {/* Linea / Tipo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                // estilos={{ width: '100%' }}
                id={'se_lineaTipo_MERCADERIA_IN'}
                valorSeleccionado={definicion_CTX_MERCADERIA_IN.lineaTipo}
                registros={lasLineasTipos.value}
                registroID={'_id'}
                registroTEXT={'lineaTipoMercaderia'}
                seleccione={'-- Seleccione linea / tipo --'}
                onChange={$(() => {
                  // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                  const elSelec = document.getElementById('se_lineaTipo_MERCADERIA_IN') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  // console.log('?', elIdx, elSelec[elIdx].id);
                  definicion_CTX_MERCADERIA_IN.idLineaTipo = elSelec[elIdx].id;
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    definicion_CTX_MERCADERIA_IN.lineaTipo = '';
                  } else {
                    definicion_CTX_MERCADERIA_IN.lineaTipo = elSelec.value;
                    obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                    obtenerMarcas(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_marca_MERCADERIA_IN') as HTMLSelectElement)?.focus();
                  }
                })}
              />
            </div>
            {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditLineaTipoIN && (
              <div class="modal">
                {/* <NewEditLineaTipoIN idLineaTipo={lTSelecionado.id} lineaTipo={lTSelecionado.lt} /> */}
                <NewEditLineaTipoIN lineaTipoSelecc={{ idLineaTipo: lTSelecionado.id, lineaTipo: lTSelecionado.lt }} />
              </div>
            )}
          </div>
          {/* Marca */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                // estilos={{ width: '100%' }}
                id={'se_marca_MERCADERIA_IN'}
                valorSeleccionado={definicion_CTX_MERCADERIA_IN.marca}
                registros={lasMarcas.value}
                registroID={'_id'}
                registroTEXT={'marca'}
                seleccione={'-- Seleccione marca --'}
                onChange={$(() => {
                  // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                  const elSelec = document.getElementById('se_marca_MERCADERIA_IN') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  // console.log('?', elIdx, elSelec[elIdx].id);
                  definicion_CTX_MERCADERIA_IN.idMarca = elSelec[elIdx].id;
                  if (definicion_CTX_MERCADERIA_IN.idMarca === '') {
                    definicion_CTX_MERCADERIA_IN.marca = '';
                  } else {
                    definicion_CTX_MERCADERIA_IN.marca = elSelec.value;
                    //obtenerModelosVehiculares();
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_unidad_MERCADERIA_IN') as HTMLSelectElement)?.focus();
                  }
                })}
              />
              <input
                type="image"
                src={images.add}
                alt="Icono de adicionar marca"
                height={16}
                width={16}
                title="Adicionar la marca"
                style={{ margin: '0 2px' }}
                onClick$={() => {
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    alert('Seleccione la linea / tipo');
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                    return;
                  }
                  marSelecionado.id = '';
                  marSelecionado.mar = '';
                  definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditMarcaIN = true;
                }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de edición marca"
                height={16}
                width={16}
                title="Editar marca"
                onClick$={() => {
                  const elSelec = document.getElementById('se_marca_MERCADERIA_IN') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Seleccione la marca.');
                    elSelec.focus();
                    return;
                  }
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    alert('Seleccione la linea / tipo');
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                    return;
                  }
                  marSelecionado.id = elSelec[elIdx].id;
                  marSelecionado.mar = elSelec.value;
                  definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditMarcaIN = true;
                }}
              />
            </div>
            {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditMarcaIN && (
              <div class="modal">
                <NewEditMarcaIN
                  idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo}
                  lineaTipo={definicion_CTX_MERCADERIA_IN.lineaTipo}
                  idMarca={marSelecionado.id}
                  marca={marSelecionado.mar}
                />
              </div>
            )}
          </div>
          {/* Unidad */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                // estilos={{ width: '100%' }}
                id={'se_unidad_MERCADERIA_IN'}
                valorSeleccionado={definicion_CTX_MERCADERIA_IN.unidad}
                registros={lasUnidades.value}
                registroID={'_id'}
                registroTEXT={'unidad'}
                seleccione={'-- Seleccione unidad --'}
                onChange={$(() => {
                  // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                  const elSelec = document.getElementById('se_unidad_MERCADERIA_IN') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  definicion_CTX_MERCADERIA_IN.idUnidad = elSelec[elIdx].id;
                  if (definicion_CTX_MERCADERIA_IN.idUnidad === '') {
                    definicion_CTX_MERCADERIA_IN.unidad = '';
                  } else {
                    definicion_CTX_MERCADERIA_IN.unidad = elSelec.value;
                    //obtenerModelosVehiculares();
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('in_conFechaVencimientoLote_MERCADERIA_IN') as HTMLSelectElement)?.focus();
                  }
                })}
              />
              <input
                type="image"
                src={images.searchPLUS}
                alt="Icono de buscar unidad"
                height={16}
                width={16}
                title="Buscar unidad"
                style={{ margin: '0 18px 0 2px' }}
                onClick$={() => {
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    alert('Seleccione la linea / tipo');
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                    return;
                  }
                  uniSelecionado.id = '';
                  uniSelecionado.uni = '';
                  definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelBuscarUnidadSUNAT = true;
                }}
              />
              {/* <input
                type="image"
                src={images.add}
                alt="Icono de adicionar unidad"
                height={16}
                width={16}
                title="Adicionar la unidad"
                style={{ margin: '0 2px' }}
                onClick$={() => {
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    alert('Seleccione la linea / tipo');
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                    return;
                  }
                  uniSelecionado.id = '';
                  uniSelecionado.uni = '';
                  definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditUnidadIN = true;
                }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de edición unidad"
                height={16}
                width={16}
                title="Editar unidad"
                onClick$={() => {
                  const elSelec = document.getElementById('se_unidad_MERCADERIA_IN') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Seleccione la unidad.');
                    elSelec.focus();
                    return;
                  }
                  if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                    alert('Seleccione la linea / tipo');
                    document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                    return;
                  }
                  uniSelecionado.id = elSelec[elIdx].id;
                  uniSelecionado.uni = elSelec.value;
                  definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditUnidadIN = true;
                }}
              /> */}
            </div>
            {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelBuscarUnidadSUNAT && (
              <div class="modal">
                <BuscarUnidadSUNAT idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo} lineaTipo={definicion_CTX_MERCADERIA_IN.lineaTipo} />
              </div>
            )}
            {/* {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditUnidadIN && (
              <div class="modal">
                <NewEditUnidadIN
                  idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo}
                  idUnidad={uniSelecionado.id}
                  unidad={uniSelecionado.uni}
                />
              </div>
            )} */}
          </div>
          {/* GRUPO CAMPOS => con Fecha Vencimiento / Lote - Inafecto - Exonerado - Sujeto a percepción */}
          {/* <fieldset style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}> */}
          <fieldset class="servicios">
            {/* con Lote - conFechaProduccion - conFechaVencimiento */}
            <div>
              <div>
                <input
                  id="in_conLote_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="con Lote"
                  checked={definicion_CTX_MERCADERIA_IN.conLote}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.conLote = (e.target as HTMLInputElement).checked;
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_inafecto_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_conLote_MERCADERIA_IN">con Lote</label>
              </div>
              <div>
                <input
                  id="in_conFechaProduccion_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="con Fecha Producción"
                  checked={definicion_CTX_MERCADERIA_IN.conFechaProduccion}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.conFechaProduccion = (e.target as HTMLInputElement).checked;
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_inafecto_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_conFechaProduccion_MERCADERIA_IN">con Fecha Producción</label>
              </div>
              <div>
                <input
                  id="in_conFechaVencimiento_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="con Fecha Vencimiento / Lote"
                  checked={definicion_CTX_MERCADERIA_IN.conFechaVencimiento}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.conFechaVencimiento = (e.target as HTMLInputElement).checked;
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_inafecto_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_conFechaVencimiento_MERCADERIA_IN">con Fecha Vencimiento</label>
              </div>
            </div>
            {/* Inafecto - Exonerado - Sujeto a percepción */}
            <div>
              {/* Inafecto */}
              <div>
                <input
                  id="in_inafecto_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="Inafecto"
                  checked={definicion_CTX_MERCADERIA_IN.inafecto}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.inafecto = (e.target as HTMLInputElement).checked;
                    if (definicion_CTX_MERCADERIA_IN.inafecto) {
                      definicion_CTX_MERCADERIA_IN.exonerado = false;
                    }
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_exonerado_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_inafecto_MERCADERIA_IN"></label> Inafecto
              </div>
              {/* Exonerado */}
              <div>
                <input
                  id="in_exonerado_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="Exonerado"
                  checked={definicion_CTX_MERCADERIA_IN.exonerado}
                  value="Exonerado"
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.exonerado = (e.target as HTMLInputElement).checked;
                    if (definicion_CTX_MERCADERIA_IN.exonerado) {
                      definicion_CTX_MERCADERIA_IN.inafecto = false;
                    }
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_sujetoAPercepcion_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_exonerado_MERCADERIA_IN">Exonerado</label>
              </div>
              {/* sujetoAPercepcion */}
              <div>
                <input
                  id="in_sujetoAPercepcion_MERCADERIA_IN"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="sujetoAPercepcion"
                  checked={definicion_CTX_MERCADERIA_IN.sujetoAPercepcion}
                  // value="sujetoAPercepcion"
                  name="sujetoAPercepcion"
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.sujetoAPercepcion = (e.target as HTMLInputElement).checked;
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('btn_add_equivalencia_MERCADERIA_IN')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="in_sujetoAPercepcion_MERCADERIA_IN">Sujeto a percepción</label>
              </div>
            </div>
          </fieldset>
          {/* para la VENTA: TIPO IMPUESTO - TIPO DE AFECTACION DEL IMPUESTO */}
          <fieldset>
            {/* TIPO IMPUESTO */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="se_tipoImpuesto_MERCADERIA_IN"
                  // style={{ width: "288px" }}
                  // style={{ width: "inherit" }}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.tipoImpuesto = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="IGV" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'IGV'}>
                    IGV
                  </option>
                  <option value="ISC" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'ISC'}>
                    ISC
                  </option>
                  <option value="IVAP" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'IVAP'}>
                    IVAP
                  </option>
                  <option value="exoneradas" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'exoneradas'}>
                    exoneradas
                  </option>
                  <option value="exportación" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'exportación'}>
                    exportación
                  </option>
                  <option value="gratuitas" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'gratuitas'}>
                    gratuitas
                  </option>
                  <option value="inafecta" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'inafecta'}>
                    inafecta
                  </option>
                  <option value="otrosTributos" selected={definicion_CTX_MERCADERIA_IN.tipoImpuesto === 'otrosTributos'}>
                    otrosTributos
                  </option>
                </select>
              </div>
            </div>
            {/* TIPO DE AFECTACION DEL IMPUESTO */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="se_tipoAfectacionDelImpuesto_MERCADERIA_IN"
                  // style={{ width: "288px" }}
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="10" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '10'}>
                    Gravado - Operación Onerosa
                  </option>
                  <option value="11" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '11'}>
                    Gravado - Retiro por premio
                  </option>
                  <option value="12" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '12'}>
                    Gravado - Retiro por donación
                  </option>
                  <option value="13" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '13'}>
                    Gravado - Retiro
                  </option>
                  <option value="14" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '14'}>
                    Gravado - Retiro por publicidad
                  </option>
                  <option value="15" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '15'}>
                    Gravado - Bonificaciones
                  </option>
                  <option value="16" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '16'}>
                    Gravado - Retiro por entrega a trabajadores
                  </option>
                  <option value="17" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '17'}>
                    Gravado - IVAP
                  </option>
                  <option value="20" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '20'}>
                    Exonerado - Operación Onerosa
                  </option>
                  <option value="21" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '21'}>
                    Exonerado - Transferencia gratuita
                  </option>
                  <option value="30" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '30'}>
                    Inafecto - Operación Onerosa
                  </option>
                  <option value="31" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '31'}>
                    Inafecto - Retiro por Bonificación
                  </option>
                  <option value="32" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '32'}>
                    Inafecto - Retiro
                  </option>
                  <option value="33" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '33'}>
                    Inafecto - Retiro por Muestras Médicas
                  </option>
                  <option value="34" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '34'}>
                    Inafecto - Retiro por Convenio Colectivo
                  </option>
                  <option value="35" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '35'}>
                    Inafecto - Retiro por premio
                  </option>
                  <option value="36" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '36'}>
                    Inafecto - Retiro por publicidad
                  </option>
                  <option value="37" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '37'}>
                    Inafecto - Transferencia gratuita
                  </option>
                  <option value="40" selected={definicion_CTX_MERCADERIA_IN.tipoAfectacionDelImpuesto === '40'}>
                    Exportación de Bienes o Servicios
                  </option>
                </select>
              </div>
            </div>
          </fieldset>
          {/* EQUIVALENCIAS */}
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
                <ElButton
                  id="btn_add_equivalencia_MERCADERIA_IN"
                  class="btn"
                  name="Add equivalencia"
                  title="Add equivalencia"
                  onClick={$(() => {
                    if (definicion_CTX_MERCADERIA_IN.idUnidad === '') {
                      alert('Seleccione la unidad.');
                      return;
                    }
                    insertarEquivalencia.value = true;
                    laEquivalencia.value = [];
                    definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditEquivalenciaIN = true;
                  })}
                />
              </div>
              {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditEquivalenciaIN && (
                <div class="modal">
                  <NewEditEquivalenciaIN
                    unidadIN={definicion_CTX_MERCADERIA_IN.unidad}
                    idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo}
                    lineaTipo={definicion_CTX_MERCADERIA_IN.lineaTipo}
                    equivaSelecci={laEquivalencia.value}
                    // equivaSelecci={[]}
                    insertar={insertarEquivalencia.value}
                  />
                </div>
              )}
              {/* TABLA EQUIVALENCIAS IN  */}
              {definicion_CTX_MERCADERIA_IN.equivalencias.length > 0 ? (
                <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Descripción Equivalencia</th>
                      {/* <th>Tipo Equivalencia</th> */}
                      <th>Uni Eq</th>
                      <th>=</th>
                      <th>Factor</th>
                      <th>Uni</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_MERCADERIA_IN.equivalencias.map((iTEqui: any) => {
                      // const indexItem = index + 1;

                      return (
                        <tr key={iTEqui.idAuxiliar}>
                          {/* <td data-label="Ítem" key={iTSer.idAuxili ar}>{`${cerosALaIzquierda(indexItemServi, 3)}`}</td> */}
                          <td data-label="Descripción Equivalencia">{iTEqui.descripcionEquivalencia}</td>
                          {/* <td data-label="Tipo Equivalencia">{iTEqui.tipoEquivalencia ? 'T' : 'F'}</td> */}

                          <td data-label="Uni Eq" class="comoNumero">
                            {iTEqui.unidadEquivalencia}
                          </td>
                          <td data-label="=" class="acciones">
                            =
                          </td>
                          <td data-label="Factor" class="acciones">
                            {iTEqui.tipoEquivalencia ? iTEqui.factor : '1/' + iTEqui.factor}
                          </td>
                          <td data-label="Uni" class="comoCadena">
                            {definicion_CTX_MERCADERIA_IN.unidad}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar ítem"
                              style={{ marginRight: '8px' }}
                              onClick$={() => {
                                insertarEquivalencia.value = false;
                                laEquivalencia.value = iTEqui;
                                definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditEquivalenciaIN = true;
                              }}
                            />
                            <input type="image" src={images.trash} alt="icono de eliminar" height={12} width={12} title="Eliminar ítem" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen equivalencias</i>
              )}
              {/*    {showPanelDeleteItemTablaServicios && (
              <Modal componente={<PanelMensajeSiNo ancho={'500px'} onCerrar={cerrarPanelDeleteItemTablaServicios} />} />
            )}*/}
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="btn_registrar_mercaderia_MERCADERIA_IN"
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            registrarMercaderia();
          }}
        />
      </div>
    </div>
  );
});
