import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_IN_ALMACEN } from '~/routes/(inventario)/inAlmacen';
import { parametrosGlobales } from '~/routes/login';
// import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { cerosALaIzquierda, formatear_6Decimales, formatoDDMMYYYY_PEN, redondeo2Decimales } from '~/functions/comunes';
import { CTX_KARDEX } from '../kardex/kardex';

// export default component$((props: { indexItem?: number }) => {
// export default component$((props: { contexto: string; indexItem?: number }) => {
export default component$((props: { inSelecci: any; contexto: string; indexItem?: number; codigoMercaderia?: string }) => {
  //#region CONTEXTO
  let ctx: any;
  switch (props.contexto) {
    case 'index_in_almacen':
      ctx = useContext(CTX_INDEX_IN_ALMACEN);
      break;

    case 'kardex':
      ctx = useContext(CTX_KARDEX);
      break;
  }
  //#endregion CONTEXTO

  //#region INICIALIZCION
  let suma_SubPEN = 0;
  let suma_IGVPEN = 0;
  let suma_TotPEN = 0;

  let suma_SubUSD = 0;
  let suma_IGVUSD = 0;
  let suma_TotUSD = 0;
  //#endregion INICIALIZCION
  console.log('💥💥💥💥💥💥💥💥💥💥💥');

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(320px, 100%, 1112px)',
        background: `${props.inSelecci.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
        // width: 'auto',
        padding: '2px',
        // background: '#eee',
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
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.inSelecci', props.inSelecci);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelVerInAlmacen = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3 style={{ fontSize: '0.8rem' }}>
          In almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE IN ALMACÉN */}
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
                value={props.inSelecci._id}
              />
              {/* USUARIO */}
              <input
                id="in_USUARIO_CREA"
                style={{ width: '100%' }}
                type="text"
                // autoFocus
                disabled
                value={props.inSelecci.usuarioCrea + '; ' + props.inSelecci.createdAt}
              />
            </div>
            <div class="linea_1_111">
              {/* FISMA  serie numero*/}
              <input
                id="in_FISMA"
                type="text"
                disabled={props.inSelecci._id !== ''}
                style={{ width: '100%' }}
                value={formatoDDMMYYYY_PEN(props.inSelecci.FISMA)}
              />
              <input
                id="in_Serie_Numero"
                type="text"
                disabled={props.inSelecci._id !== ''}
                style={{ width: '100%' }}
                value={(props.inSelecci.serie ? props.inSelecci.serie : '') + ' - ' + cerosALaIzquierda(props.inSelecci.numero ? props.inSelecci.numero : 0, 8)}
                // value={cerosALaIzquierda(props.inSelecci.numero, 8)}
              />
              {/* motivo de ingreso */}
              <input id="in_Motivo" type="text" disabled={props.inSelecci._id !== ''} style={{ width: '100%' }} value={props.inSelecci.motivoIngresoAlmacen} />
            </div>
            {/* obesrvacion */}
            <input
              id="in_Observacion"
              style={{ background: '#F4FF7A', width: '100%' }}
              type="text"
              // autoFocus
              disabled
              value={props.inSelecci.observacion}
            />
          </div>
          <br />
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL REMITENTE */}
          <div class="linea_1_111">
            {/* tipo de documento identidad REMITENTE*/}
            <input
              id="in_FISMA"
              type="text"
              disabled={props.inSelecci._id !== ''}
              style={{ width: '100%', backgroundColor: '#c0f0f0' }}
              value={props.inSelecci.tipoDocumentoIdentidad}
            />
            {/* numero identidad REMITENTE / RUC / DNI */}
            <input
              id="in_NumeroDocumentoIdentidad_REMITENTE"
              style={{ width: '100%' }}
              type="text"
              disabled={props.inSelecci._id !== ''}
              placeholder="Add número identidad remitente"
              value={props.inSelecci.numeroIdentidad}
            />
            {/* Razon Social / Nombre - REMITENTE*/}
            <input
              id="in_Nombre_REMITENTE"
              style={{ width: '100%' }}
              type="text"
              disabled={props.inSelecci._id !== ''}
              placeholder="Razón social / Nombre - remitente"
              value={props.inSelecci.razonSocialNombre}
            />
          </div>
          <br />
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div class="linea_1_11">
            {/* IGV */}
            <input type="text" id="in_IGV" style={{ width: '100%' }} disabled value={props.inSelecci.elIgv.$numberDecimal + ' %'} />

            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
                <input type="checkbox" id="chbx_TipoCambio_IN_ALMACEN" checked={props.inSelecci.enDolares} disabled />
                <label for="chbx_TipoCambio_IN_ALMACEN" style={{ marginRight: '4px' }}>
                  USD
                </label>
              </div>
              {typeof props.inSelecci.tipoCambio === 'undefined' ? (
                ''
              ) : (
                <input
                  id="inputTipoCambio_IN_ALMACEN"
                  type="text"
                  value={
                    props.inSelecci.tipoCambio.$numberDecimal
                      ? props.inSelecci.tipoCambio.$numberDecimal
                      : props.inSelecci.tipoCambio +
                        '  ' +
                        (props.inSelecci.documentosAdjuntos.length > 0 ? '(' + formatoDDMMYYYY_PEN(props.inSelecci.documentosAdjuntos[0].fecha) + ')' : '')
                  }
                  disabled
                  style={{ width: '100%' }}
                />
              )}
            </div>
          </div>
          <br />
          {/* ----------------------------------------------------- */}
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DE LOS DOCUMENTOS ADJUNTOS */}
        <div style={props.inSelecci.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO' ? { display: 'none' } : ''}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {props.inSelecci.documentosAdjuntos.length > 0 ? (
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
                  {props.inSelecci.documentosAdjuntos.map((iTDocAdj: any) => {
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
        {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
        <div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BOTON / TABLA -  MERCADERIAS  IN */}
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
            {props.inSelecci.itemsMercaderias.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    <th>idMerca</th>
                    {/* <th>Código</th> */}
                    <th>Descripción</th>
                    <th>IGV</th>
                    <th>Ubi</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>{props.inSelecci.enDolares ? 'CostoUniUSD' : 'CostoUniPEN'}</th>
                    <th>{props.inSelecci.enDolares ? 'SubUSD' : 'SubPEN'}</th>
                    <th>{props.inSelecci.enDolares ? 'ValorUniUSD' : 'ValorUniPEN'}</th>
                    <th>{props.inSelecci.enDolares ? 'TotUSD' : 'TotPEN'}</th>
                  </tr>
                </thead>
                <tbody>
                  {props.inSelecci.itemsMercaderias.map((iTMercaIN: any, index: number) => {
                    // console.log('DIMMMMMMMMMMMM');
                    const indexItemMercaIN = index + 1;

                    /////****** PEN
                    suma_SubPEN = suma_SubPEN + redondeo2Decimales(iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN);

                    suma_TotPEN = suma_TotPEN + redondeo2Decimales(iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN);

                    suma_IGVPEN = suma_TotPEN - suma_SubPEN;

                    ///******USD
                    if (typeof iTMercaIN.subUSD !== 'undefined') {
                      // console.log('iTMercaIN.subUSD', iTMercaIN.subUSD);
                      suma_SubUSD = suma_SubUSD + redondeo2Decimales(iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD);

                      suma_TotUSD = suma_TotUSD + redondeo2Decimales(iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD);

                      suma_IGVUSD = suma_TotUSD - suma_SubUSD;
                    } else {
                      // console.log('iTMercaIN.subUSD ==>> undefined');
                    }

                    return (
                      <tr key={iTMercaIN.idAuxiliar}>
                        <td
                          data-label="Ítem"
                          key={iTMercaIN.idAuxiliar}
                          style={props.codigoMercaderia === iTMercaIN.codigo ? { color: 'purple' } : {}}
                        >{`${cerosALaIzquierda(indexItemMercaIN, 3)}`}</td>
                        <td data-label="Kx" style={props.codigoMercaderia === iTMercaIN.codigo ? { color: 'purple' } : {}}>
                          {typeof iTMercaIN.idKardex !== 'undefined' ? iTMercaIN.idKardex.substring(iTMercaIN.idKardex.length - 6) : '-'}
                        </td>
                        <td data-label="idMerca">{iTMercaIN.idMercaderia}</td>
                        {/* <td data-label="Código" style={props.codigoMercaderia === iTMercaIN.codigo ? { color: 'purple' } : {}}>
                          {iTMercaIN.codigo}
                        </td> */}
                        <td data-label="Descripción" style={props.codigoMercaderia === iTMercaIN.codigo ? { color: 'purple' } : {}}>
                          <strong>{!props.inSelecci.reingreso ? iTMercaIN.descripcion : iTMercaIN.descripcionEquivalencia}</strong>
                        </td>
                        <td data-label="IGV">{iTMercaIN.IGV.$numberDecimal ? iTMercaIN.IGV.$numberDecimal : iTMercaIN.IGV} %</td>
                        <td data-label="Ubi" class="comoNumeroLeft">
                          {iTMercaIN.ubigeo}
                        </td>
                        <td data-label="Cantidad" style={props.codigoMercaderia === iTMercaIN.codigo ? { color: 'purple' } : {}}>
                          <strong>
                            {!props.inSelecci.reingreso
                              ? iTMercaIN.cantidadIngresada.$numberDecimal
                                ? iTMercaIN.cantidadIngresada.$numberDecimal
                                : iTMercaIN.cantidadIngresada
                              : iTMercaIN.cantidadIngresadaEquivalencia.$numberDecimal
                              ? iTMercaIN.cantidadIngresadaEquivalencia.$numberDecimal
                              : iTMercaIN.cantidadIngresadaEquivalencia}
                          </strong>
                        </td>
                        <td data-label="Uni">{!props.inSelecci.reingreso ? iTMercaIN.unidad : iTMercaIN.unidadEquivalencia}</td>
                        <td data-label={props.inSelecci.enDolares ? 'CostoUniUSD' : 'CostoUniPEN'}>
                          {props.inSelecci.enDolares
                            ? formatear_6Decimales(
                                !props.inSelecci.reingreso
                                  ? iTMercaIN.costoUnitarioUSD.$numberDecimal
                                    ? iTMercaIN.costoUnitarioUSD.$numberDecimal
                                    : iTMercaIN.costoUnitarioUSD
                                  : iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal
                                  ? iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal
                                  : iTMercaIN.costoUnitarioEquivalenciaUSD
                              )
                            : formatear_6Decimales(
                                !props.inSelecci.reingreso
                                  ? iTMercaIN.costoUnitarioPEN.$numberDecimal
                                    ? iTMercaIN.costoUnitarioPEN.$numberDecimal
                                    : iTMercaIN.costoUnitarioPEN
                                  : iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  ? iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  : iTMercaIN.costoUnitarioEquivalenciaPEN
                              )}
                        </td>
                        <td data-label={props.inSelecci.enDolares ? 'SubUSD' : 'SubPEN'}>
                          {props.inSelecci.enDolares
                            ? !props.inSelecci.reingreso
                              ? iTMercaIN.subUSD.$numberDecimal
                                ? formatear_6Decimales(iTMercaIN.subUSD.$numberDecimal)
                                : formatear_6Decimales(iTMercaIN.subUSD)
                              : iTMercaIN.subEquivalenciaUSD.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.subEquivalenciaUSD.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.subEquivalenciaUSD)
                            : !props.inSelecci.reingreso
                            ? iTMercaIN.subPEN.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.subPEN.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.subPEN)
                            : iTMercaIN.subEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaIN.subEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaIN.subEquivalenciaPEN)}
                        </td>
                        <td data-label={props.inSelecci.enDolares ? 'ValorUniUSD' : 'ValorUniPEN'}>
                          {props.inSelecci.enDolares
                            ? formatear_6Decimales(
                                !props.inSelecci.reingreso
                                  ? iTMercaIN.valorUnitarioUSD.$numberDecimal
                                    ? iTMercaIN.valorUnitarioUSD.$numberDecimal
                                    : iTMercaIN.valorUnitarioUSD
                                  : iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal
                                  ? iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal
                                  : iTMercaIN.valorUnitarioEquivalenciaUSD
                              )
                            : formatear_6Decimales(
                                !props.inSelecci.reingreso
                                  ? iTMercaIN.valorUnitarioPEN.$numberDecimal
                                    ? iTMercaIN.valorUnitarioPEN.$numberDecimal
                                    : iTMercaIN.valorUnitarioPEN
                                  : iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal
                                  ? iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal
                                  : iTMercaIN.valorUnitarioEquivalenciaPEN
                              )}
                        </td>
                        <td data-label={props.inSelecci.enDolares ? 'TotUSD' : 'TotPEN'}>
                          {props.inSelecci.enDolares
                            ? !props.inSelecci.reingreso
                              ? iTMercaIN.totUSD.$numberDecimal
                                ? formatear_6Decimales(iTMercaIN.totUSD.$numberDecimal)
                                : formatear_6Decimales(iTMercaIN.totUSD)
                              : iTMercaIN.totEquivalenciaUSD.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.totEquivalenciaUSD.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.totEquivalenciaUSD)
                            : !props.inSelecci.reingreso
                            ? iTMercaIN.totPEN.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.totPEN.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.totPEN)
                            : iTMercaIN.totEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaIN.totEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaIN.totEquivalenciaPEN)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        props.inSelecci.enDolares
                          ? suma_SubUSD.toLocaleString('en-US', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_SubPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        props.inSelecci.enDolares
                          ? suma_IGVUSD.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_IGVPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        props.inSelecci.enDolares
                          ? suma_TotUSD.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_TotPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Sub Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      IGV {props.inSelecci.enDolares ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Total {props.inSelecci.enDolares ? 'USD' : 'PEN'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen mercaderías registradas</i>
            )}
          </div>
          <br />
        </div>
      </div>
    </div>
  );
});
