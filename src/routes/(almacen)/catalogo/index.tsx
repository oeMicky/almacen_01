import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div
      class="container"
      // style={{
      //   width: '1111px', //SIZES.anchoContenedor + 'px',
      //   height: 'inherit',
      //   color: 'red', //COLORS.lightGray2,
      //   margin: '5px auto',
      //   display: 'inherit',
      //   justifyContent: 'inherit',
      //   alignItems: 'inherit',
      // }}
    >
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem' }}>
          {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`}
        </label>
      </div>
      <h3>
        <u>Catálogo de mercaderías</u>
        {/* <u>Almacén: {parametrosGlobales.nombreAlmacen}</u> */}
      </h3>

      {/* BUSCAR POR */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ margin: ' 0 10px 0  0' }}>Buscar </label>

        <input id="inputCodigoDescripcion" style={{ width: '157px' }} type="text" placeholder="Descripción" />
        {/* <ImgButton
          src={icons.searchPLUS.default}
          alt="Icono de buscar de mercadería"
          height={16}
          width={16}
          title="Buscar datos de mercadería"
          onClick={localizarMercaderias}
        /> */}
      </div>
      {/* boton Adicionar Mercadería */}
      <div>
        {/* <Button className="btn" name="Add Mercadería" onClick={botonAddMercaderia} title="Add mercadería" /> */}
        {/* {showAddEditMercaderia && (
          <Modal
            componente={
              <NewEditMercaderia3
                ancho={'570px'}
                parametrosGlobales={parametrosGlobales}
                inicializacion={inicializarMercaderia}
                // onCerrar={cerrarPanelMercaderia}
                onCerrar={() => setShowAddEditMercaderia(false)}
              />
            }
          />
        )} */}
      </div>
      {/* boton DOWNLOAD */}
      <div id="elDownload" style={{ display: 'none' }}>
        <textarea id="text"></textarea>
        <br />
        {/* <button onClick={trasladarDatos}>Trasladar</button> */}
        <input
          type="button"
          id="btn"
          value="Download"
          //   onClick={() => {
          //     var text = document.getElementById('text').value;
          //     var filename = 'output.txt';
          //     download(filename, text);
          //   }}
        />
      </div>
      {/*  tabla MERCADERIAS */}
      <div style={{ margin: '10px 0' }}>
        {/* <h4>Equivalencias</h4> */}
        {/* {mercaderias.length > 0 ? (
          <TablaMercaderia
            registros={mercaderias}
            onEdit={botonEditMercaderia}
            onDel={botonDeleteMercaderia}
            mostrarEquivalencias={verEquivalencias}
          />
        ) : (
          <i style={{ fontSize: '0.7rem' }}>No existen registros</i>
        )} */}
        {/* {showPanelDeleteMercaderia && (
          <Modal
            componente={
              <DeleteMercaderia
                elId={borrarIdMercaderia}
                descripcion={borrarMercaderia}
                ancho={'300px'}
                onCerrar={cerrarPanelDeleteMercaderia}
              />
            }
          />
        )} */}
        {/* {showEquivalencias && (
          <Modal
            componente={
              <VerEquivalencias
                ancho={'500px'}
                registros={equivalencias}
                unidad={unidad}
                onCerrar={() => setShowEquivalencias(false)}
              />
            }
          />
        )} */}
      </div>
    </div>
  );
});
