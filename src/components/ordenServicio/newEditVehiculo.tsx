import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { IVehiculo } from '~/interfaces/iVehiculo';
import ElSelect from '../system/elSelect';
import { getMarcasVehiculares, getModelosVehiculares, inUpVehiculo } from '~/apis/vehiculo.api';
import { parametrosGlobales } from '~/routes/login';
import { CTX_VEHICULO_SELECCIONADO } from './newEditOrdenServicio';

export default component$((props: { vehiculoSeleccio: any }) => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_vehiculo_seleccionado = useContext(CTX_VEHICULO_SELECCIONADO);

  //#endregion CONTEXTOS

  //#region DEFINICION VEHICULO - NEW / EDIT
  const vehiculo = useStore<IVehiculo>({
    _id: props.vehiculoSeleccio._id ? props.vehiculoSeleccio._id : '',
    idGrupoEmpresarial: props.vehiculoSeleccio.idGrupoEmpresarial ? props.vehiculoSeleccio.idGrupoEmpresarial : '',
    idEmpresa: props.vehiculoSeleccio.idEmpresa ? props.vehiculoSeleccio.idEmpresa : '',
    placa: props.vehiculoSeleccio.placa ? props.vehiculoSeleccio.placa : '',
    idVehiculoMarca: props.vehiculoSeleccio.idVehiculoMarca ? props.vehiculoSeleccio.idVehiculoMarca : '',
    vehiculoMarca: props.vehiculoSeleccio.vehiculoMarca ? props.vehiculoSeleccio.vehiculoMarca : '',
    idVehiculoModelo: props.vehiculoSeleccio.idVehiculoModelo ? props.vehiculoSeleccio.idVehiculoModelo : '',
    vehiculoModelo: props.vehiculoSeleccio.vehiculoModelo ? props.vehiculoSeleccio.vehiculoModelo : '',
    vin: props.vehiculoSeleccio.vin ? props.vehiculoSeleccio.vin : '',
  });
  //#endregion DEFINICION VEHICULO - NEW / EDIT

  //#region INICIALIZAR
  const ini = useSignal(0);
  // const caracterValido = useSignal('');
  // const valido = useSignal(false);
  const lasMarcas = useSignal([]);
  const losModelos = useSignal([]);

  //***** obtener MARCAS Y MODELOS VEHICULARES
  const obtenerMarcasVehiculares = $(async () => {
    const mars = await getMarcasVehiculares({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    console.log('mars', mars.data);
    lasMarcas.value = mars.data;
  });
  //*************

  useTask$(({ track }) => {
    track(() => ini.value);
    obtenerMarcasVehiculares();
  });
  //#endregion INICIALIZAR

  //#region PLACA
  //   const validar_inputVehiculoPlaca = $((e: any): boolean => {
  // const validar_inputVehiculoPlaca = $((e: any) => {
  //   console.log('validando', e);
  //   const tecla = e.key ? e.key : e.which;
  //   // if (tecla === '%') {
  //   //   console.log(tecla);
  //   //   return;
  //   // }

  //   // Patrón de entrada, en este caso solo acepta numeros y letras
  //   const patron = /[A-Za-z0-9]/; // /[A-Za-z0-9]/;
  //   console.log('first onKeyDown', tecla, patron.test(tecla));
  //   // placaValida.value = patron.test(tecla);
  //   // return patron.test(tecla);
  //   if (patron.test(tecla)) {
  //     vehiculo.placa = tecla.toUpperCase();
  //     // (document.getElementById('inputVehiculoPlaca') as HTMLInputElement).value = tecla.toUpperCase();
  //   } else {
  //     // tecla=''
  //   }
  // });

  // useTask$(({ track }) => {
  //   track(() => caracterValido.value);
  //   if (caracterValido.value) {
  //     console.log('+++tecla', caracterValido.value); //, tecla);
  //     // tecla = '';
  //     // console.log('+tecla', tecla);
  //     // vehiculo.placa = (e.target as HTMLInputElement).value.toUpperCase().trim();
  //     vehiculo.placa = vehiculo.placa + caracterValido.value; // (document.getElementById('inputVehiculoPlaca') as HTMLInputElement).value.trim().toUpperCase();
  //     // vehiculo.placa = tre.val;
  //   } else {
  //     // tecla = '';
  //     console.log('-tecla', caracterValido.value); //, tecla);
  //   }
  // });
  //#endregion PLACA

  //#region MARCA

  //#endregion MARCA

  //#region MODELO
  const obtenerModelosVehiculares = $(async () => {
    const mods = await getModelosVehiculares({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idMarca: vehiculo.idVehiculoMarca,
    });
    console.log('mars', mods.data);
    losModelos.value = mods.data;
  });
  //#endregion MODELO

  //#region ON SUBMIT
  const onSubmit = $(async () => {
    if (vehiculo.placa === '') {
      alert('Ingrese la placa.');
      document.getElementById('inputVehiculoPlaca')?.focus();
      return;
    }
    if (vehiculo.idVehiculoMarca === '') {
      alert('Ingrese la marca.');
      document.getElementById('selectMarca')?.focus();
      return;
    }
    if (vehiculo.idVehiculoModelo === '') {
      alert('Ingrese el modelo.');
      document.getElementById('selectModelo')?.focus();
      return;
    }

    const vehi = await inUpVehiculo({
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

    console.log('vehi', vehi.data);

    ctx_vehiculo_seleccionado._id = vehi.data._id;
    ctx_vehiculo_seleccionado.placa = vehi.data.placa;
    ctx_vehiculo_seleccionado.idVehiculoMarca = vehi.data.idVehiculoMarca;
    ctx_vehiculo_seleccionado.vehiculoMarca = vehi.data.vehiculoMarca;
    ctx_vehiculo_seleccionado.idVehiculoModelo = vehi.data.idVehiculoModelo;
    ctx_vehiculo_seleccionado.vehiculoModelo = vehi.data.vehiculoModelo;
    ctx_vehiculo_seleccionado.vin = vehi.data.vin;

    ctx_docs_orden_servicio.selecciono_Vehiculo0 = true;

    // ctx_docs_orden_servicio.vehiculoGrabado = true;
    ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 = false;
    ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = false;
  });

  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: 'auto',
        padding: '1px',
        // border: '3px dashed yellow',
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
            ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de vehículo"
          height={16}
          width={16}
          title="Ver vehículo"
          onClick={$(() => {
            console.log('vehículo', vehiculo);
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
            <label>Placa</label>
            <div class="form-control form-agrupado">
              <input
                id="inputVehiculoPlaca"
                style={{ width: '100%', background: 'orange' }}
                type="text"
                // type="number"
                minLength={5}
                maxLength={10}
                placeholder="Add placa: AAA123, TRU789, XRW695"
                value={vehiculo.placa}
                // onKeyDown$={(e) => {
                //   // vehiculo.placa = (e.target as HTMLInputElement).value.trim().toUpperCase();
                //   // console.log('onKeyDown$', e.key, e.keyCode, e);
                //   // return false;
                //   // e.key.includes
                //   // if (patron.test(e.key)) {   //   console.log('onKeyDown$', e.key, e.keyCode, e);
                //   // } else {   //   console.log('onKeyDown$--stopPropagation', e.key, e.keyCode, e);
                //   // }
                // }}
                onChange$={(e) => {
                  vehiculo.placa = (e.target as HTMLInputElement).value.toUpperCase();
                }}

                // onKeyPress$={(e) => {
                //   console.log('onKeyPress$', e.key, e.keyCode, e);
                //   const patron = /[A-Za-z0-9]/;
                //   if (patron.test(e.key)) {
                //     //A-a-0
                //     if (
                //       (e.keyCode >= 97 && e.keyCode <= 122) ||
                //       (e.keyCode >= 65 && e.keyCode <= 90) ||
                //       (e.keyCode >= 48 && e.keyCode <= 57)
                //     ) {
                //       console.log('VERDADEROOOOOO', e.key, e.keyCode, e);
                //       valido.value = true;
                //       // vehiculo.placa = (e.target as HTMLInputElement).value.trim().toUpperCase();
                //       // vehiculo.placa = vehiculo.placa + e.key.toUpperCase();
                //     } else {
                //       console.log('FALSOOOOOOOOOO confir', e.key, e.keyCode, e);
                //       valido.value = false;
                //       if (e.key === 'Escape') {
                //         console.log('Escape');
                //         document.getElementById('inputMarca')?.focus();

                //         return false;
                //       }
                //     }
                //   } else {
                //     console.log('FALSOOOOOOOOOO', e.key, e.keyCode, e);
                //     valido.value = false;
                //   }
                //   // if (!valido.value) {
                //   //   console.log('return$');
                //   //   e.target.removeEventListener;
                //   //   return false;
                //   // }
                // }}
                // onKeyUp$={(e) => {
                //   console.log('onKeyUp$', e.key, e.keyCode, e);
                //   e.key.replace('*', '');
                //   return false;
                // }}
                // onChange$={(e) => {
                //   console.log('onChange$', e);
                //   // e.cancelable;
                //   // e.stopPropagation();
                // }}
              />
            </div>
          </div>
          {/* marca */}
          <div class="form-control">
            <label>Marca</label>
            <div class="form-control form-agrupado">
              <ElSelect
                id={'selectMarca'}
                valorSeleccionado={vehiculo.vehiculoMarca}
                registros={lasMarcas.value}
                registroID={'_id'}
                registroTEXT={'vehiculoMarca'}
                seleccione={'--Seleccione marca--'}
                onChange={$(() => {
                  // losModelos.value=lasMarcas.value
                  const elSelec = document.getElementById('selectMarca') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  vehiculo.idVehiculoMarca = elSelec[elIdx].id;
                  if (vehiculo.idVehiculoMarca === '') {
                    vehiculo.vehiculoMarca = '';
                  } else {
                    vehiculo.vehiculoMarca = elSelec.value;
                    obtenerModelosVehiculares();
                  }

                  // console.log('marcassssss...........');
                  // console.log('marcassssss', lasMarcas.value, vehiculo.idVehiculoMarca, vehiculo.vehiculoMarca);
                  // losModelos.value=
                })}
                // onChange={changeMarcaVehicular}
              />
              <ImgButton
                src={images.three_dots2}
                alt="Icono de buscar marca vehícular"
                height={16}
                width={16}
                title="Buscar datos del marca vehícular"
                // onClick={buscarMarcaVehicular}
                // onClick={$(() => {
                //   console.log('vehiculo.vehiculoMarca', vehiculo.idVehiculoMarca, vehiculo.vehiculoMarca);
                // })}
              />
            </div>
          </div>
          {/* {showPanelRegistrarMarcaVehicular && (
            <Modal
              componente={
                <NewEditMarcaVehicular
                  ancho={'280px'}
                  parametrosGlobales={parametrosGlobales}
                  onCerrar={cerrarPanelRegistroMarcaVehicular}
                />
              }
            />
          )} */}
          {/* modelo */}
          <div class="form-control">
            <label>Modelo</label>
            <div class="form-control form-agrupado">
              <ElSelect
                id={'selectModelo'}
                valorSeleccionado={vehiculo.vehiculoModelo}
                registros={losModelos.value}
                registroID={'_id'}
                registroTEXT={'modelo'}
                seleccione={'--Seleccione modelo--'}
                // onChange={changeModeloVehicular}
                onChange={$(() => {
                  const elSelec = document.getElementById('selectModelo') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  vehiculo.idVehiculoModelo = elSelec[elIdx].id;
                  if (vehiculo.idVehiculoModelo === '') {
                    vehiculo.vehiculoModelo = '';
                  } else {
                    vehiculo.vehiculoModelo = elSelec.value;
                  }
                })}
              />
              {/* <ImgButton
                src={images.three_dots2}
                alt="Icono de buscar modelo vehícular"
                height={16}
                width={16}
                title="Buscar datos del modelo vehícular"
                // onClick={buscarModeloVehicular}
              /> */}
            </div>
          </div>
          {/* {showPanelRegistrarModeloVehicular && (
            <Modal
              componente={
                <NewEditModeloVehicular
                  ancho={'280px'}
                  parametrosGlobales={parametrosGlobales}
                  datosMarca={{ idVehiculoMarca, vehiculoMarca }}
                  onCerrar={cerrarPanelRegistroModeloVehicular}
                />
              }
            />
          )} */}
          {/* VIN */}
          <div class="form-control">
            <label>VIN</label>
            <div class="form-control form-agrupado">
              <input
                id="inputVIN"
                style={{ width: '100%' }}
                type="text"
                placeholder="VIN"
                value={vehiculo.vin}
                onChange$={(e) => {
                  vehiculo.vin = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                // onChange={(e) => setVin(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={onSubmit}
          // onClick={(e) => onSubmit(e)}
        />
      </div>
    </div>
  );
});
