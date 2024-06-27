import { component$ } from '@builder.io/qwik';
import { images } from '~/assets';

export default component$(() => {
  return (
    <div class="container">
      {/*  TITULO */}
      <h3 style={{ marginBottom: '5px' }}>
        <u>Parámetros: </u>
      </h3>
      {/* SUB - TITULO: INGRESOS DE MERCADERIAS */}
      <h4 style={{ marginBottom: '5px', border: '1px dashed red' }}>
        <img src={images.almacenIn} width={'20px'} style={{ marginRight: '4px ', left: 0, position: 'absolute' }}></img>
        <label style={{ left: '24px', position: 'relative' }}>Ingresos de mercaderías</label>
      </h4>
      {/* DESDE - HASTA   */}
      <div class="intervalo-fechas">
        <label class="fechas">
          Desde:{' '}
          <input
            id="fechaDesde"
            type="date"
            // value={parametrosBusqueda.fechaInicio}
            // onInput$={(e) => {
            //   parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            // }}
          />
        </label>
        <label class="fechas">
          Hasta:{' '}
          <input
            id="fechaHasta"
            type="date"
            // value={parametrosBusqueda.fechaFinal}
            // onInput$={(e) => {
            //   parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
            // }}
          />
        </label>
        <div class="intervalo-fechas__botonBuscar">
          {/* <ImgButton
            src={images.searchPLUS}
            alt="Icono de busqueda"
            height={16}
            width={16}
            title="Buscar ventas"
            onClick={$(() => {
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('fechaDesde')?.focus();
                return;
              }
              buscarInAlmacen.value++;
            })}
          /> */}
        </div>
      </div>
      {/* ADD INGRESO DE MERCADERIAS */}
      <div>
        {/* <ElButton
          name="ADD INGRESOS DE MERCADERÍAS"
          title="Add un nuevo ingreso de mercaderías"
          onClick={$(async () => {
            let elIgv = await getIgvVenta(parametrosGlobales);
            elIgv = elIgv.data;
            console.log('elIgv', elIgv);
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
            console.log('igv.value::', igv.value);
            definicion_CTX_INDEX_IN_ALMACEN.iNS = [];
            definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelNewInAlmacen = true;
          })}
        /> */}
        {/* {definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelNewInAlmacen && (
          <div class="modal">
            <NewInAlmacen
              inSelecci={definicion_CTX_INDEX_IN_ALMACEN.iNS}
              igv={igv.value}
            />
          </div>
        )} */}
      </div>
      {/*  tabla INGRESOS DE MERCADERIA */}
      <div style={{ margin: '10px 0' }}>
        {/* {buscarInAlmacen.value > 0 ? (
          <TablaInsAlmacen buscarInAlmacen={buscarInAlmacen.value} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ''
        )} */}
      </div>
    </div>
  );
});
