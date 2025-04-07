import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import ElSelect from '~/components/system/elSelect';
import type { IMarcaVehicular, IModeloVehicular, IVehiculo } from '~/interfaces/iVehiculo';
import { CTX_BUSCAR_VEHICULO } from './buscarVehiculo';
// import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { getMarcasVehiculares, getModelosVehiculares, inUpVehiculo } from '~/apis/vehiculo.api';
import { parametrosGlobales } from '~/routes/login';
import NewEditMarcaVehicular from './newEditMarcaVehicular';
import NewEditModeloVehicular from './newEditModeloVehicular';

export const CTX_NEW_EDIT_VEHICULO = createContextId<any>('new_edit_vehiculo');

export default component$((props: { vehiculoSelecci: any; contexto: any }) => {
  //#region DEFINICION VEHICULO - NEW  /EDIT
  const vehiculo = useStore<IVehiculo>({
    _id: props.vehiculoSelecci._id ? props.vehiculoSelecci._id : '',
    idGrupoEmpresarial: props.vehiculoSelecci.idGrupoEmpresarial ? props.vehiculoSelecci.idGrupoEmpresarial : '',
    idEmpresa: props.vehiculoSelecci.idEmpresa ? props.vehiculoSelecci.idEmpresa : '',
    placa: props.vehiculoSelecci.placa ? props.vehiculoSelecci.placa : '',
    idVehiculoMarca: props.vehiculoSelecci.idVehiculoMarca ? props.vehiculoSelecci.idVehiculoMarca : '',
    vehiculoMarca: props.vehiculoSelecci.vehiculoMarca ? props.vehiculoSelecci.vehiculoMarca : '',
    idVehiculoModelo: props.vehiculoSelecci.idVehiculoModelo ? props.vehiculoSelecci.idVehiculoModelo : '',
    vehiculoModelo: props.vehiculoSelecci.vehiculoModelo ? props.vehiculoSelecci.vehiculoModelo : '',
    vin: props.vehiculoSelecci.vin ? props.vehiculoSelecci.vin : '',
  });
  //#endregion DEFINICION VEHICULO

  //#region DEFINICION CTX_NEW_EDIT_VEHICULO
  const definicion_CTX_NEW_EDIT_VEHICULO = useStore({
    grabo_marca: false,
    grabo_modelo: false,
    mostrarPanelNewEditMarcaVehicular: false,
    mostrarPanelNewEditModeloVehicular: false,
  });
  useContextProvider(CTX_NEW_EDIT_VEHICULO, definicion_CTX_NEW_EDIT_VEHICULO);
  //#endregion DEFINICION CTX_NEW_EDIT_VEHICULO

  //#region MODELO
  const marca = useStore<IMarcaVehicular>({
    _id: '',
    vehiculoMarca: '',
  });
  //#endregion MODELO

  //#region MODELO
  const modelo = useStore<IModeloVehicular>({
    idVehiculoMarca: '',
    vehiculoMarca: '',
    idVehiculoModelo: '',
    vehiculoModelo: '',
  });
  //#endregion MODELO

  //#region CONTEXTOS
  // let ctx: any = [];
  // switch (props.contexto) {
  //   case 'orden servicio':
  //     ctx = useContext(CTX_INDEX_ORDEN_SERVICIO);
  //     break;
  //   // case 'venta':
  //   //   ctx = useContext(CTX_DOCS_VENTA);
  //   //   break;
  //   // case 'cotizacion':
  //   //   ctx = useContext(CTX_DOCS_COTIZACION);
  //   //   break;
  // }
  const ctx_buscar_vehiculo = useContext(CTX_BUSCAR_VEHICULO);
  //#endregion CONTEXTOS

  //#region INICIALIZAR
  const ini = useSignal(0);
  // const caracterValido = useSignal('');
  // const valido = useSignal(false);
  const lasMarcas = useSignal([]);
  const losModelos = useSignal([]);

  //***** obtener MARCAS Y MODELOS VEHICULARES
  const obtenerMarcasVehiculares = $(async () => {
    //console.log('first first first 🥖🥖🥖🥖🥖🥖🥖🥖🥖🥖🥖🥖🥖', vehiculo.vehiculoMarca, vehiculo.vehiculoModelo);
    const mars = await getMarcasVehiculares({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    //console.log('mars.data', mars.data);
    lasMarcas.value = mars.data;

    if (ini.value === 0 && vehiculo._id !== '') {
      //console.log('********---ES EDICION---*******');
      const tre: any = lasMarcas.value.find(({ _id }) => _id === vehiculo.idVehiculoMarca);
      //console.log('tre', tre.modelos);
      losModelos.value = tre.modelos;
    }
    //*
    // losModelos.value = lasMarcas.value.find(({ _id }) => _id === vehiculo.idVehiculoMarca);
    // tomy.value = lasMarcas.value.find(({ _id }) => _id === vehiculo.idVehiculoMarca);
    // // // losModelos.value =
    // //console.log('first [}', vehiculo.idVehiculoMarca, lasMarcas.value, tomy.value);

    // //console.log('tomy', tomy.value);
    //*
    // definicion_CTX_NEW_EDIT_VEHICULO.grabo_modelo = true;
  });
  //*************

  useTask$(({ track }) => {
    track(() => ini.value);
    //console.log('obtenerMarcasVehiculares()', ini.value);
    obtenerMarcasVehiculares();
    //
    //console.log('first', vehiculo.idVehiculoModelo, vehiculo.vehiculoModelo);
    // (document.getElementById('se_modelo_VEHICULO') as HTMLSelectElement).value = 'MAZDA 3'; //vehiculo.vehiculoModelo;
  });
  //#endregion INICIALIZAR

  //#region REFRESCAR MARCA
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_NEW_EDIT_VEHICULO.grabo_marca;
    });
    if (definicion_CTX_NEW_EDIT_VEHICULO.grabo_marca) {
      obtenerMarcasVehiculares();
      definicion_CTX_NEW_EDIT_VEHICULO.grabo_marca = false;
    }
  });
  //#endregion REFRESCAR MARCA

  //#region MODELO
  const obtenerModelosVehiculares = $(async () => {
    const mods = await getModelosVehiculares({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idMarca: vehiculo.idVehiculoMarca,
    });
    //console.log('modelos', mods.data);
    losModelos.value = mods.data;
  });
  //#endregion MODELO

  //#region REFRESCAR MODELO
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_NEW_EDIT_VEHICULO.grabo_modelo;
    });
    if (definicion_CTX_NEW_EDIT_VEHICULO.grabo_modelo) {
      obtenerModelosVehiculares();
      definicion_CTX_NEW_EDIT_VEHICULO.grabo_modelo = false;
    }
  });
  //#endregion REFRESCAR MODELO

  //#region ON SUBMIT
  const grabarVehiculo = $(async () => {
    if (vehiculo.placa === '') {
      alert('Ingrese la placa.');
      document.getElementById('in_placa_VEHICULO')?.focus();
      return;
    }
    if (vehiculo.idVehiculoMarca === '') {
      alert('Ingrese la marca.');
      document.getElementById('se_marca_VEHICULO')?.focus();
      return;
    }
    if (vehiculo.idVehiculoModelo === '') {
      alert('Ingrese el modelo.');
      document.getElementById('se_modelo_VEHICULO')?.focus();
      return;
    }

    await inUpVehiculo({
      idVehiculo: vehiculo._id,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      placa: vehiculo.placa.toUpperCase(),
      idVehiculoMarca: vehiculo.idVehiculoMarca,
      vehiculoMarca: vehiculo.vehiculoMarca,
      idVehiculoModelo: vehiculo.idVehiculoModelo,
      vehiculoModelo: vehiculo.vehiculoModelo,
      vin: vehiculo.vin ? vehiculo.vin.toUpperCase() : null,
      usuario: parametrosGlobales.usuario,
    });

    //console.log('graboooooo marvaVehi', vehi);
    // vehi = vehi.data;
    //console.log('graboooooo marvaVehi.data', vehi);

    ctx_buscar_vehiculo.grabo_vehiculo = true;
    ctx_buscar_vehiculo.mostrarPanelNewEditVehiculo = false;
    // ctx_vehiculo_seleccionado._id = vehi.data._id;
    // ctx_vehiculo_seleccionado.placa = vehi.data.placa;
    // ctx_vehiculo_seleccionado.idVehiculoMarca = vehi.data.idVehiculoMarca;
    // ctx_vehiculo_seleccionado.vehiculoMarca = vehi.data.vehiculoMarca;
    // ctx_vehiculo_seleccionado.idVehiculoModelo = vehi.data.idVehiculoModelo;
    // ctx_vehiculo_seleccionado.vehiculoModelo = vehi.data.vehiculoModelo;
    // ctx_vehiculo_seleccionado.vin = vehi.data.vin;

    // ctx_docs_orden_servicio.selecciono_Vehiculo0 = true;

    // // ctx_docs_orden_servicio.vehiculoGrabado = true;
    // ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 = false;
    // ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = false;
  });

  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 700px)',
        // width: 'auto',
        padding: '1px',
        // border: '3px dashed yellow',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
          src={images.see}
          alt="Icono de vehículo"
          height={16}
          width={16}
          title="Ver vehículo"
          onClick={$(() => {
            //console.log('vehículo', vehiculo);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de vehículo"
          height={16}
          width={16}
          title="Ver vehículo"
          onClick={$(() => {
            //console.log('ini.value', ini.value);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_vehiculo.mostrarPanelNewEditVehiculo = false;
            // ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de vehículo</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Placa */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_placa_VEHICULO"
                style={{ width: '100%', background: 'orange' }}
                autoFocus
                type="text"
                // type="number"
                minLength={5}
                maxLength={10}
                placeholder="Add placa: AAA123, TRU789, XRW695"
                value={vehiculo.placa}
                // onKeyDown$={(e) => {
                //   // vehiculo.placa = (e.target as HTMLInputElement).value.trim().toUpperCase();
                //   // //console.log('onKeyDown$', e.key, e.keyCode, e);
                //   // return false;
                //   // e.key.includes
                //   // if (patron.test(e.key)) {   //   //console.log('onKeyDown$', e.key, e.keyCode, e);
                //   // } else {   //   //console.log('onKeyDown$--stopPropagation', e.key, e.keyCode, e);
                //   // }
                // }}
                onChange$={(e) => {
                  vehiculo.placa = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_marca_VEHICULO') as HTMLSelectElement)?.focus();
                  }
                }}
                // onKeyPress$={(e) => {
                //   //console.log('onKeyPress$', e.key, e.keyCode, e);
                //   const patron = /[A-Za-z0-9]/;
                //   if (patron.test(e.key)) {
                //     //A-a-0
                //     if (
                //       (e.keyCode >= 97 && e.keyCode <= 122) ||
                //       (e.keyCode >= 65 && e.keyCode <= 90) ||
                //       (e.keyCode >= 48 && e.keyCode <= 57)
                //     ) {
                //       //console.log('VERDADEROOOOOO', e.key, e.keyCode, e);
                //       valido.value = true;
                //       // vehiculo.placa = (e.target as HTMLInputElement).value.trim().toUpperCase();
                //       // vehiculo.placa = vehiculo.placa + e.key.toUpperCase();
                //     } else {
                //       //console.log('FALSOOOOOOOOOO confir', e.key, e.keyCode, e);
                //       valido.value = false;
                //       if (e.key === 'Escape') {
                //         //console.log('Escape');
                //         document.getElementById('inputMarca')?.focus();

                //         return false;
                //       }
                //     }
                //   } else {
                //     //console.log('FALSOOOOOOOOOO', e.key, e.keyCode, e);
                //     valido.value = false;
                //   }
                //   // if (!valido.value) {
                //   //   //console.log('return$');
                //   //   e.target.removeEventListener;
                //   //   return false;
                //   // }
                // }}
                // onKeyUp$={(e) => {
                //   //console.log('onKeyUp$', e.key, e.keyCode, e);
                //   e.key.replace('*', '');
                //   return false;
                // }}
                // onChange$={(e) => {
                //   //console.log('onChange$', e);
                //   // e.cancelable;
                //   // e.stopPropagation();
                // }}
              />
            </div>
          </div>
          {/* marca */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                id={'se_marca_VEHICULO'}
                valorSeleccionado={vehiculo.vehiculoMarca}
                registros={lasMarcas.value}
                registroID={'_id'}
                registroTEXT={'vehiculoMarca'}
                seleccione={'-- Seleccione marca --'}
                onChange={$(() => {
                  // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                  const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  vehiculo.idVehiculoMarca = elSelec[elIdx].id;
                  if (vehiculo.idVehiculoMarca === '') {
                    vehiculo.vehiculoMarca = '';
                  } else {
                    vehiculo.vehiculoMarca = elSelec.value;
                    obtenerModelosVehiculares();
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_modelo_VEHICULO') as HTMLSelectElement)?.focus();
                  }
                })}
              />
              <input
                type="image"
                src={images.add}
                alt="Icono de adicionar marca vehícular"
                height={16}
                width={16}
                title="Adicionar la marca vehícular"
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  marca._id = '';
                  marca.vehiculoMarca = '';
                  definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular = true;
                }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de edición marca vehícular"
                height={16}
                width={16}
                title="Editar marca vehícular"
                onClick$={() => {
                  const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  //console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  //console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Selecione la marca del vehículo');
                    elSelec.focus();
                    return;
                  }
                  marca._id = elSelec[elIdx].id;
                  marca.vehiculoMarca = elSelec.value;
                  definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular = true;
                }}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular && (
            <div class="modal">
              <NewEditMarcaVehicular marcaVehicularSelecci={marca} />
            </div>
          )}
          {/* modelo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                id={'se_modelo_VEHICULO'}
                valorSeleccionado={vehiculo.vehiculoModelo}
                registros={losModelos.value}
                registroID={'_id'}
                registroTEXT={'modelo'}
                seleccione={'-- Seleccione modelo --'}
                onChange={$(() => {
                  //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢👓👓');
                  const elSelec = document.getElementById('se_modelo_VEHICULO') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  vehiculo.idVehiculoModelo = elSelec[elIdx].id;
                  if (vehiculo.idVehiculoModelo === '') {
                    vehiculo.vehiculoModelo = '';
                  } else {
                    vehiculo.vehiculoModelo = elSelec.value;
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('in_VIN_VEHICULO') as HTMLInputElement)?.focus();
                  }
                })}
              />
              <input
                type="image"
                src={images.add}
                alt="Icono de adicionar modelo vehícular"
                height={16}
                width={16}
                title="Adicionar el modelo vehícular"
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  //console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  //console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Seleccione la marca del vehículo');
                    elSelec.focus();
                    return;
                  }
                  modelo.idVehiculoMarca = elSelec[elIdx].id;
                  modelo.vehiculoMarca = elSelec.value;

                  modelo.idVehiculoModelo = '';
                  modelo.vehiculoModelo = '';

                  definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular = true;
                }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de editar modelo vehícular"
                height={16}
                width={16}
                title="Editar modelo vehícular"
                onClick$={() => {
                  const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  //console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                  //console.log('elSelec.value', elSelec.value);
                  if (elSelec[elIdx].id === '') {
                    alert('Seleccione la marca del vehículo');
                    elSelec.focus();
                    return;
                  }
                  modelo.idVehiculoMarca = elSelec[elIdx].id;
                  modelo.vehiculoMarca = elSelec.value;

                  const elSelecMo = document.getElementById('se_modelo_VEHICULO') as HTMLSelectElement;
                  const elIdxMo = elSelecMo.selectedIndex;

                  if (elSelecMo[elIdxMo].id === '') {
                    alert('Seleccione el modelo del vehículo');
                    elSelecMo.focus();
                    return;
                  } else {
                    modelo.idVehiculoModelo = elSelecMo[elIdxMo].id;
                    modelo.vehiculoModelo = elSelecMo.value;
                  }

                  definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular = true;
                }}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular && (
            <div class="modal">
              <NewEditModeloVehicular modeloVehicularSelecci={modelo} />
            </div>
          )}
          {/* VIN */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_VIN_VEHICULO"
                style={{ width: '100%' }}
                type="text"
                placeholder="VIN"
                value={vehiculo.vin}
                onChange$={(e) => {
                  vehiculo.vin = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('btn_grabar_VEHICULO') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>

        <input
          id="btn_grabar_VEHICULO"
          type="button"
          value="Registrar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          style={{ height: '40px' }}
          onClick$={() => {
            grabarVehiculo();
          }}
        />
      </div>
    </div>
  );
});
