import { $, component$, useContext, useSignal, useStyles$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import styleFormulario from '../../../routes/login/login.css?inline';

export default component$(() => {
  useStyles$(styleFormulario);
  //#region CONTEXTOS
  // let documento: any = [];
  // switch (props.contextoParaDocumento) {
  //   case "new_in_almacen":
  //     documento = useContext(CTX_IN_ALMACEN).itemsMercaderias;
  //     break;
  // }

  const ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
  // let ctx: any = [];
  // switch (props.contexto) {
  //   case "buscar_mercaderia_in":
  //     ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
  //     break;
  //   case "kardexs_in":
  //     ctx = useContext(CTX_KARDEXS_IN);
  //     break;
  // }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  // const LosTCPcargados = useSignal([]);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 500px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
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
            // if (props.contexto === "buscar_mercaderia_in") {
            ctx.mostrarPanelMercaderiaINSeleccionada = false;
            // }
            // if (props.contexto === "kardexs_in") {
            // ctx.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = false;
            // }
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* CAMPOS */}
        <div>
          {/* Manufactura unitaria  justify-content: space-between; star  end */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* <div style={{ display: "flex", margin: "4px 0", justifyContent: "space-between" }}> */}
            <div style={{ border: '1px solid blue' }}>
              <label style={{ width: '150px', border: '1px solid red' }}>Código</label>
            </div>

            {/* <input
              id="in_Codigo_MANUFACTURA_UNITARIA"
              style={{ width: "150px" }}
              type="text"
              placeholder="Add manufactura unitaria"
              value={ini.value}
              // onInput$={(e) => {
              //   definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria = (e.target as HTMLInputElement).value.trim().toUpperCase();
              // }}
              // onKeyPress$={(e) => {
              //   if (e.key === "Enter") {
              //     (document.getElementById("in_TiempoManufacturaUnitariaPorHora_MANUFACTURA_UNITARIA") as HTMLInputElement)?.focus();
              //   }
              // }}
            /> */}
            <div style={{ border: '1px solid purple' }}>
              <input
                id="in_Codigo_MANUFACTURA_UNITARIA"
                style={{ width: '150px' }}
                type="text"
                placeholder="Add manufactura unitaria"
                value={ini.value + 1}
                // onInput$={(e) => {
                //   definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria = (e.target as HTMLInputElement).value.trim().toUpperCase();
                // }}
                // onKeyPress$={(e) => {
                //   if (e.key === "Enter") {
                //     (document.getElementById("in_TiempoManufacturaUnitariaPorHora_MANUFACTURA_UNITARIA") as HTMLInputElement)?.focus();
                //   }
                // }}
              />
            </div>
          </div>
        </div>
        {/* GRABAR */}
        <input id="btn_ManufacturaUnitaria_MANUFACTURA_UNITARIA" type="button" />
      </div>
    </div>
  );
});
