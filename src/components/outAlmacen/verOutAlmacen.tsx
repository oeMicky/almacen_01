import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_OUT_ALMACEN } from '~/routes/(inventario)/outAlmacen';
import { parametrosGlobales } from '~/routes/login';
import { cerosALaIzquierda, formatear_6Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';

export default component$((props: { outSelecci: any; contexto: string; indexItem?: number }) => {
  //#region CONTEXTO
  let ctx: any;
  switch (props.contexto) {
    case 'index_out_almacen':
      ctx = useContext(CTX_INDEX_OUT_ALMACEN);
      break;

    // case 'kardex':
    //   ctx = useContext(CTX_INDEX_IN_ALMACEN);
    //   break;
  }
  //#endregion CONTEXTO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 96%, 1096px)',
        // width: 'auto',
        padding: '2px',
        background: '#eee',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewOutAlmacen = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3 style={{ fontSize: '0.8rem' }}>
          Out almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE OUT ALMACÉN */}
          <div>
            {/* ID */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_ID"
                  style={{ width: '100%' }}
                  type="text"
                  // autoFocus
                  disabled
                  value={props.outSelecci._id}
                />
              </div>
            </div>
            {/* USUARIO */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_ID"
                  style={{ width: '100%' }}
                  type="text"
                  // autoFocus
                  disabled
                  value={props.outSelecci.usuario + '; ' + props.outSelecci.creado}
                />
              </div>
            </div>

            {/* FISMA */}
            <div class="form-control form-control-check">
              <div class="form-control form-agrupado">
                <input id="in_FISMA" type="text" disabled={props.outSelecci._id !== ''} style={{ width: '100%' }} value={props.outSelecci.FISMA} />
              </div>
            </div>
            {/* motivo de egreso */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_MotivoEgresoAlmacen"
                  type="text"
                  disabled={props.outSelecci._id !== ''}
                  style={{ width: '100%' }}
                  value={props.outSelecci.motivoEgresoAlmacen}
                />
              </div>
            </div>
            <br />
          </div>

          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL DESTINATARIO */}
          <div>
            {/* tipo de documento identidad DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_FISMA"
                  type="text"
                  disabled={props.outSelecci._id !== ''}
                  style={{ width: '100%' }}
                  value={props.outSelecci.tipoDocumentoIdentidad}
                />
              </div>
            </div>

            {/* numero identidad DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_NumeroDocumentoIdentidad_DESTINATARIO"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={props.outSelecci._id !== ''}
                  placeholder="Add número identidad destinatario"
                  value={props.outSelecci.numeroIdentidad}
                />
              </div>
            </div>

            {/* Razon Social / Nombre - DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Nombre_DESTINATARIO"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={props.outSelecci._id !== ''}
                  placeholder="Razón social / Nombre - destinatario"
                  value={props.outSelecci.razonSocialNombre}
                />
              </div>
            </div>
            <br />
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input type={'text'} id={'in_IGV'} style={{ width: '100%' }} disabled value={props.outSelecci.igv.$numberDecimal + ' %'} />
              </div>
            </div>
            <br />
          </div>
          {/* ----------------------------------------------------- */}
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DE LOS DOCUMENTOS ADJUNTOS */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {props.outSelecci.documentosAdjuntos.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>TCP</th>
                    <th>Fecha</th>
                    <th>Serie</th>
                    <th>Número</th>
                  </tr>
                </thead>
                <tbody>
                  {props.outSelecci.documentosAdjuntos.map((iTDocAdj: any) => {
                    // const indexItemServi = index + 1;

                    return (
                      <tr key={iTDocAdj.idAuxiliar}>
                        <td data-label="TCP" class="comoCadena">
                          {iTDocAdj.descripcionTCP}
                        </td>
                        <td data-label="Fecha" class="comoCadena">
                          {formatoDDMMYYYY_PEN(iTDocAdj.fecha)}
                        </td>
                        <td data-label="Serie" class="comoCadena">
                          {iTDocAdj.serie}
                        </td>
                        <td data-label="Número" class="comoCadena">
                          {cerosALaIzquierda(iTDocAdj.numero, 8)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen documentos adjuntos</i>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BOTON / TABLA  MERCADERIAS  OUT */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {/* TABLA MERCADERIA IN: REPUESTOS -- LUBRICANTES -- ETC */}
            {props.outSelecci.itemsMercaderias.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Costo Unit PEN</th>
                    <th>Sub Total PEN</th>
                  </tr>
                </thead>
                <tbody>
                  {props.outSelecci.itemsMercaderias.map((iTMercaOUT: any, index: any) => {
                    const indexItemMerca = index + 1;

                    return (
                      <tr key={iTMercaOUT.idAuxiliar}>
                        <td data-label="Ítem" key={iTMercaOUT.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(indexItemMerca, 3)}`}</td>
                        <td data-label="Código" class="comoCadena">
                          {iTMercaOUT.codigo}
                        </td>
                        <td data-label="Descripción" class="comoCadena">
                          {iTMercaOUT.descripcionEquivalencia}
                        </td>
                        <td data-label="Cantidad" class="comoNumero">
                          <input
                            type="number"
                            style={{ width: '96px', textAlign: 'end' }}
                            disabled
                            value={
                              iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                : iTMercaOUT.cantidadSacadaEquivalencia
                            }
                          />
                        </td>
                        <td data-label="Uni" class="comoCadena">
                          {iTMercaOUT.unidadEquivalencia}
                        </td>
                        <td data-label="Costo Unit PEN" class="comoNumero">
                          <input
                            type="number"
                            style={{ width: '96px', textAlign: 'end' }}
                            disabled
                            value={formatear_6Decimales(
                              iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                ? iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                : iTMercaOUT.costoUnitarioEquivalenciaPEN
                            )}
                          />
                        </td>
                        <td data-label="SubTotal PEN" style={{ textAlign: 'end' }}>
                          {iTMercaOUT.subEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <br />
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen mercaderías registradas</i>
            )}
          </div>
        </div>
        {/* ----------------------------------------------------- */}
        {/* GRABAR */}
      </div>
    </div>
  );
});
