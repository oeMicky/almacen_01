import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { CTX_BUSCAR_UNIDAD_TRANSPORTE } from './buscarUnidadTransporte';
import { parametrosGlobales } from '~/routes/login';
import { images } from '~/assets';
import type { IUnidadTransporte } from '~/interfaces/iVehiculo';
import { elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { buscarUnidadTransporte: number; contexto: string; tipo: string }) => {
  useStyles$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  let vehiPrinci: any;
  let vehiSecundarios: any = [];
  switch (props.contexto) {
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      vehiPrinci = useContext(CTX_GUIA_REMISION);
      vehiSecundarios = useContext(CTX_GUIA_REMISION).vehiculosSecundarios;
      break;
  }
  const ctx_buscar_unidad_transporte = useContext(CTX_BUSCAR_UNIDAD_TRANSPORTE);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasUnidadesTransp = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarUnidadTransporte.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('buscarUnidadTransporte:::...', props.buscarUnidadTransporte);

    if (ctx_buscar_unidad_transporte.buscarPor === 'Placa') {
      //console.log('Placa:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/unidadTransporte/obtenerUnidadTransportePorPlaca', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_unidad_transporte.buscarPor,
          cadenaABuscar: ctx_buscar_unidad_transporte.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (ctx_buscar_unidad_transporte.buscarPor === 'Marca') {
      //console.log('Marca:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/unidadTransporte/obtenerUnidadTransportePorMarca', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_unidad_transporte.buscarPor,
          cadenaABuscar: ctx_buscar_unidad_transporte.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasUnidadesTransp}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(unidadesTransporte) => {
        //console.log('onResolved 🍓🍓🍓🍓', unidadesTransporte);
        const { data } = unidadesTransporte; //{ status, data, message }
        const misUnidadesTransp: IUnidadTransporte[] = data;
        return (
          <>
            {misUnidadesTransp.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Tarj.Circul./Certif.Habilit.</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misUnidadesTransp.map((vehicuLocali, index) => {
                      const {
                        idUnidadTransporte,
                        idVehiculo,
                        placa,
                        idVehiculoMarca,
                        vehiculoMarca,
                        idVehiculoModelo,
                        vehiculoModelo,
                        // vin,
                        tarjetaCirculacionCertificadoHabilitacion,
                      } = vehicuLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={idVehiculo}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Placa">{placa}</td>
                          <td data-label="Marca">{vehiculoMarca}</td>
                          <td data-label="Modelo">{vehiculoModelo}</td>
                          <td data-label="Tarj.Circul./Certif.Habilit.">{tarjetaCirculacionCertificadoHabilitacion}</td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar chofer"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                if (
                                  typeof tarjetaCirculacionCertificadoHabilitacion === 'undefined' ||
                                  tarjetaCirculacionCertificadoHabilitacion === null ||
                                  tarjetaCirculacionCertificadoHabilitacion === ''
                                ) {
                                  alert('No presenta la Tarj. Circul./Certif. Habilit.');
                                  return;
                                }

                                if (props.tipo === 'principal') {
                                  //console.log('vehicuLocali', vehicuLocali);
                                  vehiPrinci.idVehiculoPrincipal = idUnidadTransporte;
                                  // emisorAutorizacionEspecial: '',
                                  // numeroAutorizacionEspecial: '',
                                  vehiPrinci.numeroPlaca = placa;
                                  vehiPrinci.tarjetaCirculacionOCertificadoHabilitacion = tarjetaCirculacionCertificadoHabilitacion;

                                  ctx.mostrarPanelBuscarUnidadTransportePrincipal = false;
                                } else {
                                  vehiSecundarios.push({
                                    idAuxiliar: elIdAuxiliar(),
                                    placa: placa,
                                    idVehiculoMarca: idVehiculoMarca,
                                    vehiculoMarca: vehiculoMarca,
                                    idVehiculoModelo: idVehiculoModelo,
                                    vehiculoModelo: vehiculoModelo,
                                    tarjetaCirculacionCertificadoHabilitacion: tarjetaCirculacionCertificadoHabilitacion,
                                    tipo: false,
                                  });
                                  ctx.selecciono_UnidadTransporte = true;
                                  ctx.mostrarPanelBuscarUnidadTransporteSecundario = false;
                                }
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar persona"
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                // ctx_buscar_persona.pP = persoLocali;
                                // ctx_buscar_persona.mostrarPanelNewEditPersona = true;
                                //console.log('ctx', ctx);
                                //console.log('selecion', vehicuLocali);
                                ctx_buscar_unidad_transporte.uT = vehicuLocali;
                                ctx_buscar_unidad_transporte.mostrarPanelEditUnidadTransporte = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div>
                <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
