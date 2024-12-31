import { $, component$, createContextId, useContext, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda } from '~/functions/comunes';
import { CTX_BUSCAR_CUENTA_CONTABLE } from './buscarCuentaContable';
import BuscarCuentaDestino from './buscarCuentaDestino';
import BorrarCuentaDestino from './borrarCuentaDestino';
import { inUpCuentaContable } from '~/apis/cuentaContable.api';
import { parametrosGlobales } from '~/routes/login';

export const CTX_NEW_EDIT_CUENTA_CONTABLE = createContextId<any>('__new_edit_cuenta_contable');
export const CTX_CUENTA_CONTABLE = createContextId<any>('__cuenta_contable');

export default component$((props: { CCSelecionada: any; ejercicio: number; idPlanContable: string; tipoDefault?: boolean }) => {
  //#region NEW_EDIT CUENTA CONTABLE
  const definicion_CTX_NEW_EDIT_CUENTA_CONTABLE = useStore({
    mostrarPanelAddCuentaDestino: false,
    mostrarPanelBuscarCuentaDestino: false,

    mostrarPanelBorrarCuentaDestino: false,
    borrar_idAuxiliarCuentaDestino: 0,
  });
  useContextProvider(CTX_NEW_EDIT_CUENTA_CONTABLE, definicion_CTX_NEW_EDIT_CUENTA_CONTABLE);
  //#endregion NEW_EDIT CUENTA CONTABLE

  //#region CUENTA CONTABLE
  const definicion_CTX_CUENTA_CONTABLE = useStore(
    {
      _id: props.CCSelecionada._id ? props.CCSelecionada._id : '',
      codigo: props.CCSelecionada.codigo ? props.CCSelecionada.codigo : '',
      descripcion: props.CCSelecionada.descripcion ? props.CCSelecionada.descripcion : '',
      asientoDestino: props.CCSelecionada.asientoDestino ? props.CCSelecionada.asientoDestino : [],
    },
    {
      deep: true,
    }
  );
  useContextProvider(CTX_CUENTA_CONTABLE, definicion_CTX_CUENTA_CONTABLE);
  //#endregion CUENTA CONTABLE

  //#region CONTEXTO
  const ctx = useContext(CTX_BUSCAR_CUENTA_CONTABLE);
  //#endregion CONTEXTO

  //#region INICIALIZAR
  const borrarCuentaDestino = useStore({
    idAuxiliar: '',
    codigo: '',
    descripcion: '',
  });
  //#endregion INICIALIZAR

  //#region ELIMINAR CUENTA DESTINO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.borrar_idAuxiliarCuentaDestino);
    // //console.log(
    //   'definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable ',
    //   definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable
    // );
    if (definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.borrar_idAuxiliarCuentaDestino > 0) {
      const newItems: any = definicion_CTX_CUENTA_CONTABLE.asientoDestino.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.borrar_idAuxiliarCuentaDestino
      );
      definicion_CTX_CUENTA_CONTABLE.asientoDestino = newItems;
      definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.borrar_idAuxiliarCuentaDestino = 0;
    }
  });
  //#endregion ELIMINAR CUENTA DESTINO

  //#region REGISTRAR CUENTA CONTABLE
  const registrarCuentaContable = $(async () => {
    if (definicion_CTX_CUENTA_CONTABLE.codigo.trim() === '') {
      alert('Ingrese el código.');
      document.getElementById('in_codigo_CUENTA_CONTABLE')?.focus();
      return;
    }
    if (definicion_CTX_CUENTA_CONTABLE.descripcion.trim() === '') {
      alert('Ingrese el descripción.');
      document.getElementById('in_descripcion_CUENTA_CONTABLE')?.focus();
      return;
    }
    if (definicion_CTX_CUENTA_CONTABLE.asientoDestino.length > 0) {
      //verificar que la suma de los DEBES Y HABERES SEAN IGUALES
      let suma_DEBE = 0;
      let suma_HABER = 0;
      for (let index = 0; index < definicion_CTX_CUENTA_CONTABLE.asientoDestino.length; index++) {
        const element = definicion_CTX_CUENTA_CONTABLE.asientoDestino[index];
        //console.log("element", element);
        if (element.tipo) {
          suma_DEBE = suma_DEBE + element.porcentaje;
        } else {
          suma_HABER = suma_HABER + element.porcentaje;
        }
      }
      if (suma_DEBE !== suma_HABER) {
        alert(`La suma de los porcentajes DEBE Y HABER deben ser iguales.`); //${suma_DEBE} - ${suma_HABER}
        return;
      }
      //verificar que la suma sean 100 %
      if (suma_DEBE !== 100) {
        alert(`Los porcentajes deben sumar 100%.`); //  ${suma_DEBE} - ${suma_HABER}
        return;
      }
    }

    //console.log("paso a registro de CC");
    // const cuentaConta =
    await inUpCuentaContable({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idPlanContable: props.idPlanContable,
      idCuentaContable: definicion_CTX_CUENTA_CONTABLE._id,
      codigo: definicion_CTX_CUENTA_CONTABLE.codigo,
      descripcion: definicion_CTX_CUENTA_CONTABLE.descripcion,
      asientoDestino: definicion_CTX_CUENTA_CONTABLE.asientoDestino,

      usuarioCrea: parametrosGlobales.usuario,
    });

    ctx.grabo_CuentaContable = true;
    ctx.mostrarPanelNewEditCuentaContable = false;
  });
  //#endregion REGISTRAR CUENTA CONTABLE

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 600px)',
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
            ctx.mostrarPanelNewEditCuentaContable = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          title="Ver el formulario"
          height={18}
          width={18}
          onClick={$(() => {
            //console.log("definicion_CTX_CUENTA_CONTABLE", definicion_CTX_CUENTA_CONTABLE);
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Registro de cuenta contable</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Codigo */}
          <div>
            <div>
              <input
                id="in_codigo_CUENTA_CONTABLE"
                style={{ width: '100%' }}
                type="number"
                placeholder="Código"
                value={definicion_CTX_CUENTA_CONTABLE.codigo}
                onChange$={(e) => {
                  definicion_CTX_CUENTA_CONTABLE.codigo = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
          </div>
          {/* descripcion*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_descripcion_CUENTA_CONTABLE"
                style={{ width: '100%' }}
                type="text"
                placeholder="Descripción"
                value={definicion_CTX_CUENTA_CONTABLE.descripcion}
                onChange$={(e) => {
                  definicion_CTX_CUENTA_CONTABLE.descripcion = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
          </div>
          {/* /********************ASIENTO DESTINO***************** */}
          {/* AddCuentaDestino */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <button
                id="btn_AddCuentaDestino_CUENTA_CONTABLE"
                onClick$={() => {
                  definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.mostrarPanelBuscarCuentaDestino = true;
                }}
              >
                Add cuenta destino
              </button>
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.mostrarPanelBuscarCuentaDestino && (
            <div class="modal">
              <BuscarCuentaDestino ejercicio={props.ejercicio} idPlanContable={props.idPlanContable} tipoDefault={true} />
            </div>
          )}
          {definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.mostrarPanelBorrarCuentaDestino && (
            <div class="modal">
              <BorrarCuentaDestino borrarCuentaDestino={borrarCuentaDestino} />
            </div>
          )}
          <div class="form-control">
            {definicion_CTX_CUENTA_CONTABLE.asientoDestino.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter', margin: '5px 0' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Porcentaje</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_CUENTA_CONTABLE.asientoDestino.map((cuentaDesti: any, index: number) => {
                    const indexItem = index + 1;
                    // const importesss = cuenta.importe.$numberDecimal
                    //   ? parseFloat(cuenta.importe.$numberDecimal)
                    //   : parseFloat(cuenta.importe);

                    // if (cuenta.tipo) {
                    //   //console.log('first sumaTOTAL_DEBER', sumaTOTAL_DEBER, importesss);
                    //   sumaTOTAL_DEBER = sumaTOTAL_DEBER + importesss;
                    // }
                    // if (!cuenta.tipo) {
                    //   //console.log('first sumaTOTAL_HABER', sumaTOTAL_HABER, importesss);
                    //   sumaTOTAL_HABER = sumaTOTAL_HABER + importesss;
                    // }
                    // // sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);
                    // if (index + 1 === definicion_CTX_COMPRA.asientoContable.length) {
                    //   //console.log('antes de fijar', sumaTOTAL_DEBER, sumaTOTAL_HABER);
                    //   fijarMontos({
                    //     sumaTOTAL_DEBER,
                    //     sumaTOTAL_HABER,
                    //   });
                    // }
                    return (
                      <tr key={cuentaDesti.idAuxiliar}>
                        <td data-label="Ítem" key={cuentaDesti.idAuxiliar} class="comoNumero">{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                        <td data-label="Código" class="comoNumero">
                          {cuentaDesti.codigo}
                        </td>
                        <td data-label="Descripción" class="comoCadena">
                          {cuentaDesti.descripcion}
                        </td>
                        <td data-label="Tipo" class="acciones">
                          <input
                            id="btn_TipoCuentaContable"
                            type="button"
                            style={{ fontSize: '1em' }}
                            value={cuentaDesti.tipo === true ? 'DEBE' : 'HABER'}
                            // onClick$={() => (cuenta.tipo = !cuenta.tipo)}
                            onClick$={(e) => {
                              cuentaDesti.tipo = !cuentaDesti.tipo;
                              (e.target as HTMLInputElement).value = cuentaDesti.tipo ? 'DEBE' : 'HABER';
                            }}
                            // onChange$={(e) => (cuenta.tipo = !(e.target as HTMLInputElement).value)}
                          />
                        </td>
                        <td data-label="Porcentaje" class="acciones">
                          <input
                            type="number"
                            style={{ textAlign: 'end', width: '64px' }}
                            // width={40}
                            value={cuentaDesti.porcentaje.$numberDecimal ? cuentaDesti.porcentaje.$numberDecimal : cuentaDesti.porcentaje}
                            onChange$={(e) => {
                              cuentaDesti.porcentaje = parseFloat((e.target as HTMLInputElement).value);
                              // //console.log('IMPORTE CHANGE', cuenta.importe);
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label="Acciones" class="acciones">
                          <input
                            type="image"
                            src={images.arrowUp}
                            title="Mover arriba"
                            alt="icono de mover arriba"
                            height={14}
                            width={14}
                            onClick$={() => {
                              if (index > 0) {
                                //console.log("va para ARRIBA", index);
                                const car = definicion_CTX_CUENTA_CONTABLE.asientoDestino[index];
                                //console.log("va para ARRIBA car", car);
                                definicion_CTX_CUENTA_CONTABLE.asientoDestino.splice(index, 1);
                                definicion_CTX_CUENTA_CONTABLE.asientoDestino.splice(index - 1, 0, car);
                              }
                            }}
                          />
                          <input
                            type="image"
                            src={images.arrowDown}
                            title="Mover abajo"
                            alt="icono de mover abajo"
                            height={14}
                            width={14}
                            style={{ margin: '0 2px' }}
                            onClick$={() => {
                              if (index < definicion_CTX_CUENTA_CONTABLE.asientoDestino.length - 1) {
                                //console.log("va para ABAJOOOOO", index, definicion_CTX_CUENTA_CONTABLE.asientoDestino.length - 1);
                                const elemento = definicion_CTX_CUENTA_CONTABLE.asientoDestino.splice(index, 1)[0];
                                //console.log("va para ABAJOOOOO elemento", elemento);
                                definicion_CTX_CUENTA_CONTABLE.asientoDestino.splice(index + 1, index, elemento);
                              }
                            }}
                          />
                          <input
                            type="image"
                            src={images.trash}
                            title="Eliminar ítem"
                            alt="icono de eliminar"
                            height={14}
                            width={14}
                            onClick$={() => {
                              borrarCuentaDestino.idAuxiliar = cuentaDesti.idAuxiliar;
                              borrarCuentaDestino.codigo = cuentaDesti.codigo;
                              borrarCuentaDestino.descripcion = cuentaDesti.descripcion;

                              definicion_CTX_NEW_EDIT_CUENTA_CONTABLE.mostrarPanelBorrarCuentaDestino = true;
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <th colSpan={4} class="comoNumero">
                      Partida doble
                    </th>
                    <th colSpan={1}>{sumaTOTAL_DEBER - sumaTOTAL_HABER}</th>
                    <th></th>
                  </tr>
                </tfoot> */}
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen cuentas destino</i>
            )}
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_RegistrarCuentaContable_CUENTA_CONTABLE"
          type="button"
          value={'Registrar'}
          style={{ cursor: 'pointer', height: '40px' }}
          class="btn-centro"
          onClick$={() => registrarCuentaContable()}
        />
      </div>
    </div>
  );
});
