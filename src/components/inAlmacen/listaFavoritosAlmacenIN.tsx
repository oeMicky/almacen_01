import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from './newInAlmacen';
import { parametrosGlobales } from '~/routes/login';
// import { cerosALaIzquierda } from '~/functions/comunes';

export default component$(() => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_IN_ALMACEN);
  //#region CONTEXTOS

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
            ctx.mostrarPanelListaFavoritosAlmacenIN = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <h3 style={{ fontSize: '0.8rem' }}>
          In almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        <label style={{ fontSize: '0.8rem' }}>Lista favoritos</label>
        {/* TABLA FAVORITOS */}
        {/* {definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0 ? (
          <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
            <thead>
              <tr>
                <th>Ítem</th>
                <th>Responsable</th>
                {definicion_CTX_IN_ALMACEN._id === '' ? <th>Acc</th> : ''}
              </tr>
            </thead>
            <tbody>
              {definicion_CTX_IN_ALMACEN.itemsMercaderias.map((iTMercaIN: any, index: number) => {
                // console.log('DIMMMMMMMMMMMM  iTMercaIN', iTMercaIN);
                const indexItemMercaIN = index + 1;

                return (
                  <tr key={iTMercaIN.idAuxiliar}>
                    <td data-label="Ítem" key={iTMercaIN.idAuxiliar}>{`${cerosALaIzquierda(indexItemMercaIN, 3)}`}</td>
                    <td data-label="Responsable">
                      {typeof iTMercaIN.idKardex !== 'undefined' ? iTMercaIN.idKardex.substring(iTMercaIN.idKardex.length - 6) : '-'}
                    </td>

                  
                    {definicion_CTX_IN_ALMACEN._id === '' ? (
                      <td data-label="Acc" class="accionesLeft">
                        <input
                          title="Seleccionar responsable"
                          type="image"
                          src={images.check32}
                          alt="icono de eliminar"
                          height={16}
                          width={16}

                          // onClick$={() => {
                          //   borrarItemMercaIN.idAuxiliar = iTMercaIN.idAuxiliar;
                          //   // borrarItemMercaIN.item = indexItemMercaIN;
                          //   borrarItemMercaIN.codigo = iTMercaIN.codigo;
                          //   borrarItemMercaIN.descripcion = iTMercaIN.descripcion;
                          //   definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteItemMercaderiaIN = true;
                          // }}
                        />
                      </td>
                    ) : (
                      ''
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <i style={{ fontSize: '0.8rem' }}>No existen favoritos registradas</i>
        )} */}
      </div>
    </div>
  );
});
