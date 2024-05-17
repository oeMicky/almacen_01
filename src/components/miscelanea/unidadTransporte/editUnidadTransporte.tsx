import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { CTX_BUSCAR_UNIDAD_TRANSPORTE } from './buscarUnidadTransporte';
import { elIdAuxiliar } from '~/functions/comunes';
import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import { inUpUnidadTransporte } from '~/apis/unidadTransporte.api';

export default component$((props: { uniTranspSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_BUSCAR_UNIDAD_TRANSPORTE);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const laUnidadTransp = useStore({
    idUnidadTransporte: props.uniTranspSeleccionado.idUnidadTransporte ? props.uniTranspSeleccionado.idUnidadTransporte : '',
    idVehiculo: props.uniTranspSeleccionado.idVehiculo ? props.uniTranspSeleccionado.idVehiculo : '',
    idAuxiliar: props.uniTranspSeleccionado.idAuxiliar ? props.uniTranspSeleccionado.idAuxiliar : elIdAuxiliar(),

    activo: typeof props.uniTranspSeleccionado.activo === 'undefined' ? true : props.uniTranspSeleccionado.activo,

    placa: props.uniTranspSeleccionado.placa ? props.uniTranspSeleccionado.placa : '',
    idVehiculoMarca: props.uniTranspSeleccionado.idVehiculoMarca ? props.uniTranspSeleccionado.idVehiculoMarca : '',
    vehiculoMarca: props.uniTranspSeleccionado.vehiculoMarca ? props.uniTranspSeleccionado.vehiculoMarca : '',
    idVehiculoModelo: props.uniTranspSeleccionado.idVehiculoModelo ? props.uniTranspSeleccionado.idVehiculoModelo : '',
    vehiculoModelo: props.uniTranspSeleccionado.vehiculoModelo ? props.uniTranspSeleccionado.vehiculoModelo : '',
    vin: props.uniTranspSeleccionado.vin ? props.uniTranspSeleccionado.vin : '',

    tarjetaCirculacionCertificadoHabilitacion: props.uniTranspSeleccionado.tarjetaCirculacionCertificadoHabilitacion
      ? props.uniTranspSeleccionado.tarjetaCirculacionCertificadoHabilitacion
      : '',
  });
  //#endregion INICIALIZACION

  //#region UPDATE UNIDAD TRANSPORTE
  const actualizarUnidadTransporte = $(async () => {
    if (laUnidadTransp.tarjetaCirculacionCertificadoHabilitacion.trim() === '') {
      alert('Debe ingresar la Tarjeta Circulacion / Certificado Habilitacion');
      document.getElementById('input_Licencia_CHOFER')?.focus();
      return;
    }

    // const unidadTransporte =
    await inUpUnidadTransporte({
      idUnidadTransporte: laUnidadTransp.idUnidadTransporte,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idVehiculo: laUnidadTransp.idVehiculo,
      activo: laUnidadTransp.activo,
      tarjetaCirculacionCertificadoHabilitacion: laUnidadTransp.tarjetaCirculacionCertificadoHabilitacion.trim(),

      usuario: parametrosGlobales.usuario,
    });

    ctx.actualizo_UnidadTransporte = true;
    ctx.mostrarPanelEditUnidadTransporte = false;
  });
  //#endregion UPDATE UNIDAD TRANSPORTE

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 400px)',
        // width: 'auto',
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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelEditUnidadTransporte = false;
            // ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de vehículo"
          height={16}
          width={16}
          title="Ver vehículo"
          onClick={$(() => {
            console.log('vehículo', vehiculo);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de vehículo"
          height={16}
          width={16}
          title="Ver vehículo"
          onClick={$(() => {
            console.log('ini.value', ini.value);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h3>Registro de unidad de transporte</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Placa */}
          <div class="form-control">
            <label>Placa</label>
            <div class="form-control form-agrupado">
              <input
                id="in_placa_VEHICULO"
                style={{ width: '100%', background: 'orange' }}
                disabled
                type="text"
                minLength={5}
                maxLength={10}
                placeholder="Add placa: AAA123, TRU789, XRW695"
                value={laUnidadTransp.placa}
                onChange$={(e) => {
                  laUnidadTransp.placa = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('se_marca_VEHICULO') as HTMLSelectElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* marca */}
          <div class="form-control">
            <label>Marca</label>
            <div class="form-control form-agrupado">
              <input type="text" disabled value={laUnidadTransp.vehiculoMarca} style={{ width: '100%' }} />
              {/* <ElSelect
                id={'se_marca_VEHICULO'}
                valorSeleccionado={vehiculo.vehiculoMarca}
                registros={lasMarcas.value}
                registroID={'_id'}
                registroTEXT={'vehiculoMarca'}
                seleccione={'-- Seleccione marca --'}
                onChange={$(() => {
                  // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
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
              /> */}
              {/* <input
                type="image"
                src={images.add}
                alt="Icono de adicionar marca vehícular"
                height={16}
                width={16}
                title="Adicionar la marca vehícular"
                // onClick$={() => {
                //   marca._id = '';
                //   marca.vehiculoMarca = '';
                //   definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular = true;
                // }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de edición marca vehícular"
                height={16}
                width={16}
                title="Editar marca vehícular"
                // onClick$={() => {
                //   const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                //   const elIdx = elSelec.selectedIndex;
                //   console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                //   console.log('elSelec.value', elSelec.value);
                //   if (elSelec[elIdx].id === '') {
                //     alert('Selecione la marca del vehículo');
                //     elSelec.focus();
                //     return;
                //   }
                //   marca._id = elSelec[elIdx].id;
                //   marca.vehiculoMarca = elSelec.value;
                //   definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular = true;
                // }}
              /> */}
            </div>
          </div>
          {/* {definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditMarcaVehicular && (
            <div class="modal">
              <NewEditMarcaVehicular marcaVehicularSelecci={marca} />
            </div>
          )} */}
          {/* modelo */}
          <div class="form-control">
            <label>Modelo</label>
            <div class="form-control form-agrupado">
              <input type="text" disabled value={laUnidadTransp.vehiculoModelo} style={{ width: '100%' }} />
              {/* <ElSelect
                id={'se_modelo_VEHICULO'}
                valorSeleccionado={vehiculo.vehiculoModelo}
                registros={losModelos.value}
                registroID={'_id'}
                registroTEXT={'modelo'}
                seleccione={'-- Seleccione modelo --'}
                onChange={$(() => {
                  console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢👓👓');
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
                // onClick$={() => {
                //   const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                //   const elIdx = elSelec.selectedIndex;
                //   console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                //   console.log('elSelec.value', elSelec.value);
                //   if (elSelec[elIdx].id === '') {
                //     alert('Seleccione la marca del vehículo');
                //     elSelec.focus();
                //     return;
                //   }
                //   modelo.idVehiculoMarca = elSelec[elIdx].id;
                //   modelo.vehiculoMarca = elSelec.value;

                //   modelo.idVehiculoModelo = '';
                //   modelo.vehiculoModelo = '';

                //   definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular = true;
                // }}
              />
              <input
                type="image"
                src={images.edit}
                alt="Icono de editar modelo vehícular"
                height={16}
                width={16}
                title="Editar modelo vehícular"
                // onClick$={() => {
                //   const elSelec = document.getElementById('se_marca_VEHICULO') as HTMLSelectElement;
                //   const elIdx = elSelec.selectedIndex;
                //   console.log('elSelec[elIdx].id', elSelec[elIdx].id);
                //   console.log('elSelec.value', elSelec.value);
                //   if (elSelec[elIdx].id === '') {
                //     alert('Seleccione la marca del vehículo');
                //     elSelec.focus();
                //     return;
                //   }
                //   modelo.idVehiculoMarca = elSelec[elIdx].id;
                //   modelo.vehiculoMarca = elSelec.value;

                //   const elSelecMo = document.getElementById('se_modelo_VEHICULO') as HTMLSelectElement;
                //   const elIdxMo = elSelecMo.selectedIndex;

                //   if (elSelecMo[elIdxMo].id === '') {
                //     alert('Seleccione el modelo del vehículo');
                //     elSelecMo.focus();
                //     return;
                //   } else {
                //     modelo.idVehiculoModelo = elSelecMo[elIdxMo].id;
                //     modelo.vehiculoModelo = elSelecMo.value;
                //   }

                //   definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular = true;
                // }}
              /> */}
            </div>
          </div>
          {/* {definicion_CTX_NEW_EDIT_VEHICULO.mostrarPanelNewEditModeloVehicular && (
            <div class="modal">
              <NewEditModeloVehicular modeloVehicularSelecci={modelo} />
            </div>
          )} */}
          {/* VIN */}
          <div class="form-control">
            <label>VIN</label>
            <div class="form-control form-agrupado">
              <input
                id="in_VIN_UNIDAD_TRANSPORTE"
                style={{ width: '100%' }}
                disabled
                type="text"
                placeholder="VIN"
                value={laUnidadTransp.vin}
                onChange$={(e) => {
                  laUnidadTransp.vin = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (
                      document.getElementById(
                        'in_TarjetaCirculacion_CertificadoHabilitacion_UNIDAD_TRANSPORTE'
                      ) as HTMLInputElement
                    )?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Tarjeta Circulación / Certificado Habilitacion */}
          <div class="form-control">
            <label>VIN</label>
            <div class="form-control form-agrupado">
              <input
                id="in_TarjetaCirculacion_CertificadoHabilitacion_UNIDAD_TRANSPORTE"
                style={{ width: '100%' }}
                type="text"
                placeholder="Tarjeta Circulación / Certificado Habilitación"
                value={laUnidadTransp.tarjetaCirculacionCertificadoHabilitacion}
                onChange$={(e) => {
                  laUnidadTransp.tarjetaCirculacionCertificadoHabilitacion = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('btn_actualizar_UNIDAD_TRANSPORTE') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>

        <input
          id="btn_actualizar_UNIDAD_TRANSPORTE"
          type="button"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            actualizarUnidadTransporte();
          }}
        />
      </div>
    </div>
  );
});
