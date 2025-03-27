import { $, component$, Resource, useContext, useResource$, useSignal } from '@builder.io/qwik';

import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import { CTX_IN_ALMACEN, CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import type { IFavorito } from '~/interfaces/iPersona';
import { cerosALaIzquierda } from '~/functions/comunes';
import { CTX_NEW_OUT_ALMACEN, CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
// import { cerosALaIzquierda } from '~/functions/comunes';

export default component$((props: { contexto: string; rol: string }) => {
  //#region CONTEXTOS
  // const ctx = useContext(CTX_NEW_IN_ALMACEN);
  let ctx: any = [];
  let ctx_DOC: any = [];
  switch (props.contexto) {
    case 'new_in_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      ctx_DOC = useContext(CTX_IN_ALMACEN);
      // //console.log('swicth.......useContext(CTX_NEW_IN_ALMACEN)');
      // if (props.rol === 'remitente') {
      //   ctx_rol = useContext(CTX_REMITENTE_IN_ALMACEN);
      //   // //console.log('swicth.......useContext(CTX_REMITENTE_IN_ALMACEN)');
      // }
      break;
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      ctx_DOC = useContext(CTX_OUT_ALMACEN);
      // //console.log('swicth.......useContext(CTX_NEW_OUT_ALMACEN)');
      // if (props.rol === 'destinatario') {
      //   ctx_rol = useContext(CTX_DESTINATARIO_OUT_ALMACEN);
      //   // //console.log('swicth.......useContext(CTX_DESTINATARIO_OUT_ALMACEN)');
      // }
      // if (props.rol === 'cliente') {
      //   ctx_rol = useContext(CTX_DESTINATARIO_OUT_ALMACEN);
      //   // //console.log('swicth.......useContext(CTX_DESTINATARIO_OUT_ALMACEN)');
      // }
      break;
  }
  //#region CONTEXTOS

  //#region INIALIZACION
  const ini = useSignal(0);
  //#endregion INIALIZACION

  //#region BUSCANDO REGISTROS
  const losFavoritosAlmacen = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // track(() => props.buscarMercaderiasOUT.valueOf());
    track(() => ini.value);

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/grupoEmpresarial/listarFavoritosAlmacen', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 600px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        // background: '#eee',
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
            ctx.mostrarPanelListaFavoritosAlmacen = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <h3 style={{ fontSize: '0.8rem' }}>
          In almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        <label style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Lista favoritos</label>
        {/* TABLA FAVORITOS */}
        <Resource
          value={losFavoritosAlmacen}
          onPending={() => {
            //console.log('onPending 🍉🍉🍉🍉');
            return <div>Cargando...</div>;
          }}
          onRejected={() => {
            //console.log('onRejected 🍍🍍🍍🍍');
            return <div>Fallo en la carga de datos</div>;
          }}
          onResolved={(favoAlmacen) => {
            console.log('onResolved 🍓🍓🍓🍓', favoAlmacen);
            const { data } = favoAlmacen; //{ status, data, message }
            const misFavoritosAlmacen: IFavorito[] = data;
            //console.log('misMercaderiasOUT', misMercaderiasOUT);
            return (
              <>
                {misFavoritosAlmacen.length > 0 ? (
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                    {/* <table style={{ fontWeight: 'lighter ' }}> */}
                    {/* <table> */}
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misFavoritosAlmacen.map((favoAlmacenListado, index) => {
                        const elIndex = index + 1;
                        const { _id, idPersona, codigoTipoDocumentoIdentidad, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre } = favoAlmacenListado;
                        // const indexItem = index + 1;   , costoUnitarioMovil, precio
                        return (
                          <tr key={_id}>
                            <td data-label="Ítem">{cerosALaIzquierda(elIndex, 3)}</td>
                            <td data-label="Descripción">{razonSocialNombre}</td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                title="Seleccionar favorito"
                                type="image"
                                src={images.check32}
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  switch (props.contexto) {
                                    case 'new_in_almacen':
                                      ctx_DOC.idRemitente = idPersona;

                                      break;
                                    case 'new_out_almacen':
                                      ctx_DOC.idDestinatario = idPersona;

                                      break;
                                  }
                                  ctx_DOC.razonSocialNombre = razonSocialNombre;
                                  ctx_DOC.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                  ctx_DOC.numeroIdentidad = numeroIdentidad;
                                  ctx_DOC.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;

                                  ctx.mostrarPanelListaFavoritosAlmacen = false;
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
});
