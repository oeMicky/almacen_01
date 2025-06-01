import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import type { INotaVenta } from '~/interfaces/iVenta';
import { cerosALaIzquierda, formatear_2Decimales, formatoDDMMYYYY_PEN, literal, redondeo2Decimales, redondeo6Decimales } from '~/functions/comunes';
import { CTX_INDEX_NOTA_VENTA } from '~/routes/(ventas)/notaVenta';
import { CTX_INDEX_GESTION_NOTA_VENTA_CREDITO } from '~/routes/(ventas)/gestionNotaVentaCredito';

export default component$((props: { nvSelecci: any; contexto: string }) => {
  //#region DEFINICION CTX_NOTA_VENTA
  const definicion_CTX_NOTA_VENTA = useStore<INotaVenta>(
    {
      _id: props.nvSelecci._id ? props.nvSelecci._id : '',
      idGrupoEmpresarial: props.nvSelecci.idGrupoEmpresarial ? props.nvSelecci.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.nvSelecci.idEmpresa ? props.nvSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idAlmacen: props.nvSelecci.idAlmacen ? props.nvSelecci.idAlmacen : parametrosGlobales.idAlmacen,
      idSucursal: props.nvSelecci.idSucursal ? props.nvSelecci.idSucursal : parametrosGlobales.idSucursal,
      sucursal: props.nvSelecci.sucursal ? props.nvSelecci.sucursal : parametrosGlobales.sucursal,
      sucursalDireccion: props.nvSelecci.sucursalDireccion ? props.nvSelecci.sucursalDireccion : parametrosGlobales.sucursalDireccion,
      idPeriodo: props.nvSelecci.idPeriodo, //? props.nvSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.nvSelecci.periodo, // ? props.nvSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.nvSelecci.ruc ? props.nvSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.nvSelecci.empresa ? props.nvSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.nvSelecci.direccion ? props.nvSelecci.direccion : parametrosGlobales.Direccion,
      departamento: props.nvSelecci.departamento
        ? props.nvSelecci.departamento
        : typeof parametrosGlobales.departamento === 'undefined'
        ? ''
        : parametrosGlobales.departamento,
      provincia: props.nvSelecci.provincia
        ? props.nvSelecci.provincia
        : typeof parametrosGlobales.provincia === 'undefined'
        ? ''
        : parametrosGlobales.provincia,
      distrito: props.nvSelecci.distrito ? props.nvSelecci.distrito : typeof parametrosGlobales.distrito === 'undefined' ? '' : parametrosGlobales.distrito,
      ubigeo: props.nvSelecci.ubigeo ? props.nvSelecci.ubigeo : typeof parametrosGlobales.ubigeo === 'undefined' ? '' : parametrosGlobales.ubigeo,

      // codigoTipoOperacion: '',
      // tipoOperacion: '',
      idSerieNotaSalida: props.nvSelecci.idSerieNotaSalida ? props.nvSelecci.idSerieNotaSalida : parametrosGlobales.idSerieNotaSalida,
      serieNotaSalida: props.nvSelecci.serie ? props.nvSelecci.serie : parametrosGlobales.serieNotaSalida,

      // codigoTipoComprobantePago: '',
      // tipoComprobantePago: '',
      idSerieNotaVenta: props.nvSelecci.idSerieNotaVenta ? props.nvSelecci.idSerieNotaVenta : '',
      serie: props.nvSelecci.serie ? props.nvSelecci.serie : '',
      numero: props.nvSelecci.numero ? props.nvSelecci.numero : 0,
      fecha: props.nvSelecci.fecha, // ? props.nvSelecci.fecha.substring(0, 10) : hoy(), //'', //
      hora: props.nvSelecci.hora ? props.nvSelecci.hora : '',

      clienteVentasVarias: props.nvSelecci.clienteVentasVarias ? props.nvSelecci.clienteVentasVarias : false,
      estrellasCliente: props.nvSelecci.estrellasCliente ? props.nvSelecci.estrellasCliente : 0,
      // idCliente: '',
      // codigoTipoDocumentoIdentidad: '6',
      // tipoDocumentoIdentidad: 'RUC',
      // numeroIdentidad: '',
      // razonSocialNombre: '',
      // direccionCliente: '',
      // email: '',
      // telefono: '',
      // actualizarEmailCliente: false,

      igv: props.nvSelecci.igv, // ? props.nvSelecci.igv : props.igv,
      enDolares: props.nvSelecci.enDolares ? props.nvSelecci.enDolares : false,
      moneda: props.nvSelecci.moneda ? props.nvSelecci.moneda : 'PEN',
      tipoCambio: props.nvSelecci.tipoCambio ? props.nvSelecci.tipoCambio : 0,

      vendedor: props.nvSelecci.vendedor ? props.nvSelecci.vendedor : '',
      metodoPago: props.nvSelecci.metodoPago ? props.nvSelecci.metodoPago : 'CONTADO',

      todoEnEfectivo: props.nvSelecci.todoEnEfectivo ? props.nvSelecci.todoEnEfectivo : true,
      unaParteEnEfectivo: props.nvSelecci.unaParteEnEfectivo ? props.nvSelecci.unaParteEnEfectivo : false,
      montoEnEfectivo: props.nvSelecci.montoEnEfectivo ? props.nvSelecci.montoEnEfectivo : '',
      otroMedioPago: props.nvSelecci.otroMedioPago ? props.nvSelecci.otroMedioPago : 'TRANSF. DE FONDOS - YAPE',
      montoOtroMedioPago: props.nvSelecci.montoOtroMedioPago ? props.nvSelecci.montoOtroMedioPago : '',
      //**** CUOTAS */
      verCuotasCredito: props.nvSelecci.verCuotasCredito ? props.nvSelecci.verCuotasCredito : false,
      cuotasCredito: props.nvSelecci.cuotasCredito ? props.nvSelecci.cuotasCredito : [],
      importeTotalCuotasCredito: props.nvSelecci.importeTotalCuotasCredito ? props.nvSelecci.importeTotalCuotasCreditoid : 0,

      idCotizacion: props.nvSelecci.idCotizacion ? props.nvSelecci.idCotizacion : '',
      serieCotizacion: props.nvSelecci.serieCotizacion ? props.nvSelecci.serieCotizacion : '',
      numeroCotizacion: props.nvSelecci.numeroCotizacion ? props.nvSelecci.numeroCotizacion : 0,

      idOrdenServicio: props.nvSelecci.idOrdenServicio ? props.nvSelecci.idOrdenServicio : '',
      serieOrdenServicio: props.nvSelecci.serieOrdenServicio ? props.nvSelecci.serieOrdenServicio : '',
      numeroOrdenServicio: props.nvSelecci.numeroOrdenServicio ? props.nvSelecci.numeroOrdenServicio : 0,

      observacion: props.nvSelecci.observacion ? props.nvSelecci.observacion : '',

      idMotivoEgresoAlmacen: parametrosGlobales.idMotivosSalidaDelAlmacen_NV,

      // impresionTipoFacturaBoleta: false,
      itemsNotaVenta: props.nvSelecci.itemsNotaVenta ? props.nvSelecci.itemsNotaVenta : [],

      baseImponiblePEN: props.nvSelecci.baseImponiblePEN ? props.nvSelecci.baseImponiblePEN : 0,
      igvPEN: props.nvSelecci.igvPEN ? props.nvSelecci.igvPEN : 0,
      exoneradoPEN: props.nvSelecci.exoneradoPEN ? props.nvSelecci.exoneradoPEN : 0,
      inafectoPEN: props.nvSelecci.inafectoPEN ? props.nvSelecci.inafectoPEN : 0,
      iscPEN: props.nvSelecci.iscPEN ? props.nvSelecci.iscPEN : 0,
      exportPEN: props.nvSelecci.exportPEN ? props.nvSelecci.exportPEN : 0,
      otrosPEN: props.nvSelecci.otrosPEN ? props.nvSelecci.otrosPEN : 0,
      totalPEN: props.nvSelecci.totalPEN ? props.nvSelecci.totalPEN : 0,

      baseImponibleUSD: props.nvSelecci.baseImponibleUSD ? props.nvSelecci.baseImponibleUSD : 0,
      igvUSD: props.nvSelecci.igvUSD ? props.nvSelecci.igvUSD : 0,
      exoneradoUSD: props.nvSelecci.exoneradoUSD ? props.nvSelecci.exoneradoUSD : 0,
      inafectoUSD: props.nvSelecci.inafectoUSD ? props.nvSelecci.inafectoUSD : 0,
      iscUSD: props.nvSelecci.iscUSD ? props.nvSelecci.iscUSD : 0,
      exportUSD: props.nvSelecci.exportUSD ? props.nvSelecci.exportUSD : 0,
      otrosUSD: props.nvSelecci.otrosUSD ? props.nvSelecci.otrosUSD : 0,
      totalUSD: props.nvSelecci.totalUSD ? props.nvSelecci.totalUSD : 0,

      lite: props.nvSelecci.literal ? props.nvSelecci.literal : '',

      efectivoIngresado: props.nvSelecci.efectivoIngresado ? props.nvSelecci.efectivoIngresado : 0,
      vuelto: props.nvSelecci.vuelto ? props.nvSelecci.vuelto : 0,

      // referenciaCodigo: '', //Codigo del motivo
      // referenciaDescripcion: '', //Descripción del motivo
      // referenciaFecha: '',
      // referenciaTipo: '', //TCP
      // referenciaSerie: '',
      // referenciaNumero: 0,

      // props.nvSelecci._id ? props.nvSelecci._id :

      clienteSobrenombreChapa: props.nvSelecci.clienteSobrenombreChapa ? props.nvSelecci.clienteSobrenombreChapa : '',
      placa: props.nvSelecci.placa ? props.nvSelecci.placa : '',
      kilometraje: props.nvSelecci.kilometraje ? props.nvSelecci.kilometraje : '',
      checkACuenta: props.nvSelecci.checkACuenta ? props.nvSelecci.checkACuenta : false,
      aCuenta: props.nvSelecci.aCuenta ? props.nvSelecci.aCuenta : '',

      verificarObservacionVenta: props.nvSelecci.verificarObservacionVenta
        ? props.nvSelecci.verificarObservacionVenta
        : parametrosGlobales.verificarObservacionVenta,

      // json: '',

      contabilizarOperaciones: props.nvSelecci.contabilizarOperaciones ? props.nvSelecci.contabilizarOperaciones : parametrosGlobales.contabilizarOperaciones,
      asientoContable: props.nvSelecci.asientoContable ? props.nvSelecci.asientoContable : [],
      totalDebePEN: props.nvSelecci.totalDebePEN ? props.nvSelecci.totalDebePEN : -1,
      totalHaberPEN: props.nvSelecci.totalHaberPEN ? props.nvSelecci.totalHaberPEN : 0,
      totalDebeUSD: props.nvSelecci.totalDebeUSD ? props.nvSelecci.totalDebeUSD : -1,
      totalHaberUSD: props.nvSelecci.totalHaberUSD ? props.nvSelecci.totalHaberUSD : 0,

      ganancias: props.nvSelecci.ganancias ? props.nvSelecci.ganancias : 0,

      // ventaConDetraccion: parametrosGlobales.ventaConDetraccion,
      // detraccion: false,
      // detraccionCodigo: '',
      // detraccionDescripcion: '',
      // detraccionMedioPagoCodigo: '',
      // detraccionMedioPagoDescripcion: '',
      // detraccionMontoPEN: 0,
      // detraccionNumCuentaBancoNacion: parametrosGlobales.cuentaBancariaDetraccion,
      // detraccionPorcentaje: 0,
      // detraccionConstancia: '',
      // detraccionFecha: hoy(),
    }
    // { deep: true }
  );
  //   useContextProvider(CTX_NOTA_VENTA, definicion_CTX_NOTA_VENTA);
  //#endregion DEFINICION CTX_NOTA_VENTA

  //#region CONTEXTOS
  let ctx: any;
  switch (props.contexto) {
    case 'index_nota_venta':
      ctx = useContext(CTX_INDEX_NOTA_VENTA);
      break;
    case 'index_gestion_nota_venta_credito':
      ctx = useContext(CTX_INDEX_GESTION_NOTA_VENTA_CREDITO);
      break;
  }
  //   const ctx_index_nota_venta = useContext(CTX_INDEX_NOTA_VENTA);
  // ctx_index_nota_venta.mostrarSpinner = false;
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const verParametrosAdicionales_Items = useSignal(true);

  let sumaCuotas = 0;

  let sumaTOTAL_BI = 0;
  let sumaTOTAL_IGV = 0;
  let sumaTOTAL_EXO = 0;
  let sumaTOTAL_INAFEC = 0;
  let sumaTOTAL_ISC = 0;
  let sumaTOTAL_EXPORT = 0;
  let sumaTOTAL_OTROS = 0;

  let sumaTOTAL = 0;

  //#endregion INICIALIZACION

  //#region ITEMS NOTA VENTA
  const fijarMontos = $((e: any) => {
    //console.log('fijarMontos........');
    if (definicion_CTX_NOTA_VENTA.enDolares) {
      // definicion_CTX_NOTA_VENTA.baseImponibleUSD = e.subTOTAL;
      // definicion_CTX_NOTA_VENTA.igvUSD = e.igvTOTAL;
      // definicion_CTX_NOTA_VENTA.totalUSD = e.sumaTOTAL_IGV + e.sumaTOTAL_EXO + e.sumaTOTAL_INAFEC;
      // const tt = redondeo2Decimales(e.sumaTOTAL * definicion_CTX_NOTA_VENTA.tipoCambio);
      // const sub = redondeo2Decimales((tt * 100) / (100 + definicion_CTX_NOTA_VENTA.igv));
      // const i = redondeo2Decimales(tt - sub);
      // definicion_CTX_NOTA_VENTA.baseImponiblePEN = sub;
      // definicion_CTX_NOTA_VENTA.igvPEN = i;
      // definicion_CTX_NOTA_VENTA.totalPEN = tt;
    } else {
      definicion_CTX_NOTA_VENTA.baseImponiblePEN = e.sumaTOTAL_BI;
      definicion_CTX_NOTA_VENTA.exoneradoPEN = e.sumaTOTAL_EXO;
      definicion_CTX_NOTA_VENTA.inafectoPEN = e.sumaTOTAL_INAFEC;
      definicion_CTX_NOTA_VENTA.iscPEN = e.sumaTOTAL_ISC;
      definicion_CTX_NOTA_VENTA.exportPEN = e.sumaTOTAL_EXPORT;
      definicion_CTX_NOTA_VENTA.otrosPEN = e.sumaTOTAL_OTROS;
      definicion_CTX_NOTA_VENTA.igvPEN = e.sumaTOTAL_IGV;
      definicion_CTX_NOTA_VENTA.totalPEN = e.sumaTOTAL;

      definicion_CTX_NOTA_VENTA.baseImponibleUSD = 0;
      definicion_CTX_NOTA_VENTA.exoneradoUSD = 0;
      definicion_CTX_NOTA_VENTA.inafectoUSD = 0;
      definicion_CTX_NOTA_VENTA.iscUSD = 0;
      definicion_CTX_NOTA_VENTA.exportUSD = 0;
      definicion_CTX_NOTA_VENTA.otrosUSD = 0;
      definicion_CTX_NOTA_VENTA.igvUSD = 0;
      definicion_CTX_NOTA_VENTA.totalUSD = 0;
    }
    //console.log('fijando........', definicion_CTX_NOTA_VENTA.moneda, definicion_CTX_NOTA_VENTA.totalPEN, definicion_CTX_NOTA_VENTA.totalUSD);
    definicion_CTX_NOTA_VENTA.lite = '';
    if (definicion_CTX_NOTA_VENTA.moneda === 'PEN') {
      definicion_CTX_NOTA_VENTA.lite = literal(definicion_CTX_NOTA_VENTA.totalPEN, definicion_CTX_NOTA_VENTA.moneda);
      definicion_CTX_NOTA_VENTA.vuelto = redondeo2Decimales(
        (definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
          ? definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
          : definicion_CTX_NOTA_VENTA.efectivoIngresado) -
          (definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal ? definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal : definicion_CTX_NOTA_VENTA.totalPEN)
      );
    } else {
      definicion_CTX_NOTA_VENTA.lite = literal(definicion_CTX_NOTA_VENTA.totalUSD, definicion_CTX_NOTA_VENTA.moneda);
    }
  });
  //#endregion ITEMS NOTA VENTA

  //#region ACTUALIZAR IMPORTE TOTAL CUOTAS
  const fijarImporteTotalCuotasCredito = $((e: any) => {
    definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito = e;
  });
  //#region ACTUALIZAR IMPORTE TOTAL CUOTAS

  return (
    <div
      class="container-modal"
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(320px, 100%, 1000px)',
        // width: 'auto',
        // background: `${definicion_CTX_NOTA_VENTA.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
        border: '3px solid purple',
        padding: '0',
      }}
    >
      {/* BOTONES DEL MARCO    */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid blue',
          background: 'linear-gradient(to bottom, #901090 0%, #eee 100%)',
          width: 'auto',
        }}
      >
        <ImgButton
          title="Cerrar el formulario"
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            console.log(definicion_CTX_NOTA_VENTA);
          })}
        />
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            ctx.mostrarPanelVerNotaVenta = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Nota de venta - {parametrosGlobales.sucursal} - {parametrosGlobales.RazonSocial}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PERIODO */}
          <div style={{ display: 'none' }}>
            {/* PERIODO */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Periodo"
                  style={{ width: '100%' }}
                  type="number"
                  // autoFocus
                  disabled
                  // placeholder="Add año DUA o DSI"
                  value={definicion_CTX_NOTA_VENTA.periodo}
                />
              </div>
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {/* cliente VENTAS VARIAS*/}

              <div>
                <input
                  title="Cliente Ventas Varias"
                  id="chk_clienteVentasVarias_VENTA"
                  type="checkbox"
                  style={{ margin: '2px' }}
                  disabled
                  checked
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('btn_PlanContableOrigen_GRUPO_EMPRESARIAL')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="chk_clienteVentasVarias_VENTA" style={{ marginLeft: '2px' }}>
                  Cliente Ventas Varias
                </label>
              </div>
              {parametrosGlobales.almacenActivo ? (
                <label style={{ textAlign: 'right', color: 'green' }}>ALMACÉN ACTIVO</label>
              ) : (
                <strong style={{ textAlign: 'right', color: 'red' }}>ALMACÉN INACTIVO</strong>
              )}
            </div>

            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE NOTA VENTA */}
          <div>
            <div class="linea_1_1111">
              {/* fecha    */}
              <input
                disabled
                id="in_Fecha_Para_NotaVenta"
                type="text"
                style={{ width: '100%' }}
                // disabled

                value={
                  definicion_CTX_NOTA_VENTA.fecha.substring(8, 10) +
                  '/' +
                  definicion_CTX_NOTA_VENTA.fecha.substring(5, 7) +
                  '/' +
                  definicion_CTX_NOTA_VENTA.fecha.substring(0, 4)
                }
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('selectSerieVenta') as HTMLSelectElement).focus();
                  }
                }}
              />
              {/* Serie  */}
              <input
                disabled
                value={definicion_CTX_NOTA_VENTA.serie + `-` + cerosALaIzquierda(definicion_CTX_NOTA_VENTA.numero, 8)}
                style={{ width: '100%' }}
              />
              {/* IGV */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* <strong style={{ fontSize: '0.9rem', fontWeight: '400', paddingLeft: '4px', paddingRight: '24px' }}>IGV</strong> */}
                {/* style={{ paddingLeft: '4px', paddingRight: '12px' }} */}
                <label style={{ paddingRight: '4px' }}>IGV</label>
                <input
                  type="text"
                  id="inputIGV"
                  disabled
                  value={definicion_CTX_NOTA_VENTA.igv.$numberDecimal + ' %'}
                  style={{ width: '100%' }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).focus();
                    }
                  }}
                />
              </div>
              {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', paddingRight: '4px' }}>
                  <input type="checkbox" id="chbx_TipoCambio_Para_Venta" disabled />
                  <label for="chbx_TipoCambio_Para_Venta" style={{ paddingTop: '2px' }}>
                    USD
                  </label>
                </div>

                <input id="inputTipoCambio" type="number" value={definicion_CTX_NOTA_VENTA.tipoCambio} disabled style={{ width: '100%' }} />
              </div>
            </div>

            <br />
          </div>

          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', backgroundColor: '#74a6ab' }}>
              {/* //ver ALMACEN OUT */}
              <button id="btnVerAlmacen" hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true} disabled style={{ cursor: 'pointer', height: '40px' }}>
                VER ALMACÉN
              </button>
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div>
              {definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0 ? (
                <>
                  <div>
                    <label style={{ marginLeft: '2px', marginRight: '8px' }}>Leyenda:</label>
                    <label style={{ background: '#ff5aff', padding: '2px 4px', borderRadius: '4px' }}>No facturable</label>
                  </div>
                  <br />
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th style={{ display: 'none' }}>Código</th>
                        <th>Descripción</th>
                        <th>Ubigeo</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Uni</th>
                        <th>Precio Uni</th>
                        <th>Venta</th>
                        <th hidden={verParametrosAdicionales_Items.value}>%</th>
                        <th hidden={verParametrosAdicionales_Items.value}>Imp</th>
                        <th hidden={verParametrosAdicionales_Items.value}>Afec</th>
                        <th>Acc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_NOTA_VENTA.itemsNotaVenta.map((iTNotVen: any, index: number) => {
                        // console.log('🥽🥽🥽🧨');

                        const indexItemVenta = index + 1;
                        let t_bi = 0;
                        let t_igv = 0;
                        let t_exo = 0;
                        let t_ina = 0;
                        const t_isc = 0;
                        let t_export = 0;
                        let t_otros = 0;

                        //console.log('iTVen.tipoImpuesto[1]', iTVen.tipoImpuesto[1].toString());
                        //IGV, ISC, IVAP, exoneradas, exportación, gratuitas, inafecta, otrosTributos
                        //['1000', 'IGV', 'VAT']  ['1016', 'IVAP', 'VAT']  ['2000', 'ISC', 'EXC']  ['7152', 'ICBPER', 'OTH']  ['9995', 'EXP', 'FRE']
                        //['9996', 'GRA', 'FRE']  ['9997', 'EXO', 'VAT']  ['9998', 'INA', 'FRE']  ['9999', 'OTROS', 'OTH']

                        if (definicion_CTX_NOTA_VENTA.enDolares) {
                          // console.log('enDolares$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                          if (iTNotVen.tipoImpuesto === 'IGV') {
                            const vv = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                            t_bi = redondeo6Decimales((vv * 100) / (100 + iTNotVen.porcentaje));
                            t_igv = redondeo6Decimales(vv - t_bi);
                          }
                          // if (iTVen.tipoImpuesto === 'ISC') {
                          // }
                          // if (iTVen.tipoImpuesto === 'IVAP') {
                          // }
                          if (iTNotVen.tipoImpuesto === 'EXO') {
                            t_exo = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'EXP') {
                            t_export = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'GRA') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'INA') {
                            t_ina = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'OTROS') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                        } else {
                          // if (iTVen.tipoImpuesto === 'IGV') {
                          // console.log('PENPENPENPENPENPENPEmn', iTNotVen.tipoImpuesto);
                          if (iTNotVen.tipoImpuesto === 'IGV') {
                            // console.log('🎈', iTNotVen.ventaPEN, iTNotVen.porcentaje);
                            //console.log('iTVen.ventaPEN:::', iTVen.ventaPEN);
                            const vv = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                            //console.log('vv', vv);
                            //console.log('iTVen.porcentaje', iTVen.porcentaje);
                            t_bi = redondeo6Decimales((vv * 100) / (100 + iTNotVen.porcentaje));
                            t_igv = redondeo6Decimales(vv - t_bi);
                          }
                          // console.log('🥽');
                          // if (iTVen.tipoImpuesto === 'ISC') {
                          // }
                          // if (iTVen.tipoImpuesto === 'IVAP') {
                          // }
                          if (iTNotVen.tipoImpuesto.toString() === 'EXO') {
                            // console.log('🎈🎈', iTNotVen.ventaPEN);
                            t_exo = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          // console.log('🥽🥽');
                          if (iTNotVen.tipoImpuesto === 'EXP') {
                            t_export = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          // console.log('🥽🥽🥽');
                          if (iTNotVen.tipoImpuesto === 'GRA') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          if (iTNotVen.tipoImpuesto === 'INA') {
                            t_ina = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          if (iTNotVen.tipoImpuesto === 'OTROS') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                        }
                        // console.log('🧨🧨🧨');
                        sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_export + t_otros;
                        sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                        sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                        sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                        sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                        sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                        sumaTOTAL_EXPORT = sumaTOTAL_EXPORT + t_export;
                        sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;

                        // SOLO AL LLEGAR AL FINAL DE LA ITERACION SE FIJA LOS MONTOS
                        if (index + 1 === definicion_CTX_NOTA_VENTA.itemsNotaVenta.length && definicion_CTX_NOTA_VENTA._id === '') {
                          // console.log('🎗🎗🎗🎗🎗');

                          fijarMontos({
                            sumaTOTAL,
                            sumaTOTAL_BI,
                            sumaTOTAL_IGV,
                            sumaTOTAL_EXO,
                            sumaTOTAL_INAFEC,
                            sumaTOTAL_ISC,
                            sumaTOTAL_EXPORT,
                            sumaTOTAL_OTROS,
                          });
                        }

                        return (
                          <tr key={iTNotVen.idAuxiliar} style={iTNotVen.noFacturar ? { background: '#ff5aff' } : {}}>
                            <td data-label="Ítem" key={iTNotVen.idAuxiliar}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                            <td data-label="Código" class="comoCadena" style={{ display: 'none' }}>
                              {iTNotVen.codigo}
                            </td>
                            <td data-label="Descripción">
                              {/* {iTNotVen.tipo === 'OTRO' ? <img src={images.puntoVerde} alt="Punto verde" width="12" height="12" /> : ''} */}
                              {iTNotVen.tipo === 'OTRO' ? <img src={images.puntoAzul} alt="Punto verde" width="12" height="12" /> : ''}
                              {iTNotVen.descripcionEquivalencia}
                            </td>
                            <td data-label="Ubigeo" class="accionesLeft">
                              {iTNotVen.ubigeo ? iTNotVen.ubigeo : '-'}
                            </td>
                            <td data-label="Stock" style={{ color: 'purple', fontWeight: 'bold' }}>
                              {iTNotVen.stock ? iTNotVen.stock : '-'}
                            </td>
                            {/* ---------------------------------------------------textAlign: 'center'-- */}
                            {/* <td data-label="Cantidad" class="comoNumero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
                            {/* <td data-label="Cantidad" class="comoNumero" style={{ verticalAlign: 'middle', padding: '0' }}> */}
                            <td data-label="Cantidad" class="comoNumero">
                              <div style={{ display: 'flex' }}>
                                <input
                                  type="number"
                                  disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                  style={{ width: '60px', textAlign: 'end' }}
                                  value={
                                    iTNotVen.cantidadEquivalencia.$numberDecimal ? iTNotVen.cantidadEquivalencia.$numberDecimal : iTNotVen.cantidadEquivalencia
                                  }
                                />
                              </div>
                            </td>
                            <td data-label="Uni" class="accionesLeft">
                              {iTNotVen.unidadEquivalencia}
                            </td>
                            {/* ----------------------------------------------------- */}
                            <td data-label="Precio Uni" class="comoNumeroLeft">
                              <input
                                type="number"
                                disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                style={{ width: '60px', textAlign: 'end' }}
                                value={
                                  definicion_CTX_NOTA_VENTA.enDolares
                                    ? iTNotVen.precioUnitarioUSD.$numberDecimal
                                      ? iTNotVen.precioUnitarioUSD.$numberDecimal
                                      : iTNotVen.precioUnitarioUSD
                                    : iTNotVen.precioUnitarioPEN.$numberDecimal
                                    ? iTNotVen.precioUnitarioPEN.$numberDecimal
                                    : iTNotVen.precioUnitarioPEN
                                }
                              />
                            </td>
                            {/* -------------------------------- -------------------- */}
                            <td data-label="Venta" class="comoNumeroLeft">
                              {definicion_CTX_NOTA_VENTA.enDolares
                                ? iTNotVen.ventaUSD.$numberDecimal
                                  ? redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal)
                                  : redondeo6Decimales(iTNotVen.ventaUSD)
                                : iTNotVen.ventaPEN.$numberDecimal
                                ? redondeo2Decimales(iTNotVen.ventaPEN.$numberDecimal)
                                : redondeo2Decimales(iTNotVen.ventaPEN)}
                            </td>
                            <td data-label="%" class="acciones" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {iTNotVen.porcentaje.$numberDecimal ? iTNotVen.porcentaje.$numberDecimal : iTNotVen.porcentaje}
                            </td>
                            <td data-label="Imp" class="comoCadena" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {iTNotVen.tipoImpuesto}
                            </td>
                            <td data-label="Afec" class="acciones" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {iTNotVen.tipoAfectacionDelImpuesto}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                title="Eliminar ítem"
                                hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.trash}
                                alt="icono eliminar"
                                height={14}
                                width={14}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Base Imponible USD' : 'Base Imponible PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL_BI.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.baseImponiblePEN)}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'IGV USD' : 'IGV PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL_IGV.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.igvPEN)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Total USD' : 'Total PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800', background: 'yellow' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.totalPEN)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9} class="comoNumeroLeft" style={{ color: '#494641' }}>
                          {definicion_CTX_NOTA_VENTA.lite}
                        </td>
                      </tr>
                      <tr style={definicion_CTX_NOTA_VENTA.todoEnEfectivo ? {} : { display: 'none' }}>
                        <td colSpan={8} class="comoNumeroLeft" style={{ color: '#494641' }}>
                          <label style={{ marginRight: '4px' }}>{`Efectivo ingresado <-> Vuelto`}</label>
                          <input
                            title="Efectivo ingresado"
                            id="input_EfectivoIngresado_NOTAVENTA"
                            type="number"
                            disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                            size={12}
                            style={{ color: 'purple' }}
                            value={
                              definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                ? definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                : definicion_CTX_NOTA_VENTA.efectivoIngresado
                            }
                            onFocus$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            // onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true)}
                          />
                        </td>
                        <td colSpan={3}>
                          <input
                            title="Vuelto"
                            id="input_Vuelto_NOTAVENTA"
                            type="number"
                            size={12}
                            disabled
                            value={
                              definicion_CTX_NOTA_VENTA.vuelto.$numberDecimal
                                ? definicion_CTX_NOTA_VENTA.vuelto.$numberDecimal
                                : definicion_CTX_NOTA_VENTA.vuelto
                            }
                            style={{ color: 'purple', background: '#fefea8', display: 'flex' }}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              ) : (
                <i style={{ fontSize: '0.8rem' }}>No existen ítems para la nota de venta</i>
              )}
            </div>
          }
          <br />
          {/* ----------------------------------------------------- */}
          {/*  METODO DE PAGO */}
          <div>
            {definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0 ? (
              <>
                {/* <div class="form-control"> */}
                <div>
                  {/* <div class="form-control form-agrupado" style={{ display: 'flex', gap: '4px' }}> */}
                  <div class="linea_1_11" style={{ marginBottom: '8px' }}>
                    <input
                      //   title="Vuelto"
                      id="input_Metodo_NOTAVENTA"
                      type="text"
                      size={12}
                      disabled
                      //   value="dfsdCCC"
                      value={definicion_CTX_NOTA_VENTA.metodoPago}
                      style={{ background: 'orange' }}
                    />

                    {definicion_CTX_NOTA_VENTA.verCuotasCredito && (
                      <button disabled title="Adicionar cuota" id="addCuota" class="btn" style={{ width: '100%' }}>
                        Add cuota
                      </button>
                    )}
                  </div>
                </div>
                {/* ****************************** */}
                {/* ****************************** */}
                {definicion_CTX_NOTA_VENTA.metodoPago === 'CRÉDITO' && (
                  <div>
                    <input
                      disabled
                      id="Todo en efectivo"
                      type="radio"
                      value="Todo en efectivo"
                      name="Contado"
                      checked={definicion_CTX_NOTA_VENTA.todoEnEfectivo}
                    />
                    <label>Todo en efectivo</label>
                    <br />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '6px 0' }}>
                      {/* <div style={{ display: 'grid', gap: '4px', margin: '6px 0' }}> */}
                      {/* <div style={{ gap: '4px', margin: '6px 0' }}> */}
                      <div>
                        <input
                          disabled
                          id="Una parte en efectivo"
                          type="radio"
                          value="Una parte en efectivo"
                          name="Contado"
                          checked={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        />
                        <label>Una parte en efectivo</label>
                      </div>
                      <input
                        id="inputMontoEnEfectivo"
                        type="number"
                        placeholder="Efectivo"
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.montoEnEfectivo}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <select
                        id="select_contado"
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.otroMedioPago}
                      >
                        <option value={'TRANSF. DE FONDOS - YAPE'}>TRANSF. DE FONDOS - YAPE</option>
                        <option value={'TRANSF. DE FONDOS - PLIN'}>TRANSF. DE FONDOS - PLIN</option>
                        <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                        <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                        <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                      </select>
                      <input
                        id="inputMontoOtroMedioPago"
                        type="number"
                        placeholder="Otro medio"
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.montoOtroMedioPago}
                      />
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------- */}
                {/* ----------------------------------------------------- */}
                {/* ----------------------------------------------------- */}
                {/* TABLA DE CUOTAS DE PAGO venta.verCuotasCredito &&   ctx_PanelVenta.grabo_cuotas_numero &&*/}
                {
                  <div class="form-control">
                    {definicion_CTX_NOTA_VENTA.metodoPago === 'CRÉDITO' && definicion_CTX_NOTA_VENTA.cuotasCredito.length > 0 ? (
                      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter', margin: '4px 0' }}>
                        <thead>
                          <tr>
                            <th>Nro. Cuota</th>
                            <th>Fecha</th>
                            <th>Importe</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {definicion_CTX_NOTA_VENTA.cuotasCredito.map((value: any, index: number) => {
                            const indexItem = index + 1;

                            sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

                            fijarImporteTotalCuotasCredito(sumaCuotas);
                            return (
                              <tr key={value.idAuxiliar} style={{ background: 'BlanchedAlmond' }}>
                                <td data-label="Nro. Cuota" key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                                <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
                                <td data-label="Importe" class="accionesLeft">
                                  {/* {cuota.importeCuotaPEN} */}
                                  {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}`}
                                </td>
                                <td data-label="Acciones" style={{ textAlign: 'center' }}>
                                  <input
                                    type="image"
                                    title="Editar ítem"
                                    alt="icono de editar"
                                    height={14}
                                    width={14}
                                    src={images.edit}
                                    style={{ marginRight: '6px ' }}
                                  />
                                  <input type="image" title="Eliminar ítem" alt="icono de eliminar" height={14} width={14} src={images.trash} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan={2} class="accionesLeft">
                              Suma Cuotas
                            </th>
                            <th colSpan={1} class="accionesLeft">
                              {`${sumaCuotas.toLocaleString('en-PE', {
                                style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </th>
                            <th></th>
                          </tr>
                        </tfoot>
                      </table>
                    ) : definicion_CTX_NOTA_VENTA.verCuotasCredito ? (
                      <i style={{ fontSize: '0.8rem', color: 'red' }}>No existen cuotas de crédito</i>
                    ) : (
                      ''
                    )}
                  </div>
                }
              </>
            ) : (
              ''
            )}
            {definicion_CTX_NOTA_VENTA.metodoPago === 'CONTADO' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '6px 0' }}>
                  {/* <div style={{ display: 'grid', gap: '4px', margin: '6px 0' }}> */}
                  {/* <div style={{ gap: '4px', margin: '6px 0' }}> */}
                  <div>
                    <input
                      id="Una parte en efectivo"
                      type="checkbox"
                      value="Una parte en efectivo"
                      name="Contado"
                      checked={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    />
                    <label for="Una parte en efectivo">Una parte en efectivo</label>
                  </div>
                  <input
                    id="inputMontoEnEfectivo"
                    type="number"
                    placeholder="Efectivo"
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.montoEnEfectivo}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <select
                    id="select_contado"
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.otroMedioPago}
                  >
                    <option value={'TRANSF. DE FONDOS - YAPE'}>TRANSF. DE FONDOS - YAPE</option>
                    <option value={'TRANSF. DE FONDOS - PLIN'}>TRANSF. DE FONDOS - PLIN</option>
                    <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                    <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                    <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                  </select>
                  <input
                    id="inputMontoOtroMedioPago"
                    type="number"
                    placeholder="Otro medio"
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.montoOtroMedioPago}
                  />
                </div>
                <br />
                <div class="linea_1_111">
                  {/* ----------------------------------------------------- */}
                  {/* CLIENTE - SOBRENOMBRE - CHAPA  */}
                  <div>
                    <input
                      disabled
                      id="in_Cliente_Sobrenombre_Chapa"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Cliente / Sobrenombre / Chapa"
                    />
                  </div>
                  <div>
                    <input
                      disabled
                      id="in_Placa"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.placa}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Placa"
                    />
                  </div>
                  <div>
                    <input
                      disabled
                      id="in_Kilometraje"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.kilometraje}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Kilometraje"
                    />
                  </div>
                </div>
              </>
            )}

            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* OBSERVACION */}
          <div>
            {/* OBSERVACION */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  disabled
                  id="in_Observacion"
                  type="text"
                  // tabIndex={1}
                  // autoFocus={true}
                  value={definicion_CTX_NOTA_VENTA.observacion}
                  style={{ width: '100%', background: 'yellow' }}
                  placeholder="Observación"
                />
              </div>
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
        </div>
      </div>
    </div>
  );
});
