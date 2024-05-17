import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_MERCADERIA_IN, CTX_NEW_EDIT_MERCADERIA_IN } from './newEditMercaderiaIN';
import ElSelect from '~/components/system/elSelect';
// import NewEditUnidadEquivalenciaIN from './newEditUnidadEquivalenciaIN';
import type { IMercaEquivalenciaIN } from '~/interfaces/iMercaderia';
// import { getLineasTipos } from '~/apis/lineaTipo.api';
import { elIdAuxiliar } from '~/functions/comunes';
// import BuscarUnidadSUNAT from './buscarUnidadSUNAT';
import BuscarUnidadEquivalenciaSUNAT from './buscarUnidadEquivalenciaSUNAT';

export const CTX_NEW_EDIT_EQUIVALENCIA_IN = createContextId<any>('new_edit_equivalencia_IN');

export default component$(
  (props: { unidadIN: string; idLineaTipo: string; lineaTipo: string; equivaSelecci: any; insertar: boolean }) => {
    //#region DEFINICION CTX_NEW_EDIT_EQUIVALENCIA_IN
    const definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN = useStore({
      grabo_uniEq: false,
      laLineaTipo: [], //aux
      mostrarPanelNewEditUnidadEquivalenciaIN: false,
      // mostrarPanelBuscarMercaderiaIN: false,
    });
    useContextProvider(CTX_NEW_EDIT_EQUIVALENCIA_IN, definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN);
    //#endregion DEFINICION CTX_NEW_EDIT_EQUIVALENCIA_IN

    //#region DEFINICION EQUIVALENCIA  -  NEW  /  EDIT
    const equivalenciaIN = useStore<IMercaEquivalenciaIN>({
      _id: props.equivaSelecci._id ? props.equivaSelecci._id : '',
      idAuxiliar: props.equivaSelecci.idAuxiliar ? props.equivaSelecci.idAuxiliar : '',
      descripcionEquivalencia: props.equivaSelecci.descripcionEquivalencia ? props.equivaSelecci.descripcionEquivalencia : '',
      laEquivalencia: props.equivaSelecci.laEquivalencia ? props.equivaSelecci.laEquivalencia : '',
      idUnidadEquivalencia: props.equivaSelecci.idUnidadEquivalencia ? props.equivaSelecci.idUnidadEquivalencia : '',
      unidadEquivalencia: props.equivaSelecci.unidadEquivalencia ? props.equivaSelecci.unidadEquivalencia : '',
      pesoKg: props.equivaSelecci.pesoKg ? props.equivaSelecci.pesoKg : '',
      factor: props.equivaSelecci.factor ? props.equivaSelecci.factor : 1,
      tipoEquivalencia: props.equivaSelecci.idAuxiliar ? props.equivaSelecci.tipoEquivalencia : true,
    });
    //#endregion DEFINICION EQUIVALENCIA  -  NEW  /  EDIT

    //#region CONTEXTOS
    let ctxDocumento: any = [];
    ctxDocumento = useContext(CTX_MERCADERIA_IN).equivalencias;

    const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
    //#endregion CONTEXTOS

    //#region INICIALIZAR
    // const directoIndirecto = useSignal(true); //directo=true  indirecto=false
    const lasUnidadesEquivalentes = useSignal<any>(ctx_new_edit_mercaderia_in.lasUE);
    const uniEq = useStore({
      idUniEq: '',
      uniEq: '',
    });
    //#endregion INICIALIZAR

    //#region REGISTRAR EQUIVALENCIA
    const registrarEquivalencia = $(() => {
      if (equivalenciaIN.descripcionEquivalencia === '') {
        alert('Ingrese la descripción de la equivalencia.');
        document.getElementById('in_descripcionEquivalenciaIN_MICE')?.focus();
        return;
      }
      if (equivalenciaIN.idUnidadEquivalencia === '') {
        alert('Ingrese la unidad para la equivalencia.');
        document.getElementById('se_unidadEquivalenciaIN_MICE')?.focus();
        return;
      }
      if (equivalenciaIN.factor === 0 || equivalenciaIN.factor.toString() === '') {
        alert('Ingrese un factor adecuado. El factor no puede ser cero (0)');
        document.getElementById('in_factorIN_MICE')?.focus();
        return;
      }
      equivalenciaIN.laEquivalencia = equivalenciaIN.tipoEquivalencia ? equivalenciaIN.factor : 1 / equivalenciaIN.factor;
      if (props.insertar) {
        console.log('insertado');

        ctxDocumento.push({
          // _id: props.equivaSelecci._id ? props.equivaSelecci._id : '',
          idAuxiliar: parseInt(elIdAuxiliar()),
          descripcionEquivalencia: equivalenciaIN.descripcionEquivalencia,
          //
          idUnidadEquivalencia: equivalenciaIN.idUnidadEquivalencia,
          unidadEquivalencia: equivalenciaIN.unidadEquivalencia,
          // pesoKg: props.equivaSelecci._id ? props.equivaSelecci._id : '',
          tipoEquivalencia: equivalenciaIN.tipoEquivalencia,
          factor: equivalenciaIN.factor,
          laEquivalencia: equivalenciaIN.laEquivalencia,
        });
        console.log('equivalenciaIN enviado por INSERCION', equivalenciaIN);
      } else {
        console.log('editado - documento', ctxDocumento);
        console.log('editado', ctxDocumento[0].idAuxiliar, equivalenciaIN.idAuxiliar);
        // documento.find(( idAuxiliar:any ) => idAuxiliar === equivalenciaIN.idAuxiliar);
        const aMod: any = ctxDocumento.find((docs: any) => docs.idAuxiliar === equivalenciaIN.idAuxiliar);
        console.log('aMod', aMod);

        (aMod.descripcionEquivalencia = equivalenciaIN.descripcionEquivalencia),
          // : props.equivaSelecci._id ? props.equivaSelecci._id : '',
          (aMod.idUnidadEquivalencia = equivalenciaIN.idUnidadEquivalencia),
          (aMod.unidadEquivalencia = equivalenciaIN.unidadEquivalencia),
          // pesoKg: props.equivaSelecci._id ? props.equivaSelecci._id : '',
          (aMod.tipoEquivalencia = equivalenciaIN.tipoEquivalencia),
          (aMod.factor = equivalenciaIN.factor),
          (aMod.laEquivalencia = equivalenciaIN.laEquivalencia);
        console.log('equivalenciaIN enviado por EDICION', equivalenciaIN);
      }

      ctx_new_edit_mercaderia_in.mostrarPanelNewEditEquivalenciaIN = false;
    });
    //#endregion REGISTRAR EQUIVALENCIA

    //#region ACTUALIZAR UNIDADES EQUIVALENTES
    useTask$(async ({ track }) => {
      track(() => definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.grabo_uniEq);

      if (definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.grabo_uniEq) {
        // lasUnidadesEquivalentes.value=definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.laLineaTipo[0].unidadesEquivalencias;
        const uno: any = definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.laLineaTipo;
        console.log('uno', uno);
        const dos: any = uno.unidadesEquivalencias;
        //ORDENANDO UNIDADES EQUIVALENCIAS
        const unisEquiOrde: any = dos.sort((a: any, b: any) => {
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
        lasUnidadesEquivalentes.value = unisEquiOrde;

        definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.grabo_uniEq = false;
      }
    });
    //#endregion ACTUALIZAR UNIDADES EQUIVALENTES

    //#region ACTUALIZAR UNIDADES EQUIVALENTES SUNAT
    useTask$(({ track }) => {
      track(() => ctx_new_edit_mercaderia_in.actualizarLasUE);

      if (ctx_new_edit_mercaderia_in.actualizarLasUE) {
        lasUnidadesEquivalentes.value = ctx_new_edit_mercaderia_in.lasUE;
        ctx_new_edit_mercaderia_in.actualizarLasUE = false;
      }
    });
    //#endregion ACTUALIZAR UNIDADES EQUIVALENTES SUNAT

    useTask$(({ track }) => {
      track(() => definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.laLineaTipo);

      ctx_new_edit_mercaderia_in.grabo_lineaTipo = true;
    });

    return (
      <div
        style={{
          width: 'clamp(330px, 86%, 560px)',
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
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              ctx_new_edit_mercaderia_in.mostrarPanelNewEditEquivalenciaIN = false;
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el formulario"
            onClick={$(() => {
              console.log('props.equivaSelecci', props.equivaSelecci);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el formulario"
            onClick={$(() => {
              console.log('equivalenciaIN', equivalenciaIN);
            })}
          />
        </div>
        {/* TITULO */}
        <h3>Registro de equivalencia</h3>
        {/* FORMULARIO */}

        <div class="add-form">
          {/* ENCABEZADO */}
          <div>
            {/* Descripción de equivalencia */}
            <div class="form-control" style={{ margin: '5px 0' }}>
              <label>Descripción de equivalencia</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_descripcionEquivalenciaIN_MICE"
                  style={{ width: '100%' }}
                  autoFocus
                  type="text"
                  placeholder="Descripción de equivalencia"
                  value={equivalenciaIN.descripcionEquivalencia}
                  onChange$={(e) => {
                    equivalenciaIN.descripcionEquivalencia = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('se_tipoEquivalenciaIN_MICE')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* Tipo equivalencia   */}
            <div style={{ margin: '5px 0' }}>
              <label>Tipo equivalencia</label>
              <div>
                <select
                  id="se_tipoEquivalenciaIN_MICE"
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    if ((e.target as HTMLSelectElement).value === 'Directa') {
                      equivalenciaIN.tipoEquivalencia = true;
                    } else {
                      equivalenciaIN.tipoEquivalencia = false;
                    }
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('se_unidadEquivalenciaIN_MICE')?.focus();
                    }
                  }}
                >
                  <option value={'Directa'} selected={equivalenciaIN.tipoEquivalencia ? true : false}>
                    Directa
                  </option>
                  <option value={'Indirecta'} selected={equivalenciaIN.tipoEquivalencia ? false : true}>
                    Indirecta
                  </option>
                </select>
              </div>
            </div>
            {/* Unidad equivalencia */}
            <div class="form-control" style={{ margin: '5px 0' }}>
              <label>Unidad equivalencia</label>
              <div class="form-control form-agrupado">
                <ElSelect
                  // estilos={{ width: '100%' }}
                  id={'se_unidadEquivalenciaIN_MICE'}
                  valorSeleccionado={props.equivaSelecci.unidadEquivalencia}
                  registros={lasUnidadesEquivalentes.value}
                  registroID={'_id'}
                  registroTEXT={'unidadEquivalencia'}
                  seleccione={'-- Seleccione unidad equivalencia --'}
                  onChange={$(() => {
                    // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                    const elSelec = document.getElementById('se_unidadEquivalenciaIN_MICE') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    equivalenciaIN.idUnidadEquivalencia = elSelec[elIdx].id;
                    if (equivalenciaIN.idUnidadEquivalencia === '') {
                      equivalenciaIN.unidadEquivalencia = '';
                    } else {
                      equivalenciaIN.unidadEquivalencia = elSelec.value;
                      //obtenerModelosVehiculares();
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_factorIN_MICE') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
                <input
                  type="image"
                  src={images.searchPLUS}
                  alt="icono buscar"
                  height={16}
                  width={16}
                  title="Buscar unidad equivalente de SUNAT"
                  style={{ marginLeft: '2px' }}
                  onClick$={() => {
                    uniEq.idUniEq = '';
                    uniEq.uniEq = '';

                    ctx_new_edit_mercaderia_in.mostrarPanelBuscarUnidadEquivalenciaSUNAT = true;
                  }}
                />
                {/* <input
                type="image"
                src={images.add}
                alt="Icono de adicionar marca vehícular"
                height={16}
                width={16}
                title="Adicionar la marca vehícular"
                onClick$={() => {
                  uniEq.idUniEq = '';
                  uniEq.uniEq = '';
                  //   marca._id = '';
                  //   marca.vehiculoMarca = '';
                  definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.mostrarPanelNewEditUnidadEquivalenciaIN = true;
                }}
              />
              <input
                type="image"
                alt="Icono de edición marca vehícular"
                height={16}
                width={16}
                title="Editar marca vehícular"
                onClick$={() => {
                  const elSelec = document.getElementById('se_unidadEquivalenciaIN_MICE') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Selecione la unidad de equivalencia');
                    elSelec.focus();
                    return;
                  }
                  uniEq.idUniEq = elSelec[elIdx].id;
                  uniEq.uniEq = elSelec.value;
                  definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.mostrarPanelNewEditUnidadEquivalenciaIN = true;
                }} //unidadIN={mercaderiaIN.unidad} equivaSelecci={[]}
              /> */}
              </div>
              {ctx_new_edit_mercaderia_in.mostrarPanelBuscarUnidadEquivalenciaSUNAT && (
                <div class="modal">
                  <BuscarUnidadEquivalenciaSUNAT idLineaTipo={props.idLineaTipo} lineaTipo={props.lineaTipo} />
                </div>
              )}
              {/* {definicion_CTX_NEW_EDIT_EQUIVALENCIA_IN.mostrarPanelNewEditUnidadEquivalenciaIN && (
              <div class="modal">
                <NewEditUnidadEquivalenciaIN
                  idLineaTipo={props.idLineaTipo}
                  idUnidadEquivalencia={uniEq.idUniEq}
                  unidadEquivalencia={uniEq.uniEq}
                />
              </div>
            )} */}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '5px 0' }}>
              <img src={images.equal} style={{ width: '12px', height: '12px' }}></img>
            </div>

            {/* Factor */}
            <div style={{ margin: '5px 0' }}>
              <label>Descripción</label>
              <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                {equivalenciaIN.tipoEquivalencia ? '' : '1/'}
                <input
                  id="in_factorIN_MICE"
                  style={{ marginRight: '4px' }}
                  type="number"
                  placeholder="Factor de equivalencia"
                  value={equivalenciaIN.factor}
                  onChange$={(e) => {
                    equivalenciaIN.factor = parseFloat((e.target as HTMLInputElement).value.trim());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('bu_Grabar_Equivalencia_IN_MI_P')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                {props.unidadIN}
              </div>
            </div>
          </div>

          {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
          <input
            id="bu_Grabar_Equivalencia_IN_MI_P"
            // type="submit"
            type="button"
            value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
            class="btn-centro"
            onClick$={() => {
              registrarEquivalencia();
            }}
          />
        </div>
        {/* </Form> */}
      </div>
    );
  }
);
