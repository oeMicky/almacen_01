import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from './newEditGuiaRemision';
import { obtenerUnidadesBienesGR } from '~/apis/guiaRemision.api';
import { parametrosGlobales } from '~/routes/login';
import ElSelect from '../system/elSelect';
import BuscarSoloUnidadSUNAT from './buscarSoloUnidadSUNAT';
import { elIdAuxiliar } from '~/functions/comunes';

export const CTX_NEW_EDIT_REGISTRO_BIEN_GR = createContextId<any>('__new_edit_registro_bien_gr');
export const CTX_BIEN_GR = createContextId<any>('__bien_gr');

export default component$((props: { bienSeleccio: any }) => {
  //#region definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR
  const definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR = useStore({
    mostrarPanelBuscarSoloUnidadSUNAT: false,

    grabo_unidadSUNAT: false,
  });
  useContextProvider(CTX_NEW_EDIT_REGISTRO_BIEN_GR, definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR);
  //#endregion definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR

  //#region definicion_CTX_BIEN_GR
  const definicion_CTX_BIEN_GR = useStore({
    cantidad: props.bienSeleccio.cantidad ? props.bienSeleccio.cantidad : 1,
    unidad: props.bienSeleccio.unidad ? props.bienSeleccio.unidad : 'NIU',
    descripcion: props.bienSeleccio.descripcion ? props.bienSeleccio.descripcion : '',
  });
  useContextProvider(CTX_BIEN_GR, definicion_CTX_BIEN_GR);
  //#endregion definicion_CTX_BIEN_GR

  //#region CONTEXTO
  const ctx_new_edit_guia_remision = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  const documento = useContext(CTX_GUIA_REMISION).itemsGuiaRemision;
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  const lasUnidades = useSignal([]);

  useTask$(async ({ track }) => {
    track(() => ini.value);

    if (ini.value === 0) {
      const unidds = await obtenerUnidadesBienesGR({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
      });
      console.log('unidds', unidds);
      lasUnidades.value = unidds.data;
      console.log('lasUnidades.value', lasUnidades.value);
    }
  });
  //#endregion INICIALIZACION

  //#region ACTUALIZAR UNIDAD SUNAT
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR.grabo_unidadSUNAT);

    if (definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR.grabo_unidadSUNAT) {
      const unidds = await obtenerUnidadesBienesGR({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
      });
      console.log('unidds', unidds);
      lasUnidades.value = unidds.data;
      console.log('lasUnidades.value', lasUnidades.value);

      definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR.grabo_unidadSUNAT = false;
    }
  });
  //#endregion ACTUALIZAR UNIDAD SUNAT

  //#region REGISTRAR BIEN
  const registrarBien = $(() => {
    if (definicion_CTX_BIEN_GR.cantidad.toString() === '') {
      alert('Ingrese la cantidad');
      (document.getElementById('in_cantidad_REGISTRO_BIEN_GR') as HTMLInputElement).focus();
      return;
    }
    if (definicion_CTX_BIEN_GR.unidad.trim() === '') {
      alert('Ingrese la unidad');
      (document.getElementById('se_unidad_REGISTRO_BIEN_GR') as HTMLSelectElement).focus();
      return;
    }
    if (definicion_CTX_BIEN_GR.descripcion.trim() === '') {
      alert('Ingrese la descripción');
      (document.getElementById('in_descripcion_REGISTRO_BIEN_GR') as HTMLTextAreaElement).focus();
      return;
    }

    documento.push({
      idAuxiliar: elIdAuxiliar(),
      cantidad: definicion_CTX_BIEN_GR.cantidad,
      unidad: definicion_CTX_BIEN_GR.unidad.trim(),
      descripcion: definicion_CTX_BIEN_GR.descripcion.trim().toUpperCase(),
    });

    ctx_new_edit_guia_remision.mostrarPanelRegistrarBien = false;
  });
  //#endregion REGISTRAR BIEN

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 400px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_guia_remision.mostrarPanelRegistrarBien = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro del bien</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* cantidad */}
          <div class="linea-formulario12">
            <div>
              <label>Cantidad</label>
            </div>

            <div>
              <input
                id="in_cantidad_REGISTRO_BIEN_GR"
                // style={{ width: '100%' }}
                // style={{ width: "245px" }}
                style={{ width: 'clamp(200px, 245px, 245px)' }}
                // style={{ width: "clamp(200px, 86%, 246px)" }}
                type="number"
                // disabled
                placeholder="Cantidad"
                value={definicion_CTX_BIEN_GR.cantidad}
                onChange$={(e) => {
                  definicion_CTX_BIEN_GR.cantidad = (e.target as HTMLInputElement).value;
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_unidad_REGISTRO_BIEN_GR') as HTMLInputElement)?.focus();
                  }
                }}
              />
              {/* <label style={{ marginLeft: '4px' }}>{definicion_CTX_ADD_MANUFACTURA.unidad}</label> */}
            </div>
          </div>
          {/* Unidad */}
          <div class="linea-formulario12">
            <div>
              <label>Unidad</label>
            </div>
            <div style={{ display: 'flex' }}>
              <ElSelect
                estilos={{ width: 'clamp(200px, 225px, 225px)' }}
                id={'se_unidad_REGISTRO_BIEN_GR'}
                valorSeleccionado={definicion_CTX_BIEN_GR.unidad}
                registros={lasUnidades.value}
                registroID={'_id'}
                registroTEXT={'unidad'}
                seleccione={'-- Seleccione unidad --'}
                // onChange={$(() => {
                //   // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                //   const elSelec = document.getElementById('se_unidad_REGISTRO_BIEN_GR') as HTMLSelectElement;
                //   const elIdx = elSelec.selectedIndex;
                //   // console.log('?', elIdx, elSelec[elIdx].id);
                //   definicion_CTX_ADD_REGISTRO_BIEN_GR.idUnidadBienGR = elSelec[elIdx].id;
                //   if (definicion_CTX_MERCADERIA_IN.idLineaTipo === '') {
                //     definicion_CTX_ADD_REGISTRO_BIEN_GR.unidad = '';
                //   } else {
                //     definicion_CTX_ADD_REGISTRO_BIEN_GR.unidad = elSelec.value;
                //   }
                // })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('in_descripcion_REGISTRO_BIEN_GR') as HTMLSelectElement)?.focus();
                  }
                })}
              />
              <input
                type="image"
                src={images.add}
                title="Adicionar unidad"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR.mostrarPanelBuscarSoloUnidadSUNAT = true;
                }}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_REGISTRO_BIEN_GR.mostrarPanelBuscarSoloUnidadSUNAT && (
            <div class="modal">
              <BuscarSoloUnidadSUNAT />
            </div>
          )}
          {/* Descripcion  */}
          <div class="linea-formulario12">
            <div>
              <label>Descripción</label>
            </div>
            <div style={{ display: 'flex' }}>
              <textarea
                id="in_descripcion_REGISTRO_BIEN_GR"
                name="Descripción del bien"
                rows={2}
                cols={31}
                value={definicion_CTX_BIEN_GR.descripcion}
                onChange$={(e) => {
                  definicion_CTX_BIEN_GR.descripcion = (e.target as HTMLTextAreaElement).value;
                }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     (document.getElementById('btn_registrar_REGISTRO_BIEN_GR') as HTMLInputElement)?.focus();
                //   }
                // }}
              ></textarea>
              {/* <input
                type="image"
                src={images.searchPLUS}
                title="Buscar manufactura standarizada"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ margin: '0 4px' }}
                // onClick$={() => {
                //   ctx_new_edit_orden_produccion.mostrarPanelBuscarManufacturaStandarizada = true;
                // }}
              /> */}
            </div>
          </div>
          {/* {ctx_new_edit_orden_produccion.mostrarPanelBuscarManufacturaStandarizada && (
            <div class="modal">
              <BuscarManufacturaStandarizada />
            </div>
          )} */}

          <br />
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input id="btn_registrar_REGISTRO_BIEN_GR" type="button" value="Registrar" class="btn-centro" onClick$={() => registrarBien()} />
      </div>
    </div>
  );
});
