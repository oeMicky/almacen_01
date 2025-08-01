import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_OUT_ALMACEN } from '~/routes/(inventario)/outAlmacen';
import { parametrosGlobales } from '~/routes/login'; //
import { cerosALaIzquierda, formatear_6Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import { cerosALaIzquierda, formatear_6Decimales } from '~/functions/comunes';
// import { cerosALaIzquierda } from '~/functions/comunes';
import { CTX_KARDEX } from '../inventario/kardex';

export default component$((props: { outSelecci: any; contexto: string; indexItem?: number; codigoMercaderia?: string }) => {
  //#region CONTEXTO
  let ctx: any;
  switch (props.contexto) {
    case 'index_out_almacen':
      ctx = useContext(CTX_INDEX_OUT_ALMACEN);
      break;

    case 'kardex':
      ctx = useContext(CTX_KARDEX);
      break;
  }
  //#endregion CONTEXTO

  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const fechaUTC = props.outSelecci.createdAt;
  const fechaLocal = new Date(fechaUTC);

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(320px, 100%, 1096px)',
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
          backgroundColor: '#ff000020',
        }}
      >
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.outSelecci', props.outSelecci);

            // ctx.mostrarPanelVerOutAlmacen = false;
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelVerOutAlmacen = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3 style={{ fontSize: '0.8rem' }}>
          Out almacén - {parametrosGlobales.RazonSocial} - <label style={{ color: 'red' }}>{parametrosGlobales.sucursal}</label>
        </h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE OUT ALMACÉN */}
          <div>
            <div class="linea_1_111">
              {/* indexItem */}
              <input
                id="in_indexItem"
                style={{ width: '100%', backgroundColor: '#c0f0f0' }}
                type="text"
                // autoFocus
                disabled
                value={props.indexItem}
              />
              {/* ID */}
              <input
                id="in_ID"
                style={{ width: '100%' }}
                type="text"
                // autoFocus
                disabled
                value={props.outSelecci._id}
              />
              {/* USUARIO */}
              <input
                id="in_ID"
                style={{ width: '100%' }}
                type="text"
                // autoFocus
                disabled
                // value={props.outSelecci.usuarioCrea + '; ' + props.outSelecci.fechaLocal + ' ' + props.outSelecci.horaLocal}
                // value={props.inSelecci.usuarioCrea + '; ' + fechaLocal.toString()}
                value={props.outSelecci.usuarioCrea + '; ' + fechaLocal.toLocaleString('es-PE', opciones)}
              />
            </div>
            <div class="linea_1_111">
              {/* FISMA */}
              <input
                id="in_FISMA"
                type="text"
                disabled={props.outSelecci._id !== ''}
                style={{ width: '100%' }}
                value={formatoDDMMYYYY_PEN(props.outSelecci.FISMA)}
              />

              {/* Nota de salida: serie - número */}
              {props.outSelecci.numero && props.outSelecci.serie && (
                <input
                  id="in_MotivoEgresoAlmacen"
                  type="text"
                  disabled={props.outSelecci._id !== ''}
                  style={{ width: '100%' }}
                  value={
                    (props.outSelecci.serie ? props.outSelecci.serie : '') + ' - ' + cerosALaIzquierda(props.outSelecci.numero ? props.outSelecci.numero : 0, 8)
                  }
                />
              )}
              {/* motivo de egreso */}
              <input
                id="in_MotivoEgresoAlmacen"
                type="text"
                disabled={props.outSelecci._id !== ''}
                style={{ width: '100%', fontWeight: 'bold', backgroundColor: 'orange', color: 'white' }}
                value={props.outSelecci.motivoEgresoAlmacen}
              />
            </div>
            {/* obesrvacion */}
            <input
              id="in_Observacion"
              // style={{ background: '#F4FF7A', width: '100%' }}
              style={{ background: 'yellow', width: '100%' }}
              type="text"
              // autoFocus
              disabled
              value={props.outSelecci.observacion}
            />
          </div>

          <br />
          {/* ------------------------------------------------------------- */}
          {/* GENERALES DEL DESTINATARIO */}
          <div class="linea_1_111">
            {/* tipo de documento identidad DESTINATARIO*/}
            <input
              id="in_FISMA"
              type="text"
              disabled={props.outSelecci._id !== ''}
              style={{ width: '100%', backgroundColor: '#c0f0f0' }}
              value={props.outSelecci.tipoDocumentoIdentidad}
            />

            {/* numero identidad DESTINATARIO*/}
            <input
              id="in_NumeroDocumentoIdentidad_DESTINATARIO"
              style={{ width: '100%' }}
              type="text"
              disabled={props.outSelecci._id !== ''}
              placeholder="Add número identidad destinatario"
              value={props.outSelecci.numeroIdentidad}
            />
            {/* Razon Social / Nombre - DESTINATARIO*/}
            <input
              id="in_Nombre_DESTINATARIO"
              style={{ width: '100%' }}
              type="text"
              disabled={props.outSelecci._id !== ''}
              placeholder="Razón social / Nombre - destinatario"
              value={props.outSelecci.razonSocialNombre}
            />
          </div>
          <br />
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            {/* <div class="form-control">
              <div class="form-control form-agrupado">
                <input type={'text'} id={'in_IGV'} style={{ width: '100%' }} disabled value={props.outSelecci.igv.$numberDecimal + ' %'} />
              </div>
            </div> */}
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
                      <tr key={iTDocAdj.idAuxiliar} style={{ backgroundColor: '#cdc2b5 ' }}>
                        <td data-label="TCP">{iTDocAdj.descripcionTCP}</td>
                        <td data-label="Fecha">{formatoDDMMYYYY_PEN(iTDocAdj.fecha)}</td>
                        <td data-label="Serie">{iTDocAdj.serie}</td>
                        <td data-label="Número">{cerosALaIzquierda(iTDocAdj.numero, 8)}</td>
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
                    {/* <th>idMerca</th> */}
                    <th>Descripción</th>
                    <th>Ubigeo</th>
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
                        <td
                          data-label="Ítem"
                          key={iTMercaOUT.idAuxiliar}
                          style={props.codigoMercaderia === iTMercaOUT.codigo ? { color: 'purple' } : {}}
                        >{`${cerosALaIzquierda(indexItemMerca, 3)}`}</td>
                        {/* <td data-label="idMerca" style={props.codigoMercaderia === iTMercaOUT.codigo ? { color: 'purple' } : {}}>
                          {iTMercaOUT.idMercaderia}
                        </td> */}
                        <td data-label="Descripción" style={props.codigoMercaderia === iTMercaOUT.codigo ? { color: 'purple' } : {}}>
                          {iTMercaOUT.descripcionEquivalencia}
                        </td>
                        <td data-label="Ubigeo">{iTMercaOUT.ubigeo}</td>
                        <td data-label="Cantidad" class="comoNumeroLeft" style={props.codigoMercaderia === iTMercaOUT.codigo ? { color: 'purple' } : {}}>
                          <strong>
                            {iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                              ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                              : iTMercaOUT.cantidadSacadaEquivalencia}
                          </strong>
                        </td>
                        <td data-label="Uni">{iTMercaOUT.unidadEquivalencia}</td>
                        <td data-label="Costo Unit PEN" class="comoNumeroLeft">
                          {formatear_6Decimales(
                            iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                              ? iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                              : iTMercaOUT.costoUnitarioEquivalenciaPEN
                          )}
                        </td>
                        <td data-label="SubTotal PEN" class="comoNumeroLeft">
                          {formatear_6Decimales(
                            (iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                              ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                              : iTMercaOUT.cantidadSacadaEquivalencia) *
                              (iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                ? iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                : iTMercaOUT.costoUnitarioEquivalenciaPEN)
                          )}
                          {/* {iTMercaOUT.subEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN)} */}
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
