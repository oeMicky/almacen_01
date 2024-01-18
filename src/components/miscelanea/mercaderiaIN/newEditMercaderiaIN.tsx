import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useStyles$,
  useTask$,
} from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { IMercaderiaIN } from '~/interfaces/iMercaderia';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
// import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ElButton from '~/components/system/elButton';
import NewEditEquivalenciaIN from './newEditEquivalenciaIN';
import ElSelect from '~/components/system/elSelect';
import NewEditLineaTipoIN from './newEditLineaTipoIN';
import NewEditUnidadIN from './newEditUnidadIN';
import { getLineasTipos } from '~/apis/lineaTipo.api';
import { parametrosGlobales } from '~/routes/login';
import style from '../../tabla/tabla.css?inline';
import { inUpMercaderia } from '~/apis/mercaderia.api';
import NewEditMarcaIN from './newEditMarcaIN';
import { CTX_INDEX_KARDEX } from '~/routes/(almacen)/kardex';

export const CTX_NEW_EDIT_MERCADERIA_IN = createContextId<any>('new_edit_mercaderia_IN');

export const CTX_MERCADERIA_IN = createContextId<IMercaderiaIN>('mercaderia_IN');

export default component$((props: { mercaSeleccio: any; contexto: string }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_IN_ALMACEN
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
  });
  useContextProvider(CTX_NEW_EDIT_MERCADERIA_IN, definicion_CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion DEFINICION CTX_NEW_EDIT_COTIZACION

  //#region DEFINICION MERCADERIA - NEW  /  EDIT
  const definicion_CTX_MERCADERIA_IN = useStore<IMercaderiaIN>({
    _id: props.mercaSeleccio._id ? props.mercaSeleccio._id : '',

    activo: props.mercaSeleccio.activo ? props.mercaSeleccio.activo : true,
    codigo: props.mercaSeleccio.codigo ? props.mercaSeleccio.codigo : '',
    descripcion: props.mercaSeleccio.descripcion ? props.mercaSeleccio.descripcion : '',
    UNSPSC: props.mercaSeleccio.UNSPSC ? props.mercaSeleccio.UNSPSC : '',
    conFechaVencimientoLote: props.mercaSeleccio.conFechaVencimientoLote ? props.mercaSeleccio.conFechaVencimientoLote : false,

    idKardex: '',
    lote: '',
    fechaVencimiento: '',

    idLineaTipo: props.mercaSeleccio.idLineaTipo ? props.mercaSeleccio.idLineaTipo : '',
    lineaTipo: props.mercaSeleccio.lineaTipo ? props.mercaSeleccio.lineaTipo : '',
    idMarca: props.mercaSeleccio.idMarca ? props.mercaSeleccio.idMarca : '',
    marca: props.mercaSeleccio.marca ? props.mercaSeleccio.marca : '',
    idUnidad: props.mercaSeleccio.idUnidad ? props.mercaSeleccio.idUnidad : '',
    unidad: props.mercaSeleccio.unidad ? props.mercaSeleccio.unidad : '',

    kardex: props.mercaSeleccio.kardex ? props.mercaSeleccio.kardex : '',
    KARDEXS: props.mercaSeleccio.kardexs ? props.mercaSeleccio.kardexs : '',

    inafecto: props.mercaSeleccio.inafecto ? props.mercaSeleccio.inafecto : false,
    exonerado: props.mercaSeleccio.exonerado ? props.mercaSeleccio.exonerado : false,
    sujetoAPercepcion: props.mercaSeleccio.sujetoAPercepcion ? props.mercaSeleccio.sujetoAPercepcion : false,
    percepcion: props.mercaSeleccio.percepcion ? props.mercaSeleccio.percepcion : 2,

    equivalencias: props.mercaSeleccio.equivalencias ? props.mercaSeleccio.equivalencias : [],

    totalCantidadSaldo: props.mercaSeleccio.totalCantidadSaldo ? props.mercaSeleccio.totalCantidadSaldo : '',
    promedioCostoUnitarioMovil: props.mercaSeleccio.promedioCostoUnitarioMovil
      ? props.mercaSeleccio.promedioCostoUnitarioMovil
      : '',
    costoPEN: props.mercaSeleccio.costoPEN ? props.mercaSeleccio.costoPEN : 0,
    precioPEN: props.mercaSeleccio.precioPEN ? props.mercaSeleccio.precioPEN : 0,
  });
  useContextProvider(CTX_MERCADERIA_IN, definicion_CTX_MERCADERIA_IN);
  //#endregion DEFINICION MERCADERIA - NEW  /  EDIT

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'new_in_almacen':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'index_kardexs':
      ctx = useContext(CTX_INDEX_KARDEX);
      break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
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
    //  auxLineaTipo[0].unidades;
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
    // console.log('first - auxLineaTipo - unidades', auxLineaTipo[0].unidades.sort());
    // const listaLineasTipos = await getLineasTipos({
    //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    //   idEmpresa: parametrosGlobales.idEmpresa,
    // });
    // console.log('listaLineasTipos.data', listaLineasTipos.data);

    // lasLineasTipos.value = listaLineasTipos.data;
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

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   console.log('entro a useTask');
  //   obtenerLineasTipos();
  // });
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
    if (definicion_CTX_MERCADERIA_IN.codigo === '') {
      alert('Ingrese el código');
      document.getElementById('se_codigo_MERCADERIA_IN')?.focus();
      return;
    }
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

    const merca = await inUpMercaderia({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idAlmacenOrigen: parametrosGlobales.idAlmacen,
      idMercaderia: definicion_CTX_MERCADERIA_IN._id,

      activo: definicion_CTX_MERCADERIA_IN.activo,
      codigo: definicion_CTX_MERCADERIA_IN.codigo,
      descripcion: definicion_CTX_MERCADERIA_IN.descripcion,
      UNSPSC: definicion_CTX_MERCADERIA_IN.UNSPSC,
      conFechaVencimientoLote: definicion_CTX_MERCADERIA_IN.conFechaVencimientoLote,

      idLineaTipo: definicion_CTX_MERCADERIA_IN.idLineaTipo,
      lineaTipo: definicion_CTX_MERCADERIA_IN.lineaTipo,
      idMarca: definicion_CTX_MERCADERIA_IN.idMarca,
      marca: definicion_CTX_MERCADERIA_IN.marca,
      idUnidad: definicion_CTX_MERCADERIA_IN.idUnidad,
      unidad: definicion_CTX_MERCADERIA_IN.unidad,
      // kardex: props.mercaSeleccio.kardex ? props.mercaSeleccio.kardex : '',
      // kardexs: props.mercaSeleccio.kardexs ? props.mercaSeleccio.kardexs : '',

      inafecto: definicion_CTX_MERCADERIA_IN.inafecto,
      exonerado: definicion_CTX_MERCADERIA_IN.exonerado,
      sujetoAPercepcion: definicion_CTX_MERCADERIA_IN.sujetoAPercepcion,
      percepcion: definicion_CTX_MERCADERIA_IN.percepcion,

      equivalencias: definicion_CTX_MERCADERIA_IN.equivalencias,

      // totalCantidadSaldo: props.mercaSeleccio.totalCantidadSaldo ? props.mercaSeleccio.totalCantidadSaldo : '',
      // costoPEN: props.mercaSeleccio.costoPEN ? props.mercaSeleccio.costoPEN : 0,
      // precioPEN: props.mercaSeleccio.precioPEN ? props.mercaSeleccio.precioPEN : 0,
    });

    console.log('merca', merca);

    ctx.grabo_mercaderiaIN = true;
    ctx.mostrarPanelNewEditMercaderiaIN = false;
  });
  //#endregion REGISTRAR MERCADERIA

  return (
    <div
      style={{
        width: 'clamp(376px, 86%, 700px)',
        // width: 'auto',
        padding: '1px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewEditMercaderiaIN = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver persona"
          onClick={$(() => {
            console.log('definicion_CTX_MERCADERIA_IN', definicion_CTX_MERCADERIA_IN);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver persona"
          onClick={$(() => {
            console.log('props.mercaSeleccio', props.mercaSeleccio);
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de mercadería</h3>
      {/* FORMULARIO */}
      {/* ENCABEZADO */}
      <div>
        {/* Código */}
        <div class="form-control">
          <label>Código</label>
          <div class="form-control form-agrupado">
            <input
              id="se_codigo_MERCADERIA_IN"
              style={{ width: '100%' }}
              autoFocus
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
        </div>
        {/* Descripción */}
        <div class="form-control">
          <label>Descripción</label>
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
                  document.getElementById('se_UNSPSC_MERCADERIA_IN')?.focus();
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
        {/* UNSPSC */}
        <div class="form-control">
          <label>UNSPSC</label>
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
          <label>Linea / Tipo</label>
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
                console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                const elSelec = document.getElementById('se_lineaTipo_MERCADERIA_IN') as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                console.log('?', elIdx, elSelec[elIdx].id);
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
            <ImgButton
              src={images.add}
              alt="Icono de adicionar lote / tipo"
              height={16}
              width={16}
              title="Adicionar el lote / tipo"
              onClick={$(() => {
                lTSelecionado.id = '';
                lTSelecionado.lt = '';
                definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditLineaTipoIN = true;
              })}
            />
            <ImgButton
              src={images.edit}
              alt="Icono de edición linea / tipo"
              height={16}
              width={16}
              title="Editar linea / tipo"
              onClick={$(() => {
                const elSelec = document.getElementById('se_lineaTipo_MERCADERIA_IN') as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                console.log('elSelec.value', elSelec.value);
                if (elSelec[elIdx].id === '') {
                  alert('Selecione una linea / tipo');
                  elSelec.focus();
                  return;
                }
                lTSelecionado.id = elSelec[elIdx].id;
                lTSelecionado.lt = elSelec.value;
                definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditLineaTipoIN = true;
              })} //unidadIN={mercaderiaIN.unidad} equivaSelecci={[]}
            />
          </div>
          {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditLineaTipoIN && (
            <div class="modal">
              <NewEditLineaTipoIN idLineaTipo={lTSelecionado.id} lineaTipo={lTSelecionado.lt} />
            </div>
          )}
        </div>
        {/* Marca */}
        <div class="form-control">
          <label>Marca</label>
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
                console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                const elSelec = document.getElementById('se_marca_MERCADERIA_IN') as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                console.log('?', elIdx, elSelec[elIdx].id);
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
            <ImgButton
              src={images.add}
              alt="Icono de adicionar marca"
              height={16}
              width={16}
              title="Adicionar la marca"
              onClick={$(() => {
                if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                  alert('Seleccione la linea / tipo');
                  document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                  return;
                }
                marSelecionado.id = '';
                marSelecionado.mar = '';
                definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditMarcaIN = true;
              })}
            />
            <ImgButton
              src={images.edit}
              alt="Icono de edición marca"
              height={16}
              width={16}
              title="Editar marca"
              onClick={$(() => {
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
              })}
            />
          </div>
          {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditMarcaIN && (
            <div class="modal">
              <NewEditMarcaIN
                idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo}
                idMarca={marSelecionado.id}
                marca={marSelecionado.mar}
              />
            </div>
          )}
        </div>
        {/* Unidad */}
        <div class="form-control">
          <label>Unidad</label>
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
                console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
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
            <ImgButton
              src={images.add}
              alt="Icono de adicionar unidad"
              height={16}
              width={16}
              title="Adicionar la unidad"
              onClick={$(() => {
                if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                  alert('Seleccione la linea / tipo');
                  document.getElementById('se_lineaTipo_MERCADERIA_IN')?.focus();
                  return;
                }
                uniSelecionado.id = '';
                uniSelecionado.uni = '';
                definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditUnidadIN = true;
              })}
            />
            <ImgButton
              src={images.edit}
              alt="Icono de edición unidad"
              height={16}
              width={16}
              title="Editar unidad"
              onClick={$(() => {
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
              })}
            />
          </div>
          {definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditUnidadIN && (
            <div class="modal">
              <NewEditUnidadIN
                idLineaTipo={definicion_CTX_MERCADERIA_IN.idLineaTipo}
                idUnidad={uniSelecionado.id}
                unidad={uniSelecionado.uni}
              />
            </div>
          )}
        </div>
        {/* con Fecha Vencimiento / Lote - Inafecto - Exonerado - Sujeto a percepción */}
        <fieldset>
          {/* con Fecha Vencimiento / Lote */}
          <div class="form-control">
            <label>con Fecha Vencimiento / Lote</label>
            <div class="form-control ">
              <input
                id="in_conFechaVencimientoLote_MERCADERIA_IN"
                // style={{ width: '100%' }}
                type="checkbox"
                placeholder="con Fecha Vencimiento / Lote"
                checked={definicion_CTX_MERCADERIA_IN.conFechaVencimientoLote}
                onChange$={(e) => {
                  definicion_CTX_MERCADERIA_IN.conFechaVencimientoLote = (e.target as HTMLInputElement).checked;
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
              con Fecha Vencimiento / Lote
            </div>
          </div>
          {/* Inafecto */}
          <div class="form-control">
            <label>Inafecto</label>
            <div class="form-control ">
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
              Inafecto
            </div>
          </div>
          {/* Exonerado */}
          <div class="form-control">
            <label>Exonerado</label>
            <div class="form-control ">
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
              Exonerado
            </div>
          </div>
          {/* Sujeto a percepción */}
          <div class="form-control">
            <label>Sujeto a percepción</label>
            <div style={{ width: '100%' }}>
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
              Sujeto a percepción
              {/* <input
                  id="percepcionIN_MICE"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Percepción"
                  value={mercaderiaIN.percepcion}
                  onChange$={(e) => {
                    mercaderiaIN.percepcion = parseFloat((e.target as HTMLInputElement).value.trim());
                  }}
                  //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
                  onKeyUp$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('inafectoIN_MICE')?.focus();
                    }
                    // if (e.key === 'Escape') {
                    //   document.getElementById('tipoDocumentoIdentidad')?.focus();
                    // }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                % */}
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

                        <td data-label="Uni Eq" style={{ textAlign: 'end' }}>
                          {iTEqui.unidadEquivalencia}
                        </td>
                        <td data-label="=" style={{ textAlign: 'center' }}>
                          =
                        </td>
                        <td data-label="Factor" style={{ textAlign: 'end' }}>
                          {iTEqui.tipoEquivalencia ? iTEqui.factor : '1/' + iTEqui.factor}
                        </td>
                        <td data-label="Uni" style={{ textAlign: 'start' }}>
                          {definicion_CTX_MERCADERIA_IN.unidad}
                        </td>
                        <td data-label="Acciones" style={{ textAlign: 'right' }}>
                          <ImgButton
                            src={images.edit}
                            alt="icono de editar"
                            height={16}
                            width={16}
                            title="Editar ítem"
                            onClick={$(() => {
                              insertarEquivalencia.value = false;
                              laEquivalencia.value = iTEqui;
                              definicion_CTX_NEW_EDIT_MERCADERIA_IN.mostrarPanelNewEditEquivalenciaIN = true;
                            })}
                          />
                          <ImgButton src={images.trash} alt="icono de eliminar" height={16} width={16} title="Eliminar ítem" />
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
      <div class="add-form">
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
