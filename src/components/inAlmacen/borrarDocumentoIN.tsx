import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_IN_ALMACEN } from './newInAlmacen';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';

export default component$((props: { borrarDocumento: any }) => {
  //#region CONTEXTO
  //   let documentos: any = [];
  //   documentos = useContext(CTX_IN_ALMACEN).itemsMercaderias;
  const ctx_new_in_almacen = useContext(CTX_NEW_IN_ALMACEN);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 400px)',
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
            ctx_new_in_almacen.mostrarPanelDeleteDocumentoIN = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el documento?</label>
          <br />
          <p style={{ margin: '8px 8px' }}>
            <label>
              {formatoDDMMYYYY_PEN(props.borrarDocumento.fecha)} - {props.borrarDocumento.descripcionTCP}
            </label>
            <br />
            <label>
              {props.borrarDocumento.serie} - {props.borrarDocumento.numero}
            </label>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '4px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_in_almacen.borrarIdAuxiliarDoc = props.borrarDocumento.idAuxiliar;
                ctx_new_in_almacen.mostrarPanelDeleteDocumentoIN = false;
              }}
            >
              SI
            </button>{' '}
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_in_almacen.mostrarPanelDeleteDocumentoIN = false;
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
