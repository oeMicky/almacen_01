import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_NEW_EDIT_VEHICULO } from './newEditVehiculo';
import type { IModeloVehicular } from '~/interfaces/iVehiculo';
import { inUpVehiculoMarcaModelo } from '~/apis/vehiculo.api';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { modeloVehicularSelecci: any }) => {
  //#region DEFINICION MODELO VEHICULAR - NEW  /EDIT
  const modeloVehicular = useStore<IModeloVehicular>({
    idVehiculoMarca: props.modeloVehicularSelecci.idVehiculoMarca ? props.modeloVehicularSelecci.idVehiculoMarca : '',
    vehiculoMarca: props.modeloVehicularSelecci.vehiculoMarca ? props.modeloVehicularSelecci.vehiculoMarca : '',
    idVehiculoModelo: props.modeloVehicularSelecci.idVehiculoModelo ? props.modeloVehicularSelecci.idVehiculoModelo : '',
    vehiculoModelo: props.modeloVehicularSelecci.vehiculoModelo ? props.modeloVehicularSelecci.vehiculoModelo : '',
  });
  //#endregion DEFINICION MODELO VEHICULAR - NEW  /EDIT

  //#region CONTEXTOS
  const ctx_new_edit_vehiculo = useContext(CTX_NEW_EDIT_VEHICULO);
  //#endregion CONTEXTOS

  //#region SUBMIT
  const grabarModeloVehicular = $(async () => {
    if (modeloVehicular.vehiculoModelo === '') {
      alert('Ingrese la modelo.');
      document.getElementById('inputModelo_MICE')?.focus();
      return;
    }
    await inUpVehiculoMarcaModelo({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idVehiculoMarca: modeloVehicular.idVehiculoMarca,
      vehiculoMarca: modeloVehicular.vehiculoMarca,
      idVehiculoModelo: modeloVehicular.idVehiculoModelo,
      vehiculoModelo: modeloVehicular.vehiculoModelo,
    });
    //console.log('graboooooo modeloVehi', modeloVehi);
    // modeloVehi = modeloVehi.data;
    //console.log('graboooooo modeloVehi.data', modeloVehi);

    ctx_new_edit_vehiculo.grabo_modelo = true;
    ctx_new_edit_vehiculo.mostrarPanelNewEditModeloVehicular = false;
  });

  //#endregion SUBMIT

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 700px)',
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
            ctx_new_edit_vehiculo.mostrarPanelNewEditModeloVehicular = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('modeloVehicularSelecci', props.modeloVehicularSelecci);
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de modelo vehícular</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* Marca */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="inputMarca_MICE"
              style={{ width: '100%' }}
              type="text"
              disabled
              //   placeholder="Add marca vehícular"
              value={modeloVehicular.vehiculoMarca}
              //   onChange={(e) => set]Modelo(e.target.value)}
            />
          </div>
        </div>
        {/* Modelo */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="inputModelo_MICE"
              autoFocus
              style={{ width: '100%' }}
              type="text"
              placeholder="Add modelo vehícular"
              value={modeloVehicular.vehiculoModelo}
              onChange$={(e) => {
                modeloVehicular.vehiculoModelo = (e.target as HTMLInputElement).value.toUpperCase();
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('buttonGrabarModeloVehicular') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
        </div>
        <br />
        <input
          id="buttonGrabarModeloVehicular"
          type="button"
          value="Registrar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          style={{ height: '40px' }}
          onClick$={() => {
            grabarModeloVehicular();
          }}
        />
      </div>
    </div>
  );
});
