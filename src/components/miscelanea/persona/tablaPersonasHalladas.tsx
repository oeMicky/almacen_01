import { component$, Resource, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '../../system/imgButton';
import style from '../../tabla/tabla.css?inline';
// import type { IPersona, IPersonaEdit } from '~/interfaces/iPersona';
import { CTX_CLIENTE_COTIZACION, CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_ADD_VENTA, CTX_CLIENTE_VENTA } from '~/components/venta/addVenta';
import { CTX_BUSCAR_PERSONA } from './buscarPersona';
import { CTX_CLIENTE_OS, CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_NEW_IN_ALMACEN, CTX_REMITENTE_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import { CTX_NEW_EDIT_COMPRA, CTX_PROVEEDOR } from '~/components/compra/newEditCompra';
import { parametrosGlobales } from '~/routes/login';
import { CTX_BUSCAR_TECNICO } from '../tecnico/buscarTecnico';
import { CTX_DESTINATARIO_OUT_ALMACEN, CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_DESTINATARIO_GR, CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { CTX_BUSCAR_CHOFER } from '../chofer/buscarChofer';
import { CTX_CLIENTE_OP, CTX_NEW_EDIT_ORDEN_PRODUCCION } from '~/components/ordenProduccion/newEditOrdenProduccion';
import { CTX_BUSCAR_TRANSPORTISTA } from '../transportista/buscarTransportista';
import { cerosALaIzquierda } from '~/functions/comunes';
// import { activarFavoritoAlmacen, desactivarFavoritoAlmacen } from '~/apis/persona.api';

//parametrosBusqueda: any;
export default component$((props: { buscarPersona: number; soloPersonasNaturales: boolean; contexto?: string; rol: string; personaEDITADA?: any }) => {
  useStyles$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  let ctx_rol: any = [];
  switch (props.contexto) {
    case 'orden_produccion':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
      // //console.log('swicth.......useContext(CTX_NEW_EDIT_ORDEN_SERVICIO)');
      if (props.rol === 'cliente') {
        ctx_rol = useContext(CTX_CLIENTE_OP);
        // //console.log('swicth.......useContext(CTX_CLIENTE_OS)');
      }
      break;
    case 'orden_servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      // //console.log('swicth.......useContext(CTX_NEW_EDIT_ORDEN_SERVICIO)');
      if (props.rol === 'cliente') {
        ctx_rol = useContext(CTX_CLIENTE_OS);
        // //console.log('swicth.......useContext(CTX_CLIENTE_OS)');
      }
      break;
    case 'venta':
      ctx = useContext(CTX_ADD_VENTA);
      // //console.log('swicth.......useContext(CTX_ADD_VENTA)');
      if (props.rol === 'cliente') {
        ctx_rol = useContext(CTX_CLIENTE_VENTA);
        // //console.log('swicth.......useContext(CTX_CLIENTE_VENTA)');
      }
      break;
    case 'cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      // //console.log('swicth.......useContext(CTX_NEW_EDIT_COTIZACION)');
      if (props.rol === 'cliente') {
        ctx_rol = useContext(CTX_CLIENTE_COTIZACION);
        // //console.log('swicth.......useContext(CTX_CLIENTE_COTIZACION)');
      }
      break;
    case 'new_in_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      // //console.log('swicth.......useContext(CTX_NEW_IN_ALMACEN)');
      if (props.rol === 'remitente') {
        ctx_rol = useContext(CTX_REMITENTE_IN_ALMACEN);
        // //console.log('swicth.......useContext(CTX_REMITENTE_IN_ALMACEN)');
      }
      break;
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      // //console.log('swicth.......useContext(CTX_NEW_OUT_ALMACEN)');
      if (props.rol === 'destinatario') {
        ctx_rol = useContext(CTX_DESTINATARIO_OUT_ALMACEN);
        // //console.log('swicth.......useContext(CTX_DESTINATARIO_OUT_ALMACEN)');
      }
      if (props.rol === 'cliente') {
        ctx_rol = useContext(CTX_DESTINATARIO_OUT_ALMACEN);
        // //console.log('swicth.......useContext(CTX_DESTINATARIO_OUT_ALMACEN)');
      }
      break;
    case 'new_edit_compra':
      ctx = useContext(CTX_NEW_EDIT_COMPRA);
      // //console.log('swicth.......useContext(CTX_NEW_EDIT_COMPRA)');
      if (props.rol === 'proveedor') {
        ctx_rol = useContext(CTX_PROVEEDOR);
        // //console.log('swicth.......useContext(CTX_PROVEEDOR)');
      }
      break;
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      // //console.log('swicth.......useContext(CTX_NEW_EDIT_COMPRA)');
      if (props.rol === 'destinatario') {
        ctx_rol = useContext(CTX_DESTINATARIO_GR);
        // //console.log('swicth.......useContext(CTX_PROVEEDOR)');
      }
      if (props.rol === 'transportista') {
        ctx = useContext(CTX_BUSCAR_TRANSPORTISTA);
        // //console.log('swicth.......useContext(CTX_PROVEEDOR)');
      }
      if (props.rol === 'chofer') {
        ctx = useContext(CTX_BUSCAR_CHOFER);
        // //console.log('swicth.......useContext(CTX_PROVEEDOR)');
      }
      break;
    case 'buscar_tecnico':
      ctx = useContext(CTX_BUSCAR_TECNICO);
      break;
    // case 'buscar_transportista':
    //   ctx = useContext(CTX_BUSCAR_TRANSPORTISTA);
    //   break;
    // case 'buscar_chofer':
    //   ctx = useContext(CTX_BUSCAR_CHOFER);
    //   break;
  }
  //
  const ctx_buscar_persona = useContext(CTX_BUSCAR_PERSONA);
  //#endregion CONTEXTOS

  // //console.log('props.contexto', props.contexto);
  // const ctx = props.contexto === 'COTIZACION' ? useContext(CTX_COTIZACION) : useContext(CTX_VENTA);

  //#region INICIALIZAR
  // let misPersonas = useStore<IPersonaEdit[]>([]);
  //#endregion INICIALIZAR

  //#region BUSCANDO REGISTROS
  const lasPersonas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarPersona.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('props.soloPersonasNaturales:::...', props.soloPersonasNaturales);
    //console.log('ctx_buscar_persona:::...', ctx_buscar_persona);
    ctx_buscar_persona.mostrarSpinner = true;
    if (props.soloPersonasNaturales) {
      if (ctx_buscar_persona.buscarPor === 'Nombre / Razón social') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerSoloPersonasNaturalesPorRazonNombre', {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
            idEmpresa: parametrosGlobales.idEmpresa,
            buscarPor: ctx_buscar_persona.buscarPor,
            cadenaABuscar: ctx_buscar_persona.conceptoABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
      if (ctx_buscar_persona.buscarPor === 'DNI / RUC') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerSoloPersonasNaturalesPorDniRuc', {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
            idEmpresa: parametrosGlobales.idEmpresa,
            buscarPor: ctx_buscar_persona.buscarPor,
            cadenaABuscar: ctx_buscar_persona.conceptoABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
    } else {
      if (ctx_buscar_persona.buscarPor === 'Nombre / Razón social') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerPersonasPorRazonNombre', {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
            idEmpresa: parametrosGlobales.idEmpresa,
            buscarPor: ctx_buscar_persona.buscarPor,
            cadenaABuscar: ctx_buscar_persona.conceptoABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
      if (ctx_buscar_persona.buscarPor === 'DNI / RUC') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerPersonasPorDniRuc', {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
            idEmpresa: parametrosGlobales.idEmpresa,
            buscarPor: ctx_buscar_persona.buscarPor,
            cadenaABuscar: ctx_buscar_persona.conceptoABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
    }
  });
  //#endregion BUSCANDO REGISTROS

  //#region ACTUALIZAR PERSONA
  // useTask$(({ track }) => {
  //   track(() => props.personaEDITADA);

  //   //console.log('PIPIPIPI', ctx_buscar_persona.misPersonas);

  //   if (props.personaEDITADA !== '' && props.personaEDITADA._id !== '') {
  //     // //console.log('TABLA props.personaEDITADA', props.personaEDITADA);
  //     // let KKK = lasPersonas.value;
  //     // const { data } = KKK.then(data);
  //     // const mer: any = data;
  //     // //console.log('TABLA lasPersonas KKK', KKK);
  //     // props.personaEDITADA = '';

  //     // const laPP = KKK.filter((per: any) => per._id === props.personaEDITADA._id);
  //     // //console.log('laPP', laPP);

  //     // laPP[0].email = props.personaEDITADA.email;
  //     // laPP[0].telefono = props.personaEDITADA.telefono;
  //   }
  // });
  //#endregion ACTUALIZAR PERSONA

  return (
    <Resource
      value={lasPersonas}
      onPending={() => {
        // //console.log('onPending 🍉🍉🍉🍉');
        // ctx_buscar_persona.mostrarSpinner = false;
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        // //console.log('onRejected 🍍🍍🍍🍍');
        ctx_buscar_persona.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(personas) => {
        console.log('onResolved 🍓🍓🍓🍓', personas);
        const { data } = personas; //{ status, data, message }
        // const misPersonas: IPersonaEdit[] = data;
        ctx_buscar_persona.mostrarSpinner = false;
        ctx_buscar_persona.misPersonas = data;
        return (
          <>
            {ctx_buscar_persona.misPersonas.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th>Razón social / Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ctx_buscar_persona.misPersonas.map((persoLocali: any, index: number) => {
                      const {
                        _id,
                        codigoTipoDocumentoIdentidad,
                        tipoDocumentoIdentidad,
                        numeroIdentidad,
                        razonSocialNombre,
                        direccion,
                        email,
                        telefono,
                        // favoritoAlmacen,
                        // favoritoVenta,
                      } = persoLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{cerosALaIzquierda(indexItem, 3)}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td
                            data-label="R.Soc/Nomb"
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            onClick$={() => {
                              if (props.contexto === 'new_out_almacen' && props.rol === 'cliente') {
                                ctx_buscar_persona.pP = persoLocali;
                                ctx.mostrarPanelVentasCliente = true;
                              } else {
                                console.log('TABLA_PERSONAS_HALLADAS: es verdadderoa.....', direccion);
                                ctx_rol._id = _id;
                                ctx_rol.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;
                                ctx_rol.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                ctx_rol.numeroIdentidad = numeroIdentidad;
                                ctx_rol.razonSocialNombre = razonSocialNombre;
                                ctx_rol.direccion = direccion;
                                ctx_rol.email = email;
                                ctx_rol.telefono = telefono;
                                //console.log('ctx_rol', ctx_rol);

                                ctx.mostrarPanelBuscarPersona = false;
                                if (props.rol === 'remitente') {
                                  ctx.mostrarPanelBuscarRemitente = false;
                                }
                                if (props.rol === 'destinatario') {
                                  ctx.mostrarPanelBuscarDestinatario = false;
                                }
                                if (props.rol === 'transportista') {
                                  //console.log('transportista');
                                  ctx.mostrarPanelBuscarTransportista = false;
                                }
                                if (props.rol === 'chofer') {
                                  ctx.mostrarPanelBuscarChofer = false;
                                }
                                ctx.idPersona = _id;
                                ctx.conceptoABuscar = numeroIdentidad;
                                ctx.mensajeErrorCliente = '';
                                ctx.rol_Persona = props.rol;
                                ctx.selecciono_Persona = true;
                              }
                            }}
                          >
                            {razonSocialNombre}
                          </td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              // id="in_BuscarDetraccion"
                              title="Seleccionar persona"
                              type="image"
                              src={images.check32}
                              height={14}
                              width={14}
                              style={{ marginRight: '6px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                //console.log('persoLocali', persoLocali);
                                if (props.contexto === 'new_out_almacen' && props.rol === 'cliente') {
                                  ctx_buscar_persona.pP = persoLocali;
                                  ctx.mostrarPanelVentasCliente = true;
                                } else {
                                  console.log('TABLA_PERSONAS_HALLADAS: es verdadderoa.....', direccion);
                                  ctx_rol._id = _id;
                                  ctx_rol.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;
                                  ctx_rol.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                  ctx_rol.numeroIdentidad = numeroIdentidad;
                                  ctx_rol.razonSocialNombre = razonSocialNombre;
                                  ctx_rol.direccion = direccion;
                                  ctx_rol.email = email;
                                  ctx_rol.telefono = telefono;
                                  //console.log('ctx_rol', ctx_rol);

                                  ctx.mostrarPanelBuscarPersona = false;
                                  if (props.rol === 'remitente') {
                                    ctx.mostrarPanelBuscarRemitente = false;
                                  }
                                  if (props.rol === 'destinatario') {
                                    ctx.mostrarPanelBuscarDestinatario = false;
                                  }
                                  if (props.rol === 'transportista') {
                                    //console.log('transportista');
                                    ctx.mostrarPanelBuscarTransportista = false;
                                  }
                                  if (props.rol === 'chofer') {
                                    ctx.mostrarPanelBuscarChofer = false;
                                  }
                                  ctx.idPersona = _id;
                                  ctx.conceptoABuscar = numeroIdentidad;
                                  ctx.mensajeErrorCliente = '';
                                  ctx.rol_Persona = props.rol;
                                  ctx.selecciono_Persona = true;
                                }
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              title="Editar persona"
                              type="image"
                              src={images.edit}
                              height={14}
                              width={14}
                              style={{ marginRight: '6px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_buscar_persona.pP = persoLocali;
                                // ctx_buscar_persona.mostrarPanelNewEditPersona = true;
                                ctx_buscar_persona.mostrarPanelEditPersona = true;

                                //console.log('ctx', ctx);
                                //console.log('selecion', persoLocali);
                              }}
                            />
                            {/* {props.contexto === 'new_in_almacen' || props.contexto === 'new_out_almacen' ? (
                              <input
                                title="Es favorito del almacén"
                                type="image"
                                src={favoritoAlmacen ? images.estrella128 : images.estrella128Contorno}
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={async () => {
                                  if (favoritoAlmacen) {
                                    console.log('desactivarFavoritoAlmacen', razonSocialNombre);
                                    await desactivarFavoritoAlmacen({
                                      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                      idEmpresa: parametrosGlobales.idEmpresa,
                                      idSucursal: parametrosGlobales.idSucursal,

                                      idPersona: _id,
                                      codigoTipoDocumentoIdentidad: codigoTipoDocumentoIdentidad,
                                      tipoDocumentoIdentidad: tipoDocumentoIdentidad,
                                      numeroIdentidad: numeroIdentidad,
                                      razonSocialNombre: razonSocialNombre,

                                      // listaFavoritosAlmacen: [],

                                      usuario: parametrosGlobales.usuario,
                                    });
                                  } else {
                                    //console.log('misPersonas', ctx_buscar_persona.misPersonas);
                                    console.log('activarFavoritoAlmacen', razonSocialNombre); //const activo =
                                    await activarFavoritoAlmacen({
                                      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                      idEmpresa: parametrosGlobales.idEmpresa,
                                      idSucursal: parametrosGlobales.idSucursal,

                                      idPersona: _id,
                                      codigoTipoDocumentoIdentidad: codigoTipoDocumentoIdentidad,
                                      tipoDocumentoIdentidad: tipoDocumentoIdentidad,
                                      numeroIdentidad: numeroIdentidad,
                                      razonSocialNombre: razonSocialNombre,

                                      // listaFavoritosAlmacen: [],

                                      usuario: parametrosGlobales.usuario,
                                    });
                                  }
                                  ctx_buscar_persona.buscarPersona++;
                                }}
                              />
                            ) : (
                              ''
                            )} */}
                            {/* {props.contexto === 'venta' ? (
                              <input
                                title="Es favorito de venta"
                                type="image"
                                src={favoritoVenta ? images.estrella128 : images.estrella128Contorno}
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  //console.log('misPersonas', ctx_buscar_persona.misPersonas);
                                }}
                              />
                            ) : (
                              ''
                            )} */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div>
                <i style={{ fontSize: '0.8rem', color: 'red' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
